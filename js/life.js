/**
 * An implementation of Conway's Game of Life.
 * Created by Jesse Vogel on Nov 7th, 2015.
 **/

//globals
//TODO these values will be read from controls
var x = 100;
var y = 100;
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

    var canvas = $("#life");

    canvas.click(function(e){
        e.preventDefault();
        e.stopPropagation();

        canvas = $("#life");
        var cs = getComputedStyle(canvas[0]);
        var width = parseInt(cs.getPropertyValue('width'), 10);
        var height = parseInt(cs.getPropertyValue('height'), 10);

        var mouseX = e.pageX-(canvas.offset().left);
        var mouseY = e.pageY-(canvas.offset().top);

        var r = parseInt(mouseX/(width/x));
        var c = parseInt(mouseY/(height/y));

        if(board.grid[r+1][c+1].isAlive){
            board.grid[r+1][c+1].isAlive = false;
        }
        else{
            board.grid[r+1][c+1].isAlive = true;
        }
        repaint();
    });

    //buttons
    var toggleStart = $('#toggleStart');
    var step = $('#step');
    var reset = $('#reset');
    var clear = $("#clear");
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
                toggleStart.html("Stop");
                toggleStart.removeClass("btn-success").addClass("btn-danger");
                density[0].disabled = true;
                var speedVal = speed.val();
                interval = setInterval(actionPerformed, speedVal);
                break;
            case 'Stop':
                toggleStart.html("Start");
                toggleStart.removeClass("btn-danger").addClass("btn-success");
                interval = null;
                clearInterval(interval);
                break;
        }
    });

    step.click(function(){
        toggleStart.html("Start");
        toggleStart.removeClass("btn-danger").addClass("btn-success");
        density[0].disabled = true;
        clearInterval(interval);
        actionPerformed();
    });

    reset.click(function(){
        toggleStart.html("Start");
        toggleStart.removeClass("btn-danger").addClass("btn-success");
        clearInterval(interval);
        interval = null;
        density[0].disabled = false;
        var densityVal = density.val();
        initBoard(densityVal);

    });

    clear.click(function(){
        clearInterval(interval);
        toggleStart.html("Start");
        toggleStart.removeClass("btn-danger").addClass("btn-success");
        interval = null;
        density[0].disabled = false;
        initBoard(0);
    });

    //Update displayed speed value as the user slides
    speed.on("input", function(){
        $("#speedReading").html(speed.val());
    });

    //change interval after each user releases slider
    speed.on("change", function(){
        //only change it if the user has already started the animation
        if(interval != null && toggleStart.html() == "Stop") {
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
        initBoard(density.val());
    });

    //Set the pattern to be loaded
    $("#selectPattern li").click(function(){
        var text = $(this).text();
        $("#selectedPattern").html(text + " " + '<span class="caret"></span>');
    });

    $("#loadPattern").click(function(){
        var pattern = $("#selectedPattern").text();
        //TODO load the pattern
    });

});

function initBoard(density){
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
                    newBoard.grid[r][c] = new Cell(r, c, board.grid[r][c].age+1, true);
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
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    for(var r = 1; r <= board.row; r++) {
        for (var c = 1; c <= board.col; c++) {
            if (board.grid[r][c].isAlive) {
                var age = board.grid[r][c].age
                var color = 255 - (age*25);
                ctx.fillStyle = "rgb(" + color + ",0,0)";
                ctx.fillRect((r-1) * (height / board.row), (c-1) * (width / board.col), (height / board.row), (width / board.col));
            }
            ctx.strokeRect((r-1) * (height / board.row), (c-1) * (width / board.col), (height / board.row), (width / board.col));
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
