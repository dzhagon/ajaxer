var ajaxer = (function () {
	var container = document.createElement('div');
	this.elements = [];
	this.overlaySelector = '';
	this.overlayShowClass = '';
	this.relativePath = '';

	var dynamicCache = {};

	var ajaxRequest = function (type, url, success, fail) {
		if (!url) return;

		type = typeof type === 'string' ? type : 'GET';

		var xhr = new XMLHttpRequest();
		xhr.open(type, url, true);
		xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');

		xhr.onreadystatechange = function (xhr, success, fail) {
			if (xhr.readyState != 4) return;
			var ft = 'function';
			if (xhr.status != 200) {
				if (typeof fail === ft) fail(url, xhr);
			}
			else {
				if (typeof success === ft) success(url, xhr);
			}
		}.bind(null, xhr, success, fail);

		xhr.send();
	};

	var getRelativeUrl = function (url) {
		var host = document.location.hostname || document.location.host;
		if (url.indexOf('http') === -1) {
			if (url.indexOf('/') !== 0) {
				var relativePath = document.location.pathname.split('/');
				relativePath.pop();
				relativePath.push(url);
				url = relativePath.join('/');
			}
			if (url.indexOf(this.relativePath) === -1)
			{
				url = this.relativePath + url;
			}
		}
		else if (url.indexOf(host) !== -1) {
			url = document.location.href.slice(url.indexOf(host) + host.length);
		}

		return url;
	}.bind(this);

	var replaceContent = function (html) {

		container.innerHTML = html;

		for (var i in elements) {
			if (elements.hasOwnProperty(i)) {
				var s = elements[i];

				try {
					var el = container.querySelector(s);
					var d = document.querySelector(s);

					if (el && d) {
						d.outerHTML = el.outerHTML;
					}
					el = null;
					d = null;
				}
				catch (e) {
					console.error(e);
				}
			}
		}
	};

	var replaceContentXHR = function (url, xhr) {
		var obj;

		if (dynamicCache.hasOwnProperty(url)) {
			obj = dynamicCache[url];
			replaceContent(obj.html);
		}
		else {
			obj = {};
			obj.html = xhr.responseText;
			replaceContent(obj.html);

			obj.title = document.title;
			dynamicCache[url] = obj;
		}

		try {
			window.history.pushState(obj, obj.title, url);
		}
		catch (e) {
			console.warn(e, 'History API unsupported!');
		}
	};

	var showOverlay = function () {
		if (this.overlaySelector && this.overlayShowClass) {
			var overlay = document.querySelector(this.overlaySelector);
			if (overlay)
			{
				overlay.classList.add(this.overlayShowClass);
			}
		}
	}.bind(this);

	var hideOverlay = function () {
		if (this.overlaySelector && this.overlayShowClass) {
			var overlay = document.querySelector(this.overlaySelector);
			if (overlay)
			{
				overlay.classList.remove(this.overlayShowClass);
			}
		}
	}.bind(this);


	this.get = function (url, successHandler, errorHandler) {
		url = getRelativeUrl(url);
		var currentUrl = getRelativeUrl(document.location.href.split('?').shift());

		if (url === currentUrl) return;

		var success = function (url, xhr) {
			replaceContentXHR(url, xhr);
			hideOverlay();
			successHandler(url, xhr);
		}.bind(this);

		var error = function (url, xhr) {
			hideOverlay();
			errorHandler(url, xhr);
		}.bind(this);

		if (dynamicCache.hasOwnProperty(url)) {
			success(url, dynamicCache[url]);
		}
		else {
			showOverlay();
			ajaxRequest('GET', url, success, error);
		}
	}.bind(this);

	window.addEventListener('popstate', function () {
		try {
			if (history.state) {
				replaceContent(history.state.html);
			}
		}
		catch (e) {
			console.warn(e, 'History API unsupported!');
		}
	}.bind(this));

	document.addEventListener('DOMContentLoaded', function () {
		var html = document.body.parentNode || document.body.parentElement;

		var obj = {
			title: document.title,
			html: html.outerHTML
		};

		var url = getRelativeUrl(window.location.pathname);

		dynamicCache[url] = obj;

		try {
			window.history.replaceState(obj, obj.title, url);
		}
		catch (e) {
			console.warn(e, 'History API unsupported!');
		}
	}.bind(this));


	return this;
})();