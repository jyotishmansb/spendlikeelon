import { useRef, useState } from 'react';
import './result.css';
import { finalMessages } from '../../data/finalSpeech';



const Result = ({ total, id, qty, itemData, setShowResult, spentPercent }) => {
    const purchasedItems = itemData.filter(item => qty[item.id] > 0);
    const receiptRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

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
        if (!receiptRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            await downloadUsingCanvas();
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    }


    const downloadUsingCanvas = async () => {
        const element = receiptRef.current;
        if (!element) return;

        // Get computed styles from the original elements
        const containerStyle = window.getComputedStyle(element);
        const receiptBox = element.querySelector('.receipt-box');
        const receiptBoxStyle = receiptBox ? window.getComputedStyle(receiptBox) : null;
        const headerElement = element.querySelector('.receipt-header');
        const headerStyle = headerElement ? window.getComputedStyle(headerElement) : null;
        
        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const scale = 2; // For better quality
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        canvas.width = width * scale;
        canvas.height = height * scale;
        
        // Scale context for better quality
        ctx.scale(scale, scale);
        
        // Extract background color from original container or use default
        const bgColor = containerStyle.backgroundColor || '#ffffff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Get padding values
        const getPadding = (style) => {
            return {
                top: parseInt(style.paddingTop) || 20,
                right: parseInt(style.paddingRight) || 20,
                bottom: parseInt(style.paddingBottom) || 20,
                left: parseInt(style.paddingLeft) || 20
            };
        };
        
        const containerPadding = getPadding(containerStyle);
        
        // If there's a receipt box with different background, draw it
        if (receiptBoxStyle) {
            const boxBgColor = receiptBoxStyle.backgroundColor;
            if (boxBgColor && boxBgColor !== 'rgba(0, 0, 0, 0)' && boxBgColor !== 'transparent') {
                const boxPadding = getPadding(receiptBoxStyle);
                const boxElement = element.querySelector('.receipt-box');
                const boxRect = boxElement.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();
                
                // Calculate relative position
                const boxX = boxRect.left - elementRect.left;
                const boxY = boxRect.top - elementRect.top;
                
                ctx.fillStyle = boxBgColor;
                ctx.fillRect(boxX, boxY, boxRect.width, boxRect.height);
            }
        }
        
        // Draw content with original text colors
        let yPosition = containerPadding.top;
        
        // Get text color from original
        const textColor = containerStyle.color || '#000000';
        
        // Draw speech
        const speechElement = element.querySelector('.result-speech');
        if (speechElement) {
            const speechStyle = window.getComputedStyle(speechElement);
            ctx.font = `${speechStyle.fontStyle || 'normal'} ${speechStyle.fontWeight || 'normal'} ${speechStyle.fontSize || '14px'} ${speechStyle.fontFamily || 'Arial'}`;
            ctx.fillStyle = speechStyle.color || textColor;
            
            const speechLines = wrapText(ctx, speech, width - (containerPadding.left + containerPadding.right));
            speechLines.forEach(line => {
                ctx.fillText(line, containerPadding.left, yPosition);
                yPosition += parseInt(speechStyle.lineHeight) || 20;
            });
            yPosition += 20;
        }
        
        // Draw header with original styling
        if (headerElement && headerStyle) {
            // Check if header has background color
            const headerBg = headerStyle.backgroundColor;
            if (headerBg && headerBg !== 'rgba(0, 0, 0, 0)' && headerBg !== 'transparent') {
                ctx.fillStyle = headerBg;
                ctx.fillRect(containerPadding.left, yPosition - 15, width - (containerPadding.left + containerPadding.right), 40);
            }
            
            ctx.font = `${headerStyle.fontWeight || 'bold'} ${headerStyle.fontSize || '18px'} ${headerStyle.fontFamily || 'Arial'}`;
            ctx.fillStyle = headerStyle.color || textColor;
            ctx.fillText('Your spending with Elon\'s money', containerPadding.left, yPosition + 10);
            yPosition += 50;
        }
        
        // Draw items with original styling
        const itemElements = element.querySelectorAll('.cart-item');
        if (purchasedItems.length > 0) {
            purchasedItems.forEach((item, index) => {
                // Try to get style from actual item element
                if (itemElements[index]) {
                    const itemStyle = window.getComputedStyle(itemElements[index]);
                    ctx.font = `${itemStyle.fontSize || '14px'} ${itemStyle.fontFamily || 'Arial'}`;
                    ctx.fillStyle = itemStyle.color || textColor;
                    
                    // Check for background color on items
                    const itemBg = itemStyle.backgroundColor;
                    if (itemBg && itemBg !== 'rgba(0, 0, 0, 0)' && itemBg !== 'transparent') {
                        ctx.fillStyle = itemBg;
                        ctx.fillRect(containerPadding.left, yPosition - 15, width - (containerPadding.left + containerPadding.right), 25);
                        ctx.fillStyle = itemStyle.color || textColor;
                    }
                }
                
                // Draw item name
                ctx.fillText(item.name, containerPadding.left, yPosition);
                
                // Draw quantity (right-aligned)
                const qtyText = `x ${qty[item.id]}`;
                const qtyWidth = ctx.measureText(qtyText).width;
                ctx.fillText(qtyText, width - containerPadding.right - qtyWidth, yPosition);
                
                yPosition += 25;
            });
        } else {
            const noItemsElement = element.querySelector('.no-items-text');
            if (noItemsElement) {
                const noItemsStyle = window.getComputedStyle(noItemsElement);
                ctx.font = `${noItemsStyle.fontStyle || 'normal'} ${noItemsStyle.fontSize || '14px'} ${noItemsStyle.fontFamily || 'Arial'}`;
                ctx.fillStyle = noItemsStyle.color || '#999999';
                ctx.fillText('No Items', containerPadding.left, yPosition);
            }
            yPosition += 25;
        }
        
        // Draw separator if exists in original
        const resultBottom = element.querySelector('.result-bottom');
        if (resultBottom) {
            const bottomStyle = window.getComputedStyle(resultBottom);
            const borderTop = bottomStyle.borderTopWidth;
            if (borderTop && borderTop !== '0px') {
                yPosition += 10;
                ctx.strokeStyle = bottomStyle.borderTopColor || '#cccccc';
                ctx.lineWidth = parseInt(borderTop) || 1;
                ctx.beginPath();
                ctx.moveTo(containerPadding.left, yPosition);
                ctx.lineTo(width - containerPadding.right, yPosition);
                ctx.stroke();
                yPosition += 20;
            }
            
            // Apply background to totals section if exists
            const bottomBg = bottomStyle.backgroundColor;
            if (bottomBg && bottomBg !== 'rgba(0, 0, 0, 0)' && bottomBg !== 'transparent') {
                ctx.fillStyle = bottomBg;
                ctx.fillRect(containerPadding.left, yPosition - 10, width - (containerPadding.left + containerPadding.right), 60);
            }
        }
        
        // Draw totals with original styling
        const totalElement = element.querySelector('.total');
        if (totalElement) {
            const totalStyle = window.getComputedStyle(totalElement);
            ctx.font = `${totalStyle.fontWeight || 'normal'} ${totalStyle.fontSize || '14px'} ${totalStyle.fontFamily || 'Arial'}`;
            ctx.fillStyle = totalStyle.color || textColor;
            ctx.fillText(`Money Spent: ₹${total.toLocaleString('en-IN')}`, containerPadding.left, yPosition);
            yPosition += 30;
        }
        
        const percentElement = element.querySelector('.percent');
        if (percentElement) {
            const percentStyle = window.getComputedStyle(percentElement);
            ctx.font = `${percentStyle.fontWeight || 'normal'} ${percentStyle.fontSize || '14px'} ${percentStyle.fontFamily || 'Arial'}`;
            ctx.fillStyle = percentStyle.color || textColor;
            const percentValue = spentPercent === 0 || spentPercent === 100 
                ? spentPercent.toFixed(0) 
                : spentPercent.toFixed(2);
            ctx.fillText(`Percent Spent: ${percentValue}%`, containerPadding.left, yPosition);
        }
        
        // Helper function to wrap text
        function wrapText(context, text, maxWidth) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];
            
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = context.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                    currentLine = currentLine + ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    }

    return (
        <div className="result-modal">
            <div className="result-container" ref={receiptRef}>
                {/* <div className="cancel-icon"
                 onClick={() => { setShowResult(false) }}>x</div> */}

                <p className='result-speech'>{speech}</p>
                <div className="receipt-box" >
                    <p className='receipt-header'>Your spending with Elon's money</p>
                    <div className="receipt-item">



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

                        } </div>

                    <div className="result-bottom">
                        <div className="total"><span>Money Spend</span>₹{total.toLocaleString('en-IN')} </div>
                        <div className="percent"><span>percent Spend</span>{spentPercent === 0 || spentPercent === 100
                            ? spentPercent.toFixed(0) : spentPercent.toFixed(2)}  %</div>
                    </div>

                </div>
                <div className="result-cta">
                    <div className="spend-again" onClick={handleResetGame}>Spend Again</div>
                    <div className="result-share" onClick={handleDownload}
                     disabled={isDownloading}
                     style={{ padding: '10px 20px', cursor: isDownloading ? 'not-allowed' : 'pointer' }}
                  
                    >  {isDownloading ? 'Downloading...' : 'Download'}</div>

                </div>



            </div>



        </div>



    )
}

export default Result