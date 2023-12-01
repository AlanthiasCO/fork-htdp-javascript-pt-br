// ------------- Imports Gerais -------------
import { Imagem, alturaImagem, carregarImagem, cenaVazia, colocarImagem, larguraImagem, retangulo, texto } from "../../../lib/image";
import { reactor } from "../../../lib/universe";
import imgSoldado from "../assets/survivor.png";
import imgZombie_1 from "../assets/zombie_1.png";
import imgTiroUrl from "../assets/bullet_j-re.png";
import imgFundoUrl from "../assets/Ground.png";
import imgZombie_2 from "../assets/zombie_2.png";
import imgTiroZombie2 from "../assets/spike.png";
import { testes } from "../../../lib/utils";


//------------- Módulo: Declaração de Constantes -------------
// Constantes da Tela
const TELA_DIMENSOES = {LARGURA: 600, ALTURA: 400};
const IMG_FUNDO = carregarImagem(imgFundoUrl, TELA_DIMENSOES.LARGURA, TELA_DIMENSOES.ALTURA);
const TEXTO_GAME_OVER = texto("GAME OVER", "arial", "50px", "red");
const GAME_OVER = colocarImagem(TEXTO_GAME_OVER, TELA_DIMENSOES.LARGURA / 4, TELA_DIMENSOES.ALTURA / 2 - 20, IMG_FUNDO)

// Constantes da Jogo
const FPS = 60;
let tempoDecorrido = 0;

// Constantes do Soldado
const IMG_SOLDADO_INO = carregarImagem(imgSoldado, 100, 70);
const LARGURA_IMG_SOLDADO = larguraImagem(IMG_SOLDADO_INO);
const ALTURA_IMG_SOLDADO = alturaImagem(IMG_SOLDADO_INO);
const Y_INICIAL_SOLDADO = TELA_DIMENSOES.ALTURA / 2;
const RAIO_COLISAO_SOLDADO = (LARGURA_IMG_SOLDADO + ALTURA_IMG_SOLDADO) / 2 / 3;
const LIMITE_ESQUERDA_SOLDADO = 0 + LARGURA_IMG_SOLDADO / 2;
const LIMITE_DIREITA_SOLDADO = TELA_DIMENSOES.LARGURA - LARGURA_IMG_SOLDADO / 2;
const LIMITE_BAIXO_SOLDADO = TELA_DIMENSOES.ALTURA - ALTURA_IMG_SOLDADO / 2;
const LIMITE_CIMA_SOLDADO = 0 + ALTURA_IMG_SOLDADO / 2;
const VELOCIDADE_SOLDADO = 12;
const MAX_VIDA_REAL = 800;
const MAX_VIDA_VISUAL = 4;
let vidaReal = MAX_VIDA_REAL;
let vidaVisual = MAX_VIDA_VISUAL;

// Constantes do Zombie 1
const IMG_ZOMBIE_1 = carregarImagem(imgZombie_1, 100, 70);
const LARGURA_IMG_ZOMBIE_1 = larguraImagem(IMG_ZOMBIE_1);
const ALTURA_IMG_ZOMBIE_1 = alturaImagem(IMG_ZOMBIE_1);
const RAIO_COLISAO_ZOMBIE_1 = (LARGURA_IMG_ZOMBIE_1 + ALTURA_IMG_ZOMBIE_1) / 2 / 3;
const VELOCIDADE_ZOMBIE_1 = 1;
let TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 = 100; // ESPERAR UM POUCO PARA OS ZOMBIES 1 APARECEREM
const INTERVALO_DE_SPAWN_ZOMBIE_1 = 5 * FPS;
const VIDA_ZOMBIE_1 = 4;

