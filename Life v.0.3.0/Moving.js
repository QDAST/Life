window.priorities = ['l', 'lu', 'u', 'ru', 'r', 'rd', 'd', 'ld', 'here']
// Приоритеты нужны чтобы клетка могла выбрать из множества одинаковых вариантов направления
move_queue = []
next_element = {
        'classes': ['map_button', 'white'],
        'life': {}
    }



// Выбираем направление движения клетки
function select_direction(element) {
    for(i = 0; i < priorities.length - 1; i++) {
        if(element.possibility.includes(priorities[i]) || priorities[i] == 'here') {
            return priorities[i]
        }
    }
}

// Определяем id клетки, на которую должна "пойти" текущая клетка
function select_position(element, direction) {
    id = Number(element.id)
    directions = {
        'l': id - 1, 'r': id + 1, 'u': id - width, 'd': id + width,
        'lu': id - width - 1, 'ld': id + width - 1, 'ru': id - width + 1, 'rd': id + width + 1
    }
    element.next_position = directions[direction]
}

// Сохраняем данные о передвижениях клеток а массив 'move_queue'
function next_position_begin(element) {
    div = document.createElement('div') // Создаём вспомогательный объект для хранения данных
    div.classList.add('helper')
    div.classes = [...element.classList]
    div.life = element.life
    div.next_position = element.next_position
    move_queue.push(div) //
    window.move_queue = move_queue
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
    window.move_queue = move_queue
}

window.select_direction = select_direction
window.select_position = select_position
window.next_position_begin = next_position_begin
window.next_position_end = next_position_end