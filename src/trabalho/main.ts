import { alturaImagem, carregarImagem, cenaVazia, larguraImagem } from "../../lib/image"
import imgUrlPersonagem from "./samurai_padrao.png";


//---------TELA-----------------------
const [LARGURA, ALTURA] = [900, 500]
const TELA = cenaVazia(LARGURA, ALTURA);
//------------------------------------ 

//---------PERSONAGEM-----------------------
const IMG_PERSONAGEM_PADRAO = carregarImagem(imgUrlPersonagem, 120, 120);
const Y_INICIAL_PERSONAGEM = 250;
const X_INICIAL_PERSONAGEM = 450;
const VELOCIDADE_PERSONAGEM = 3;
//--------LIMITES_PERSONAGEM-----------------
const LIMITE_ESQUERDA_PERSONAGEM = 0 + larguraImagem(IMG_PERSONAGEM_PADRAO) / 2;
const LIMITE_DIREITA_PERSONAGEM = LARGURA - larguraImagem(IMG_PERSONAGEM_PADRAO) / 2;
const LIMITE_BAIXO_PERSONAGEM = ALTURA - alturaImagem(IMG_PERSONAGEM_PADRAO) / 2;
const LIMITE_CIMA_PERSONAGEM = 0 + alturaImagem(IMG_PERSONAGEM_PADRAO) / 2;


