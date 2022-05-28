import * as ts from 'typescript';
const transformer = context => {
    return sourceFile => {
        const visitor = (node) => {
            if (ts.isIdentifier(node)) {
                switch (node.escapedText) {
                    case 'babel':
                        context.factory.createIdentifier('asd');
                    case 'plugins':
                        context.factory.createIdentifier('pox');
                }
            }
            return ts.visitEachChild(node, visitor, context);
        };
        return ts.visitNode(sourceFile, visitor);
    };
};
export default transformer;
//# sourceMappingURL=TranspilerQueryPlugin.js.map