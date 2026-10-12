import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, ArrowRight } from 'lucide-react'
import { CIUDADES, HORARIOS } from '../lib/destinos'
import { hoyISO } from '../lib/precios'
import { guardarReserva, obtenerReserva } from '../lib/storage'
import { Field } from './ui'

export default function BuscadorViaje({ destinoInicial, horizontal = false }) {
  const navigate = useNavigate()
  const [datos, setDatos] = useState(() => {
    const previa = obtenerReserva()
    const destino = destinoInicial ?? previa?.destino ?? ''
    const origen = previa?.origen ?? 'Santiago'
    return {
      origen: origen === destino ? '' : origen,
      destino,
      fecha: previa?.fecha && previa.fecha >= hoyISO() ? previa.fecha : '',
      hora: previa?.hora ?? '',
    }
  })
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (e) => {
    setDatos((d) => ({ ...d, [campo]: e.target.value }))
    setErrores((err) => ({ ...err, [campo]: undefined }))
  }

  const intercambiar = () => setDatos((d) => ({ ...d, origen: d.destino, destino: d.origen }))

  const enviar = (e) => {
    e.preventDefault()
    const nuevos = {}
    if (!datos.origen) nuevos.origen = 'Elige una ciudad de origen.'
    if (!datos.destino) nuevos.destino = 'Elige una ciudad de destino.'
    else if (datos.origen === datos.destino) nuevos.destino = 'El destino debe ser distinto al origen.'
    if (!datos.fecha) nuevos.fecha = 'Elige la fecha del viaje.'
    else if (datos.fecha < hoyISO()) nuevos.fecha = 'La fecha no puede ser anterior a hoy.'
    if (!datos.hora) nuevos.hora = 'Elige un horario.'
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return

    guardarReserva({ ...datos, asientos: [], comida: false, cupon: null })
    navigate('/asientos')
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      className={
        horizontal
          ? 'grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_0.8fr_auto]'
          : 'grid gap-5 sm:grid-cols-2'
      }
    >
      <Field label="Origen" as="select" value={datos.origen} onChange={cambiar('origen')} error={errores.origen}>
        <option value="" disabled>Selecciona origen</option>
        {CIUDADES.map((c) => <option key={c}>{c}</option>)}
      </Field>

      <button
        type="button"
        onClick={intercambiar}
        className={`grid size-10 place-items-center self-end justify-self-center rounded-full border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95 ${
          horizontal ? 'mb-0.5 hidden lg:grid' : 'hidden'
        }`}
        aria-label="Intercambiar origen y destino"
      >
        <ArrowLeftRight className="size-4" />
      </button>

      <Field label="Destino" as="select" value={datos.destino} onChange={cambiar('destino')} error={errores.destino}>
        <option value="" disabled>Selecciona destino</option>
        {CIUDADES.map((c) => <option key={c}>{c}</option>)}
      </Field>

      <Field label="Fecha" type="date" min={hoyISO()} value={datos.fecha} onChange={cambiar('fecha')} error={errores.fecha} />

      <Field label="Salida" as="select" value={datos.hora} onChange={cambiar('hora')} error={errores.hora}>
        <option value="" disabled>Horario</option>
        {HORARIOS.map((h) => <option key={h}>{h}</option>)}
      </Field>

      <button
        type="submit"
        className={`btn btn-primary ${horizontal ? 'sm:col-span-2 lg:col-span-1 lg:mt-[1.375rem]' : 'sm:col-span-2 mt-2'}`}
      >
        Elegir asientos <ArrowRight className="size-4" />
      </button>
    </form>
  )
}
