import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import DefaultOptions from "unplugin-vue-define-options/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), DefaultOptions()],
  build: {
    outDir: "../"
  }
});
