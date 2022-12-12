console.log('[DevAlysson] Flappy Bird');
console.log('feito por um estudante de programação =)')

let frames = 0;

const hit = new Audio();
hit.src = './Image/efeitos_hit.wav'

const sprites = new Image();
sprites.src = './Image/sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


//[MENSAGEM DE INICIO]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  draw() {
    contexto.drawImage(
    sprites,
    mensagemGetReady.sX, mensagemGetReady.sY,
    mensagemGetReady.w, mensagemGetReady.h,
    mensagemGetReady.x, mensagemGetReady.y,
    mensagemGetReady.w, mensagemGetReady.h
    );
  }
};


//[PLANO DE FUNDO]
const background = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
      contexto.fillStyle = '#70c5ce';
      contexto.fillRect(0,0, canvas.width, canvas.height)
  
      contexto.drawImage(
        sprites,
        background.spriteX, background.spriteY,
        background.largura, background.altura,
        background.x, background.y,
        background.largura, background.altura,
      );

      contexto.drawImage(
        sprites,
        background.spriteX, background.spriteY,
        background.largura, background.altura,
        (background.x + background.largura), background.y,
        background.largura, background.altura,
      );
    },
};


//[CRIAR CHÃO]
function createFloor() {
  const floor = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const floorMove = 1;
      const repeteEm = floor.largura / 2;
      const movement = floor.x - floorMove;

      floor.x = movement % repeteEm;

      },
    draw() {
      contexto.drawImage(
      sprites,
        floor.spriteX, floor.spriteY,
        floor.largura, floor.altura,
        floor.x, floor.y,
        floor.largura, floor.altura,
        );
    
      contexto.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.largura, floor.altura,
        (floor.x + floor.largura), floor.y,
        floor.largura, floor.altura,
        );
      },
    };
  return floor;
};


function fazColisao(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const floorY = floor.y;

  if(flappyBirdY >= floorY) {
    return true;
  }

  return false;
};


//[CRIA FLAPPY BIRD]
function createFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pular: 4.6,
      jump() {
      flappyBird.velocidade = - flappyBird.pular;
      },
    gravidade: 0.25,
    velocidade: 0,
      update() {
        if(fazColisao(flappyBird, globais.floor)) {
          hit.play();
          changeScreen(telas.GAME_OVER); 
          return;
      }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
          },
    movimentos: [
      {spriteX: 0, spriteY: 0,},
      {spriteX: 0, spriteY: 26,},
      {spriteX: 0, spriteY: 52,},
    ],
    frameAtual: 0,
        updateFrameAtual() {
          const intervaloFrames = 10;
          const passouOIntervalo = frames % intervaloFrames <= 1;

          if(passouOIntervalo) {
            const baseDoIncremento = 1;
            const incremento = baseDoIncremento + flappyBird.frameAtual;
            const baseRepeticao = flappyBird.movimentos.length;
            flappyBird.frameAtual = incremento % baseRepeticao
          }
    },
        draw() {
            flappyBird.updateFrameAtual()

            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
}
return flappyBird;
};


let telaAtiva = {};
const globais = {};


//[MUDA TELA]
function changeScreen(newScreen) {
  telaAtiva = newScreen;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
};


function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    draw() {
      const espacoCanos = 90;
      canos.pares.forEach(function(par){
      const yRandom = par.y;


      const canoCeuX = par.x;
      const canoCeuY = yRandom;
      
      //[CANO CÉU]
      contexto.drawImage(
        sprites, 
        canos.ceu.spriteX, canos.ceu.spriteY,
        canos.largura, canos.altura,
        canoCeuX, canoCeuY,
        canos.largura, canos.altura,
      )
      const canoChaoX = par.x;
      const canoChaoY = canos.altura + espacoCanos + yRandom;

      contexto.drawImage(
        sprites,
        canos.chao.spriteX, canos.chao.spriteY,
        canos.largura, canos.altura,
        canoChaoX, canoChaoY,
        canos.largura, canos.altura,
      )
      par.canoCeu = {
        x: canoCeuX,
        y: canos.altura + canoCeuY
      }
      par.canoChao = {
        x: canoChaoX,
        y: canoChaoY
      }
    })
  },
  temColisaoComOFlappy(par) {
    const cabecaDoFlappy = globais.flappyBird.y;
    const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

    if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {

      if(cabecaDoFlappy <= par.canoCeu.y) {
        return true;
      }
      if(peDoFlappy >= par.canoChao.y) {
        return true;
      }
    }
    return false;
  },
      pares: [],
      
      update() {
        const passou100Frames = frames % 100 === 0;
          if(passou100Frames) {
            console.log(passou100Frames)
            canos.pares.push({
                x: canvas.width,
                y: -150 * (Math.random() + 1),
              });
        }

        canos.pares.forEach(function(par){
          par.x = par.x - 2;

          if(canos.temColisaoComOFlappy(par)) {
            console.log('[VOCÊ PERDEU!]')
            hit.play();
            changeScreen(telas.GAME_OVER);
          }

          if(par.x + canos.largura <= 0) {
            canos.pares.shift();
          }
        });

      }
    }
    return canos;
};


function criaPlacar() {
  const placar = {
    pontuacao: 0,
    draw() {
      contexto.font = '25px "VT323" ';
      contexto.fillStyle = 'white'
      contexto.fillText(`tempo vivo: ${placar.pontuacao}seg`, canvas.width - 170, 35);
      placar.pontuacao
    },
    update() {
      const intervaloDeFrames = 55;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    },
  }

  return placar;
};


  //[TELAS]
const telas = {
  inicio: {
    inicializa() {
      globais.flappyBird = createFlappyBird();
      globais.floor = createFloor();
      globais.canos = criaCanos();
    },
    draw() {
      background.draw();
      globais.flappyBird.draw();

      globais.floor.draw();
      mensagemGetReady.draw();
      },
    click() {
      changeScreen(telas.JOGO);
      },
    update() {
      globais.floor.update();
      globais.canos.update();
    },
  }
};


telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar();
  },
  draw() {
    background.draw();
    globais.canos.draw();
    globais.floor.draw();
    globais.flappyBird.draw();
    globais.placar.draw();
  },
  click(){
    globais.flappyBird.jump();
  },
  update() {
    globais.canos.update();
    globais.floor.update();
    globais.flappyBird.update();
    globais.placar.update();
  },
};


const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  draw() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h
    );
  }
};


telas.GAME_OVER = {
  draw() {
    mensagemGameOver.draw();
  },
  update() {
     //[NADA]
  },
  click() {
    changeScreen(telas.inicio);
  },
};


function loop() {

  telaAtiva.draw();
  telaAtiva.update();
  frames = frames + 1;
  requestAnimationFrame(loop);

};


window.addEventListener('click', function() {
     if (telaAtiva.click) {
      telaAtiva.click();
     }
});

changeScreen(telas.inicio);
loop();