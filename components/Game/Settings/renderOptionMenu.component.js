import { stAllMenu } from '../../../data.js';

export function renderOptionsMenu(options) {
  const optionsMenu = stAllMenu();

  const element = document.createElement('div');
  element.className = 'options-menu';
  

  for (let i = 0; i < optionsMenu.length; i++) {

    const divOption = document.createElement('div')
    divOption.classList = 'div-options'

    const divForSpan = document.createElement('div')
divForSpan.classList = 'select'

    const span = document.createElement('span')
    span.classList = 'span'

    const divButton = document.createElement('div')
    divButton.classList = 'caret'

    const category = optionsMenu[i];
    const ulOption = document.createElement('ul');

    // Если значение категории массив, обрабатываем его
    if (Array.isArray(category.value)) {
      // Устанавливаем текст content `ul` равным первому значению массива `value` 
      const firstValue = category.value[0];
      span.textContent = typeof firstValue === 'object' && category.render ? category.render(firstValue) : firstValue;

      // Обрабатываем остальные значения массива `value`
      for (let j = 1; j < category.value.length; j++) {
        const value = category.value[j];
        const liMenu = document.createElement('li');

        if (typeof value === 'object' && category.render) {
          liMenu.textContent = category.render(value);
        } else {
          liMenu.textContent = value;
        }

        ulOption.appendChild(liMenu);
      }
    } else {
      // Если `value` не массив, создаем элемент `li` и добавляем его в `ul`
      const liMenu = document.createElement('li');

      if (typeof category.value === 'object' && category.render) {
        // Если значение `value` является объектом и есть функция `render`, используем ее
        liMenu.textContent = category.render(category.value);
      } else {
        // В противном случае используем значение как есть
        liMenu.textContent = category.value;
      }

      ulOption.append(liMenu);
    }

    divForSpan.append(span,divButton)

    divOption.append(divForSpan, ulOption)

    // Добавляем элемент `ul` в контейнер меню
    element.append(divOption);
  }

  return element;
}