// Constantes do Zombie 2
const IMG_ZOMBIE_2 = carregarImagem(imgZombie_2, 100, 70);
const LARGURA_IMG_ZOMBIE_2 = larguraImagem(IMG_ZOMBIE_2);
const VELOCIDADE_ZOMBIE_2 = 2;
const IMG_TIRO_ZOMBIE_2 = carregarImagem(imgTiroZombie2, 20, 8);
const LARGURA_TIRO_ZOMBIE2 = larguraImagem(IMG_TIRO_ZOMBIE_2);
const ALTURA_TIRO_ZOMBIE2 = alturaImagem(IMG_TIRO_ZOMBIE_2);
const VELOCIDADE_TIRO_ZOMBIE_2 = 1.5;
const INTERVALO_ENTRE_TIROS_ZOMBIE_2 = 1 * FPS;

// Constantes do Tiro
const IMG_TIRO = carregarImagem(imgTiroUrl, 20, 8);
const INTERVALO_DE_DANO_TIRO = 0.5 * FPS;
let tempoDecorridoDanoTiro = 0;
const INTERVALO_ENTRE_TIROS = 0.4;
const TIROS_POR_INTERVALO = 5000;
let tirosDados = 0;
let ultimoTiroTempo = 0;

//------------------ Módulo: definição de dados ----------------
interface Soldado {
  x: number;
  y: number;
  deslocamento: number;
  vidas: number;
}

interface Zombie_1 {
  x: number;
  y: number;
  vidas: number;
  deslocamento: number;
  tempoParaColisao: number;
  direcaoX: number;
  direcaoY: number;
}

interface Zombie_2 {
  x: number;
  y: number;
  deslocamento: number;
  direcaoY: number;
  tempoParaDisparar: number;
}

interface Tiro {
  x: number;
  y: number;
  ativo: boolean;
  image: Imagem,
  direcao: number;
}

interface TiroZombie2 extends Tiro {
}

interface Jogo {
  soldado: Soldado;
  zombies: Zombie_1[];
  zombies_2: Zombie_2[];
  tirosZombie_2: Tiro[];
  gameOver: boolean;
  pontuacao: number;
  cont: number;
  tempoParaSpawn: number;
  tiros: Tiro[];
}

//--------------------- Módulo: Funções do tipo Make----------------------
function makeSoldado(_x: number, _y: number, _deslocamento: number, _vidas: number): Soldado {
  return { 
    x: _x, 
    y: _y, 
    deslocamento: _deslocamento, 
    vidas: _vidas };
}

/*Soldado criado no seu modo default, unicamente para verificar se a movimentacao está obedecendo a velocidade
do soldado e funcionando.*/
export const SOLDADO_INICIAL_TESTE: Soldado = {
  x: TELA_DIMENSOES.LARGURA / 2,
  y: TELA_DIMENSOES.ALTURA / 2,
  deslocamento: VELOCIDADE_SOLDADO,
  vidas: MAX_VIDA_REAL,
};

/*Soldado criado bem no limite da tela, ele será usado em uma proxima constante para verificar se,
caso a tecla 'ArrowRigth' seja pressionada, ele não se move alem do limite da tela*/
const SOLDADO_LIMITE_DIREITA_TESTE: Soldado = {
  x: LIMITE_DIREITA_SOLDADO,
  y: TELA_DIMENSOES.ALTURA / 2,
  deslocamento: VELOCIDADE_SOLDADO,
  vidas: MAX_VIDA_REAL,
};

/*Soldado criado bem no limite da tela, ele será usado em uma proxima constante para verificar se,
caso a tecla 'ArrowLeft' seja pressionada, ele não se move alem do limite da tela*/
const SOLDADO_LIMITE_ESQUERDA_TESTE: Soldado = {
  x: LIMITE_ESQUERDA_SOLDADO,
  y: TELA_DIMENSOES.ALTURA / 2,
  deslocamento: VELOCIDADE_SOLDADO,
  vidas: MAX_VIDA_REAL,
};

/*Soldado criado bem no limite da tela, ele será usado em uma proxima constante para verificar se,
caso a tecla 'ArrowUp' seja pressionada, ele não se move alem do limite da tela*/
const SOLDADO_LIMITE_CIMA_TESTE: Soldado = {
  x: TELA_DIMENSOES.LARGURA,
  y: LIMITE_CIMA_SOLDADO,
  deslocamento: VELOCIDADE_SOLDADO,
  vidas: MAX_VIDA_REAL,
};

