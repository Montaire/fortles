import { OperatorExpression } from "../../../index.js";

export enum ArithmeticOperatorExpressionType{
    Add = "+",
    Subsctract = "-",
    Multiply = "*",
    Divide = "/"
}

export abstract class ArithmeticOperatorExpression extends OperatorExpression{
    abstract readonly type: ArithmeticOperatorExpressionType;

    public getSign(): string{
        return this.type as string;
    }
}

export class AddOperatorExpression extends ArithmeticOperatorExpression{
    override readonly type = ArithmeticOperatorExpressionType.Add;
}

export class SubtractOperatorExpression extends ArithmeticOperatorExpression{
    override readonly type = ArithmeticOperatorExpressionType.Subsctract;
}

export class MultiplyOperatorExpression extends ArithmeticOperatorExpression{
    override readonly type = ArithmeticOperatorExpressionType.Multiply;
}

export class DivideOperatorExpression extends ArithmeticOperatorExpression{
    override readonly type = ArithmeticOperatorExpressionType.Divide;
}