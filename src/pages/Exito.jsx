import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckCircle2, Download, Loader2, Plus, UserRound } from 'lucide-react'
import PageShell from '../components/PageShell'
import ResumenCompra from '../components/ResumenCompra'
import { Card } from '../components/ui'
import { buscarDestino } from '../lib/destinos'
import { obtenerUltimaCompra } from '../lib/storage'

export default function Exito() {
  const [compra] = useState(obtenerUltimaCompra)
  const [descargando, setDescargando] = useState(false)

  if (!compra) return <Navigate to="/" replace />

  const descargar = async () => {
    setDescargando(true)
    try {
      const { descargarBoleto } = await import('../lib/boletoPdf')
      await descargarBoleto(compra)
    } catch {
      toast.error('No pudimos generar el PDF. Inténtalo otra vez.')
    } finally {
      setDescargando(false)
    }
  }

  return (
    <PageShell fondo={buscarDestino(compra.destino)?.imagen}>
      <div className="flex animate-fade-up flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/30">
          <CheckCircle2 className="size-8 text-emerald-300" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-extrabold uppercase sm:text-4xl">¡Compra exitosa!</h1>
        <p className="mt-3 text-sm text-white/65">
          Tu viaje quedó guardado en tu perfil. Descarga tu boleto y preséntalo al subir al bus.
        </p>
      </div>

      <Card className="mt-10">
        <ResumenCompra reserva={compra} />
      </Card>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={descargar} disabled={descargando} className="btn btn-primary">
          {descargando ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Boleto PDF
        </button>
        <Link to="/perfil" className="btn btn-ghost">
          <UserRound className="size-4" /> Mis viajes
        </Link>
        <Link to="/comprar" className="btn btn-ghost">
          <Plus className="size-4" /> Otra compra
        </Link>
      </div>
    </PageShell>
  )
}
