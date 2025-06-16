const map = document.getElementById('map')
let width = 60
let height = 40
time = 100
queue = []
color = 'black'
max_food = 600
max_alive_cells = 60
food_ratio = 20
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
            button.food_around = []
            button.directions = {
                'l': id - 1, 'r': id + 1, 'u': id - width, 'd': id + width,
                'lu': id - width - 1, 'ld': id + width - 1, 'ru': id - width + 1, 'rd': id + width + 1,
                'here': id
            }
            //console.log(button.possibility)
            detect_possibility(button) // С каких сторон можно проверить соседей
            button.addEventListener('click', function() {
                paint_click(this) // Перекрашиваем клетку
            })
            div.appendChild(button)
        }
    }
}

// Определяем возможно ли проверить соседей с каждой стороны клетки
function detect_possibility(element) {
    element.possibility = []
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
    element.possibility.push('here')
}

// Проверяем соседние клетки на наличие класса 'black'
function check_black_neighbors(element) {
    black_neighbors = 0
    id = Number(element.id)
    directions = element.directions
    
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

// Меняем цвет, которым будем красить клетки
function change_color(element) {
    color = element.classList[0]
    console.log('Color changed to ' + color)
}
// Удаляем класс, указывающий цвет клетки
function clear_color(element) {
    element.classList.remove('white')
    element.classList.remove('black')
    element.classList.remove('food')
    element.classList.remove('alive_cell')
    element.classList.remove('dead_cell')
}

function place_food(position) {
    element = document.getElementById(position)
    clear_color(element)
    element.classList.add('food')
    element.food_amount = 10
}

// Мняем текущий цвет клетки на выбранный
function paint_click(element) {
    if(color != 'info') {
        clear_color(element)
        element.classList.add(color)
        //console.log(element)
        if(element.classList.contains('alive_cell')) {
            element.life = {
                'health': 100,
                'food': 100,
                'children': 0,
                'genome': 'NNNNN'
            }
            element.classList.add('target')
        }
        if(element.classList.contains('food')) {
            element.food_amount = 10
        }
        console.log('row: ' + element.row + ' col: ' + element.column + ' id: ' + element.id + ' became ' + element.classList)
    } else {
        console.log('classes: ' + element.classList)
        if(element.classList.contains('alive_cell')) {
            console.log('health, food, children, genome: ' + element.life.health, element.life.food, element.life.children, element.life.genome)
        }
        console.log('food amount: ' + element.food_amount)
    }
}

function how_many_alive_cells() {
    alive_cells = document.querySelectorAll('.alive_cell.map_button')
    return alive_cells.length
}

function info() {
    color = 'info'
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
    for(i = 0; i < black_cells.length; i++) {
        black_cells_id[i] = Number(black_cells[i].id)
    }
    //console.log(black_cells_id)
}

// Загружаем тестовую конструкцию
function upload_testConstruction() {
    for(i = 0; i < testConstruction.length; i++) {
        element = document.getElementById(testConstruction[i])
        paint(element)
    }
}

// Используем функции из './moving.js' для реализации "передвижения клеток"
function moves() {
    alive_cells = document.querySelectorAll('.alive_cell.map_button')
    if(alive_cells.length == 0) {
        return
    }
    for(j = 0; j < alive_cells.length; j++) {
        if(move_queue.length < alive_cells.length){
            element = alive_cells[j]
            element.life.food -= 1
            //console.log(element.life.food)
            if(element.life.food > 0) {
                detect_possibility(element)
                check_walls(element)
                check_food(element)
                
                direction = select_direction(element)
                select_position(element, direction)
                //console.log(element.next_position)
                if(document.getElementById(element.next_position).classList.contains('food')) {
                    element.life.food += document.getElementById(element.next_position).food_amount * genome_decode(element, 0)
                    delete document.getElementById(element.next_position).food_amount
                }
                if(document.getElementById(element.next_position).classList.contains('dead_cell')) {
                    element.life.food += document.getElementById(element.next_position).food_amount * genome_decode(element, 0)
                    delete document.getElementById(element.next_position).food_amount
                    document.getElementById(element.next_position).classList.remove('dead_cell')
                }
                next_position_begin(element)
            } else {
                clear_color(element)
                delete element.life
                element.classList.remove('target')
                element.classList.add('dead_cell')
                element.food_amount = 100
            }
        }
    }
    next_position_end()
    childs = document.querySelectorAll('.child')
}

// Добавляем функцию гниения, мёртвые организмы должны терять количество приносимой еды каждую итерацию
function rotting() {
    dead_cells = document.querySelectorAll('.dead_cell')
    for(i = 0; i < dead_cells.length; i++) {
        element = dead_cells[i]
        element.food_amount -= 1
        if(element.food_amount < 1) {
            element.classList.remove('dead_cell')
            element.classList.add('white')
            delete element.food_amount
        }

    }
}

// Создаём на карте еду
function rain_of_food() {
    food_amount = document.querySelectorAll('.food:not(.gui_button)').length
    potential_positions = document.querySelectorAll('.white:not(.target):not(.gui_button)')
    how_many = how_many_alive_cells()
    if(food_amount >= how_many * food_ratio || food_amount + how_many > max_food) {
        return
    }
    if(how_many <= potential_positions.length) {
        for(i = 0; i < how_many; i++) {
            number = Math.random()
            number = number * potential_positions.length
            number = Math.floor(number)
            element = potential_positions[number]
            place_food(element.id)
        }
    }
}

// Запускаем по-итерационное воспроизведение
function start() {
    buttons = document.getElementsByClassName('map_button')
    interval = setInterval(() => {
        iter()
}, time)
}

// Останавливает цикл итераций
function stop() {
    clearInterval(interval)
}

// Выполняет одну итерацию
function iter() {
    rotting()
    moves()
    for(i = 0; i < childs.length; i++) {
        element = childs[i]
        element.classList.remove('child')
        element.classList.add('alive_cell')
    }
    rain_of_food()
}


create_map()