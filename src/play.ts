import auto_move from "./automove";

class Agent {
    constructor(public color: string) {}
}

const agents = [new Agent("1"), new Agent("A")];

let send_buffer = "";
let round = 0;

function play({ send, buffer, silent }: { send: (data: string) => void; buffer: string; silent: boolean }) {
    const { board, player, exchange } = parse(buffer);
    try {
        if (!player && !exchange && !send_buffer) {
            return;
        }

        if (exchange) {
            [agents[0], agents[1]] = [agents[1], agents[0]];
        }

        if (board.length === 4) {
            if (!silent) console.log("Round", round++);
            const agent = agents[player - 1];

            const moves = auto_move(agent.color, board);

            setTimeout(() => send(`${moves[0]}, ${moves[1]}\n`), 0);
            send_buffer = `${moves[2]}, ${moves[3]}\n`;
        } else {
            const move = send_buffer;
            send_buffer = "";
            setTimeout(() => send(move), 0);
        }
    } catch (err: any) {
        console.log(err.message as string);
        console.log(board, player, exchange);
        process.exit(0);
    }
}

function parse(data: string) {
    // if (data.length > 30) {
    //     console.log(data);
    // }
    const board = [
        ...data.matchAll(
            /\d ?\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])/g,
        ),
    ].map((line) => line.slice(1));

    const player = parseInt(data.toLowerCase().match(/player ?(\d)/)?.[1] as string);

    const exchange = data.match(/\*/g)?.length === 31 && data.match(/[A-G]/g)?.length === 1;

    return { player, board, exchange };
}

export default play;
