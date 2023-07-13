import { ErrorReporter } from "../ErrorReporter.js";
import { ExportedData } from "../utlity/ClassSerializer.js";
import { AssociationType } from "./AssociationType.js";
import { Type } from "./Type.js";

export class AssociationTypeDescriptor extends Type<any, any>{

    public type?: typeof AssociationType;

    public source?: string;

    public target?: string;

    public override parse(input: string, errorReporter: ErrorReporter) {
        throw new Error("Method not implemented.");
    }

    /**
     * Appends the source and target to the Exported type.
     * @returns 
     */
    public override export(): ExportedData {
        const result = super.export();
        result.source = this.source;
        result.target = this.target;
        return result;
    }

    public override import(source: ExportedData): void {
        super.import(source);
        this.source = source.source;
        this.target = source.target;
    }
}