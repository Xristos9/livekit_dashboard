export default defineNuxtRouteMiddleware(() => {
  const userCookie = useCookie<string | null>('user')
  if (!userCookie.value) {
    return navigateTo('/')
  }

  let parsed: any
  try {
    parsed = JSON.parse(userCookie.value)
  } catch (error) {
    console.error('Failed to parse user cookie for admin middleware', error)
  }

  // const isAdmin =
  //   parsed &&
  //   (parsed.isAdmin === true || String(parsed.role || '').toLowerCase() === 'admin')

  // if (!isAdmin) {
  //   return navigateTo('/dashboard')
  // }
})
