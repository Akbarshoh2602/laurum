import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const onSubmit = async ({ login: loginValue, password }) => {
    setError('')
    try {
      const user = await login(loginValue, password)
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate(location.state?.from || '/')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-5xl text-center mb-2">Welcome Back</h1>
      <p className="text-center text-neutral-500 mb-10 text-sm">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label">Email or Admin Login</label>
          <input className="input" {...register('login', { required: true })} placeholder="you@email.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" {...register('password', { required: true })} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={isSubmitting} className="btn-gold w-full">
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        No account?{' '}
        <Link to="/register" className="text-gold-dark underline">Create one</Link>
      </p>

      <div className="mt-8 border-t border-neutral-200 pt-6 text-xs text-neutral-400 text-center">
        Admin access: login <span className="font-mono text-neutral-600">ADMIN123</span>, password{' '}
        <span className="font-mono text-neutral-600">6789</span>
      </div>
    </div>
  )
}
