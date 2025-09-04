import React, { useEffect, useState } from 'react';
import { getAuthToken, setAuthToken, tryDevLogin } from '../lib/auth';

export default function DevLogin() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiBase = (import.meta as any).env?.VITE_API_BASE ?? '/api';

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  async function doLogin() {
    setLoading(true);
    try {
      const t = await tryDevLogin(apiBase);
      setToken(t);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setAuthToken(null);
    setToken(null);
  }

  if (!(import.meta as any).env?.DEV) return null;

  return (
    <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
      <span style={{ fontSize:12, opacity:.8 }}>
        {token ? 'Dev Auth: OK' : 'Dev Auth: none'}
      </span>
      {!token ? (
        <button disabled={loading} onClick={doLogin}>{loading ? '登入中…' : 'Dev Login'}</button>
      ) : (
        <button onClick={clear}>清除</button>
      )}
    </div>
  );
}