/*Soldado criado bem no limite da tela, ele será usado em uma proxima constante para verificar se,
caso a tecla 'ArrowDown' seja pressionada, ele não se move alem do limite da tela*/
const SOLDADO_LIMITE_BAIXO_TESTE: Soldado = {
  x: TELA_DIMENSOES.LARGURA,
  y: LIMITE_BAIXO_SOLDADO,
  deslocamento: VELOCIDADE_SOLDADO,
  vidas: MAX_VIDA_REAL,
};

function makeZombie_1(_soldado: Soldado): Zombie_1 {
  const spawnX = TELA_DIMENSOES.LARGURA;
  const spawnY = Math.random() * TELA_DIMENSOES.ALTURA;
  const direcaoX = -1; //ANDAR SEMPRE PARA A ESQUERDA
  const direcaoY = Math.random() < 0.5 ? 1 : -1;

  return { 
    x: spawnX, 
    y: spawnY, 
    vidas: VIDA_ZOMBIE_1, 
    deslocamento: VELOCIDADE_ZOMBIE_1, 
    direcaoX, 
    direcaoY, 
    tempoParaColisao: 0 };
}

function makeZombie_2(): Zombie_2 {
  return {
     x: TELA_DIMENSOES.LARGURA - LARGURA_IMG_ZOMBIE_2 / 2, 
     y: TELA_DIMENSOES.ALTURA / 2, 
     deslocamento: VELOCIDADE_ZOMBIE_2, 
     direcaoY: 1, 
     tempoParaDisparar: 0 };
}

function makeTiroSoldado(x: number, y: number, direcao: number = 1): Tiro {
  return { 
    x, 
    y, 
    ativo: true, 
    image: IMG_TIRO, 
    direcao };
}

function makeTiroZombie2(x: number, y: number, direcao: number = -1): TiroZombie2 {
  return { 
    x,
    y, 
    ativo: true, 
    image: IMG_TIRO_ZOMBIE_2, 
    direcao };
}

function makeJogo(): Jogo {
  return { 
    soldado: SOLDADO_INICIAL_TESTE,
    zombies: [], 
    gameOver: false, 
    tempoParaSpawn: 0, 
    pontuacao: 0, 
    cont: 0, 
    tiros: [], 
    zombies_2: [makeZombie_2()], 
    tirosZombie_2: [] };
}

