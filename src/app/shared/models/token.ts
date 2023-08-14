export enum TokenType {
  Number,
  Operator,
  LeftParen = '(',
  RightParen = ')',
}

export interface Token {
  type: TokenType;
  value: string | number;
}