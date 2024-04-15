import { Outlet } from 'react-router-dom';
import '@shared/layouts/social/social.scss';
import Header from '@components/header/Header';
import Sidebar from '@components/sidebar/Sidebar';
import React from 'react';

export const SocialLayout = () => {
  return (
    <React.Fragment>
      <Header />
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  );
};