//--------------------- Módulo: Funções do tipo Move----------------------
/**
 * moveSoldado: Soldado, String -> Soldado
 * Movimenta o soldado.
 */
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
testes(() => {
  describe("testes de moveSoldado", () => {
    test("move soldado para a direita", () => {
      const SOLDADO_MOVIDO_DIREITA = makeSoldado(SOLDADO_INICIAL_TESTE.x + VELOCIDADE_SOLDADO, Y_INICIAL_SOLDADO, VELOCIDADE_SOLDADO, MAX_VIDA_REAL);
      expect(moveSoldado(SOLDADO_INICIAL_TESTE, "ArrowRight")).toStrictEqual(SOLDADO_MOVIDO_DIREITA);
    });

    test("move soldado para a esquerda", () => {
      const SOLDADO_MOVIDO_ESQUERDA = makeSoldado(SOLDADO_INICIAL_TESTE.x - VELOCIDADE_SOLDADO, Y_INICIAL_SOLDADO, VELOCIDADE_SOLDADO, MAX_VIDA_REAL);
      expect(moveSoldado(SOLDADO_INICIAL_TESTE, "ArrowLeft")).toStrictEqual(SOLDADO_MOVIDO_ESQUERDA);
    });

    test("move soldado para baixo", () => {
      const SOLDADO_MOVIDO_BAIXO = makeSoldado(SOLDADO_INICIAL_TESTE.x, Y_INICIAL_SOLDADO + VELOCIDADE_SOLDADO, VELOCIDADE_SOLDADO, MAX_VIDA_REAL)
      expect(moveSoldado(SOLDADO_INICIAL_TESTE, "ArrowDown")).toStrictEqual(SOLDADO_MOVIDO_BAIXO);
    });

    test("move soldado para cima", () => {
      const SOLDADO_MOVIDO_CIMA = makeSoldado(SOLDADO_INICIAL_TESTE.x, Y_INICIAL_SOLDADO - VELOCIDADE_SOLDADO, VELOCIDADE_SOLDADO, MAX_VIDA_REAL)
      expect(moveSoldado(SOLDADO_INICIAL_TESTE, "ArrowUp")).toStrictEqual(SOLDADO_MOVIDO_CIMA);
    });
  });

  test("mantém soldado dentro dos limites ao mover para a direita", () => {
    const SOLDADO_MOVIDO_DIREITA_LIMITE = moveSoldado(SOLDADO_LIMITE_DIREITA_TESTE, "ArrowRight"); // o soldado esta setado no limite direito da tela (TELA_DIMENSOES.LARGURA - LARGURA_IMG_SOLDADO / 2 == "colocar o valor") e foi movido para a direita, logo, o esperado era subir 12 em seu eixo X mas a funcao movesoldado não deve permitir isso
    expect(SOLDADO_MOVIDO_DIREITA_LIMITE.x).toStrictEqual(LIMITE_DIREITA_SOLDADO);
  });

  test("mantém soldado dentro dos limites ao mover para a esquerda", () => {
    const SOLDADO_MOVIDO_ESQUERDA_LIMITE = moveSoldado(SOLDADO_LIMITE_ESQUERDA_TESTE, "ArrowLeft");
    expect(SOLDADO_MOVIDO_ESQUERDA_LIMITE.x).toStrictEqual(LIMITE_ESQUERDA_SOLDADO);
  });

  test("mantém soldado dentro dos limites ao mover para cima", () => {
    const SOLDADO_LIMITE_CIMA_TESTE_MOVIDO = moveSoldado(SOLDADO_LIMITE_CIMA_TESTE, "ArrowUp");
    expect(SOLDADO_LIMITE_CIMA_TESTE_MOVIDO.y).toStrictEqual(LIMITE_CIMA_SOLDADO);
  });

  test("mantém soldado dentro dos limites ao mover para cima", () => {
    const SOLDADO_LIMITE_BAIXO_TESTE_MOVIDO = moveSoldado(SOLDADO_LIMITE_BAIXO_TESTE, "ArrowDown");
    expect(SOLDADO_LIMITE_BAIXO_TESTE_MOVIDO.y).toStrictEqual(LIMITE_BAIXO_SOLDADO);
  });
});

/**
 * moveZombie_1: Zombie_1 -> Zombie_1
 * Movimenta o zombie 1.
 */
function moveZombie_1(zombie_1: Zombie_1, soldado: Soldado): Zombie_1 {
  const deltaX_zombie_1 = soldado.x - zombie_1.x;
  const deltaY_zombie_1 = soldado.y - zombie_1.y;
  const distancia = Math.sqrt(deltaX_zombie_1 * deltaX_zombie_1 + deltaY_zombie_1 * deltaY_zombie_1);

  if (distancia === 0) {
    return zombie_1; // Zombie colidiu com a soldado
  }
  const direcaoX_zombie_1 = deltaX_zombie_1 / distancia;
  const direcaoY_zombie_1 = deltaY_zombie_1 / distancia;
  const novoX_zombie_1 = zombie_1.x + direcaoX_zombie_1 * VELOCIDADE_ZOMBIE_1;
  const novoY_zombie_1 = zombie_1.y + direcaoY_zombie_1 * VELOCIDADE_ZOMBIE_1;
  const limiteEsquerda_zombie_1 = LIMITE_ESQUERDA_SOLDADO;
  const limiteDireita_zombie_1 = TELA_DIMENSOES.LARGURA - LIMITE_ESQUERDA_SOLDADO;
  const limiteCima_zombie_1 = LIMITE_CIMA_SOLDADO;
  const limiteBaixo_zombie_1 = TELA_DIMENSOES.ALTURA - LIMITE_CIMA_SOLDADO;
  if (novoX_zombie_1 < limiteEsquerda_zombie_1) {
    return { ...zombie_1, x: limiteEsquerda_zombie_1, y: novoY_zombie_1 };
  }
  if (novoX_zombie_1 > limiteDireita_zombie_1) {
    return { ...zombie_1, x: limiteDireita_zombie_1, y: novoY_zombie_1 };
  }
  if (novoY_zombie_1 < limiteCima_zombie_1) {
    return { ...zombie_1, x: novoX_zombie_1, y: limiteCima_zombie_1 };
  }
  if (novoY_zombie_1 > limiteBaixo_zombie_1) {
    return { ...zombie_1, x: novoX_zombie_1, y: limiteBaixo_zombie_1 };
  }
  return { ...zombie_1, x: novoX_zombie_1, y: novoY_zombie_1 };
}

