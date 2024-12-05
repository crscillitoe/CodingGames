import { MethodDocumentation } from "../MethodDocumentation";
import { InteractableGameBase } from "../InteractableGameBase";

export class MazeGame extends InteractableGameBase {
    backgroundColor: string = "#303030";

    private numVelcoityChanges: number = 0;

    private greenBall: any;
    private goal: any;
    private obstacles!: any[];

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
        this.greenBall = { x: 50, y: 50, radius: 10, color: '#42f56c', vx: 1, vy: 0 };
        this.goal = { x: 350, y: 350, radius: 15, color: 'gold' };
        this.obstacles = [
            { x: 100, y: 200, width: 230, height: 10, color: '#f54278' },
            { x: 100, y: 200, width: 10, height: 250, color: '#f54278' },
            { x: 370, y: 200, width: 230, height: 10, color: '#f54278' },
            { x: 600, y: 200, width: 10, height: 250, color: '#f54278' },
            { x: 100, y: 450, width: 510, height: 10, color: '#f54278' },
        ];

        this.numVelcoityChanges = 0;
        this.backgroundColor = "#303030";
    }

    override gameDescription(): string[] {
        return [
            "Get the green ball to the gold goal!",
            "You can only set the ball's velocity once!",
            "The ball will bounce off the walls and obstacles.",
            "The code you write will run every frame!"
        ];
    }

    override gameTick(): void {
        this.updatePosition();
        this.checkCollisions();
        this.draw();
    }

    override hasWon(): boolean {
        const dx = this.goal.x - this.greenBall.x;
        const dy = this.goal.y - this.greenBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.greenBall.radius + this.goal.radius);
    }

    private checkCollisions() {
        // Check collision with goal
        const dx = this.goal.x - this.greenBall.x;
        const dy = this.goal.y - this.greenBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check collision with obstacles
        this.obstacles.forEach(obstacle => {
            if (this.greenBall.x + this.greenBall.radius > obstacle.x &&
                this.greenBall.x - this.greenBall.radius < obstacle.x + obstacle.width &&
                this.greenBall.y + this.greenBall.radius > obstacle.y &&
                this.greenBall.y - this.greenBall.radius < obstacle.y + obstacle.height) {
                console.log('collision with obstacle');
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
        this.greenBall.x += this.greenBall.vx;
        this.greenBall.y += this.greenBall.vy;
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
            console.log('Only one velocity change allowed');
            return false;
        }

        this.greenBall.vx = vx;
        this.greenBall.vy = vy;
        this.numVelcoityChanges++;
        return true;
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