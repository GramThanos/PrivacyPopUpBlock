/*
 * Privacy Pop Up Blocker
 */
(function() {
	'use strict';

	const blocker = {
		list: [
			// Privacy
			//'[hide|Cookie Consent CMP] body.qc-cmp-ui-showing div.qc-cmp-ui-container', // https://www.saveit.gr/odhgos-agoras-syskeuhs-sideromatos
			//'[normalDisplay|Cookie Consent CMP] body.qc-cmp-ui-showing',
			'[hide|Cookie Consent CMP 2] body > div.qc-cmp2-container',
			'[hide|boxzilla] body > div.boxzilla-overlay, body > div.boxzilla-container',
			'[hide|Cookie Law Info] body > #cookie-law-info-bar,  body > div > #cookie-law-info-bar, body > #cookie-law-info-again, body > div > #cookie-law-info-again',
			'[hide|OneTrust Consent] body > div#onetrust-consent-sdk',
			'[hide|GDPR Consent Tool] body > div#gdpr-consent-tool-wrapper',
			'[hide|SP Message] body > div[id^=\'sp_message_container_\']',
			'[normalDisplay|SP Message] html.sp-message-open',
			'[hide|CMP Framework] body > div.snigel-cmp-framework',
			'[hide|Consent] body > div.consent-popup',
			'[hide|Cookies Consent Bar] div#cookiesConsentWidget',
			'[hide|Cookie Consent] body > div.cookie-notifications',
			'[hide|GDPR Tracker Settings] div.gdpr[data-testid=\'gdpr-dock\']',
			'[hide|iubenda Consent Banner] body > div#iubenda-cs-banner',
			'[hide|GDPR Cookies Accept] body > div.gdprPopup',
			'[hide|EZ Cookie Dialog] body > div#ez-cookie-dialog-wrapper',
			'[hide|Cookie Choices Info] body > div.cookie-choices-info',
			'[hide|EU Cookie Compliance Banner] body > div.eu-cookie-compliance-banner, body > div > div.eu-cookie-compliance-banner',
			'[hide|AMP Consent] body > amp-consent#consent',
			'[hide|GDPR PopUp] body > div.gdpr-popup-border',
			'[hide|Universal Consent] body > div#uniccmp',
			'[hide|Cookie Consent] body > div.cc-banner[aria-label=\'cookieconsent\'], body > div.cc-window[aria-label=\'cookieconsent\']',
			'[hide|FC Consent] body > div.fc-consent-root',
			'[hide|Evidon Cookie Consent] body > div#_evidon-barrier-wrapper',
			'[hide|TC Privacy] body > div#footer_tc_privacy',

			// Notifications
			'[hide|OneSignal Notifications] body > div.onesignal-slidedown-container, body > div.onesignal-bell-container',
			'[hide|WebPush Notifications] body > div#webpushr-prompt-wrapper',
			'[hide|Popup Push Notifications] body > div#popup-push',
			'[hide|PN Notifications] body > div#pn-overlay-backdrop',
			'[hide|Notification Box] body > div.notification_box#notification-box',
			'[hide|Popup Signup Form] body > div[id^=\'PopupSignupForm_\'][widgetid^=\'PopupSignupForm_\']',
			'[hide|ET Bloom Popup Subscribe] body > div.et_bloom_popup',
			'[hide|Lightbox Newsletter] body > div.preloaded_lightbox[role=\'dialog\'][id^=\'lightbox-\']',
			'[hide|Newsletter Toaster] body > div.newsletter-toaster',

			// Anti-adblocker
			'[hide|FC Anti-AdBlocker] body > div.fc-ab-root',
		],

		load : function () {
			// Create CSS
			let style = document.createElement('style');
			style.type = 'text/css';
			style.textContent = this.craft();
			document.getElementsByTagName('head')[0].appendChild(style);

			// Detect Blocks
			this.checkLimit = 10;
			this.checkInterval = setInterval(() => {this.check();}, 1000);
			this.check();
		},

		craft : function() {
			let style = '';
			//style += this.style.overflowY('body');

			for (let i = 0; i < this.list.length; i++) {
				let rule = this.list[i].match(/^!?\[([^|]+)\|([^\]]+)\](.+)$/);
				if (rule && this.style.hasOwnProperty(rule[1])) {
					style += this.style[rule[1]](rule[3].trim());
				}
			}

			return style;
		},

		checkLimit : 10,
		checkInterval : null,
		checkBodyOverflow : false,
		checkCache : [],
		check : function() {
			this.checkLimit--;
			for (let i = 0; i < this.list.length; i++) {
				let rule = this.list[i].match(/^\[([^|]+)\|([^\]]+)\](.+)$/);
				if (rule && this.checkCache.indexOf(rule[2].trim()) < 0 && document.querySelector(rule[3].trim())) {
					console.log(`[PrivacyPopUpBlocker] Blocked "${rule[2].trim()}"`);
					this.checkCache.push(rule[2].trim());
					this.reportBack(rule[2].trim());
				}
			}
			if (!this.checkBodyOverflow && this.checkCache.length > 0 && document.body.style.overflow.match(/hidden/)) {
				this.checkBodyOverflow = true;
				let style = document.createElement('style');
				style.type = 'text/css';
				style.textContent = this.style.overflowY('body');
				document.getElementsByTagName('head')[0].appendChild(style);
				console.log(`[PrivacyPopUpBlocker] Restored page scrolling`);
			}

			if (this.checkLimit <= 0) {
				clearInterval(this.checkInterval);
			}
		},

		reportBack : function(name) {
			let event = new CustomEvent('privacyPopUpBlocked', {
				detail: {
					privacyPopUpUrl: name
				}
			});
			document.dispatchEvent(event);
		},

		style : {
			hide : function(identifier) {
				return identifier + ' {display: none!important;}' + '\n';
			},

			overflowY : function(identifier) {
				return identifier + ' {overflow-y: auto!important;}' + '\n';
			},

			normalDisplay : function(identifier) {
				return identifier + ' {' +
					'margin: unset !important;' +
					'overflow: auto!important;' +
					'left: unset !important;' +
					'right: unset !important;' +
					'top: unset !important;' +
					'bottom: unset !important;' +
					'position: unset !important;' +
				'}' + '\n';
			},
		}
	};

	// Load Handler
	let loaded = false;
	let load = () => {
		if (loaded) return;
		loaded = true;
		blocker.load();
	};
	if (document.readyState == 'interactive' || document.readyState == 'complete') {
		load();
	} else {
		window.addEventListener('DOMContentLoaded', load, true);
		window.addEventListener('load', load, true);
	}
})();
