import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { SQLiteDataRepository } from "./dataRepository";
export function useDataRepository(): SQLiteDataRepository { const database = useSQLiteContext(); return useMemo(() => new SQLiteDataRepository(database), [database]); }
