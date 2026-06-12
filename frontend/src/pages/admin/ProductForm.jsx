import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import client, { unwrap } from '../../api/client'

export default function ProductForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: { status: 'ACTIVE', quantity: 0 },
  })
  const imageUrl = watch('imageUrl')

  useEffect(() => {
    client.get('/admin/categories').then((r) => setCategories(unwrap(r) || []))
    if (editing) {
      client.get(`/admin/products/${id}`).then((r) => {
        const p = unwrap(r)
        reset({
          productCode: p.productCode, name: p.name, description: p.description,
          imageUrl: p.imageUrl, categoryId: p.categoryId || '', size: p.size, color: p.color,
          purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice, quantity: p.quantity,
          barcode: p.barcode, status: p.status, featured: p.featured,
          newArrival: p.newArrival, bestSeller: p.bestSeller,
        })
      })
    }
  }, [id, editing, reset])

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await client.post('/admin/products/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setValue('imageUrl', unwrap(res).url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    setError('')
    const payload = {
      ...data,
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : null,
      sellingPrice: Number(data.sellingPrice),
      quantity: Number(data.quantity),
    }
    try {
      if (editing) await client.put(`/admin/products/${id}`, payload)
      else await client.post('/admin/products', payload)
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-3xl mb-6">{editing ? 'Edit Product' : 'New Product'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Name *</label><input className="input" {...register('name', { required: true })} /></div>
          <div><label className="label">Product Code</label><input className="input" {...register('productCode')} /></div>
        </div>
        <div><label className="label">Description</label><textarea rows={3} className="input" {...register('description')} /></div>

        <div>
          <label className="label">Image</label>
          <div className="flex items-center gap-4">
            {imageUrl && <img src={imageUrl} alt="" className="w-16 h-20 object-cover border" />}
            <input type="file" accept="image/*" onChange={upload} className="text-sm" />
            {uploading && <span className="text-sm text-neutral-500">Uploading…</span>}
          </div>
          <input className="input mt-2" placeholder="or paste an image URL" {...register('imageUrl')} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select className="input" {...register('categoryId')}>
              <option value="">— none —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="label">Barcode</label><input className="input" {...register('barcode')} /></div>
          <div><label className="label">Size</label><input className="input" {...register('size')} /></div>
          <div><label className="label">Color</label><input className="input" {...register('color')} /></div>
          <div><label className="label">Purchase Price</label><input type="number" step="0.01" className="input" {...register('purchasePrice')} /></div>
          <div><label className="label">Selling Price *</label><input type="number" step="0.01" className="input" {...register('sellingPrice', { required: true })} /></div>
          <div><label className="label">Quantity *</label><input type="number" className="input" {...register('quantity', { required: true })} /></div>
          <div>
            <label className="label">Status</label>
            <select className="input" {...register('status')}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" {...register('featured')} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('newArrival')} /> New Arrival</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('bestSeller')} /> Best Seller</label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button disabled={isSubmitting} className="btn-gold">{editing ? 'Save Changes' : 'Create Product'}</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  )
}
