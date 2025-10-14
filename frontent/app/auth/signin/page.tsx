"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign in (demo)</h1>
      <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => signIn('credentials', { username, password })}>Sign in</button>
    </div>
  );
}
