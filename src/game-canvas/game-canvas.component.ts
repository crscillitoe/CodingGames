import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InteractableGameBase } from '../games/InteractableGameBase';
import { MazeGame } from '../games/MazeGame/MazeGame';
import { CodeService } from '../app/services/code.service';
import { CommonModule } from '@angular/common';
import { GameState, State } from '../games/types/GameState';
import { ThreeBodyProblem } from '../games/ThreeBodyProblem/ThreeBodyProblem';
import { CatchMeIfYouCan } from '../games/CatchMeIfYouCan/CatchMeIfYouCan';

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

    this.game = new CatchMeIfYouCan(this.canvas);

    this.codeService.setGame(this.game);

    this.game.gameState.subscribe((gameState: GameState) => {
      if (gameState.state === State.Won) {
        alert('You won!');
        this.game.resetGame();
      } else if (gameState.state === State.Lost) {
        alert(gameState.message);
        this.game.resetGame();
      }
    });

    this.game.resetGame();
    this.game.clearCommand();
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