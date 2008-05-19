// ==UserScript==
// @name ma.gnolia bookmark/add page tweaks
// @author Cristi Balan
// @version 0.1
// @include http://ma.gnolia.com/bookmarklet/add*
// ==/UserScript==


window.opera.addEventListener(
  'BeforeScript',
  function (e) {
    // cancel js rater
    if( e.element.text.match(/Magnolia.init.rater/) ) {
      e.preventDefault();
    }
  },
  false
);

window.addEventListener("load",function() {

  // focus tags input to be able to press enter to submit
  var tag_input = document.getElementById("tag_input")
  tag_input.focus();
  tag_input.select();

  // replace select rater with text input rater
  var rating_select = document.getElementById("rating")
  var rating_parent = rating_select.parentNode;

  var rating_input = document.createElement("input");
  rating_input.value = rating_select.value;
  rating_input.className = "text";
  rating_parent.appendChild(rating_input, rating_select)
  rating_parent.removeChild(rating_select)
  rating_input.id = "rating";
  
} ,true);
