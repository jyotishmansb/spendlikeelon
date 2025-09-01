import { useEffect, useState } from "react"


const Item = ({ name, price, handleBuy, qty, image, handleSell }) => {

    const [animate, setAnimate] = useState(false);


    useEffect(() => {
        if (qty > 0) {
            setAnimate(true);

            const t = setTimeout(() => {
                setAnimate(false)
            }, 100);


            return () => clearTimeout(t);
        }



    }, [qty])



    return (
        <article className='item-wrapper'>
            <div className="item-image"><img src={image} alt="" /></div>
            <h2 className='name'>{name}</h2>
            <div className="price">₹{price.toLocaleString('en-IN')}</div>
            <div className="item-bottom">
                <div className={`quantity ${animate ? 'ani' : ''}`}>{qty}</div>
                <button className="sell-btn" onClick={handleSell}>Sell</button>
                <button className='buy-btn' onClick={handleBuy}> Buy </button>
            </div>

        </article>

    )
}

export default Item