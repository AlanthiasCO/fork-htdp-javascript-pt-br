

import {
  Imagem,
  alturaImagem,
  carregarImagem,
  cenaVazia,
  colocarImagem,
  espelhar,
  folhaTransparente,
  larguraImagem,
  texto,
} from "../../../../lib/image";
import { reactor } from "../../../../lib/universe";
import { testes } from "../../../../lib/utils";
import imgSoldado from "/Users/Alan/fork-htdp-javascript-pt-br/src/exemplos/soldado/assets/survivor.png";
import imgZombie from "/Users/Alan/fork-htdp-javascript-pt-br/src/exemplos/soldado/assets/zombie.png";
import imgTiroUrl from "/Users/Alan/fork-htdp-javascript-pt-br/src/exemplos/soldado/assets/bullet_j-re.png";
import imgFundoUrl from "/Users/Alan/fork-htdp-javascript-pt-br/src/exemplos/soldado/assets/Ground.png";


const [LARGURA, ALTURA] = [600, 400];

const TELA = cenaVazia(LARGURA, ALTURA);
const IMG_FUNDO = carregarImagem(imgFundoUrl, LARGURA, ALTURA);


const IMG_TIRO = carregarImagem(imgTiroUrl, 20, 8);

const IMG_SOLDADO_INO = carregarImagem(imgSoldado, 100, 70);
const IMG_ZOMBIE = carregarImagem(imgZombie, 100, 70);

const LARGURA_IMG_SOLDADO = larguraImagem(IMG_SOLDADO_INO);
const ALTURA_IMG_SOLDADO = alturaImagem(IMG_SOLDADO_INO);

const Y_INICIAL_SOLDADO = ALTURA / 2;

const RAIO_COLISAO_SOLDADO = (LARGURA_IMG_SOLDADO + ALTURA_IMG_SOLDADO) / 2 / 3;

const LIMITE_ESQUERDA_SOLDADO = 0 + LARGURA_IMG_SOLDADO / 2;
const LIMITE_DIREITA_SOLDADO = LARGURA - LARGURA_IMG_SOLDADO / 2;
const LIMITE_BAIXO_SOLDADO = ALTURA - ALTURA_IMG_SOLDADO / 2;
const LIMITE_CIMA_SOLDADO = 0 + ALTURA_IMG_SOLDADO / 2;

const VELOCIDADE_SOLDADO = 10;
const VELOCIDADE_ZOMBIE = 1;

const FPS = 60;
let tempoDecorrido = 0;

const INTERVALO_DE_DANO_ZOMBIE = 2 * FPS; // 5 segundos

const TEMPO_INICIAL_PARA_SPAWN = 100; // Valor em frames
const INTERVALO_DE_SPAWN = 5 * FPS; // Intervalo para criar novos zombies


let tempoParaSpawn = TEMPO_INICIAL_PARA_SPAWN;
const INTERVALO_DE_DANO_TIRO = 0.5 * FPS; // Intervalo de 0.5 segundo para o próximo dano

let tempoDecorridoDanoTiro = 0;

let tempoDecorridoDanoZombie = 0;

const MAX_VIDA_REAL = 200;
const MAX_VIDA_VISUAL = 4;
let vidaReal = MAX_VIDA_REAL;
let vidaVisual = MAX_VIDA_VISUAL;

// DEFINIÇÕES DE DADOS:

//ok
interface Soldado {
  x: number;
  y: number;
  vidas: number;
}

//ok
function makeSoldado(): Soldado {
  return { x: LARGURA / 2, y: Y_INICIAL_SOLDADO, vidas: 800 };
}

//ok
interface Zombie {
  x: number;
  y: number;
  vidas: number;
  tempoParaColisao: number;
  direcaoX: number;
  direcaoY: number;
}

//ok
function makeZombie(soldado: Soldado): Zombie {
  const spawnX = LARGURA;
  const spawnY = Math.random() * ALTURA;
  const direcaoX = -1;
  const direcaoY = Math.random() < 0.5 ? 1 : -1;

  return { x: spawnX, y: spawnY, vidas: 4, direcaoX, direcaoY, tempoParaColisao: 0 };
}

//ok
interface Jogo {
  soldado: Soldado;
  zombies: Zombie[];
  gameOver: boolean;
  pontuacao: number;
  cont: number;
  tempoParaSpawn: number;
  tiros: Tiro[];
}

interface Tiro {
  x: number;
  y: number;
  ativo: boolean;
}

//ok
function makeTiro(x: number, y: number): Tiro {
  return { x, y, ativo: true };
}

//ok
function makeJogo(): Jogo {
  return { soldado: makeSoldado(), zombies: [], gameOver: false, tempoParaSpawn: 0, pontuacao: 0, cont: 0, tiros: [] };
}

