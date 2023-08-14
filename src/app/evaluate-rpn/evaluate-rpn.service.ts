import { Injectable } from '@angular/core';
import { Token, TokenType } from '../shared/models/token';
import { OperatorToken, Operator} from '../shared/models/operator';

@Injectable({
  providedIn: 'root'
})
export class EvaluateRpnService {

  //leftParenCount = 0;
  constructor() { }

  evaluateRPN(tokens: Token[]): number | string {
    const stack: number[] = [];
  
    for (const token of tokens) {
      switch (token.type) {
        case TokenType.Number:
          stack.push(token.value as number);
          break;
        case TokenType.Operator:
          const op = token.value as OperatorToken;
          const arity = Operator.arity(op);
          if (stack.length < arity) {
            throw new Error(`Not enough operands for operator '${op}'`);
          }
          const args = stack.splice(-arity);
          const result = Operator.apply(op,args[0],args[1]);
          stack.push(result);
          break;
      }
    }
  
    if (stack.length !== 1) {
      throw new Error(`Invalid stack length: ${tokens.map((t) => t.value).join(' ')}`);
    }
  
    return stack[0];
  }

  expressionToTokens(expression: string): Token[] {
    return expression
    .replace(/\s+/g, '') // Remove whitespace
    .split(/([\+\-\*\/\(\)])/) // Split on operators and parentheses
    .filter((token) => token.length > 0) // Remove empty strings
    .map((token) => {
      if( /^\d+(\.\d+)?$/.test(token) ) {
        return { type: TokenType.Number, value: parseFloat(token) };
      } else if (Operator.isOperator(token)) {
        return { type: TokenType.Operator, value: token as OperatorToken };
      } else if (token === '(') {
        return { type: TokenType.LeftParen, value: token };
      } else if (token === ')') {
        return { type: TokenType.RightParen, value: token };
      } else {
        throw new Error(`Invalid token: ${token}`);
      }
    });
  }

  shuntingYard(expression: string): Token[] {
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];
  
    const tokens = this.expressionToTokens(expression);

    for (const token of tokens) {
      switch (token.type) {
        case TokenType.Number:
          outputQueue.push(token);
          break;
        case TokenType.Operator:
          while (operatorStack.length > 0) {
            const top = operatorStack[operatorStack.length - 1];
            if (top.type === TokenType.Operator) {
              const topOp = top.value as OperatorToken;
              const op = token.value as OperatorToken;
              if ((Operator.isLeftAssociative(op) && Operator.precedence(op) <= Operator.precedence(topOp))
                || (Operator.isRightAssociative(op) && Operator.precedence(op) < Operator.precedence(topOp))) {
                outputQueue.push(operatorStack.pop()!);
                continue;
              }
            }
            break;
          }
          operatorStack.push(token);
          break;
        case TokenType.LeftParen:
          operatorStack.push(token);
          break;
        case TokenType.RightParen:
          while (operatorStack.length > 0) {
            const top = operatorStack[operatorStack.length - 1];
            if (top.type === TokenType.LeftParen) {
              operatorStack.pop();
              break;
            } else {
              outputQueue.push(operatorStack.pop()!);
            }
          }
          break;
      }
    }
  
    while (operatorStack.length > 0) {
      const op = operatorStack.pop()!;
      if (op.type === TokenType.LeftParen) {
        throw new Error('Mismatched parentheses');
      }
      outputQueue.push(op);
    }
  
    return outputQueue;
  }
  //Debug method. Use evaluateRPN in evaluateExpression otherwise
  evaluateAndLogRPN(tokens: Token[]): number | string {
    const result = this.evaluateRPN(tokens);
    console.log(`Input: ${tokens.map((t) => t.value).join(' ')}\nOutput: ${result}`);
    return result;
  }

  evaluateExpression(expression: string): number | string {
    const tokens = this.shuntingYard(expression);
    const result = this.evaluateAndLogRPN(tokens);
    return result;
  }
}
