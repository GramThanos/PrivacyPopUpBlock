(function () {
    'use strict';
    let Browser = chrome || browser;

    Browser.runtime.sendMessage({action: 'getpKillStatus', url: location.host}, (res) => {
        if (res.pKillStatus) {
            let script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', Browser.extension.getURL('js/privacypopupkill.js'));
            document.head.appendChild(script);
        }
    });

    //let initpKillerFired = false;
    //window.addEventListener('load', () => {
    //    if (initpKillerFired == true) {
    //        return;
    //    } else {
    //        Browser.runtime.sendMessage({action: 'getpKillStatus', url: location.host}, (res) => {
    //            if (res.pKillStatus) {
    //                let script = document.createElement('script');
    //                script.setAttribute('type', 'text/javascript');
    //                script.setAttribute('src', Browser.extension.getURL('js/privacypopupkill.js'));
    //                document.body.appendChild(script);
    //            }
    //        });
    //        initpKillerFired = true;
    //    }
    //});

    document.addEventListener('privacyPopUpBlocked', (e) => {
        Browser.runtime.sendMessage({action: 'privacyPopUpBlockedFromContent', privacyPopUpUrl: e.detail.privacyPopUpUrl}, () => {});
    }, false);
}());
