import Constants from "expo-constants";
import { Platform } from "react-native";

import { shouldEnableNotifications } from "./notificationPolicy";
import { isExpoGoAndroid } from "./notificationPolicy";

function notificationsUnavailableInExpoGo(): boolean {
  return isExpoGoAndroid(Platform.OS, Constants.appOwnership);
}

export async function enableNotifications(): Promise<boolean> {
  if (notificationsUnavailableInExpoGo()) return false;

  try {
    const Notifications = await import("expo-notifications");
    const current = await Notifications.getPermissionsAsync();
    const result = current.granted ? current : await Notifications.requestPermissionsAsync();
    return shouldEnableNotifications(result.granted || result.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
  } catch {
    return false;
  }
}

export async function scheduleExplicitReminder(title: string, date: Date): Promise<string | null> {
  if (notificationsUnavailableInExpoGo()) return null;

  try {
    if (!(await enableNotifications())) return null;
    const Notifications = await import("expo-notifications");
    return await Notifications.scheduleNotificationAsync({ content: { title: "Recordatorio de Clarunio", body: title }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date } });
  } catch {
    return null;
  }
}
