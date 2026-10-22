import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { SQLiteProjectRepository } from "./projectRepository";

export function useProjectRepository(): SQLiteProjectRepository {
  const database = useSQLiteContext();
  return useMemo(() => new SQLiteProjectRepository(database), [database]);
}
