import { supabase } from '@/lib/supabaseClient'

export default function LoginGoogleTest() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error(error)
      alert('Erro no login com Google')
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <button
        onClick={handleLogin}
        style={{
          padding: '12px 18px',
          backgroundColor: '#4285F4',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Login com Google
      </button>
    </div>
  )
}
