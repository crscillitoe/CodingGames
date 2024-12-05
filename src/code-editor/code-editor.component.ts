import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from "@codemirror/lang-javascript";
import { HighlightStyle } from "@codemirror/language";
import { syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

@Component({
  selector: 'app-code-editor',
  imports: [FormsModule],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  @Output() command = new EventEmitter<string>();
  @Output() editing = new EventEmitter<void>();
  private editor!: EditorView;

  ngOnInit(): void {
    let theme = EditorView.theme({}, { dark: true });
    const highlightStyle = HighlightStyle.define([
      { tag: tags.keyword, color: '#e586fc' },
      { tag: tags.variableName, color: '#6b9bfa' },
      { tag: tags.string, color: '#69ff87' },
      { tag: tags.integer, color: '#eba860' },
      { tag: tags.number, color: '#eba860' },
    ]);

    this.editor = new EditorView({
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        theme,
        syntaxHighlighting(highlightStyle),
        javascript(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            this.editing.emit();
          }
        })
      ],
      parent: document.querySelector('#user-input') as Element
    });
  }

  run() {
    const userInput = this.editor.state.doc.toString();
    this.command.emit(userInput);
  }
}