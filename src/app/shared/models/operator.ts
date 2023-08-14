export enum OperatorToken {
  Add = '+',
  Subtract = '-',
  Multiply = '*',
  Divide = '/',
  Modulus = '%',
  Power = '^',
}

export namespace Operator {

  export function isOperator(token: string): boolean {
    return Object.values(OperatorToken).includes(token as OperatorToken);
  }

  export function isLeftAssociative(op: OperatorToken): boolean {
    switch (op) {
      case OperatorToken.Add:
      case OperatorToken.Subtract:
        return true;
      case OperatorToken.Multiply:
      case OperatorToken.Divide:
      case OperatorToken.Modulus:
      case OperatorToken.Power:
        return false;
    }
  }

  export function isRightAssociative(op: OperatorToken): boolean {
    return !isLeftAssociative(op);
  }

  export function precedence(op: OperatorToken): number {
    switch (op) {
      case OperatorToken.Add:
      case OperatorToken.Subtract:
        return 1;
      case OperatorToken.Multiply:
      case OperatorToken.Divide:
      case OperatorToken.Modulus:
      case OperatorToken.Power:
        return 2;
      default:
        throw new Error(`Invalid operator: ${op}`);
    }
  }

  export function apply(op: OperatorToken, a: number, b: number): number {
    switch (op) {
      case OperatorToken.Add:
        return a + b;
      case OperatorToken.Subtract:
        return a - b;
      case OperatorToken.Multiply:
        return a * b;
      case OperatorToken.Divide:
        return a / b;
      case OperatorToken.Modulus:
        return a % b;
      case OperatorToken.Power:
        return Math.pow(a, b);
    }
  }

  export function arity(op: OperatorToken): number {
    return 2;
  }
}