import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { SQLiteBackupRepository } from "./backupRepository";

export function useBackupRepository(): SQLiteBackupRepository { const database = useSQLiteContext(); return useMemo(() => new SQLiteBackupRepository(database), [database]); }
