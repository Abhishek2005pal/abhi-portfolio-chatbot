import './globals.css'

export const metadata = {
  title: 'Modern Portfolio',
  description: 'A modern portfolio website showcasing skills and projects',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}