import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { places as initialPlaces, states, packagesByPlace as initialPackages } from '../../data/locationsData'
import AdminSeasonalManager from '../../components/admin/AdminSeasonalManager'
import './AdminDashboard.css'

// ─── Initial state (seeded from locationsData) ────────────────────────────────
const seedPlaces = initialPlaces.map(p => ({ ...p }))
const seedPackages = Object.entries(initialPackages).flatMap(([placeId, pkgs]) =>
  pkgs.map((pkg, i) => ({ ...pkg, id: `${placeId}-pkg-${i}`, placeId }))
)

// ─── Helpers ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['Adventure', 'Culture', 'Food', 'Nature', 'Spiritual', 'Beach']

const emptyPlace = {
  id: '', name: '', stateId: '', stateName: '', lat: '', lng: '',
  openingHours: '', costRange: '', category: 'Culture',
  popular: false, hasPackage: false, packageOnly: false,
  imageUrl: '',
}

const emptyPackage = {
  placeId: '', operator: '', name: '', groupSize: '',
  inclusions: '', price: '', rating: '', bookingLink: '',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="adm-modal-overlay" onClick={onCancel}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <p className="adm-modal-message">{message}</p>
        <div className="adm-modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-accent" onClick={onConfirm} id="confirm-delete-btn">Delete</button>
        </div>
      </div>
    </div>
  )
}

