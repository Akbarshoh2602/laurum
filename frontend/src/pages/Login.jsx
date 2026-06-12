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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gold border-2 border-ink shadow-pop-sm flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-3xl text-cream">L</span>
            </div>
            <h1 className="font-display text-4xl">WELCOME BACK</h1>
            <p className="text-slate font-medium mt-2">Log in to your Laura Store account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email or Admin Login</label>
              <input className="input" {...register('login', { required: true })} placeholder="you@email.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" {...register('password', { required: true })} />
            </div>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <button disabled={isSubmitting} className="btn-gold w-full">
              {isSubmitting ? 'Logging In…' : 'Log In →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate mt-6 font-medium">
            No account?{' '}
            <Link to="/register" className="text-gold font-bold hover:underline">Sign up free</Link>
          </p>
        </div>

        <div className="mt-6 text-xs text-slate text-center font-medium">
          Admin: login <span className="font-mono bg-pearl px-1 border border-ink/20">ADMIN123</span> /{' '}
          <span className="font-mono bg-pearl px-1 border border-ink/20">6789</span>
        </div>
      </div>
    </div>
  )
}
