import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { JsonValue, JsonPath } from './types';
import {
  getNodeType,
  isExpandable,
  shouldBeCollapsed,
  safeStringify,
  getChildCount,
  copyToClipboard,
} from './utils';
import { JsonViewConfigService } from './json-view-config.service';

@Component({
  selector: 'njv-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  template: `
    <span class="njv-node">
      @if (nodeKey() !== null) {
        <span class="njv-key">{{ nodeKey() }}</span>
        <span class="njv-punctuation">: </span>
      }

      @if (isExpandableNode()) {
        <button
          class="njv-toggle"
          (click)="toggle()"
          [attr.aria-expanded]="!isCollapsed()"
          [attr.aria-label]="isCollapsed() ? 'Expand' : 'Collapse'"
        >{{ isCollapsed() ? '▶' : '▼' }}</button>

        @if (isCollapsed()) {
          <span class="njv-bracket">{{ openBracket() }}</span>
          <span class="njv-meta" (click)="toggle()">{{ childCount() }} {{ childLabel() }}</span>
          <span class="njv-bracket">{{ closeBracket() }}</span>
          @if (config.enableClipboard()) {
            <button class="njv-copy" (click)="copy()" title="Copy to clipboard">⎘</button>
          }
        } @else {
          <span class="njv-bracket">{{ openBracket() }}</span>
          <div class="njv-children" [style.padding-left.ch]="config.indentWidth()">
            @for (entry of childEntries(); track entry.key) {
              <div class="njv-child-row">
                <njv-node
                  [value]="entry.value"
                  [nodeKey]="entry.displayKey"
                  [path]="entry.path"
                  [depth]="depth() + 1"
                />
              </div>
            }
          </div>
          <span class="njv-bracket">{{ closeBracket() }}</span>
        }
      } @else {
        <span class="njv-value" [class]="'njv-' + nodeType()">{{ displayValue() }}</span>
        @if (config.enableClipboard()) {
          <button class="njv-copy" (click)="copy()" title="Copy to clipboard">⎘</button>
        }
      }
    </span>
  `,
})
export class JsonNodeComponent {
  readonly config = inject(JsonViewConfigService);

  readonly value = input.required<JsonValue>();
  readonly nodeKey = input<string | null>(null);
  readonly path = input<JsonPath>([]);
  readonly depth = input<number>(0);

  readonly nodeType = computed(() => getNodeType(this.value()));
  readonly isExpandableNode = computed(() => isExpandable(this.value()));
  readonly childCount = computed(() => getChildCount(this.value()));

  readonly openBracket = computed(() =>
    this.nodeType() === 'array' ? '[' : '{'
  );
  readonly closeBracket = computed(() =>
    this.nodeType() === 'array' ? ']' : '}'
  );
  readonly childLabel = computed(() =>
    this.childCount() === 1
      ? this.nodeType() === 'array'
        ? 'item'
        : 'key'
      : this.nodeType() === 'array'
        ? 'items'
        : 'keys'
  );

  private readonly _defaultCollapsed = computed(() =>
    shouldBeCollapsed(this.depth(), this.config.collapsed())
  );

  private readonly _userToggled = signal<boolean | null>(null);

  readonly isCollapsed = computed(() => {
    const userToggle = this._userToggled();
    if (userToggle !== null) return userToggle;
    return this._defaultCollapsed();
  });

  readonly childEntries = computed(() => {
    const val = this.value();
    if (val === null || typeof val !== 'object') return [];
    const currentPath = this.path();
    if (Array.isArray(val)) {
      return val.map((v, i) => ({
        key: String(i),
        displayKey: String(i),
        value: v,
        path: [...currentPath, i] as JsonPath,
      }));
    }
    let keys = Object.keys(val as Record<string, JsonValue>);
    if (this.config.sortKeys()) keys = keys.sort();
    return keys.map((k) => ({
      key: k,
      displayKey: `"${k}"`,
      value: (val as Record<string, JsonValue>)[k],
      path: [...currentPath, k] as JsonPath,
    }));
  });

  readonly displayValue = computed(() => {
    const v = this.value();
    const type = this.nodeType();
    if (type === 'string') return `"${v}"`;
    if (type === 'null') return 'null';
    return String(v);
  });

  toggle(): void {
    this._userToggled.set(!this.isCollapsed());
  }

  async copy(): Promise<void> {
    const text = this.isExpandableNode()
      ? safeStringify(this.value())
      : String(this.value() === null ? 'null' : this.value());
    try {
      await copyToClipboard(text);
    } catch {
      // silently fail
    }
  }
}
