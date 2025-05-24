import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/layout/GuestHeader/GuestHeader.jsx';
import Footer from '@components/layout/GuestFooter/GuestFooter.jsx';

const GuestLayout = () => (
  <>
    <Header />
    <Outlet /> {/* Route con sẽ render tại đây */}
    <Footer />
  </>
);

export default GuestLayout;
