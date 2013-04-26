var Tell = {
    
    containers    : {},

    args          : {},

    default_args  : {
        confirm    : false,
        verify     : false,
        input      : false,
        animate    : false,
        textOk     : "Ok",
        textCancel : "Cancel",
        textYes    : "Yes",
        textNo     : "No",
        position   : "center"
    },

    userInput : null,

    callback : null,

    init : function(_string, _args, _callback){
        "use strict";
      
        if("function" === typeof _callback){
            Tell.callback = _callback;
        }

        Tell.setupArgs(_args);
        Tell.setupContainers();
        Tell.addContents(_string);
        Tell.addInputFields();
        Tell.addButtons();
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
<<<<<<< HEAD
        Tell.containers.aHeight = $(window).height();
        Tell.containers.aWidth  = $(window).width(),
        Tell.containers.tell    = $('<div class="tellOuter modal"></div>'),
        Tell.containers.overlay = $('<div class="tellOverlay" id="aOverlay"></div>'),
        Tell.containers.inner   = $('<div class="tellInner modal-body"></div>'),
        Tell.containers.buttons = $('<div class="aButtons"></div>'),
=======
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

>>>>>>> gh-pages
        Tell.containers.posTop  = 100;
    },

    showOverlay : function(){
        "use strict";
<<<<<<< HEAD
        Tell.containers.overlay.css({
            height : Tell.containers.aHeight,
            width  : Tell.containers.aWidth
        })
            .appendTo("body")
            .fadeIn(100, function () {
                $(this).css("filter", "alpha(opacity=70)");
            });
=======

        Tell.containers.overlay.style.height = Tell.containers.aHeight + "px";
        Tell.containers.overlay.style.width  = Tell.containers.aWidth  + "px";

        document.body.appendChild(Tell.containers.overlay);
        //lazy init of jquery object...
        Tell.containers.jqOverlay = $(Tell.containers.overlay);
        Tell.containers.jqOverlay
            .fadeIn(100, function () {
                $(this).css("filter", "alpha(opacity=70)");
         });
>>>>>>> gh-pages
    },

    addContents : function(_string){
        "use strict";
<<<<<<< HEAD
        Tell.containers.inner
             .append(_string)
             .appendTo(Tell.containers.tell);
=======
        //if escape innerHTML else append text node...

        Tell.containers.inner.innerHTML = _string;
        Tell.containers.tell.appendChild(Tell.containers.inner);
>>>>>>> gh-pages
    },

    /** @todo convert to document.creaeteElement (faster...) **/
    addInputFields : function(){
        "use strict";
<<<<<<< HEAD
        var innerContents = '';

        if (Tell.args.input === true || typeof (Tell.args.input) === 'string') {
            innerContents  = '<div class="aInput">';
            innerContents += '<input type="text" class="aTextbox" t="aTextbox" value="' + (typeof Tell.args.input === "string" ? Tell.args.input : "") + '" />';
            innerContents += '</div>';

        } else if (typeof (Tell.args.input) === 'object') {
            innerContents = $('<div class="aInput"></div>').append(Tell.args.input);
        } 
        
        Tell.containers.inner.append(innerContents);

        $('.aTextbox').focus();
=======

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
       

>>>>>>> gh-pages
    },

    /** @todo convert to document.creaeteElement (faster...) **/
    addButtons : function(){
        "use strict";

<<<<<<< HEAD
        //setup buttonContents
        var buttonContents = '<button class="btn" value="ok">Ok</button>';
        
        if (Tell.args.confirm || Tell.args.input) {
            buttonContents   = '<button class="btn-primary btn" value="ok">'     + Tell.args.textOk     + '</button>';
            buttonContents  += '<button class="btn" value="cancel">' + Tell.args.textCancel + '</button>';
        } else if (Tell.args.verify) { 
            buttonContents   = '<button class="btn-primary btn" value="ok">'     + Tell.args.textYes    + '</button>';
            buttonContents  += '<button class="btn" value="cancel">' + Tell.args.textNo     + '</button>';
        } else {
            buttonContents   = '<button class="btn btn-primary" value="ok">'     + Tell.args.textOk     + '</button>';
        }
        
        //add buttonContents to button
        Tell.containers.buttons.append(buttonContents);

        //add buttons to inner
        Tell.containers.inner.append(Tell.containers.buttons);
=======
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
>>>>>>> gh-pages
    },

    getLeftPos : function(){
        "use strict";
        return ($(window).width() - $('.tellOuter').width()) / 2 + $(window).scrollLeft() + "px";
    },

    showModal : function(){
        "use strict";

<<<<<<< HEAD

        Tell.containers.tell.appendTo('body');
        var leftPos = Tell.getLeftPos();

        Tell.containers.tell.css("left", leftPos);
            
        if (Tell.args.position && Tell.args.position === 'center') {
            Tell.containers.posTop = (Tell.containers.aHeight - Tell.containers.tell.height()) / 2;
=======
        document.body.appendChild(Tell.containers.tell);


        var leftPos = Tell.getLeftPos();

        Tell.containers.tell.style.left = leftPos;
            
        if (Tell.args.position && Tell.args.position === 'center') {

            Tell.containers.tell.style.top =  '-200px';
            Tell.containers.tell.style.display = "block";

            Tell.containers.posTop = (Tell.containers.aHeight - Tell.containers.tell.clientHeight) / 2;

>>>>>>> gh-pages
        }

        if (Tell.args.animate) {
            var aniSpeed = Tell.args.animate;
            if (isNaN(aniSpeed)) {
              aniSpeed = 400;
            }
          
<<<<<<< HEAD
            Tell.containers.tell.css('top', '-200px').show().animate({ top: Tell.containers.posTop }, aniSpeed);
        }
        else { Tell.containers.tell.css('top', Tell.containers.posTop).fadeIn(200); }

=======

            $(Tell.containers.tell).animate2({ top: Tell.containers.posTop }, aniSpeed);
        }
        else { 
                Tell.containers.tell.style.top =  Tell.containers.posTop + "px";
                $(Tell.containers.tell).fadeIn(200); 
        }
>>>>>>> gh-pages
            
    },


    addHandlers : function(){
        "use strict";

        // triggers a ok click on enter and an cancel on escape
        $(document).keydown(function (e) {
<<<<<<< HEAD
            if (Tell.containers.overlay.is(':visible')) {
=======
            if (Tell.containers.jqOverlay.is(':visible')) {
>>>>>>> gh-pages
                if (e.keyCode === 13) { //enter key
                    $('.aButtons > button[value="ok"]').click(); 
                } else if (e.keyCode === 27) { //escape key
                    $('.aButtons > button[value="cancel"]').click(); 
                }
            }
        });


        //change the value of user input on keyup of the textbox
        $('.aTextbox').keyup(function (){ 
            Tell.userInput = $(this).val(); 
        });


        //attach click handler to clicking on buttons
        $('.aButtons > button').click(function () {
<<<<<<< HEAD
            Tell.containers.overlay.remove();
            Tell.containers.tell.remove();
=======
            document.body.removeChild(Tell.containers.overlay);
            document.body.removeChild(Tell.containers.tell);
>>>>>>> gh-pages

            var wButton = $(this).attr("value");

            if (wButton === 'ok') {
                if (Tell.args.input) {
                    Tell.callback(Tell.userInput);
                } else {
                    Tell.callback(true); 
                }
            } else if (wButton === 'cancel') {
                Tell.callback(false); 
            }
            
        });

    }

};

<<<<<<< HEAD
var tell = Tell.init;

=======
//use the animate2 plugin if avail...
if(typeof $.fn.animate2 === "undefined"){
   $.fn.animate2 = $.fn.animate;
}

window.tell = Tell.init;
>>>>>>> gh-pages
