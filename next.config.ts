import path from "node:path"
import type { NextConfig } from "next"

// The node starts this site with the standalone server: it reads PORT and HOSTNAME
// from the environment, which is exactly how the node assigns a port. `next start`
// refuses to run with `output: standalone`, so the passport names the server file.
//
// The ROOT IS THIS FOLDER, named explicitly. Inside a node the site lives in
// AGI-ITEMS/core/root, and Next, seeing the node's lockfile above, took the node for
// the project root and tried to compile the node's own proxy.ts — the build failed
// with "module not found" for files this site never had.
const root = path.resolve(__dirname)

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: root,
  turbopack: { root },
}

export default nextConfig
