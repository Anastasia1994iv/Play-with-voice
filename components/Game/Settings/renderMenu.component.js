import { stAllMenu } from '../../../data.js';
import { renderOptionsMenu } from './renderOptionMenu.component.js';

export function renderSettingsMenu(settingsName) {
const setAllMenu = stAllMenu();


const element = document.createElement('div');
element.classList = 'settings-menu';

for(let i = 0; i < setAllMenu.length; i++) {
  const ulMenu = document.createElement('ul');
 ulMenu.classList = 'ulMenu'

 ulMenu.textContent = setAllMenu[i].name
 ulMenu.value = setAllMenu[i].name



 element.append(ulMenu)
}


return element
}