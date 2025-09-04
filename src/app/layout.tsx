import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import DevLogin from '../components/DevLogin';

export default function Layout() {
  return (
    <div className="container">
      <header className="app-header">
        <Link to="/"><h1>TaskPlanet</h1></Link>
        <nav style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link to="/suggest">建議列表</Link>
          <UserMenu />
          <DevLogin />
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
