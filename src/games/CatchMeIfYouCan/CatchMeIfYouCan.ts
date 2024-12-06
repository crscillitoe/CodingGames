import { InteractableGameBase } from "../InteractableGameBase";
import { Ball } from "../objects/Ball";
import { State } from "../types/GameState";
import { MethodDocumentation } from "../types/MethodDocumentation";

export class CatchMeIfYouCan extends InteractableGameBase {
    private fastBall!: Ball;
    private playerBall!: Ball;

    private lossTimeout: any;

    private numVelocitiesSet!: number;

    backgroundColor: string = "#303030";

    override gameTick(): void {
        this.animateBalls();
        this.draw();
    }

    override updateState(): void {
        if (this.fastBall.isCollidingWith(this.playerBall)) {
            clearInterval(this.lossTimeout);
            this.gameState.emit({
                state: State.Won,
            });
        }
    }

    override exposedMethods(): MethodDocumentation[] {
        return [
            {
                methodName: "setBallVelocity(vx: number, vy: number): void",
                methodDescription: ""
            },
            {
                methodName: "getTargetBall(): Ball",
                methodDescription: ""
            },
            {
                methodName: "getPlayerBall(): Ball",
                methodDescription: ""
            }
        ]
    }

    override setupGame(): void {
        clearInterval(this.lossTimeout);

        this.numVelocitiesSet = 0;
        this.playerBall = new Ball(this.canvas.width / 2, this.canvas.height / 2, 0, 0, 10, "green");

        const edge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;

        x = Math.round(Math.random() * this.canvas.width);
        vy = Math.round(Math.random() * 5 + 5);
        y = this.canvas.height / 2;

        while (Math.abs(x! - this.canvas.width / 2) < 150) {
            x = Math.round(Math.random() * this.canvas.width);
        }

        vx = 0;

        this.fastBall = new Ball(x!, y!, vx!, vy!, 10, "red");
    }

    override draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.fastBall.draw(this.context);
        this.playerBall.draw(this.context);
    }

    private drawBackground() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private animateBalls() {
        this.playerBall.animate();
        this.checkCanvasEdges(this.playerBall);

        this.fastBall.animate();
        this.checkCanvasEdges(this.fastBall);
    }

    private checkCanvasEdges(ball: Ball) {
        if (ball.x + ball.radius > this.canvas.width) {
            ball.x = this.canvas.width - ball.radius;
            ball.vx = -Math.abs(ball.vx); // Ensure it moves left
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx); // Ensure it moves right
        }

        if (ball.y + ball.radius > this.canvas.height) {
            ball.y = this.canvas.height - ball.radius;
            ball.vy = -Math.abs(ball.vy); // Ensure it moves up
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy = Math.abs(ball.vy); // Ensure it moves down
        }
    }

    override gameDescription(): string[] {
        return [
            "Hit the fast ball, good luck!"
        ]
    }

    public setBallVelocity(vx: number, vy: number) {
        if (this.numVelocitiesSet > 0) {
            this.gameState.emit({
                state: State.Lost,
                message: "You can only set the velocity of the player ball once"
            });

            return;
        }

        if (Math.abs(vx) > 2 || Math.abs(vy) > 2) {
            this.gameState.emit({
                state: State.Lost,
                message: "You cannot use a velocity greater than 2"
            });

            return;
        }

        this.lossTimeout = setInterval(() => {
            this.gameState.emit({
                state: State.Lost,
                message: "You must make contact within 5 seconds of setting a velocity."
            })
        }, 5000);

        this.playerBall.vx = vx;
        this.playerBall.vy = vy;

        this.numVelocitiesSet++;
    }

    public getTargetBall() {
        return this.fastBall;
    }

    public getPlayerBall(): Ball {
        return this.playerBall;
    }

}