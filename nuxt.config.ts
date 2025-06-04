// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	ssr: false,
	app: {
		head: {
			link: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/logo.jpg',
				},
			],
			meta: [
				{
					name: 'viewport',
					content:
						'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
				},
			],
		},
	},
	modules: ['@nuxt/icon', '@element-plus/nuxt', '@nuxtjs/i18n'],
	css: ['~/assets/css/main.css'],
	i18n: {
		locales: [
			{ code: 'uz', file: 'uz.json' },
			{ code: 'ru', file: 'ru.json' },
		],
		compilation: {
			strictMessage: false,
		},
		detectBrowserLanguage: false,
		lazy: true,
		langDir: 'locales',
		defaultLocale: 'uz',
	},
})
