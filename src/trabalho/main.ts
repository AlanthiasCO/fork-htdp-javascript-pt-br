import { reactor } from "../../lib/universe";
import { atualizaJogo, desenhaJogo, makeJogo, trataTeclaJogo } from "./jogo";

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


  