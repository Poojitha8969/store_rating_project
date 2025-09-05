// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api.js';
import Nav from '../components/Nav.jsx';
import DataTable from '../components/DataTable.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState({ items: [], page: 1, pages: 1 });
  const [stores, setStores] = useState({ items: [], page: 1, pages: 1 });
  const [uFilters, setUFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sFilters, setSFilters] = useState({ name: '', email: '', address: '' });

  const [userError, setUserError] = useState("");
  const [storeError, setStoreError] = useState("");

  const loadStats = async () => {
    const data = await apiRequest('/admin/dashboard', { method: 'GET' });
    setStats(data);
  };

  const loadUsers = async (sortBy, order) => {
    const params = { ...uFilters, page: 1, limit: 20, sortBy, order };
    const data = await apiRequest('/admin/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    setUsers(data);
  };

  const loadStores = async (sortBy, order) => {
    const params = { ...sFilters, page: 1, limit: 20, sortBy, order };
    const data = await apiRequest('/admin/stores', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    setStores(data);
  };

  useEffect(() => { loadStats(); loadUsers(); loadStores(); }, []);

  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });

  const validateUser = () => {
    if (!newUser.name.match(/^[A-Za-z ]{2,60}$/)) return "Name must be 2-60 letters.";
    if (!newUser.email.match(/^\S+@\S+\.\S+$/)) return "Invalid email format.";
    if (!newUser.address || newUser.address.length < 5 || newUser.address.length > 400) return "Address must be 5-400 characters.";
    if (!newUser.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) return "Password must be at least 6 characters, include letters and numbers.";
    return "";
  };
  const validateStore = () => {
    if (!newStore.name.match(/^.{2,60}$/)) return "Store name must be 2-60 characters.";
    if (!newStore.email.match(/^\S+@\S+\.\S+$/)) return "Invalid email format.";
    if (!newStore.address || newStore.address.length < 5 || newStore.address.length > 400) return "Address must be 5-400 characters.";
    return "";
  };

  const createUser = async (e) => {
    e.preventDefault();
    const err = validateUser();
    if (err) { setUserError(err); return; }
    setUserError("");
    try {
      await apiRequest('/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      setNewUser({ name: '', email: '', address: '', password: '', role: 'USER' });
      loadUsers();
    } catch (e) {
      setUserError(e.message);
    }
  };

  const createStore = async (e) => {
    e.preventDefault();
    const err = validateStore();
    if (err) { setStoreError(err); return; }
    setStoreError("");
    try {
      await apiRequest('/admin/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore)
      });
      setNewStore({ name: '', email: '', address: '' });
      loadStores();
    } catch (e) {
      setStoreError(e.message);
    }
  };

  return (
    <div>
      <Nav />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat label="Users" value={stats.users} />
          <Stat label="Stores" value={stats.stores} />
          <Stat label="Ratings" value={stats.ratings} />
        </div>

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <Card title="Add User">
            <form onSubmit={createUser} className="flex flex-col gap-2">
              <input className="border p-2" placeholder="Name (2-60)" value={newUser.name} onChange={(e)=>setNewUser({...newUser,name:e.target.value})} />
              <input className="border p-2" placeholder="Email" value={newUser.email} onChange={(e)=>setNewUser({...newUser,email:e.target.value})} />
              <input className="border p-2" placeholder="Address" value={newUser.address} onChange={(e)=>setNewUser({...newUser,address:e.target.value})} />
              <input className="border p-2" placeholder="Password" type="password" value={newUser.password} onChange={(e)=>setNewUser({...newUser,password:e.target.value})} />
              <select className="border p-2" value={newUser.role} onChange={(e)=>setNewUser({...newUser,role:e.target.value})}>
                <option>USER</option>
                <option>STORE_OWNER</option>
                <option>ADMIN</option>
              </select>
              {userError && <div className="text-red-500 text-sm">{userError}</div>}
              <button className="bg-gray-900 text-white py-2 rounded">Create</button>
            </form>
          </Card>

          <Card title="Add Store">
            <form onSubmit={createStore} className="flex flex-col gap-2">
              <input className="border p-2" placeholder="Store Name (2-60)" value={newStore.name} onChange={(e)=>setNewStore({...newStore,name:e.target.value})} />
              <input className="border p-2" placeholder="Email" value={newStore.email} onChange={(e)=>setNewStore({...newStore,email:e.target.value})} />
              <input className="border p-2" placeholder="Address" value={newStore.address} onChange={(e)=>setNewStore({...newStore,address:e.target.value})} />
              {storeError && <div className="text-red-500 text-sm">{storeError}</div>}
              <button className="bg-gray-900 text-white py-2 rounded">Create</button>
            </form>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <Filters filters={uFilters} setFilters={setUFilters} onApply={() => loadUsers()} extra={[{ key: 'role', placeholder: 'Role' }]} />
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'address', label: 'Address' },
              { key: 'role', label: 'Role' },
            ]}
            rows={users.items}
            onSort={(k,o)=>loadUsers(k,o)}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Stores</h2>
          <Filters filters={sFilters} setFilters={setSFilters} onApply={() => loadStores()} />
          <DataTable
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'address', label: 'Address' },
              { key: 'avg_rating', label: 'Avg Rating' },
            ]}
            rows={stores.items}
            onSort={(k,o)=>loadStores(k,o)}
          />
        </section>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border rounded-xl p-4 text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Filters({ filters, setFilters, onApply, extra = [] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {['name','email','address', ...extra.map(e => e.key)].map((k, i) => (
        <input
          key={k+i}
          className="border p-2"
          placeholder={(extra.find(e=>e.key===k)?.placeholder) || k[0].toUpperCase()+k.slice(1)}
          value={filters[k] || ''}
          onChange={(e)=>setFilters({ ...filters, [k]: e.target.value })}
        />
      ))}
      <button onClick={onApply} className="px-3 py-2 bg-blue-600 text-white rounded">Apply</button>
    </div>
  );
}