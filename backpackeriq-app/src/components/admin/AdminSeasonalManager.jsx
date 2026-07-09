import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './AdminSeasonalManager.css'

const SEASON_OPTIONS = [
  'Monsoon Getaway', 'Summer Window', 'Winter Circuit',
  'Shoulder Season', 'Festival Season', 'Year-round Pick',
  'Spring Bloom', 'Autumn Colour',
]

const emptyForm = {
  name: '', description: '', image_url: '',
  season_label: SEASON_OPTIONS[0],
  cost_estimate: '', is_featured: true, order_index: 0,
}

export default function AdminSeasonalManager() {
  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [formOpen,  setFormOpen]  = useState(false)
  const [editItem,  setEditItem]  = useState(null)
  const [form,      setForm]      = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('seasonal_destinations')
      .select('*')
      .order('order_index', { ascending: true })
    if (!error) setItems(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditItem(null)
    setForm({ ...emptyForm, order_index: items.length + 1 })
    setFormOpen(true)
    setError('')
  }

  function openEdit(item) {
    setEditItem(item)
    setForm({ ...item })
    setFormOpen(true)
    setError('')
  }

  function closeForm() {
    setFormOpen(false)
    setEditItem(null)
    setError('')
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name:          form.name.trim(),
      description:   form.description?.trim() || null,
      image_url:     form.image_url?.trim() || null,
      season_label:  form.season_label,
      cost_estimate: form.cost_estimate?.trim() || null,
      is_featured:   !!form.is_featured,
      order_index:   Number(form.order_index) || 0,
      updated_at:    new Date().toISOString(),
    }

    let err
    if (editItem) {
      ;({ error: err } = await supabase
        .from('seasonal_destinations')
        .update(payload)
        .eq('id', editItem.id))
    } else {
      ;({ error: err } = await supabase
        .from('seasonal_destinations')
        .insert(payload))
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    closeForm()
    load()
  }

  async function handleDelete(id) {
    await supabase.from('seasonal_destinations').delete().eq('id', id)
    setConfirmId(null)
    load()
  }

  async function toggleFeatured(item) {
    await supabase
      .from('seasonal_destinations')
      .update({ is_featured: !item.is_featured, updated_at: new Date().toISOString() })
      .eq('id', item.id)
    load()
  }

  async function moveOrder(item, direction) {
    const idx     = items.findIndex(i => i.id === item.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= items.length) return
    const other = items[swapIdx]
    await Promise.all([
      supabase.from('seasonal_destinations').update({ order_index: other.order_index }).eq('id', item.id),
      supabase.from('seasonal_destinations').update({ order_index: item.order_index  }).eq('id', other.id),
    ])
    load()
  }

  return (
    <div className="sm-wrap">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="sm-header">
        <div>
          <h2 className="sm-title">Seasonal Destinations</h2>
          <p className="sm-sub">
            Featured cards shown on the home page below the map.
            {' '}{items.filter(i => i.is_featured).length} of {items.length} currently shown.
          </p>
        </div>
        <button id="seasonal-add-btn" className="btn btn-accent" onClick={openAdd}>
          + Add destination
        </button>
      </div>

      {/* ── Form modal ──────────────────────────────────── */}
      {formOpen && (
        <div className="sm-overlay" onClick={closeForm}>
          <div className="sm-modal" onClick={e => e.stopPropagation()}>

            <h3 className="sm-modal-title">
              {editItem ? `Edit — ${editItem.name}` : 'Add seasonal destination'}
            </h3>

            {error && <p className="sm-modal-error">{error}</p>}

            <form onSubmit={handleSave} className="sm-form">
              <div className="sm-grid">

                <div className="sm-field sm-field--full">
                  <label className="adm-form-label t-label">Destination name *</label>
                  <input
                    className="input" required
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Coorg in Monsoon"
                    id="sm-name-input"
                  />
                </div>

                <div className="sm-field">
                  <label className="adm-form-label t-label">Season label *</label>
                  <select className="input adm-select" value={form.season_label} onChange={e => set('season_label', e.target.value)}>
                    {SEASON_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="sm-field">
                  <label className="adm-form-label t-label">Cost estimate</label>
                  <input
                    className="input"
                    value={form.cost_estimate}
                    onChange={e => set('cost_estimate', e.target.value)}
                    placeholder="₹5K–10K per person"
                    id="sm-cost-input"
                  />
                </div>

                <div className="sm-field sm-field--full">
                  <label className="adm-form-label t-label">Image URL</label>
                  <input
                    className="input"
                    value={form.image_url}
                    onChange={e => set('image_url', e.target.value)}
                    placeholder="https://images.unsplash.com/…"
                    id="sm-image-input"
                  />
                </div>

                {/* Live image preview */}
                {form.image_url && (
                  <div className="sm-field sm-field--full">
                    <div className="sm-img-preview">
                      <img
                        src={form.image_url}
                        alt="preview"
                        onError={e => { e.target.style.opacity = '0.3' }}
                      />
                    </div>
                  </div>
                )}

                <div className="sm-field sm-field--full">
                  <label className="adm-form-label t-label">Description (1–2 sentences)</label>
                  <textarea
                    className="input sm-textarea"
                    rows={2}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Why visit now — short, specific, compelling."
                    id="sm-desc-input"
                  />
                </div>

                <div className="sm-field">
                  <label className="adm-form-label t-label">Display order</label>
                  <input
                    className="input"
                    type="number" min="0"
                    value={form.order_index}
                    onChange={e => set('order_index', e.target.value)}
                    id="sm-order-input"
                  />
                </div>

                <div className="sm-field sm-field--check">
                  <label className="adm-checkbox-label">
                    <input
                      type="checkbox"
                      className="adm-checkbox"
                      checked={!!form.is_featured}
                      onChange={e => set('is_featured', e.target.checked)}
                      id="sm-featured-check"
                    />
                    Show on home page (is_featured)
                  </label>
                </div>

              </div>

              <div className="adm-form-actions">
                <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  id="seasonal-save-btn"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : editItem ? 'Save changes' : 'Add destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────── */}
      {loading ? (
        <p className="sm-loading">Loading…</p>
      ) : items.length === 0 ? (
        <div className="sm-empty">
          <p>No seasonal destinations yet.</p>
          <button className="btn btn-accent" onClick={openAdd}>+ Add your first one</button>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Order</th>
                <th>Name</th>
                <th>Season</th>
                <th>Cost</th>
                <th style={{ width: 110 }}>Featured</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="adm-table-row">
                  <td>
                    <div className="sm-order-cell">
                      <button
                        onClick={() => moveOrder(item, 'up')}
                        disabled={idx === 0}
                        className="sm-order-btn"
                        title="Move up"
                        id={`seasonal-up-${item.id}`}
                      >↑</button>
                      <span className="t-mono sm-order-num">{item.order_index}</span>
                      <button
                        onClick={() => moveOrder(item, 'down')}
                        disabled={idx === items.length - 1}
                        className="sm-order-btn"
                        title="Move down"
                        id={`seasonal-down-${item.id}`}
                      >↓</button>
                    </div>
                  </td>
                  <td>
                    <div className="adm-cell-name">{item.name}</div>
                    {item.description && (
                      <div className="adm-cell-sub">
                        {item.description.slice(0, 70)}{item.description.length > 70 ? '…' : ''}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="sm-season-chip">{item.season_label}</span>
                  </td>
                  <td className="t-mono" style={{ fontSize: '0.8125rem', color: '#555' }}>
                    {item.cost_estimate || '—'}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(item)}
                      className={`sm-featured-toggle ${item.is_featured ? 'sm-featured-toggle--on' : ''}`}
                      id={`toggle-featured-${item.id}`}
                      title={item.is_featured ? 'Click to hide from home' : 'Click to show on home'}
                    >
                      {item.is_featured ? '✓ Featured' : 'Hidden'}
                    </button>
                  </td>
                  <td>
                    <div className="adm-row-actions">
                      <button
                        className="adm-action-btn adm-action-btn--edit"
                        onClick={() => openEdit(item)}
                        id={`edit-seasonal-${item.id}`}
                      >Edit</button>
                      <button
                        className="adm-action-btn adm-action-btn--delete"
                        onClick={() => setConfirmId(item.id)}
                        id={`delete-seasonal-${item.id}`}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Confirm delete modal ─────────────────────────── */}
      {confirmId && (
        <div className="adm-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <p className="adm-modal-message">
              Delete "{items.find(i => i.id === confirmId)?.name}"? This cannot be undone.
            </p>
            <div className="adm-modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmId(null)}>Cancel</button>
              <button
                className="btn btn-accent"
                id="confirm-seasonal-delete-btn"
                onClick={() => handleDelete(confirmId)}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
