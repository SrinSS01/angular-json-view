import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  inject,
} from '@angular/core';
import { JsonValue, JsonTheme } from './types';
import { applyTheme } from './utils';
import { JsonNodeComponent } from './json-node.component';
import { JsonViewConfigService } from './json-view-config.service';

@Component({
  selector: 'ng-json-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [JsonNodeComponent],
  providers: [JsonViewConfigService],
  host: { class: 'ng-json-view' },
  template: `
    <div class="njv-root">
      @if (name !== false) {
        <njv-node
          [value]="src"
          [nodeKey]="name || 'root'"
          [path]="[]"
          [depth]="0"
        />
      } @else {
        <njv-node
          [value]="src"
          [nodeKey]="null"
          [path]="[]"
          [depth]="0"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      --njv-background: #1e1e1e;
      --njv-font-family: 'Courier New', Courier, monospace;
      --njv-font-size: 14px;
      --njv-key-color: #9cdcfe;
      --njv-string-color: #ce9178;
      --njv-number-color: #b5cea8;
      --njv-boolean-color: #569cd6;
      --njv-null-color: #808080;
      --njv-punctuation-color: #d4d4d4;
      --njv-toggle-color: #d4d4d4;
      --njv-meta-color: #808080;
      --njv-indent-color: #404040;

      display: block;
      background: var(--njv-background);
      font-family: var(--njv-font-family);
      font-size: var(--njv-font-size);
      color: var(--njv-punctuation-color);
      padding: 12px 16px;
      border-radius: 4px;
      overflow: auto;
    }

    .njv-root {
      display: block;
    }

    :host ::ng-deep {
      .njv-node {
        display: inline;
        position: relative;
      }

      .njv-child-row {
        display: block;
      }

      .njv-key {
        color: var(--njv-key-color);
      }

      .njv-punctuation {
        color: var(--njv-punctuation-color);
      }

      .njv-bracket {
        color: var(--njv-punctuation-color);
      }

      .njv-value {
        &.njv-string { color: var(--njv-string-color); }
        &.njv-number { color: var(--njv-number-color); }
        &.njv-boolean { color: var(--njv-boolean-color); }
        &.njv-null { color: var(--njv-null-color); }
      }

      .njv-meta {
        color: var(--njv-meta-color);
        cursor: pointer;
        font-style: italic;
        margin: 0 4px;
        user-select: none;
      }

      .njv-toggle {
        background: none;
        border: none;
        color: var(--njv-toggle-color);
        cursor: pointer;
        font-size: 0.7em;
        padding: 0 4px 0 0;
        vertical-align: middle;
        line-height: 1;
      }

      .njv-copy {
        background: none;
        border: none;
        color: var(--njv-meta-color);
        cursor: pointer;
        font-size: 0.9em;
        padding: 0 0 0 4px;
        opacity: 0;
        transition: opacity 0.15s;
        vertical-align: middle;
      }

      .njv-node:hover > .njv-copy,
      .njv-child-row:hover > njv-node > .njv-copy {
        opacity: 1;
      }

      .njv-children {
        border-left: 1px solid var(--njv-indent-color);
      }
    }
  `],
})
export class NgJsonViewComponent {
  @Input({ required: true }) src!: JsonValue;
  @Input() name: string | false = 'root';

  @Input()
  set collapsed(v: boolean | number) {
    this._config.collapsed.set(v);
  }

  @Input()
  set sortKeys(v: boolean) {
    this._config.sortKeys.set(v);
  }

  @Input()
  set indentWidth(v: number) {
    this._config.indentWidth.set(v);
  }

  @Input()
  set enableClipboard(v: boolean) {
    this._config.enableClipboard.set(v);
  }

  @Input()
  set theme(v: JsonTheme | null) {
    applyTheme(v, this._el.nativeElement);
  }

  private readonly _config = inject(JsonViewConfigService);
  private readonly _el = inject(ElementRef<HTMLElement>);
}
