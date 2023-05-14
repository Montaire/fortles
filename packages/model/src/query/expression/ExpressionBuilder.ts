import { OperatorExpression, Expression } from "../index.js";
import { IdentifierExpression } from "./IdentifierExpression.js";
import { LiteralExpression } from "./LiteralExpression.js";
import { AddOperatorExpression, AndOperatorExpression, DivideOperatorExpression, EquialOperatorExpression, GreaterOperatorExpression, GreaterOrEquialOperatorExpression, LessOperatorExpression, LessOrEquialOperatorExpression, MultiplyOperatorExpression, NotEquialOperatorExpression, OrOperatorExpression, SubtractOperatorExpression, XorOperatorExpression } from "./operator/index.js";

enum ExpressionBuilderState{
    Idle,
    ParenthesisStart,
    ParenthesisEnd,
    OperatorStart,
    OperatorEnd
}

export class ExpressionBuilder{

    protected operatorRanking: (new(builder: ExpressionBuilder, left: string, right: string) => OperatorExpression)[][] = [
        [
            EquialOperatorExpression, 
            NotEquialOperatorExpression,
            GreaterOperatorExpression,
            LessOperatorExpression, 
            GreaterOrEquialOperatorExpression,
            LessOrEquialOperatorExpression
        ],
        [
            AndOperatorExpression,
            OrOperatorExpression,
            XorOperatorExpression
        ],
        [
            MultiplyOperatorExpression,
            DivideOperatorExpression
        ],
        [
            AddOperatorExpression,
            SubtractOperatorExpression
        ],
    ];

    protected operatorAsd = [];

    protected operatorTree: {[k: string]: {[k: string]: typeof Expression}};

    protected variableName: string;
    protected context: {[key: string]: any};

    constructor(variableName: string, context: {[key: string]: any}){
        this.variableName = variableName;
        this.context = context;
        this.operatorTree = this.buildOperatorTree(this.operatorRanking.flat());
    }

    protected buildOperatorTree(operators: (new(builder: ExpressionBuilder, left: string, right: string) => OperatorExpression)[]){
        const operatorTree: any = {};
        for(const operator of operators){
            const sign =  new operator(this, "", "").getSign();
            let operatorBranch = operatorTree;
            for(const c of sign){
                if(!operatorBranch[c]){
                    operatorBranch[c] = {};
                }
                operatorBranch = operatorBranch[c]
            }
            operatorBranch[""] = operator;
        }
        return operatorTree;
    }

    public build(expressionText: string): Expression{
        expressionText = this.trimSpacesAndParentheses(expressionText);
        const highestOperator = this.buildHighestPrecedneceOperator(expressionText);
        if(highestOperator){
            return highestOperator;
        }
        //TODO: Functional operators

        //Identifier expression
        const identifierExpression = this.buildIdentitifierExpression(expressionText);

        if(identifierExpression){
            return identifierExpression;
        }

        return new LiteralExpression(expressionText);
    }

    protected buildHighestPrecedneceOperator(expressionText: string): OperatorExpression|null{
        let operatorBranch: any= null;
        let isFound = false;
        let stringCharacter: null|string = null;
        let isEscape = false;
        let operatorType: (new() => OperatorExpression)|null = null;
        let highestOperatorType: (new() => OperatorExpression)|null = null;
        let bracketCount = 0;
        for(const c of expressionText){
            if(c == '"' || c == '"' && !stringCharacter){
                stringCharacter = c;
            }
            if(stringCharacter && c == "\\"){
                isEscape = true;
            }
            if(stringCharacter){
                if(isEscape){
                    isEscape = false;
                }else if(c == stringCharacter){
                    stringCharacter = null;
                }
                continue;
            }
            if(c == "("){
                bracketCount++;
            }
            if(c == ")"){
                bracketCount--;
            }
            //Skip if brackets are found. external cant be becouse of trim, 
            //and inside bracket there should not be higher level operand.
            if(bracketCount > 0){
                continue;
            }
            if(isFound){
                if(operatorBranch[c]){
                    operatorType = operatorBranch[c];
                }else{
                    operatorType = operatorBranch[""]
                }
            }else{
                if(this.operatorTree[c]){
                    operatorBranch = this.operatorTree[c];
                    isFound = true;
                }
            }
            if(operatorType){
                if(!highestOperatorType || this.getOperatorPrecedence(operatorType) > this.getOperatorPrecedence(highestOperatorType))
                highestOperatorType = operatorType;
                operatorType = null;
            }
        }
        if(highestOperatorType){
            return new highestOperatorType();
        }else{
            return null;
        }
    }

    protected buildIdentitifierExpression(expressionText: string): IdentifierExpression|null{
        if(expressionText in Object.keys(this.context)){
            return new IdentifierExpression(expressionText);
        }
        return null;
    }

    public trimSpacesAndParentheses(input: string): string {
        let trimmed = input.trim();
        let match;
      
        while ((match = trimmed.match(/^\((.*)\)$/))) {
            const inner = match[1];
            const openCount = (inner.match(/\(/g) || []).length;
            const closeCount = (inner.match(/\)/g) || []).length;
        
            if (openCount === closeCount) {
                trimmed = inner;
            } else {
                break;
            }
        }
      
        return trimmed;
      }      
    protected getOperatorPrecedence(operator: typeof OperatorExpression): number{
        return 0;
    }
}