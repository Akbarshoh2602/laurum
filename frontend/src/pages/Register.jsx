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
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display text-5xl text-center mb-2">Create Account</h1>
      <p className="text-center text-neutral-500 mb-10 text-sm">Join AURUM</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <input type="password" className="input"
            {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input type="password" className="input"
            {...register('confirmPassword', {
              required: 'Required',
              validate: (v) => v === password || 'Passwords do not match',
            })} />
          {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={isSubmitting} className="btn-gold w-full">
          {isSubmitting ? 'Creating…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-gold-dark underline">Sign in</Link>
      </p>
    </div>
  )
}
