const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// canvas.width *= 2;
// canvas.height *= 2;
const wdt = canvas.width;
const hgt = canvas.height;

//ボールのデータ
let ballX = wdt / 2;
let ballY = hgt - 60;
let ballR = 10;
let lastX = 0;
let lastY = 0;
//ボールの移動変数
let dx = 2;
let dy = -2;

//バーのデータ
let paddleW = 80;
let paddleH = 10;
let paddleX = wdt / 2 - paddleW / 2;
let paddleY = ballY + ballR;
//バーの移動
let rightPressed = false;
let leftPressed = false;
let pdx = 7;

//ブロックのデータ
let blockW = 50;
let blockH = 20;
let blockLineCount = 5;
let blockColumnCount = 10;
let blockPadding = 5;
let blockOffsetTop = 30;
let blockOffsetLeft = 30;

//スコア
let score = 0;

//l*cの行列でブロックを配置するための二次元配列
let blocks = [];
for (let l = 0; l < blockLineCount; l++) {
  blocks[l] = [];
  for (let c = 0; c < blockColumnCount; c++) {
    blocks[l][c] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//キーが押されているとき
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}
//キーが押されていないと
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

//let testX = 0;
//ボール
function drawBall() {
  //ボールのデータ
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballR, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
  lastX = ballX;
  lastY = ballY;
  ballX += dx;
  ballY += dy;

  //testX = ballX;

  //壁で反射
  if (ballX + ballR == wdt || ballX - ballR == 0) {
    dx *= -1;
  }
  if (ballY - ballR == 0) {
    dy *= -1;
  }
  //ゲームオーバー
  if (ballY + ballR > hgt) {
    alert("GAME OVER");
    document.location.reload();
    clearInterval(interval);
  }
  //バー(paddle)で反射
  if (ballX + ballR > paddleX && ballX - ballR < paddleX + paddleW) {
    if(ballY + ballR > paddleY){
      if (lastX < paddleX + paddleW / 3.0 && dx > 0) {
        dx *= -1;
        dy *= -1;
      } else if (lastX > paddleX + paddleW - paddleW / 3.0 && dx < 0) {
        dx *= -1;
        dy *= -1;
      } else {
        dy *= -1;
      }
    }
  }
}

//バー
function drawBar() {
  //バーのデータ
  //paddleX = testX - paddleW/2;
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleW, paddleH);
  ctx.fillStyle = "white";
  ctx.fill();
  //ctx.strokeStyle = "#00633A"
  //ctx.stroke();
  ctx.closePath();

  //左右キーで操作
  if (rightPressed && paddleX + paddleW <= wdt) {
    paddleX += pdx;
  }
  if (leftPressed && paddleX >= 0) {
    paddleX -= pdx;
  }
}

//ブロック
function drawBlocks() {
  for(let l=0; l<blockLineCount; l++){
    for(let c=0; c<blockColumnCount; c++){
      if(blocks[l][c].status == 1){
        let blockX = blockOffsetLeft + c * (blockW + blockPadding);
        let blockY = blockOffsetTop + l * (blockH + blockPadding);
        blocks[l][c].x = blockX;
        blocks[l][c].y = blockY;
      
        ctx.beginPath();
        ctx.rect(blockX, blockY, blockW, blockH);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//ブロックとボールの衝突検出
function collisionDetection(){
    for(let l=0; l<blockLineCount; l++){
    for(let c=0; c<blockColumnCount; c++){
      let b = blocks[l][c];
      if(b.status == 1){
        if (b.x + blockW >= ballX - ballR && b.x <= ballX + ballR && b.y <= ballY + ballR && b.y + blockH >= ballY - ballR) {
          b.status = 0;
          score++;
          if(lastX - ballR <= b.x + blockW && lastX + ballR >= b.x){
            dy *= -1;
          }
          if(lastY + ballR >= b.y && lastY - ballR <= b.y + blockH){
            dx *= -1;
          }
        }
      }
    }
  }
}

//ゲームクリア判定
function gameClearDetection(){
  let clear=0;
  for(let l=0; l<blockLineCount; l++){
    for(let c=0; c<blockColumnCount; c++){
      clear += blocks[l][c].status;
    }
  }
  //ゲームクリア
  if (clear == 0) {
    alert("GAME CLEAR\nCongratulations!!");
    document.location.reload();
    clearInterval(interval);
  }
}

//スコア計測
function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " +score, 8, 20);
}

//描画
function draw() {
  ctx.clearRect(0, 0, wdt, hgt);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, wdt, hgt);
  drawBall();
  drawBar();
  drawBlocks();
  gameClearDetection();
  collisionDetection();
  drawScore();
}

//10ms毎にdrawを繰り返す
let interval = setInterval(draw, 10);