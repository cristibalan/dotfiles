// ==UserScript==
// @name         Jasper's Google Reader subscribe
// @namespace    http://browservulsel.blogspot.com/
// @description  v0.4 - Another Google Reader subscriber, this one works for Opera. This one was designed to use as little screen size as possible. It only adds a feed icon in the top right corner. On mouse over the subscribe links are shown.
// ==/UserScript==

/*
  Author: Jasper de Vries, jepsar@gmail.com
  Date:   2006-04-13
  
  Change for version 0.3 by Mihai Parparita: Check if the user is already
  subscribed, and modify the appearance of the image accordingly.

  Modified by Alf Kåre Lefdal (http://www.lefdal.cc/info) to work in Opera.

*/

const SUBSCRIBED_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM%2FrhtAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAQnSURBVHja7JhdbBRVFMf%2Fs1%2Fdpew2212gbVCwKaayRh%2BICdhVHqgmxpD4oC8mSkyMPvIoPBgj4Z3wYEyqIVrCRyAxRh7Q2IiabRSxEI1QpWF5aNntwiyz2%2B7M7Hx7ZnZWB9xv2unGcJK7s5m5H7%2F533PPuXMZwzDQzcY8BGwHhmESdBmjMkQlRWxTXQNIcK%2FRJeG4xRHbUV8XgIXoYsIN3%2Fcoav74ugDuDXtKa5qni%2BG4NQNsRTmy9JoAtghnWsr1MNMOnBliXAVsAy5DTBOuB2oCfKcVOCrHiUl0FZDg3qwR52qt2gknXF1AO%2BXscHQ6RfVS1efs56P9SiY3LbPFUaVcac%2FUGfWrNIM5PsCeuqweK%2FCa2ABuksbgmubiGimnamYH1tLPHo7MBoPGqDyyB1r%2FLvh9DHp9JRi3vkaPcgteD2MBT%2F4gIJ1TUS5IWBLBfpySP6rRr2grx9Ui97UIB1tNC1BeXB7dtHMj0kIII6%2B856hyCOWFFMRf3scX317BzduqdTcY9kMq8PE6cMfrwd0DSHDJBnBw%2BpAqUX1ZRVicxqUj49B0Az0DT2FLch%2F6tyRx5ru3cG2pRGr%2BAY%2BnMvm6VrPPswSXaeSYTgXHmjhx9J9%2FOgEqKmJMEbr0E8wJ7ctfwtLpCRzJPI9879MIbXsZy9d0rBeu0stTG6O%2ByzQyj62eufxDTeqG7FhGElIpq2DvSBg8wGPgQAl49Ud8Of8k2NkpFH%2BdhCqXEd6%2BF7InRvV166Ucdq4VOGeqC7YYMaJVBSFr8GkquNkLyM1dxtmp35GNvwRlYxJhNQd%2B7nurqvexF6CrmlNBE26m1RDV7nYragVTE1BSEPOTkKf34LOLBn7jH8Hm517HupHdEJaz8GUuQhyiqY5uhYQIARaq4WqmnQHb3SwMVhU0JB2SoOPTnw1wArDZmEdu%2BkTlrYd3I2B6wsKVSqvY49hBa9gZS1cLMFEFZEmQk5s%2BRH7XB2CeeRcemsIIvwA%2Bn0WgbxBimTovLVrVnxjeimc3dJaF2p5iWijj518EphfXwxureD4THoBAQCEvoKhl616JItwGRkcikcCYLkH468EAuTbaJL%2BZJ%2Bf3lxC4m0GgfwhaIYsec0EQrzBzBlpvFHFado96CkioN4A71%2BGFOwpaJhlgIzri6oVPwJJS8V4g4K3EuohOChazGFoHvD3AQzp%2FELxMzwL4s5OxLB9slGpq2ak0ji0pyCtKZVp5YuL4f4ufospYH3CTBW4XKSLpuB4INk0EjT%2Fcybf235MtOre6O5OOFezAD12BW2nAFYdbScBVgVspwFWDuz%2FMpDton7H3dKsC958tv5klzEDcYtu0DSe6ej7YZNtftRlqd27NDjAJ0vyi21unjanaVddOI%2Bp9FxNk1FZyvKqafSTBwUV7eEb9vwf8W4ABAClz84zUeuOSAAAAAElFTkSuQmCC";
const UNSUBSCRIBED_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALnSURBVHjaYvz//z8DJQAggBhBBrxZqCH0+9nLo7/efNT4/QNiICMODawcjAysIvw3WKXErUXib7wDCCAWkODvx8+OcnD812Cy9WNgFbJkYGVhZOBm+cLw/+kOBvbfTxmYmRhRDPzw4KPGd6AeIFMTIIDALniYw/hf1kKM4R6TE4NK1HIUG388OcLw+1QtA/f36wxMUFNAeh4df8UgP+U/I0AAgV3w5yfQyb/+MPB+P8pwut+F4e+//wzsEnoM8jbxDELyNgwcMvsZ3m3LZOB9uhLsOkaoHhAACCAmMPkPaMDvPwzCjB8ZZH4eZ1D4fZJB4+1cht8rrBkebShm+PHlA4OQ13SGV4LBDP9+/GFgAFoG0gMCAAEEMeAPyK1/GN68/skgWfGVQaLiCwNDyCEGTiVvBpHb0xkezXBm+PH5PYN0yGyGz6zqDP9BhvyBGAAQQHAXMPz6y8Dy9w/D++v7GV7ePsfAKWXAwBe6iuGbbjmD1PdLDK+2NYKVsjl2Mfz98RvuAoAAQhjw8zeDMOt/Bo4Vzgw/pxkz7K+0ZvgOtFXEo57hu7Q3A/uZiQzv7gINVnZg+MooAzcAIIDgBvz/+Y/h57d/DJ8+/meQ4mZgsPx/jOFSlxdYmtO5joEHGHI/Ts6DpBFVH7gBAAEEN+Ar0NuMWWcZxCf8Z2DMPAf0DgOD7OsTDK9unmXgkTdieP+BgYHl+Xmw8m//+Rj+Qw0ACCC4AS//iTKwyxqBuczShgzvgBoEmYGafnwAi714y8DAw/QXovz3X3ggAgQQOB2wAA1gf/ea4fOdMwy8KiYMP++fZeAFBRhQ3dvZoQw/RZUY1AWAKfbpbYZryzsYBF7fYmCGJjSAAAKnxOeRjNc5GBg0QIY+eA9Mn6IMDNxskPwAy2ogNjB9MfwEKvr6CxhpjAw3pJb/1wQIIBZIBmGw/v6V4fjvnwxqQkCNLz/izn3AhMjAys5wi42bwRrEBwggRkqzM0CAAQDgTQ4givU1SwAAAABJRU5ErkJggg==";

