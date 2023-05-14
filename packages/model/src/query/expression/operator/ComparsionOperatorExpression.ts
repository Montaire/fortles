import { OperatorExpression } from "../index.js";

export enum ComparsionOperatorExpressionType{
    Equial = "==",
    NotEquial = "!=",
    Greater = "<",
    Less = ">",
    GreaterOrEquial = "<=",
    LessOrEquial = ">="
}

export abstract class ComparsionOperatorExpression extends OperatorExpression{
    abstract readonly type: ComparsionOperatorExpressionType;
    override getSign(): string {
        return this.getSign();
    }
}

export class EquialOperatorExpression extends ComparsionOperatorExpression{
    public readonly type = ComparsionOperatorExpressionType.Equial;
}
export class GreaterOperatorExpression extends ComparsionOperatorExpression{
    public readonly type = ComparsionOperatorExpressionType.Greater;
}

export class LessOperatorExpression extends ComparsionOperatorExpression{
    public readonly type = ComparsionOperatorExpressionType.Less;
}

export class GreaterOrEquialOperatorExpression extends ComparsionOperatorExpression{
    public readonly type = ComparsionOperatorExpressionType.GreaterOrEquial;
}

export class LessOrEquialOperatorExpression extends ComparsionOperatorExpression{
    public readonly type = ComparsionOperatorExpressionType.LessOrEquial;
}

export class NotEquialOperatorExpression extends ComparsionOperatorExpression{
    public readonly type = ComparsionOperatorExpressionType.NotEquial;
}
