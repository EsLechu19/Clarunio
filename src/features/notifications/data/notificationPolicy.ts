export function isExpoGoAndroid(platform: string, appOwnership: string | null | undefined): boolean {
  return platform === "android" && appOwnership === "expo";
}

export function shouldEnableNotifications(granted: boolean): boolean {
  return granted;
}
