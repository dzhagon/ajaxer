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
	
	return this;
})();

ajaxer.elements = [
'link[rel="canonical"]',
'title',
'meta[name="description"]',
'meta[name="keywords"]',
'meta[property="og:type"]',
'meta[name="og:title"]',
'meta[name="og:description"]',
'meta[name="og:site_name"]',
'meta[name="og:url"]',
'meta[name="og:image"]',
'h1',
'.play-list'
];

ajaxer.get('http://mp3musicbit.com/download/%25D1%2583%25D1%2580%25D0%25B0%25D0%25BB%25D1%258C%25D1%2581%25D0%25BA%25D0%25B8%25D0%25B5%2520%25D0%25BF%25D0%25B5%25D0%25BB%25D1%258C%25D0%25BC%25D0%25B5%25D0%25BD%25D0%25B8%2520%25D0%25BC%25D1%2583%25D0%25B7%25D1%258B%25D0%25BA%25D0%25B0/', function () {console.log('fail');});
ajaxer.get('http://mp3musicbit.com/download/Michael%2520Malarkey%2520-%2520Scars/', function () {console.log('fail');});