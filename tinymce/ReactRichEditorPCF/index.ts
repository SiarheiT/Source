import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";

import { ITinyMCEProps, TinyMCE_PCF } from "./tinymce_react";


//const editorRef = useRef(null);

export class ReactRichEditorPCF implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    //private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private value: string;

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

        if(context.parameters.Value.raw){
            this.value = context.parameters.Value.raw
        } else {
            this.value = ""
        }
        
        var menu: boolean;
        menu = (context.parameters.IsMenubar.raw == 1)

        var tool: string;
        if((context.parameters.Toolbar.raw!=null) && (context.parameters.Toolbar.raw.length>3)){
            tool = context.parameters.Toolbar.raw
        } else {
            tool = 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | link ' +
            'removeformat table | help'
        } 

        var h: number;
        if(context.mode.allocatedHeight > 300){
            h= context.mode.allocatedHeight
        } else {
            h = 300
        }
        console.log("h="+h);

        var scale: number;
        if(context.parameters.Scale.raw != null && (context.parameters.Scale.raw >1)){
            scale = context.parameters.Scale.raw
        } else {
            scale = 1
        }

        const props: ITinyMCEProps = { 
           
                parentUpdate: (value: string) => this.setValue(value),

                scale: scale,
                initialValue: this.value,
                menubar: menu, //'edit insert format help'
                height: h,
            
                plugins: 'lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                toolbar: tool,
              
                content_style: 'body { font-family:Source Sans Pro,OPen Sans,sans-serif; font-size:14px }'
              
            };

        return (

           React.createElement(TinyMCE_PCF, props)
        );
    }
    
    public setValue(v: string): void {
        this.value = v;
        this.notifyOutputChanged();
    }
            /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Value: this.value
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
