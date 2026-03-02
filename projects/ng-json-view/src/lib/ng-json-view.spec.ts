import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { NgJsonViewComponent } from './ng-json-view';
import { JsonValue } from './types';

function createFixture<T>(HostClass: new () => T): ComponentFixture<T> {
  const fixture = TestBed.createComponent(HostClass);
  fixture.detectChanges();
  return fixture;
}

async function renderHost(src: JsonValue, opts: {
  name?: string | false;
  collapsed?: boolean | number;
  sortKeys?: boolean;
  enableClipboard?: boolean;
  indentWidth?: number;
} = {}): Promise<HTMLElement> {
  const name = opts.name !== undefined ? opts.name : 'root';
  const collapsed = opts.collapsed !== undefined ? opts.collapsed : false;
  const sortKeys = opts.sortKeys !== undefined ? opts.sortKeys : false;
  const enableClipboard = opts.enableClipboard !== undefined ? opts.enableClipboard : true;
  const indentWidth = opts.indentWidth !== undefined ? opts.indentWidth : 4;

  @Component({
    standalone: true,
    imports: [NgJsonViewComponent],
    template: `
      <ng-json-view
        [src]="src"
        [name]="name"
        [collapsed]="collapsed"
        [sortKeys]="sortKeys"
        [enableClipboard]="enableClipboard"
        [indentWidth]="indentWidth"
      />
    `,
  })
  class LocalTestHost {
    src: JsonValue = src;
    name: string | false = name;
    collapsed: boolean | number = collapsed;
    sortKeys: boolean = sortKeys;
    enableClipboard: boolean = enableClipboard;
    indentWidth: number = indentWidth;
  }

  const fixture = TestBed.createComponent(LocalTestHost);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('NgJsonViewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  it('should create', async () => {
    const el = await renderHost({ a: 1 });
    expect(el.querySelector('ng-json-view')).toBeTruthy();
  });

  it('should render the root key', async () => {
    const el = await renderHost({ a: 1 }, { name: 'root' });
    const key = el.querySelector('.njv-key');
    expect(key?.textContent).toBe('root');
  });

  it('should render custom root key name', async () => {
    const el = await renderHost({ a: 1 }, { name: 'myData' });
    const key = el.querySelector('.njv-key');
    expect(key?.textContent).toBe('myData');
  });

  it('should hide root key when name is false', async () => {
    const el = await renderHost(42, { name: false });
    expect(el.querySelector('.njv-key')).toBeNull();
  });

  it('should collapse all nodes when collapsed=true', async () => {
    const el = await renderHost({ a: { b: 1 } }, { collapsed: true });
    const toggles = el.querySelectorAll('button.njv-toggle');
    expect(toggles.length).toBeGreaterThan(0);
    toggles.forEach(t => expect(t.textContent?.trim()).toBe('▶'));
  });

  it('should show expanded nodes when collapsed=false', async () => {
    const el = await renderHost({ a: 1, b: 'hello' }, { collapsed: false });
    const values = el.querySelectorAll('.njv-value');
    expect(values.length).toBeGreaterThan(0);
  });

  it('should sort keys when sortKeys=true', async () => {
    const el = await renderHost({ z: 1, a: 2, m: 3 }, { sortKeys: true });
    const keys = Array.from(el.querySelectorAll('.njv-key')).map(k => k.textContent?.replace(/"/g, ''));
    const childKeys = keys.filter(k => k !== 'root');
    expect(childKeys[0]).toBe('a');
    expect(childKeys[1]).toBe('m');
    expect(childKeys[2]).toBe('z');
  });

  it('should display string values', async () => {
    const el = await renderHost('hello world', { name: false });
    expect(el.querySelector('.njv-string')?.textContent).toContain('hello world');
  });

  it('should display number values', async () => {
    const el = await renderHost(42, { name: false });
    expect(el.querySelector('.njv-number')?.textContent?.trim()).toBe('42');
  });

  it('should display boolean values', async () => {
    const el = await renderHost(true, { name: false });
    expect(el.querySelector('.njv-boolean')?.textContent?.trim()).toBe('true');
  });

  it('should display null values', async () => {
    const el = await renderHost(null, { name: false });
    expect(el.querySelector('.njv-null')?.textContent?.trim()).toBe('null');
  });

  it('should display arrays', async () => {
    const el = await renderHost([1, 2, 3], { name: false });
    const values = el.querySelectorAll('.njv-value.njv-number');
    expect(values.length).toBe(3);
  });

  it('should hide copy buttons when enableClipboard=false', async () => {
    const el = await renderHost({ a: 1 }, { enableClipboard: false });
    expect(el.querySelectorAll('.njv-copy').length).toBe(0);
  });

  it('should show copy buttons when enableClipboard=true', async () => {
    const el = await renderHost({ a: 1 }, { enableClipboard: true });
    expect(el.querySelectorAll('.njv-copy').length).toBeGreaterThan(0);
  });

  it('should collapse at depth when collapsed is a number', async () => {
    const el = await renderHost({ a: { b: { c: 1 } } }, { collapsed: 1 });
    const toggles = el.querySelectorAll('button.njv-toggle');
    const arrows = Array.from(toggles).map(t => t.textContent?.trim());
    // root (depth 0) → shouldBeCollapsed(0, 1) = 0 >= 1 = false → expanded
    expect(arrows[0]).toBe('▼');
    // 'a' (depth 1) → shouldBeCollapsed(1, 1) = 1 >= 1 = true → collapsed
    expect(arrows[1]).toBe('▶');
  });

  it('should display nested objects recursively', async () => {
    const el = await renderHost({ outer: { inner: 42 } });
    const numbers = el.querySelectorAll('.njv-value.njv-number');
    expect(numbers.length).toBe(1);
    expect(numbers[0].textContent?.trim()).toBe('42');
  });

  it('should show toggle button for object nodes', async () => {
    const el = await renderHost({ a: 1 });
    const toggles = el.querySelectorAll('button.njv-toggle');
    expect(toggles.length).toBeGreaterThan(0);
  });

  it('should expand a collapsed node when toggle is clicked', async () => {
    @Component({
      standalone: true,
      imports: [NgJsonViewComponent],
      template: '<ng-json-view [src]="src" [collapsed]="true" />'
    })
    class ToggleTestHost { src: JsonValue = { a: 1 }; }

    const fixture = TestBed.createComponent(ToggleTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const toggle = el.querySelector('button.njv-toggle') as HTMLElement;
    expect(toggle?.textContent?.trim()).toBe('▶');
    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toggle?.textContent?.trim()).toBe('▼');
  });
});
