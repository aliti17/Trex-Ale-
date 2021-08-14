var trex, trex_running, edges, trexdie;
var groundImage;
var nube, nubeImage, grupoNube;
var obs1, obs2, obs3, obs4, obs5, obs6, grupoObstaculos;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY; 
var gameOver, restart, gameOverImage, restartImage;
var muerteSound, saltoSound, puntajeSound;

function preload(){
  trex_running= loadAnimation("trex1.png","trex3.png","trex4.png");
  trexdie = loadImage ("trex_collided.png");
  groundImage = loadImage("ground2.png");
  nubeImage = loadImage ("cloud.png");
  obs1 = loadImage ("obstacle1.png");
  obs2 = loadImage ("obstacle2.png");
  obs3 = loadImage ("obstacle3.png");
  obs4 = loadImage ("obstacle4.png");
  obs5 = loadImage ("obstacle5.png");
  obs6 = loadImage ("obstacle6.png");
  gameOverImage = loadImage ("gameOver.png");
  restartImage = loadImage ("restart.png");
  muerteSound = loadSound ("die.mp3");
  saltoSound = loadSound ("jump.mp3");
  puntajeSound = loadSound ("checkPoint.mp3");
}

function setup(){
  createCanvas(600,200);
  
  //crea el Trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation ("collided", trexdie);
  edges = createEdgeSprites();
  
  //añade escala y posición al Trex
  trex.scale = 0.5;
  trex.x = 50
  
  gameOver = createSprite (300, 100);
  gameOver.addImage (gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite (300, 135);
  restart.addImage (restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  suelo = createSprite (400,170,400,20);
  suelo.addImage("suelo", groundImage);
  suelo.x=suelo.width/2;
  
  suelotransparente = createSprite (200, 190, 400, 10);
  suelotransparente.visible = false;
  
  grupoNube = new Group ();
  grupoObstaculos = new Group ();
  
  trex.setCollider ("circle", 0, 0, 40);
  trex.debug = false;
}


function draw(){
  //establece un color de fondo 
  background("white");
  
  text ("Puntaje: " + score, 500, 50);
  
  
  if (gameState === PLAY) {
    suelo.velocityX = -(5 + score / 100);
    score = score + Math.round (getFrameRate() / 60);
    
    if (score > 0 && score % 100 === 0){
      puntajeSound.play();
    }
      
    if(suelo.x<0){
      suelo.x=suelo.width/2;
    }
    //salta cuando se presiona la barra espaciadora
    if(keyDown("space") && trex.y>=120){
      trex.velocityY = -10;
      saltoSound.play();
    }
    trex.velocityY = trex.velocityY + 0.5;
    spawnclouds();
    spawnObstacles();
    if (grupoObstaculos.isTouching(trex)){
      gameState = END;
      muerteSound.play();
    }
  }
  
  
  else if (gameState === END){
    suelo.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation ("collided", trexdie);
    grupoNube.setVelocityXEach (0);
    grupoObstaculos.setVelocityXEach (0);
    grupoNube.setLifetimeEach (-1);
    grupoObstaculos.setLifetimeEach (-1);
    gameOver.visible = true; 
    restart.visible = true;
  }
  
  
  //evita que el Trex caiga
  trex.collide(suelotransparente);
 
  if (mousePressedOver (restart)){
    reiniciar();
  }
  
  drawSprites();
}

function spawnclouds (){
  if (frameCount % 60 === 0){
    nube = createSprite (600, 100, 40, 10);
    nube.addImage (nubeImage);
    nube.scale = 0.6;
    nube.y= Math.round (random (10, 70));
    nube.velocityX = - (3 + score /100);
    nube.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nube.lifetime = 200; 
    grupoNube.add (nube);
  }
  
}

function spawnObstacles() {
  if (frameCount % 60 === 0){
    obstaculo = createSprite (600, 160, 10, 40);
    obstaculo.velocityX = -(5 + score/100);
    obstaculo.scale = 0.5;
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth + 1;
    var aleatorio = Math.round (random(1,6));
    switch (aleatorio) {
      case 1 : obstaculo.addImage (obs1);
        break;
      case 2 : obstaculo.addImage (obs2);
        break;
      case 3 : obstaculo.addImage (obs3);
        break;
      case 4 : obstaculo.addImage (obs4);
        break;
      case 5 : obstaculo.addImage (obs5);
        break;
      case 6 : obstaculo.addImage (obs6);
        break;
      default : break; 
    }
    obstaculo.lifetime = 120;
    grupoObstaculos.add (obstaculo);
  }
}

function reiniciar() {
  gameState = PLAY; 
  grupoObstaculos.destroyEach();
  grupoNube.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation ("running", trex_running);
  score = 0;
}


