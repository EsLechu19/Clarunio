import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import { initializeDatabase } from "@/src/features/items/data/migrations";
import { ThemeProvider } from "@/src/shared/theme/ThemeProvider";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="clarunio.db" onInit={initializeDatabase}>
      <ThemeProvider><Stack screenOptions={{ headerShown: false }} /></ThemeProvider>
    </SQLiteProvider>
  );
}
