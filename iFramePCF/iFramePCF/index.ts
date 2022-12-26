import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class iFramePCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private iFrameElement:HTMLIFrameElement;
    private my_container: HTMLDivElement;
    private script: HTMLScriptElement;

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
        // Add control initialization code
        context.mode.trackContainerResize(true);

		this.iFrameElement = document.createElement("iframe");
        this.my_container = document.createElement("div");
        
        //this.iFrameElement.setAttribute("sandbox", "allow-scripts");

        this.my_container.setAttribute("id", "iFrame_PCF_my-container");

        this.script = document.createElement("script");
        this.script.async = true;



/*
        this.iFrameElement.addEventListener("load", () => {
                             // Set all links with blank target
                            // Setup the config
                            let config = { attributes: false, childList: true, subtree: true }

                            // Create a callback
                            let callback = () => { //callback action
                                    var AnchorCollection = this.iFrameElement.getElementsByTagName("a");
                                    console.log("links found" + AnchorCollection.length);
                                    for (let i = 0; i < AnchorCollection.length; i++) {
                                    
                                        let anchorObj = <HTMLAnchorElement>AnchorCollection[i];
                                        if(anchorObj != null){
                                        anchorObj.target  = "_blank";
                                            
                                        }
                                    }
                            }

                            // Watch the iframe for changes
                            let observer = new MutationObserver(callback)
                            observer.observe(this.iFrameElement, config)

                            
          });
*/
		if( context.parameters.src.raw)
		{
		this.iFrameElement.src = context.parameters.src.raw
		}
		
        if( context.parameters.scriptSrc.raw)
		{
		this.script.src = context.parameters.scriptSrc.raw
		}

		//this.iFrameElement.frameBorder = "0";

        this.iFrameElement.style.position = "relative";
        this.iFrameElement.style.display = "inline-block";

        this.iFrameElement.style.margin ="0";

        this.iFrameElement.style.left ="0px";
        this.iFrameElement.style.top ="0px";
        this.iFrameElement.style.transformOrigin = "left top";




        this.my_container.style.display = "flex";
        //this.my_container.style.justifyContent = "center";

        this.my_container.appendChild(this.iFrameElement);

        this.my_container.appendChild(this.script);

		container.appendChild(this.my_container);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        var k: number;
        // Add code to update control view
        if( context.parameters.src.raw)
		{
		this.iFrameElement.src = context.parameters.src.raw
		}

        if( context.parameters.scriptSrc.raw)
		{
		this.script.src = context.parameters.scriptSrc.raw
		}

        if( context.parameters.scale.raw)
		{
            k = context.parameters.scale.raw
		} else {
            k=1
        }

        this.my_container.style.height  = context.mode.allocatedHeight.toString() + "px";
        this.my_container.style.width  = context.mode.allocatedWidth.toString() + "px";
        
        this.iFrameElement.width = (context.mode.allocatedWidth/k).toString() + "px";
        this.iFrameElement.height = (context.mode.allocatedHeight/k).toString() + "px";

        this.iFrameElement.style.transform = "scale("+k.toString()+")";
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
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
