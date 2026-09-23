import type { ReactNode } from "react"

export const metadata = {
  title: "Site",
  description: "The site of this node.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
