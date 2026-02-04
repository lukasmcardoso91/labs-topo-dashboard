import { supabase } from '../lib/supabaseClient'

export default function Login() {
  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <p>Entre com sua conta Google para acessar o dashboard</p>

      <button onClick={handleLogin}>
        Login com Google
      </button>
    </div>
  )
}
