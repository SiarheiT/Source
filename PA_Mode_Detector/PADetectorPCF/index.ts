import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PAModeDetectorPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {


    private ModeDetected: number;

    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    // eslint-disable-next-line no-unused-vars
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        var PAdiv= <HTMLDivElement>document.querySelector("div#publishedCanvas");

        //<div id='responsiveScalingCanvasHost' style=' overflow: hidden; width: 640px; height: 1280px;' >
        // with real window size before scaling
    

        if (PAdiv == null){

             this.ModeDetected = -1
            
        } else {
            if(PAdiv.style.wi)
            newValue = -1
        }

        this.currentScaleValue = newValue;

        notifyOutputChanged(); 
          

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    // eslint-disable-next-line no-unused-vars
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        var newValue: number;
        var scaleValue: string;

        if(context.parameters.ScaleValue.raw){
            newValue = context.parameters.ScaleValue.raw
        }
        else {
            newValue = -1
        }
    

        if (this.isDivFound && (newValue > 0)){

            this.publishedCanvasDiv.style.transform = "scale("+ newValue + ")"
            scaleValue = (100 /newValue).toFixed(0)+"%"
            this.publishedCanvasDiv.style.width =  scaleValue
            this.publishedCanvasDiv.style.height = scaleValue
            this.publishedCanvasDiv.style.transformOrigin = "left top"
            
        } else {
            newValue = -1
        }

        this.currentScaleValue = newValue;

            //this.currentScale = "scale: " + this.publishedCanvasDiv.style.transform;
            //width: 100%; height: 100%; position: absolute; transform-origin: left top; transform: scale(1);

        this.notifyOutputChanged(); 
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            ScaleValue: this.currentScaleValue
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
