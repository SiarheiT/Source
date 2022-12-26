import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { DraftEditor, IDraftEditorProps } from "./DraftEditor";
import * as React from "react";


export class DraftEditorPCF implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    private value: string = "";
    private initialValue: string | null = "";
    private isChanged: string = "0";
    private recordID: number | null = -2;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true);

        this.setValue = this.setValue.bind(this);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        
        var newID = context.parameters.recordID.raw
 
  
        if ((newID == null) || (this.recordID != newID) || (this.initialValue != context.parameters.initialValue.raw)){
            this.initialValue = context.parameters.initialValue.raw;
            this.value = this.initialValue ? this.initialValue: "";
            this.isChanged = "0"
        }
            

        
        this.recordID = newID;

        var scale: number;
        if(context.parameters.Scale.raw != null && (context.parameters.Scale.raw >1)){
            scale = context.parameters.Scale.raw
        } else {
            scale = 1
        }

        const props: IDraftEditorProps = { 
            parentUpdate: (value: string) => this.setValue(value),
            
            scale: scale,
            initialValue: this.initialValue ? this.initialValue: "",
            width: context.mode.allocatedWidth,
            height: context.mode.allocatedHeight

         };
         this.notifyOutputChanged();
        return React.createElement(
            DraftEditor, props
        );
    }

    public setValue(v: string): void {
        this.value = v;
        this.isChanged = "1";
        this.notifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Value: this.value,
            IsChanged: this.isChanged 
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
