export function advanceIso(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

export function minutesBetween(earlierIso: string, laterIso: string): number {
  return Math.floor((new Date(laterIso).getTime() - new Date(earlierIso).getTime()) / 60_000)
}
