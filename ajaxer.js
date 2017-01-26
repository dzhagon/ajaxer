var ajaxer = (function () {
	var container = document.createElement('div');
	this.elements = [];

	var dynamicCache = {};
	
	var ajaxRequest = function (type, url, success, fail) {
		if (!url) return;
		
		type = typeof type === 'string'? type : 'GET';
		
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
		
	this.get = function (url, errorHandler) {
		
		var replaceContent = function (url, xhr) {

			if (!dynamicCache.hasOwnProperty(url)) dynamicCache[url] = xhr;

			container.innerHTML = xhr.responseText;

			for (var i in elements)
			{
				if (elements.hasOwnProperty(i))
				{
					var s = elements[i];

					try {
						var el = container.querySelector(s);
						var d = document.querySelector(s);

						if (el && d)
						{
							d.outerHTML = el.outerHTML;
						}
						el = null;
						d = null;
					}
					catch (e)
					{
						console.error(e);
					}
				}
			}
		};

		if (dynamicCache.hasOwnProperty(url)) {
			replaceContent.call(this, url, dynamicCache[url]);
		}
		else {
			ajaxRequest('GET', url, replaceContent, errorHandler);
		}

	}.bind(this);

	document.addEventListener('DOMContentLoaded', function () {
		var xhr = new XMLHttpRequest();
		xhr.responseText = document.body.parentNode || document.body.parentElement;
		dynamicCache[document.location.href] = xhr;
	}.bind(this));
	
	return this;
})();