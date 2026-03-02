import { JsonNodeType, JsonValue, JsonPath, JsonTheme } from './types';

export function getNodeType(value: JsonValue): JsonNodeType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  switch (typeof value) {
    case 'object':
      return 'object';
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      return 'null';
  }
}

export function isExpandable(value: JsonValue): boolean {
  const type = getNodeType(value);
  return type === 'object' || type === 'array';
}

export function serializePath(path: JsonPath): string {
  return path.join('.');
}

export function shouldBeCollapsed(
  depth: number,
  collapsed: boolean | number
): boolean {
  if (typeof collapsed === 'boolean') return collapsed;
  return depth >= collapsed;
}

export function safeStringify(value: JsonValue): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function getChildCount(value: JsonValue): number {
  if (value === null || typeof value !== 'object') return 0;
  return Array.isArray(value)
    ? (value as JsonValue[]).length
    : Object.keys(value as Record<string, JsonValue>).length;
}

export function applyTheme(
  theme: JsonTheme | null | undefined,
  element: HTMLElement
): void {
  if (!theme) return;
  const map: Record<keyof JsonTheme, string> = {
    background: '--njv-background',
    fontFamily: '--njv-font-family',
    fontSize: '--njv-font-size',
    keyColor: '--njv-key-color',
    stringColor: '--njv-string-color',
    numberColor: '--njv-number-color',
    booleanColor: '--njv-boolean-color',
    nullColor: '--njv-null-color',
    punctuationColor: '--njv-punctuation-color',
    toggleColor: '--njv-toggle-color',
    metaColor: '--njv-meta-color',
    indentColor: '--njv-indent-color',
  };
  for (const [key, cssVar] of Object.entries(map) as [
    keyof JsonTheme,
    string,
  ][]) {
    const val = theme[key];
    if (val !== undefined) {
      element.style.setProperty(cssVar, val);
    }
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}
