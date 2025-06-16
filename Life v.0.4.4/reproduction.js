genome_code = {
  'A': 0.35, 'B': 0.4,  'C': 0.45, 'D': 0.5,  'E': 0.55,
  'F': 0.6,  'G': 0.65, 'H': 0.7,  'I': 0.75, 'J': 0.8,
  'K': 0.85, 'L': 0.9,  'M': 0.95, 'N': 1.0,  'O': 1.05,
  'P': 1.1,  'Q': 1.15, 'R': 1.2,  'S': 1.25, 'T': 1.3,
  'U': 1.35, 'V': 1.4,  'W': 1.45, 'X': 1.5,  'Y': 1.55,
  'Z': 1.6
} // Определяем значения генома

genome_meaning = [
    'efficiency of food absorption',
    'minimum food for repruduction',
    'reproduction cost',
    'child start food',
    'movement nature'
] // Значения генов


// Функция, чтобы находить символ для кодировки по его значению
function get_key_by_value(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// Функция, отвечающая за репродукцию(размножение) клеток
function reproduction(parent) {
    if(parent.possibility.includes('d')) {
        position = document.getElementById(parent.directions['d'])
        if(!position.classList.contains('white')) {
            return
        }
        parent.life.food -= genome_decode(parent, 2) * 100
        parent.life.children++
        child = {}
        child.classes = [...parent.classList]
        child.life = {...parent.life}
        child.life.food = genome_decode(parent, 3) * 100
        child.life.children = 0
        mutate(child)
        position = document.getElementById(parent.directions['d'])
        position.life = child.life
        position.next_position = position.id
        clear_color(position)
        for(i = 1; i < child.classes.length; i++) {
            position.classList.add(child.classes[i])
        }
        position.classList.remove('alive_cell')
        position.classList.add('child')
        console.log(parent.id, 'reproducted', position.life.genome, 'to', position.id)
    }
}

// Возвращает значение гена элемента по элементу и номеру
function genome_decode(element, number) {
    genome = Array.from(element.life.genome)
    return genome_code[genome[number]]
}

// Случайно изменяет гены элемента
function mutate(element) {
    genome = Array.from(element.life.genome)
    for(i = 0; i < genome.length; i++) {
        gen = genome[i]
        gen_value = genome_code[gen]
        if(Math.random() > 0.5) {
            higher = Math.random() > 0.5
            if((higher && gen_value < 1.6) || (!higher && gen_value > 0.35)) {
                gen_value = Math.floor((gen_value + 0.05) * 100) / 100
            } else {
                gen_value = Math.floor((gen_value - 0.05) * 100) / 100
            }
        }
        genome[i] = get_key_by_value(genome_code, gen_value)
    }
    element.life.genome = genome.join('')
}