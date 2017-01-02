# Sokoban+

A JavaScript project walk-through for novice programmers.

In this project you will make a game called Sokoban+. [Check it out](https://mikegagnon.github.io/sokoban/).

## Prerequisites

Mastery of [Lights Out](https://github.com/mikegagnon/lights-out/blob/master/README.md),
[Thumb Wrestling](https://github.com/mikegagnon/thumb-wrestling/blob/master/README.md), and
recursion (see [linked lists](https://github.com/mikegagnon/linked-lists/blob/master/README.md) and
[binary search trees](https://github.com/mikegagnon/bst/blob/master/README.md)).
And familiarity with OOP (object-orient programming) in JavaScript.

## Contents

- [Part 1. Introduction & Setup](#part1)
    - [Lecture 1.1 Modular design](#lec1-1)
    - [Lecture 1.2 The `Snapshot` class](#lec1-2)
- [Part 2. The `Sokoban` class](#part2)
    - [Challenge 2.1 A player among empty squares](#c2-1)
    - [Lecture 2.2 Isomorphisms](#lec2-2)
    - [Challenge 2.3 Refactor the `Sokoban` class with an isomorphism](#c2-3)
- [Part 3. The `Viz` class](#part3)
- [Part 4. Putting it all together](#part4)

# <a name="part1">Part 1. Introduction & Setup</a>

## <a name="lec1-1">Lecture 1.1 Modular design</a>

I regret to report that in Lights Out and Thumb wrestling, our code was a jumbled mess of spaghetti code.

In this project, we'll develop better code by using better design. Specifically, we'll be using modular
design which includes OOP.

In modular design we divide the program into different modules (classes in OOP).

### MVC

A classic example of modular design is MVC (model, view, controller). With regards to Sokoban+:

- The *model* module encapsulates all game logic for Sokoban+
- The *view* module visualizes the game state (by drawing it on the webpage)
- The *controller* module receives input from the player

### Implementing MVC

Implementing our MVC design into code, we have:

- The `Sokoban` class, which implements all game logic
- The `Viz` class, which draws the game state on the webpage
- The `keydown` function, which receives input from the player

### Interfaces for modules

For the game to work as a whole, the modules must connect with each other somehow.
We want these connections to be "thin interfaces."

An *interface* to a module is the opening into the module by which it receives
input and delivers output.

For example, the interface to the [`Queue` class](https://github.com/mikegagnon/dlists/blob/master/README.md#lec13)
is *thin*: there are only two methods.

- There is an `enqueue(...)` method which puts data into the queue, and
- There is a `dequeue(...)` method which retrieves data from the queue

An important principle of modular design is that thin interfaces hide complexity.
In this case, clients of the `Queue` class don't need to know anything about how the `Queue` class is implemented.
They don't need to know about `Node` objects, nor `prev` references, etc. They just need to know
`enqueue(...)` and `dequeue(...)`.

### Interfaces for Sokoban+

The `Sokoban` class has a thin interface: there are only two methods.

```js
class Sokoban {

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {...}
    
    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {...}
}
```

The `Viz` class has a thin interface: there are only two methods.

```js
class Viz {
    
    // The boardId argument specifies the HTML id for the <div> element that will
    // hold the game board
    //
    // The snapshot argument defines the initial gamestate
    constructor(boardId, snapshot) {...}
    
    // The snapshot argument defines the game state that is to be drawn on the web page
    drawGame(snapshot) {...}
}
```

The `keydown` function is therefore simple:

```js
// SOKOBAN is a reference to an instance of the Sokoban class
// VIZ is a reference to an instance of the Viz class
function keydown(event) {

    var direction = // the direction of the arrow key that was pressed

    var snapshot = SOKOBAN.move(direction);
    VIZ.drawGame(snapshot);
}
```

`snapshot` objects are defined by the `Snapshot` class:

```js
// pieceId values
var EMPTY = 0;
var BLOCK = 1;
var SLIDER = 2;
var PLAYER = 3;
var GOAL = 4;
var GOAL_SLIDER = 5;
var GOAL_PLAYER = 6;

/* Snapshot class *************************************************************/
class Snapshot {

    // The matrix argument is a 2-dimensional array describing board state.
    // Each item in the matrix is a pieceId. Namely, either EMPTY, BLOCK,
    // SLIDER, PLAYER, GOAL, GOAL_SLIDER, GOAL_PLAYER.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(matrix, gameOver) {
        this.matrix = matrix;
        this.gameOver = gameOver;
        this.numRows = matrix.length;
        this.numCols = matrix[0].length;
    }
}
```

Hopefully it is clear that the `Snapshot` class is the keystone that glues 
together the interfaces between all modules for Sokoban+.

### Benefits of modular design

#### Parallel development

If we had two developers building Sokoban+ at the same time,
one developer could build the `Sokoban` class, while at the same time the other 
developer could build the `Viz` class (independently). 

#### Manage complexity

If the vizualization code were interwoven with the game logic code (i.e. non modular design),
the code would be more complex, more difficult to read, reason about, test, etc.

#### Forgetting code

Once an interface is created, you can safely forget its implementation.

For example, you could implement `Sokoban` before implementing `Viz`. Then, you
could forget all the complexities of how `Sokoban` is implemented, and
code `Viz`, since `Viz` and `Sokoban` interact over a thin interface.

Forgetting code is nice, because it's impossible to remember
all the code in a large enough system.

#### Refactoring modules

Refactoring essentially means reimplementing. Imagine
a software system with 10 modules, connected via various thin interfaces.
You could easily refactor one module (say, to make it more efficient),
without touching any other module.

Without modular design, you would have a bunch of spaghetti code
and you would have to refactor the whole thing.

#### And more

...

### Art

Modular design is more of an art than a science. It takes lots of experience to be able to design good interfaces.

When I worked at Twitter, at the beginning of a project our team would get together and brainstorm.
Then the senior engineer on the team would declare what modules we would build and the interfaces 
between these modules. Then we'd adjourn the meeting, and all the junior engineers would 
implement the modules in parallel, over a period of about a month, and we'd stitch the modules
together as we finished each module.

## <a name="lec1-2">Lecture 1.2 The `Snapshot` class</a>

Recall from the Introduction, `snapshot` objects are defined by the `Snapshot` class:

```js
// pieceId values
var EMPTY = 0;
var BLOCK = 1;
var SLIDER = 2;
var PLAYER = 3;
var GOAL = 4;
var GOAL_SLIDER = 5;
var GOAL_PLAYER = 6;

/* Snapshot class *************************************************************/
class Snapshot {

    // The matrix argument is a 2-dimensional array describing board state.
    // Each item in the matrix is a pieceId. Namely, either EMPTY, BLOCK,
    // SLIDER, PLAYER, GOAL, GOAL_SLIDER, GOAL_PLAYER.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(matrix, gameOver) {
        this.matrix = matrix;
        this.gameOver = gameOver;
        this.numRows = matrix.length;
        this.numCols = matrix[0].length;
    }
}
```

To help understand the exact usage of this class, here are some examples.

### Example 1

<img src="snapshot-01.png">

```js
// Recall:
//    EMPTY == 0
//    BLOCK == 1

var matrix =  [
   [1, 1, 1],
   [1, 0, 1],
   [0, 0, 0]
];

var gameOver = false;

var snapshot = new Snapshot(matrix, gameOver);

VIZ = new Viz("#board", snapshot);
```

### Example 2

<img src="snapshot-02.png">

```js
// Recall:
//    SLIDER == 2
//    PLAYER == 3

var matrix =  [
    [1, 1, 1],
    [2, 2, 2],
    [0, 3, 0]
];

var gameOver = false;

var snapshot = new Snapshot(matrix, gameOver);

VIZ = new Viz("#board", snapshot);
```

### Example 3

<img src="snapshot-03.png" width="300px">

```js

// Recall:
//    EMPTY == 0
//    BLOCK == 1
//    SLIDER == 2
//    PLAYER == 3
//    GOAL == 4
//    GOAL_SLIDER == 5
//    GOAL_PLAYER == 6

var matrix =  [
    [5, 0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 0, 1, 0],
    [1, 4, 3, 2, 0, 0, 1, 0],
    [1, 1, 1, 0, 2, 4, 1, 0],
    [1, 4, 1, 1, 2, 0, 1, 0],
    [1, 0, 1, 0, 4, 0, 1, 1],
    [1, 2, 0, 0, 2, 2, 4, 1],
    [1, 0, 0, 0, 4, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

var gameOver = false;

var snapshot = new Snapshot(matrix, gameOver);

VIZ = new Viz("#board", snapshot);
```

### Tests for the `Snapshot` class

```js
function assert(condition) {
    if (!condition) {
        console.error("Test failed");
    }
}

/******************************************************************************/
/* Snapshot tests *************************************************************/
/******************************************************************************/

var matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
assert(snapshot.matrix == matrix);
assert(snapshot.gameOver == gameOver);
assert(snapshot.numRows == 3);
assert(snapshot.numCols == 3);

var matrix = [
    [0, 0, 0],
    [0, 0, 0],
];
var gameOver = true;
var snapshot = new Snapshot(matrix, gameOver);
assert(snapshot.matrix == matrix);
assert(snapshot.gameOver == gameOver);
assert(snapshot.numRows == 2);
assert(snapshot.numCols == 3);

var matrix = [
    [0, 0],
    [0, 0],
    [0, 0],
];
var gameOver = true;
var snapshot = new Snapshot(matrix, gameOver);
assert(snapshot.matrix == matrix);
assert(snapshot.gameOver == gameOver);
assert(snapshot.numRows == 3);
assert(snapshot.numCols == 2);

```

# <a name="part2">Part 2. The `Sokoban` class</a>

Since `Sokoban` and `Viz` are independent modules, we can implement them in any order.
Skip to [The `Viz` class](#part3) if you feel like it.

## Template for project

First:

- Put together an `index.html` file that imports `sokoban.js`.
- Add the `Snapshot` class and the *pieceId* values to `sokoban.js`.
- Add the shell for the `Sokoban` class.

### `sokoban.js`

```js
// pieceId values
var EMPTY = 0;
var BLOCK = 1;
var SLIDER = 2;
var PLAYER = 3;
var GOAL = 4;
var GOAL_SLIDER = 5;
var GOAL_PLAYER = 6;

/* Snapshot class *************************************************************/
class Snapshot {

    // The matrix argument is a 2-dimensional array describing board state.
    // Each item in the matrix is a pieceId. Namely, either EMPTY, BLOCK,
    // SLIDER, PLAYER, GOAL, GOAL_SLIDER, GOAL_PLAYER.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(matrix, gameOver) {
        this.matrix = matrix;
        this.gameOver = gameOver;
        this.numRows = matrix.length;
        this.numCols = matrix[0].length;
    }
}

/* Sokoban class **************************************************************/
class Sokoban {

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {
        // To be implemented...
    }

    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {
        // To be implemented...
    }
}

```


## <a name="c2-1">Challenge 2.1 A player among empty squares</a>

We will implement `move(...)`, but only for the case where:

- The player's movement stays in bounds
- The incoming `snapshot` contains only `EMPTY` cells and one `PLAYER` cell

### Write tests first

In divergence from previous projects, we will write our tests first, and our code second.

Before writing our tests we implement a helper function `snapshots_equal(...)`
that compares two snapshots and returns true iff the snapshots are identical. The helper function
`snapshots_equal(...)` depends on another helper method `matrices_equal(...)` that checks
two matrices for equality.

```js
// Returns true iff the two snapshots are identical
function snapshots_equal(snapshot1, snapshot2) {
    return matrices_equal(snapshot1.matrix, snapshot2.matrix) &&
        snapshot1.gameOver == snapshot2.gameOver &&
        snapshot1.numRows == snapshot2.numRows &&
        snapshot1.numCols == snapshot2.numCols;
}

// Returns true iff matrix1 and matrix2 have the same dimensions and values
function matrices_equal(matrix1, matrix2) {

    var numRows1 = matrix1.length;
    var numCols1 = matrix1[0].length;

    var numRows2 = matrix2.length;
    var numCols2 = matrix2[0].length;

    if (numRows1 != numRows2 || numCols1 != numCols2) {
        return false;
    }

    for (var row = 0; row < numRows1; row++) {
        for (var col = 0; col < numCols1; col++) {
            if (matrix1[row][col] != matrix2[row][col]) {
                return false;
            }
        }
    }

    return true;
}
```

Having implemented `snapshots_equal(...)`, we next write
four tests for the `Sokoban(...)` class: one for each direction (up, down, left, right).

```js

/* Test case: only in bounds. Only empty squares and player *******************/

// Init sokoban
var matrix = [
    [0, 0],
    [0, 3],
    [0, 0],
];

var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);


// Test move up
var snapshot_result = sokoban.move("up");
var matrix_expected = [
    [0, 3],
    [0, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// Test move left
var snapshot_result = sokoban.move("left");
var matrix_expected = [
    [3, 0],
    [0, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// Test move down
var snapshot_result = sokoban.move("down");
var matrix_expected = [
    [0, 0],
    [3, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// Test move right
var snapshot_result = sokoban.move("right");
var matrix_expected = [
    [0, 0],
    [0, 3],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));


```

### Challenge: implement `move(...)` such that the four tests pass

- [Hint 1](#hint2-1-1)
- [Hint 2](#hint2-1-2)
- [Hint 3](#hint2-1-3)
- [Hint 4](#hint2-1-4)
- [Hint 5](#hint2-1-5)
- [Hint 6](#hint2-1-6)
- [Solution](#solution2-1)

## <a name="lec2-2">Lecture 2.2 Isomorphisms</a>

First, an example:

### Example of an isomorphism

There are letters (the alphabet of letters is *L*),
and there are morse-code sounds (the alphabet of sounds is *M*).

Every letter *l* in *L* can be converted to a sound *m* in *M*.

And every sound *m* in *M* can be converted to a sound *l* in *L*.

The two-way mapping between *L* and *M* is an "isomorphism between *L* and *M*."

### Definition of "isomorphism"

In JavaScript, an isomorphism is a class that relates two datatypes, say *A* and *B*. Every isomorphism
class has two static functions: `toB(...)` and `toA(...)`.

```js
class IsoAB {

    // converts an instance of datatype A to an instance of datatype B
    static toB(a) {...}
    
    // converts an instance of datatype B to an instance of datatype A
    static toA(b) {...}
}
```

For every element `a` of `A`: `btoa(atob(a))` must equal `a`.

And:

For every element `b` of `B`: `atob(btoa(b))` must equal `b`.

### Example

```js
class IsoLetterMorse {

    static toMorse(letter) {
        if (letter == "a") {
            return ".-";
        } else if (letter == "b") {
            return "-...";
        } 
            ...
    }
    
    static toLetter(morse) {
        if (morse == ".-") {
            return "a";
        } else if (morse == "-...") {
            return "b";
        }
            ...
    }
}
```

## <a name="c2-3">Challenge 2.3 Refactor the `Sokoban` class with an isomorphism</a>

In this challenge we refactor the `Sokoban` class for two reasons:

1. The refactor will ultimately lead to code that is more readable
2. The refactor will demonstrate how we can refactor the internals of the `Sokoban` class,
   without changing the interface.

### Overview of our refactor

We will:

1. Implement a `Board` class that is isomorphic with the `Snapshot` class
2. Implement a `Cell` class that is isomorphic with `pieceId` values
3. Implement an `IsoSnapshotBoard` isomorphism
3. Implement an `IsoPieceidCell` isomorphism
4. Modify Sokoban so that is uses a `Board` object instead of a `Snapshot` object

### `Board` and `Cell` class definitions

The `Board` class is like the `Snapshot` class, except the `Board` class stores
the game state is a matrix of `Cell` objects, whereas the `Snapshot` class
stores the game state in a matrix of `pieceId` values.

```js
/* Board class ****************************************************************/
class Board {

    // The cells argument is a 2-dimensional matrix describing the board state.
    // Each item in cells is a cell object, which is to say an instance of the
    // Cell class.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(cells, gameOver) {
        this.cells = cells;
        this.gameOver = gameOver;
        this.numRows = cells.length;
        this.numCols = cells[0].length;
    }
}

/* Cell class *****************************************************************/
// Iff this.block == true, then that means there is a block in this cell
// And so on for this.slider, this.player, and this.goal
class Cell {
    constructor(block, slider, player, goal) {
        this.block = block;
        this.slider = slider;
        this.player = player;
        this.goal = goal;
    }
}
```

### Outline of `IsoSnapshotBoard` isomorphism

```js
/* IsoSnapshotBoard class *****************************************************/
class IsoSnapshotBoard {

    // Converts a Snapshot object to a Board objeect
    static toBoard(snapshot) { ... }

    // Converts a Board object to a Snapshot object
    static toSnapshot(board) { ... }
}
```

### Outline of `IsoPieceidCell` isomorphism

```js
/* IsoPieceidCell class *****************************************************/
class IsoPieceidCell {

    // Converts a pieceId value to a Cell objeect
    static toCell(pieceId) { ... }

    // Converts a Cell object to a pieceId value
    static toPieceId(cell) { ... }
}
```

### Modify Sokoban so that is uses a `Board` object instead of a `Snapshot` object

Make the following modifications:

```js
class Sokoban {

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {
        this.board = IsoSnapshotBoard.toBoard(snapshot); // <----------------------

        var [row, col] = this.findPlayer();
        this.playerRow = row;
        this.playerCol = col;
    }

    findPlayer() {

        for (var row = 0; row < this.board.numRows; row++) {       // <------------
            for (var col = 0; col < this.board.numCols; col++) {   // <------------
                var cell = this.board.cells[row][col];             // <------------
                if (cell.player) {                                 // <------------
                    return [row, col];
                }
            }
        }

        // If there is no player
        assert(false);
    }
    
    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {

        this.board.cells[this.playerRow][this.playerCol].player = false; // <------------

        if (direction == "up") {
            this.playerRow -= 1;
        } else if (direction == "down") {
            this.playerRow += 1;
        } else if (direction == "left") {
            this.playerCol -= 1;
        } else if (direction == "right") {
            this.playerCol += 1;
        } else {
            assert(false);
        }

        this.board.cells[this.playerRow][this.playerCol].player = true; // <------------

        return IsoSnapshotBoard.toSnapshot(this.board);                 // <------------
    } 
}
```
# <a name="part3">Part 3. The `Viz` class</a>

# <a name="part4">Part 4. Putting it all together</a>


# Hints

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint2-1-1">Hint 1 for Challenge 2.1</a>

Implement a method in the Sokoban class called `findPlayer()` that returns
the row and column of the player in a `snapshot`.

[Back to challenge](#c2-1)

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint2-1-2">Hint 2 for Challenge 2.1</a>

The `findPlayer()` function should iterate over every cell in the `snapshot` (using `for` loops)
until it finds the player.

[Back to challenge](#c2-1)


<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint2-1-3">Hint 3 for Challenge 2.1</a>

Here is a `static` implementation of `findPlayer()`:

```js
class Sokoban {
    
    ...

    static findPlayer(snapshot) {
        for (var row = 0; row < snapshot.numRows; row++) {
            for (var col = 0; col < snapshot.numCols; col++) {
                var pieceId = snapshot.matrix[row][col];
                if (pieceId == PLAYER) {
                    return [row, col];
                }
            }
        }

        // If there is no player
        assert(false);
    }
}
```

[Back to challenge](#c2-1)

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint2-1-4">Hint 4 for Challenge 2.1</a>

Implement the `Sokoban` `constructor` as so:

```js
class Sokoban {

    ...
    
    constructor(snapshot) {
        this.snapshot = snapshot;
        var [row, col] = Sokoban.findPlayer(snapshot);
        this.playerRow = row;
        this.playerCol = col;
    }
    
    ...
}
```

[Back to challenge](#c2-1)

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint2-1-5">Hint 5 for Challenge 2.1</a>

The `move(...)` function needs to perform the following operations:

1. On the board, set the old position of the player to EMPTY
2. Compute the new position of the player
3. On the board, set the new position of the player to PLAYER
4. Return the snapshot


[Back to challenge](#c2-1)

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="hint2-1-6">Hint 6 for Challenge 2.1</a>

Implement the `Sokoban` `move(...)` method as so:

```js
class Sokoban {

    ...

    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {

        this.snapshot.matrix[this.playerRow][this.playerCol] = EMPTY;

        if (direction == "up") {
            this.playerRow -= 1;
        } else if (direction == "down") {
            this.playerRow += 1;
        } else if (direction == "left") {
            this.playerCol -= 1;
        } else if (direction == "right") {
            this.playerCol += 1;
        } else {
            assert(false);
        }

        this.snapshot.matrix[this.playerRow][this.playerCol] = PLAYER;

        return this.snapshot;
    }
}
```


[Back to challenge](#c2-1)

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## <a name="solution2-1">Solution for Challenge 2.1</a>

```js
/* Sokoban class **************************************************************/
class Sokoban {

    /* Static functions *******************************************************/
    static findPlayer(snapshot) {
        for (var row = 0; row < snapshot.numRows; row++) {
            for (var col = 0; col < snapshot.numCols; col++) {
                var pieceId = snapshot.matrix[row][col];
                if (pieceId == PLAYER) {
                    return [row, col];
                }
            }
        }

        // If there is no player
        assert(false);
    }

    /* Instance methods *******************************************************/

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {
        this.snapshot = snapshot;
        var [row, col] = Sokoban.findPlayer(snapshot);
        this.playerRow = row;
        this.playerCol = col;
    }

    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {

        this.snapshot.matrix[this.playerRow][this.playerCol] = EMPTY;

        if (direction == "up") {
            this.playerRow -= 1;
        } else if (direction == "down") {
            this.playerRow += 1;
        } else if (direction == "left") {
            this.playerCol -= 1;
        } else if (direction == "right") {
            this.playerCol += 1;
        } else {
            assert(false);
        }

        this.snapshot.matrix[this.playerRow][this.playerCol] = PLAYER;

        return this.snapshot;
    }
}
```


[Back to challenge](#c2-1)
