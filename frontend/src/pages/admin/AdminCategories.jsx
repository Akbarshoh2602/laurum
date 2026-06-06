import { useEffect, useState } from 'react'
import client, { unwrap } from '../../api/client'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null) // category or null
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const load = () => client.get('/admin/categories').then((r) => setCategories(unwrap(r) || []))
  useEffect(() => { load() }, [])

  const startEdit = (c) => { setEditing(c); setName(c.name); setDescription(c.description || '') }
  const resetForm = () => { setEditing(null); setName(''); setDescription(''); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) await client.put(`/admin/categories/${editing.id}`, { name, description })
      else await client.post('/admin/categories', { name, description })
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await client.delete(`/admin/categories/${id}`)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h2 className="font-display text-3xl mb-6">Categories</h2>
        <div className="bg-white border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left uppercase text-xs tracking-widest text-neutral-500">
              <tr><th className="p-3">Name</th><th className="p-3">Description</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-neutral-500">{c.description}</td>
                  <td className="p-3 text-right space-x-3">
                    <button onClick={() => startEdit(c)} className="text-gold-dark hover:underline">Edit</button>
                    <button onClick={() => remove(c.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-neutral-400">No categories.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl mb-4">{editing ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={submit} className="bg-white border border-neutral-200 p-5 space-y-4">
          <div><label className="label">Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><label className="label">Description</label><textarea rows={3} className="input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button className="btn-gold py-2 flex-1">{editing ? 'Save' : 'Add'}</button>
            {editing && <button type="button" onClick={resetForm} className="btn-ghost py-2">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  )
}
