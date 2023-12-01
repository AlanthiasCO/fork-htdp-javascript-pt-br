// ------------- Imports Gerais -------------
import { Imagem, retangulo, texto, colocarImagem, cenaVazia } from "../../lib/image";
import { MAX_VIDA_REAL, 
    MAX_VIDA_VISUAL, 
    INTERVALO_DE_SPAWN_ZOMBIE_1, 
    TELA_DIMENSOES, 
    IMG_FUNDO, 
    GAME_OVER,
    INTERVALO_DE_DANO_TIRO,
    FPS,
    TIROS_POR_INTERVALO,
    INTERVALO_ENTRE_TIROS,
} from "./constantes";
import { desenhaSoldado, moveSoldado, Soldado, SOLDADO_INICIAL_TESTE } from "./soldado";
import { Zombie_2, atualizaZombie_2, desenhaZombies_2, makeZombie_2 } from "./zombie_2";
import { Tiro, desenhaTirosSoldado, desenhaTirosZombie_2, makeTiroSoldado, moveTiros } from "./tiro";
import { colisaoTiroSoldado, colisaoTiroZombie } from "./utils";
import { Zombie_1, desenhaZombies_1, makeZombie_1, moveZombie_1 } from "./zombie_1";


let TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 = 100; // ESPERAR UM POUCO PARA OS ZOMBIES 1 APARECEREM
let tempoDecorrido = 0;
let tempoDecorridoDanoTiro = 0;
let tirosDados = 0;
let ultimoTiroTempo = 0;
let vidaReal = MAX_VIDA_REAL;
let vidaVisual = MAX_VIDA_VISUAL;

//------------------ Módulo: definição de dados ----------------
export interface Jogo {
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
export function makeJogo(): Jogo {
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


/**
 * atualizaJogo: Jogo, String -> Jogo
 * Atualiza o jogo a cada tick.
 */
export function atualizaJogo(jogo: Jogo, tecla: string): Jogo {
    let novoCont = (jogo.cont + 1) % FPS;
    let novaPontuacao = novoCont === 0 ? jogo.pontuacao + 1 : jogo.pontuacao;
    const soldadoEmJogo = moveSoldado(jogo.soldado, tecla); // novo soldado para o jogo
    const zombies_2Atualizados = jogo.zombies_2.map((zombie_2) =>
      atualizaZombie_2(zombie_2, jogo.soldado, jogo.tiros, jogo.tirosZombie_2)
    ); //atualiza e guarda o estado do zumbi 2
    const zombiesAtualizados = jogo.zombies.map((zombie) =>
      moveZombie_1(zombie, soldadoEmJogo)
    );//atualiza e guarda o estado dos zumbis 1
  
    const tirosSoldadoAtualizados = moveTiros(jogo.tiros);
    const tirosZombie_2Atualizados = moveTiros(jogo.tirosZombie_2);
  
  // \/ evitar que o dano do tiro seja aplicado diversas vezes em um mesmo projetil,
  //é tipo um controlador de frequencia de dano
    tempoDecorridoDanoTiro += 1;
    if (tempoDecorridoDanoTiro >= INTERVALO_DE_DANO_TIRO) {
      tempoDecorridoDanoTiro = 0;
  
      // Verifica colisão entre tiros e zombies
      const zombiesParaRemover: number[] = []; //zombies que morreram vao para cá
      for (let i = 0; i < zombiesAtualizados.length; i++) {
        for (let j = 0; j < tirosSoldadoAtualizados.length; j++) {
          if (tirosSoldadoAtualizados[j].ativo && zombiesAtualizados[i].vidas > 0) {
            if (colisaoTiroZombie(tirosSoldadoAtualizados[j], zombiesAtualizados[i])) {
              zombiesAtualizados[i].vidas -= 1;
              tirosSoldadoAtualizados[j].ativo = false;
  
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
    // remocao dos zombies 1 sem vida
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
    TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 -= 1;
  
    if (TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 <= 0) {
      const novoZombie = makeZombie_1(jogo.soldado);
      zombiesAtualizados.push(novoZombie);
      TEMPO_INICIAL_PARA_SPAWN_ZOMBIE_1 = INTERVALO_DE_SPAWN_ZOMBIE_1; // aqui ajusta o intervalo desejado para criar novos zombies
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
      tiros: tirosSoldadoAtualizados,
    };
  }

/**
 * trataTeclaJogo: Jogo, String -> Jogo
 * Função que realiza a verificação das teclas no jogo.
 */
export function trataTeclaJogo(jogo: Jogo, tecla: string): Jogo {
    if (jogo.gameOver) {
      return makeJogo();
    }
    let jogoAtualizado = jogo; // Comece com o jogo atual
    const tempoAtual = tempoDecorrido;
    if (tecla === ' ' && tirosDados < TIROS_POR_INTERVALO && (tempoAtual - ultimoTiroTempo) >= INTERVALO_ENTRE_TIROS) {
      const soldadoAtualizada = moveSoldado(jogoAtualizado.soldado, tecla);
      const novoTiro = makeTiroSoldado(soldadoAtualizada.x + 40, soldadoAtualizada.y + 18);
      jogoAtualizado.tiros.push(novoTiro);
      tirosDados++;
      ultimoTiroTempo = tempoAtual;
    }
    return { ...jogoAtualizado, soldado: moveSoldado(jogoAtualizado.soldado, tecla) };
  }


//--------------------- Módulo: Funções do tipo Desenha----------------------
/**
 * desenhaVidas: Number, Imagem -> Imagem
 * Desenha a barra de vida do soldado.
 * Poderia simplesmente ser adicionado no arquivo soldado.ts
 */
export function desenhaVidas(vidaReal: number, imagem: Imagem): Imagem {
    const larguraBarra = 120; // Largura total da barra de vida
    const alturaBarra = 10;  // Altura da barra de vida
    const vidaAtual = Math.max(0, vidaReal); // Garante que a vida não seja negativa
    const larguraAtual = (vidaAtual / MAX_VIDA_REAL) * larguraBarra;
    const barraVida = retangulo(larguraAtual, alturaBarra, "green", "green"); 
    const textoVida = texto(`Vidas: ${vidaAtual}`, "Arial", "20px", "white");
    const novaImagem = colocarImagem(barraVida, 70, TELA_DIMENSOES.ALTURA - 30, imagem);
    colocarImagem(textoVida, 130, TELA_DIMENSOES.ALTURA - 30, novaImagem);
    return novaImagem;
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
export function desenhaJogo(jogo: Jogo): Imagem {
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