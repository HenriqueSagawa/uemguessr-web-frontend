export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters).toLocaleString("pt-BR")} m`;
  }
  return `${(meters / 1000).toFixed(2).replace(".", ",")} km`;
}

export function formatScore(value: number): string {
  return Math.round(value).toLocaleString("pt-BR");
}
