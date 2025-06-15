const map = document.getElementById('map')
let width = 60
let height = 40
time = 100
queue = []
testConstruction = [
    88, 146, 148, 196, 197, 204, 205, 218, 219, 255,
    259, 264, 265, 278, 279, 304, 305, 314, 320, 324,
    325, 364, 365, 374, 378, 380, 381, 386, 388, 434,
    440, 448, 495, 499, 556, 557
] // Эта конструкция будет загружаться при нажатии кнопки 'Upload', изменить её можно скопировав из консоли новую конструкцию
// Новая конструкция выводится в консоль при нажатии кнопки 'Save'

// Создаём карту
function create_map() {
    for(i = 0; i < height; i++) {
        div = document.createElement('div')
        div.classList.add('str')
        div = map.appendChild(div)
        for(j = 0; j < width; j++) {
            button = document.createElement('button')
            id = i * width + j
            button.id = id
            button.classList.add('map_button')
            button.classList.add('white')
            button.row = Math.floor(id / width)
            button.column = (id % width)
            button.possibility = []
            detect_possibility(button) // С каких сторон можно проверить соседей
            button.addEventListener('click', function() {
                paint(this) // Перекрашиваем клетку
                console.log('row: ' + this.row + ' col: ' + this.column + ' id: ' + this.id + ' became ' + this.classList)
            })
            div.appendChild(button)
        }
    }
}

// Определяем возможно ли проверить соседей с каждой стороны клетки
function detect_possibility(element) {
    if(element.column != 0) {
        element.possibility.push('l')
        
    }
    if(element.column != width - 1) {
        element.possibility.push('r')
        
    }
    if(element.row != 0) {
        element.possibility.push('u')
        
    }
    if(element.row != height - 1) {
        element.possibility.push('d')
        
    }
    if(element.column != 0 && element.row != 0) {
        element.possibility.push('lu')
        
    }
    if(element.column != 0 && element.row != height - 1) {
        element.possibility.push('ld')
        
    }
    if(element.column != width - 1 && element.row != 0) {
        element.possibility.push('ru')
        
    }
    if(element.column != width - 1 && element.row != height - 1) {
        element.possibility.push('rd')
        
    }
}

// Проверяем соседние клетки на наличие класса 'black'
function check_black_neighbors(element) {
    black_neighbors = 0
    id = Number(element.id)
    directions = {
        'l': id - 1, 'r': id + 1, 'u': id - width, 'd': id + width,
        'lu': id - width - 1, 'ld': id + width - 1, 'ru': id - width + 1, 'rd': id + width + 1
    } // Объект, со значениями id соседних клеток
    
    // Создаем копию массива possibility для работы
    possibilities = [...element.possibility]
    
    for(let i = 0; i < possibilities.length; i++) {
        neighbor_id = possibilities[i] // Выбираем соседнюю клетку для проверки
        neighbor = document.getElementById(directions[neighbor_id]) // Определяем её id
        if(neighbor && neighbor.classList.contains('black')) {
            black_neighbors++
        } // Если клетка чёрная, то к количеству чёрных соседей прибавляется 1
    }
    return black_neighbors
}

// Меняем цвет клетки
function paint(element) {
    if(element.classList.contains('white')) {
        element.classList.remove('white')
        element.classList.add('black')
    } else {
        element.classList.remove('black')
        element.classList.add('white')
    }
}

// Добавляем id элемента в очередь на перекраску
function next_paint_begin(element) {
    queue.push(element.id)
}

// Перекрашиваем все клетки из очереди
function next_paint_end() {
    for(i = 0; i < queue.length;) {
        el = document.getElementById(queue[i])
        paint(el)
        queue.shift()
    }
}
// Очередь нужна для того, чтобы перекрашивать клетки только после того, как определены все клетки, которые нужно перекрасить
// Иначе это приведёт к неправильному определению клеток, требующих перекраски

// Выводим в консоль текущую конструкцию (массив с id всех текущих чёрных клеток)
function save_Construction() {
    black_cells = document.getElementsByClassName('black')
    black_cells_id = []
    for(i = 0; i < black_cells.length; i ++) {
        black_cells_id[i] = Number(black_cells[i].id)
    }
    console.log(black_cells_id)
}

// Загружаем тестовую конструкцию
function upload_testConstruction() {
    for(i = 0; i < testConstruction.length; i++) {
        element = document.getElementById(testConstruction[i])
        paint(element)
    }
}

// Запускаем по-итерационное воспроизведение
function start() {
    buttons = document.getElementsByClassName('map_button')
    interval = setInterval(() => {
    for(i = 0; i < buttons.length; i++) {
        cell = document.getElementById(i)
        neighbors = check_black_neighbors(cell)
        if(cell.classList.contains('white') && neighbors == 3) {
            next_paint_begin(cell)
        }
        if(cell.classList.contains('black') && (neighbors < 2 || neighbors > 3)) {
            next_paint_begin(cell)
        }
    }
    next_paint_end()
}, time)
}

create_map()