/**
 * moveZombie_2: Zombie_2 -> Zombie_2
 * Movimenta o zombie 2.
 */
function moveZombie_2(zombie_2: Zombie_2): Zombie_2 {
  const novoY = zombie_2.y + VELOCIDADE_ZOMBIE_2 * zombie_2.direcaoY;
  const limiteCimaZombie2 = LIMITE_CIMA_SOLDADO;
  const limiteBaixoZombie2 = TELA_DIMENSOES.ALTURA - LIMITE_CIMA_SOLDADO;
  if (novoY < limiteCimaZombie2) {
    return { ...zombie_2, y: limiteCimaZombie2, direcaoY: 1 };
  }
  if (novoY > limiteBaixoZombie2) {
    return { ...zombie_2, y: limiteBaixoZombie2, direcaoY: -1 };
  }
  return { ...zombie_2, y: novoY };
}

/**
 * moveTiros: Tiro[] -> Tiro[]
 * Movimenta os tiros no jogo.
 */
function moveTiros(tiros: Tiro[]): Tiro[] {
  return tiros.map((tiro) => {
    if (tiro.ativo) {
      tiro.x += VELOCIDADE_TIRO_ZOMBIE_2 * tiro.direcao; // Ajuste a velocidade dos tiros conforme necessário
    }
    return tiro;
  });
}

//--------------------- Módulo: Funções do Jogo ----------------------
/**
 * atualizaZombie_2: Zombie_2, Soldado, Tiro[], TiroZombie2[] -> Zombie_2
 * Atualiza o zombie 2 a cada tick do jogo. TO-DO: adicionar o resto
 */
function atualizaZombie_2(zombie_2: Zombie_2, soldado: Soldado, _tiros: Tiro[], tirosZombie_2: TiroZombie2[]): Zombie_2 {
  const deltaX = soldado.x - zombie_2.x;
  const deltaY = soldado.y - zombie_2.y;
  const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  zombie_2.tempoParaDisparar += 1;

  if (zombie_2.tempoParaDisparar >= INTERVALO_ENTRE_TIROS_ZOMBIE_2) {
    zombie_2.tempoParaDisparar = 0;
    const novoTiroZombie2 = makeTiroZombie2(zombie_2.x - LARGURA_IMG_ZOMBIE_2 / 2, zombie_2.y + 18, -1);
    tirosZombie_2.push(novoTiroZombie2);
  }

  const zombie_2_atualizado = moveZombie_2(zombie_2);

  for (const tiroZombie2 of tirosZombie_2) {
    if (colisaoTiroSoldado(tiroZombie2, soldado) && tiroZombie2.ativo) {
      tiroZombie2.ativo = false;
      vidaReal -= 20;
      vidaVisual = Math.ceil(vidaReal / (MAX_VIDA_REAL / MAX_VIDA_VISUAL));
    }
  }

  return zombie_2_atualizado;
}

/**
 * atualizaJogo: Jogo, String -> Jogo
 * Atualiza o jogo a cada tick.
 */
