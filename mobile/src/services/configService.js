import { API_BASE_URL } from '../config/api';

export async function fetchAiConfig() {
  try {
    const resp = await fetch(`${API_BASE_URL}/config/ai`);
    if (!resp.ok) throw new Error('AI config fetch failed');
    return await resp.json();
  } catch (err) {
    console.warn('AI config error:', err.message);
    return null;
  }
}

export async function updateAiConfig({ token, enabled, model }) {
  if (!token) throw new Error('Missing auth token');
  const payload = {};
  if (typeof enabled === 'boolean') payload.enabled = enabled;
  if (model) payload.model = model;

  const resp = await fetch(`${API_BASE_URL}/config/ai`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (resp.status === 403 || resp.status === 401) {
    throw new Error('No autorizado (se requiere rol admin)');
  }
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg || 'Error al actualizar configuración AI');
  }
  return resp.json();
}
