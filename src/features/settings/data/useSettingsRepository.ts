import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { SQLiteSettingsRepository } from "./settingsRepository";

export function useSettingsRepository(): SQLiteSettingsRepository {
  const database = useSQLiteContext();
  return useMemo(() => new SQLiteSettingsRepository(database), [database]);
}