function atualizaJogo(jogo: Jogo, tecla: string): Jogo {
  let novoCont = (jogo.cont + 1) % FPS;
  let novaPontuacao = novoCont === 0 ? jogo.pontuacao + 1 : jogo.pontuacao;
  const soldadoEmJogo = moveSoldado(jogo.soldado, tecla);
  const zombies_2Atualizados = jogo.zombies_2.map((zombie_2) =>
    atualizaZombie_2(zombie_2, jogo.soldado, jogo.tiros, jogo.tirosZombie_2)
  );
  const zombiesAtualizados = jogo.zombies.map((zombie) =>
    moveZombie_1(zombie, soldadoEmJogo)
  );

  const tirosAtualizados = moveTiros(jogo.tiros);
  const tirosZombie_2Atualizados = moveTiros(jogo.tirosZombie_2);

  tempoDecorridoDanoTiro += 1;


  if (tempoDecorridoDanoTiro >= INTERVALO_DE_DANO_TIRO) {
    tempoDecorridoDanoTiro = 0;

    // Verifica colisão entre tiros e zombies
    const zombiesParaRemover: number[] = [];
    for (let i = 0; i < zombiesAtualizados.length; i++) {
      for (let j = 0; j < tirosAtualizados.length; j++) {
        if (tirosAtualizados[j].ativo && zombiesAtualizados[i].vidas > 0) {
          if (colisaoTiroZombie(tirosAtualizados[j], zombiesAtualizados[i])) {
            zombiesAtualizados[i].vidas -= 1;
            tirosAtualizados[j].ativo = false;

            if (zombiesAtualizados[i].vidas <= 0) {
              zombiesParaRemover.push(i);
            }
          }

        }
      }
    }

    for (let i = 0; i < tirosZombie_2Atualizados.length; i++) {
      for (let j = 0; j < tirosZombie_2Atualizados.length; j++) {
        if (
          colisaoTiroSoldado(tirosZombie_2Atualizados[i], jogo.soldado) &&
          tirosZombie_2Atualizados[i].ativo
        ) {
          tirosZombie_2Atualizados[i].ativo = false;
          vidaReal -= 1;
          vidaVisual = Math.ceil(vidaReal / (MAX_VIDA_REAL / MAX_VIDA_VISUAL));
          if (vidaReal <= 0) {
            return { ...jogo, gameOver: true };
          }
        }
      }
    }

    for (const index of zombiesParaRemover.reverse()) {
      zombiesAtualizados.splice(index, 1);
    }
  }

  tempoDecorrido += 1 / FPS;

  // Verifica colisão entre soldado e zombies
  for (const zombie of zombiesAtualizados) {
    if (zombie.vidas > 0) {
      const distanciaX = soldadoEmJogo.x - zombie.x;
      const distanciaY = soldadoEmJogo.y - zombie.y;
      const distancia = Math.sqrt(
        distanciaX * distanciaX + distanciaY * distanciaY
      );

      if (distancia <= RAIO_COLISAO_SOLDADO) {
        vidaReal -= 1; 
        if (vidaReal <= 0) {
          return { ...jogo, gameOver: true };
        }
        vidaVisual = Math.ceil(vidaReal / (MAX_VIDA_REAL / MAX_VIDA_VISUAL));
      }
      if (zombie.tempoParaColisao >= 10000 * FPS) {
        vidaReal -= 1; 
        zombie.tempoParaColisao = 0; 
        vidaVisual = Math.ceil(vidaReal / (MAX_VIDA_REAL / MAX_VIDA_VISUAL));
      }
      zombie.tempoParaColisao += 1;
    }
  }

  // Controlador de spawn de zombies
  TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 -= 1;

  if (TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 <= 0) {
    const novoZombie = makeZombie_1(jogo.soldado);
    zombiesAtualizados.push(novoZombie);
    TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 = INTERVALO_DE_SPAWN_ZOMBIE_1; // intervalo para criar novos zombies
  }

  return {
    soldado: { ...soldadoEmJogo, vidas: vidaReal },
    zombies: zombiesAtualizados,
    zombies_2: zombies_2Atualizados,
    tirosZombie_2: tirosZombie_2Atualizados,
    gameOver: jogo.gameOver,
    tempoParaSpawn: TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1,
    pontuacao: novaPontuacao,
    cont: novoCont,
    tiros: tirosAtualizados,
  };
}

