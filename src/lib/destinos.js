import vinaDelMar from '../assets/destinos/vina_del_mar.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import puertoMontt from '../assets/destinos/puerto-montt.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import valparaiso from '../assets/destinos/valparaiso.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import pucon from '../assets/destinos/pucon.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import laSerena from '../assets/destinos/la_serena.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import santiago from '../assets/destinos/santiago.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import concepcion from '../assets/destinos/concepcion.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'
import iquique from '../assets/destinos/iquique.jpg?w=320;640;1280;1920&format=avif;webp&as=picture'

// Cada imagen es un objeto { sources, img } generado en el build por vite-imagetools
// (ver componente <Foto>). Créditos de las fotos de Wikimedia Commons en CREDITOS.md.
const commons = (autor, licencia, archivo) => ({
  autor,
  licencia,
  url: `https://commons.wikimedia.org/wiki/File:${archivo}`,
})

export const DESTINOS = [
  {
    id: 'vina-del-mar',
    nombre: 'Viña del Mar',
    region: 'Región de Valparaíso',
    imagen: vinaDelMar,
    descripcion:
      'La Ciudad Jardín: playas amplias, el reloj de flores y atardeceres frente al Pacífico a solo una hora y media de Santiago.',
  },
  {
    id: 'puerto-montt',
    nombre: 'Puerto Montt',
    region: 'Región de Los Lagos',
    imagen: puertoMontt,
    descripcion:
      'La puerta de entrada a la Patagonia. Mariscos en Angelmó, el seno de Reloncaví y volcanes nevados en el horizonte.',
  },
  {
    id: 'valparaiso',
    credito: commons('Rodrigo Gillibrand', 'CC BY-SA 3.0', 'Colores_del_cerro.JPG'),
    nombre: 'Valparaíso',
    region: 'Región de Valparaíso',
    imagen: valparaiso,
    descripcion:
      'Cerros de colores, ascensores centenarios y murales en cada esquina. Un puerto que es Patrimonio de la Humanidad.',
  },
  {
    id: 'pucon',
    credito: commons('Falk2', 'CC BY-SA 4.0', 'J25_045_Lago,_Volc%C3%A1n_Villarrica.jpg'),
    nombre: 'Pucón',
    region: 'Región de La Araucanía',
    imagen: pucon,
    descripcion:
      'A los pies del volcán Villarrica: lagos, termas y bosques nativos para los que buscan aventura en el sur.',
  },
  {
    id: 'la-serena',
    credito: commons('Jorgemolinaz', 'CC BY-SA 3.0', 'Faro_Monumental_de_La_Serena_al_atardecer.jpg'),
    nombre: 'La Serena',
    region: 'Región de Coquimbo',
    imagen: laSerena,
    descripcion:
      'Playas de arena blanca, el faro monumental y los cielos más limpios del mundo para mirar las estrellas en el Elqui.',
  },
  {
    id: 'santiago',
    credito: commons('3BRBS', 'CC BY-SA 3.0', 'Gran_Santiago_Tower,_Views_from_San_Crit%C3%B3bal_Hill_-_Santiago_-_Chile_01.jpg'),
    nombre: 'Santiago',
    region: 'Región Metropolitana',
    imagen: santiago,
    descripcion:
      'La capital entre la cordillera y la costa. Barrios con historia, cerros urbanos y el punto de partida de todos tus viajes.',
  },
  {
    id: 'concepcion',
    credito: commons('Nicolas Sanhueza', 'CC BY-SA 4.0', 'Concepcion_Centro.jpg'),
    nombre: 'Concepción',
    region: 'Región del Biobío',
    imagen: concepcion,
    descripcion:
      'Ciudad universitaria a orillas del río Biobío, con escena musical propia y la costa de Penco y Lirquén muy cerca.',
  },
  {
    id: 'iquique',
    credito: commons('Paodurang', 'CC BY-SA 3.0', 'Anochecer_en_borde_costero_Iquique..jpg'),
    nombre: 'Iquique',
    region: 'Región de Tarapacá',
    imagen: iquique,
    descripcion:
      'Sol todo el año, la playa Cavancha y las dunas del Dragón. El norte grande con historia salitrera y mar cálido.',
  },
]

export const CIUDADES = DESTINOS.map((d) => d.nombre).sort((a, b) => a.localeCompare(b, 'es'))

export const HORARIOS = ['07:00', '09:30', '12:00', '15:30', '18:00', '21:00', '23:30']

export const buscarDestino = (nombre) => DESTINOS.find((d) => d.nombre === nombre)
