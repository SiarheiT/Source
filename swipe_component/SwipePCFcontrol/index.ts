import {IInputs, IOutputs} from "./generated/ManifestTypes";

enum direction {
	Up = "Up",
	Down = "Down",
	Left = "Left",
	Right = "Right"
}

export class SwipePCFcontrol implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // The PCF context object\
    private context: ComponentFramework.Context<IInputs>;
    // The wrapper div element for the component\
    private container: HTMLDivElement;
    // The callback function to call whenever your code has made a change to a bound or output property\
    private notifyOutputChanged: () => void;


    private xDown : number | null;
	private yDown : number | null;
	private touchDirection : string | null;
	private swipeDistance : number | null;
	private startX : number | null;
	private startY : number | null;

	private finishX : number | null;
	private finishY : number | null;

    private SwipeSource: string;

	private windowHeight : number;
	private windowWidth : number;

	private windowX : number;
	private windowY : number;

	private detectionPixelDistance : number;
	private startFromEdge : boolean;

    private minDistance: number;

    private isRelatedToControl: boolean = false; 

     //eventHandles to catch events
	private _handleTouchStart : EventListenerOrEventListenerObject;
	private _handleTouchEnd : EventListenerOrEventListenerObject;

    private _handleMouseDown : EventListenerOrEventListenerObject;
    private _handleMouseUp : EventListenerOrEventListenerObject;

    //eventHandler to catch events
    private swipeHandler: EventListener;


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
        this.context = context;
        this.container = container;        
        this.notifyOutputChanged = notifyOutputChanged;

        this._handleTouchStart = this.handleTouchStart.bind(this);
		this._handleTouchEnd = this.handleTouchEnd.bind(this);

        this._handleMouseDown = this.handleMouseDown.bind(this);
		this._handleMouseUp = this.handleMouseUp.bind(this);

        context.mode.trackContainerResize(true);

        this.windowX = window.screenX;
        this.windowY = window.screenY;

        this.SwipeSource = "";

        this.windowHeight = window.innerHeight;
		this.windowWidth = window.innerWidth;
		this.detectionPixelDistance = 200;

        if(context.parameters.minSwipeDistance.raw)
            this.minDistance = + context.parameters.minSwipeDistance.raw
        else
            this.minDistance = 100;
        ;

        window.addEventListener('touchstart', this._handleTouchStart);        
		window.addEventListener('touchend', this._handleTouchEnd);

        window.addEventListener('mousedown', this._handleMouseDown);        
		window.addEventListener('mouseup', this._handleMouseUp);

    }


	private handleTouchStart(event: Event) {

		var te = <TouchEvent>event;

		var firstTouch = te.touches[0];
		this.xDown = firstTouch.clientX;                                      
		this.yDown = firstTouch.clientY;     
		
		this.startX = this.xDown;
		this.startY = this.yDown;

	}                                  

    private handleMouseDown(event: Event) {

		var te = <MouseEvent>event;

		this.xDown = te.clientX;                                      
		this.yDown = te.clientY;     
		
		this.startX = this.xDown;
		this.startY = this.yDown;

	}

	private handleTouchEnd(evt: Event): void{
		if ( ! this.xDown || ! this.yDown ) {
			return;
		}

		var te = <TouchEvent>evt;
	
        this.finishX = te.changedTouches[0].clientX;                                  
        this.finishY = te.changedTouches[0].clientY;
    
        var xDiff = this.xDown - this.finishX;
        var yDiff = this.yDown - this.finishY;
	
		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/

			this.swipeDistance = Math.abs(xDiff);
			if ( xDiff > 0 ) {
				/* left swipe */ 			   
			   this.touchDirection = direction.Left;
			} else {
				/* right swipe */				
				this.touchDirection = direction.Right;
			}                       
		} else {

			this.swipeDistance = Math.abs(yDiff);
			
			if ( yDiff > 0 ) {
				/* up swipe */
				this.touchDirection = direction.Up;
			} else { 
				/* down swipe */
				this.touchDirection = direction.Down;
			}                                                                 
		}

		//this.consoleOut();       
        if(this.swipeDistance >= this.minDistance){

            this.SwipeSource = "touch";
            this.notifyOutputChanged()
        };

		/* reset values */
		this.xDown = null;
		this.yDown = null;       
		this.swipeDistance = null;
		                               
   }

   private handleMouseUp(evt: Event): void{
    if ( ! this.xDown || ! this.yDown ) {
        return;
    }

    var te = <MouseEvent>evt;

    this.finishX = te.clientX;                                    
    this.finishY = te.clientY;

    var xDiff = this.xDown - this.finishX;
    var yDiff = this.yDown - this.finishY;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/

        this.swipeDistance = Math.abs(xDiff);
        if ( xDiff > 0 ) {
            /* left swipe */ 			   
           this.touchDirection = direction.Left;
        } else {
            /* right swipe */				
            this.touchDirection = direction.Right;
        }                       
    } else {

        this.swipeDistance = Math.abs(yDiff);
        
        if ( yDiff > 0 ) {
            /* up swipe */
            this.touchDirection = direction.Up;
        } else { 
            /* down swipe */
            this.touchDirection = direction.Down;
        }                                                                 
    }



    //this.consoleOut();       
    if(this.swipeDistance >= this.minDistance){

        this.SwipeSource = "mouse";
        this.notifyOutputChanged()
    };

    /* reset values */
    this.isRelatedToControl = false;
    this.xDown = null;
    this.yDown = null;       
    this.swipeDistance = null;
                                   
}


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        this.startFromEdge = context.parameters.startFromEdge.raw;		
		this.windowHeight = window.innerHeight;
		this.windowWidth = window.innerWidth;

        if(context.parameters.minSwipeDistance.raw)
        this.minDistance = + context.parameters.minSwipeDistance.raw;

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
     public getOutputs(): IOutputs
     {
         var outDownSwipe : boolean = false;
         var outUpSwipe : boolean = false;
         var outLeftSwipe : boolean = false;
         var outRightSwipe : boolean = false;

         var outDebugString: string = "";
 
         if (this.startY && this.startX){
             if (this.startFromEdge){
                 
                 switch ( this.touchDirection ){
                     case direction.Down : 
                         if( this.startY < this.detectionPixelDistance ){ outDownSwipe = true; } break;
                     case direction.Up : 
                         if( this.startY > (this.windowHeight - this.detectionPixelDistance) ){ outUpSwipe = true; } break;
                     case direction.Right :
                         if( this.startX < this.detectionPixelDistance ){ outRightSwipe = true; } break;
                     case direction.Left :
                         if( this.startX > (this.windowWidth - this.detectionPixelDistance) ){ outLeftSwipe = true; } break;
                     default:
                         break;
 
                 }
                 
             }else{
             
                 switch ( this.touchDirection ){
                     case direction.Down : 
                         outDownSwipe = true;  break;
                     case direction.Up : 
                         outUpSwipe = true; break;
                     case direction.Right :
                         outRightSwipe = true;  break;
                     case direction.Left :
                         outLeftSwipe = true; break;
                     default:
                         break;
 
                 }
             }



         }
         /*
         console.log(this.windowWidth);
         console.log("start x " + this.startX);
 */
         return {			
             downSwipe: outDownSwipe,
             upSwipe: outUpSwipe,
             leftSwipe: outLeftSwipe,
             rightSwipe: outRightSwipe,

            startX: this.startX ? this.startX: undefined,
            startY: this.startY ? this.startY: undefined,
            finishX: this.finishX? this.finishX: undefined,
            finishY: this.finishY? this.finishY: undefined,

            windowHeight: this.windowHeight,
            windowWidth: this.windowWidth,

            SwipeSource: this.SwipeSource
             //, debugInfo: outDebugString
            }
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
        window.removeEventListener('touchstart', this._handleTouchStart);        
		window.removeEventListener('touchend', this._handleTouchEnd);

        window.removeEventListener('mousedown', this._handleMouseDown);        
		window.removeEventListener('mouseup', this._handleMouseUp);

    }
}
