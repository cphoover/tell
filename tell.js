var Tell = {
    
    containers    : {},

    args          : {},

    default_args  : {
        confirm     : false,
        verify      : false,
        input       : false,
        animate     : false,
        textOk      : "Ok",
        textCancel  : "Cancel",
        textYes     : "Yes",
        textNo      : "No",
        position    : "center",
        showButtons : true,
        keyClose    : true,
        onClose     : false,
        onOk        : false, 
        onCancel    : false
    },

    userInput : null,

    callback : false,

    init : function(_string, _args, _callback){
        "use strict";
      
        if("function" === typeof _callback){
            Tell.callback = _callback;
        }

        Tell.setupArgs(_args);
        Tell.setupContainers();
        Tell.addContents(_string);
        Tell.addInputFields();
        //if showButtons is true;
        if(Tell.args.showButtons){
            Tell.addButtons();
        }
        Tell.showOverlay();
        Tell.showModal();
        Tell.addHandlers();

    },

    setupArgs : function(_args){
        "use strict"; 
        Tell.args = $.fn.extend({}, Tell.default_args, _args);
    },

    /** @todo convert to document.creaeteElement (faster...) **/
    setupContainers : function(){
        "use strict";
        Tell.containers.aHeight           = $(window).height(),
        Tell.containers.aWidth            = $(window).width(),
        /** tell elements **/
        Tell.containers.tell              = document.createElement('div'),
        Tell.containers.jqTell            = null,
        Tell.containers.overlay           = document.createElement('div'),
        Tell.containers.jqOverlay         = null,
        Tell.containers.inner             = document.createElement('div'),
        Tell.containers.buttons           = document.createElement('div'),
    
        /** tell classes **/
        Tell.containers.tell.className    = "tellOuter modal",
        Tell.containers.overlay.className = "tellOverlay",
        Tell.containers.inner.className   = "tellInner modal-body",
        Tell.containers.buttons.className = "aButtons";

        Tell.containers.posTop  = 100;
    },

    showOverlay : function(){
        "use strict";

        Tell.containers.overlay.style.height = Tell.containers.aHeight + "px";
        Tell.containers.overlay.style.width  = Tell.containers.aWidth  + "px";

        document.body.appendChild(Tell.containers.overlay);
        //lazy init of jquery object...
        Tell.containers.jqOverlay = $(Tell.containers.overlay);

        setTimeout(function(){
            Tell.containers.jqOverlay.animate2({opacity:1}, function () {
                  $(this).css("filter", "alpha(opacity=70)");
            }, 50); 
        },0);

    },

    addContents : function(_string){
        "use strict";
        //if escape innerHTML else append text node...

        Tell.containers.inner.innerHTML = _string;
        Tell.containers.tell.appendChild(Tell.containers.inner);
    },

    /** @todo convert to document.creaeteElement (faster...) **/
    addInputFields : function(){
        "use strict";

        if(Tell.args.input){
            /** input container **/
            var inputContainer       = document.createElement('div');
            inputContainer.className = "aInput";

            if (Tell.args.input === true || typeof (Tell.args.input) === 'string') {
                /** input field **/
                var inputField         = document.createElement('input');
                inputField.className   =  "aTextbox";
                inputField.type        = "text";
                inputField.value       = (typeof Tell.args.input === "string" ? Tell.args.input : "");

                inputContainer.appendChild(inputField);

            } else if (typeof (Tell.args.input) === 'object') {
                inputContainer.appendChild(Tell.args.input);
            } 

            Tell.containers.inner.appendChild(inputContainer);
            $('.aTextbox').focus();
        }
       

    },

    /** @todo convert to document.creaeteElement (faster...) **/
    addButtons : function(){
        "use strict";

        var buttonFragment = document.createDocumentFragment();
     
        var okText = Tell.args.textOk;

        var cancelButton = null;
        if (Tell.args.confirm || Tell.args.input || Tell.args.verify) {
    
            var cancelText = Tell.args.textCancel;
            cancelButton = document.createElement('button');

            cancelButton.className = "btn";
            cancelButton.value = "cancel";

            if(Tell.args.verify) {
               okText = Tell.args.textYes;
               cancelText = Tell.args.textNo;
            }

               cancelButton.appendChild(document.createTextNode(cancelText));
        }

        //create the ok button
        var okButton = document.createElement('button');
        okButton.className = "btn btn-primary";
        okButton.value = "ok";
        okButton.appendChild(document.createTextNode(okText));


        //add the buttons to the fragment
        buttonFragment.appendChild(okButton);

        if(null !== cancelButton) {
            buttonFragment.appendChild(cancelButton);
        }
        
        //add buttonContents to button
        Tell.containers.buttons.appendChild(buttonFragment);

        //add buttons to inner
        Tell.containers.inner.appendChild(Tell.containers.buttons);
    },

    getLeftPos : function(){
        "use strict";
        return ($(window).width() - $('.tellOuter').width()) / 2 + $(window).scrollLeft() + "px";
    },

    showModal : function(){
        "use strict";

        document.body.appendChild(Tell.containers.tell);


        var leftPos = Tell.getLeftPos();

        Tell.containers.tell.style.left = leftPos;
            
        if (Tell.args.position && Tell.args.position === 'center') {

            Tell.containers.tell.style.top =  '-200px';
            Tell.containers.tell.style.display = "block";

            Tell.containers.posTop = (Tell.containers.aHeight - Tell.containers.tell.clientHeight) / 2;

        }

        if (Tell.args.animate) {
            var aniSpeed = Tell.args.animate;
            if (isNaN(aniSpeed)) {
              aniSpeed = 400;
            }
          

            $(Tell.containers.tell).animate2({ top: Tell.containers.posTop }, aniSpeed);
        }
        else { 
                Tell.containers.tell.style.top =  Tell.containers.posTop + "px";
                $(Tell.containers.tell).fadeIn(200); 
        }
            
    },

    ok : function(){
        "use strict";
        if ("function"  === typeof Tell.args.onOk){
            Tell.args.onOk();
        }
        if (Tell.args.input) {
            Tell.close();
            if("function" === typeof Tell.callback){
                Tell.callback(Tell.userInput);
            }
        } else {
            Tell.close();
            if("function" === typeof Tell.callback){
                Tell.callback(true);
            }
        }
    },

    cancel : function(){
        "use strict";
        if("function"  === typeof Tell.args.onCancel){
            Tell.args.onCancel();
        }
        Tell.close();
        if("function" === typeof Tell.callback){
            Tell.callback(false); 
        }
    },

    close : function(){
       "use strict";
       if("function"  === typeof Tell.args.onClose){
           Tell.args.onClose();
       }
       document.body.removeChild(Tell.containers.overlay);
       document.body.removeChild(Tell.containers.tell);
    },
    
    addHandlers : function(){
        "use strict";

        // triggers a ok click on enter and an cancel on escape
        //
        $(document).keydown(function (e) {
          if(!Tell.args.keyClose){
            return true; //return true so it still propogates
          }
          if (Tell.containers.jqOverlay.is(':visible')) {
              if (e.keyCode === 13) { //enter key
                  Tell.ok();
              } else if (e.keyCode === 27) { //escape key
                  Tell.cancel();
              }
          }
        });


        //change the value of user input on keyup of the textbox
        $('.aTextbox').keyup(function (){ 
            Tell.userInput = $(this).val(); 
        });


        //attach click handler to clicking on buttons
        $('.aButtons > button').click(function () {

            var wButton = $(this).attr("value");

            if (wButton === 'ok') {
                Tell.ok();
            } else if (wButton === 'cancel') {
                Tell.cancel();
            }
            
        });

    }

};

//use the animate2 plugin if avail...
if(typeof $.fn.animate2 === "undefined"){
   $.fn.animate2 = $.fn.animate;
}

window.tell = Tell.init;
