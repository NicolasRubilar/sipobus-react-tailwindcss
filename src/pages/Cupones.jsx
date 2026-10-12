import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Copy, Gift, Ticket } from 'lucide-react'
import PageShell from '../components/PageShell'
import { Badge, Card, Field } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const BIENVENIDA = 'BIENVENIDO10'

function BotonCopiar({ codigo }) {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      toast.error('No se pudo copiar el código.')
    }
  }
  return (
    <button
      type="button"
      onClick={copiar}
      className="grid size-9 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
      aria-label={`Copiar ${codigo}`}
    >
      {copiado ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
    </button>
  )
}

export default function Cupones() {
  const { usuario, actualizarUsuario } = useAuth()
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')

  const agregar = (valor) => {
    const cupon = valor.trim().toUpperCase()
    if (!cupon) {
      setError('Ingresa un código.')
      return false
    }
    if (usuario.cupones.includes(cupon)) {
      setError('')
      toast.info('Ya tienes ese cupón guardado.')
      return false
    }
    actualizarUsuario((u) => ({ ...u, cupones: [...u.cupones, cupon] }))
    toast.success(`Cupón ${cupon} agregado.`)
    setError('')
    return true
  }

  const tieneBienvenida = usuario.cupones.includes(BIENVENIDA)

  return (
    <PageShell
      eyebrow="Ahorra en tus viajes"
      titulo="Mis cupones"
      descripcion="Guarda tus códigos aquí y aplícalos en el resumen de compra. Cada cupón da un 10% de descuento y se usa una sola vez."
    >
      {!tieneBienvenida && (
        <div className="relative mb-6 flex flex-col gap-4 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 to-brand-700 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Gift className="mt-0.5 size-6 shrink-0" />
            <div>
              <p className="font-semibold">¡Cupón de bienvenida!</p>
              <p className="mt-1 text-sm text-white/80">
                Agrega <strong>{BIENVENIDA}</strong> y obtén 10% de descuento en tu primer viaje.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => agregar(BIENVENIDA)} className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-200">
            Agregar
          </button>
        </div>
      )}

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (agregar(codigo)) setCodigo('')
          }}
          className="flex items-start gap-3"
        >
          <Field
            label="Agregar un cupón"
            className="flex-1"
            placeholder="Código del cupón"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value)
              setError('')
            }}
            error={error}
            autoCapitalize="characters"
          />
          <button type="submit" className="btn btn-primary mt-[1.375rem]">Agregar</button>
        </form>

        <h2 className="mt-8 text-sm font-semibold text-white/60">Tus cupones</h2>
        {usuario.cupones.length ? (
          <ul className="mt-3 space-y-2">
            {usuario.cupones.map((c) => {
              const usado = usuario.cuponesUsados.includes(c)
              return (
                <li
                  key={c}
                  className={`flex items-center gap-3 rounded-2xl border border-dashed px-4 py-3 ${
                    usado ? 'border-white/10 opacity-60' : 'border-brand-300/40'
                  }`}
                >
                  <Ticket className="size-5 text-brand-300" />
                  <span className="flex-1 font-semibold tracking-wide">{c}</span>
                  <Badge tono={usado ? 'neutral' : 'ok'}>{usado ? 'Usado' : 'Activo'}</Badge>
                  <BotonCopiar codigo={c} />
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-white/50">
            Todavía no tienes cupones guardados.
          </p>
        )}
      </Card>
    </PageShell>
  )
}
