import { speechData } from '../data/speechData';


export const getRandomMessage = (category, name = '') => {

    const messages = speechData[category];

    const randomIndex = Math.floor(Math.random() * messages.length);

    let message = messages[randomIndex];

    if (name) {
        message = message.replace('{name}', name);
    }

    return message;


}