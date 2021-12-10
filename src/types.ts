export enum Color {
    Black = 0,
    Red = 64,
    Unknown = -1,
}

export enum Level {
    General = 1,
    Advisor,
    Elephant,
    Chariot,
    Horse,
    Cannon,
    Soldier,
}

export interface Chess {
    color: Color;
    level: Level;
    hidden: boolean;
}