/**
 * colisaoTiroSoldado: Tiro, Soldado -> Boolean
 * Verifica se o soldado está colidindo com algum tiro do zombie_2.
 */
function colisaoTiroSoldado(tiro: Tiro, soldado: Soldado): boolean {
  return (
    tiro.ativo &&
    tiro.x < soldado.x + LARGURA_IMG_SOLDADO / 2 &&
    tiro.x + LARGURA_TIRO_ZOMBIE2 > soldado.x - LARGURA_IMG_SOLDADO / 2 &&
    tiro.y < soldado.y + ALTURA_IMG_SOLDADO / 2 &&
    tiro.y + ALTURA_TIRO_ZOMBIE2 > soldado.y - ALTURA_IMG_SOLDADO / 2
  );
}

/**
 * colisaoTiroZombie: Tiro, Zombie_1 -> Boolean
 * Função para verificar se o zombie 1 está colidindo com algo.
 */
function colisaoTiroZombie(tiro: Tiro, zombie: Zombie_1): boolean {
  const distanciaX = Math.abs(tiro.x - zombie.x);
  const distanciaY = Math.abs(tiro.y - zombie.y);
  const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
  return distancia <= RAIO_COLISAO_ZOMBIE_1 + 20;
}

/**
 * trataTeclaJogo: Jogo, String -> Jogo
 * Função que realiza a verificação das teclas no jogo.
 */
function trataTeclaJogo(jogo: Jogo, tecla: string): Jogo {
  if (jogo.gameOver === true) {
    return makeJogo();
  }
  let jogoAtualizado = jogo; 
  const tempoAtual = tempoDecorrido;
  if (tecla === ' ' && tirosDados < TIROS_POR_INTERVALO && (tempoAtual - ultimoTiroTempo) >= INTERVALO_ENTRE_TIROS) {
    const soldadoEmjogo = moveSoldado(jogoAtualizado.soldado, tecla);
    const novoTiro = makeTiroSoldado(soldadoEmjogo.x + 40, soldadoEmjogo.y + 18);
    jogoAtualizado.tiros.push(novoTiro);
    tirosDados++;
    ultimoTiroTempo = tempoAtual;
  }
  return { ...jogoAtualizado, soldado: moveSoldado(jogoAtualizado.soldado, tecla) };
}


//--------------------- Módulo: Funções do tipo Desenha----------------------
/**
 * desenhaSoldado: Soldado -> Imagem
 * Desenha a imagem do soldado.
 */
function desenhaSoldado(soldado: Soldado): Imagem {
  return colocarImagem(IMG_SOLDADO_INO, soldado.x, soldado.y, IMG_FUNDO);
}

/**
 * desenhaZombies: Zombie_1[], Imagem -> Imagem
 * Desenha os zombies tipo 1 (zombie 1).
 */
function desenhaZombies_1(zombies: Zombie_1[], imagem: Imagem): Imagem {
  for (const zombie of zombies) {
    imagem = colocarImagem(IMG_ZOMBIE_1, zombie.x, zombie.y, imagem);
  }
  return imagem;
}

/**
 * desenhaZombies_2: Zombie_2[], Imagem -> Imagem
 * Desenha os zombies tipo 2 (zombie 2).
 */
function desenhaZombies_2(zombies_2: Zombie_2[], imagem: Imagem): Imagem {
  for (const zombie_2 of zombies_2) {
    imagem = colocarImagem(IMG_ZOMBIE_2, zombie_2.x, zombie_2.y, imagem);
  }
  return imagem;
}

/**
 * desenhaVidas: Number, Imagem -> Imagem
 * Desenha a barra de vida do soldado.
 */
