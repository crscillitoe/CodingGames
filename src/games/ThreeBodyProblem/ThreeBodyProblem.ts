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
        this.checkBallDistances();
        this.checkBallGoalCollisions();
        this.checkBallVelocities();
    }

    override exposedMethods(): MethodDocumentation[] {
        return [
            {
                methodName: "getBalls(): Ball[]",
                methodDescription: ""
            },
            {
                methodName: "getGoals(): Rectangle[]",
                methodDescription: ""
            },
            {
                methodName: "setBallVelocity(ballIndex: number, vx: number, vy: number): void",
                methodDescription: ""
            }
        ]
    }

    override setupGame(): void {
        this.randomizeBalls();

        for (let x = 0; x < 3; x++) {
            const ball = this.playerBalls[x];
            const goal = this.getRectangle(ball.color)!;

            if (Math.abs(ball.x - goal.x) <= 50)
            {
                this.setupGame();
                return;
            }
        }
    }

    private randomizeBalls() {
        const ballY = 550;
        const goalY = 50;
        const ballRadius = 10;
        const goalSize = 50;

        let ballColors = ['#42f56c', 'gold', 'red'];
        let goalColors = ['#42f56c', 'gold', 'red'];

        ballColors = ballColors.sort(() => Math.random() - 0.5);
        goalColors = goalColors.sort(() => Math.random() - 0.5);

        this.playerBalls = ballColors.map((color, index) => new Ball(
            200 + index * 200, ballY + ballRadius, 0, 0, ballRadius, color
        ));

        this.goals = goalColors.map((color, index) => new Rectangle(
            200 + index * 200 - goalSize / 2, goalY - goalSize / 2, 0, 0, goalSize, goalSize, color
        ));
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

    private checkBallVelocities() {
        const allHaveVelocity = this.playerBalls.every(ball => ball.vx !== 0 || ball.vy !== 0);
        const anyHaveVelocity = this.playerBalls.some(ball => ball.vx !== 0 || ball.vy !== 0);

        if (anyHaveVelocity && !allHaveVelocity) {
            this.gameState.emit({
                state: State.Lost,
                message: "All balls must have velocities if any ball has a velocity"
            });
        }

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

    private checkBallDistances() {
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

    private getRectangle(color: string) {
        for (let goal of this.goals) {
            if (goal.color === color) {
                return goal;
            }
        }
        
        return null;
    }

    private checkBallGoalCollisions() {
        for (let i = 0; i < this.playerBalls.length; i++) {
            if (!this.playerBalls[i].isCollidingWithRectangle(this.getRectangle(this.playerBalls[i].color)!)) {
                return;
            }
        }

        this.gameState.emit({
            state: State.Won,
            message: "All balls reached their goals"
        });
    }

    public getBalls(): Ball[] {
        return this.playerBalls;
    }

    public getGoals(): Rectangle[] {
        return this.goals;
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