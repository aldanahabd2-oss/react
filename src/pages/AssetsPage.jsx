import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AssetForm from '../components/AssetForm'
import { useAssets } from '../context/AssetContext'

export default function AssetsPage() {
  const {
    assets,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    loadPage,
    updateAsset,
    removeAsset,
    getAssetById,
  } = useAssets()

  const [editingId, setEditingId] = useState(null)
  const [idQuery, setIdQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadPage(0)
  }, [loadPage])

  const editingAsset = assets.find((asset) => asset.id === editingId) ||
    (searchResult?.id === editingId ? searchResult : null)

  const handleUpdate = async (updates) => {
    await updateAsset(editingId, updates)
    setEditingId(null)
    if (searchResult?.id === editingId) {
      setSearchResult({ ...searchResult, ...updates, id: editingId })
    }
  }

  const handleSearchById = async (event) => {
    event.preventDefault()
    setSearchError('')
    setSearchResult(null)

    const id = idQuery.trim()
    if (!id) {
      setSearchError('Enter an asset ID.')
      return
    }

    setSearching(true)
    try {
      const asset = await getAssetById(id)
      setSearchResult(asset)
    } catch (err) {
      setSearchError(err.message || 'Asset not found')
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setIdQuery('')
    setSearchResult(null)
    setSearchError('')
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Computer Assets</h1>
          <p>Connected to the Spring backend — add, search by ID, paginate, and update.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          Add Asset
        </Link>
      </div>

      <form className="toolbar id-search" onSubmit={handleSearchById}>
        <label className="search-field">
          <span className="sr-only">Search by ID</span>
          <input
            type="search"
            value={idQuery}
            onChange={(event) => setIdQuery(event.target.value)}
            placeholder="Search by asset ID (e.g. 1)"
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? 'Searching…' : 'Find by ID'}
        </button>
        {searchResult || searchError ? (
          <button type="button" className="btn btn-ghost" onClick={clearSearch}>
            Clear
          </button>
        ) : null}
      </form>

      {searchError ? <p className="form-error" role="alert">{searchError}</p> : null}

      {searchResult ? (
        <div className="panel search-result">
          <h2>Search result — ID {searchResult.id}</h2>
          <p>
            <code>{searchResult.tag}</code> · {searchResult.name} · {searchResult.status}
          </p>
          <div className="actions">
            <button
              type="button"
              className="btn btn-small"
              onClick={() => setEditingId(searchResult.id)}
            >
              Edit
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="empty-state">
          <h2>Backend unavailable</h2>
          <p>{error}</p>
          <p className="note">Start the Spring server on port 8080, then refresh.</p>
          <button type="button" className="btn btn-primary" onClick={() => loadPage(page)}>
            Retry
          </button>
        </div>
      ) : null}

      {editingAsset ? (
        <div className="panel edit-panel">
          <h2>Edit {editingAsset.tag}</h2>
          <AssetForm
            initialValues={{
              ...editingAsset,
              purchaseDate: editingAsset.purchaseDate || '',
            }}
            submitLabel="Update Asset"
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
          />
        </div>
      ) : null}

      {!error ? (
        <>
          <div className="toolbar">
            <p className="count">
              Page {totalPages === 0 ? 0 : page + 1} of {totalPages} · {totalElements} assets
            </p>
          </div>

          {loading ? <p className="count">Loading assets…</p> : null}

          {!loading && assets.length === 0 ? (
            <div className="empty-state">
              <h2>No assets found</h2>
              <p>Add a new computer asset to get started.</p>
              <Link to="/add" className="btn btn-primary">
                Add Asset
              </Link>
            </div>
          ) : null}

          {!loading && assets.length > 0 ? (
            <>
              <div className="table-wrap">
                <table className="asset-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tag</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Assigned To</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Purchased</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td data-label="ID">{asset.id}</td>
                        <td data-label="Tag">
                          <code>{asset.tag}</code>
                        </td>
                        <td data-label="Name">{asset.name}</td>
                        <td data-label="Type">{asset.type}</td>
                        <td data-label="Assigned To">{asset.assignedTo}</td>
                        <td data-label="Department">{asset.department}</td>
                        <td data-label="Status">
                          <span
                            className={`status status-${asset.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td data-label="Purchased">{asset.purchaseDate || '—'}</td>
                        <td data-label="Actions" className="actions">
                          <button
                            type="button"
                            className="btn btn-small"
                            onClick={() => setEditingId(asset.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-small btn-danger"
                            onClick={async () => {
                              if (window.confirm(`Remove asset ${asset.tag}?`)) {
                                await removeAsset(asset.id)
                                if (editingId === asset.id) setEditingId(null)
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={page <= 0 || loading}
                  onClick={() => loadPage(page - 1)}
                >
                  Previous
                </button>
                <span className="count">
                  {page + 1} / {Math.max(totalPages, 1)}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={page >= totalPages - 1 || loading || totalPages === 0}
                  onClick={() => loadPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
