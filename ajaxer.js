var ajaxer = (function () {
	var container = document.createElement('div');
	this.elements = [];

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
		}
		else if (url.indexOf(host) !== -1) {
			url = document.location.href.slice(url.indexOf(host) + host.length);
		}

		return url;
	};

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


	this.get = function (url, errorHandler) {
		url = getRelativeUrl(url);
		var currentUrl = getRelativeUrl(document.location.href.split('?').shift());

		if (url === currentUrl) return;

		if (dynamicCache.hasOwnProperty(url)) {
			replaceContentXHR(url, dynamicCache[url]);
		}
		else {
			ajaxRequest('GET', url, replaceContentXHR, errorHandler);
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