import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { Outlet } from 'react-router-dom';
import './Layout.css'; 

const Layout = () =>
{
    return (
        <div className="layout">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;