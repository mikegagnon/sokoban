var numRows = 10;
var numCols = 10;

cellSize = 50;

BLOCK = 1;
SLIDER = 2;
PLAYER = 3;
GOAL = 4;

var matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 2, 2, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 4, 0, 0, 0, 2, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 2, 0],
];


function getCellId(row, col) {
    return "cell-" + row + "-" + col;
}

function drawGame() {
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
            var cellValue = matrix[row][col];
            var cellId = "#" + getCellId(row, col);

            var src = undefined;

            if (cellValue == BLOCK) {
                src = "block.png";
            } else if (cellValue == SLIDER) {
                src = "slider.png";
            } else if (cellValue == PLAYER) {
                src = "player.png"
            } else if (cellValue == GOAL) {
                src = "goal.png"
            }

            if (src == undefined) {
                $(cellId +" img").remove();
            } else {
                var imgTag = "<img src='" + src + "' width='" + cellSize + "'>";
                $(cellId).append(imgTag);
            }

        }
    }

}

function createSokoban(boardId) {

    for (var row = 0; row < numRows; row++) {
        var rowId = "row-" + row;
        var rowTag = "<div id='" + rowId + "' class='row'></div>"

        $(boardId).append(rowTag);

        for (var col = 0; col < numCols; col++) {
            var cellId = getCellId(row, col);
            var cellTag = "<div id='" + cellId + "' class='cell'></div>";
            $("#" + rowId).append(cellTag);
        }
    }

    drawGame();
}