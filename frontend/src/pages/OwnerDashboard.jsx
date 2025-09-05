// frontend/src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api.js';
import Nav from '../components/Nav.jsx';

export default function OwnerDashboard() {
  const [data, setData] = useState({ store: null, avg_rating: 0, raters: [] });
  const load = async () => {
    const data = await apiRequest('/owner/dashboard', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    setData(data);
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <Nav />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Owner Dashboard</h1>
        {data.store ? (
          <>
            <div className="mb-4">
              <div className="font-semibold">{data.store.name}</div>
              <div className="text-sm text-gray-600">{data.store.address}</div>
              <div className="mt-1">Average Rating: <span className="font-semibold">{Number(data.avg_rating).toFixed(2)}</span></div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">User</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Rating</th>
                  <th className="py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.raters.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.name}</td>
                    <td className="py-2">{r.email}</td>
                    <td className="py-2">{r.rating}</td>
                    <td className="py-2">{new Date(r.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div>No store assigned to this owner.</div>
        )}
      </div>
    </div>
  );
}