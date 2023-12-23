const canvasDiv = document.querySelector('canvas');
const canvas = canvasDiv.getContext('2d');
const WIDTH = canvasDiv.width;
const HEIGHT = canvasDiv.height;

const scoreSpan = document.querySelector('#score>span')
const HighScoreSpan = document.querySelector('#high-score>span')
const reset = document.querySelector('#reset')
const start = document.querySelector('#start')

let HighScore = localStorage.getItem('HighScore') || 0;
HighScoreSpan.innerHTML = HighScore<10 ? "0"+HighScore : HighScore;

const initialCanvas = () =>{
    canvas.fillStyle = '#a3b18a'
    canvas.fillRect(0,0,WIDTH,HEIGHT)
    canvas.fillStyle = '#132a13';
    canvas.font = 'bold 20px monospace'
    canvas.textAlign ='center'
    canvas.fillText("Click the start button",WIDTH/2,HEIGHT/2-10)
    canvas.fillText("or Press any KEY to play",WIDTH/2,HEIGHT/2+10)
}

const UNIT = 20;

let snake = [
    {x:4*UNIT,y:UNIT},
    {x:3*UNIT,y:UNIT},
    {x:2*UNIT,y:UNIT},
    {x:UNIT,y:UNIT},
]

let food = {x:0,y:0}

let notStarted = true;
let move = false;

scoreSpan.innerHTML = "00"
let gameOver = false;

let xVel = UNIT;
let yVel = 0;

let gameInterval = 0;
let level = 1;
let score = 0;

const difficulty = {
    1:250,
    2:150,
    3:80
}

const generateFood = () =>{
    food = {x:Math.floor((Math.random()*WIDTH/UNIT))*UNIT,y:Math.floor((Math.random()*HEIGHT/UNIT))*UNIT}
}

const drawFood = () =>{
    canvas.fillStyle = '#8d0801'
    canvas.fillRect(food.x,food.y,UNIT,UNIT)
    canvas.strokeStyle = '#a3b18a'
    canvas.strokeRect(food.x,food.y,UNIT,UNIT)
}

const snakeEatsFood = () =>{
    if(snake[0].x-food.x==0 && snake[0].y-food.y==0){
        const tail = {x:snake[snake.length-1].x-xVel,y:snake[snake.length-1]-yVel}
        snake.push(tail)
        score++;
        scoreSpan.innerHTML = score<10 ? "0"+score : score;
        generateFood()
    }
    return food
}

const drawSnake = () =>{
    snake.forEach((segment) => {
        canvas.fillStyle = '#344e41';
        canvas.fillRect(segment.x,segment.y,UNIT,UNIT);
        canvas.strokeStyle = '#a3b18a';
        canvas.strokeRect(segment.x,segment.y,UNIT,UNIT)
    })
}

const moveSnake = () =>{
    const x = snake[0].x+xVel
    const y = snake[0].y+yVel
    if(isGameOver(x,y)){
        gameOver = true
    }
    else{
        const head = {x:x,y:y}
        snake.unshift(head)
        snake.pop()
    }
}
const isGameOver = (x,y) =>{
    if(x >= WIDTH || x < 0 || y >= HEIGHT || y < 0){
        return true
    }
    for(let i=1;i<snake.length;i++){
        if(snake[i].x-snake[0].x==0 && snake[i].y-snake[0].y==0){
            return true
        }
    }
}

document.addEventListener('keydown',(event) =>{
    if(event.key=="ArrowLeft" && xVel==0 && move){
        move = false;
        xVel=-UNIT;
        yVel=0;
    }
    else if(event.key=="ArrowRight" && xVel==0 && move){
        move=false;
        xVel=UNIT;
        yVel=0;
    }
    else if(event.key=="ArrowUp" && yVel==0 && move){
        move=false;
        xVel=0;
        yVel=-UNIT;
    }
    else if(event.key=="ArrowDown" && yVel==0 && move){
        move=false;
        xVel=0;
        yVel=UNIT;
    }
})

const resetGameParameters = () =>{
    gameOver=false;
    xVel = UNIT;
    yVel = 0;
    score = 0;
    notStarted=true;
    clearInterval(gameInterval);

    snake = [
        {x:4*UNIT,y:UNIT},
        {x:3*UNIT,y:UNIT},
        {x:2*UNIT,y:UNIT},
        {x:UNIT,y:UNIT},
    ]
    
    food = {x:0,y:0}
}

const endGame = (message) =>{
    canvas.fillStyle = '#a3b18a';
    canvas.fillRect(0,0,WIDTH,HEIGHT);
    drawFood();
    drawSnake();
    canvas.fillStyle = '#132a13';
    canvas.font = 'bold 36px monospace'
    canvas.textAlign ='center'
    canvas.fillText(`${message}`,WIDTH/2,HEIGHT/2) 
    HighScoreSpan.innerHTML = HighScore<10 ? "0"+HighScore : HighScore;
    resetGameParameters()
}

const game = () =>{
    const run = () =>{
        if(gameOver){
            if(score>HighScore){
                HighScore = score;
                localStorage.setItem('HighScore',HighScore);
            }
            endGame("Game Over")
            return
        }
        if(score>=25 && score<50){
            clearInterval(gameInterval)
            level = 2
            gameInterval = setInterval(run,difficulty[level])
        }
        else if(score>=50){
            clearInterval(gameInterval)
            level = 3
            gameInterval = setInterval(run,difficulty[level])
        }
        canvas.fillStyle = '#a3b18a';
        canvas.fillRect(0,0,WIDTH,HEIGHT);
        drawFood();
        drawSnake();
        snakeEatsFood()
        move=true;
        moveSnake();
    }

    scoreSpan.innerHTML = score<10 ? "0"+score : score;
    generateFood()
    gameInterval = setInterval(run,difficulty[level])

}

start.addEventListener('click',()=>{
    if(notStarted){
        notStarted=false;
        game()
    }
})

document.addEventListener('keydown',()=>{
    if(notStarted){
        notStarted=false;
        game()
    }
})

reset.addEventListener('click',()=>{
    HighScore=0;
    localStorage.setItem('HighScore',0);
    endGame("Game Reset")
})

initialCanvas()
