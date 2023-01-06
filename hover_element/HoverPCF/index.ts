/* eslint-disable no-undef */
import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class HoverPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

        // The PCF context object\
        private context: ComponentFramework.Context<IInputs>;
        // The wrapper div element for the component\
        private container: HTMLDivElement;
        private the_container: HTMLDivElement;
        private svg_container: HTMLDivElement;

        private svg: SVGGraphicsElement;

        private useSvg?: boolean;
        // The callback function to call whenever your code has made a change to a bound or output property\
        private notifyOutputChanged: () => void;

        private fill: string;
        private border: string;

        private hoverFill: string;
        private hoverBorder: string;

        private clickFill:string;
        private clickBorder: string;

        private _value: string;
        private _targetID: string;
        //last clicked id
        private  selectedID: string;

            //eventHandles to catch events
        private _handleMouseStart : EventListenerOrEventListenerObject;
        private _handleMouseLeave : EventListenerOrEventListenerObject;
        private _handleMouseClick : EventListenerOrEventListenerObject;

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
     public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
    {

           // Need to track container resize so that control could get the available width. The available height won't be provided even this is true
           context.mode.trackContainerResize(true);
          
        this.container = container;
 
         // Create main container div. 
         this.the_container = document.createElement("div"); 
         
         // Create svg container div and append to main container. 
         this.the_container.setAttribute("id", "hover_PCF_my-container");

         this.the_container.style.width ="100%";
 
         this.container.appendChild(this.the_container);
         
         this.notifyOutputChanged = notifyOutputChanged;

        this._handleMouseStart = this.handleMouseStart.bind(this);
        this._handleMouseLeave = this.handleMouseLeave.bind(this);
        this._handleMouseClick = this.handleMouseClick.bind(this);

        this.selectedID = "";
        
      

    }
	public handleMouseStart(event: Event) {

      

        this._value = "hover";
        let elementPath = (event.currentTarget as HTMLDivElement);

        this._targetID = (event.currentTarget as HTMLDivElement).getAttribute("id")!;
        if(this.useSvg){
            if(this._targetID == this.selectedID){
                elementPath.style.fill = this.clickFill!;
                elementPath.style.stroke = this.clickBorder!;
            } else {
                elementPath.style.fill = this.hoverFill!;
                elementPath.style.stroke = this.hoverBorder!;
            }

        } else {
            elementPath.style.background = this.hoverFill!;       
            elementPath.style.borderColor = this.hoverBorder!;
        }



        this.notifyOutputChanged() ;

	}     

    public handleMouseLeave(event: Event) {

        this.selectedID = "";

        this._value = "non";
        this._targetID = "";
        let elementPath = (event.currentTarget as HTMLDivElement);

        if(this.useSvg){
            elementPath.style.fill = this.fill!;
            elementPath.style.stroke = this.border!;
        } else {
            elementPath.style.background = this.fill!;       
            elementPath.style.borderColor = this.border!;
        }

        this.notifyOutputChanged() ;
        
    }

    public handleMouseClick(event: Event) {

        this._value = "click";
        let elementPath = (event.currentTarget as HTMLDivElement)
        this._targetID = (event.currentTarget as HTMLDivElement).getAttribute("id")!;

        this.selectedID = this._targetID;

        if(this.useSvg){
            elementPath.style.fill = this.clickFill!;
            elementPath.style.stroke = this.clickBorder!;
        } else {
            elementPath.style.background = this.clickFill!;       
            elementPath.style.borderColor = this.clickBorder!;
        }
        console.log("selected ID " +this._targetID);

        this.notifyOutputChanged() ;
	}  


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void //
    {
        var newUseSvg: boolean;
        // Add code to update control view
        this.the_container.style.position = 'relative';

        this.the_container.style.height  = context.mode.allocatedHeight.toString() + "px";
        this.the_container.style.width  = context.mode.allocatedWidth.toString() + "px";


        if(context.parameters.fillColor.raw)
        this.fill = context.parameters.fillColor.raw;
        else
        this.fill = "yellow";

        if(context.parameters.borderColor.raw)
        this.border = context.parameters.borderColor.raw;
        else
        this.border = "black";        

        if(context.parameters.hoverFill.raw)
        this.hoverFill = context.parameters.hoverFill.raw;
        else
        this.hoverFill = "green";

        if(context.parameters.hoverBorder.raw)
        this.hoverBorder = context.parameters.hoverBorder.raw;
        else
        this.hoverBorder = "grey";

        if(context.parameters.clickFill.raw)
        this.clickFill = context.parameters.clickFill.raw;
        else
        this.clickFill = "brown";

        if(context.parameters.clickBorder.raw)
        this.clickBorder = context.parameters.clickBorder.raw;
        else
        this.clickBorder = "brown";
       // this.the_container.style.background = '#FF0000';
    
         // Add code to update control view
         this.context = context;
 
        newUseSvg =  (context.parameters.svg.raw!.length >0) && (context.parameters.svg.raw!="val");

         

         // Set SVG content
         if(newUseSvg){
                    this.the_container.style.borderStyle = "none";
                    // Add code to cleanup control if necessary
                    this.the_container.removeEventListener('mouseenter', this._handleMouseStart); 
                    this.the_container.removeEventListener('mouseleave', this._handleMouseLeave); 
                    this.the_container.removeEventListener('mousedown', this._handleMouseClick); 


                    this.the_container.style.background = "rgba(0,0,0,0)";
                    this.the_container.style.borderColor = "rgba(0,0,0,0)";

                    this.the_container.style.cursor ="default";

                    if(this.context.parameters.svg.raw!.toString() !== this.the_container.innerHTML){
                        this.the_container.innerHTML = this.context.parameters.svg.raw!.toString();
                        this.initSVG()
                    }
                    
                    this.useSvg = newUseSvg;
  

         }             
         else
         {
            this.the_container.style.borderStyle = "solid";
            this.the_container.innerHTML = "";
            this.the_container.style.cursor ="pointer";

            //if we switch from svg, paint the container
            if(this.useSvg !== newUseSvg){
                this.the_container.style.background = this.fill;
                this.the_container.style.borderColor = this.border;
            }

            this.useSvg = newUseSvg;

            this.the_container.addEventListener('mousedown', this._handleMouseClick); 
            this.the_container.addEventListener('mouseenter', this._handleMouseStart); 
            this.the_container.addEventListener('mouseleave', this._handleMouseLeave); 
         }

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            ActionName: this._value,
            TargetID: this._targetID
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        this.the_container.removeEventListener('mouseenter', this._handleMouseStart); 
        this.the_container.removeEventListener('mouseleave', this._handleMouseLeave); 
        this.the_container.removeEventListener('mousedown', this._handleMouseClick); 
    }

     // Initialize SVG 
     // Need the viewbox properties to facilitate zoom functionality
     private initSVG():void 
     {
 
         let _svgElement = this.the_container.querySelector("svg");
         if(_svgElement != null)
         {
             // The main SVG object
             this.svg = _svgElement as SVGGraphicsElement;

            // Find referenced SVG elements
            var svgObjCollection = this.svg.getElementsByClassName('selectableObject');

            // Set fill color of found SVG elements
            for (let i = 0; i < svgObjCollection.length; i++) {
                let svgObj = <SVGElement>svgObjCollection[i];
                if(svgObj != null){
                    

                            svgObj.style.fill = this.fill;
                            svgObj.style.stroke = this.border;
    
                    // Add onclick event to SVG element
                    svgObj.addEventListener("mousedown", this._handleMouseClick);
                    svgObj.addEventListener("mouseenter", this._handleMouseStart);
                    svgObj.addEventListener("mouseleave", this._handleMouseLeave);
    
                }
            }	
 
         }
     }
}
