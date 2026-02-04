import { supabase } from '@/lib/supabaseClient'

export default function LoginGoogleTest() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // sem redirectTo por enquanto
    })

    if (error) {
      console.error('Erro no login Google:', error)
      alert(error.message)
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 16px',
          backgroundColor: '#4285F4',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        Login com Google (teste OAuth)
      </button>
    </div>
  )
}
