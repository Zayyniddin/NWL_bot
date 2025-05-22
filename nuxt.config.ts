// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
  ssr: false,
	modules: ['@nuxt/icon', '@element-plus/nuxt'],
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()],
		server: {
			allowedHosts: [
			"aadc-94-158-63-77.ngrok-free.app",
			],
		},
	},
})
