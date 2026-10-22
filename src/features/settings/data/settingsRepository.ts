import type { SQLiteDatabase } from "expo-sqlite";

import { DEFAULT_SETTINGS, parseSettings, type AppSettings } from "../domain/settings";

const SETTINGS_KEY = "app_preferences";

export class SQLiteSettingsRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async get(): Promise<AppSettings> {
    const row = await this.database.getFirstAsync<{ value_json: string }>("SELECT value_json FROM settings WHERE key = ?", SETTINGS_KEY);
    if (!row) return DEFAULT_SETTINGS;
    try { return parseSettings(JSON.parse(row.value_json)); } catch { return DEFAULT_SETTINGS; }
  }

  async save(settings: AppSettings): Promise<AppSettings> {
    const value = parseSettings(settings);
    await this.database.runAsync("INSERT INTO settings (key, value_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at", SETTINGS_KEY, JSON.stringify(value), new Date().toISOString());
    return value;
  }
}
