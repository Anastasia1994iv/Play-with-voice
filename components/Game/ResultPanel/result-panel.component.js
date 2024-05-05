import { getCatchCount, getMissCount } from "../../../data.js";


export function ResultPanel() {
    const element = document.createElement("div");

    element.append(`PLAYER1 : ${getCatchCount().player1}, PLAYER2 : ${getCatchCount().player2}, MISS: ${(getMissCount())}`);

    return element;
}