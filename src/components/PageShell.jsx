import { DESTINOS } from '../lib/destinos'
import { Foto } from './ui'

/**
 * Contenedor de las páginas internas: fondo con una foto de destino desenfocada
 * para mantener la estética del hero, título y contenido centrado.
 */
export default function PageShell({ eyebrow, titulo, descripcion, fondo = DESTINOS[1].imagen, ancho = 'max-w-3xl', children }) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden pt-28 pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* Va desenfocada, así que basta la versión más chica (sizes="320px") */}
        <Foto foto={fondo} sizes="320px" className="size-full scale-110 object-cover opacity-35 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/85 to-ink-950" />
      </div>

      <div className={`mx-auto px-4 sm:px-6 ${ancho}`}>
        {(eyebrow || titulo) && (
          <header className="mb-8 animate-fade-up">
            {eyebrow && (
              <p className="text-xs font-medium tracking-[0.25em] text-brand-300 uppercase">{eyebrow}</p>
            )}
            {titulo && (
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-balance uppercase sm:text-4xl">
                {titulo}
              </h1>
            )}
            {descripcion && <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">{descripcion}</p>}
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
