import { useAppStore } from '@/state/app-store'

const PROMPTS = ['What exceptions need action?', 'Plan tomorrow capacity', 'Summarize current risk']

export function AiPromptChips() {
  const { dispatch } = useAppStore()

  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => dispatch({ type: 'chat-user-message', payload: prompt })}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
