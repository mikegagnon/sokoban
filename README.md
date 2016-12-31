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

- Part 1. Introduction & Setup
    - [Lecture 1. Modular design](#lec1)
    - [Lecture 2. The `Snapshot` class](#lec2)

# Part 1. Introduction & Setup

## <a name="lec1">Lecture 1. Modular design</a>

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
    
    // Moves the player in the specified direction.
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

    // The board argument is a 2-dimensional matrix describing board state.
    // Each item in the matrix is a pieceId. Namely, either EMPTY, BLOCK,
    // SLIDER, PLAYER, GOAL, GOAL_SLIDER, GOAL_PLAYER.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(board, gameOver) {
        this.board = board;
        this.gameOver = gameOver;
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

#### And more...

...

## <a name="lec2">Lecture 2. The `Snapshot` class</a>

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

    // The board argument is a 2-dimensional matrix describing board state.
    // Each item in the matrix is a pieceId. Namely, either EMPTY, BLOCK,
    // SLIDER, PLAYER, GOAL, GOAL_SLIDER, GOAL_PLAYER.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(board, gameOver) {
        this.board = board;
        this.gameOver = gameOver;
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

var boardInit =  [
   [1, 1, 1],
   [1, 0, 1],
   [0, 0, 0]
];

var gameOver = false;

var snapshot = new Snapshot(boardInit, gameOver);

VIZ = new Viz("#board", snapshot);
```

### Example 2

<img src="snapshot-02.png">

```js
// Recall:
//    SLIDER == 2
//    PLAYER == 3

var boardInit =  [
    [1, 1, 1],
    [2, 2, 2],
    [0, 3, 0]
];

var gameOver = false;

var snapshot = new Snapshot(boardInit, gameOver);

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

var boardInit =  [
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

var snapshot = new Snapshot(boardInit, gameOver);

VIZ = new Viz("#board", snapshot);
```

# Part 1. `Sokoban` class

Since `Sokoban` and `Viz` are independent modules, we can implement them in any order.
Skip to Part 2 if you feel like it.

# Part 2. `Viz` class

# Part 3. Putting it all together
