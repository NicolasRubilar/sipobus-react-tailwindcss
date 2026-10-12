import GestionPasaje from '../components/GestionPasaje'
import PageShell from '../components/PageShell'
import { DESTINOS } from '../lib/destinos'

export default function Cambiar() {
  return (
    <PageShell
      eyebrow="Gestiona tu viaje"
      titulo="Cambiar pasaje"
      descripcion="¿Tuviste un inconveniente? Puedes cambiar la fecha y el horario de tu reserva hasta 4 horas antes de la salida."
      fondo={DESTINOS[3].imagen}
    >
      <GestionPasaje modo="cambiar" />
    </PageShell>
  )
}
