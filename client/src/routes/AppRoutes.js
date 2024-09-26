import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import { RouterProvider } from 'react-router-dom';
import About from '../pages/About';
import RegisterPatient from '../pages/RegisterPatient';

function AppRoutes()
{
    const BrowserRoutes = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/contact-us",
                    element: <Contact />
                },
                {
                    path: "/dashboard",
                    element: <ProtectedRoute element={<Dashboard />} allowedPositions={['staff', 'patient']} />
                },
                {
                    path: "/profile",
                    element: <ProtectedRoute element={<Profile />} allowedPositions={['staff', 'patient']} />
                },
                {
                    path: "/settings",
                    element: <ProtectedRoute element={<Settings />} allowedPositions={['staff', 'patient']} />
                },
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    path: "/register-patient",
                    element: <RegisterPatient />
                },
                {
                    path: "/about",
                    element: <About />
                },
                {
                    path: "*",
                    element: <NotFound />
                }
            ]
        }
    ]);

    return (
        <RouterProvider router={BrowserRoutes} />
    )
}

export default AppRoutes;
