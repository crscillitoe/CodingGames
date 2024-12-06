import { Rectangle } from "./Rectangle";

export class Ball {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public radius: number;
    public color: string;

    constructor(x: number, y: number, vx: number, vy: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    }

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    public distanceTo(ball: Ball): number {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public isCollidingWith(ball: Ball): boolean {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + ball.radius;
    }

    public animate() {
        this.x += this.vx;
        this.y += this.vy;
    }

    public isCollidingWithRectangle(rectangle: Rectangle): boolean {
        return rectangle.isCollidingWithBall(this);
    }
}