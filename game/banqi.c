// Copyright (c) JacobLinCool
#include "banqi.h"
#define DEBUG 0

static int8_t min(int8_t a, int8_t b) {
    return a < b ? a : b;
}

static void init_chess_set(Chess chess[32]) {
    for (size_t i = 0; i < 2; i++) {
        // GENERAL
        for (size_t j = 0; j < 1; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)GERERAL;
            chess[i * 16 + j].hidden = 1;
        }
        // ADVISOR
        for (size_t j = 1; j < 3; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)ADVISOR;
            chess[i * 16 + j].hidden = 1;
        }
        // ELEPHANT
        for (size_t j = 3; j < 5; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)ELEPHANT;
            chess[i * 16 + j].hidden = 1;
        }
        // CHARIOT
        for (size_t j = 5; j < 7; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)CHARIOT;
            chess[i * 16 + j].hidden = 1;
        }
        // HORSE
        for (size_t j = 7; j < 9; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)HORSE;
            chess[i * 16 + j].hidden = 1;
        }
        // CANNON
        for (size_t j = 9; j < 11; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)CANNON;
            chess[i * 16 + j].hidden = 1;
        }
        // SOLDIER
        for (size_t j = 11; j < 16; j++) {
            chess[i * 16 + j].color = i;
            chess[i * 16 + j].type = (TYPE)SOLDIER;
            chess[i * 16 + j].hidden = 1;
        }
    }

    return;
}

static void shuffle_chess_set(Chess chess[32]) {
    srand(time(NULL));

    for (size_t i = 0; i < 32; i++) {
        size_t j = rand() % 32;
        Chess tmp = chess[i];
        chess[i] = chess[j];
        chess[j] = tmp;
    }

    return;
}

static char get_chess_name(Chess chess) {
    if (chess.color == BLACK) {
        switch (chess.type) {
        case GERERAL:
            return '1';
        case ADVISOR:
            return '2';
        case ELEPHANT:
            return '3';
        case CHARIOT:
            return '4';
        case HORSE:
            return '5';
        case CANNON:
            return '6';
        case SOLDIER:
            return '7';
        default:
            return ' ';
        }
    }
    else {
        switch (chess.type) {
        case GERERAL:
            return 'A';
        case ADVISOR:
            return 'B';
        case ELEPHANT:
            return 'C';
        case CHARIOT:
            return 'D';
        case HORSE:
            return 'E';
        case CANNON:
            return 'F';
        case SOLDIER:
            return 'G';
        default:
            return ' ';
        }
    }
}

static int8_t is_eatable(Chess predator, Chess prey) {
    if (predator.color == prey.color) {
        return 0;
    }

    switch (predator.type) {
    case GERERAL:
        if (prey.type == SOLDIER) {
            return 0;
        }
        else {
            return 1;
        }

    case SOLDIER:
        if (prey.type == GERERAL || prey.type == SOLDIER || prey.type == EMPTY) {
            return 1;
        }
        else {
            return 0;
        }

    case CANNON:
        return 1;

    default:
        return predator.type <= prey.type;
    }
}

static int8_t is_movable(Board* board, int8_t x, int8_t y) {
    Chess this = board->grid[y][x];
    int8_t direction[4][2] = { { 0, 1 }, { 1, 0 }, { 0, -1 }, { -1, 0 } };

    if (y < 0 || y > 3 || x < 0 || x > 7) {
        return 0;
    }

    if (this.hidden) {
        return 0;
    }

    switch (this.type) {
    case CANNON:
        for (int8_t i = 0; i < 4; i++) {
            int8_t x_tmp = x + direction[i][0], y_tmp = y + direction[i][1];

            while (x_tmp >= 0 && x_tmp <= 7 && y_tmp >= 0 && y_tmp <= 3 && board->grid[y_tmp][x_tmp].color == NONE) {
                x_tmp += direction[i][0];
                y_tmp += direction[i][1];
            }

            x_tmp += direction[i][0];
            y_tmp += direction[i][1];

            while (x_tmp >= 0 && x_tmp <= 7 && y_tmp >= 0 && y_tmp <= 3) {
                if (board->grid[y_tmp][x_tmp].color != this.color && board->grid[y_tmp][x_tmp].hidden == 0 && board->grid[y_tmp][x_tmp].color != NONE) {
                    return 1;
                }
                x_tmp += direction[i][0];
                y_tmp += direction[i][1];
            }
        }

        for (int8_t i = 0; i < 4; i++) {
            int8_t x_tmp = x + direction[i][0], y_tmp = y + direction[i][1];

            if (x_tmp >= 0 && x_tmp <= 7 && y_tmp >= 0 && y_tmp <= 3 && board->grid[y_tmp][x_tmp].hidden == 0 && board->grid[y_tmp][x_tmp].color == NONE) {
                return 1;
            }
        }
        break;

    default:
        for (int8_t i = 0; i < 4; i++) {
            int8_t x_tmp = x + direction[i][0], y_tmp = y + direction[i][1];

            if (x_tmp >= 0 && x_tmp <= 7 && y_tmp >= 0 && y_tmp <= 3 && board->grid[y_tmp][x_tmp].hidden == 0 && is_eatable(this, board->grid[y_tmp][x_tmp])) {
                return 1;
            }
        }
    }

    return 0;
}

