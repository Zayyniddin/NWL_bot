// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
  ssr: false,
	app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.jpg' 
        }
      ],
			 meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        }
      ]
    }
  },
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
