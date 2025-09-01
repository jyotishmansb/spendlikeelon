import './modal.css'
import { MdOutlineCancel } from "react-icons/md";

const Modal = ({setShowModal, total}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="cancel-icon" onClick={()=>{setShowModal(false)}}><MdOutlineCancel/></div>
                <div className="warning-icon">
                    <span>!</span></div>
          {  total==0?       
                (<h2>No Money, you have spend all!!</h2>):
               ( <h2>Oops...not enough Money!</h2>)
}
                <button className='modal-btn' onClick={()=>setShowModal(false)}>Got It</button>
            </div>
        </div>


    )
}

export default Modal