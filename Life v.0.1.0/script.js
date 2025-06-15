const map = document.getElementById('map')
let width = 110
let height = 60
time = 50
queue = []


function create_map() {
    for(i = 0; i < height; i++) {
        div = document.createElement('div')
        div.classList.add('str')
        div = map.appendChild(div)
        for(j = 0; j < width; j++) {
            button = document.createElement('button')
            button.id = i * width + j
            button.classList.add('map_button')
            button.classList.add('white')
            button.addEventListener('click', function() {
                paint(this)
            })
            div.appendChild(button)
        }
    }
}

function paint(element) {
    if(element.classList.contains('white')) {
        element.classList.remove('white')
        element.classList.add('black')
    } else {
        element.classList.remove('black')
        element.classList.add('white')
    }
}

function next_paint_begin(element) {
    queue.push(element.id)
}

function next_paint_end() {
    for(i = 0; i < queue.length;) {
        el = document.getElementById(queue[i])
        paint(el)
        queue.shift()
    }
}

function check_buttons_around(element) {
    id = Number(element.id)
    black_neighbors = 0
    row = Math.floor(id / width)
    column = (id % width)
    
    if(column != 0) {
        if(document.getElementById(id - 1).classList.contains('black')) {black_neighbors+=1}
        //console.log(id - 1)
    }
    if(column != width - 1) {
        if(document.getElementById(id + 1).classList.contains('black')) {black_neighbors+=1}
        //console.log(id + 1)
    }
    if(row != 0) {
        if(document.getElementById(id - width).classList.contains('black')) {black_neighbors+=1}
        //console.log(id - width)
    }
    if(row != height - 1) {
        if(document.getElementById(id + width).classList.contains('black')) {black_neighbors+=1}
        //console.log(id + width)
    }
    if(column != 0 && row != 0) {
        if(document.getElementById(id - width - 1).classList.contains('black')) {black_neighbors+=1}
        //console.log(id - width - 1)
    }
    if(column != 0 && row != height - 1) {
        if(document.getElementById(id + width - 1).classList.contains('black')) {black_neighbors+=1}
        //console.log(id + width - 1)
    }
    if(column != width - 1 && row != 0) {
        if(document.getElementById(id - width + 1).classList.contains('black')) {black_neighbors+=1}
        //console.log(id - width + 1)
    }
    if(column != width - 1 && row != height - 1) {
        if(document.getElementById(id + width + 1).classList.contains('black')) {black_neighbors+=1}
        //console.log(id + width + 1)
    }
    return black_neighbors
}

function start() {
    buttons = document.getElementsByClassName('map_button')
    interval = setInterval(() => {
    for(i = 0; i < buttons.length; i++) {
        cell = document.getElementById(i)
        neighbors = check_buttons_around(cell)
        //console.log('neighbors: ' + neighbors)
        if(cell.classList.contains('white') && neighbors == 3) {
            next_paint_begin(cell)
            //console.log(1)
        }
        if(cell.classList.contains('black') && (neighbors < 2 || neighbors > 3)) {
            next_paint_begin(cell)
            //console.log(2)
        }
    }
    next_paint_end()
    //console.log(3)
}, time)
}

create_map()