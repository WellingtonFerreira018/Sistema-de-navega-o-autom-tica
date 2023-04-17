const plano = {
    custo: 1,
    cor: './plano.png',
};

const rochoso = {
    custo: 10,
    cor: './rochas.png',
};

const arenoso = {
    custo: 4,
    cor: './deserto.png',
}

const pantano = {
    custo: 20,
    cor: './crocodilo.png',
};

const recompensa = {
    custo: -20,
    cor: './recompensa.png'
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

console.log(getRandomInt(0, 4));
console.log(arenoso.cor);
(
    () => {
        const tabuleiroDOM = document.querySelector('#tabuleiro');
        let terrenos = [plano, rochoso, arenoso, pantano, recompensa];
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let quadrado = document.createElement('div');
                quadrado.setAttribute('id', `i${i}j${j}`);
                quadrado.setAttribute('class', 'quadrado');
                tabuleiroDOM.appendChild(quadrado);

                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        quadrado.style.color = 'black';
                        let url = terrenos[getRandomInt(0,4)].cor;
                        quadrado.style.backgroundImage = "url('"+url+"')";

                    } else {
                        quadrado.style.color = 'black';
                        let url = terrenos[getRandomInt(0,4)].cor;
                        quadrado.style.backgroundImage = "url('"+url+"')";
                    }
                } else {
                    if (j % 2 == 0) {
                        quadrado.style.color = 'black';
                        let url = terrenos[getRandomInt(0,4)].cor;
                        quadrado.style.backgroundImage = "url('"+url+"')";
                    } else {
                        quadrado.style.color = 'black';
                        let url = terrenos[getRandomInt(0,4)].cor;
                        quadrado.style.backgroundImage = "url('"+url+"')";
                    }
                }
                // quadrado.innerHTML = `${i}X${j}`;
            }
        }
    }
)();