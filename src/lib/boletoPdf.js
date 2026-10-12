import { TIPOS_ASIENTO, formatearFecha, formatearPrecio } from './precios'

function cargarLogo() {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // 256 px basta para el boleto y evita que el PDF pese varios MB
      canvas.width = 256
      canvas.height = 256
      canvas.getContext('2d').drawImage(img, 0, 0, 256, 256)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = '/logo.png'
  })
}

/** Genera un PDF con un boleto por asiento (jsPDF se carga solo cuando se necesita). */
export async function descargarBoleto(viaje) {
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), cargarLogo()])
  const doc = new jsPDF('landscape', 'mm', 'a5')

  viaje.asientos.forEach((asiento, i) => {
    if (i > 0) doc.addPage()
    const m = 10

    doc.setFillColor(11, 74, 139)
    doc.roundedRect(m, m, 190, 22, 4, 4, 'F')
    if (logo) doc.addImage(logo, 'PNG', m + 4, m + 1, 20, 20)
    doc.setTextColor(255)
    doc.setFontSize(18)
    doc.text('SipoBus · Boleto de viaje', m + 28, m + 14)

    doc.setDrawColor(200)
    doc.roundedRect(m, m + 26, 190, 92, 4, 4)

    doc.setTextColor(40)
    doc.setFontSize(22)
    doc.text(`${viaje.origen}  >  ${viaje.destino}`, m + 8, m + 42)

    doc.setFontSize(12)
    const filas = [
      ['Fecha', formatearFecha(viaje.fecha)],
      ['Salida', `${viaje.hora} hrs`],
      ['Asiento', `N° ${asiento.id} (${TIPOS_ASIENTO[asiento.tipo].label})`],
      ['Comida', viaje.comida ? 'Incluida' : 'No incluida'],
      ['Total compra', `${formatearPrecio(viaje.total)} CLP`],
    ]
    filas.forEach(([etiqueta, valor], j) => {
      const y = m + 56 + j * 10
      doc.setTextColor(130)
      doc.text(etiqueta, m + 8, y)
      doc.setTextColor(30)
      doc.text(valor, m + 50, y)
    })

    doc.setFontSize(9)
    doc.setTextColor(140)
    doc.text(`Código: ${viaje.id.slice(0, 8).toUpperCase()}-${asiento.id}`, m + 8, m + 112)
    doc.text('Gracias por preferir SipoBus · www.sipobus.cl', m + 110, m + 112)
  })

  doc.save(`boleto-sipobus-${viaje.id.slice(0, 8)}.pdf`)
}
