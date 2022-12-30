/* eslint-disable no-undef */
import {IInputs, IOutputs} from "./generated/ManifestTypes";



export class customIconPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

            // The PCF context object\
            private context: ComponentFramework.Context<IInputs>;
            // The wrapper div element for the component\
            private container: HTMLDivElement;
            private the_container: HTMLDivElement;
    


            private svgMaxID: number;

            // The callback function to call whenever your code has made a change to a bound or output property\
            private notifyOutputChanged: () => void;
 
            private svgCode0: string | null;
            private fill0: string;
            private color0: string;
            private hoverColor0: string;

            private svgCode1: string | null;
            private fill1: string;
            private color1: string;
            private hoverColor1: string;

            private hoverFill: string;

            private svg: SVGGraphicsElement;
    
            private _value: number;
            private _initialValue: number;
    
                //eventHandles to catch events
            private _handleMouseStart: EventListenerOrEventListenerObject; // (event: Event) => void;
            private _handleMouseLeave: EventListenerOrEventListenerObject; //(event: Event) => void;
            private _handleMouseClick: EventListenerOrEventListenerObject; //(event: Event) => void;
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
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        context.mode.trackContainerResize(true);
          
        this.container = container;
 
         // Create main container div. 
         this.the_container = document.createElement("div"); 
         
         // Create svg container div and append to main container. 
         this.the_container.className = "custom PCF icon";

         this.the_container.style.width ="100%";
         this.the_container.style.height ="100%";
 
         this.container.appendChild(this.the_container);
         
         this.notifyOutputChanged = notifyOutputChanged;

        this._handleMouseStart = this.handleMouseStart.bind(this);
        this._handleMouseLeave = this.handleMouseLeave.bind(this);
        this._handleMouseClick = this.handleMouseClick.bind(this);

        this.the_container.addEventListener('click', this._handleMouseClick); 
        this.the_container.addEventListener('mouseenter', this._handleMouseStart); 
        this.the_container.addEventListener('mouseleave', this._handleMouseLeave); 

        this._value =0;
        this._initialValue =-2;
        //this.updateView(context);
    }

    public handleMouseStart(event: Event) {

        this.the_container.style.background = this.hoverFill;
        this.initSVG(true)

	}     

    public handleMouseLeave(event: Event) {

        if(this._value == 1)
        this.the_container.style.background = this.fill1
        else
        this.the_container.style.background = this.fill0
    
        this.initSVG(false)
    }

    public handleMouseClick(event: Event) {

        var v = this._value;

        if(this.svgMaxID > -1){
            v = v+1;
            if (v>this.svgMaxID){
                v = 0;
            }
        }

        if (v != this._value){
            this._value = v;
            if(v  == 1)
                this.the_container.innerHTML = this.svgCode1!
            else
                this.the_container.innerHTML = this.svgCode0!;
            this.initSVG(true)
        }
        this.notifyOutputChanged() ;
	}  

    private initSVG(hover: boolean):void 
    {

        let _svgElement = this.the_container.querySelector("svg");
        if(_svgElement != null)
        {
            // The main SVG object
            this.svg = _svgElement as SVGGraphicsElement;

           // Find referenced SVG elements
           var svgObjCollection = this.svg.getElementsByClassName('hoverAffectedObject');

           // Set fill color of found SVG elements
           for (let i = 0; i < svgObjCollection.length; i++) {
               let svgObj = <SVGElement>svgObjCollection[i];
               if(svgObj != null){
                   var to_fill = (svgObj.attributes.getNamedItem("fill") != null) && (svgObj.attributes.getNamedItem("fill")?.value != "none");
                   var to_stroke = (svgObj.attributes.getNamedItem("stroke") != null) && (svgObj.attributes.getNamedItem("stroke")?.value != "none")
                    if(hover){
                        if(this._value == 1)
                            {
                            if(to_fill) svgObj.style.fill = this.hoverColor1;
                            if(to_stroke) svgObj.style.stroke = this.hoverColor1;
                            }
                        else
                           {
                            if(to_fill) svgObj.style.fill = this.hoverColor0;
                            if(to_stroke) svgObj.style.stroke = this.hoverColor0;
                           }    
                    } else {
                        if(this._value == 1)
                            {
                            if(to_fill) svgObj.style.fill = this.color1;
                            if(to_stroke) svgObj.style.stroke = this.color1;
                            }
                        else
                           {
                            if(to_fill) svgObj.style.fill = this.color0;
                            if(to_stroke) svgObj.style.stroke = this.color0;
                            }                           
                    }
   
               }
           }	

        }
    }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {


        // Add code to update control view
        this.the_container.style.position = 'relative';

        this.the_container.style.height  = context.mode.allocatedHeight.toString() + "px";
        this.the_container.style.width  = context.mode.allocatedWidth.toString() + "px";

        if(!context.parameters.svg0.raw?.startsWith("<svg ")
            && !context.parameters.svg0.raw?.endsWith("</svg>")){
            this.svgMaxID = -1;
            this.svgCode0 = "";
            this.svgCode1 = "";
        } else {
            this.svgCode0 = context.parameters.svg0.raw;
            if(!context.parameters.svg1.raw?.startsWith("<svg ") 
            && !context.parameters.svg1.raw?.endsWith("</svg>")){
                this.svgMaxID = 0;
                this.svgCode1 = "";
            } else {
                this.svgMaxID = 1;
                this.svgCode1 = context.parameters.svg1.raw;
            }
        }
        //svg0 params
        if(context.parameters.Color0.raw)
            this.color0 = context.parameters.Color0.raw;
        else
            this.color0  = "black";   

        if(context.parameters.Fill0.raw)
            this.fill0 = context.parameters.Fill0.raw;
        else
            this.fill0  = "white";  

        if(context.parameters.hoverColor0.raw)
            this.hoverColor0 = context.parameters.hoverColor0.raw;
        else
            this.hoverColor0  = "green";   

        //svg1 params
        if(context.parameters.Color1.raw)
            this.color1 = context.parameters.Color1.raw;
        else
            this.color1  = "black";   

        if(context.parameters.Fill1.raw)
            this.fill1 = context.parameters.Fill1.raw;
        else
            this.fill1  = "white";  

        if(context.parameters.hoverColor1.raw)
            this.hoverColor1 = context.parameters.hoverColor1.raw;
        else
            this.hoverColor1  = "green";   

        //general params
        if(context.parameters.hoverFill.raw)
            this.hoverFill = context.parameters.hoverFill.raw;
        else
            this.hoverFill  = "yellow";   
        
        if(context.parameters.initialValue.raw){
            if(context.parameters.initialValue.raw<=this.svgMaxID)
                {
                    if(this._initialValue !=  context.parameters.initialValue.raw)
                          {
                            this._initialValue = context.parameters.initialValue.raw;
                            this._value = this._initialValue
                         }
                }
            else
            this._value = this.svgMaxID
        }
        if(this._value == 1)
        {
            this.the_container.style.background = this.fill1;
            this.the_container.innerHTML = this.svgCode1!
        }
        else {
            this.the_container.style.background = this.fill0
            this.the_container.innerHTML = this.svgCode0!
        }
        
        this.initSVG(false)
    }

    /**
     * It is called by the framework prior to a contr ol receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            Value: this._value,
            svgMaxID: this.svgMaxID
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
