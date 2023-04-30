let cols = 8; 
let rows = 8; 
let grid = new Array(cols); 
let openSet = [];
let closedSet = []; 
let start; 
let end; 
let path = [];
let matriz = [];

//TERRENOS
const plano = {
    custo: 1,
    cor: 'assets/img/plano.png',
    heuristica: null,
};
const rochoso = {
    custo: 10,
    cor: 'assets/img/rochas.png',
    heuristica: null,
};
const arenoso = {
    custo: 4,
    cor: 'assets/img/deserto.png',
    heuristica: null,
}
const pantano = {
    custo: 20,
    cor: 'assets/img/crocodilo.png',
    heuristica: null,
};
const recompensa = {
    custo: -20,
    cor: 'assets/img/recompensa.png'
}

const parede = {
    custo: 99999,
    cor: 'assets/img/parede.png'
}

let nodeFinal = {
    x: 7,
    y: 7
}

let nodeA = {
    x: undefined,
    y: undefined
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function heuristic(nodeA, nodeFinal) {
    let dx = Math.abs(nodeA.x - nodeFinal.x);
    let dy = Math.abs(nodeA.y - nodeFinal.y);
    let euclideanDistance = Math.sqrt(dx * dx + dy * dy);
    return euclideanDistance;
}

function init() {
    start = grid[getRandomInt(0, 8)][getRandomInt(0, 8)];
    end = grid[getRandomInt(0, 8)][getRandomInt(0, 8)];

    openSet.push(start);
}

function GridPoint(x, y, custo) {
    this.x = x; 
    this.y = y;
    this.f = 0; 
    this.g = custo; 
    this.h = 0; 
    this.neighbors = [];
    this.parent = undefined; 

    this.updateNeighbors = function (grid) {
        let i = this.x;
        let j = this.y;
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    };
}

function aEstrela() {
  
    while (openSet.length > 0) {
    
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];

        if (current === end) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }

            return path.reverse();
        }

        openSet.splice(lowestIndex, 1);
        closedSet.push(current);

        let neighbors = current.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                let possibleG = current.g + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (possibleG >= neighbor.g) {
                    continue;
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
            }
        }
    }
    return [];
}

function gulosa() {

    while (openSet.length > 0) {

        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];

        if (current === end) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }
            return path.reverse();
        }

   
        openSet.splice(lowestIndex, 1);
        closedSet.push(current);

        let neighbors = current.neighbors;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                let possibleG = current.g + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (possibleG >= neighbor.g) {
                    continue;
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.parent = current;
            }
        }
    }
    return [];
}

let visited = {};
function bfs(start, end, grid) {
    let queue = [];
    queue.push(start);

    visited[start] = true;

    let cameFrom = {};

    while (queue.length > 0) {
        let current = queue.shift();

        if (current === end) {
            let path = [current];
            while (cameFrom[current] !== start) {
                current = cameFrom[current];
                path.unshift(current);
            }
            path.unshift(start);
            return path;
        }

        let neighbors = getNeighbors(current, grid);
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                cameFrom[neighbor] = current;
                queue.push(neighbor);
            }
        }
    }

    return null;
}

function dfs(start, end, grid) {
    let visited = {};
    visited[start] = true;

    let cameFrom = {};

    function visit(cell) {
        if (cell === end) return true;

        let neighbors = getNeighborsDfs(cell, grid);
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                cameFrom[neighbor] = cell;
                if (visit(neighbor)) return true;
            }
        }

        return false;
    }

    if (visit(start)) {
        let path = [end];
        while (cameFrom[path[0]] !== start) {
            path.unshift(cameFrom[path[0]]);
        }
        path.unshift(start);
        return path;
    }

    return null;
}

// Busca em largura
// função para obter os vizinhos livres de uma célula na grid
function getNeighbors(cell, grid) {
    let [x, y] = cell.split(',').map(Number);
    let neighbors = [];

    if (grid[x][y - 1] !== null) neighbors.push(`${x},${y - 1}`);
    if (grid[x][y + 1] !== null) neighbors.push(`${x},${y + 1}`);
    if (grid[x - 1] && grid[x - 1][y] !== null) neighbors.push(`${x - 1},${y}`);
    if (grid[x + 1] && grid[x + 1][y] !== null) neighbors.push(`${x + 1},${y}`);

    return neighbors;
}

//Busca em profundidade
function getNeighborsDfs(cell, grid) {
    const [x, y] = cell.split(",").map(Number);
    const offsets = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const neighbors = [];

    for (const offset of offsets) {
        const neighborX = x + offset[0];
        const neighborY = y + offset[1];

        if (
            neighborX >= 0 &&
            neighborX < grid.length &&
            neighborY >= 0 &&
            neighborY < grid[0].length &&
            grid[neighborX][neighborY] !== null
        ) {
            neighbors.push(`${neighborX},${neighborY}`);
        }
    }

    return neighbors;
}

