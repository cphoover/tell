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
        Tell.containers.aHeight = $(window).height();
        Tell.containers.aWidth  = $(window).width(),
        Tell.containers.tell    = $('<div class="tellOuter modal"></div>'),
        Tell.containers.overlay = $('<div class="tellOverlay" id="aOverlay"></div>'),
        Tell.containers.inner   = $('<div class="tellInner modal-body"></div>'),
        Tell.containers.buttons = $('<div class="aButtons"></div>'),
        Tell.containers.posTop  = 100;
    },

    showOverlay : function(){
        "use strict";
        Tell.containers.overlay.css({
            height : Tell.containers.aHeight,
            width  : Tell.containers.aWidth
        })
            .appendTo("body")
            .fadeIn(100, function () {
                $(this).css("filter", "alpha(opacity=70)");
            });
    },

    addContents : function(_string){
        "use strict";
        Tell.containers.inner
             .append(_string)
             .appendTo(Tell.containers.tell);
    },

    /** @todo convert to document.creaeteElement (faster...) **/
    addInputFields : function(){
        "use strict";
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
    },

    /** @todo convert to document.creaeteElement (faster...) **/
    addButtons : function(){
        "use strict";

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
    },

    getLeftPos : function(){
        "use strict";
        return ($(window).width() - $('.tellOuter').width()) / 2 + $(window).scrollLeft() + "px";
    },

    showModal : function(){
        "use strict";


        Tell.containers.tell.appendTo('body');
        var leftPos = Tell.getLeftPos();

        Tell.containers.tell.css("left", leftPos);
            
        if (Tell.args.position && Tell.args.position === 'center') {
            Tell.containers.posTop = (Tell.containers.aHeight - Tell.containers.tell.height()) / 2;
        }

        if (Tell.args.animate) {
            var aniSpeed = Tell.args.animate;
            if (isNaN(aniSpeed)) {
              aniSpeed = 400;
            }
          
            Tell.containers.tell.css('top', '-200px').show().animate({ top: Tell.containers.posTop }, aniSpeed);
        }
        else { Tell.containers.tell.css('top', Tell.containers.posTop).fadeIn(200); }

            
    },


    addHandlers : function(){
        "use strict";

        // triggers a ok click on enter and an cancel on escape
        $(document).keydown(function (e) {
            if (Tell.containers.overlay.is(':visible')) {
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
            Tell.containers.overlay.remove();
            Tell.containers.tell.remove();

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

var tell = Tell.init;

