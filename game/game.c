// Copyright (c) JacobLinCool
#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#include "banqi.h"

int main() {
    Board board = create_board();

    Player player_1 = { .name = "Player 1", .round = 0 };
    player_1.color = NONE;
    Player player_2 = { .name = "Player 2", .round = 0 };
    player_2.color = NONE;

    board.player[0] = player_1;
    board.player[1] = player_2;

    print_board(&board);

    int8_t current_player = 0;
    while (1) {
        player_move(&board, current_player);
        print_board(&board);

        if (game_over(&board)) {
            printf("Game over!\n");
            break;
        }

        current_player = !current_player;
    }

    return 0;
}

// Any application that can be written in JavaScript, will eventually be written in JavaScript.