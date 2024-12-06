import { MethodDocumentation } from "../types/MethodDocumentation";
import { InteractableGameBase } from "../InteractableGameBase";
import { State } from "../types/GameState";
import { Ball } from "../objects/Ball";
import { Rectangle } from "../objects/Rectangle";

export class MazeGame extends InteractableGameBase {
    backgroundColor: string = "#303030";

    private numVelcoityChanges: number = 0;

    private greenBall!: Ball;
    private goal!: Ball;
    private obstacles!: Rectangle[];

    override exposedMethods(): MethodDocumentation[] {
        return [
            {
                methodName: "setBallVelocity(vx: number, vy: number): bool",
                methodDescription: ""
            },
            {
                methodName: "getBallVelocity(): { vx: number, vy: number }",
                methodDescription: ""
            },
            {
                methodName: "getBallCoordinates(): { x: number, y: number }",
                methodDescription: ""
            },
            {
                methodName: "getGoalCoordinates(): { x: number, y: number }",
                methodDescription: ""
            }
        ];
    }

    override setupGame(): void {
        this.greenBall = new Ball(50, 50, 1, 0, 10, '#42f56c');
        this.goal = new Ball(350, 350, 0, 0, 15, 'gold');

        this.obstacles = [
            new Rectangle(100, 200, 0, 0, 230, 10, '#f54278'),
            new Rectangle(100, 200, 0, 0, 10, 250, '#f54278'),
            new Rectangle(370, 200, 0, 0, 230, 10, '#f54278'),
            new Rectangle(600, 200, 0, 0, 10, 250, '#f54278'),
            new Rectangle(100, 450, 0, 0, 510, 10, '#f54278'),
        ];

        this.numVelcoityChanges = 0;
        this.backgroundColor = "#303030";
    }

    override gameDescription(): string[] {
        return [
            "Get the green ball to the gold goal!",
            "The code you write will run every frame!"
        ];
    }

    override gameTick(): void {
        this.updatePosition();
        this.checkCollisions();
        this.draw();
    }

    override updateState(): void {
        if (this.greenBall.isCollidingWith(this.goal)) {
            this.gameState.emit({
                state: State.Won,
            });
        }

        this.gameState.emit({
            state: State.Running
        });
    }

    private checkCollisions() {
        // Check collision with goal
        if (this.greenBall.isCollidingWith(this.goal)) {
            console.log('collision with goal');
            this.greenBall.vx = 0;
            this.greenBall.vy = 0;
        }

        // Check collision with obstacles
        this.obstacles.forEach(obstacle => {
            if (this.greenBall.isCollidingWithRectangle(obstacle)) {
            const overlapX = Math.min(
                this.greenBall.x + this.greenBall.radius - obstacle.x,
                obstacle.x + obstacle.width - (this.greenBall.x - this.greenBall.radius)
            );
            const overlapY = Math.min(
                this.greenBall.y + this.greenBall.radius - obstacle.y,
                obstacle.y + obstacle.height - (this.greenBall.y - this.greenBall.radius)
            );

            if (overlapX < overlapY) {
                if (this.greenBall.vx > 0) {
                this.greenBall.x = obstacle.x - this.greenBall.radius;
                } else if (this.greenBall.vx < 0) {
                this.greenBall.x = obstacle.x + obstacle.width + this.greenBall.radius;
                }
                this.greenBall.vx = -this.greenBall.vx;
            } else {
                if (this.greenBall.vy > 0) {
                this.greenBall.y = obstacle.y - this.greenBall.radius;
                } else if (this.greenBall.vy < 0) {
                this.greenBall.y = obstacle.y + obstacle.height + this.greenBall.radius;
                }
                this.greenBall.vy = -this.greenBall.vy;
            }
            }
        });
    }

    private updatePosition() {
        this.greenBall.animate();
        this.checkCanvasEdges(this.greenBall);
    }

    private checkCanvasEdges(ball: { x: number; y: number; radius: number; vx: number; vy: number }) {
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

    override draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawGoal();
        this.drawObstacles();
        this.drawBall(this.greenBall);
    }

    private drawBackground() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawGrid() {
        const gridSize = 20;
        this.context.strokeStyle = '#fff';
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.canvas.height);
            this.context.stroke();
        }
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.canvas.width, y);
            this.context.stroke();
        }
    }

    private drawGoal() {
        this.context.beginPath();
        this.context.arc(this.goal.x, this.goal.y, this.goal.radius, 0, Math.PI * 2);
        this.context.fillStyle = this.goal.color;
        this.context.fill();
        this.context.closePath();
    }

    private drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.context.fillStyle = obstacle.color;
            this.context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    private drawBall(ball: { x: number; y: number; radius: number; color: string }) {
        this.context.beginPath();
        this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.context.fillStyle = ball.color;
        this.context.fill();
        this.context.closePath();
    }

    public setBallVelocity(vx: number, vy: number) {
        if (this.numVelcoityChanges > 0) {
            this.gameState.emit({
                state: State.Lost,
                message: 'Only one velocity change allowed'
            });

            return;
        }

        if (vx > 2 || vy > 2) {
            this.gameState.emit({
                state: State.Lost,
                message: 'Velocity must be less than 2'
            });

            return;
        }

        this.greenBall.vx = vx;
        this.greenBall.vy = vy;
        this.numVelcoityChanges++;
    }

    public getBallVelocity() {
        return { vx: this.greenBall.vx, vy: this.greenBall.vy };
    }

    public getBallCoordinates() {
        return { x: this.greenBall.x, y: this.greenBall.y };
    }

    public getGoalCoordinates() {
        return { x: this.goal.x, y: this.goal.y };
    }
}