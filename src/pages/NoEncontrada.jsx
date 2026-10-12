import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

export default function NoEncontrada() {
  return (
    <PageShell eyebrow="Error 404" titulo="Te saliste de la ruta" descripcion="La página que buscas no existe o cambió de dirección.">
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </PageShell>
  )
}
