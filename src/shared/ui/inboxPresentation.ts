export function formatRelativeCaptureDate(createdAt: string, now: Date): string {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return "Fecha no disponible";

  const elapsed = now.getTime() - created.getTime();
  if (elapsed >= 0 && elapsed < 60 * 60 * 1000) return "Ahora";

  const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate()).getTime();
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const daysAgo = Math.round((currentDay - createdDay) / (24 * 60 * 60 * 1000));
  if (daysAgo === 1) return "Ayer";

  if (elapsed >= 0 && elapsed < 24 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(elapsed / (60 * 60 * 1000)));
    return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  const options: Intl.DateTimeFormatOptions = created.getFullYear() === now.getFullYear()
    ? { day: "numeric", month: "short" }
    : { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("es-AR", options).format(created);
}
