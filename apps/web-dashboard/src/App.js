import React, { useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || "https://sfa-platform-fresh.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem('sfa_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('dashboard'); // dashboard, users, tenants

  const login = async (e) => {
    e.preventDefault();
    // Mock Login for MVP Visualization (Backend auth logic is WIP)
    if(email === 'ram@sfa.net' && password === 'admin') {
        const fakeToken = "abc-123";
        setToken(fakeToken);
        localStorage.setItem('sfa_token', fakeToken);
    } else {
        alert("Invalid (Try ram@sfa.net / admin)");
    }
  };

  const logout = () => {
      setToken(null);
      localStorage.removeItem('sfa_token');
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>FieldForce Admin</h1>
          <p>Super Admin Console</p>
          <form onSubmit={login}>
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2>FieldForce</h2>
        <ul>
          <li onClick={()=>setView('dashboard')} className={view==='dashboard'?'active':''}>Dashboard</li>
          <li onClick={()=>setView('tenants')} className={view==='tenants'?'active':''}>Tenants (Companies)</li>
          <li onClick={()=>setView('users')} className={view==='users'?'active':''}>Users</li>
          <li onClick={()=>setView('settings')} className={view==='settings'?'active':''}>Global Settings</li>
          <li onClick={logout} style={{color:'red', marginTop:'auto'}}>Logout</li>
        </ul>
      </nav>
      <main className="content">
        <header>
            <h3>Welcome, Ram</h3>
            <span>Super Admin</span>
        </header>
        
        {view === 'dashboard' && <DashboardHome />}
        {view === 'tenants' && <TenantManager />}
      </main>
    </div>
  );
}

function DashboardHome() {
    return (
        <div className="stats-grid">
            <div className="card"><h3>Active Companies</h3><p className="stat">12</p></div>
            <div className="card"><h3>Total Users</h3><p className="stat">1,240</p></div>
            <div className="card"><h3>Monthly Revenue</h3><p className="stat text-green">$24,500</p></div>
        </div>
    )
}

function TenantManager() {
    return (
        <div>
            <div className="toolbar">
                <h2>Companies</h2>
                <button className="btn-primary">+ New Company</button>
            </div>
            <table className="data-table">
                <thead><tr><th>Name</th><th>Plan</th><th>Users</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                    <tr><td>ABC Distribution</td><td>Premium</td><td>45</td><td><span className="badge green">Active</span></td><td><button>Manage</button></td></tr>
                    <tr><td>XYZ Logistics</td><td>Basic</td><td>12</td><td><span className="badge red">Overdue</span></td><td><button>Manage</button></td></tr>
                </tbody>
            </table>
        </div>
    )
}

export default App;
