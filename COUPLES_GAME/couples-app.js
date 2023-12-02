(() => {
  // объявление пустых переменных firstCard и secondCard 
  let firstCard = null;
  let secondCard = null;
  let firstCardValue = null;
  let secondCardValue = null;
  let cardsNumber;
  let intervalID = null;

  // функция перемешивания массива пар-чисел на основе алгоритма Фишера-Йетса
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // функция запуска игры
  function startGame() {
    // форма создания игры
    let playContainer = document.createElement('div');
    playContainer.style.paddingTop = '30px';

    let form = document.createElement('form');
    let content = document.createElement('p');
    let input = document.createElement('input');
    let startButton = document.createElement('button');

    content.textContent = 'Количество карточек по вертикали/горизонтали:';
    input.classList.add('input');
    input.value = '4';
    input.style.marginRight = '30px';
    startButton.textContent = 'Начать игру';
    form.style.marginBottom = '15px';

    // создание таймера
    let timerContainer = document.createElement('div');
    let timerBlock = document.createElement('div');
    let timerWrapper = document.createElement('div');
    let timerContent = document.createElement('p');
    let timerUnit = document.createElement('span');

    timerContent.textContent = 'Игра завершится через:';
    timerUnit.textContent = 'сек.';
    timerBlock.classList.add('timer-block');
    timerBlock.style.border = '1px solid black';
    timerBlock.style.display = 'inline-block';
    timerBlock.style.textAlign = 'center';
    timerBlock.style.marginRight = '10px';
    timerBlock.style.width = '30px';
    timerBlock.style.height = '30px';
    timerBlock.textContent = '';
    timerWrapper.style.display = 'flex';
    timerWrapper.style.alignItems = 'center';

    timerContainer.append(timerContent);
    timerContainer.append(timerWrapper);
    timerWrapper.append(timerBlock);
    timerWrapper.append(timerUnit);

    // добавление событий очистки и создания игрового поля по настройкам формы, а также запуск таймера игры
    startButton.addEventListener('click', () => {
      deletePlayingField();
      createPlayingField(playContainer, intervalID);
      timerBlock.textContent = '60';
      clearInterval(intervalID);
      intervalTimer();

      // скрытие кнопки рестарта при новом запуске игры
      let restartButton = document.querySelector('.button-restart');
      restartButton.style.visibility = 'hidden';
    });

    form.append(content);
    form.append(input);
    form.append(startButton);
    playContainer.append(form);
    playContainer.append(timerContainer);

    return {
      playContainer,
      form,
      timerContainer,
      timerBlock,
      clearInterval,
      intervalTimer,
    };
  }

  // объявление функции интервального запуска функции timer с периодом 1 сек
  function intervalTimer() {
    intervalID = setInterval(timer, 1000);
  }

  // объявление функции обратного отсчета таймера    
  function timer() {
    let timerBlock = document.querySelector('.timer-block');
    let currentCount = parseInt(timerBlock.textContent);

    if (currentCount > 0) {
      timerBlock.textContent = currentCount - 1;
    } else if (currentCount == 0) {
      clearInterval(intervalID);
      timerBlock.textContent = '';

      loseAlertAndStopTimer();
    }
  }

  // создание игрового поля
  function createPlayingField(playContainer, intervalID) {
    let couplesArray = [];
    createCouplesArr(couplesArray);

    let row = document.createElement('div');
    row.classList.add('row');
    row.style.paddingTop = '30px';

    // создание для каждого элемента массива кнопки с текстом соответствующего числа
    for (let i = 0; i < couplesArray.length; i++) {
      let button = document.createElement('button');
      let buttonWrapper = document.createElement('div');
      let number = 12 / Math.sqrt(couplesArray.length);

      button.classList.add('button-card');
      button.textContent = `${couplesArray[i]}`;
      button.style.width = '100%';
      button.style.height = '70px';
      button.style.marginBottom = '30px';
      button.style.color = 'transparent';

      if (Math.sqrt(couplesArray.length) < 8) {
        buttonWrapper.classList.add(`col-${number}`);
      } else {
        buttonWrapper.classList.add('col-1');
      }

      // добавление на кнопке события
      button.addEventListener('click', () => {
        // отображение значения по клику
        button.style.color = '';

        // установка кнопки неактивной для предотвращения повторного клика
        button.disabled = true;

        // проверка содержимого переменных firstCard и secondCard на пустоту и их заполнение
        // условие открытия/закрытия выбранных попарно карт при непустых переменных firstCard и secondCard
        openOrCloseCards(button);

        // проверка возможности появления кнопки перезапуска игры
        checkOpenCards();

        // установка кнопки перезапуска игры видимой
        restartButtonVisible();

        // сообщение о победе в игре и сброс таймера
        winAlertAndStopTimer(intervalID);
      });

      buttonWrapper.append(button);
      row.append(buttonWrapper);
    }

    playContainer.append(row);
  }

  function openOrCloseCards(button) {
    if (firstCard !== null) {
      if (secondCard !== null) {
        equalityCheck(button);
      } else {
        secondCardSetup(button);
      }
    } else {
      firstCardSetup(button);
    }
  }

  function equalityCheck(button) {
    if (firstCardValue != secondCardValue) {
      firstCard.style.color = 'transparent';
      secondCard.style.color = 'transparent';
      firstCard.disabled = false;
      secondCard.disabled = false;
      firstCard = button;
      secondCard = null;
      firstCardValue = button.textContent;
      secondCardValue = null;
    } else {
      firstCard.style.color = '';
      secondCard.style.color = '';
      firstCard.disabled = true;
      secondCard.disabled = true;
      firstCard = button;
      secondCard = null;
      firstCardValue = button.textContent;
      secondCardValue = null;
    }
  }

  function firstCardSetup(button) {
    firstCard = button;
    firstCardValue = button.textContent;
  }

  function secondCardSetup(button) {
    secondCard = button;
    secondCardValue = button.textContent;
  }

  function restartButtonVisible() {
    if (checkOpenCards()) {
      let restartButton = document.querySelector('.button-restart');
      restartButton.style.visibility = 'visible';
    }
  }

  function winAlertAndStopTimer(intervalID) {
    let timerBlock = document.querySelector('.timer-block');

    if (checkOpenCards()) {
      alert('Ура, Вы выиграли! Желаете сыграть еще раз?');
      clearInterval(intervalID);
      timerBlock.textContent = '';
    }
  }

  function loseAlertAndStopTimer() {
    // сброс игрового поля по истечении таймера
    let buttonCards = document.querySelectorAll('.button-card');
    for (let buttonCard of buttonCards) {
      buttonCard.style.color = 'transparent';
      buttonCard.disabled = false;
    }

    // сообщение о поражении в игре
    alert('Игра окончена. Увы, Вы не успели открыть все карты. Попробуйте еще раз.');
  }

  // удаление предыдущего игрового поля
  function deletePlayingField() {
    let row = document.querySelector('.row');
    if (row) {
      row.remove();
    }
  }

  // функция заполнения массива пар чисел
  function createCouplesArr(arr) {
    createCardsNumber();

    fillingCouplesArray(arr);

    shuffle(arr);

    return arr;
  }

  function fillingCouplesArray(arr) {
    for (let i = 0; i < cardsNumber / 2; i++) {
      arr.push(i + 1);
      arr.push(i + 1);
    }
  }

  function createCardsNumber() {
    let input = document.querySelector('.input');

    if (input.value % 2 == 0 && input.value >= 2 && input.value <= 10) {
      cardsNumber = Math.pow(parseInt(input.value), 2);
    } else {
      cardsNumber = 16;
      input.value = '4';
    }
  }

  // функция создания кнопки рестарта игры при условии открытия всех пар
  function restartGame() {
    let restartButton = document.createElement('button');
    let restartButtonWrapper = document.createElement('div');

    restartButton.classList.add('button-restart');
    restartButton.textContent = 'Сыграть еще раз';
    restartButton.style.width = '200px';
    restartButton.style.height = '50px';
    restartButton.style.visibility = 'hidden';
    restartButtonWrapper.style.textAlign = 'center';

    // добавление на кнопку события рестарта игры
    restartButton.addEventListener('click', () => {
      let buttonCards = document.querySelectorAll('.button-card');
      let newCouplesArray = [];

      // установка кнопок карт активными и с прозрачным текстом
      for (let button of buttonCards) {
        button.style.color = 'transparent';
        button.disabled = false;

        // получение массива старых значений карт
        let cardValue = parseInt(button.textContent);

        newCouplesArray.push(cardValue);
      }

      // перемешивание массива старых значений и добавление их в содержимое кнопок карт
      shuffle(newCouplesArray);

      for (let i = 0; i < newCouplesArray.length; i++) {
        buttonCards[i].textContent = `${newCouplesArray[i]}`;
      }

      // очистка массива для следующего перемешивания и скрытие кнопки перезапуска игры
      newCouplesArray = [];
      restartButton.style.visibility = 'hidden';

      // очистка значений переменных firstCard и secondCard
      firstCard = null;
      secondCard = null;
    });

    restartButtonWrapper.append(restartButton);

    return restartButtonWrapper;
  }

  // функция проверки открытия всех пар
  function checkOpenCards() {
    let buttonCards = document.querySelectorAll('.button-card');
    let checkCardsColor = [];

    for (let buttonCard of buttonCards) {
      checkCardsColor.push(buttonCard.style.color);
    }

    return checkCardsColor.every(cardColor => cardColor == '');
  }

  // функция создания игры
  function createCouplesApp(container) {
    let start = startGame();
    let restart = restartGame();


    // вывод формы старта игры
    container.append(start.playContainer);

    // браузер создает событие submit на форме по нажатию на Enter или на кнопку запуска игры
    start.playContainer.addEventListener('submit', (e) => {
      // эта строчка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();
    });

    // вывод кнопки рестарта игры
    container.append(restart);
  }

  // перенос в глобальную область видимости функции создания игры
  window.createCouplesApp = createCouplesApp;
})();