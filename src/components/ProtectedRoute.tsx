import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
