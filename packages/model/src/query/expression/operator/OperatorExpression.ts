import { Expression, ExpressionBuilder } from "../../index.js";

export abstract class OperatorExpression{

    protected leftText: string;
    protected rightText: string;

    protected leftExpression: Expression;
    protected rightExpression: Expression;

    constructor(expressionBuilder: ExpressionBuilder, leftText: string, rightText: string){
        this.leftText = leftText;
        this.rightText = rightText;

        this.leftExpression = expressionBuilder.build(leftText);
        this.rightExpression = expressionBuilder.build(rightText);
    }

    abstract getSign(): string;
}