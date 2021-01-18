(function () {

    'use strict';

    let Browser = chrome || browser,
        utils;

    function initPopupPage() {
        utils = Browser.extension.getBackgroundPage().utils;

        initWhiteListBtnStatus();

        document.getElementById('startButton').addEventListener('click', function (e) {
            Browser.runtime.sendMessage({action: 'pbStart'}, utils.noop);
            Browser.extension.getBackgroundPage().updateIcon(true);
            Browser.tabs.reload();
            window.close();
        });

        document.getElementById('pauseButton').addEventListener('click', function (e) {
            Browser.runtime.sendMessage({action: 'pbPause'}, utils.noop);
            Browser.extension.getBackgroundPage().updateIcon(false);
            Browser.tabs.reload();
            window.close();
        });

        document.getElementById('settingsBtn').addEventListener('click', function (e) {
            var optionsUrl = Browser.extension.getURL('options.html');
            Browser.tabs.query({url: Browser.extension.getURL('options.html')}, function(tabs) {
                if (tabs.length) {
                    Browser.tabs.update(tabs[0].id, {active: true});
                } else {
                    Browser.tabs.create({url: optionsUrl});
                }
                window.close();
            });
        });

        document.getElementById('addWlist').addEventListener('click', function (e) {
            Browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if(!tabs) {
                    return;
                }
                let ctab = tabs[0];
                if(utils.isSpecialTab(ctab)) {
                    return;
                }
                Browser.runtime.sendMessage({action: 'addWlist', tab : ctab}, utils.noop);
                Browser.tabs.reload(ctab.tabId);
                window.close();
            });
        });

        document.getElementById('removeWlist').addEventListener('click', function (e) {
            Browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if(!tabs) {
                    return;
                }
                let ctab = tabs[0];
                Browser.runtime.sendMessage({action: 'removeWlist', tab : ctab}, utils.noop);
                Browser.tabs.reload(ctab.tabId);
                window.close();
            });
        });

    }

    function initWhiteListBtnStatus() {
        Browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if(!tabs) {
                return;
            }
            let ctab = tabs[0];
            let domain = utils.getDomain(ctab.url);
            let wlistStatus = utils.checkWhiteList(domain, Browser.extension.getBackgroundPage().pbSettings['pbWhiteList']);

            if (wlistStatus) {
                setWlistStatus(true);
            }
            else {
                setWlistStatus(false);
                initSuspendBtn(ctab.id);
            }
        });
    }

    function initSuspendBtn(tabId) {
        utils.getOption('pbRunStatus', function(value) {
            setBtnStatus(value);
            Browser.extension.getBackgroundPage().updateIcon(value);
            initBlockCount(tabId);
        });
    }

    function initBlockCount(tabId) {
        let pbTabstmp = Browser.extension.getBackgroundPage().pbTabs;

        if (tabId in pbTabstmp) {
            document.getElementById('blockedNum').innerText = pbTabstmp[tabId].length;
            let prop,
                trEl,
                tdEl,
                tableEl = document.getElementById('blockedDomains');

            for (prop in pbTabstmp[tabId]) {
                trEl = document.createElement('tr');
                tdEl = document.createElement('td');
                tdEl.innerText = pbTabstmp[tabId][prop];
                trEl.appendChild(tdEl);
                tableEl.appendChild(trEl);
            }
        } else {
            document.getElementById('blockedNum').innerText = 0;
        }

    }

    function setWlistStatus(status) {
        document.getElementById('addWlist').style.display = (status === true) ? 'none' : '';
        document.getElementById('removeWlist').style.display = (status === true) ? '' : 'none';
        document.getElementById('hideWl').style.display = (status === true) ? 'none' : '';
    }

    function setBtnStatus(status) {
        document.getElementById('pauseButton').style.display = (status === true) ? '' : 'none';
        document.getElementById('startButton').style.display = (status === true) ? 'none' : '';
        document.getElementById('hidePs').style.display = (status === true) ? '' : 'none';
    }

    document.addEventListener('DOMContentLoaded', function () {
        initPopupPage();
    });

}());