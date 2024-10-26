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
import RegisterHospital from '../pages/RegisterHospital';
import LoginHospital from '../pages/LoginHospital';
import LoginStaff from '../pages/LoginStaff';
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
                    element: <ProtectedRoute element={<Dashboard />} allowedPositions={['staff', 'patient', 'hospital', 'doctor']} />
                },
                {
                    path: "/profile",
                    element: <ProtectedRoute element={<Profile />} />
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
                    path: "/login-hospital",
                    element: <LoginHospital />
                },
                {
                    path: "/login-staff",
                    element: <LoginStaff />
                },
                {
                    path: "/register-patient",
                    element: <RegisterPatient />
                },
                {
                    path: "/register-hospital",
                    element: <RegisterHospital />
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
