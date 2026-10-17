const puppeteer = require('puppeteer-core')
const fs = require('fs')

const EDGE_PATH =
  process.env.CHROME_PATH ||
  (fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
    ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')

const URL = 'http://localhost:5173'

const INIT_SCRIPT = `
window.__metrics = {
  fcp: null,
  lcp: null,
  cls: 0,
  longTasks: [],
  resources: []
};
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        window.__metrics.fcp = Math.round(entry.startTime);
      }
    }
  }).observe({ type: 'paint', buffered: true });
} catch (e) {}

try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__metrics.lcp = Math.round(entry.startTime);
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
} catch (e) {}

try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        window.__metrics.cls += entry.value;
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });
} catch (e) {}

try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__metrics.longTasks.push({
        start: Math.round(entry.startTime),
        duration: Math.round(entry.duration)
      });
    }
  }).observe({ type: 'longtask', buffered: true });
} catch (e) {}
`

async function measure() {
  console.log(`Connecting to ${URL}...`)
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
    console.log('--- TESTE LOCAL: MOBILE (390x844, CPU 4x) ---')
    const mobileResults = []
    for (let i = 0; i < 3; i++) {
      const page = await browser.newPage()
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
      await page.evaluateOnNewDocument(INIT_SCRIPT)
      const cdp = await page.target().createCDPSession()
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })
      await new Promise((r) => setTimeout(r, 4000))

      const metrics = await page.evaluate(() => {
        const m = window.__metrics
        const paintEntries = performance.getEntriesByType('paint')
        let fcp = m.fcp
        for (const p of paintEntries) {
          if (p.name === 'first-contentful-paint') fcp = Math.round(p.startTime)
        }
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
        let lcp = m.lcp
        if (lcpEntries.length > 0) {
          lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime)
        }
        const resources = performance.getEntriesByType('resource').map(r => ({
          name: r.name.split('/').pop().split('?')[0],
          size: r.transferSize,
          duration: Math.round(r.duration),
          type: r.initiatorType
        }))
        return { ...m, fcp, lcp, resources }
      })

      const totalTbt = metrics.longTasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0)
      const maxLt = metrics.longTasks.reduce((max, t) => Math.max(max, t.duration), 0)

      mobileResults.push({
        run: i + 1,
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        cls: Number(metrics.cls.toFixed(3)),
        longTasksCount: metrics.longTasks.length,
        maxLongTask: maxLt,
        tbt: totalTbt,
        resourceCount: metrics.resources.length,
      })
      await page.close()
    }
    console.log('Resultados Mobile (3 runs):', JSON.stringify(mobileResults, null, 2))

    console.log('\n--- TESTE LOCAL: DESKTOP (1280x800, no throttle) ---')
    const desktopResults = []
    for (let i = 0; i < 3; i++) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
      await page.evaluateOnNewDocument(INIT_SCRIPT)

      await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 })
      await new Promise((r) => setTimeout(r, 3000))

      const metrics = await page.evaluate(() => {
        const m = window.__metrics
        const paintEntries = performance.getEntriesByType('paint')
        let fcp = m.fcp
        for (const p of paintEntries) {
          if (p.name === 'first-contentful-paint') fcp = Math.round(p.startTime)
        }
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
        let lcp = m.lcp
        if (lcpEntries.length > 0) {
          lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime)
        }
        const resources = performance.getEntriesByType('resource').map(r => ({
          name: r.name.split('/').pop().split('?')[0],
          size: r.transferSize,
          duration: Math.round(r.duration),
          type: r.initiatorType
        }))
        return { ...m, fcp, lcp, resources }
      })

      const totalTbt = metrics.longTasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0)
      const maxLt = metrics.longTasks.reduce((max, t) => Math.max(max, t.duration), 0)

      desktopResults.push({
        run: i + 1,
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        cls: Number(metrics.cls.toFixed(3)),
        longTasksCount: metrics.longTasks.length,
        maxLongTask: maxLt,
        tbt: totalTbt,
      })
      await page.close()
    }
    console.log('Resultados Desktop (3 runs):', JSON.stringify(desktopResults, null, 2))

  } finally {
    await browser.close()
  }
}

measure().catch(console.error)
