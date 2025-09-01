import { useEffect, useState } from 'react'
import elon from '../../assets/elon2.jpg'
import { itemData } from '../../data/itemData'
import { speechData } from '../../data/speechData';
import './home.css'
import Item from '../../component/item/Item'
import Modal from '../../component/modal/Modal'
import { PiGarageLight } from "react-icons/pi";
import Sidebar from '../../component/sidebar/Sidebar';
import { getRandomMessage } from '../../helper/message';
import Result from '../../component/result/Result';
import { VscSend } from "react-icons/vsc";



const Home = () => {
    const totalMoney = 33375000000000;

    const [total, setTotal] = useState(totalMoney);
    const [showModal, setShowModal] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [speech, setSpeech] = useState({ show: false, text: '', type: '' });
    const [showWelcome, setShowWelcome] = useState(false);
   

    const handleResult = () => {
        setShowResult(true)
    }


    const [qty, setQty] = useState(
        itemData.reduce((acc, item) => {
            acc[item.id] = 0;
            return acc
        }, {})
    )

    useEffect(() => {
        if (!showWelcome) {
            const timer = setTimeout(() => {
                setSpeech({
                    show: true,
                    text: getRandomMessage('welcome'),
                    type: 'welcome'
                });
                setShowWelcome(true)
            }, 2000)
            return () => clearTimeout(timer)

        }


    }, [showWelcome])

    const getSpeechMessage = (price, total, name) => {

        const spentAmount = totalMoney - total
       
        if (total < 100 && spentPercent > 95) {
            return {
                text: getRandomMessage('almostBroke', name),
                type: 'warning'

            };
        }

        if (total < 1000 && spentPercent > 80) {
            return {
                text: getRandomMessage('lowFunds', name),
                type: 'warning'

            };
        }


        if (spentPercent > 50 && spentPercent <= 80) {
            // Sometimes show halfway message, sometimes show price based message
            if (Math.random() > 0.7) {
                return {
                    text: getRandomMessage('halfSpent', name),
                    type: 'halfSpent'
                };
            }
        }

        if (price < 100) {
            return {
                text: getRandomMessage('low', name),
                type: 'low'
            };
        } else if (price >= 100 && price < 1000) {
            return {
                text: getRandomMessage('low', name),
                type: 'low'
            };
        } else if (price >= 1000 && price <5000) {
            return {
                text: getRandomMessage('low', name),
                type: 'low'
            };
        }

        else if (price >= 100000 && price < 10000000) {
            return {
                text: getRandomMessage('superHigh', name),
                type: 'superHigh'
            };
        }  else if (price >= 1000000 ) {
            return {
                text: getRandomMessage('ultraHigh', name),
                type: 'ultraHigh'
            };
        }





        // Occasionally show excited message
        if (Math.random() > 0.8) {
            return {
                text: getRandomMessage('excited', name),
                type: 'excited'
            };
        }

        return {
            text: `Enjoy your ${name}!`,
            type: 'normal'
        };

    }


    const handleBuy = (price, id, name, qty) => {

        if (total >= price) {

            setQty(
                prevQty => ({
                    ...prevQty, [id]: prevQty[id] + 1
                }));

            setTotal(prev => prev - price); 

            const message = getSpeechMessage(price,total , name)
            setSpeech({ show: true, ...message })


        }
        else
            setShowModal(true);

    }

    const handleSell = (price, id, name) => {
        const currentQty = qty[id];

        if (currentQty > 0) {


            setQty(
                prevQty => ({
                    ...prevQty, [id]: prevQty[id] - 1
                })
            )

            setTotal(prev => prev + price)

        }
    }


    useEffect(() => {
        if (speech.show) {
            const timer = setTimeout(() => {
                setSpeech({ show: false, text: '', type: '' })

            }, 3000)
            return () => clearTimeout(timer);
        }


    }, [speech])

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => {
        document.body.style.overflow = 'hidden';
        setIsSidebarOpen(true)

    }
const closeSidebar =()=>{
    document.body.style.overflow = '';
    setIsSidebarOpen(false)
}
    const spentPercent =((totalMoney - total) / totalMoney) * 100;

    return (
        <div className="home">

            <div className="elon-money">
                <div className="elon-image"><img src={elon} alt="" />
                    {speech.show && (<div className="speech-box">
                        <div className="speech-text">{speech.text}</div>
                        <div className="speech-arrow"></div>
                    </div>)}

                </div>
                <div className="middle">
                    <h1>Spend Like Elon</h1>
                    <div className="money">₹{total.toLocaleString('en-IN')}</div>
                    <div className="money-percent">{spentPercent === 0 || spentPercent === 100 
                    ? spentPercent.toFixed(0): spentPercent.toFixed(5)} % spent</div>
                </div>

                <div className="cart" onClick={openSidebar}>Cart</div>
                <div className="result"  onClick={handleResult}>End</div>
            </div>
            <div className="items-container">
                {
                    itemData.map(({ id, name, price, image }) => {
                        return <Item key={id} name={name} price={price} qty={qty[id]}
                            image={image}
                            handleBuy={() => handleBuy(price, id, name, qty)}
                            handleSell={() => handleSell(price, id, name, qty)}

                        />
  
                    })
                }
            </div>

            {showModal && <Modal setShowModal={setShowModal} total={total} />}

            {<Sidebar total={totalMoney - total} isOpen={isSidebarOpen}
                setIsSidebarOpen={closeSidebar} qty={qty} itemData={itemData}
                 spentPercent={spentPercent} />}


            {showResult && <Result total={totalMoney - total} qty={qty} itemData={itemData} 
            setShowResult={setShowResult} 
                 spentPercent={spentPercent}/>}


        </div>
    )
}

export default Home