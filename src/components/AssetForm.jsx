import { useState } from 'react'
import { ASSET_STATUSES, ASSET_TYPES } from '../data/initialAssets'

const emptyForm = {
  tag: '',
  name: '',
  type: 'Laptop',
  assignedTo: '',
  department: '',
  status: 'Available',
  purchaseDate: '',
}

export default function AssetForm({
  initialValues = emptyForm,
  submitLabel = 'Save Asset',
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialValues)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.tag.trim() || !form.name.trim()) {
      setError('Asset tag and name are required.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      tag: form.tag.trim(),
      name: form.name.trim(),
      assignedTo: form.assignedTo.trim() || 'Unassigned',
      department: form.department.trim() || 'General',
    })
  }

  return (
    <form className="asset-form" onSubmit={handleSubmit} noValidate>
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="form-grid">
        <label>
          Asset Tag
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="e.g. LP-021"
            required
          />
        </label>

        <label>
          Name / Model
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. MacBook Pro 14"
            required
          />
        </label>

        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            {ASSET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            {ASSET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          Assigned To
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            placeholder="Employee name"
          />
        </label>

        <label>
          Department
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="e.g. Engineering"
          />
        </label>

        <label className="full">
          Purchase Date
          <input
            type="date"
            name="purchaseDate"
            value={form.purchaseDate}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
