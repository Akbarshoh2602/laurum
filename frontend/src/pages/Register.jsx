import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setError('')
    try {
      await registerUser(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="card p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="badge-hot mb-4 inline-block">Join the Crew</span>
            <h1 className="font-display text-4xl">CREATE ACCOUNT</h1>
            <p className="text-slate font-medium mt-2">Sign up and start shopping men&apos;s gear</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input className="input" {...register('firstName', { required: 'Required' })} />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" {...register('lastName', { required: 'Required' })} />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" {...register('phone', { required: 'Required' })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" {...register('email', { required: 'Required' })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className="input"
                {...register('confirmPassword', {
                  required: 'Required',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <button disabled={isSubmitting} className="btn-gold w-full">
              {isSubmitting ? 'Creating…' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate mt-6 font-medium">
            Already have one?{' '}
            <Link to="/login" className="text-gold font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
