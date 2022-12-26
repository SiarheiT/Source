import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class TestPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

            // The PCF context object\
            private context: ComponentFramework.Context<IInputs>;
            // The wrapper div element for the component\
            private container: HTMLDivElement;
            // The callback function to call whenever your code has made a change to a bound or output property\
            private notifyOutputChanged: () => void;
            // Flag to track if the component is in edit mode or not\
            private isEditMode: boolean;
            // Tracks the event handler so we can destroy it when done\
            private buttonClickHandler: EventListener;
            // Tracking variable for the name property\
            private name: string | null;

            private message: HTMLSpanElement;

            private button: HTMLButtonElement;

            private textbox: HTMLInputElement;

            private messageContainer: HTMLDivElement;

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
     * 
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
            // Track all the things
            
            this.context = context;
            
            this.notifyOutputChanged = notifyOutputChanged;
            
            this.container = container;
            
            this.isEditMode = false;
            
            this.buttonClickHandler = this.buttonClick.bind(this);
            

            // Create the span element to hold the hello message

            this.message = document.createElement("span");

            this.message.innerText = `Hello ${this.isEditMode ? "" :context.parameters.Name.raw}`;

            // Create the textbox to edit the name

            this.textbox = document.createElement("input");

            this.textbox.type = "text";

            this.textbox.style.display = this.isEditMode ? "block" : "none";

            
                this.textbox.value = context.parameters.Name.raw ? context.parameters.Name.raw : "";

                // Wrap the two above elements in a div to box out the content
                
                this.messageContainer = document.createElement("div");
                
                this.messageContainer.appendChild(this.message);
                
                this.messageContainer.appendChild(this.textbox);

                // Create the button element to switch between edit and read modes

                this.button = document.createElement("button");

                this.button.textContent = this.isEditMode ? "Save" : "Edit";

                this.button.addEventListener("click", this.buttonClickHandler);

                

                // Add the message container and button to the overall control container

                this.container.appendChild(this.messageContainer);

                this.container.appendChild(this.button);

            
            

    }

    public buttonClick() {
        // Get our controls via DOM queries
    
        
        // If not in edit mode, copy the current name value to the textbox

 ///       if (textbox)  {
  //          if (message) {
  //             if (button) {

        if (!this.isEditMode) {

            this.textbox.value = this.name ?? "";
            
            } else if (this.textbox.value != this.name) {
            
            // if in edit mode, copy the textbox value to name and call the     notify callback
            
            this.name = this.textbox.value;
            
            this.notifyOutputChanged();
        }

        // flip the mode flag
        this.isEditMode = !this.isEditMode;

        // Set up the new output based on changes

        this.message.innerText = `Hello ${this.isEditMode ? "" : this.name} ${this.isEditMode}`;

        this.textbox.style.display = this.isEditMode ? "inline" : "none";

        this.textbox.value = this.name ?? "";

        this.button.textContent = this.isEditMode ? "Save" : "Edit";
 //   }
 //   }
 //   }
    }

 
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Checks for updates coming in from outside

        this.name = context.parameters.Name.raw;
        this.message.innerText = `Hello ${this.name}`;
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            // If our name variable is null, return undefined instead
            Name: this.name ?? undefined
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Remove the event listener we created in init
        this.container.querySelector("button")!.removeEventListener("click", this.buttonClickHandler);
    }
}
