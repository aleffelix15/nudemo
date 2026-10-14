import { useState } from 'react'
import darkScreenImg from '../assets/app-dark-screen.jpg'
import ecosystemImg from '../assets/app-light-and-card-ref.jpg'

export default function Phone({
  screen = 'dark', // 'dark' | 'ecosystem' | 'custom'
  src,
  dark = true,
  className = '',
  alt = 'Tela do aplicativo Nubank',
}) {
  const [loaded, setLoaded] = useState(false)

  const imageSrc = src || (screen === 'ecosystem' ? ecosystemImg : darkScreenImg)

  return (
    <div className={`phone ${dark ? 'phone-dark' : ''} ${className}`}>
      {/* Dynamic Island / Notch do chassi */}
      <div className="phone-notch" aria-hidden="true" />
      
      {/* Display do celular com recorte milimétrico das bordas */}
      <div className="phone-screen phone-screen-media">
        <div className="phone-media-frame">
          <img
            src={imageSrc}
            alt={alt}
            className={`phone-display-img ${screen === 'ecosystem' ? 'phone-display-eco' : 'phone-display-dark'} ${loaded ? 'is-loaded' : ''}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  )
}
