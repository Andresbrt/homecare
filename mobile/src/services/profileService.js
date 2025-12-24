import { API_BASE_URL } from '../config/api';

export async function getUserProfile(token) {
  const resp = await fetch(`${API_BASE_URL}/profile/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!resp.ok) throw new Error('Error obteniendo perfil');
  return await resp.json();
}

export async function updateUserRole(token, newRole) {
  const resp = await fetch(`${API_BASE_URL}/profile/role`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  });
  if (!resp.ok) {
    const error = await resp.text();
    throw new Error(error || 'Error actualizando rol');
  }
  return await resp.json();
}