function PlaceForm({ initial, onSave, onCancel, statesList }) {
  const [form, setForm] = useState(initial || emptyPlace)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const stateName = statesList.find(s => s.id === form.stateId)?.name || form.stateName
    onSave({ ...form, id, stateName })
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form-grid">
        <div className="adm-form-field adm-form-field--full">
          <label className="adm-form-label t-label">Place name *</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Pondicherry" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">State *</label>
          <select className="input adm-select" value={form.stateId} onChange={e => set('stateId', e.target.value)} required>
            <option value="">Select state…</option>
            {statesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Category *</label>
          <select className="input adm-select" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Latitude *</label>
          <input className="input" type="number" step="0.0001" value={form.lat} onChange={e => set('lat', parseFloat(e.target.value))} required placeholder="26.9124" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Longitude *</label>
          <input className="input" type="number" step="0.0001" value={form.lng} onChange={e => set('lng', parseFloat(e.target.value))} required placeholder="75.7873" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Opening Hours</label>
          <input className="input" value={form.openingHours} onChange={e => set('openingHours', e.target.value)} placeholder="Sites 9 AM – 5 PM" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Cost Range</label>
          <input className="input" value={form.costRange} onChange={e => set('costRange', e.target.value)} placeholder="₹500 – 1,200/day" />
        </div>
        <div className="adm-form-field adm-form-field--full">
          <label className="adm-form-label t-label">Image URL</label>
          <input className="input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://images.unsplash.com/…" />
        </div>
        <div className="adm-form-checkboxes">
          {[
            { key: 'popular', label: 'Popular (shows on plan page)' },
            { key: 'hasPackage', label: 'Has a package' },
            { key: 'packageOnly', label: 'Package-only (DIY impractical)' },
          ].map(({ key, label }) => (
            <label key={key} className="adm-checkbox-label">
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={e => set(key, e.target.checked)}
                className="adm-checkbox"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="adm-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-accent" id="place-form-save-btn">
          {initial ? 'Save changes' : 'Add place'}
        </button>
      </div>
    </form>
  )
}

function PackageForm({ initial, onSave, onCancel, placesList }) {
  const [form, setForm] = useState(initial || emptyPackage)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    const id = initial?.id || `${form.placeId}-pkg-${Date.now()}`
    onSave({ ...form, id, price: parseFloat(form.price), rating: parseFloat(form.rating) })
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <div className="adm-form-grid">
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Destination *</label>
          <select className="input adm-select" value={form.placeId} onChange={e => set('placeId', e.target.value)} required>
            <option value="">Select place…</option>
            {placesList.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stateName})</option>)}
          </select>
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Operator *</label>
          <input className="input" value={form.operator} onChange={e => set('operator', e.target.value)} required placeholder="e.g. Indiahikes" />
        </div>
        <div className="adm-form-field adm-form-field--full">
          <label className="adm-form-label t-label">Package name *</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Spiti Valley Trek 6D" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Price (₹) *</label>
          <input className="input" type="number" value={form.price} onChange={e => set('price', e.target.value)} required placeholder="9999" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Rating (0–5) *</label>
          <input className="input" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} required placeholder="4.8" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Group size</label>
          <input className="input" value={form.groupSize} onChange={e => set('groupSize', e.target.value)} placeholder="Small groups (8–12)" />
        </div>
        <div className="adm-form-field">
          <label className="adm-form-label t-label">Booking link</label>
          <input className="input" value={form.bookingLink} onChange={e => set('bookingLink', e.target.value)} placeholder="https://…" />
        </div>
        <div className="adm-form-field adm-form-field--full">
          <label className="adm-form-label t-label">Inclusions</label>
          <input className="input" value={form.inclusions} onChange={e => set('inclusions', e.target.value)} placeholder="Guide, camping, all meals &amp; permits" />
        </div>
      </div>
      <div className="adm-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-accent" id="pkg-form-save-btn">
          {initial ? 'Save changes' : 'Add package'}
        </button>
      </div>
    </form>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('places') // 'places' | 'packages' | 'seasonal'
  const [placesList, setPlacesList] = useState(seedPlaces)
  const [packagesList, setPackagesList] = useState(seedPackages)
  const [search, setSearch] = useState('')
  const [editingPlace, setEditingPlace] = useState(null)   // null | place obj
  const [addingPlace, setAddingPlace] = useState(false)
  const [editingPkg, setEditingPkg] = useState(null)
  const [addingPkg, setAddingPkg] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // { type, id }

  function signOut() {
    sessionStorage.removeItem('biq_admin_token')
    navigate('/admin/login', { replace: true })
  }

  // Places CRUD
  function savePlace(data) {
    if (editingPlace) {
      setPlacesList(list => list.map(p => p.id === data.id ? data : p))
    } else {
      setPlacesList(list => [...list, data])
    }
    setAddingPlace(false)
    setEditingPlace(null)
  }

  function deletePlace(id) {
    setPlacesList(list => list.filter(p => p.id !== id))
    setPackagesList(pkgs => pkgs.filter(pkg => pkg.placeId !== id))
    setConfirmDelete(null)
  }

  // Packages CRUD
  function savePkg(data) {
    if (editingPkg) {
      setPackagesList(list => list.map(p => p.id === data.id ? data : p))
    } else {
      setPackagesList(list => [...list, data])
    }
    setAddingPkg(false)
    setEditingPkg(null)
  }

  function deletePkg(id) {
    setPackagesList(list => list.filter(p => p.id !== id))
    setConfirmDelete(null)
  }

  // Filtered views
  const q = search.trim().toLowerCase()
  const filteredPlaces = placesList.filter(p =>
    !q || p.name.toLowerCase().includes(q) || p.stateName?.toLowerCase().includes(q)
  )
  const filteredPkgs = packagesList.filter(pkg =>
    !q || pkg.name.toLowerCase().includes(q) || pkg.operator.toLowerCase().includes(q) ||
    pkg.placeId.toLowerCase().includes(q)
  )

  const showPlaceForm = addingPlace || editingPlace !== null
  const showPkgForm   = addingPkg || editingPkg !== null

  return (
    <div className="adm-page">

      {/* ── Topbar ────────────────────────────────────────── */}
      <header className="adm-topbar">
        <div className="adm-topbar-left">
          <span className="adm-wordmark">Backpacker<span>IQ</span></span>
          <span className="adm-badge t-label">Admin Dashboard</span>
        </div>
        <div className="adm-topbar-right">
          <span className="adm-stats t-mono">
            {placesList.length} places · {packagesList.length} packages
            {tab === 'seasonal' ? ' · seasonal ↓' : ''}
          </span>
          <button className="btn btn-outline adm-signout" onClick={signOut} id="admin-signout-btn">
            Sign out
          </button>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="adm-content">

        {/* ── Tab nav + controls ────────────────────────── */}
        <div className="adm-controls">
          <div className="adm-tabs">
            <button
              id="tab-places"
              className={`adm-tab ${tab === 'places' ? 'adm-tab--active' : ''}`}
              onClick={() => { setTab('places'); setSearch('') }}
            >
              Places
              <span className="adm-tab-count t-mono">{placesList.length}</span>
            </button>
            <button
              id="tab-packages"
              className={`adm-tab ${tab === 'packages' ? 'adm-tab--active' : ''}`}
              onClick={() => { setTab('packages'); setSearch('') }}
            >
              Tour packages
              <span className="adm-tab-count t-mono">{packagesList.length}</span>
            </button>
            <button
              id="tab-seasonal"
              className={`adm-tab ${tab === 'seasonal' ? 'adm-tab--active' : ''}`}
              onClick={() => { setTab('seasonal'); setSearch('') }}
            >
              Seasonal
              <span className="adm-tab-count t-mono" style={{ color: 'var(--accent)' }}>✦</span>
            </button>
          </div>

          {tab !== 'seasonal' && (
            <div className="adm-controls-right">
              <input
                className="input adm-search"
                type="text"
                placeholder={tab === 'places' ? 'Search places…' : 'Search packages…'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="admin-search-input"
              />
              <button
                id="admin-add-btn"
                className="btn btn-accent adm-add-btn"
                onClick={() => tab === 'places' ? setAddingPlace(true) : setAddingPkg(true)}
              >
                + Add {tab === 'places' ? 'place' : 'package'}
              </button>
            </div>
          )}
        </div>

        {/* ── Slide-down forms ──────────────────────────── */}
        {tab === 'places' && showPlaceForm && (
          <div className="adm-form-wrap fade-in">
            <h2 className="adm-form-title">
              {editingPlace ? `Edit — ${editingPlace.name}` : 'Add new place'}
            </h2>
            <PlaceForm
              initial={editingPlace}
              onSave={savePlace}
              onCancel={() => { setAddingPlace(false); setEditingPlace(null) }}
              statesList={states}
            />
          </div>
        )}

        {tab === 'packages' && showPkgForm && (
          <div className="adm-form-wrap fade-in">
            <h2 className="adm-form-title">
              {editingPkg ? `Edit — ${editingPkg.name}` : 'Add new package'}
            </h2>
            <PackageForm
              initial={editingPkg}
              onSave={savePkg}
              onCancel={() => { setAddingPkg(false); setEditingPkg(null) }}
              placesList={placesList}
            />
          </div>
        )}

        {/* ── Places table ──────────────────────────────── */}
        {tab === 'places' && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>State</th>
                  <th>Category</th>
                  <th>Lat / Lng</th>
                  <th>Flags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlaces.length === 0 ? (
                  <tr><td colSpan="6" className="adm-table-empty">No places found.</td></tr>
                ) : filteredPlaces.map(place => (
                  <tr key={place.id} className="adm-table-row">
                    <td>
                      <div className="adm-cell-name">{place.name}</div>
                      <div className="adm-cell-sub t-mono">{place.id}</div>
                    </td>
                    <td>{place.stateName}</td>
                    <td>
                      <span className={`adm-category-chip adm-cat--${place.category?.toLowerCase()}`}>
                        {place.category}
                      </span>
                    </td>
                    <td className="t-mono adm-cell-coords">
                      {place.lat}, {place.lng}
                    </td>
                    <td>
                      <div className="adm-flags">
                        {place.popular && <span className="adm-flag adm-flag--popular" title="Popular">★</span>}
                        {place.hasPackage && <span className="adm-flag adm-flag--pkg" title="Has package">PKG</span>}
                        {place.packageOnly && <span className="adm-flag adm-flag--pkgonly" title="Package only">PKG★</span>}
                      </div>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button
                          className="adm-action-btn adm-action-btn--edit"
                          onClick={() => { setAddingPlace(false); setEditingPlace(place) }}
                          title="Edit"
                          id={`edit-place-${place.id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => setConfirmDelete({ type: 'place', id: place.id, name: place.name })}
                          title="Delete"
                          id={`delete-place-${place.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Packages table ────────────────────────────── */}
        {tab === 'packages' && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Package name</th>
                  <th>Operator</th>
                  <th>Destination</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPkgs.length === 0 ? (
                  <tr><td colSpan="6" className="adm-table-empty">No packages found.</td></tr>
                ) : filteredPkgs.map(pkg => (
                  <tr key={pkg.id} className="adm-table-row">
                    <td>
                      <div className="adm-cell-name">{pkg.name}</div>
                      <div className="adm-cell-sub">{pkg.inclusions}</div>
                    </td>
                    <td>{pkg.operator}</td>
                    <td>
                      <span className="adm-dest-chip t-mono">
                        {placesList.find(p => p.id === pkg.placeId)?.name || pkg.placeId}
                      </span>
                    </td>
                    <td className="t-mono adm-price-cell">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </td>
                    <td className="t-mono">
                      {pkg.rating} <span style={{ color: '#e5b800' }}>★</span>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button
                          className="adm-action-btn adm-action-btn--edit"
                          onClick={() => { setAddingPkg(false); setEditingPkg(pkg) }}
                          title="Edit"
                          id={`edit-pkg-${pkg.id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="adm-action-btn adm-action-btn--delete"
                          onClick={() => setConfirmDelete({ type: 'pkg', id: pkg.id, name: pkg.name })}
                          title="Delete"
                          id={`delete-pkg-${pkg.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Seasonal destinations manager ──────────────── */}
        {tab === 'seasonal' && <AdminSeasonalManager />}

      </div>

      {/* ── Confirm delete modal ──────────────────────────── */}
      {confirmDelete && (
        <ConfirmModal
          message={`Delete "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={() => {
            if (confirmDelete.type === 'place') deletePlace(confirmDelete.id)
            else deletePkg(confirmDelete.id)
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
