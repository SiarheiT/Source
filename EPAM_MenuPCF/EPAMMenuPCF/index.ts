
import {IInputs, IOutputs} from "./generated/ManifestTypes";

//declare const window: any;

export class EPAMMenuPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private my_container: HTMLDivElement;
    private the_container: HTMLDivElement;

    private script: HTMLScriptElement;
    private script_src: string;
    private AppName: string;
    private my_button: HTMLImageElement;

    private AccessIssues: string;
    private IsProductionMenu: boolean;
                                      
    private prefix_staging: string = "https://globalmenu-stage.epm-ppa.projects.epam.com/scripts/";
    private prefix_production: string = "https://menu.epam.com/scripts/";

   // private IsBossControl: boolean;

    private scriptID = "EPAM_global_menu_script_PCF";



    private notifyOutputChanged: () => void;
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
        //this.component_container = container;

        context.mode.trackContainerResize(true);
        
        this.notifyOutputChanged = notifyOutputChanged;


        this.my_container = document.createElement("div");
        this.the_container = container;
        
        this.my_container.style.transformOrigin = "top left";
        
        this.my_container.setAttribute("id", "global_menu_toggle");

        this.script_src = this.setScriptSrc(context);
        this.setScript(false);

        //this.AccessIssues = "Loading EPAM Menu...";


        this.my_button = document.createElement("img");
    
         this.my_button.src = "https://menu.epam.com/content/images/menu_button.svg";
         this.my_button.onerror = () => {document.getElementById("global_menu_toggle")!.style.display = "none";};

         this.my_container.style.transformOrigin="left top";

        this.my_button.title = this.AccessIssues;

         //this.my_container.style.transformOrigin = "left top";

         this.my_container.appendChild(this.my_button);

		container.appendChild(this.my_container);
        



    }

    private setScript(reset: boolean){

        var script: HTMLScriptElement;

        script = <HTMLScriptElement>document.getElementById(this.scriptID);

        if (script && !reset){
            this.script = script
           // this.IsBossControl = false;
        } 
        else 
        {
            //boss loads appropriate font
            //https://github.com/Eickhel/PowerApps-samples/blob/master/PowerFont/PCF/Code/PowerFontPCF/index.ts 
            var link = <HTMLLinkElement> document.querySelector("link#PowerFontUrl");

            if(link == null){
                link = document.createElement("link");
                link.id = "PowerFontUrl";
                link.rel = "stylesheet";
                link.href = `https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap`;
            
                document.getElementsByTagName("head")[0].appendChild(link);
            }

            //boss creates the menu script
            //this.IsBossControl = true;
            if(reset && (script != null)){
                    //reset menu settings
                    window.EpamServices = {};

                    var f =<HTMLIFrameElement> document.querySelector("iframe.GlobalMenuFrame");
                    if(f != null){
                        f.remove()
                    }
                    script.remove();
    
                    var  s = document.head.querySelectorAll(`script[src^="${this.prefix_staging}"]`)
                    for (let i = 0; i < s.length; i++) {
                        let st = <HTMLScriptElement> s[i];
                        
                        if((st != null) && (st.id != this.scriptID)){ 
                           // console.log(`script ${st.src}`)
                            document.head.removeChild(st)
                            //st.remove()
                        }
                    }
                        s = document.head.querySelectorAll(`script[src^="${this.prefix_production}"]`)
                    for (let i = 0; i < s.length; i++) {
                        let st = <HTMLScriptElement> s[i];
                        
                        if((st != null) && (st.id != this.scriptID)){ 
                           // console.log(`script ${st.src}`)
                            document.head.removeChild(st)
                            //st.remove()
                        }
                    }
                }

            }
                this.script = document.createElement("script");
                this.script.async = true;
                this.script.crossOrigin="use-credentials";
                this.script.setAttribute("id", this.scriptID);
                this.script.src = this.script_src;

                document.head.appendChild(this.script);
            
        
        this.checkAccess(this.script.src);
    }

    public setScriptSrc(context: ComponentFramework.Context<IInputs>): string
    {
        

        if(context.parameters.AppName.raw){
            this.AppName = "?app=" + context.parameters.AppName.raw
            if(context.parameters.IsNoauth.raw && (context.parameters.IsNoauth.raw == 1)){
                this.AppName = this.AppName + "&noauth=true"
            }
            else {
                this.AppName = this.AppName + "&noauth=false"
            }
        }
        else {
            this.AppName =  ""
        }

        var newsrc: string
        
        if(context.parameters.IsProduction.raw && (context.parameters.IsProduction.raw == 1)){
            newsrc = this.prefix_production + "menu.js" + this.AppName
            this.IsProductionMenu = true;
        }
        else {
            newsrc =  this.prefix_staging + "menu.js" + this.AppName
            this.IsProductionMenu = false;
        }

        return newsrc
        
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {

        var scale: number = context.mode.allocatedWidth/60;

        this.the_container.style.height = context.mode.allocatedWidth +"px";
        this.the_container.style.width = context.mode.allocatedWidth +"px";

        if (scale>0){
            this.my_container.style.transform="scale("+ scale.toFixed(5)+")";
            //this.the_container.style.transform="scale("+ scale.toFixed(2)+")";
           // this.my_container.style.width = context.mode.allocatedWidth +"px";
           // this.my_container.style.height = context.mode.allocatedWidth +"px";
        }

        var newsrc =this.setScriptSrc(context);


        if(newsrc != this.script.src){
            this.script_src = newsrc;
            this.setScript(true);
        }
        
        if(context.parameters.BackColor.raw){
            this.the_container.style.backgroundColor = context.parameters.BackColor.raw
        } else {
            this.the_container.style.backgroundColor = "#464547"
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            AccessIssues: this.AccessIssues
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
    private async  checkAccess(url: string) {
        try {
          // ⛔️ TypeError: Failed to fetch
          // 👇️ incorrect or incomplete URL, CORS error
          const response = await fetch(url);
      
          if (response.status != 200) {
            this.AccessIssues = "EPAM Menu loading issues. " + response.statusText;
          
            this.my_button.title = this.AccessIssues;
          } else {
            this.AccessIssues = "";
            this.my_button.title = "EPAM Menu" + (this.IsProductionMenu ? "" : " (dev)");
 
          }

          this.notifyOutputChanged() ;
       
        } catch (err) {
          this.AccessIssues = "EPAM Menu is not available to you now. " +(<Error>err).toString();
          this.my_button.title = this.AccessIssues;
          this.notifyOutputChanged() ;
          
        }
      }



}
