import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { SQLiteItemRepository } from "./itemRepository";

export function useItemRepository(): SQLiteItemRepository {
  const database = useSQLiteContext();
  return useMemo(() => new SQLiteItemRepository(database), [database]);
}