function desenhaVidas(vidaReal: number, imagem: Imagem): Imagem {
  const larguraBarra = 120; // Largura total da barra de vida
  const alturaBarra = 10;  // Altura da barra de vida
  const vidaAtual = Math.max(0, vidaReal); 
  const larguraAtual = (vidaAtual / MAX_VIDA_REAL) * larguraBarra;
  const barraVida = retangulo(larguraAtual, alturaBarra, "green", "green"); 
  const textoVida = texto(`Vidas: ${vidaAtual}`, "Arial", "20px", "white");
  const novaImagem = colocarImagem(barraVida, 70, TELA_DIMENSOES.ALTURA - 30, imagem);
  colocarImagem(textoVida, 130, TELA_DIMENSOES.ALTURA - 30, novaImagem);
  return novaImagem;
}

/**
 * desenhaTiros: Tiro[], Imagem -> Imagem
 * Desenha os tiros do soldado.
 */
function desenhaTirosSoldado(tiros: Tiro[], imagem: Imagem): Imagem {
  for (const tiro of tiros) {
    if (tiro.ativo) {
      imagem = colocarImagem(IMG_TIRO, tiro.x, tiro.y, imagem);
    }
  }
  return imagem;
}

/**
 * desenhaTirosZombie_2: TiroZombie2[], Imagem -> Imagem
 * Desenha os tiros do zombie 2.
 */
function desenhaTirosZombie_2(tirosZombie_2: TiroZombie2[], imagem: Imagem): Imagem {
  for (const tiro of tirosZombie_2) {
    if (tiro.ativo) {
      imagem = colocarImagem(tiro.image, tiro.x, tiro.y, imagem);
    }
  }
  return imagem;
}

/**
 * desenhaPontuacao: Number, Imagem -> Imagem
 * Desenha a pontuação do jogo.
 */
function desenhaPontuacao(pontuacao: number, imagem: Imagem): Imagem {
  const pontuacaoImagem = texto(`Pontuação: ${pontuacao}`, "Arial", "20px", "white");
  const novaImagem = colocarImagem(pontuacaoImagem, TELA_DIMENSOES.LARGURA - 585, 30, imagem);
  return novaImagem;
}

/**
 * desenhaJogo: Jogo -> Imagem
 * Desenha todos os elementos do jogo em uma tela.
 */
function desenhaJogo(jogo: Jogo): Imagem {
  let imagemFinal = cenaVazia(TELA_DIMENSOES.LARGURA, TELA_DIMENSOES.ALTURA);
  imagemFinal = colocarImagem(IMG_FUNDO, TELA_DIMENSOES.LARGURA, TELA_DIMENSOES.ALTURA, imagemFinal);

  if (jogo.gameOver) {
    return colocarImagem(
      texto(`Pontuação: ${jogo.pontuacao}`, "Arial", "50px", "white"),
      TELA_DIMENSOES.LARGURA / 2 - 160,
      TELA_DIMENSOES.ALTURA / 2 + 40,
      GAME_OVER
    );
  }

  imagemFinal = desenhaSoldado(jogo.soldado);
  imagemFinal = desenhaZombies_1(jogo.zombies, imagemFinal);
  imagemFinal = desenhaZombies_2(jogo.zombies_2, imagemFinal);
  imagemFinal = desenhaTirosZombie_2(jogo.tirosZombie_2, imagemFinal);
  imagemFinal = desenhaPontuacao(jogo.pontuacao, imagemFinal);
  imagemFinal = desenhaVidas(jogo.soldado.vidas, imagemFinal);
  imagemFinal = desenhaTirosSoldado(jogo.tiros, imagemFinal);

  return imagemFinal;
}


//--------------------- Módulo: Função Main----------------------
function main(): void {
  const jogo = makeJogo();

  reactor(jogo, {
    aCadaTick: atualizaJogo,
    desenhar: desenhaJogo,
    quandoTecla: trataTeclaJogo,
    modoDebug: false,
  });
}
main();