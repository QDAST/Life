priorities = ['l', 'lu', 'u', 'ru', 'r', 'rd', 'd', 'ld', 'here']
// Приоритеты нужны чтобы клетка могла выбрать из множества одинаковых вариантов направления
move_queue = []
next_element = {
        'classes': ['map_button', 'white'],
        'life': {}
    }



// Выбираем направление движения клетки
function select_direction(element) {
    //for(i = 0; i < priorities.length - 1; i++) {
    //    if(element.possibility.includes(priorities[i]) || priorities[i] == 'here') {
    //        return priorities[i]
    //    }
    //}
    check_alive_neighbors_next(element)
    if(element.food_around.length == 0) {
        HereOrNo = Math.random()
        if(HereOrNo > 0.5) {
            number = Math.floor(Math.random() * (element.possibility.length))
            direction =  element.possibility[number]
        } else {
            direction = 'here'
        }
    } else {
            direction = element.food_around[0]
    }
    if(direction == undefined) {
        direction = 'here'
    }
    return direction
}

// Определяем id клетки, на которую должна "пойти" текущая клетка
function select_position(element, direction) {
    id = Number(element.id)
    if(direction == 'here') {
        element.next_position = id
        document.getElementById(element.next_position).classList.add('target')
        return
    }
    element.classList.remove('target')
    directions = element.directions
    element.next_position = directions[direction]
    document.getElementById(element.next_position).classList.add('target')
}

// Сохраняем данные о передвижениях клеток а массив 'move_queue'
function next_position_begin(element) {
    div = document.createElement('div') // Создаём вспомогательный объект для хранения данных
    div.classList.add('helper')
    div.classes = [...element.classList]
    div.life = element.life
    div.next_position = element.next_position
    move_queue.push(div) //
}

// Очищаем карту от живих клеток
function clear_map() {
    zhivie_kletki = document.querySelectorAll('.alive_cell.map_button')
    for(i = 0; i < zhivie_kletki.length; i++) {
        id = Number(zhivie_kletki[i].id)
        document.getElementById(id).classList.remove('alive_cell')
        document.getElementById(id).life = {}
    }
}

// Вставляем каждую клетку на своё место
function next_position_end() {
    clear_map()
    for(i = 0; i < move_queue.length; i++) {
        copied_element = move_queue[i]
        destination_element = document.getElementById(copied_element.next_position)
        clear_color(destination_element)
        for(j = 1; j < copied_element.classes.length; j++) {
            destination_element.classList.add(copied_element.classes[j])
        }
        destination_element.life = copied_element.life
    }
    move_queue = []
}

// Приверяем соседние клетки на наличие стен, чтобы туда нельзя было пойти
function check_walls(element) {
    possibility = element.possibility
    possibility_help = []
    directions = element.directions
    remove_list = []
    for(i = 0; i < possibility.length; i++) {
        target = document.getElementById(directions[possibility[i]])
        if(target.classList.contains('black')) {
            remove_list.push(possibility[i])
        }
    }
    if(remove_list.length > 0) {
        for(i = 0; i < possibility.length; i++) {
            if(!remove_list.includes(possibility[i])) {
                possibility_help.push(possibility[i])
            }
        }
        element.possibility = possibility_help
        //console.log(element.possibility)
    }
}

// Проверяем соседние клетки на наличие еды, чтобы организм шёл именно на них
function check_food(element) {
    possibility = element.possibility
    possibility_help = []
    directions = element.directions
    food_list = []
    for(i = 0; i < possibility.length; i++) {
        target = document.getElementById(directions[possibility[i]])
        if(target.classList.contains('dead_cell')) {
            food_list.push(possibility[i])
        }
    }
    for(i = 0; i < possibility.length; i++) {
        target = document.getElementById(directions[possibility[i]])
        if(target.classList.contains('food')) {
            food_list.push(possibility[i])
        }
    }
    element.food_around = food_list
}

// Проверяем соседние клетки, если туда уже кто-то собрался идти, то больше никому туда нельзя
function check_alive_neighbors_next(element) {
    // Проверяем все возможные направления
    new_possibility = [];
    for (dir of element.possibility) {
        target_id = dir === 'here' ? element.id : element.directions[dir];
        target = document.getElementById(target_id);
        if (!target.classList.contains('alive_cell') && !target.classList.contains('target')) {
            new_possibility.push(dir);
        }
    }
    
    // Обновляем список возможных направлений
    element.possibility = new_possibility;
}
