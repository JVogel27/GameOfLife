// file: life.js
// created by Jesse on Nov 7th, 2015
// A simple implementation of Conway's Game of Life using the <canvas> tag


function Board(row, col){
    this.row = row;
    this.col = col;
    this.grid = new Array();
    //add layer of padding
    for(var r = 0; r < row+2; r++){
        this.grid.push([]);
        for(var c = 0; c < col+2; c ++){
            this.grid[r][c] = new Cell(r, c, 0, false);
        }
    }
}

function Cell(row, col, age, isAlive){
    this.row = row;
    this.col = col;
    this.age = age;
    this.isAlive = isAlive;
}

/**
 * initialize the board object and all it's fields
 * @param x - number of rows in the boards grid
 * @param y - number of cols in the boards grid
 */
function initBoard(){
    var startButton = document.getElementById("start");
    startButton.onclick = start;

    //Board Dimensions
    var x = 50;
    var y = 50;
    board = new Board(x, y);    //global
    //initialize grid to random
    var grid = board.grid;
    for(var r = 1; r <= x; r++) {
        for (var c = 1; c <= y; c++) {
            var isAlive = false;
            var rand = Math.random();
            if (rand < 0.2) {
                isAlive = true;
            }
            grid[r][c] = new Cell(r, c, 0, isAlive);
        }
    }
    repaint();
}

function start(){
    initBoard();
    setInterval(actionPerformed, 1000);
}

/**
 * called each time the next generation of cells needs to be painted
 */
function actionPerformed(){

    var newBoard = new Board(board.row, board.col);
    for(var r = 1; r <= board.row; r++) {
        for(var c = 1; c <= board.col; c++){
            //TODO Adding the new cells to the grid is the problem!!!
            var numNeighbors = getNumNeighbors(r, c);
            //console.log(" " + numNeighbors);
            if(board.grid[r][c].isAlive){
                if(numNeighbors < 2 || numNeighbors > 3){
                    newBoard.grid[r][c] = new Cell(r, c, 0, false);
                }
                else{
                    newBoard.grid[r][c] = new Cell(r, c, 0, true);
                }
            }
            else {
                if (numNeighbors == 3) {
                    newBoard.grid[r][c] = new Cell(r, c, 0, true);
                }
                else {
                    newBoard.grid[r][c] = new Cell(r, c, 0, false);
                }
            }
        }
    }
    board = newBoard;
    repaint();
}

/**
 * paints the board according to the state of each cell
 */
function repaint() {
    var canvas = document.getElementById('life');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 500);
    for(var r = 1; r <= board.row; r++) {
        for (var c = 1; c <= board.col; c++) {
            if (board.grid[r][c].isAlive) {
                ctx.fillStyle = "rgb(200,0,0)";
                ctx.fillRect((r-1) * (500 / board.row), (c-1) * (500 / board.col), (500 / board.row), (500 / board.col));
            }
            ctx.strokeRect((r-1) * (500 / board.row), (c-1) * (500 / board.col), (500 / board.row), (500 / board.col));
            //ctx.closePath();
        }
    }
}

/**
 * A simple function to check how many living neighbors a given cell has
 * @param row - the row at which the cell exists
 * @param col - the col at which the cell exists
 * @returns number - the number of living neighbors
 */
function getNumNeighbors(row, col) {
    var count = 0;
    if(board.grid[row-1][col].isAlive){
        count = count + 1;
    }
    if(board.grid[row+1][col].isAlive){
        count = count + 1;
    }
    if(board.grid[row][col-1].isAlive){
        count = count + 1;
    }
    if(board.grid[row][col+1].isAlive){
        count = count + 1;
    }
    if(board.grid[row-1][col-1].isAlive){
        count = count + 1;
    }
    if(board.grid[row-1][col+1].isAlive){
        count = count + 1;
    }
    if(board.grid[row+1][col+1].isAlive){
        count = count + 1;
    }
    if(board.grid[row+1][col-1].isAlive){
        count = count + 1;
    }
    return count;

}

//radians = (Math.PI/180)*degrees

