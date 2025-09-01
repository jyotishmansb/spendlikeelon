import './sidebar.css'
import { MdOutlineCancel } from "react-icons/md";

const Sidebar = ({ isOpen, setIsSidebarOpen, total, qty, itemData, spentPercent }) => {

    const purchasedItems = itemData.filter(item => qty[item.id] > 0)


    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`}>

            </div>
            <div className={`sidebar-container ${isOpen ? 'active' : ""}`}>
                <div className="cancel-icon" onClick={() => {
                    setIsSidebarOpen(false)
                }}><MdOutlineCancel /></div>
                <h2>Your shopping Items are</h2>
                <div className="cart-text">

                    {purchasedItems.length > 0 ?
                        (purchasedItems.map(item => (
                            <div key={item.id}>
                                <div className="cart-item">
                                    <div className="item-title">{item.name}</div>
                                    <div className="space">x</div>
                                    <div className="cart-quantity">{qty[item.id]}</div>

                                </div>
                             </div>
                        ))
                        )
                        : <div className="no-items-text">No Items</div>

                    }
                     <div className="divider"></div>
                    <div className="total"><span>Money Spend</span>₹{total.toLocaleString('en-IN')} </div>
                    <div className="percent"><span>percent Spend</span>{spentPercent === 0 || spentPercent === 100 
                    ? spentPercent.toFixed(0): spentPercent.toFixed(4)}  %</div>
                </div>
            </div >
        </>

    )
}

export default Sidebar