function algoritmo() {

    let checkbox = document.querySelector('input[name=exampleRadios]:checked').value;
    console.log(checkbox);
    let inicio = `${start.x},${start.y}`;
    let final = `${end.x},${end.y}`;

    switch (checkbox) {
        case 'largura':
            let pathBFS = bfs(inicio, final, matriz);

            for (let w = 0; w < pathBFS.length; w++) {
                let i = pathBFS[w].split(",");
                console.log(i)
                if (document.querySelector(`#i${i[0]}j${i[1]}`)) {
                    console.log('entrou')
                    document.getElementById(`i${i[0]}j${i[1]}`).style.backgroundColor = "rgba(1,1,1,0.5)";
                }
            }
            break;

        case 'profundidade':
            let pathDFS = dfs(inicio, final, matriz);

            for (let w = 0; w < pathDFS.length; w++) {
                let i = pathDFS[w].split(",");
                console.log(i)
                if (document.querySelector(`#i${i[0]}j${i[1]}`)) {
                    console.log('entrou')
                    document.getElementById(`i${i[0]}j${i[1]}`).style.backgroundColor = "rgba(1,1,1,0.5)";
                }
            }
            break;

        case 'gulosa':
            let resultadoG = gulosa();

            for (let a = 0; a < closedSet.length; a++) {
                if (document.querySelector(`#i${closedSet[a].x}j${closedSet[a].y}`)) {
                    document.getElementById(`i${closedSet[a].x}j${closedSet[a].y}`).style.backgroundColor = "rgba(42, 1, 43,0.5)";
                }
            }
            for (let a = 0; a < resultadoG.length; a++) {
                if (document.querySelector(`#i${resultadoG[a].x}j${resultadoG[a].y}`)) {
                    document.getElementById(`i${resultadoG[a].x}j${resultadoG[a].y}`).style.backgroundColor = "rgba(1,1,1,0.5)";
                }
            }
            break;

        case 'buscaA':
            let resultado = aEstrela();

            for (let a = 0; a < closedSet.length; a++) {
                if (document.querySelector(`#i${closedSet[a].x}j${closedSet[a].y}`)) {
                    document.getElementById(`i${closedSet[a].x}j${closedSet[a].y}`).style.backgroundColor = "rgba(42, 133, 43,0.8)";
                }
            }
            for (let a = 0; a < resultado.length; a++) {
                if (document.querySelector(`#i${resultado[a].x}j${resultado[a].y}`)) {
                    document.getElementById(`i${resultado[a].x}j${resultado[a].y}`).style.backgroundColor = "rgba(1,1,1,0.8)";
                }
            }
            break;
    }

    return null;
}
(
    () => {
        const tabuleiroDOM = document.querySelector('#tabuleiro');
        let terrenos = [plano, rochoso, arenoso, pantano, parede];

        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows);
        }

        for (let i = 0; i < 8; i++) {
            matriz[i] = [];

            for (let j = 0; j < 8; j++) {
                let quadrado = document.createElement('div');
                quadrado.setAttribute('id', `i${i}j${j}`);
                quadrado.setAttribute('class', 'quadrado');
                tabuleiroDOM.appendChild(quadrado);

                num = getRandomInt(0, 5);
                quadrado.style.fontSize = '15px';
                quadrado.style.color = 'black';
                let url = terrenos[num].cor;
                quadrado.style.backgroundImage = "url('" + url + "')";
                matriz[i][j] = terrenos[num].custo;
                grid[i][j] = new GridPoint(i, j, terrenos[num].custo);
            }
        }
        init();
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].updateNeighbors(grid);
            }
        }

        // recompensas
        for (let i = 0; i < 5; i++) {
            let x = getRandomInt(0, 7);
            let y = getRandomInt(0, 7);
            document.getElementById(`i${x}j${y}`).style.backgroundImage = "url('assets/img/recompensa.gif')";
        }

        //gif no inicio
        if (document.querySelector(`#i${start.x}j${start.y}`)) {
            document.getElementById(`i${start.x}j${start.y}`).style.backgroundImage = "url('assets/img/inicio.gif')";
        }
        // final
        if (document.querySelector(`#i${end.x}j${end.y}`)) {
            document.getElementById(`i${end.x}j${end.y}`).style.backgroundImage = "url('assets/img/localizacao.png')";
        }
    }
)();
