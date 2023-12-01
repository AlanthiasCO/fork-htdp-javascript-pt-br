import { Imagem, colocarImagem } from "../../lib/image";
import { IMG_ZOMBIE_1, LIMITE_CIMA_SOLDADO, LIMITE_ESQUERDA_SOLDADO, TELA_DIMENSOES, VELOCIDADE_ZOMBIE_1 } from "./constantes";
import { Soldado } from "./soldado";


//------------------ Módulo: definição de dados ----------------
export interface Zombie_1 {
    x: number;
    y: number;
    vidas: number;
    deslocamento: number;
    tempoParaColisao: number;
    direcaoX: number;
    direcaoY: number;
  }

//--------------------- Módulo: Funções do tipo Make----------------------
export function makeZombie_1(_soldado: Soldado): Zombie_1 {
    const spawnX = TELA_DIMENSOES.LARGURA;
    const spawnY = Math.random() * TELA_DIMENSOES.ALTURA;
    const direcaoX = -1; //ANDAR SEMPRE PARA A ESQUERDA
    const direcaoY = Math.random() < 0.5 ? 1 : -1;
  
    return { 
      x: spawnX, 
      y: spawnY, 
      vidas: 4, 
      deslocamento: VELOCIDADE_ZOMBIE_1, 
      direcaoX, 
      direcaoY, 
      tempoParaColisao: 0 };
  }

  //--------------------- Módulo: Funções do tipo Move----------------------
export function moveZombie_1(zombie_1: Zombie_1, soldado: Soldado): Zombie_1 {
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
    // \/ Declarar nas constantes diretamente
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

//--------------------- Módulo: Funções do tipo Desenha----------------------
  /**
 * desenhaZombies: Zombie_1[], Imagem -> Imagem
 * Desenha os zombies tipo 1 (zombie 1).
 */
export function desenhaZombies_1(zombies: Zombie_1[], imagem: Imagem): Imagem {
    for (const zombie of zombies) {
      imagem = colocarImagem(IMG_ZOMBIE_1, zombie.x, zombie.y, imagem);
    }
    return imagem;
  }

