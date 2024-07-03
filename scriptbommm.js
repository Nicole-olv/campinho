const campoMinado = document.getElementById('campo-minado');

const largura = 10;
const altura = 10;
const totalBombas = 10;

let tabuleiro = [];
let bombas = [];
let celulasAbertas = 0;

function criarTabuleiro(){
    for(let i = 0; i < altura; i++){
        tabuleiro[i] = [];
        for (let j = 0; j < largura; j++){
            tabuleiro[i][j] = {
                bomba: false,
                aberta: false,
                marcada: false,
                vizinhos: 0
            };
        }
    }

    posicionarBombasAleatoriamente()
    calcularBombasVizinhas()
}

function posicionarBombasAleatoriamente(){
    let bombasRestantes = totalBombas;
    while(bombasRestantes > 0){
        const x = Math.floor(Math.random() * largura);
        const y = Math.floor(Math.random() * altura);

        if(!tabuleiro[y][x].bomba){
            tabuleiro[y][x].bomba = true;

            bombas.push({ x, y });
            bombasRestantes--;
        }
    }
}

function calcularBombasVizinhas(){
    for (let i = 0 ; i < altura; i++){
        for (let j = 0; j < largura; j++){
            if(!tabuleiro[i][j].bomba){
                
                let vizinhos = 0;
                for( let k = -1; k <= 1; k++){
                    for(let l = -1; l <= 1; l++){

                        if( !(k === 0 && l === 0) &&
                            i + k >= 0 &&
                            i + k < altura &&
                            j + l >= 0 &&
                            j + l < largura) {
                            
                            if( tabuleiro[i + k][j + l].bomba){
                                vizinhos++;
                            }
                        }
                    }
                }

                tabuleiro[i][j].vizinhos = vizinhos;

            }
        }
    }
}

function abriCelula(x, y, event){
    const celula = tabuleiro [y][x];

    if(event && event.button === 2){
        event.preventDefault();
        marcarCelula(x, y);
        return;
    }

    if(!celula.aberta && !celula.marcada){
        celula.aberta = true;
        celulasAbertas++;

        if(celula.bomba){
            campoMinado.children[y * largura + x].classList.add("bomba")
            revelarBomba();
            alert(" você perder otario!")
        } else {
            campoMinado.children[y * largura + x].classList.add("aberta");

            if(celula.vizinhos === 0){
                for(let i = -1; i <= 1; i++){
                    for(let j = -1; j <= 1; j++){
                        if( x + j >= 0 &&
                            x + j < largura &&
                            y + i >= 0 && 
                            y + i < altura
                        ){
                            abriCelula(x + j, y + i, null)
                        }
                    }
                }
            }

            if(celulasAbertas === largura * altura - totalBombas){
                alert("você ganhou, parabúains!");
            }
        }
    }

   
    if(bombasVizinhas > 0 && !celula.bomba){
        campoMinado.children[y * largura + x].innerHTML = bombasVizinhas;
    }

    if(celula.aberta && celula.marcada){
        campoMinado.children[y * largura + x].classList.add('bomba');
    }
}

function revelarBomba(){
    for(let {x, y} of bombas){
        campoMinado.children[y * largura + x].classList.add('bomba')
    }
}

function renderizarCampoMinado(){
    for(let i = 0; i < largura; i++){
        for(let j = 0; j < altura; j++){
            const celula = document.createElement('div')
            celula.classList.add('celula')
            celula.setAttribute('data-x', j);
            celula.setAttribute('data-y', i);

            celula.addEventListener('click', () => abriCelula (j, i));
            celula.addEventListener('contextmenu', (event) => {
                event.preventDefault();

                marcarCelula(j, i)
            });
            campoMinado.appendChild(celula);
        }
    }
}

criarTabuleiro();
renderizarCampoMinado();

function marcarCelula(x, y){
    const celula = tabuleiro[y][x];
    if(!celula.aberta ){
        const celulaElement = campoMinado.children[ y * largura + x];

        if(!celulaElement.classList.contains('marcada')){
            celulaElement.classList.add('marcada');
            celula.marcada = true;
        } else {
            celulaElement.classList.remove('marcada');
            celula.marcada = false;
        }
    }
}

function calcularBombasVizinhas(x, y){
    let bombasVizinhas = 0;
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            if( x + j >= 0 &&
                x + j < largura && 
                y + i >= 0 &&
                y + i < altura
            ){
                if(tabuleiro[y + i][x + j].bomba){
                    bombasVizinhas++;
                }
            }
        }
    }
    return bombasVizinhas;
}