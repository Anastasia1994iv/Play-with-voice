import { stAllMenu } from '../../../data.js';

export function renderOptionsMenu(options) {
  const optionsMenu = stAllMenu();

  const element = document.createElement('div');
  element.classList = 'options-menu';

  for(let i = 0; i < optionsMenu.length; i++) {
    const category = optionsMenu[i];

const ulOption = document.createElement('ul');
ulOption.classList = 'liMenu'

ulOption.textContent = optionsMenu[i].value[0]





// Проверяем, является ли значение массива значениями
if (Array.isArray(category.value)) {
  // Проходим по каждому значению в массиве
  
  for (let j = 0; j < category.value.length; j++) {
      const value = category.value[j];
      
      // Создаем элемент списка (li) для значения
      const liMenu = document.createElement('li');
      liMenu.classList.add('li-option');
      
      // Устанавливаем текст элемента списка
      if (typeof value === 'object' && category.render) {
          // Если у категории есть функция рендеринга, используем ее для отображения объекта
          
          liMenu.textContent = category.render(value);
      } else {
          // В противном случае используем значение как есть
          liMenu.textContent = value;
      }
      
      // Добавляем элемент списка (li) в элемент списка (ul)
      ulOption.appendChild(liMenu);
  }
} else {
  // Если значение не массив, обработаем его соответствующим образом
  const liMenu = document.createElement('li');
  liMenu.classList.add('li-option');
  
  // Устанавливаем текст элемента списка в соответствии со значением категории
  liMenu.textContent = typeof category.render === 'function' ? category.render(category.value) : category.value;
  
  // Добавляем элемент списка (li) в элемент списка (ul)
  ulOption.appendChild(liMenu);
}

// Добавляем элемент списка (ul) в контейнер меню
element.appendChild(ulOption);
}

return element;
}

