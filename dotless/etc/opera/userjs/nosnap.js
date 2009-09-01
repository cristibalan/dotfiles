// ==UserScript==
// @name fuck snap.com
// @author Cristi Balan
// @version 1.0
// @include *
// ==/UserScript==

window.opera.addEventListener(
  'BeforeExternalScript',
  function (e) {
    if( e.element.getAttribute('src').match(/snap.com/) ) {
      e.preventDefault();
    }
  },
  false
)
