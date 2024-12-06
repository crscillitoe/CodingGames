export enum State {
    Running,
    Won,
    Lost
}

/**
 * The game will expect a message to be displayed
 * when the game is lost.
 */
export type GameState = {
    state: State;
    message?: string;
}