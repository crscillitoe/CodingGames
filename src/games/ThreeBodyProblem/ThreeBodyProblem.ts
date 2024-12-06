import { InteractableGameBase } from "../InteractableGameBase";
import { Ball } from "../objects/Ball";
import { Rectangle } from "../objects/Rectangle";
import { State } from "../types/GameState";
import { MethodDocumentation } from "../types/MethodDocumentation";

export class ThreeBodyProblem extends InteractableGameBase {

    backgroundColor: string = "#303030";
    private playerBalls!: Ball[];
    private goals!: Rectangle[];

    override gameTick(): void {
        this.animateBalls();
        this.draw();
    }
    override updateState(): void {
        // Check distances between all the balls, if any distance is under 100 you lose
        for (let i = 0; i < this.playerBalls.length; i++) {
            for (let j = i + 1; j < this.playerBalls.length; j++) {
                const dx = this.playerBalls[i].x - this.playerBalls[j].x;
                const dy = this.playerBalls[i].y - this.playerBalls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.gameState.emit({
                        state: State.Lost,
                        message: "Balls are too close together"
                    });
                }
            }
        }
    }
    override exposedMethods(): MethodDocumentation[] {
        return [
            {
                methodName: "getBalls(): Ball[]",
                methodDescription: ""
            },
            {
                methodName: "setBallVelocity(ballIndex: number, vx: number, vy: number): void",
                methodDescription: ""
            }
        ]
    }

    override setupGame(): void {
        const ballY = 550;
        const goalY = 50;
        const ballRadius = 10;
        const goalSize = 50;

        this.playerBalls = [
            new Ball(200, ballY + ballRadius, 0, 0, ballRadius, '#42f56c'),
            new Ball(400, ballY + ballRadius, 0, 0, ballRadius, 'gold'),
            new Ball(600, ballY + ballRadius, 0, 0, ballRadius, 'red')
        ];

        this.goals = [
            new Rectangle(200 - goalSize / 2, goalY - goalSize / 2, 0, 0, goalSize, goalSize, 'gold'),
            new Rectangle(400 - goalSize / 2, goalY - goalSize / 2, 0, 0, goalSize, goalSize, '#42f56c'),
            new Rectangle(600 - goalSize / 2, goalY - goalSize / 2, 0, 0, goalSize, goalSize, 'red')
        ];
    }
    override draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawBalls();
        this.drawGoals();
    }
    override gameDescription(): string[] {
        return [
            "Get the balls to their respective goals!",
        ]
    }

    private drawBackground() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private animateBalls() {
        for (let ball of this.playerBalls) {
            ball.animate();
            this.checkCanvasEdges(ball);
        }
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

    private drawBalls() {
        for (let ball of this.playerBalls) {
            ball.draw(this.context);
        }
    }

    private drawGoals() {
        for (let goal of this.goals) {
            goal.drawRectangle(this.context);
        }
    }

    public getBalls(): Ball[] {
        return this.playerBalls;
    }

    public setBallVelocity(ballIndex: number, vx: number, vy: number): void {
        if (ballIndex < 0 || ballIndex >= this.playerBalls.length) {
            this.gameState.emit({
                state: State.Lost,
                message: "Invalid ball index"
            });
        }

        this.playerBalls[ballIndex].vx = vx;
        this.playerBalls[ballIndex].vy = vy;
    }
}