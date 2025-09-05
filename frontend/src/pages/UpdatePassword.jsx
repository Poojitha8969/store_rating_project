// frontend/src/pages/UpdatePassword.jsx
import React, { useState } from 'react';
import { apiRequest } from '../services/api.js';
import Nav from '../components/Nav.jsx';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.put('/auth/update-password', { password });
      setMsg('Updated');
    } catch (e) {
      setMsg('Failed');
    }
  };

  return (
    <div>
      <Nav />
      <div className="max-w-sm mx-auto mt-10">
        <h1 className="text-2xl font-semibold mb-4">Update Password</h1>
        <form onSubmit={submit} className="flex gap-3">
          <input className="border p-2 flex-1" placeholder="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 rounded">Save</button>
        </form>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </div>
    </div>
  );
}