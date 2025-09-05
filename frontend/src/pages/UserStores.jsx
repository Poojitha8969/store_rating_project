// frontend/src/pages/UserStores.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api.js';
import Nav from '../components/Nav.jsx';

export default function UserStores() {
  const [query, setQuery] = useState('');
  const [list, setList] = useState({ items: [] });
  const [rating, setRating] = useState({});

  const load = async () => {
    const params = new URLSearchParams({ search: query, limit: 50 }).toString();
    const data = await apiRequest(`/api/stores?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    setList(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (storeId) => {
    const r = Number(rating[storeId] || 0);
    if (r < 1 || r > 5) return;
    await apiRequest(`/api/stores/${storeId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: r })
    });
    await load();
  };

  return (
    <div>
      <Nav />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Stores</h1>
        <div className="flex gap-2 mb-4">
          <input className="border p-2 flex-1" placeholder="Search name/address" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button onClick={load} className="px-4 rounded bg-blue-600 text-white">Search</button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Name</th>
              <th className="py-2">Address</th>
              <th className="py-2">Avg</th>
              <th className="py-2">My Rating</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-2 pr-2">{s.name}</td>
                <td className="py-2 pr-2">{s.address}</td>
                <td className="py-2 pr-2">{s.avg_rating.toFixed(2)}</td>
                <td className="py-2 pr-2">{s.my_rating ?? '-'}</td>
                <td className="py-2 pr-2">
                  <select className="border p-1" value={rating[s.id] || ''} onChange={(e)=>setRating({...rating, [s.id]: e.target.value})}>
                    <option value="">Select</option>
                    {[1,2,3,4,5].map((n)=>(<option key={n} value={n}>{n}</option>))}
                  </select>
                  <button onClick={()=>submit(s.id)} className="ml-2 px-3 py-1 rounded bg-gray-900 text-white">Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}