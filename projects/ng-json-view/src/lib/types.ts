export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

export type PathSegment = string | number;
export type JsonPath = PathSegment[];

export type JsonNodeType =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null';

export interface JsonTheme {
  background?: string;
  fontFamily?: string;
  fontSize?: string;
  keyColor?: string;
  stringColor?: string;
  numberColor?: string;
  booleanColor?: string;
  nullColor?: string;
  punctuationColor?: string;
  toggleColor?: string;
  metaColor?: string;
  indentColor?: string;
}
