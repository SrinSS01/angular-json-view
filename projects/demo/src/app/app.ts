import { Component } from '@angular/core';
import { NgJsonViewComponent, JsonTheme } from 'ng-json-view';

@Component({
  selector: 'app-root',
  imports: [NgJsonViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly sampleData = {
    name: 'Angular JSON View',
    version: 21,
    features: ['expandable', 'collapsible', 'themeable', 'copy-to-clipboard'],
    active: true,
    meta: null,
    nested: {
      level1: {
        level2: {
          value: 'deep nesting works!',
        },
      },
    },
    numbers: [1, 2, 3, 4, 5],
  };

  readonly lightTheme: JsonTheme = {
    background: '#ffffff',
    keyColor: '#0451a5',
    stringColor: '#a31515',
    numberColor: '#098658',
    booleanColor: '#0000ff',
    nullColor: '#808080',
    punctuationColor: '#333333',
    metaColor: '#999999',
    indentColor: '#dddddd',
    toggleColor: '#555555',
  };
}
