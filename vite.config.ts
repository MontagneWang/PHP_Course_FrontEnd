import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
			}
		}
	}
})
