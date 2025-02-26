/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { loginService } from '@/services/loginService'
import { getSession, signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      const response = await signIn('credentials', {
        userName: formData.get('userName'),
        password: formData.get('password'),
        redirect: false,
      })
      console.log('response:', response)
      if (response?.error) {
        setError(response.error);
        return
      }
      loginService.triggerLogin(1);
      const session = await getSession()
      console.log('session:', session?.user?.roleCode)
      const roleCodeArray = Array.isArray(session?.user?.roleCode) ? session.user.roleCode : [];

      if (roleCodeArray.some((item: any) => item.code === 'role_user')) {
        window.location.href = '/';
      } else {
        window.location.href = '/admin';
      }
    } catch (error) {
      setError('An error occurred during login')
    }
  }

  const handleRegister = () =>{
    window.location.href = '/register';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="userName" className="sr-only">
                userName
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="userName"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
            <button
              onClick={()=>handleRegister()}
              className="group relative w-full flex justify-center py-2 px-4 mt-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
