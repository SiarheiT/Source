/* eslint-disable no-unused-vars */

import {IInputs, IOutputs} from "./generated/ManifestTypes"

export class MenuSwitch implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private initialState: boolean
    private currentState: boolean
    private notifyOutputChanged: () => void

    private _handleMouseClick : EventListenerOrEventListenerObject;
    private _handleMouseStart : EventListenerOrEventListenerObject;
    private _handleMouseLeave : EventListenerOrEventListenerObject;

    private container: HTMLDivElement;
    private the_icon: SVGSVGElement;
    private the_icon_back: SVGRectElement;

    private OnColor: string;
    private OffColor: string;
    private backColor: string;
    private hoverBackColor: string;

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
     * @param _state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, _state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        if((context.parameters.initialValue.raw !=null) && 
                (context.parameters.initialValue.raw == 1) ){
                this.initialState = true;
                this.currentState = true;
            } else {
                this.initialState = false;
                this.currentState = false;
            }
        


       this.the_icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
       this.the_icon.setAttribute('id', 'SVGMenuIcon');
       this.the_icon.setAttribute('fill', 'none');
       this.the_icon.setAttribute('width', '100%');
       this.the_icon.setAttribute('height', '100%');
       this.the_icon.setAttribute('version', '1.1');

       this.the_icon.setAttribute('viewBox', '0 0 50 50');
       this.container.title = this.currentState? "Click to hide screen menu": "Click to open screen menu";

       this.the_icon_back =document.createElementNS('http://www.w3.org/2000/svg', 'rect');
       this.the_icon_back.setAttribute('fill', 'none');
       this.the_icon_back.setAttribute('stroke', 'none');
       this.the_icon_back.setAttribute('width', '50');
       this.the_icon_back.setAttribute('height', '50');
       this.the_icon_back.setAttribute('x', '0');
       this.the_icon_back.setAttribute('y', '0');

       this.the_icon_back.setAttribute('class', 'background');

       this.the_icon.appendChild(this.the_icon_back);

        var iconPath: SVGPathElement;
        for(let k=0; k<4; k++){
            iconPath = document.createElementNS( 'http://www.w3.org/2000/svg', 'path');
            iconPath.setAttribute('d','M10 ' + (13+k*7) +' L 40 ' +(13+k*7));
              iconPath.setAttribute('stroke-linecap', 'round');
              iconPath.setAttribute('stroke-linejoin', 'round');
              iconPath.setAttribute('stroke-width', '3');
              iconPath.setAttribute('id', 'svgMenuPath' +k);
            
              this.the_icon .appendChild(iconPath);
        }

        this.container.appendChild(this.the_icon );

        this._handleMouseStart = this.handleMouseStart.bind(this);
        this._handleMouseLeave = this.handleMouseLeave.bind(this);
        this._handleMouseClick = this.handleMouseClick.bind(this);

        this.container.addEventListener('click', this._handleMouseClick); 
        this.container.addEventListener('mouseover', this._handleMouseStart); 
        this.container.addEventListener('mouseleave', this._handleMouseLeave); 
       
        this.updateView(context);

        this.notifyOutputChanged() ;
    }

    public handleMouseClick(_event: Event) {

        this.currentState = !this.currentState

       this.repaintPaths();

        this.notifyOutputChanged() ;
	}  
    public handleMouseStart(_event: Event) {

        this.the_icon_back.setAttribute('fill', this.hoverBackColor);
	}  
    public handleMouseLeave(_event: Event) {

        this.the_icon_back.setAttribute('fill', this.backColor);
	}  

    private repaintPaths() {

        var svgObjCollection = document.querySelectorAll('svg#SVGMenuIcon path');
        for (let i = 0; i < svgObjCollection.length; i++) {
            let svgObj = <SVGPathElement>svgObjCollection[i];
            if(svgObj != null){
                    svgObj.setAttribute('stroke', this.currentState? this.OnColor: this.OffColor);
            }
        }
	}  
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    // eslint-disable-next-line no-unused-vars
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
                if(context.parameters.initialValue.raw != null){
                    
                    if(((context.parameters.initialValue.raw == 1) && !this.initialState)
                        || ((context.parameters.initialValue.raw == 0) && this.initialState)){
                            //need update
                            if(context.parameters.initialValue.raw == 1){
                                this.initialState = true;
                                this.currentState = true;
                            } else {
                                this.initialState = false;
                                this.currentState = false;                             
                            }
  
                    }
                } //working with new initial value

                //off color
                if(context.parameters.OffColor.raw){
                    this.OffColor = context.parameters.OffColor.raw;
                } else {
                    this.OffColor = "rgba(0,0,0,0)";
                }
                //back color
                if(context.parameters.backColor.raw){
                    this.backColor = context.parameters.backColor.raw;
                } else {
                    this.backColor = "rgba(0,0,0,0)";
                }
                 //hover back color
                 if(context.parameters.hoverBackColor.raw){
                    this.hoverBackColor = context.parameters.hoverBackColor.raw;
                } else {
                    this.hoverBackColor = "rgba(0,0,0,0)";
                }
                //on color
                if(context.parameters.OnColor.raw){
                    this.OnColor = context.parameters.OnColor.raw;
                } else {
                    this.OffColor = "green";
                }

                this.the_icon_back.setAttribute('fill', this.backColor);

                this.container.title = this.currentState? "Click to hide screen menu": "Click to open screen menu";

                this.repaintPaths();

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            Value: this.currentState ? 1:0
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        this.container.removeEventListener('click', this._handleMouseClick); 
        this.container.removeEventListener('mouseover', this._handleMouseStart); 
        this.container.removeEventListener('mouseleave', this._handleMouseLeave); 
    }
}
