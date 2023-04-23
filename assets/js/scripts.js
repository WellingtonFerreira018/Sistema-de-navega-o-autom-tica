//TERRENOS
const plano = {
    custo: 1,
    cor: './plano.png',
    heuristica: null,
};
const rochoso = {
    custo: 10,
    cor: './rochas.png',
    heuristica: null,
};
const arenoso = {
    custo: 4,
    cor: './deserto.png',
    heuristica: null,
}
const pantano = {
    custo: 20,
    cor: './crocodilo.png',
    heuristica: null,
};
const recompensa = {
    custo: -20,
    cor: './recompensa.png'
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

let cols = 8; //columns in the grid
let rows = 8; //rows in the grid

let grid = new Array(cols); //array of all the grid points

let openSet = []; //array containing unevaluated grid points
let closedSet = []; //array containing completely evaluated grid points

let start; //starting grid point
let end; // ending grid point (goal)
let path = [];


//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y, custo) {
    this.x = x; //x location of the grid point
    this.y = y; //y location of the grid point
    this.f = 0; //total cost function
    this.g = custo; //cost function from start to the current grid point
    this.h = 0; //heuristic estimated cost function from current grid point to the goal
    this.neighbors = []; // neighbors of the current grid point
    this.parent = undefined; // immediate source of the current grid point

    // update neighbors array for a given grid point
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

//initializing the grid
function init() {
    start = grid[0][0];
    end = grid[7][3];

    openSet.push(start);
}

//A star search implementation
function aEstrela() {
    init();
    while (openSet.length > 0) {
        //assumption lowest index is the first one to begin with
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
            console.log("DONE!");
            // return the traced path
            return path.reverse();
        }

        //remove current from openSet
        openSet.splice(lowestIndex, 1);
        //add current to closedSet
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

                //neighbor.g = possibleG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
            }
        }
    }

    //no solution by default
    return [];
}

function gulosa() {
    init();
    while (openSet.length > 0) {
        //assumption lowest index is the first one to begin with
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
            console.log("DONE!");
            // return the traced path
            return path.reverse();
        }

        //remove current from openSet
        openSet.splice(lowestIndex, 1);
        //add current to closedSet
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

    //no solution by default
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


(
    () => {
        const tabuleiroDOM = document.querySelector('#tabuleiro');
        let terrenos = [plano, rochoso, arenoso, pantano, recompensa];
        let matriz = [];

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

                num = getRandomInt(0, 4);
                quadrado.style.fontSize = '15px';
                quadrado.style.color = 'black';
                let url = terrenos[num].cor;
                //quadrado.style.backgroundImage = "url('" + url + "')";
                nodeA.x = i;
                nodeA.y = j;

                //let heuristica = heuristic(nodeA, nodeFinal);

                matriz[i][j] = terrenos[num].custo;
                //console.log(`${i}X${j} =` + terrenos[num].heuristica);
                //quadrado.innerHTML = `${i}X${j}`;
                //quadrado.innerHTML = `H:${heuristica.toFixed(2)}`;

                grid[i][j] = new GridPoint(i, j, terrenos[num].custo);
            }
        }

        console.log(matriz);
        let inicio = '0,0';
        let final = '3,3';

        let path = bfs(inicio, final, grid);
        console.log(path);
        console.log(visited);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].updateNeighbors(grid);
            }
        }
        //console.log(matriz);
        let resultado = aEstrela();
        for (let a = 0; a < closedSet.length; a++) {
            //console.log(`X:${closedSet[a].x} Y:${closedSet[a].y}`);

            if (document.querySelector(`#i${closedSet[a].x}j${closedSet[a].y}`)) {
                document.getElementById(`i${closedSet[a].x}j${closedSet[a].y}`).style.backgroundColor = "rgba(42, 133, 43,0.5)";
            }
        }

        for (let a = 0; a < resultado.length; a++) {
            //console.log(`X:${resultado[a].x} Y:${resultado[a].y}`);

            if (document.querySelector(`#i${resultado[a].x}j${resultado[a].y}`)) {
                document.getElementById(`i${resultado[a].x}j${resultado[a].y}`).style.backgroundColor = "rgba(1,1,1,0.5)";
            }
        }

    }
)();

