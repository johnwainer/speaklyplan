
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  className?: string
  text?: string
}

export function LoadingSpinner({ className = '', text }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
