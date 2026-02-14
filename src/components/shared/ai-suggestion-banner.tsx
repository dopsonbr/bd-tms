import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type AiSuggestionBannerProps = {
  text: string
  className?: string
}

export function AiSuggestionBanner({
  text,
  className,
}: AiSuggestionBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg bg-freight-ai/10 p-4',
        className,
      )}
      data-slot="ai-suggestion-banner"
    >
      <Sparkles className="size-5 shrink-0 text-freight-ai" />
      <p className="text-sm text-freight-ai">{text}</p>
    </div>
  )
}
