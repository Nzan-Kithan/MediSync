// example component
import Header from "../components/Header"
import Footer from "../components/Footer"
import Contact from "../pages/Contact"
import Home from "../pages/Home"
import ProductDetails from "../pages/ProductDetails"
// import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

export default function Router()
{        
    const Layout = () =>
    {
        return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
        )
    }

    // const BrowserRoutes = () => 
    // {
    //     return (
    //         <BrowserRouter>
    //           <Routes>
    //             <Route path="/" element={<Layout />}>
    //               <Route path="/" element={<Home />} />
    //               <Route path="contact-us" element={<Contact />} />
    //             </Route>
    //           </Routes>
    //         </BrowserRouter>
    //     );
    // }

    // return (
    //     <BrowserRoutes />
    // )

    const BrowserRoutes = createBrowserRouter
    ([
        {
            path: "/",
            element: <Layout />,
            children: 
            [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/contact-us",
                    element: <Contact />
                },
                {
                    path: "product-details",
                    element: <ProductDetails />
                },
                {
                    path: "product-details/:id",
                    element: <ProductDetails />
                }
                // add the other links here
            ]
        }
    ])

    return (
        <RouterProvider router={BrowserRoutes} />
    )
}