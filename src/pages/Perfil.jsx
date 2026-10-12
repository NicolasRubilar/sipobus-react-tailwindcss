import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { CalendarClock, Download, Mail, MapPin, Pencil, Phone, Plus, Cake, Ticket, TicketX } from 'lucide-react'
import PageShell from '../components/PageShell'
import { Badge, Card, Field, Modal } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { formatearFecha, formatearPrecio, hoyISO } from '../lib/precios'
import { validarPerfil } from '../lib/validaciones'
import { anularViaje, viajeVigente } from '../lib/viajes'

function EditarPerfil({ usuario, onCerrar }) {
  const { actualizarUsuario } = useAuth()
  const [datos, setDatos] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    telefono: usuario.telefono,
    fechaNacimiento: usuario.fechaNacimiento,
    direccion: usuario.direccion,
  })
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (e) => {
    setDatos((d) => ({ ...d, [campo]: e.target.value }))
    setErrores((err) => ({ ...err, [campo]: undefined }))
  }

  const guardar = (e) => {
    e.preventDefault()
    const nuevos = validarPerfil(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return
    try {
      actualizarUsuario((u) => ({ ...u, ...datos }))
      toast.success('Perfil actualizado.')
      onCerrar()
    } catch (err) {
      setErrores({ correo: err.message })
    }
  }

  return (
    <form onSubmit={guardar} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre" value={datos.nombre} onChange={cambiar('nombre')} error={errores.nombre} />
      <Field label="Apellido" value={datos.apellido} onChange={cambiar('apellido')} error={errores.apellido} />
      <Field label="Correo" type="email" className="sm:col-span-2" value={datos.correo} onChange={cambiar('correo')} error={errores.correo} />
      <Field label="Teléfono" type="tel" value={datos.telefono} onChange={cambiar('telefono')} error={errores.telefono} />
      <Field label="Fecha de nacimiento" type="date" max={hoyISO()} value={datos.fechaNacimiento} onChange={cambiar('fechaNacimiento')} error={errores.fechaNacimiento} />
      <Field label="Dirección" className="sm:col-span-2" value={datos.direccion} onChange={cambiar('direccion')} error={errores.direccion} />
      <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
        <button type="button" onClick={onCerrar} className="btn btn-ghost">Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar cambios</button>
      </div>
    </form>
  )
}

function TarjetaViaje({ viaje, onAnular }) {
  const vigente = viajeVigente(viaje)

  const descargar = async () => {
    const { descargarBoleto } = await import('../lib/boletoPdf')
    descargarBoleto(viaje)
  }

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {viaje.origen} <span className="text-brand-300">→</span> {viaje.destino}
          </p>
          <p className="mt-1 text-xs text-white/55">
            {formatearFecha(viaje.fecha)} · {viaje.hora} hrs · Asientos {viaje.asientos.map((a) => a.id).join(', ')}
            {viaje.comida && ' · Con comida'}
          </p>
        </div>
        <Badge tono={vigente ? 'ok' : 'error'}>{vigente ? 'Disponible' : 'Vencido'}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-auto font-display text-sm font-bold tabular-nums">{formatearPrecio(viaje.total)}</span>
        <button type="button" onClick={descargar} className="btn btn-ghost !px-3 !py-1.5 !text-xs">
          <Download className="size-3.5" /> Boleto
        </button>
        {vigente && (
          <>
            <Link to="/cambiar" state={{ viajeId: viaje.id }} className="btn btn-ghost !px-3 !py-1.5 !text-xs">
              <CalendarClock className="size-3.5" /> Cambiar
            </Link>
            <button type="button" onClick={onAnular} className="btn !px-3 !py-1.5 !text-xs text-red-300 hover:bg-red-500/10">
              <TicketX className="size-3.5" /> Anular
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth()
  const [editando, setEditando] = useState(false)
  const [porAnular, setPorAnular] = useState(null)

  const confirmarAnulacion = () => {
    actualizarUsuario((u) => anularViaje(u, porAnular.id, 'Anulado desde el perfil'))
    setPorAnular(null)
    toast.success('Pasaje anulado.')
  }

  const viajes = [...usuario.viajes].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))

  return (
    <PageShell ancho="max-w-6xl">
      <Card className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <span className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 font-display text-2xl font-black text-ink-950">
          {usuario.nombre[0]}
          {usuario.apellido[0]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-[0.25em] text-brand-300 uppercase">Mi perfil</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold uppercase sm:text-3xl">
            {usuario.nombre} {usuario.apellido}
          </h1>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-white/65 sm:grid-cols-2">
            <li className="flex items-center gap-2 truncate"><Mail className="size-4 shrink-0" />{usuario.correo}</li>
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" />{usuario.telefono}</li>
            <li className="flex items-center gap-2 truncate"><MapPin className="size-4 shrink-0" />{usuario.direccion}</li>
            <li className="flex items-center gap-2"><Cake className="size-4 shrink-0" />{formatearFecha(usuario.fechaNacimiento)}</li>
          </ul>
        </div>
        <button type="button" onClick={() => setEditando(true)} className="btn btn-ghost self-start">
          <Pencil className="size-4" /> Editar
        </button>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold uppercase">Mis viajes</h2>
            <Link to="/comprar" className="btn btn-primary !px-4 !py-2 !text-xs">
              <Plus className="size-3.5" /> Nuevo viaje
            </Link>
          </div>
          {viajes.length ? (
            <ul className="mt-5 space-y-3">
              {viajes.map((v) => (
                <TarjetaViaje key={v.id} viaje={v} onAnular={() => setPorAnular(v)} />
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
              Aún no tienes viajes. ¿Qué tal una escapada al sur?
            </p>
          )}

          {usuario.viajesAnulados.length > 0 && (
            <>
              <h3 className="mt-8 text-sm font-semibold text-white/60">Viajes anulados</h3>
              <ul className="mt-3 space-y-2">
                {usuario.viajesAnulados.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-white/50">
                    <span className="line-through">
                      {v.origen} → {v.destino} · {v.fecha}
                    </span>
                    <Badge>Anulado</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card className="lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase">Cupones</h2>
            <Link to="/cupones" className="text-xs font-semibold text-brand-300 hover:underline">Gestionar</Link>
          </div>
          {usuario.cupones.length ? (
            <ul className="mt-5 space-y-2">
              {usuario.cupones.map((c) => {
                const usado = usuario.cuponesUsados.includes(c)
                return (
                  <li key={c} className="flex items-center justify-between rounded-xl border border-dashed border-white/15 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Ticket className="size-4 text-brand-300" /> {c}
                    </span>
                    <Badge tono={usado ? 'neutral' : 'ok'}>{usado ? 'Usado' : 'Activo'}</Badge>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-white/50">No tienes cupones todavía.</p>
          )}
        </Card>
      </div>

      <Modal abierto={editando} onCerrar={() => setEditando(false)} titulo="Editar perfil">
        {editando && <EditarPerfil usuario={usuario} onCerrar={() => setEditando(false)} />}
      </Modal>

      <Modal abierto={!!porAnular} onCerrar={() => setPorAnular(null)} titulo="¿Anular este pasaje?">
        {porAnular && (
          <>
            <p className="text-sm text-white/70">
              Vas a anular el viaje <strong className="text-white">{porAnular.origen} → {porAnular.destino}</strong> del{' '}
              {formatearFecha(porAnular.fecha)}. Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPorAnular(null)} className="btn btn-ghost">Volver</button>
              <button type="button" onClick={confirmarAnulacion} className="btn btn-danger">Sí, anular</button>
            </div>
          </>
        )}
      </Modal>
    </PageShell>
  )
}
