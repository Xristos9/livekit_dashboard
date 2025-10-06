export default defineNuxtRouteMiddleware((to) => {
  const allowedPaths = ['/', '/auth/login']
  const normalizedPath = to.path.toLowerCase()

  if (allowedPaths.includes(normalizedPath)) {
    return
  }

  const userCookie = useCookie<string | null>('user')
  const sessionCookie = useCookie<string | null>('session')
  const hasUser = Boolean(
    userCookie.value && userCookie.value !== 'null' && userCookie.value !== 'undefined'
  )
  const hasSession = Boolean(
    sessionCookie.value && sessionCookie.value !== 'null' && sessionCookie.value !== 'undefined'
  )

  if (!hasUser && !hasSession) {
    return navigateTo('/')
  }
})
