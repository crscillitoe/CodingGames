import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InteractableGameBase } from '../games/InteractableGameBase';
import { MazeGame } from '../games/MazeGame/MazeGame';
import { CodeService } from '../app/services/code.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-canvas',
  imports: [CommonModule],
  templateUrl: './game-canvas.component.html',
  styleUrls: ['./game-canvas.component.scss']
})
export class GameCanvasComponent implements OnInit {
  private canvas!: HTMLCanvasElement;
  public game!: InteractableGameBase;

  constructor(private codeService: CodeService) { }

  ngOnInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    this.game = new MazeGame(this.canvas);

    this.codeService.setGame(this.game);

    this.game.gameCompleted.subscribe((hasWon: boolean) => {
      if (hasWon) {
        alert('You won!');
      }
    });

    this.game.resetGame();
    this.game.setCommand('');
    this.game.runGame();

    this.codeService.getCode().subscribe((code: string) => {
      this.game.setCommand(code);
      this.game.runGame();
    });

    this.codeService.getReset().subscribe(() => {
      this.game.clearCommand();
      this.game.resetGame();
    });
  }
}