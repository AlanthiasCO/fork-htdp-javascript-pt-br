import { alturaImagem, carregarImagem, cenaVazia, colocarImagem, larguraImagem } from "../../lib/image"
import imgUrlPersonagem from "./samurai_padrao.png";
import imgUrlPersonagemAtaq from "./samurai_ataque.png";
import imgUrlFundo from "./fundo.jpg";


//====================DECLARACAO DAS CONSTANTES=================================

//--------------------------TELA-----------------------------------------
const [LARGURA, ALTURA] = [900, 500]
const TELA_VAZIA = cenaVazia(LARGURA, ALTURA);
const TELA_COM_FUNDO= carregarImagem(imgUrlFundo, LARGURA, ALTURA);
//----------------------------------------------------------------------

//---------PERSONAGEM----------------------------------------------------
const IMG_PERSONAGEM_PADRAO = carregarImagem(imgUrlPersonagem, 100, 100);
const IMG_PERSONAGEM_ATAQUE = carregarImagem(imgUrlPersonagemAtaq, 140, 100);
const Y_INICIAL_PERSONAGEM = ALTURA / 2;
const X_INICIAL_PERSONAGEM = LARGURA / 2;
const VELOCIDADE_PERSONAGEM = 3;
//--------LIMITES_PERSONAGEM-----------------
const LIMITE_ESQUERDA_PERSONAGEM = 0 + larguraImagem(IMG_PERSONAGEM_PADRAO) / 2;
const LIMITE_DIREITA_PERSONAGEM = LARGURA - larguraImagem(IMG_PERSONAGEM_PADRAO) / 2;
const LIMITE_BAIXO_PERSONAGEM = ALTURA - alturaImagem(IMG_PERSONAGEM_PADRAO) / 2;
const LIMITE_CIMA_PERSONAGEM = 0 + alturaImagem(IMG_PERSONAGEM_PADRAO) / 2;
//---------------------------------------------------------------------------------
//====================FIM DECLARACAO DAS CONSTANTES=================================


//=============DECLARACAO DOS DADOS==================================================
interface Personagem {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

// EXEMPLO
const PERSONAGEM_INICIAL_1: Personagem = {
    x: LARGURA / 2,
    y: ALTURA / 2,
    dx: 0,
    dy: 0,
};


/*TESTANDO A TELA DE FUNDO*/
const PERSONAGEM_TESTE = colocarImagem(IMG_PERSONAGEM_PADRAO, X_INICIAL_PERSONAGEM, Y_INICIAL_PERSONAGEM, TELA_COM_FUNDO);
PERSONAGEM_TESTE.desenha()

