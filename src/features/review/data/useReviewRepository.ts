import { useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { SQLiteReviewRepository } from "./reviewRepository";

export function useReviewRepository(): SQLiteReviewRepository {
  const database = useSQLiteContext();
  return useMemo(() => new SQLiteReviewRepository(database), [database]);
}
