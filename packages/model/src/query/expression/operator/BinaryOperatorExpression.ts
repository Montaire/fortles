import { OperatorExpression } from "../../../index.js";

export enum BinaryOperatorExpressionType{
    And = "&&",
    Or = "||",
    Xor = "^",
    BitwiseAnd = "&",
    BitwiseOr = "|"
}

export abstract class BinaryOperatorExpression extends OperatorExpression{
    static type: BinaryOperatorExpressionType;
    static getSign(): string {
        return this.type;
    }
}

export class AndOperatorExpression extends BinaryOperatorExpression{
    static override type = BinaryOperatorExpressionType.And;
}

export class OrOperatorExpression extends BinaryOperatorExpression{
    static override type = BinaryOperatorExpressionType.Or;
}

export class XorOperatorExpression extends BinaryOperatorExpression{
    static override  type = BinaryOperatorExpressionType.And;
}

export class BitwiseAndOperatorExpression extends BinaryOperatorExpression{
    static override  type = BinaryOperatorExpressionType.And;
}

export class BitwiseOrOperatorExpression extends BinaryOperatorExpression{
    static override type = BinaryOperatorExpressionType.And;
}