import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler((event) => {
  setCookie(event, 'session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  setCookie(event, 'user', '', {
    path: '/',
    maxAge: 0,
  })
  return { success: true }
})
