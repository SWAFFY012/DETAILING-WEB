import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { cpSync } from "node:fs"
import { fileURLToPath, URL } from "node:url"

function copyRuntimeMedia() {
  return {
    name: "copy-runtime-media",
    closeBundle() {
      cpSync("assets", "dist/assets", { recursive: true })
      cpSync("video", "dist/video", { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyRuntimeMedia()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { host: "127.0.0.1", port: 8080 },
})
