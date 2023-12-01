import {
    LARGURA_IMG_SOLDADO, 
    ALTURA_IMG_SOLDADO, 
    ALTURA_TIRO_ZOMBIE2,
    LARGURA_TIRO_ZOMBIE2,
    RAIO_COLISAO_ZOMBIE_1,
} from "./constantes";
import { Soldado } from "./soldado";
import { Zombie_1 } from "./zombie_1";
import { Tiro } from "./tiro";

//------------------- Módulo: Funções de Colisão -------------------------
export function colisaoTiroSoldado(tiro: Tiro, soldado: Soldado): boolean {
    return (
      tiro.ativo &&
      tiro.x < soldado.x + LARGURA_IMG_SOLDADO / 2 &&
      tiro.x + LARGURA_TIRO_ZOMBIE2 > soldado.x - LARGURA_IMG_SOLDADO / 2 &&
      tiro.y < soldado.y + ALTURA_IMG_SOLDADO / 2 &&
      tiro.y + ALTURA_TIRO_ZOMBIE2 > soldado.y - ALTURA_IMG_SOLDADO / 2
    );
  }

export function colisaoTiroZombie(tiro: Tiro, zombie: Zombie_1): boolean {
    const distanciaX = Math.abs(tiro.x - zombie.x);
    const distanciaY = Math.abs(tiro.y - zombie.y);
    const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
    return distancia <= RAIO_COLISAO_ZOMBIE_1 + 20;
  }