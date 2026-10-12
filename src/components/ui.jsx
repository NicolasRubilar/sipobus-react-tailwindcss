import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`glass rounded-3xl p-6 shadow-2xl shadow-black/30 sm:p-8 ${className}`} {...props}>
      {children}
    </div>
  )
}

/** Label + input/select/textarea + mensaje de error, con los ids conectados. */
export function Field({ label, error, hint, as: Componente = 'input', className = '', children, ...props }) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium tracking-wide text-white/70">
        {label}
      </label>
      <Componente
        id={id}
        className={`field ${error ? 'border-red-400/70 focus:border-red-400 focus:ring-red-400/25' : ''} ${
          Componente === 'textarea' ? 'min-h-28 resize-y' : ''
        }`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {children}
      </Componente>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-white/40">{hint}</p>
      )}
    </div>
  )
}

export function Badge({ tono = 'neutral', children }) {
  const tonos = {
    ok: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/30',
    error: 'bg-red-400/15 text-red-200 ring-red-300/30',
    neutral: 'bg-white/10 text-white/70 ring-white/15',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${tonos[tono]}`}>
      {children}
    </span>
  )
}

export function Modal({ abierto, onCerrar, titulo, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (abierto && !dialog.open) dialog.showModal()
    if (!abierto && dialog.open) dialog.close()
  }, [abierto])

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-3xl border border-white/10 bg-ink-900 p-0 text-white shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            className="grid size-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}

/**
 * Imagen responsiva generada por vite-imagetools: el navegador elige
 * AVIF o WebP y el ancho justo según `sizes`, en vez de bajar siempre el original.
 */
export function Foto({ foto, sizes, alt = '', ...props }) {
  return (
    <picture>
      {Object.entries(foto.sources).map(([formato, srcSet]) => (
        <source key={formato} type={`image/${formato}`} srcSet={srcSet} sizes={sizes} />
      ))}
      <img src={foto.img.src} width={foto.img.w} height={foto.img.h} alt={alt} decoding="async" {...props} />
    </picture>
  )
}
