export function isMobileDevice (testInfo) {
  const name = testInfo?.project?.name?.toLowerCase() || ''
  return name.includes('android') || name.includes('ios')
}
