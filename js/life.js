/**
 * An implementation of Conway's Game of Life.
 * Created by Jesse Vogel on Nov 7th, 2015.
 **/

//globals
var board;
var interval = null;

//objects
function Board(row, col){
    this.row = row;
    this.col = col;
    this.grid = [];
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

$(document).ready(function(){
    //buttons
    var toggleStart = $('#toggleStart');
    var step = $('#step');
    var reset = $('#reset');
    //sliders
    var density = $('#density');
    var speed = $('#speed');

    var densityVal = density.val();
    initBoard(densityVal);

    //Set up buttons
    toggleStart.click(function(){
        clearInterval(interval);
        var state = toggleStart.html();
        switch(state){
            case 'Start':
                var speedVal = speed.val();
                interval = setInterval(actionPerformed, speedVal);
                toggleStart.html("Stop");
                break;
            case 'Stop':
                clearInterval(interval);
                interval = null;
                toggleStart.html("Start");
                break;
        }
    });

    step.click(function(){
        clearInterval(interval);
        actionPerformed();
    });

    reset.click(function(){
        clearInterval(interval);
        var densityVal = density.val();
        initBoard(densityVal);
    });

    //Update displayed speed value as the user slides
    speed.on("input", function(){
        $("#speedReading").html(speed.val());
    });

    //change interval after each user releases slider
    speed.on("change", function(){
        //only change it if the user has already started the animation
        if(interval != null) {
            clearInterval(interval);
            interval = setInterval(actionPerformed, speed.val());
        }
    });

    //Update displayed density value as the user slides
    density.on("input", function(){
        var val = density.val();
        val = parseFloat(val).toFixed(2);
        $("#densityReading").html(val);
    });

    //change density after each adjustment
    density.on("change", function(){
        //only update density if the user hasn't started
        if(interval == null) {
            initBoard(density.val());
        }
    });
});

function initBoard(density){
    //TODO these values will be read from controls
    var x = 50;
    var y = 50;
    board = new Board(x, y);
    //initialize grid to random
    var grid = board.grid;
    for(var r = 1; r <= x; r++) {
        for (var c = 1; c <= y; c++) {
            var isAlive = false;
            var rand = Math.random();
            if (rand < density) {
                isAlive = true;
            }
            grid[r][c] = new Cell(r, c, 0, isAlive);
        }
    }
    repaint();
}

/**
 * called each time the next generation of cells needs to be painted
 */
function actionPerformed(){
    var newBoard = new Board(board.row, board.col);
    for(var r = 1; r <= board.row; r++) {
        for(var c = 1; c <= board.col; c++){
            var numNeighbors = getNumNeighbors(r, c);
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
    var canvas = $('#life')[0];
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 500);
    for(var r = 1; r <= board.row; r++) {
        for (var c = 1; c <= board.col; c++) {
            if (board.grid[r][c].isAlive) {
                ctx.fillStyle = "rgb(200,0,0)";
                ctx.fillRect((r-1) * (500 / board.row), (c-1) * (500 / board.col), (500 / board.row), (500 / board.col));
            }
            ctx.strokeRect((r-1) * (500 / board.row), (c-1) * (500 / board.col), (500 / board.row), (500 / board.col));
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
