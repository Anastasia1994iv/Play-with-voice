import { SELECT_MANAGEMENT } from "../../../data.js";
import { setControlMethod } from '../game.component.js'; 

export function setSelectPlayer() {
  const element = document.createElement("div");

  
  const select = document.createElement("select");
  select.id = "select";
  const selectLabel = document.createElement("label");
  selectLabel.textContent = "Select Management for Player1";
  selectLabel.setAttribute("for", "select");

  const options = SELECT_MANAGEMENT;

  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const option = document.createElement("option");
      option.textContent = options[key];
      option.value = options[key];
      select.append(option);
    }
  }


  select.addEventListener("change", (event) => {


    const selectedValue = event.target.value;
    setControlMethod(1, selectedValue);
  });

element.append(selectLabel, select);

return element;

}
