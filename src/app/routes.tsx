import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from '../pages/Home';
import Suggest from '../pages/Suggest';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/suggest" element={<Suggest />} />
      </Route>
    </Routes>
  );
}
