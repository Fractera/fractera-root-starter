import type { NextConfig } from "next"

// The node starts this site with the standalone server: it reads PORT and HOSTNAME
// from the environment, which is exactly how the node assigns a port. `next start`
// refuses to run with `output: standalone`, so the passport names the server file.
const nextConfig: NextConfig = {
  output: "standalone",
}

export default nextConfig
