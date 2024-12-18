import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle } from "@codemirror/language";
import { syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { CodeService } from '../app/services/code.service';
import { MethodDocumentation } from '../games/types/MethodDocumentation';
import { CommonModule } from '@angular/common';
import { vim } from "@replit/codemirror-vim"

@Component({
  selector: 'app-code-editor',
  imports: [FormsModule, CommonModule],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  private editor!: EditorView;
  private methodNames!: EditorView;
  public exposedMethods: MethodDocumentation[] = [];
  public showMethods: boolean = false;

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
    this.codeService.getGame().subscribe(game => {
      if (!game) return;

      this.exposedMethods.push(...[
        {
          methodName: "log(data: any, color?: string): void",
          methodDescription: ""
        }
      ]);

      this.exposedMethods.push(... game.exposedMethods());
      const newDoc = this.exposedMethods.map(method => method.methodName).join('\n');
      const newState = this.methodNames.state.update({
        changes: { from: 0, to: this.methodNames.state.doc.length, insert: newDoc }
      });
      this.methodNames.dispatch(newState);
    });

    let theme = EditorView.theme({
      ".cm-selectionBackground": { background: "#254954 !important" }
    }, { dark: true });
    const highlightStyle = HighlightStyle.define([
      { tag: tags.keyword, color: '#e586fc' },
      { tag: tags.variableName, color: '#6b9bfa' },
      { tag: tags.string, color: '#69ff87' },
      { tag: tags.integer, color: '#eba860' },
      { tag: tags.number, color: '#eba860' },
    ]);

    this.editor = new EditorView({
      extensions: [
        vim(),
        basicSetup,
        EditorView.lineWrapping,
        theme,
        syntaxHighlighting(highlightStyle),
        javascript(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            // this.codeService.resetCode();
          }
        })
      ],
      parent: document.querySelector('#user-input') as Element
    });

    this.methodNames = new EditorView({
      extensions: [
        EditorView.editable.of(false),
        basicSetup,
        theme,
        syntaxHighlighting(highlightStyle),
        javascript()
      ],
      doc: "",
      parent: document.querySelector('#method-displays') as Element,
    });
  }

  run() {
    const userInput = this.editor.state.doc.toString();
    this.codeService.resetCode();
    this.codeService.setCode(userInput);
  }

  pause() {
    this.codeService.togglePause();
  }

  toggleMethods() {
    this.showMethods = !this.showMethods;
  }
}