//ok
function moveSoldado(soldado: Soldado, tecla: string): Soldado {
  let novaX = soldado.x;
  let novaY = soldado.y;

  if (tecla === "ArrowRight" && soldado.x < LIMITE_DIREITA_SOLDADO) {
    novaX += VELOCIDADE_SOLDADO;
  } else if (tecla === "ArrowLeft" && soldado.x > LIMITE_ESQUERDA_SOLDADO) {
    novaX -= VELOCIDADE_SOLDADO;
  } else if (tecla === "ArrowDown" && soldado.y < LIMITE_BAIXO_SOLDADO) {
    novaY += VELOCIDADE_SOLDADO;
  } else if (tecla === "ArrowUp" && soldado.y > LIMITE_CIMA_SOLDADO) {
    novaY -= VELOCIDADE_SOLDADO;
  }

  return { ...soldado, x: novaX, y: novaY };
}

//ok
function moveZombie(zombie: Zombie, soldado: Soldado): Zombie {
  const deltaX = soldado.x - zombie.x;
  const deltaY = soldado.y - zombie.y;
  const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distancia === 0) {
    return zombie; // Zombie colidiu com a soldado
  }

  const direcaoX = deltaX / distancia;
  const direcaoY = deltaY / distancia;

  const novoX = zombie.x + direcaoX * VELOCIDADE_ZOMBIE;
  const novoY = zombie.y + direcaoY * VELOCIDADE_ZOMBIE;

  // Verifica se o zombie sairá da tela e ajusta sua posição
  const limiteEsquerda = LIMITE_ESQUERDA_SOLDADO;
  const limiteDireita = LARGURA - LIMITE_ESQUERDA_SOLDADO;
  const limiteCima = LIMITE_CIMA_SOLDADO;
  const limiteBaixo = ALTURA - LIMITE_CIMA_SOLDADO;

  if (novoX < limiteEsquerda) {
    return { ...zombie, x: limiteEsquerda, y: novoY };
  }
  if (novoX > limiteDireita) {
    return { ...zombie, x: limiteDireita, y: novoY };
  }
  if (novoY < limiteCima) {
    return { ...zombie, x: novoX, y: limiteCima };
  }
  if (novoY > limiteBaixo) {
    return { ...zombie, x: novoX, y: limiteBaixo };
  }

  return { ...zombie, x: novoX, y: novoY };
}


//ok
function atualizaJogo(jogo: Jogo, tecla: string): Jogo {
  let novoCont = (jogo.cont + 1) % FPS;
  let novaPontuacao = novoCont === 0 ? jogo.pontuacao + 1 : jogo.pontuacao;
  const soldadoAtualizada = moveSoldado(jogo.soldado, tecla);
  const zombiesAtualizados = jogo.zombies.map((zombie) =>
  moveZombie(zombie, soldadoAtualizada)
);

  const tirosAtualizados = moveTiros(jogo.tiros);

  tempoDecorridoDanoTiro += 1;

  if (tempoDecorridoDanoTiro >= INTERVALO_DE_DANO_TIRO) {
    tempoDecorridoDanoTiro = 0;

  // Verifica colisão entre tiros e zombies
  for (let i = 0; i < zombiesAtualizados.length; i++) {
    for (let j = 0; j < tirosAtualizados.length; j++) {
      if (tirosAtualizados[j].ativo && zombiesAtualizados[i].vidas > 0) {
        if (colisaoTiroZombie(tirosAtualizados[j], zombiesAtualizados[i])) {
          zombiesAtualizados[i].vidas -= 1;
          tirosAtualizados[j].ativo = false;
        }
      }
    }
  }
}

  tempoDecorrido += 1 / FPS;

  // Verifica colisão entre soldado e zombies
  for (const zombie of zombiesAtualizados) {
    if (zombie.vidas > 0) {
      const distanciaX = soldadoAtualizada.x - zombie.x;
      const distanciaY = soldadoAtualizada.y - zombie.y;
      const distancia = Math.sqrt(
        distanciaX * distanciaX + distanciaY * distanciaY
      );

      if (distancia <= 20) {
        vidaReal -= 1; // Reduz a vida real em 1 ponto
        if (vidaReal <= 0) {
          return { ...jogo, gameOver: true };
        }
        vidaVisual = Math.ceil(vidaReal / (MAX_VIDA_REAL / MAX_VIDA_VISUAL));
      }
      if (zombie.tempoParaColisao >= 10000 * FPS) {
        vidaReal -= 1; // Reduz a vida real em 1 ponto
        zombie.tempoParaColisao = 0; // Reinicia o contador de tempo
        vidaVisual = Math.ceil(vidaReal / (MAX_VIDA_REAL / MAX_VIDA_VISUAL));
      }
      zombie.tempoParaColisao += 1;
    }
  }

  // Verifica spawn de zombies
  tempoParaSpawn -= 1;

  if (tempoParaSpawn <= 0) {
    const novoZombie = makeZombie(jogo.soldado);
    zombiesAtualizados.push(novoZombie);
    tempoParaSpawn = INTERVALO_DE_SPAWN; // Defina o intervalo desejado para criar novos zombies
  }

  tempoDecorridoDanoZombie += 1;

  if (tempoDecorridoDanoZombie >= INTERVALO_DE_DANO_ZOMBIE) {
    soldadoAtualizada.vidas -= 1;
    tempoDecorridoDanoZombie = 0; // Reinicia o contador de tempo
  }

  return {
    soldado: { ...soldadoAtualizada, vidas: vidaReal },
    zombies: zombiesAtualizados,
    gameOver: jogo.gameOver,
    tempoParaSpawn: tempoParaSpawn,
        pontuacao: novaPontuacao,
    cont: novoCont,
    tiros: tirosAtualizados,
  };
}

