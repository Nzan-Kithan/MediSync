// example component
import { useContext } from 'react'
import logo from '../assets/images/react-logo.png'
import Context from './Context'

export default function Header()
{
    const userData = useContext(Context)

    return (
        <nav className="nav-bar">
        <p><a href="/"><img src={logo} alt="logo" height="50" /></a></p>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/contact-us">Contact</a></li>
            <li>Hello, {userData.name}</li>
            <li>Cart: {userData.cartItems}</li>
        </ul>
        </nav>
    )
}