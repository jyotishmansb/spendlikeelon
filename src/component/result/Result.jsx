import { useRef, useState } from 'react';
import './result.css';
import { finalMessages } from '../../data/finalSpeech';
import * as htmlToImage from 'html-to-image';
import { FaXTwitter } from "react-icons/fa6";


const Result = ({ total, id, qty, itemData, setShowResult, spentPercent }) => {
    const purchasedItems = itemData.filter(item => qty[item.id] > 0);
    const receiptRef = useRef(null);


    const domainCounts = purchasedItems.reduce((acc, item) => {
        const domain = item.domain;
        const quantity = qty[item.id];
        acc[domain] = (acc[domain] || 0) + quantity;
        return acc;
    }, {});

    const fun = domainCounts.fun || 0;
    const tech = domainCounts.tech || 0;
    const fastFood = domainCounts.fastFood || 0;
    console.log(fun, tech);
    let speech = "";

    if ((fun || 0) > tech) {
        const funMessages = finalMessages.fun;
        speech = funMessages[Math.floor(Math.random() * funMessages.length)];
    }
    else if ((tech || 0) > fun) {
        const techMessages = finalMessages.tech;
        speech = techMessages[Math.floor(Math.random() * techMessages.length)]
    }


    const handleResetGame = () => {
        // setShowResult(false);
        window.location.reload();
    }
    const handleDownload = async () => {
        if (!receiptRef.current) return;

        const dataUrl = await htmlToImage.toPng(receiptRef.current, {
            filter: (node) => {
                return !node.classList?.contains('result-cta');
            },
            quality: 1,
            pixelRatio: 2, // Higher pixel ratio for better quality
            style: {
                // Ensure borders are included
                boxSizing: 'border-box'
            },
            // Add padding to ensure borders are captured

            width: receiptRef.current.offsetWidth + 4, // Add extra width for borders
            height: receiptRef.current.offsetHeight + 4,

        });

        const link = document.createElement('a');
        link.download = `elon-money-receipt-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="result-modal">
            <div className="result-container" ref={receiptRef}>
               
                <p className='result-speech'>{speech}</p>
                <div className="receipt-box" >
                    <p className='receipt-header'>Your spending with Elon's money</p>
                    <div className="receipt-item">

                        {purchasedItems.length > 0 ?
                            (purchasedItems.map(item => (
                                <div key={item.id}>
                                    <div className="cart-item">
                                        <div className="item-title">{item.name}   <span className='space'>x</span>
                                            {qty[item.id]} </div>

                                    </div>
                                </div>
                            ))
                            )
                            : <div className="no-items-text">Spend some money Retard</div>

                        } </div>

                    <div className="result-bottom">
                        <div className="total"><span>Money Spend</span>₹{total.toLocaleString('en-IN')} </div>
                        <div className="percent"><span>percent Spend</span>{spentPercent === 0 || spentPercent === 100
                            ? spentPercent.toFixed(0) : spentPercent.toFixed(5  )}  %</div>
                    </div>

                </div>
                <div className="result-cta">
                    <div className="spend-again" onClick={handleResetGame}>Spend Again</div>
                    <div className="result-share" onClick={handleDownload}

                    >  download</div>

                </div>

<div className="madeby">
<a href="https://x.com/Jyotishman2u">made by <span> <FaXTwitter /></span></a>
<p>help me to become a Billionarie</p>
</div>

            </div>



        </div>



    )
}

export default Result