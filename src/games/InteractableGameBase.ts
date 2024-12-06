import { EventEmitter } from "@angular/core";
import { MethodDocumentation } from "./types/MethodDocumentation";
import { GameState, State } from "./types/GameState";
import { CodeService } from "../app/services/code.service";

export abstract class InteractableGameBase {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    private paused: boolean = false;

    private gameTimeout: any;
    private gameCommand: string = "";

    private codeService!: CodeService;

    public gameState: EventEmitter<GameState> = new EventEmitter<GameState>();

    constructor(canvas: HTMLCanvasElement, codeService: CodeService) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d')!;

        this.codeService = codeService;

        this.codeService.getPause().subscribe(pause => {
            this.paused = !this.paused;
        });

        this.setupGame();
        this.draw();
    }

    /**
     * Called every frame while the game is executing.
     *
     * Must be implemented on a game by game basis.
     */
    abstract gameTick(): void;

    /**
     * Update the game state.
     */
    abstract updateState(): void;

    /**
     * Returns a list of method signatures that can be utilized by the player.
     */
    abstract exposedMethods(): MethodDocumentation[];

    /**
     * Set the game to its initial state.
     */
    abstract setupGame(): void;

    /**
     * Draws the game scene.
     */
    abstract draw(): void;

    /**
     * Rendered underneath the game canvas.
     */
    abstract gameDescription(): string[];

    public setCommand(command: string) {
        this.gameCommand = command;
    }

    public clearCommand() {
        this.gameCommand = "";
    }

    public log(message: any, color: string = 'white') {
        this.codeService.sendLog({
            log: JSON.stringify(message),
            color: color
        });
    }

    private clearLog() {
        this.codeService.sendLog("CLEAR_LOG");
    }

    private executeCommand(command: string): void {
        try {
            const func = new Function('context', `with (context) { ${command} }`);
            func(this);
        } catch (error) {
            console.error('Error executing command:', error);
        }
    }

    public runGame() {
        this.stopGame();
        this.gameTimeout = setInterval(() => {
            if (!this.paused) {
                this.clearLog();
                this.executeCommand(this.gameCommand);
                this.gameTick();
                this.updateState();
            }
        }, 1000 / 60); // 60 FPS
    }

    private stopGame() {
        if (this.gameTimeout) {
            clearInterval(this.gameTimeout);
            this.gameTimeout = null;
        }
    }

    public resetGame() {
        this.clearCommand();
        this.stopGame();
        this.setupGame();
        this.draw();
        this.runGame();
    }
}