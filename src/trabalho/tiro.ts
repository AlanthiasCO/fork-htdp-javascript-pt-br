// ------------- Imports Gerais -------------
import { Imagem, colocarImagem } from "../../lib/image";
import { IMG_TIRO, IMG_TIRO_ZOMBIE_2, VELOCIDADE_TIRO_ZOMBIE_2 } from "./constantes";

//------------------ Módulo: definição de dados ----------------
export interface Tiro {
    x: number;
    y: number;
    ativo: boolean;
    image: Imagem,
    direcao: number;
  }

export interface TiroZombie2 extends Tiro {
}  

//--------------------- Módulo: Funções do tipo Make ----------------------
export function makeTiroSoldado(x: number, y: number, direcao: number = 1): Tiro {
    return { 
      x, 
      y, 
      ativo: true, 
      image: IMG_TIRO, 
      direcao };
  }
  
export function makeTiroZombie2(x: number, y: number, direcao: number = -1): TiroZombie2 {
    return { 
      x,
      y, 
      ativo: true, 
      image: IMG_TIRO_ZOMBIE_2, 
      direcao };
  }

//--------------------- Módulo: Funções do tipo Move ----------------------
/**
 * moveTiros: Tiro[] -> Tiro[]
 * Movimenta os tiros no jogo.
 */
export function moveTiros(tiros: Tiro[]): Tiro[] {
    return tiros.map((tiro) => {
      if (tiro.ativo) {
        tiro.x += VELOCIDADE_TIRO_ZOMBIE_2 * tiro.direcao; // Ajuste a velocidade dos tiros conforme necessário
      }
      return tiro;
    });
  }
  
//--------------------- Módulo: Funções do tipo Desenha ----------------------
  /**
 * desenhaTiros: Tiro[], Imagem -> Imagem
 * Desenha os tiros do soldado.
 */
export function desenhaTirosSoldado(tiros: Tiro[], imagem: Imagem): Imagem {
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
export function desenhaTirosZombie_2(tirosZombie_2: TiroZombie2[], imagem: Imagem): Imagem {
  for (const tiro of tirosZombie_2) {
    if (tiro.ativo) {
      imagem = colocarImagem(tiro.image, tiro.x, tiro.y, imagem);
    }
  }
  return imagem;
}