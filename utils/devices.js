export function isAndroid (testInfo) {
  return testInfo?.project?.name?.toLowerCase().includes('android')
}
