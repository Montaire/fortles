import { OperatorExpression } from "../index.js";

export enum BinaryOperatorExpressionType{
    And = "&&",
    Or = "||",
    Xor = "^",
    BitwiseAnd = "&",
    BitwiseOr = "|"
}

export abstract class BinaryOperatorExpression extends OperatorExpression{
    abstract readonly type: BinaryOperatorExpressionType;
    override getSign(): string {
        return this.type;
    }
}

export class AndOperatorExpression extends BinaryOperatorExpression{
    override readonly type = BinaryOperatorExpressionType.And;
}

export class OrOperatorExpression extends BinaryOperatorExpression{
    override readonly type = BinaryOperatorExpressionType.Or;
}

export class XorOperatorExpression extends BinaryOperatorExpression{
    override readonly type = BinaryOperatorExpressionType.And;
}

export class BitwiseAndOperatorExpression extends BinaryOperatorExpression{
    override readonly type = BinaryOperatorExpressionType.And;
}

export class BitwiseOrOperatorExpression extends BinaryOperatorExpression{
    override readonly type = BinaryOperatorExpressionType.And;
}