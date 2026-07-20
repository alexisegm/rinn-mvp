export function normalizeCategoriaValue(value) {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildCatalogoUrl(categoria) {
  if (!categoria) return '/catalogo';
  return `/catalogo?categoria=${encodeURIComponent(categoria)}`;
}

export function getCategoriaFromSearch(search) {
  if (!search) return null;

  const params = new URLSearchParams(search);
  const categoria = params.get('categoria');
  return categoria ? categoria : null;
}

export function matchesCategoria(categoriaValue, candidateValue) {
  return normalizeCategoriaValue(categoriaValue) === normalizeCategoriaValue(candidateValue);
}
