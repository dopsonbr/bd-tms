export function ConfidenceBadge({ score }: { score: number }) {
  const style = score >= 85 ? 'text-emerald-200 bg-emerald-500/20' : score >= 60 ? 'text-amber-200 bg-amber-500/20' : 'text-rose-200 bg-rose-500/20'

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${style}`}>{score}% confidence</span>
}
