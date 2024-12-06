import { Ball } from "./Ball";

export class Rectangle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public width: number;
    public height: number;
    public color: string;

    constructor(x: number, y: number, vx: number, vy: number, width: number, height: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    public drawRectangle(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    public isCollidingWith(rectangle: Rectangle): boolean {
        return this.x < rectangle.x + rectangle.width &&
            this.x + this.width > rectangle.x &&
            this.y < rectangle.y + rectangle.height &&
            this.y + this.height > rectangle.y;
    }

    public isCollidingWithBall(ball: Ball): boolean {
        return this.x < ball.x + ball.radius &&
            this.x + this.width > ball.x - ball.radius &&
            this.y < ball.y + ball.radius &&
            this.y + this.height > ball.y - ball.radius;
    }
}