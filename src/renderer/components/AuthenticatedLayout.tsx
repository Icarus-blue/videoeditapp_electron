import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

const AuthenticatedLayout: React.FC = () => (
  <div>
    <TopBar />
    <Outlet />
  </div>
);

export default AuthenticatedLayout;