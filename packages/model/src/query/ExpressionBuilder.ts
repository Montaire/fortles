import { CompareOperatorExpression } from "./expression/CompareOperatorExpression.js";
import { ParenthesisExpression } from "./expression/ParenthesisExpression.js";

enum ExpressionBuilderState{
    Text,
    ParenthesisStart,
    ParenthesisEnd
}

export class ExpressionBuilder{

    protected operators = [
        ["="],
        ["==", "<", ">", ">=", "<="],
        ["||", "&&", "^"],
        ["*", "/"],
        ["+", "-"]
    ];

    protected operatorMap = {
        "==": new CompareOperatorExpression("=="),
    };

    public build(lambda: string, expressionText: string, context: {[key: string]: any}, cursor: number = 0, expression: Expression = null): number{
        //Bulding a tree from the operations in the order of operators.
        //1. Collect parenthesis
        //2. Collect operators. they have left and right side
        //detection should go until the end of expression, or higher level operator not found.
        //in that case it should switch to the higher level one.
        //3. Collect functional exporessions
        //4. Collect literal expressions
        // x => ((x.asd == 24) || (x.pox + 14 * 2))


        //------------------------------------
        let state = ExpressionBuilderState.Text;
        let parenthesisCounter = 0;
        let expressionStart = 0;
        while(cursor < expressionText.length){
            let c = expressionText[cursor];
            switch(state){
                case ExpressionBuilderState.Text:
                    //First group by parenthesis
                    if(c == '('){
                        expressionStart = cursor;
                        parenthesisCounter = 1;
                        state = ExpressionBuilderState.ParenthesisStart;
                    }
                    //Then gorup by binary operators
                    if(c == '|' || c == '&' || c == '^'){

                    }

                    if(c == '*' || c == '/'){
                        
                    }
                    break;
                case ExpressionBuilderState.ParenthesisStart:
                    if(c == '('){
                        parenthesisCounter++;
                    }else if(c == ')'){
                        parenthesisCounter--;
                        if(parenthesisCounter == 0){
                            const expression = new ParenthesisExpression();
                            this.build(lambda, expressionText.substring(expressionStart, cursor), context, cursor, expression);
                            expressionStart = cursor;
                            state = ExpressionBuilderState.Text;
                        }
                    }
            }
            cursor++;
        }
        return cursor;
    }
}