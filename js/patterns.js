/**
 * Created by Jesse on 12/28/15.
 */

function loadPattern(pattern, x, y){
    switch(pattern){
        case "Line ":
            return line(x, y);
            break;
        /*case "Pulsar ":
            return pulsar(x, y);
            break;*/
        default:
            return new Board(x, y);
            break;
    }
}

function line(x, y){
    var b = new Board(x, y);
    for(var c = 1; c <= y; c++){
        b.grid[parseInt(x/2)+1][c] = new Cell(parseInt(x/2), c, 0, true);
    }
    return b;
}