static int8_t has_mountain_between(Board* board, int8_t x1, int8_t y1, int8_t x2, int8_t y2) {
    int8_t count = 0;

    if (x1 == x2) {
        int8_t minor = y1 < y2 ? y1 : y2, major = y1 < y2 ? y2 : y1;

        for (int8_t i = minor + 1; i < major; i++) {
            if (board->grid[i][x1].type != EMPTY) {
                count++;
            }
        }
    }
    else if (y1 == y2) {
        int8_t minor = x1 < x2 ? x1 : x2, major = x1 < x2 ? x2 : x1;

        for (int8_t i = minor + 1; i < major; i++) {
            if (board->grid[y1][i].type != EMPTY) {
                count++;
            }
        }
    }

    return count == 1;
}

Board create_board() {
    Board board;

    Chess chess[32];
    init_chess_set(chess);
    shuffle_chess_set(chess);

    for (int8_t i = 0; i < 4; i++) {
        for (int8_t j = 0; j < 8; j++) {
            board.grid[i][j] = chess[i * 8 + j];
        }
    }

    board.peace = 0;

    return board;
}

void print_board(Board* board) {
    printf("  1 2 3 4 5 6 7 8  \n");
    printf(" +---------------+ \n");

    for (int8_t i = 0; i < 4; i++) {
        printf("%" PRId8 "|", i + 1);

        for (int8_t j = 0; j < 8; j++) {
            if (board->grid[i][j].hidden) {
                printf("%c|", '*');
            }
            else {
                printf("%c|", get_chess_name(board->grid[i][j]));
            }
        }

        printf("\n");
        if (i != 3) printf(" |---------------| \n");
    }

    printf(" +---------------+ \n");

    return;
}

void player_move(Board* board, int8_t player) {
    Player* my = &board->player[player];
    Player* your = &board->player[!player];

    while (1) {
        printf("%s (x,y): ", my->name);
        int8_t x, y;
        fflush(stdout);
        scanf("%" SCNd8 ",%" SCNd8, &x, &y);

        if (y < 1 || y > 4 || x < 1 || x > 8) {
            printf("Out of area!\n");
            continue;
        }

        Chess* selected = &board->grid[y - 1][x - 1];

        if (selected->hidden == 1) {
            selected->hidden = 0;

            if (my->color == NONE && your->color == NONE) {
                my->color = selected->color;
                your->color = !selected->color;

                if (DEBUG) {
                    printf("[DEBUG] Assigned Color %d To Player %s\n", my->color, my->name);
                    printf("[DEBUG] Assigned Color %d To Player %s\n", your->color, your->name);
                }
            }

            break;
        }
        else {
            if (my->color != selected->color) {
                printf("Not your chess!\n");
                continue;
            }

            if (!is_movable(board, x - 1, y - 1)) {
                printf("No place to move. PASS.\n");
                break;
            }

            int8_t to_x, to_y;
            while (1) {
                printf("To (x,y): ");
                fflush(stdout);
                scanf("%" SCNd8 ",%" SCNd8, &to_x, &to_y);

                if (to_y < 1 || to_y > 4 || to_x < 1 || to_x > 8) {
                    printf("Out of area!\n");
                    continue;
                }

                Chess* target = &board->grid[to_y - 1][to_x - 1];

                if (selected->type == CANNON && target->color == your->color) {
                    if (min(abs(to_x - x), abs(to_y - y)) != 0) {
                        printf("Invalid move!\n");
                        continue;
                    }

                    if (!has_mountain_between(board, x - 1, y - 1, to_x - 1, to_y - 1)) {
                        printf("Invalid move!\n");
                        continue;
                    }
                }
                else if (abs(to_x - x) + abs(to_y - y) > 1) {
                    printf("Can't move more than one step!\n");
                    continue;
                }

                if (target->hidden == 1) {
                    printf("Can't move to this place!\n");
                    continue;
                }

                if (target->color == my->color) {
                    printf("Can't eat your own chess!\n");
                    continue;
                }

                if (!is_eatable(*selected, *target)) {
                    printf("Can't eat greater chess!\n");
                    continue;
                }

                if (target->type != EMPTY) {
                    board->peace = -1;
                }

                target->type = selected->type;
                target->color = selected->color;

                break;
            }

            selected->type = EMPTY;
            selected->color = NONE;

            break;
        }
    }

    board->peace++;
}

int8_t game_over(Board* board) {
    int8_t red_alive = 0, black_alive = 0;

    for (int8_t i = 0; i < 4; i++) {
        for (int8_t j = 0; j < 8; j++) {
            if (board->grid[i][j].color == RED) {
                red_alive++;
            }
            else if (board->grid[i][j].color == BLACK) {
                black_alive++;
            }
        }
    }

    if (red_alive == 0) {
        printf("Black win!\n");
        return 1;
    }
    else if (black_alive == 0) {
        printf("Red win!\n");
        return 1;
    }
    else if (board->peace >= 50) {
        printf("Draw!\n");
        return 1;
    }
    else {
        return 0;
    }
}

// Any application that can be written in JavaScript, will eventually be written in JavaScript.
