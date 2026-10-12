import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <p className="font-display text-xl font-bold text-brand-300">SipoBus</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
            Somos una empresa familiar de buses y queremos lo mejor para ti. Recorriendo Chile contigo,
            kilómetro a kilómetro.
          </p>
          <p className="mt-5 flex items-start gap-2 text-sm text-white/60">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" />
            Av. Libertador Bernardo O'Higgins 3850, Estación Central, Santiago
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">Tu viaje</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><Link className="hover:text-white" to="/comprar">Comprar pasaje</Link></li>
            <li><Link className="hover:text-white" to="/cambiar">Cambiar pasaje</Link></li>
            <li><Link className="hover:text-white" to="/anular">Anular pasaje</Link></li>
            <li><Link className="hover:text-white" to="/cupones">Cupones</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">Síguenos</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li><a className="hover:text-white" href="#">Facebook</a></li>
            <li><a className="hover:text-white" href="#">Instagram</a></li>
            <li><a className="hover:text-white" href="#">X / Twitter</a></li>
            <li><Link className="hover:text-white" to="/contacto">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/5 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} SipoBus Chile. Todos los derechos reservados.
      </p>
    </footer>
  )
}