var result = document.evaluate('//link[@rel="alternate"][contains(@type, "rss") or contains(@type, "atom") or contains(@type, "rdf")]', document, null, 0, null);
var item;
var feeds = [];
while (item = result.iterateNext()) feeds.push(item);

if (feeds.length > 0) {
  add_style('#JGRSmain { position: fixed; z-index: 32767; top: 0; right: 0; padding: 0 0 0 20px; min-height: 20px; background: 2px 2px url(' + UNSUBSCRIBED_IMAGE + ') no-repeat; }');
  add_style("#JGRSmain.subscribed { background: url(" + SUBSCRIBED_IMAGE + "); min-height: 40px; padding: 0 0 0 40px;}");
  add_style("#JGRSmain.subscribed:hover { background: transparent;}");
  add_style('#JGRSmain:hover { padding: 0; }');
  add_style('#JGRSmain > div { display: none; }');
  add_style('#JGRSmain:hover > div { display: block; padding: 1px 0; background: #f8f8f8; border: solid #ccc; border-width: 0 0 1px 1px; }');
  add_style('#JGRSmain a { display: block; margin: 4px 0; padding: 0 10px; font-family: "Verdana"; font-size: 11px; line-height: 14px; font-weight: normal; color: #669; text-decoration: underline; text-align: left; background: #f8f8f8; border: 0; }');
  add_style('#JGRSmain a:hover { color: #f66; }');

  var JGRSmain = document.createElement('div');
  JGRSmain.setAttribute('id', 'JGRSmain');
  document.body.appendChild(JGRSmain);

  var JGRSfeeds = document.createElement('div');
  JGRSmain.appendChild(JGRSfeeds);
  
  for (var i = 0, feed; feed = feeds[i]; i++) {
    var encodedFeedUrl = encodeURIComponent(feed.href);
    JGRSfeeds.innerHTML += '<a href=http://www.google.com/reader/view/feed/'+ encodedFeedUrl +'>'+ feed.title +'</a>';
    
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://www.google.com/reader/api/0/subscribed?s=feed%2F" + encodedFeedUrl,
      onload: function(response) {
          if (response.responseText == "true") {
            isSubscribed = true;
            JGRSmain.className = "subscribed";        
          }
        }
    });
  }
}

function add_style(css) {
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			var node = document.createElement("style");
			node.type = "text/css";
			node.innerHTML = css;
			heads[0].appendChild(node); 
		}
	}
}

function GM_xmlhttpRequest(options) {
  var request = new opera.XMLHttpRequest(),
      validEvents = { onload: null, onerror: null, onreadystatechange: null };
  
  function addXMLHttpRequestListener(request, eventName, callback) {
    request[eventName] = function(event) {
      var responseDetails = {
        responseText: request.responseText
        ,readyState: request.readyState
        ,responseHeaders: (request.readyState == 4 ? request.getAllResponseHeaders() : '')
        ,status: request.readyState == 4 ? request.status : 0
        ,statusText: request.readyState == 4 ? request.statusText : ''
      };
      callback.call(null, responseDetails);
    }
  }
  
  for (var eventName in validEvents) {
    if (options[eventName])
      addXMLHttpRequestListener(request, eventName, options[eventName]);
  }
  
  request.open(options.method, options.url, true);
  
  for (var header in options.headers) {
    GM_log('options.headers[' + header + '] = ' + options.headers[header]);
    request.setRequestHeader(header, options.headers[header]);
  }
  
  request.send(options.data);
}

