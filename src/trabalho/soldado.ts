// ------------- Imports Gerais -------------
import { Imagem, colocarImagem } from "../../lib/image";
import { testes } from "../../lib/utils";
import {
    TELA_DIMENSOES,
    VELOCIDADE_SOLDADO,
    MAX_VIDA_REAL, 
    LIMITE_DIREITA_SOLDADO, 
    LIMITE_ESQUERDA_SOLDADO,
    LIMITE_CIMA_SOLDADO,
    LIMITE_BAIXO_SOLDADO,
    Y_INICIAL_SOLDADO,
    IMG_TIRO,
    IMG_SOLDADO_INO,
    IMG_FUNDO,
} from "./constantes";
import { Tiro } from "./tiro";


//------------------ Módulo: definição de dados ----------------
export interface Soldado {
    x: number;
    y: number;
    deslocamento: number;
    vidas: number;
  }

//--------------------- Módulo: Funções do tipo Make----------------------
export function makeSoldado(_x: number, _y: number, _deslocamento: number, _vidas: number): Soldado {
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

  export function makeTiroSoldado(x: number, y: number, direcao: number = 1): Tiro {
    return { 
      x, 
      y, 
      ativo: true, 
      image: IMG_TIRO, 
      direcao };
  }

//--------------------- Módulo: Funções do tipo Move----------------------
/**
 * moveSoldado: Soldado, String -> Soldado
 * Movimenta o soldado.
 */
export function moveSoldado(soldado: Soldado, tecla: string): Soldado {
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

//--------------------- Módulo: Funções do tipo Desenha----------------------
export function desenhaSoldado(soldado: Soldado): Imagem {
    return colocarImagem(IMG_SOLDADO_INO, soldado.x, soldado.y, IMG_FUNDO);
  }