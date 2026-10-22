import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { SQLiteSearchRepository } from "./searchRepository";

export function useSearchRepository(): SQLiteSearchRepository {
  const database = useSQLiteContext();
  return useMemo(() => new SQLiteSearchRepository(database), [database]);
}
