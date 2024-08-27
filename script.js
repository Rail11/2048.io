document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let popup = document.querySelector('.popup'),
        popupMessage = document.querySelector('.popup__message'),
        popupButton = document.querySelector('.popup__button'),
        resultsArray = [];

    popupButton.addEventListener('click', function () {
        popup.style.display = 'none';
        startGame(5);
    });

    function startGame(gridSize) {
        // Создание многомерного массива для хранения плиток.
        function createTilesArray() {
            let tilesArray = [];

            for (let i = 0; i < gridSize; i++) {
                tilesArray.push([]);

                for (let j = 0; j < gridSize; j++) {
                    tilesArray[i].push(0);
                }
            }

            return tilesArray;
        }

        let tilesArray = createTilesArray(),
            scoreValue = document.querySelector('.score__value'),
            hours = document.querySelector('.time__hours'),
            minutes = document.querySelector('.time__minutes'),
            seconds = document.querySelector('.time__seconds');

        scoreValue.textContent = '0';
        hours.textContent = '00';
        minutes.textContent = '00';
        seconds.textContent = '00';

        let stopwatch = setInterval(() => {
            if (+seconds.textContent == 59) {
                seconds.textContent = '00';
                if (+minutes.textContent == 59) {
                    minutes.textContent = '00';
                    if (+hours.textContent >= 9) {
                        hours.textContent = +hours.textContent + 1;
                    } else {
                        hours.textContent = '0' + (+hours.textContent + 1);
                    }
                } else if (+minutes.textContent >= 9) {
                    minutes.textContent = +minutes.textContent + 1;
                } else {
                    minutes.textContent = '0' + (+minutes.textContent + 1);
                }
            } else if (+seconds.textContent >= 9) {
                seconds.textContent = +seconds.textContent + 1;
            } else {
                seconds.textContent = '0' + (+seconds.textContent + 1);
            } 
        }, 1000);

        function writeDownTheResult() {
            let hours = document.querySelector('.time__hours').textContent,
                minutes = document.querySelector('.time__minutes').textContent,
                seconds = document.querySelector('.time__seconds').textContent,
                totalTime = +seconds + minutes * 60 + hours * 60 * 60,
                result = [totalTime, +hours, +minutes, +seconds],
                results = document.querySelector('.results__time');
            
            results.innerHTML = '';

            resultsArray.push(result);

            function compareFn(a, b) {
                return a[0] - b[0];
            }

            resultsArray.sort(compareFn);

            for (let i = 0; i < resultsArray.length; i++) {
                let div = document.createElement('div'),
                    hours = resultsArray[i][1];
                    minutes = resultsArray[i][2];
                    seconds = resultsArray[i][3];
                
                if (hours < 10) {
                    hours = '0' + hours;
                }

                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }

                div.classList.add('results__time');

                div.innerHTML = `
                    <span class="results__hours">${hours}</span>h:
                    <span class="results__minutes">${minutes}</span>m:
                    <span class="results__seconds">${seconds}</span>s
                `;
                
                results.append(div);
            }
        }

        // Создание вёрстки клеток исходя из gridSize.
        function createGrid() {
            let grid = document.querySelector('.grid');

            for (let i = 0; i < gridSize; i++) {
                let gridRow = document.createElement('div');

                gridRow.classList.add('grid__row');

                grid.append(gridRow);

                for (let j = 0; j < gridSize; j++) {
                    let gridCell = document.createElement('div');

                    gridCell.classList.add('grid__cell');

                    gridRow.append(gridCell);
                }
            }
        }

        // Получение случайного числа в диапозоне от 0 до указаного в gridSize.
        function getRandomNum() {
            return Math.floor(Math.random() * gridSize);
        }

        // Получение числа 2 или 4.
        function get2or4() {
            let tileValue = 0,
                randomNum = Math.floor(Math.random() * 100) + 1;

            if (randomNum <= 90) {
                tileValue = 2;
            } else {
                tileValue = 4;
            }
            return tileValue;
        }

        // Получение true, если есть место в tilesArray.
        function checkEmptyTileInTilesArray() {
            let answer = false;

            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    if (tilesArray[i][j] == 0) {
                        answer = true;

                        break;
                    }
                }
            }

            return answer;
        }

        // Создание плитки в вёрстке и в многомерном массиве.
        function createTile() {
            try {
                let tileX,
                    tileY,
                    tileValue = get2or4();

                if (checkEmptyTileInTilesArray()) {
                    // Получение координат для расположение в многомерном массиве пока значение в координатах не будет равно 0.
                    do {
                        tileX = getRandomNum();
                        tileY = getRandomNum();
                    } while (tilesArray[tileY][tileX] != 0);
                }

                let tile = document.createElement('div'),
                    grid = document.querySelector('.grid');

                tile.textContent = tileValue;

                tile.classList.add(`tile`);
                tile.classList.add(`tile-${tileValue}`);

                tile.setAttribute('data-x', tileX);
                tile.setAttribute('data-y', tileY);
                tile.setAttribute('data-value', tileValue);

                // Получение номера клетки, в которой будет расположена плитка.
                let cellNum = gridSize * tileY + tileX,
                    // Получение клетки, где будет расположена плитка.
                    cell = document.querySelectorAll('.grid__cell')[`${cellNum}`];

                tilesArray[tileY][tileX] = tile;
                // Расположение плитки в вёрстке.
                tilesArray[tileY][tileX].style.left = `${cell.offsetLeft}px`;
                tilesArray[tileY][tileX].style.top = `${cell.offsetTop}px`;

                grid.appendChild(tile);
            } catch (e) {}
        }

        function createTileInCoordinates(x, y, value) {
            let tileX = x,
                tileY = y,
                tileValue = value;

            let tile = document.createElement('div'),
                grid = document.querySelector('.grid');

            tile.textContent = tileValue;

            tile.classList.add(`tile`);
            tile.classList.add(`tile-${tileValue}`);

            tile.setAttribute('data-x', tileX);
            tile.setAttribute('data-y', tileY);
            tile.setAttribute('data-value', tileValue);

            // Получение номера клетки, в которой будет расположена плитка.
            let cellNum = gridSize * tileY + tileX,
                // Получение клетки, где будет расположена плитка.
                cell = document.querySelectorAll('.grid__cell')[`${cellNum}`];

            tilesArray[tileY][tileX] = tile;
            // Расположение плитки в вёрстке.
            tilesArray[tileY][tileX].style.left = `${cell.offsetLeft}px`;
            tilesArray[tileY][tileX].style.top = `${cell.offsetTop}px`;

            grid.appendChild(tile);
        }

        function updateTilesPosition() {
            let tiles = document.querySelectorAll('.tile');

            for (let i = 0; i < tiles.length; i++) {
                let x = +tiles[i].getAttribute('data-x'),
                    y = +tiles[i].getAttribute('data-y');

                // Получение номера клетки, где будет расположена плитка.
                let cellNum = gridSize * y + x,
                    // Получение клетки и его положения, где потом будет расположена плитка.
                    cell = document.querySelectorAll('.grid__cell')[`${cellNum}`];

                // Расположение плитки в сетке.
                tiles[i].style.left = `${cell.offsetLeft}px`;
                tiles[i].style.top = `${cell.offsetTop}px`;
            }
        }

        function getArrayWithoutZero(array) {
            return array.filter(function (num) {
                return num != 0;
            });
        }

        function updateTilesValuesAndClasses() {
            setTimeout(() => {
                for (let i = 0; i < tilesArray.length; i++) {
                    for (let j = 0; j < tilesArray.length; j++) {
                        if (tilesArray[i][j] != 0) {
                            let tileValue = tilesArray[i][j].getAttribute('data-value');

                            tilesArray[i][j].textContent = tileValue;
                            tilesArray[i][j].className = '';
                            tilesArray[i][j].classList.add(`tile`);
                            tilesArray[i][j].classList.add(`tile-${tileValue}`);
                        }
                    }
                }
            }, 100);
        }

        // Складывание и удаление плиток влево и назначение новых позиций и подсчёт очков.
        function stackingAndRemovingTilesToTheLeft() {
            let tilesForRemove = [];

            for (let i = 0; i < tilesArray.length; i++) {
                tilesArray[i] = getArrayWithoutZero(tilesArray[i]);

                for (let j = 0; j < tilesArray[i].length - 1; j++) {
                    if (tilesArray[i][j].getAttribute('data-value') == tilesArray[i][j + 1].getAttribute('data-value')) {
                        tilesArray[i][j].setAttribute('data-value', +tilesArray[i][j].getAttribute('data-value') * 2);
                        scoreValue.textContent = +scoreValue.textContent + +tilesArray[i][j].getAttribute('data-value');

                        tilesArray[i][j + 1].setAttribute('data-x', j);

                        tilesForRemove.push(tilesArray[i][j + 1]);

                        tilesArray[i].splice(j + 1, 1);
                    }
                }

                for (let j = 0; j < tilesArray[i].length; j++) {
                    tilesArray[i][j].setAttribute('data-x', j);
                }

                // Добавление нулей в конец массива.
                while (tilesArray[i].length < gridSize) {
                    tilesArray[i].push(0);
                }
            }

            setTimeout(() => {
                for (let i = 0; i < tilesForRemove.length; i++) {
                    tilesForRemove[i].remove();
                }
            }, 100);
        }

        // Складывание и удаление плиток вправо и назначение новых позиций и подсчёт очков.
        function stackingAndRemovingTilesToTheRight() {
            let tilesForRemove = [];

            for (let i = 0; i < tilesArray.length; i++) {
                tilesArray[i] = getArrayWithoutZero(tilesArray[i]);

                let dataX = gridSize - 1;

                for (let j = tilesArray[i].length - 1; j > 0; j--) {

                    if (tilesArray[i][j].getAttribute('data-value') == tilesArray[i][j - 1].getAttribute('data-value')) {
                        tilesArray[i][j].setAttribute('data-value', tilesArray[i][j].getAttribute('data-value') * 2);
                        scoreValue.textContent = +scoreValue.textContent + +tilesArray[i][j].getAttribute('data-value');

                        tilesArray[i][j - 1].setAttribute('data-x', dataX);
                        tilesArray[i][j].setAttribute('data-x', dataX);

                        tilesForRemove.push(tilesArray[i][j - 1]);

                        tilesArray[i].splice(j - 1, 1);
                        j--;
                    } else {
                        tilesArray[i][j].setAttribute('data-x', dataX);
                    }
                    dataX--;
                }

                while (tilesArray[i].length < gridSize) {
                    tilesArray[i].unshift(0);
                }

                for (let j = 0; j < tilesArray[i].length; j++) {
                    if (tilesArray[i][j]) {
                        tilesArray[i][j].setAttribute('data-x', j);
                    }
                }
            }

            setTimeout(() => {
                for (let i = 0; i < tilesForRemove.length; i++) {
                    tilesForRemove[i].remove();
                }
            }, 100);
        }

        function getArrayFromColumn(i) {
            let array = [];

            for (let k = 0; k < tilesArray.length; k++) {
                array.push(tilesArray[k][i]);
            }

            return array;
        }

        function stackingAndRemovingTilesToTheUp() {
            let tilesForRemove = [];

            for (let i = 0; i < tilesArray.length; i++) {
                let column = getArrayFromColumn(i),
                    array = getArrayWithoutZero(column);


                for (let j = 0; j < array.length - 1; j++) {
                    if (array[j].getAttribute('data-value') == array[j + 1].getAttribute('data-value')) {
                        array[j].setAttribute('data-value', +array[j].getAttribute('data-value') * 2);
                        scoreValue.textContent = +scoreValue.textContent + +array[j].getAttribute('data-value');

                        array[j + 1].setAttribute('data-y', j);

                        tilesForRemove.push(array[j + 1]);

                        array.splice(j + 1, 1);
                    }
                }

                for (let j = 0; j < array.length; j++) {
                    array[j].setAttribute('data-y', j);
                }

                while (array.length < gridSize) {
                    array.push(0);
                }

                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArray[j].splice(i, 1, array[j]);
                }
            }

            setTimeout(() => {
                for (let i = 0; i < tilesForRemove.length; i++) {
                    tilesForRemove[i].remove();
                }
            }, 100);
        }

        function stackingAndRemovingTilesToTheDown() {
            let tilesForRemove = [];

            for (let i = 0; i < tilesArray.length; i++) {
                let column = getArrayFromColumn(i),
                    array = getArrayWithoutZero(column),
                    dataY = gridSize - 1;

                for (let j = array.length - 1; j > 0; j--) {
                    if (array[j].getAttribute('data-value') == array[j - 1].getAttribute('data-value')) {
                        array[j].setAttribute('data-value', array[j].getAttribute('data-value') * 2);
                        scoreValue.textContent = +scoreValue.textContent + +array[j].getAttribute('data-value');

                        array[j - 1].setAttribute('data-y', dataY);
                        array[j].setAttribute('data-y', dataY);

                        tilesForRemove.push(array[j - 1]);

                        array.splice(j - 1, 1);
                        j--;
                    } else {
                        array[j].setAttribute('data-y', dataY);
                    }
                    dataY--;
                }

                while (array.length < gridSize) {
                    array.unshift(0);
                }

                for (let j = 0; j < array.length; j++) {
                    if (array[j]) {
                        array[j].setAttribute('data-y', j);
                    }
                }

                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArray[j].splice(i, 1, array[j]);
                }
            }

            setTimeout(() => {
                for (let i = 0; i < tilesForRemove.length; i++) {
                    tilesForRemove[i].remove();
                }
            }, 100);
        }

        function checkingMovesAndEndOfGame() {
            let answer;

            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length - 1; j++) {
                    if (tilesArray[i][j].getAttribute('data-value') == tilesArray[i][j + 1].getAttribute('data-value')) {
                        answer = true;
                    }
                }
            }

            for (let i = 0; i < tilesArray.length - 1; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    if (tilesArray[i][j].getAttribute('data-value') == tilesArray[i + 1][j].getAttribute('data-value')) {
                        answer = true;
                    }
                }
            }

            if (answer != true) {
                clearInterval(stopwatch);
                clearTilesArray();
                setTimeout(() => {
                    popupMessage.textContent = 'Game Over!';
                    popup.style.display = 'flex';
                    clearGrid();
                }, 100);
            }

            return answer;
        }

        function check2048() {
            let answer = false;
            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    try {
                        if (tilesArray[i][j].getAttribute('data-value') === '2048') {
                            answer = true;
                            clearInterval(stopwatch);
                            clearTilesArray();
                            writeDownTheResult();
                            setTimeout(() => {
                                popupMessage.textContent = 'You Won!';
                                popup.style.display = 'flex';
                                clearGrid();
                            }, 100);
                        }
                    } catch (error) {}
                }
            }

            return answer;
        }

        function clearTilesArray() {
            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArray[i][j] = 0;
                }
            }
        }

        function clearGrid() {
            let grid = document.querySelector('.grid');

            grid.innerHTML = '';
        }

        function moveLeft() {
            let tilesArrayCopy = [];

            for (let i = 0; i < gridSize; i++) {
                tilesArrayCopy.push([]);           
            }

            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArrayCopy[i][j] = tilesArray[i][j];
                }
            }

            stackingAndRemovingTilesToTheLeft();
            updateTilesPosition();
            updateTilesValuesAndClasses();

            function checkDifferenceInArray() {
                let result = false;

                for (let i = 0; i < tilesArray.length; i++) {
                    for (let j = 0; j < tilesArray.length; j++) {
                        if (tilesArray[i][j] != tilesArrayCopy[i][j]) {
                            result = true;

                            break;
                        }
                    }
                }
                return result;
            }

            if (check2048() != true && checkDifferenceInArray() === true) {
                createTile();
            }

            if (checkEmptyTileInTilesArray() == false) {
                checkingMovesAndEndOfGame();
            }
        }

        function moveRight() {
            let tilesArrayCopy = [];

            for (let i = 0; i < gridSize; i++) {
                tilesArrayCopy.push([]);           
            }

            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArrayCopy[i][j] = tilesArray[i][j];
                }
            }

            stackingAndRemovingTilesToTheRight();
            updateTilesPosition();
            updateTilesValuesAndClasses();

            function checkDifferenceInArray() {
                let result = false;

                for (let i = 0; i < tilesArray.length; i++) {
                    for (let j = 0; j < tilesArray.length; j++) {
                        if (tilesArray[i][j] != tilesArrayCopy[i][j]) {
                            result = true;

                            break;
                        }
                    }
                }

                return result;
            }

            if (check2048() != true && checkDifferenceInArray() === true) {
                createTile();
            }

            if (checkEmptyTileInTilesArray() == false) {
                checkingMovesAndEndOfGame();
            }
        }

        function moveUp() {
            let tilesArrayCopy = [];

            for (let i = 0; i < gridSize; i++) {
                tilesArrayCopy.push([]);           
            }

            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArrayCopy[i][j] = tilesArray[i][j];
                }
            }
            
            stackingAndRemovingTilesToTheUp();
            updateTilesPosition();
            updateTilesValuesAndClasses();

            function checkDifferenceInArray() {
                let result = false;

                for (let i = 0; i < tilesArray.length; i++) {
                    for (let j = 0; j < tilesArray.length; j++) {
                        if (tilesArray[i][j] != tilesArrayCopy[i][j]) {
                            result = true;

                            break;
                        }
                    }
                }

                return result;
            }

            if (check2048() != true && checkDifferenceInArray() === true) {
                createTile();
            }

            if (checkEmptyTileInTilesArray() == false) {
                checkingMovesAndEndOfGame();
            }
        }

        function moveDown() {
            let tilesArrayCopy = [];

            for (let i = 0; i < gridSize; i++) {
                tilesArrayCopy.push([]);           
            }

            for (let i = 0; i < tilesArray.length; i++) {
                for (let j = 0; j < tilesArray.length; j++) {
                    tilesArrayCopy[i][j] = tilesArray[i][j];
                }
            }

            stackingAndRemovingTilesToTheDown();
            updateTilesPosition();
            updateTilesValuesAndClasses();

            function checkDifferenceInArray() {
                let result = false;

                for (let i = 0; i < tilesArray.length; i++) {
                    for (let j = 0; j < tilesArray.length; j++) {
                        if (tilesArray[i][j] != tilesArrayCopy[i][j]) {
                            result = true;

                            break;
                        }
                    }
                }

                return result;
            }

            if (check2048() != true && checkDifferenceInArray() === true) {
                createTile();
            }

            if (checkEmptyTileInTilesArray() == false) {
                checkingMovesAndEndOfGame();
            }
        }

        // Движения для кнопок.
        document.addEventListener(`keydown`, (event) => {
            if (event.code == `ArrowLeft`) {
                moveLeft();
            }
            if (event.code == `ArrowRight`) {
                moveRight();
            }
            if (event.code == `ArrowUp`) {
                moveUp();
            }
            if (event.code == `ArrowDown`) {
                moveDown();
            }
        });

        function mouseMove() {
            let grid = document.querySelector('.grid'),
                gridWidth = grid.offsetWidth,
                mouseDownX,
                mouseDownY,
                mouseUpX,
                mouseUpY;

            grid.addEventListener('mousedown', (event) => {
                event.preventDefault();

                mouseDownX = event.clientX;
                mouseDownY = event.clientY;
            });

            grid.addEventListener('mouseup', (event) => {
                event.preventDefault();

                mouseUpX = event.clientX;
                mouseUpY = event.clientY;

                if ((mouseDownX - mouseUpX) > (gridWidth / 10) && (mouseDownX - mouseUpX) > (mouseDownY - mouseUpY) && (mouseDownX - mouseUpX) > (mouseUpY - mouseDownY)) {
                    console.log('Left');
                    moveLeft();
                }

                if ((mouseUpX - mouseDownX) > (gridWidth / 10) && (mouseUpX - mouseDownX) > (mouseDownY - mouseUpY) && (mouseUpX - mouseDownX) > (mouseUpY - mouseDownY)) {
                    console.log('Right');
                    moveRight();
                }

                if ((mouseDownY - mouseUpY) > (gridWidth / 10) && (mouseDownY - mouseUpY) > (mouseUpX - mouseDownX) && (mouseDownY - mouseUpY) > (mouseDownX - mouseUpX)) {
                    console.log('Up');
                    moveUp();
                }

                if ((mouseUpY - mouseDownY) > (gridWidth / 10) && (mouseUpY - mouseDownY) > (mouseUpX - mouseDownX) && (mouseUpY - mouseDownY) > (mouseDownX - mouseUpX)) {
                    console.log('Down');
                    moveDown();
                }
            });
        }

        function touchMove() {
            let grid = document.querySelector('.grid'),
                gridWidth = grid.offsetWidth,
                touchStartX,
                touchStartY,
                touchEndX,
                touchEndY;
                
            grid.addEventListener('touchstart', (event) => {
                event.preventDefault();
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
            });

            grid.addEventListener('touchend', (event) => {
                event.preventDefault();
                touchEndX = event.changedTouches[0].clientX;
                touchEndY = event.changedTouches[0].clientY;

                if ((touchStartX - touchEndX) > (gridWidth / 10) && (touchStartX - touchEndX) > (touchStartY - touchEndY) && (touchStartX - touchEndX) > (touchEndY - touchStartY)) {
                    console.log('Left');
                    moveLeft();
                }

                if ((touchEndX - touchStartX) > (gridWidth / 10) && (touchEndX - touchStartX) > (touchStartY - touchEndY) && (touchEndX - touchStartX) > (touchEndY - touchStartY)) {
                    console.log('Right');
                    moveRight();
                }

                if ((touchStartY - touchEndY) > (gridWidth / 10) && (touchStartY - touchEndY) > (touchEndX - touchStartX) && (touchStartY - touchEndY) > (touchStartX - touchEndX)) {
                    console.log('Up');
                    moveUp();
                }

                if ((touchEndY - touchStartY) > (gridWidth / 10) && (touchEndY - touchStartY) > (touchEndX - touchStartX) && (touchEndY - touchStartY) > (touchStartX - touchEndX)) {
                    console.log('Down');
                    moveDown();
                }
            });
        }
        
        createGrid();
        // createTile();
        // createTile();
        createTileInCoordinates(0, 0, 1024);
        createTileInCoordinates(1, 0, 1024);
        mouseMove();
        touchMove();
    }
});