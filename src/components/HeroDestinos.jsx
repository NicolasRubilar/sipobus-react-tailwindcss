import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { DESTINOS } from '../lib/destinos'
import { Foto } from './ui'

const INTERVALO_MS = 7000

export default function HeroDestinos() {
  const [activo, setActivo] = useState(0)
  const [pausado, setPausado] = useState(false)
  // Solo se montan (y descargan) las fotos ya vistas más la siguiente, no las 8 de golpe
  const [montadas, setMontadas] = useState(() => new Set([0]))
  const tiraRef = useRef(null)
  const destino = DESTINOS[activo]

  const ir = useCallback((indice) => {
    setActivo((indice + DESTINOS.length) % DESTINOS.length)
  }, [])

  // Avance automático (se detiene al interactuar o si el usuario prefiere menos movimiento)
  useEffect(() => {
    if (pausado || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => ir(activo + 1), INTERVALO_MS)
    return () => clearTimeout(id)
  }, [activo, pausado, ir])

  // Monta la foto activa y, con la página ya cargada, precarga la siguiente
  useEffect(() => {
    setMontadas((s) => (s.has(activo) ? s : new Set(s).add(activo)))
    const siguiente = (activo + 1) % DESTINOS.length
    const id = setTimeout(() => setMontadas((s) => (s.has(siguiente) ? s : new Set(s).add(siguiente))), 2500)
    return () => clearTimeout(id)
  }, [activo])

  // Mantiene la tarjeta activa visible dentro de la tira, sin mover la página
  useEffect(() => {
    const tira = tiraRef.current
    const tarjeta = tira?.children[activo]
    if (!tira || !tarjeta) return
    const izquierda = tarjeta.offsetLeft - tira.offsetLeft
    const derecha = izquierda + tarjeta.offsetWidth
    if (izquierda < tira.scrollLeft || derecha > tira.scrollLeft + tira.clientWidth) {
      tira.scrollTo({ left: izquierda - 8, behavior: 'smooth' })
    }
  }, [activo])

  return (
    <section
      className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden pt-28 pb-10 sm:pb-14"
      aria-roledescription="carrusel"
      aria-label="Destinos destacados"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {/* Fondos apilados con fundido cruzado */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {DESTINOS.map(
          (d, i) =>
            montadas.has(i) && (
              <Foto
                key={d.id}
                foto={d.imagen}
                sizes="100vw"
                fetchPriority={i === 0 ? 'high' : 'low'}
                className={`absolute inset-0 size-full object-cover transition-[opacity,transform] ease-out ${
                  i === activo ? 'scale-105 opacity-100 duration-[1200ms,8000ms]' : 'scale-100 opacity-0 duration-[1200ms,0ms]'
                }`}
              />
            ),
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/45 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/50" />
      </div>

      {destino.credito && (
        <a
          href={destino.credito.url}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 bottom-2 text-[10px] text-white/35 hover:text-white/70 sm:right-6"
        >
          Foto: {destino.credito.autor} · {destino.credito.licencia}
        </a>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div key={destino.id} className="max-w-2xl" aria-live="polite">
          <p className="animate-fade-up text-xs font-medium tracking-[0.3em] text-white/75 uppercase">
            SipoBus · {destino.region}
          </p>
          <h1
            className="mt-4 animate-fade-up font-display text-5xl leading-[0.95] font-black tracking-tight text-balance uppercase drop-shadow-lg [animation-delay:80ms] sm:text-6xl lg:text-7xl"
          >
            {destino.nombre}
          </h1>
          <p className="mt-6 max-w-md animate-fade-up text-sm leading-relaxed text-white/80 [animation-delay:160ms] sm:text-[15px]">
            {destino.descripcion}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-10">
          <div className="shrink-0 lg:w-56 lg:self-start">
            <Link
              to="/comprar"
              state={{ destino: destino.nombre }}
              className="btn btn-primary group"
            >
              Viajar a {destino.nombre}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-end gap-3">
              <span className="mr-auto font-display text-sm font-bold tabular-nums text-white/60 lg:mr-0">
                <span className="text-white">{String(activo + 1).padStart(2, '0')}</span> /{' '}
                {String(DESTINOS.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => ir(activo - 1)}
                className="glass grid size-10 place-items-center rounded-full transition hover:bg-white/20 active:scale-95"
                aria-label="Destino anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => ir(activo + 1)}
                className="glass grid size-10 place-items-center rounded-full transition hover:bg-white/20 active:scale-95"
                aria-label="Destino siguiente"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div
              ref={tiraRef}
              className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pt-2 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {DESTINOS.map((d, i) => {
                const esActivo = i === activo
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => ir(i)}
                    aria-label={`Ver ${d.nombre}`}
                    aria-current={esActivo ? 'true' : undefined}
                    className={`group relative aspect-[3/4] w-32 shrink-0 snap-start overflow-hidden rounded-2xl text-left shadow-xl shadow-black/40 transition duration-300 sm:w-36 ${
                      esActivo
                        ? '-translate-y-1.5 ring-2 ring-white'
                        : 'ring-1 ring-white/15 hover:-translate-y-1 hover:ring-white/40'
                    }`}
                  >
                    <Foto
                      foto={d.imagen}
                      sizes="144px"
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <span className="absolute inset-x-3 bottom-3">
                      <span className="block text-sm leading-tight font-semibold">{d.nombre}</span>
                      <span className="mt-0.5 block text-[10px] text-white/65">{d.region.replace(/^Región (del? )?/, '')}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
