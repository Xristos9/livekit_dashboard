export function useCurrentUser() {
  return useCookie<Record<string, any>>('user')
}
