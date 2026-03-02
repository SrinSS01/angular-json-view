import { Injectable, signal } from '@angular/core';

@Injectable()
export class JsonViewConfigService {
  readonly collapsed = signal<boolean | number>(false);
  readonly sortKeys = signal<boolean>(false);
  readonly indentWidth = signal<number>(4);
  readonly enableClipboard = signal<boolean>(true);
}
