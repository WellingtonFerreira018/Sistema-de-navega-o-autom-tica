(
    () => {
        const tabuleiroDOM = document.querySelector('#tabuleiro');
        var tabuleiro = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let quadrado = document.createElement('div');
                quadrado.setAttribute('id', `i${i}j${j}`);
                quadrado.setAttribute('class', 'quadrado');
                tabuleiroDOM.appendChild(quadrado);

                
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        quadrado.style.color = 'black';
                        quadrado.style.backgroundColor = 'white'

                    } else {
                        quadrado.style.color = 'black';
                        quadrado.style.backgroundColor = 'white'
                    }
                } else {
                    if (j % 2 == 0) {
                        quadrado.style.color = 'black';
                        quadrado.style.backgroundColor = 'white'
                    } else {
                        quadrado.style.color = 'black';
                        quadrado.style.backgroundColor = 'white'
                    }
                }
                quadrado.innerHTML = `${i}X${j}`;
            }
        }
    }
)()