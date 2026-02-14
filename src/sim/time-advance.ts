import { advanceIso } from './clock'

export function nextSimTime(nowIso: string, minutes: number): string {
  return advanceIso(nowIso, minutes)
}
