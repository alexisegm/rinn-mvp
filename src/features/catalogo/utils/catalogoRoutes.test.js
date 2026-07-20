import test from 'node:test';
import assert from 'node:assert/strict';
import { getCategoriaFromSearch, buildCatalogoUrl } from './catalogoRoutes.js';

test('extrae la categoría desde la búsqueda de la URL', () => {
  assert.equal(getCategoriaFromSearch('?categoria=herramientas'), 'herramientas');
  assert.equal(getCategoriaFromSearch(''), null);
});

test('genera la ruta de catálogo con la categoría seleccionada', () => {
  assert.equal(buildCatalogoUrl('herramientas'), '/catalogo?categoria=herramientas');
  assert.equal(buildCatalogoUrl(null), '/catalogo');
});
