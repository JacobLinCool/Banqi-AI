function auto_move(color: string, board: string[][]): number[] {
    const dirx = [-1, 0, 0, 1, 0];
    const diry = [0, 1, -1, 0, 0];

    const legal_x: number[] = Array.from({ length: 8 }),
        legal_y: number[] = Array.from({ length: 8 });
    let legal_cnt = 0;
    let eat_score = 0;
    let to_x = 0,
        to_y = 0;
    let rank_auto = 0;

    let max_score = -1,
        max_x = 0,
        max_y = 0;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 4; y++) {
            if (board[y][x] == "*") {
                if (10 > max_score) {
                    max_score = 10;
                    max_x = x;
                    max_y = y;
                }
            }
            if (
                0 <= Math.abs(<number>board[y][x].codePointAt(0) - <number>color.codePointAt(0)) &&
                Math.abs(<number>board[y][x].codePointAt(0) - <number>color.codePointAt(0)) <= 6
            ) {
                auto_traversal_move(x, y);
                if (legal_cnt + eat_score * 100 > max_score) {
                    max_score = legal_cnt + eat_score * 100;
                    max_x = x;
                    max_y = y;
                }
            }
        }
    }

    auto_traversal_move(max_x, max_y);

    rank_auto = 0;
    let max_rank = -1;
    for (let i = 0; i < legal_cnt; i++) {
        if (
            board[legal_y[i]][legal_x[i]] != " " &&
            board[legal_y[i]][legal_x[i]] != "*" &&
            auto_can_eat(board[max_y][max_x], board[legal_y[i]][legal_x[i]]) &&
            rank_auto > max_rank
        ) {
            to_x = legal_x[i];
            to_y = legal_y[i];
            max_rank = rank_auto;
        }
    }
    if (max_rank == -1) {
        let rand_move = legal_cnt > 0 ? Math.floor(Math.random() * 4) % legal_cnt : 0;
        to_x = legal_x[rand_move];
        to_y = legal_y[rand_move];
    }

    const moves = [max_x + 1, max_y + 1, to_x + 1, to_y + 1];
    // console.log("Moves", moves);
    return moves;

    function auto_traversal_move(x: number, y: number) {
        legal_cnt = 0;
        eat_score = 0;
        for (let i = 0; i < 4; i++) {
            if (y + diry[i] < 0 || y + diry[i] >= 4 || x + dirx[i] < 0 || x + dirx[i] >= 8) continue;
            if (auto_legal_move(x, y, x + dirx[i], y + diry[i])) {
                legal_x[legal_cnt] = x + dirx[i];
                legal_y[legal_cnt] = y + diry[i];
                legal_cnt++;
            }
        }

        if (board[y][x] == "6" || board[y][x] == "F") {
            for (let i = 0; i < 4; i++) {
                let has_fort = 0;
                let cannon_move = 1;
                while (
                    y + diry[i] * cannon_move >= 0 &&
                    y + diry[i] * cannon_move < 4 &&
                    x + dirx[i] * cannon_move >= 0 &&
                    x + dirx[i] * cannon_move < 8
                ) {
                    if (board[y + diry[i] * cannon_move][x + dirx[i] * cannon_move] != " ") {
                        if (has_fort) {
                            if (auto_legal_move(x, y, x + dirx[i] * cannon_move, y + diry[i] * cannon_move)) {
                                legal_x[legal_cnt] = x + dirx[i] * cannon_move;
                                legal_y[legal_cnt] = y + diry[i] * cannon_move;
                                legal_cnt++;
                                break;
                            } else {
                                break;
                            }
                        }
                        has_fort = 1;
                    }
                    cannon_move++;
                }
            }
        }
        return;
    }

    function auto_can_eat(a: string, b: string) {
        let rank_a: number, rank_b: number;
        if ("1" <= a && a <= "7") {
            rank_a = <number>a.codePointAt(0) - <number>"1".codePointAt(0) + 1;
            rank_b = <number>b.codePointAt(0) - <number>"A".codePointAt(0) + 1;
        } else {
            rank_b = <number>b.codePointAt(0) - <number>"1".codePointAt(0) + 1;
            rank_a = <number>a.codePointAt(0) - <number>"A".codePointAt(0) + 1;
        }
        rank_auto = 8 - rank_b;
        if (rank_a == 6) return 1;
        if (rank_a == 7 && rank_b == 1) return 1;
        if (rank_a == 1 && rank_b == 7) return 0;
        if (rank_a <= rank_b) return 1;
        return 0;
    }

    function auto_legal_move(x: number, y: number, tar_x: number, tar_y: number) {
        if (board[tar_y][tar_x] == " ") return 1;
        if (board[tar_y][tar_x] == "*") return 0;
        if (
            0 <= Math.abs(<number>board[tar_y][tar_x].codePointAt(0) - <number>board[y][x].codePointAt(0)) &&
            Math.abs(<number>board[tar_y][tar_x].codePointAt(0) - <number>board[y][x].codePointAt(0)) <= 6
        ) {
            return 0;
        }
        if (board[y][x] == "6" || board[y][x] == "F") {
            if (Math.abs(tar_x - x) + Math.abs(tar_y - y) < 2) {
                return 0;
            }
        }
        if (auto_can_eat(board[y][x], board[tar_y][tar_x])) {
            eat_score += rank_auto;
            return 1;
        }
        return 0;
    }
}

export default auto_move;
