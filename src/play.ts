import auto_move from "./automove";

class Agent {
    constructor(public color: string) {}
}

const agents = [new Agent("1"), new Agent("A")];

function play({ send, buffer }: { send: (data: string) => void; buffer: string }) {
    const { board, player } = parse(buffer);

    const agent = agents[player - 1];
    const moves = auto_move(agent.color, board);

    send(`${moves[0]}, ${moves[1]}\n`);
    send(`${moves[2]}, ${moves[3]}\n`);
}

function parse(data: string) {
    const board = [
        ...data.matchAll(/\d ?\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])\|([* A-G1-7])/g),
    ].map((line) => line.slice(1));

    const player = parseInt(data.toLowerCase().match(/player ?(\d)/)?.[1] as string);

    return { player, board };
}

export default play;
