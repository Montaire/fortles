import { Expression, ExpressionBuilder } from "../../../index.js";

export abstract class OperatorExpression{

    protected leftText: string;
    protected rightText: string;

    protected leftExpression?: Expression;
    protected rightExpression?: Expression;

    constructor(leftText: string, rightText: string){
        this.leftText = leftText;
        this.rightText = rightText;
    }

    public build(expressionBuilder: ExpressionBuilder){
        this.leftExpression = expressionBuilder.build(this.leftText);
        this.rightExpression = expressionBuilder.build(this.rightText);
    }
}