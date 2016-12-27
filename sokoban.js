var numRows = 8;
var numCols = 8;

function getCellId(row, col) {
    return "cell-" + row + "-" + col;
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
}