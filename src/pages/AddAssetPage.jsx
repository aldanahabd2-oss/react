import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssetForm from '../components/AssetForm'
import { useAssets } from '../context/AssetContext'

export default function AddAssetPage() {
  const { addAsset } = useAssets()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (asset) => {
    setSaving(true)
    setError('')
    try {
      await addAsset(asset)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to add asset')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page narrow">
      <div className="page-header">
        <div>
          <h1>Add Asset</h1>
          <p>Register a new computer or IT device via the Spring REST API.</p>
        </div>
      </div>

      <div className="panel">
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <AssetForm
          submitLabel={saving ? 'Saving…' : 'Add Asset'}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </div>
    </section>
  )
}
