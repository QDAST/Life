// Функция, отвечающая за репродукцию(размножение) клеток
function reproduction(parent) {
    if(parent.possibility.includes('d')) {
        position = document.getElementById(parent.directions['d'])
        if(!position.classList.contains('white')) {
            return
        }
        parent.life.food -= 100
        parent.life.children++
        child = {}
        child.classes = [...parent.classList]
        child.life = {...parent.life}
        child.life.food = 100
        child.life.children = 0
        position = document.getElementById(parent.directions['d'])
        position.life = child.life
        clear_color(position)
        for(i = 1; i < child.classes.length; i++) {
            position.classList.add(child.classes[i])
        }
        how_many_alive_cells()
        console.log(parent.id, 'reproducted to', position.id)
    }
}