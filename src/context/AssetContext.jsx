import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  createAsset as apiCreate,
  deleteAsset as apiDelete,
  fetchAssetById as apiFindById,
  fetchAssetsPage,
  updateAsset as apiUpdate,
} from '../api/assetsApi'

const AssetContext = createContext(null)

export function AssetProvider({ children }) {
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadPage = useCallback(async (pageNumber = 0) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAssetsPage(pageNumber, size)
      setAssets(data.content || [])
      setPage(data.number ?? pageNumber)
      setTotalPages(data.totalPages ?? 0)
      setTotalElements(data.totalElements ?? 0)
    } catch (err) {
      setError(err.message || 'Failed to load assets')
      setAssets([])
    } finally {
      setLoading(false)
    }
  }, [size])

  const addAsset = useCallback(async (asset) => {
    const created = await apiCreate(asset)
    await loadPage(page)
    return created
  }, [loadPage, page])

  const updateAsset = useCallback(async (id, updates) => {
    const updated = await apiUpdate(id, updates)
    await loadPage(page)
    return updated
  }, [loadPage, page])

  const removeAsset = useCallback(async (id) => {
    await apiDelete(id)
    const nextPage = assets.length === 1 && page > 0 ? page - 1 : page
    await loadPage(nextPage)
  }, [assets.length, loadPage, page])

  const getAssetById = useCallback(async (id) => apiFindById(id), [])

  const value = useMemo(
    () => ({
      assets,
      page,
      size,
      totalPages,
      totalElements,
      loading,
      error,
      loadPage,
      addAsset,
      updateAsset,
      removeAsset,
      getAssetById,
    }),
    [
      assets,
      page,
      size,
      totalPages,
      totalElements,
      loading,
      error,
      loadPage,
      addAsset,
      updateAsset,
      removeAsset,
      getAssetById,
    ],
  )

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}

export function useAssets() {
  const context = useContext(AssetContext)
  if (!context) {
    throw new Error('useAssets must be used within AssetProvider')
  }
  return context
}
