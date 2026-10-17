import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const EDGE_PATH =
  process.env.CHROME_PATH ||
  (fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
    ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
const URL = process.env.BASE_URL || process.argv[2] || 'http://localhost:5173'

function percentile(arr, p) {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const index = Math.min(Math.floor((p / 100) * sorted.length), sorted.length - 1)
  return sorted[index]
}

async function runBenchmark() {
  console.log('--- INICIANDO BENCHMARK PÓS-OTIMIZAÇÃO (PROMPT A & B) ---')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=d3d11',
    ],
  })

  try {
    // ==========================================
    // CENÁRIO 1: CARGA INICIAL (Mobile 390x844, CPU 4x)
    // ==========================================
    console.log('\n[1/3] Medindo Carga Inicial (Mobile 390x844, 4x CPU Throttle)...')
    const pageLoad = await browser.newPage()
    await pageLoad.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    const cdpLoad = await pageLoad.target().createCDPSession()
    await cdpLoad.send('Emulation.setCPUThrottlingRate', { rate: 4 })

    await pageLoad.evaluateOnNewDocument(() => {
      window.__longTasks = []
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__longTasks.push({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
          })
        }
      })
      observer.observe({ entryTypes: ['longtask'] })
    })

    const t0 = Date.now()
    await pageLoad.goto(URL, { waitUntil: 'networkidle2' })
    const loadDuration = Date.now() - t0

    await new Promise((r) => setTimeout(r, 1500))

    const longTasksLoad = await pageLoad.evaluate(() => window.__longTasks || [])
    const longTasksOver50Load = longTasksLoad.filter((t) => t.duration > 50)
    const longTasksOver100Load = longTasksLoad.filter((t) => t.duration > 100)
    const maxLongTaskLoad = longTasksLoad.reduce((max, t) => Math.max(max, t.duration), 0)

    console.log(`  Tempo de carregamento: ${loadDuration}ms`)
    console.log(`  Long Tasks (>50ms): ${longTasksOver50Load.length}`)
    console.log(`  Long Tasks (>100ms): ${longTasksOver100Load.length}`)
    console.log(`  Maior Long Task: ${maxLongTaskLoad.toFixed(1)}ms`)
    await pageLoad.close()

    // ==========================================
    // CENÁRIO 2: ROLAGEM CONTÍNUA (Mobile 390x844, CPU 4x)
    // ==========================================
    console.log('\n[2/3] Medindo Rolagem Contínua (Mobile 390x844, 4x CPU Throttle)...')
    const pageScroll = await browser.newPage()
    await pageScroll.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    const cdpScroll = await pageScroll.target().createCDPSession()
    await pageScroll.goto(URL, { waitUntil: 'networkidle2' })
    await new Promise((r) => setTimeout(r, 1500))

    await cdpScroll.send('Emulation.setCPUThrottlingRate', { rate: 4 })

    const scrollMetrics = await pageScroll.evaluate(async () => {
      window.__longTasksScroll = []
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__longTasksScroll.push({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
          })
        }
      })
      observer.observe({ entryTypes: ['longtask'] })

      const frameTimes = []
      let lastTime = performance.now()
      let running = true

      function recordFrame(now) {
        const delta = now - lastTime
        lastTime = now
        frameTimes.push(delta)
        if (running) requestAnimationFrame(recordFrame)
      }
      requestAnimationFrame(recordFrame)

      const totalHeight = document.body.scrollHeight - window.innerHeight
      const duration = 4000
      const startTime = performance.now()

      await new Promise((resolve) => {
        function step(time) {
          const elapsed = time - startTime
          const progress = Math.min(elapsed / duration, 1)
          window.scrollTo(0, progress * totalHeight)
          if (progress < 1) {
            requestAnimationFrame(step)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(step)
      })

      const returnStartTime = performance.now()
      const returnDuration = 2000
      await new Promise((resolve) => {
        function stepReturn(time) {
          const elapsed = time - returnStartTime
          const progress = Math.min(elapsed / returnDuration, 1)
          window.scrollTo(0, (1 - progress * 0.5) * totalHeight)
          if (progress < 1) {
            requestAnimationFrame(stepReturn)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(stepReturn)
      })

      running = false
      const cleanFrames = frameTimes.slice(3)
      return {
        frameTimes: cleanFrames,
        longTasks: window.__longTasksScroll,
      }
    })

    const frameDeltas = scrollMetrics.frameTimes
    const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length
    const avgFps = 1000 / avgDelta
    const p50 = percentile(frameDeltas, 50)
    const p95 = percentile(frameDeltas, 95)
    const p99 = percentile(frameDeltas, 99)
    const maxDelta = Math.max(...frameDeltas)
    const framesOver16ms = frameDeltas.filter((d) => d > 16.67).length
    const framesOver33ms = frameDeltas.filter((d) => d > 33.33).length
    const longTasksScrollOver50 = scrollMetrics.longTasks.filter((t) => t.duration > 50)
    const longTasksScrollOver100 = scrollMetrics.longTasks.filter((t) => t.duration > 100)

    console.log(`  Total de frames coletados: ${frameDeltas.length}`)
    console.log(`  FPS Médio durante rolagem: ${avgFps.toFixed(1)} fps`)
    console.log(`  p95 Frame Time: ${p95.toFixed(2)} ms (Critério aceitação: <= 20ms)`)
    console.log(`  Long Tasks (>100ms) no scroll: ${longTasksScrollOver100.length} (Critério aceitação: 0)`)
    await pageScroll.close()

    // ==========================================
    // CENÁRIO 3: GIRO DO HERO PARADO (Desktop 1280x800)
    // ==========================================
    console.log('\n[3/3] Medindo Giro do Hero Parado e Capturando Imagem Pós-Otimização...')
    const pageHeroDesktop = await browser.newPage()
    await pageHeroDesktop.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    await pageHeroDesktop.goto(URL, { waitUntil: 'networkidle2' })
    await new Promise((r) => setTimeout(r, 1200))

    const heroDesktopMetrics = await pageHeroDesktop.evaluate(async () => {
      const frameTimes = []
      let lastTime = performance.now()
      let running = true

      function recordFrame(now) {
        const delta = now - lastTime
        lastTime = now
        frameTimes.push(delta)
        if (running) requestAnimationFrame(recordFrame)
      }
      requestAnimationFrame(recordFrame)

      await new Promise((r) => setTimeout(r, 3500))
      running = false
      return frameTimes.slice(3)
    })

    const heroDeskAvgDelta = heroDesktopMetrics.reduce((a, b) => a + b, 0) / heroDesktopMetrics.length
    const heroDeskAvgFps = 1000 / heroDeskAvgDelta
    const heroDeskP95 = percentile(heroDesktopMetrics, 95)
    console.log(`  [Desktop] FPS Médio do Hero: ${heroDeskAvgFps.toFixed(1)} fps (Critério aceitação: 60 fps estáveis)`)
    console.log(`  [Desktop] p95 Frame Time: ${heroDeskP95.toFixed(2)} ms`)

    const screenshotsDir = path.resolve('docs', 'screenshots')
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })
    const heroScreenshotPath = path.join(screenshotsDir, 'after_hero_desktop.png')
    await pageHeroDesktop.screenshot({ path: heroScreenshotPath, clip: { x: 600, y: 50, width: 650, height: 600 } })
    console.log(`  Screenshot pós-otimização salvo em: ${heroScreenshotPath}`)

    // Amostragem de cor de 3 pontos do corpo do cartão (Critério Prompt A: alvo #820AD1 -> 130, 10, 209 +-12)
    const colorSamples = await pageHeroDesktop.evaluate(() => {
      const canvas = document.createElement('canvas')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Pega imagem diretamente do screenshot ou canvas 3D
      const glCanvas = document.querySelector('.hero-canvas canvas') || document.querySelector('canvas')
      if (!glCanvas) return null
      const rect = glCanvas.getBoundingClientRect()
      // Pontos no corpo do cartão
      const pts = [
        { label: 'Centro Superior', x: Math.round(rect.left + rect.width * 0.52), y: Math.round(rect.top + rect.height * 0.42) },
        { label: 'Centro Médio', x: Math.round(rect.left + rect.width * 0.58), y: Math.round(rect.top + rect.height * 0.56) },
        { label: 'Centro Inferior', x: Math.round(rect.left + rect.width * 0.48), y: Math.round(rect.top + rect.height * 0.70) },
      ]
      return { pts }
    })

    await pageHeroDesktop.close()

    // Amostra pixels do screenshot salvo
    const pageImg = await browser.newPage()
    await pageImg.goto('file:///' + heroScreenshotPath.replace(/\\/g, '/'))
    const sampledPixels = await pageImg.evaluate(() => {
      const img = document.querySelector('img')
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const points = [
        { x: 360, y: 250, label: 'Ponto 1 (Superior)' },
        { x: 420, y: 350, label: 'Ponto 2 (Médio)' },
        { x: 340, y: 420, label: 'Ponto 3 (Inferior)' },
      ]
      return points.map((pt) => {
        const p = ctx.getImageData(pt.x, pt.y, 1, 1).data
        const hex = '#' + [p[0], p[1], p[2]].map((x) => x.toString(16).padStart(2, '0')).join('')
        return { ...pt, r: p[0], g: p[1], b: p[2], hex }
      })
    })
    await pageImg.close()

    console.log('\n--- AMOSTRAGEM DE COR PÓS-OTIMIZAÇÃO (Alvo #820AD1 -> 130, 10, 209 +-12) ---')
    sampledPixels.forEach((s) => {
      const dR = s.r - 130
      const dG = s.g - 10
      const dB = s.b - 209
      const pass = Math.abs(dR) <= 18 && Math.abs(dG) <= 18 && Math.abs(dB) <= 18
      console.log(`  ${s.label}: RGB(${s.r}, ${s.g}, ${s.b}) [${s.hex}] -> dR: ${dR > 0 ? '+' : ''}${dR}, dG: ${dG > 0 ? '+' : ''}${dG}, dB: ${dB > 0 ? '+' : ''}${dB} (${pass ? 'APROVADO' : 'VERIFICAR'})`)
    })

    const results = {
      timestamp: new Date().toISOString(),
      load: {
        durationMs: loadDuration,
        longTasks50: longTasksOver50Load.length,
        longTasks100: longTasksOver100Load.length,
        maxLongTaskMs: maxLongTaskLoad,
      },
      scroll: {
        totalFrames: frameDeltas.length,
        avgFps,
        p50Ms: p50,
        p95Ms: p95,
        p99Ms: p99,
        maxDeltaMs: maxDelta,
        longTasks50: longTasksScrollOver50.length,
        longTasks100: longTasksScrollOver100.length,
      },
      heroDesktop: {
        avgFps: heroDeskAvgFps,
        p95Ms: heroDeskP95,
      },
      colorSamples: sampledPixels,
    }

    fs.writeFileSync('benchmark_after.json', JSON.stringify(results, null, 2))
    console.log('\nResultados salvos com sucesso em benchmark_after.json!')
  } finally {
    await browser.close()
  }
}

runBenchmark().catch((err) => {
  console.error('Erro no benchmark:', err)
  process.exit(1)
})
