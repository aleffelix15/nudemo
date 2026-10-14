// Ícones de interface com função real (linha única, 1.6px)
export const NU_SVG_PATH =
  'M7.2795 5.4336c-1.1815 0-2.1846.4628-2.9432 1.252h-.002c-.0541-.0022-.1074-.002-.162-.002-1.5436 0-2.9925.8835-3.699 2.2559-.3088.5996-.4234 1.2442-.459 1.9003-.0321.589 0 1.1863 0 1.7696v5.6523H3.184s.0022-2.784 0-5.1777c-.0014-1.6112-.0118-3.0471 0-3.3418.056-1.3937.4372-2.3053 1.1484-3.0508 2.3585.0018 3.8852 1.6091 3.9705 4.168.0196.5874.0254 3.7304.0254 3.7304v3.672h3.1678v-4.965c0-1.5007.0127-2.8006-.0918-3.6952-.292-2.5-1.821-4.168-4.1248-4.168zm8.3903.3008l-3.166.0039v4.9648c0 1.5009-.0127 2.8007.0919 3.6953.2921 2.5001 1.821 4.168 4.1248 4.168 1.1815 0 2.1846-.4628 2.9432-1.252.0003-.0003.0016.0004.002 0 .0542.0023.1093.002.164.002 1.5435 0 2.9905-.8835 3.6971-2.2558.3088-.5997.4233-1.2442.459-1.9004.032-.5889 0-1.1862 0-1.7695V5.7383H20.816s-.0022 2.784 0 5.1777c.0015 1.6113.0119 3.047 0 3.3418-.056 1.3935-.4372 2.3053-1.1483 3.0508-2.3586-.0018-3.8853-1.6091-3.9706-4.168-.0196-.5874-.0273-2.0437-.0273-3.7324Z'

const P = {
  bank: 'M3 10 12 4l9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 3h18',
  pix: 'm12 3 4.5 4.5L12 12 7.5 7.5 12 3Zm0 9 4.5 4.5L12 21l-4.5-4.5L12 12Zm-9 0 4.5-4.5M21 12l-4.5 4.5',
  lock: 'M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5v-9Zm7 3v3',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'm20 20-4-4m1-5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  apple: 'M16 12.5c0-2 1.6-2.9 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7s-1.600-.7-2.600-.7C7.800 7.900 6 9.100 6 11.700c0 3 2.200 6.300 3.800 6.300.800 0 1.300-.5 2.400-.5s1.500.5 2.400.5c1.700 0 3-2.800 3.300-3.800-.1 0-2-.8-2-2.700ZM14 5.800c.6-.7 1-1.700.9-2.800-.9 0-2 .6-2.600 1.300-.6.600-1.100 1.600-.9 2.600 1 .1 2-.5 2.600-1.100Z',
  play: 'M6 4v16l14-8L6 4Z',
  barcode: 'M3 5v14M6 5v14M9 5v14M13 5v14M16 5v14M18 5v14M21 5v14',
  loan: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  chevron: 'M9 18l6-6-6-6',
  transfer: 'M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4',
}

export default function Icon({ name, size = 20, className = '', fill = false }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={P[name]} />
    </svg>
  )
}

// Logotipo vetorial oficial do Nubank reproduzindo a fita contínua
export function NuLogo({ size = 32, width, height, className = '', color = 'currentColor', title = 'Nubank' }) {
  const w = width || size
  const h = height || size
  return (
    <svg
      className={`nu-logo-svg ${className}`}
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d={NU_SVG_PATH} />
    </svg>
  )
}

export function NuMark({ className = '', size = 32, color }) {
  return (
    <span className={`numark-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <NuLogo size={size} color={color || 'var(--nu)'} />
    </span>
  )
}
