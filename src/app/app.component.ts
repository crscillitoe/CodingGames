import { Component } from '@angular/core';
import { GameCanvasComponent } from '../game-canvas/game-canvas.component';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
  selector: 'app-root',
  imports: [GameCanvasComponent, CodeEditorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CodeGame';
  command: string = '';
  reset: boolean = false;

  onCommand(command: string) {
    this.command = ''; // Reset the command to trigger ngOnChanges
    setTimeout(() => {
      this.command = command;
      this.reset = false;
    }, 0);
  }

  onEditing() {
    this.reset = true;
  }
}