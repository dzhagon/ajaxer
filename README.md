# ajaxer

Simple pure js component for ajax navigation. It helps you to load markup from other pages without loading sources you have already had.
You just need to setup selectors, and markup of them will be updated from another page.

```js
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
    '.sectioncolumns'
];
ajaxer.overlaySelector = '.overlay';
ajaxer.overlayShowClass = 'overlay--show';

$(document).on('click', 'a', function () {
  var self = $(this);
  if (ajaxer || false) {
   ajaxer.get(self.attr('href'), function () {}, function () { console.warn('fail to load', self.href); });
   window.scrollTo(0, 0);
   return false;
  }
});
```
