document.addEventListener("deviceready", onDeviceReady, false);

   function onDeviceReady() {
    var pushNotification;
    pushNotification = window.plugins.pushNotification; 

    if (device.platform == 'android' || device.platform == 'Android') {
        pushNotification.register(successHandler, errorHandler,{"senderID":"590964323381","ecb":"onNotificationGCM"});
    } else {
        pushNotification.register(tokenHandler, errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
    }       

    $("#app-status-ul").append('<li>deviceready event received</li>');

    document.addEventListener("backbutton", function(e)
    {
        $("#app-status-ul").append('<li>backbutton event received</li>');

        if( $("#home").length > 0)
        {
            e.preventDefault();
            pushNotification.unregister(successHandler, errorHandler);
            navigator.app.exitApp();
        }
        else
        {
            navigator.app.backHistory();
        }
    }, false);

            // aditional onDeviceReady work…
        }

        // result contains any message sent from the plugin call
        function successHandler (result) {
           // alert('result = '+result);
            //$("#app-status-ul").append('<li>result = '+result+'</li>');
        }

        // result contains any error description text returned from the plugin call
        function errorHandler (error) {
           // alert('error = '+error);
            //$("#app-status-ul").append('<li>error = '+error+'</li>');
        }

        function tokenHandler (result) {
            // Your iOS push server needs to know the token before it can push to this device
            // here is where you might want to send it the token for later use.
           // alert('device token = '+result);
            //$("#app-status-ul").append('<li>device token = '+result+'</li>');
        }

        // iOS
        function onNotificationAPN(event) {
            if (event.alert) {
               // navigator.notification.alert(event.alert);
            }

            if (event.sound) {
                var snd = new Media(event.sound);
                snd.play();
            }

            if (event.badge) {
                pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
            }
        }


        // Android
        function onNotificationGCM(e) {
            $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

            switch( e.event )
            {
                case 'registered':
                if ( e.regid.length > 0 )
                {
                    $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    console.log("regID = " + e.regid);
                    console.log(e.regid);

                    localStorage.setItem("App_Id",e.regid);
                    console.log(localStorage.getItem('App_Id'));
                   //  $.ajax({
                   //      url : 'http://54.65.21.180:8080/App_GCM',
                   //      dataType : 'json',
                   //      type : 'POST',
                   //      data : {
                   //         'App_Id' : localStorage.getItem('App_Id')
                   //     },
                   //     success : function(result) {
                   //         console.log('success app');
                   //     }
                   // });

                }
                break;

                case 'message':
                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    // if (e.foreground
                    // {
                    //     $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                    //     // if the notification contains a soundname, play it.
                    //     //var my_media = new Media("/android_asset/www/"+e.soundname);
                    //     //my_media.play();
                    // }
                    // else
                    // {   // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart)
                        $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    else
                        $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');

                    console.log('----------------------------');
                    console.log(e.payload.title);
                    window.plugin.notification.local.add({ 
                        title       : e.payload.title,
                        message     : e.payload.message
                    });
                    // window.plugin.notification.local.add({ 
                    //     title       : '되라123',
                    //     message     : '거러지123'
                        
                    // });
            
                     }



                 $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                 $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                 break;

                 case 'error':
                 $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                 break;

                 default:
                 $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                 break;
             }
         }