// Copyright (c) JacobLinCool
#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#include <stddef.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>

typedef enum COLOR {
    RED,
    BLACK,
    NONE
} COLOR;

typedef enum TYPE {
    GERERAL,
    ADVISOR,
    ELEPHANT,
    CHARIOT,
    HORSE,
    CANNON,
    SOLDIER,
    EMPTY
} TYPE;

typedef struct Chess {
    COLOR color;
    TYPE type;
    int8_t hidden;
} Chess;

typedef struct Player {
    char name[8];
    int32_t round;
    COLOR color;
} Player;

typedef struct Board {
    Chess grid[4][8];
    Player player[2];
    int8_t peace;
} Board;

Board create_board();

void print_board(Board* board);

void player_move(Board* board, int8_t player);

int8_t game_over(Board* board);

// Any application that can be written in JavaScript, will eventually be written in JavaScript.
