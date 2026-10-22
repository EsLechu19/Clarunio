import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import { initializeDatabase } from "@/src/features/items/data/migrations";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="clarunio.db" onInit={initializeDatabase}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
