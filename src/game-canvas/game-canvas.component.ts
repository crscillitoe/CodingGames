import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InteractableGameBase } from '../games/InteractableGameBase';
import { MazeGame } from '../games/MazeGame/MazeGame';

@Component({
  selector: 'app-game-canvas',
  templateUrl: './game-canvas.component.html',
  styleUrls: ['./game-canvas.component.scss']
})
export class GameCanvasComponent implements OnInit, OnChanges {
  @Input() command: string = '';
  @Input() reset: boolean = false;
  private canvas!: HTMLCanvasElement;
  private game!: InteractableGameBase;

  ngOnInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.game = new MazeGame(this.canvas);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['command'] && changes['command'].currentValue !== '') {
      this.game.setCommand(changes['command'].currentValue);
      this.game.runGame();
    }
    if (changes['reset'] && changes['reset'].currentValue) {
      this.game.clearCommand();
      this.game.resetGame();
    }
  }
}