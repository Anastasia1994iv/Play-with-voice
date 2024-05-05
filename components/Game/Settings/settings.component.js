import { start } from "../../../data.js";

export function Settings() {
    const element = document.createElement("div");
    element.id = 'div-start-button'

    
    const startButton = document.createElement("button");
    startButton.append('START GAME')
    startButton.id = 'start-button';

    startButton.addEventListener('click', () => {
        start();
    });
    
    element.append(startButton)

    return element
}