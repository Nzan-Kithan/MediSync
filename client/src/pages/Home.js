// example page
export default function Home()
{
    return (
        <div>
            <h1>Homepage</h1>
            <ul className="productBox">
                <li>
                    <a href="/product-details/143" className="productLink"><img className="productImage" src={require('../assets/images/good-day-to-code.jpg')} alt="It's a good day to code"/></a>
                    <br /><a href="/product-details/143" className="productLink">It's a good day to code</a>
                </li>
                <li>
                    <a href="/product-details/486" className="productLink"><img className="productImage" src={require('../assets/images/eat-sleep-code-repeat.jpg')} alt="Eat. Sleep. Code. Repeat."/></a>
                    <br /><a href="/product-details/486" className="productLink">Eat. Sleep. Code. Repeat.</a>
                </li>
            </ul>
        </div>
    )
}