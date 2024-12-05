import { EventEmitter, Injectable } from '@angular/core';
import { InteractableGameBase } from '../../games/InteractableGameBase';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private code: EventEmitter<string> = new EventEmitter<string>();
  private reset: EventEmitter<void> = new EventEmitter<void>();
  private game: EventEmitter<InteractableGameBase> = new EventEmitter<InteractableGameBase>();

  constructor() { }

  public setGame(game: InteractableGameBase) {
    this.game.emit(game);
  }

  public getGame(): EventEmitter<InteractableGameBase> {
    return this.game;
  }

  public setCode(code: string) {
    this.code.emit(code);
  }

  public getCode(): EventEmitter<string> {
    return this.code;
  }

  public resetCode() {
    this.reset.emit();
  }

  public getReset(): EventEmitter<void> {
    return this.reset;
  }
}
