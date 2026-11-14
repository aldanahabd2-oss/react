const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/assets'

async function request(path = '', options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      if (body?.message) message = body.message
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function fetchAssetsPage(page = 0, size = 5) {
  return request(`?page=${page}&size=${size}`)
}

export function fetchAssetById(id) {
  return request(`/${id}`)
}

export function createAsset(asset) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(asset),
  })
}

export function updateAsset(id, asset) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(asset),
  })
}

export function deleteAsset(id) {
  return request(`/${id}`, {
    method: 'DELETE',
  })
}
