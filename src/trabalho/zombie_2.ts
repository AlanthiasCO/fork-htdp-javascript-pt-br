// ------------- Imports Gerais -------------
import { Imagem, colocarImagem } from "../../lib/image";
import { TELA_DIMENSOES, LARGURA_IMG_ZOMBIE_2, VELOCIDADE_ZOMBIE_2, LIMITE_CIMA_SOLDADO, INTERVALO_ENTRE_TIROS_ZOMBIE_2, MAX_VIDA_REAL, MAX_VIDA_VISUAL, IMG_ZOMBIE_2 } from "./constantes";
import { Soldado } from "./soldado";
import { Tiro, makeTiroZombie2, TiroZombie2 } from "./tiro";
import { colisaoTiroSoldado } from "./utils";
let vidaReal = MAX_VIDA_REAL;
let vidaVisual = MAX_VIDA_VISUAL;

//------------------ Módulo: definição de dados ----------------
export interface Zombie_2 {
    x: number;
    y: number;
    deslocamento: number;
    direcaoY: number;
    tempoParaDisparar: number;
  }

//--------------------- Módulo: Funções do tipo Make----------------------
export function makeZombie_2(): Zombie_2 {
    return {
       x: TELA_DIMENSOES.LARGURA - LARGURA_IMG_ZOMBIE_2 / 2, 
       y: TELA_DIMENSOES.ALTURA / 2, 
       deslocamento: VELOCIDADE_ZOMBIE_2, 
       direcaoY: 1, 
       tempoParaDisparar: 0 };
  }

//--------------------- Módulo: Funções do tipo Move----------------------
export function moveZombie_2(zombie_2: Zombie_2): Zombie_2 {
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

export function atualizaZombie_2(zombie_2: Zombie_2, soldado: Soldado, _tiros: Tiro[], tirosZombie_2: TiroZombie2[]): Zombie_2 {
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

//--------------------- Módulo: Funções do tipo Desenha----------------------
/**
 * desenhaZombies_2: Zombie_2[], Imagem -> Imagem
 * Desenha os zombies tipo 2 (zombie 2).
 */
export function desenhaZombies_2(zombies_2: Zombie_2[], imagem: Imagem): Imagem {
    for (const zombie_2 of zombies_2) {
      imagem = colocarImagem(IMG_ZOMBIE_2, zombie_2.x, zombie_2.y, imagem);
    }
    return imagem;
  }