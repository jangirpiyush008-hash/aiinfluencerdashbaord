import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        siya: '#ec9dc0',
        kiara: '#e11d48',
        mia: '#0ea5e9',
        ava: '#a855f7'
      }
    }
  },
  plugins: []
}
export default config