//ok
function formatarTempo(tempo) {
  const minutos = Math.floor(tempo / 60);
  const segundos = Math.floor(tempo % 60);
  return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

//ok
function colisaoTiroZombie(tiro, zombie) {
  const distanciaX = tiro.x - zombie.x;
  const distanciaY = tiro.y - zombie.y;
  const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

  return distancia <= 520; // Ajuste o valor de colisão conforme necessário
}

//ok
function desenhaZombies(zombies: Zombie[], imagem: Imagem): Imagem {
  for (const zombie of zombies) {
    imagem = colocarImagem(IMG_ZOMBIE, zombie.x, zombie.y, imagem);
  }

  return imagem;
}

//ok
function desenhaVidas(vidaReal, imagem: Imagem): Imagem {
  const vidaImagem = texto(`Vidas: ${vidaVisual}`, "Arial", "20px", "black");
  const novaImagem = colocarImagem(vidaImagem, 20, ALTURA - 30, imagem);
  return novaImagem;
}


//ok
function desenhaSoldado(soldado: Soldado): Imagem {
  return colocarImagem(IMG_SOLDADO_INO, soldado.x, soldado.y, IMG_FUNDO);
}


//ok
function desenhaPontuacao(pontuacao: number, imagem: Imagem): Imagem {
  const pontuacaoImagem = texto(`Pontuação: ${pontuacao}`, "Arial", "20px", "black");
  const novaImagem = colocarImagem(pontuacaoImagem, LARGURA - 585, 30, imagem);
  return novaImagem;
}


//ok
function desenhaTiros(tiros: Tiro[], imagem: Imagem): Imagem {
  for (const tiro of tiros) {
    if (tiro.ativo) {
      imagem = colocarImagem(IMG_TIRO, tiro.x, tiro.y, imagem);
    }
  }
  return imagem;
}

//ok
function desenhaJogo(jogo: Jogo): Imagem {
  // Criar uma nova imagem que seja uma cópia da imagem de fundo
  let imagemFinal = cenaVazia(LARGURA, ALTURA);
  imagemFinal = colocarImagem(IMG_FUNDO, LARGURA, ALTURA, imagemFinal);

  if (jogo.gameOver) {
    return colocarImagem(
      texto(`Pontuação: ${jogo.pontuacao}`, "Arial", "50px", "black"),
      LARGURA / 2 - 160,
      ALTURA / 2 + 40,
      IMG_FUNDO 
    );
  }

  imagemFinal = desenhaSoldado(jogo.soldado);
  imagemFinal = desenhaZombies(jogo.zombies, imagemFinal);
  imagemFinal = desenhaPontuacao(jogo.pontuacao, imagemFinal);
  imagemFinal = desenhaVidas(jogo.soldado.vidas, imagemFinal);
  imagemFinal = desenhaTiros(jogo.tiros, imagemFinal);

  return imagemFinal;
}

//ok
function moveTiros(tiros: Tiro[]): Tiro[] {
  return tiros.map((tiro) => {
    if (tiro.ativo) {
      tiro.x += VELOCIDADE_ZOMBIE * 3; // Ajuste a velocidade dos tiros conforme necessário
    }
    return tiro;
  });
}

//ok
function trataTeclaJogo(jogo: Jogo, tecla: string): Jogo {
  if (jogo.gameOver) {
    return makeJogo();
  }

  let jogoAtualizado = jogo; // Comece com o jogo atual

  const soldadoAtualizada = moveSoldado(jogoAtualizado.soldado, tecla);

  // Disparar quando a barra de espaço for pressionada
  if (tecla === ' ') {
    const novoTiro = makeTiro(soldadoAtualizada.x + 40, soldadoAtualizada.y + 18);
    jogoAtualizado.tiros.push(novoTiro);
  }

  return { ...jogoAtualizado, soldado: soldadoAtualizada };
}


//ok
function main(): void {
  const jogo = makeJogo();
  const canvas = document.getElementById('universe') as HTMLCanvasElement;

  reactor(jogo, {
    aCadaTick: atualizaJogo,
    desenhar: desenhaJogo,
    quandoTecla: trataTeclaJogo,
    modoDebug: false,
  });
}

main();
