import { carregarImagem, texto, colocarImagem, larguraImagem, alturaImagem } from "../../lib/image";
import imgSoldado from "./assets/survivor.png";
import imgZombie_1 from "./assets/zombie_1.png";
import imgTiroUrl from "./assets/bullet_j-re.png";
import imgFundoUrl from "./assets/Ground.png";
import imgZombie_2 from "./assets/zombie_2.png";
import imgTiroZombie2 from "./assets/spike.png";

//------------- Módulo: Declaração de Constantes -------------
// Constantes da Tela
export const TELA_DIMENSOES = {LARGURA: 600, ALTURA: 400};
export const IMG_FUNDO = carregarImagem(imgFundoUrl, TELA_DIMENSOES.LARGURA, TELA_DIMENSOES.ALTURA);
export const TEXTO_GAME_OVER = texto("GAME OVER", "arial", "50px", "red");
export const GAME_OVER = colocarImagem(TEXTO_GAME_OVER, TELA_DIMENSOES.LARGURA / 4, TELA_DIMENSOES.ALTURA / 2 - 20, IMG_FUNDO)

// Constantes da Jogo
export const FPS = 60;

// Constantes do Soldado
export const IMG_SOLDADO_INO = carregarImagem(imgSoldado, 100, 70);
export const LARGURA_IMG_SOLDADO = larguraImagem(IMG_SOLDADO_INO);
export const ALTURA_IMG_SOLDADO = alturaImagem(IMG_SOLDADO_INO);
export const Y_INICIAL_SOLDADO = TELA_DIMENSOES.ALTURA / 2;
export const LIMITE_ESQUERDA_SOLDADO = 0 + LARGURA_IMG_SOLDADO / 2;
export const LIMITE_DIREITA_SOLDADO = TELA_DIMENSOES.LARGURA - LARGURA_IMG_SOLDADO / 2;
export const LIMITE_BAIXO_SOLDADO = TELA_DIMENSOES.ALTURA - ALTURA_IMG_SOLDADO / 2;
export const LIMITE_CIMA_SOLDADO = 0 + ALTURA_IMG_SOLDADO / 2;
export const VELOCIDADE_SOLDADO = 12;
export const MAX_VIDA_REAL = 800;
export const MAX_VIDA_VISUAL = 4;


// Constantes do Zombie 1
export const IMG_ZOMBIE_1 = carregarImagem(imgZombie_1, 100, 70);
export const LARGURA_IMG_ZOMBIE_1 = larguraImagem(IMG_ZOMBIE_1);
export const ALTURA_IMG_ZOMBIE_1 = alturaImagem(IMG_ZOMBIE_1);
export const RAIO_COLISAO_ZOMBIE_1 = (LARGURA_IMG_ZOMBIE_1 + ALTURA_IMG_ZOMBIE_1) / 2 / 3;
export const VELOCIDADE_ZOMBIE_1 = 1;
export const INTERVALO_DE_SPAWN_ZOMBIE_1 = 5 * FPS;

// Constantes do Zombie 2
export const IMG_ZOMBIE_2 = carregarImagem(imgZombie_2, 100, 70);
export const LARGURA_IMG_ZOMBIE_2 = larguraImagem(IMG_ZOMBIE_2);
export const VELOCIDADE_ZOMBIE_2 = 2;
export const IMG_TIRO_ZOMBIE_2 = carregarImagem(imgTiroZombie2, 20, 8);
export const LARGURA_TIRO_ZOMBIE2 = larguraImagem(IMG_TIRO_ZOMBIE_2);
export const ALTURA_TIRO_ZOMBIE2 = alturaImagem(IMG_TIRO_ZOMBIE_2);
export const VELOCIDADE_TIRO_ZOMBIE_2 = 1.5;
export const INTERVALO_ENTRE_TIROS_ZOMBIE_2 = 1 * FPS;

// Constantes do Tiro
export const IMG_TIRO = carregarImagem(imgTiroUrl, 20, 8);
export const INTERVALO_DE_DANO_TIRO = 0.5 * FPS;
export const INTERVALO_ENTRE_TIROS = 0.4;
export const TIROS_POR_INTERVALO = 5000;
