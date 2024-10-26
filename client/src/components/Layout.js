import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import GoToTopButton from './common/GoToTopButton';
import { Outlet } from 'react-router-dom';
import './Layout.css'; 

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <GoToTopButton />
        </div>
    );
};

export default Layout;