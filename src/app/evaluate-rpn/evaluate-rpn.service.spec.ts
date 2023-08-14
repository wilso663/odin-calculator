import { TestBed } from '@angular/core/testing';

import { EvaluateRpnService } from './evaluate-rpn.service';
import { Token, TokenType } from '../shared/models/token';
import { Operator, OperatorToken } from '../shared/models/operator';

describe('EvaluateRpnService', () => {
  let service: EvaluateRpnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluateRpnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should convert a string expression to RPN correctly',() => {
    const tokens = ['3','4','2','1','5','-','/','*','+'].map((token) => {
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
    expect(service.shuntingYard('3 + 4 * 2 / ( 1 - 5 )')).toEqual(tokens);
  });

  it('should evalulate integer expressions correctly', () => {
    expect(service.evaluateExpression('3 + 4 * 2 / ( 1 - 5 )')).toEqual(1);
    expect(service.evaluateExpression('(((256) - 2 * 42) / 2 + (3) * 60)')).toEqual(266);
  });
  it('should evaluate decimal expressions correctly', () => {
    expect(service.evaluateExpression('5 / 4')).toEqual(1.25);
    expect(service.evaluateExpression('5 / 7')).toEqual(0.7142857142857143);
    expect(service.evaluateExpression('( ( 5 / (6) ) )')).toEqual(0.8333333333333334);
  });
  
});

