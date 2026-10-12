import GestionPasaje from '../components/GestionPasaje'
import PageShell from '../components/PageShell'
import { DESTINOS } from '../lib/destinos'

export default function Anular() {
  return (
    <PageShell
      eyebrow="Gestiona tu viaje"
      titulo="Anular pasaje"
      descripcion="Puedes anular tu pasaje hasta 4 horas antes de la salida. El viaje se moverá a tus viajes anulados."
      fondo={DESTINOS[4].imagen}
    >
      <GestionPasaje modo="anular" />
    </PageShell>
  )
}
