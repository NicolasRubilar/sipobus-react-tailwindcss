import { useLocation } from 'react-router-dom'
import BuscadorViaje from '../components/BuscadorViaje'
import PageShell from '../components/PageShell'
import PasosCompra from '../components/PasosCompra'
import { Card } from '../components/ui'
import { buscarDestino } from '../lib/destinos'

export default function Comprar() {
  const { state } = useLocation()
  const destino = state?.destino

  return (
    <PageShell
      eyebrow="Compra tu pasaje"
      titulo="Selecciona tu viaje"
      descripcion="Elige origen, destino y la salida que más te acomode. En el siguiente paso eliges tus asientos."
      fondo={buscarDestino(destino)?.imagen}
    >
      <PasosCompra actual={0} />
      <Card>
        <BuscadorViaje destinoInicial={destino} />
      </Card>
    </PageShell>
  )
}
