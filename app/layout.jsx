import '../styles/globals.css'


export const metadata = {
  title: 'Analysis',
  description: 'Generated Analysis on Sales DataSet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
