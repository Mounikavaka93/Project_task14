import { useToast } from '../context/ToastContext'

const styles = {
  success: 'border-success/30 bg-ink text-white',
  error: 'border-nonveg/40 bg-ink text-white',
  info: 'border-brand/40 bg-ink text-white',
}

export default function ToastViewport() {
  const { toasts, dismiss } = useToast()

  if (!toasts.length) return null

  return (
    <div
      className="pointer-events-none fixed bottom-24 left-1/2 z-[80] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className={`pointer-events-auto animate-toast-in rounded-xl border px-4 py-3 text-left text-sm font-medium shadow-lg ${
            styles[toast.type] || styles.info
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}
