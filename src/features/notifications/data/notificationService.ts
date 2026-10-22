import * as Notifications from "expo-notifications";
import { shouldEnableNotifications } from "./notificationPolicy";

export async function enableNotifications(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  const result = current.granted ? current : await Notifications.requestPermissionsAsync();
  return shouldEnableNotifications(result.granted || result.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
}

export async function scheduleExplicitReminder(title: string, date: Date): Promise<string | null> {
  if (!(await enableNotifications())) return null;
  return Notifications.scheduleNotificationAsync({ content: { title: "Recordatorio de Clarunio", body: title }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date } });
}
