// frontend/src/components/Nav.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, getUser } from '../services/auth.js';

export default function Nav() {
  const nav = useNavigate();
  const user = getUser();
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="font-bold">Roxiler Ratings</div>
      <div className="flex gap-3 items-center">
        {user?.role === 'ADMIN' && <Link to="/admin" className="underline">Admin</Link>}
        {user?.role === 'USER' && <Link to="/stores" className="underline">Stores</Link>}
        {user?.role === 'STORE_OWNER' && <Link to="/owner" className="underline">Owner</Link>}
        {user && (
          <>
            <Link to="/update-password" className="text-sm">Update Password</Link>
            <button
              onClick={() => { clearSession(); nav('/login'); }}
              className="px-3 py-1 rounded bg-gray-900 text-white">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}