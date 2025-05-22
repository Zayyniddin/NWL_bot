import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: 'http://10.20.11.16:8090/',
  })

  return {
    provide: {
      axios: instance
    }
  }
})
