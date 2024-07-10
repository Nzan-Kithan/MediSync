// example page
import { useParams } from "react-router-dom"

export default function ProductDetails()
{
    const params = useParams()
    let productData = null

    if (params.id === '143')
    {
        productData = {
            name: 'Hoodie',
            price: 50.00,
            image: require('../assets/images/good-day-to-code.jpg')
        }
    }

    return (
        <>
            <h1>Product Details</h1>
            <p>The product id is: {params.id}</p>
            {
                productData != null ?
                <>
                    <img src={productData.image } alt={productData.name} width="400" />
                    <h2>{productData.name} - ₹{productData.price}</h2>
                </>
                :
                <>
                    <p>The product is out of stock...</p>
                </>
            }
        </>
    )
}