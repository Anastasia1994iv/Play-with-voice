import { validatePlayerNumberOrThrow } from "../../../../data.js";

export function Player(playerNumber) {
    // валидация входящих данных, бизнес инварианты
    validatePlayerNumberOrThrow(playerNumber)

    const element = document.createElement('img')

    element.src = `assets/images/player${playerNumber}.png`;

    return element;
}