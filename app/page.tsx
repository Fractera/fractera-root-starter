// The home page is static on purpose: prerendered, readable without JavaScript,
// and visible to search engines. The public pages of the node move here in a later
// version; until then this page only proves the site is alive on its own port.
export default function Home() {
  return (
    <main>
      <h1>Site</h1>
      <p>This site runs as its own element of the node, on its own port.</p>
    </main>
  )
}
