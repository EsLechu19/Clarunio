export const PROJECT_STATUSES = ["ACTIVE", "SOMEDAY", "COMPLETED", "ARCHIVED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
  id: string;
  desiredOutcome: string;
  notes?: string | null;
  status: ProjectStatus;
  blockedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
};
