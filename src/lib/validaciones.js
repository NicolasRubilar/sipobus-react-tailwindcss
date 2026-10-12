export function validarPerfil(d) {
  const e = {}
  if (!d.nombre.trim()) e.nombre = 'Ingresa tu nombre.'
  if (!d.apellido.trim()) e.apellido = 'Ingresa tu apellido.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo.trim())) e.correo = 'Ingresa un correo válido.'
  if (!/^\+?56\s?9\s?\d{4}\s?\d{4}$/.test(d.telefono.trim())) e.telefono = 'Formato: +56 9 1234 5678.'
  if (!d.fechaNacimiento) e.fechaNacimiento = 'Ingresa tu fecha de nacimiento.'
  if (!d.direccion.trim()) e.direccion = 'Ingresa tu dirección.'
  return e
}
