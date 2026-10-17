import { LazyMotion, domAnimation } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import Cards from './components/Cards'
import Track from './components/Track'
import Easy from './components/Easy'
import Steps from './components/Steps'
import AppSection from './components/AppSection'
import Benefits from './components/Benefits'
import Footer from './components/Footer'
import { DemoProvider } from './lib/demo'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <DemoProvider>
        <a className="skip" href="#cartoes">
          Pular para o conteúdo
        </a>
        <Header />
        <main>
          <div className="light">
            <Hero />
            <Cards />
            <Track />
          </div>
          <div className="dark">
            <Easy />
            <Steps />
            <AppSection />
            <Benefits />
          </div>
        </main>
        <Footer />
      </DemoProvider>
    </LazyMotion>
  )
}
