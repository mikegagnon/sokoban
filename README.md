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

## Lecture 1. Modular approach

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


Benefits of modular design:

- Design the modules and interfaces first, then parallelize development
- Manage complexity
- Code reuse
- Once an interface is created, you can safely forget its implementatio
- Supports refactoring

