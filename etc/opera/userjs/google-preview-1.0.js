// ==UserScript==
// @name Opera port of GooglePreview
// @author Edward Ackroyd, adapted to Opera by Sombria
// @version 1.0 (GooglePreview 2.1.3)
// @include http://www.google.*/search*
// @include http://*search.yahoo.com/search*
// @include http://search.live.com/results*
// @include http://search.msn.com/results*
// @include http://*.zotspot.com/search/*
// ==/UserScript==

// http://ackroyd.de/googlepreview/
// Script insert preview images into Google and Yahoo search
//
// (C) 2006 Edward Ackroyd
//
// Thanks to Oliver Roth (from http://erweiterungen.de) for creating the first localizable version with German and English
// Thanks to Carlo Zottmann for inspiring me to continue improving GooglePreview


var ENABLE_IMAGE_INSERT = true;

var IMG_MW = 'data:image/gif;base64,R0lGODlhbwBSAOYAAPQLC/Dz8WZmZsRfWswzM8SwrKokJMOloMk+OtjV0/9fXv8kJP86OszMzN4oKf+Li/+lo/9SUt8kJL6GgMhUUv8zM+rs6fqNi/+8u/9mZtaMi/GpqO8oKf729fNQTvHc2v9JSeTHxP+ZmcBzctVJRvAvLv8pKct6ef/m5P98fP+sq+G7uf/MzO87OuiPjf9cW+UvLf9COsxmZt+BgPokJMyZmfYpKvXz8eTSz/jMyugoKcdFQ/S1sv/e2/90c+/y8MyHhfny8f+TkcWAe8+wrcNYV8Jycf///+yTkvj7+fqSkM9AP7MkJP+0s/+qp8xmZt/b2evp5syZmcaIhf9mZv+hn/9eX/9BQe/39/+Af//t7MW1rdA+O9PRzuckJPLIxr96dfguLtJvbvT39c6MhP+Zmc+zrveUlM5KQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAQUAP8ALAAAAABvAFIAAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goYw9GE4ipxA5oqugLBAPKRkZCla1ViKfAACsnFoqDxkRVwzExFcgyKqKuoW7icy8mShVPhEMFdhh2tgVxGE8y9BH4ofk0ZRaIj4g2CYm3BXu8CZfz7q794P3zuPOzP/89unDR9DcJmrsKixQEGEBtoUN4THogKhgP0PQMhK82MzfPo2eWKSI8DCDIBALFp502M5FRUEeB+bjCJBjv5niPvLb9EDBNRM+CIFQQOiFO3ctgpTrCDMmzY0gnw4MhWLdwyaKkLCsYGPFUkJRo0ptStZmzk4YFFzhZgLroRpM/7Rps6Hh69SmOAM6xSv25k5NVayxpQHBEBADOuDZEHOuMSIhIK5xWxC0UBEv8LjKcMyZkBDJD7MgyrC1AgfGnTs7mfdAkY+jJnQAiWbwUe1IPd49rELISN1BM2hkc0AkdaTbkUDAXoDryAgmEpQIAhNXG4clUMpB3SnwIsC8fLl3v3tpg+6HSk5UX3BBvdwwEqYk0e79L9mPUsM6NYc8kofzCkkQxmQCyqXDDglUtB1YApEDkn5l8WcfJR+UAGBmmXFAQAH21HdXTR9uNFZfNmESAgw2DIghN2HoQMABAYRTVoQi0jjifhNyggMJOqSoYgVycSDBDgX8sAiJ+DkYE/+E4THFyQ01cOGADhxUWaUDCEzQxXzGMdIfJ1GYMcQAFFAwABgHdBFjl+F8+UkAFsQ5Bpt01mnnnXjmqeeefPbp55+ABirooIQWauihlgggAKKgKOqoo0coaoikkVBKKaOXRrpoJ5kemumjm2o6yKOTQiopqIKQWgiqkI7aqqWhchorrKlu2qmrhNBa66652uprqaIG68mnvwaraq+6XgpqrMYWq+mrrX5CLK/KRuvqqc7eimuz1PqqrSbTctsrItjyKiyzyRZbrSjhpnurqtV6y6y48a7LaDTf3ivtvKvkq6+s//Lib8DgHmvwossirK276v46sMDOdouquOOKSiuUw/w6hrG56R4Cr8MN33lxyN2ai2zIHds5csksf2tvuRTTufG5JAN7bagTP0ywyTsPm3HPQBeqc9CSDL3nx/UqjPPHu+YMrbAqz0pyyjDryu3EIkvd8tQKs/ysqT+z2S7XJacM9dlZV0w1yjUrC7XRrCC99NbRYg2t1WjfCzfRjuzN99+ABy744IQXbvjhiCeueCiBAAA7';
var IMG_LOADING = 'data:image/gif;base64,R0lGODlhbwBSAIAAAMzMzP///yH5BAQUAP8ALAAAAABvAFIAAALhjI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1ioUALttAN/ulhLNeLhnxBajRa4O63X2H5c34YVxOu/d8PdPO5/VW1hcISLh0qIgI6OeXaBjpGMlYd9fmNigIR7mJd1bxCaqFObogapqq6kG3B8dZmNkYeOT4uDVZOZuUK8tpO4ibp9SLeFdpPCzMe2x8i0b5iJyc05qsSZuGKf3cg7rK8A0+Tl5ufo6err7O3u7+Dh8vP09fb3+Pn6+/z9/vL1MAADs=';
var IMG_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

function getASIN(href) {
    asin = href.match(/amazon.+\W+([0-9A-Z]{10})(\W+|$)/i)
    return asin ? asin[1] : null;
}

function getAPath(href) {
	var tokens = href.split("/exec/obidos/");
	if (tokens.length == 2)
		return tokens[1];
	else
		return href;
}

function isAmazon(href) {
	return isAmazonCOM(href) || isAmazonUK(href) || isAmazonDE(href) || isAmazonFR(href);
}

function isAmazonCOM(href) {
	return href.toLowerCase().indexOf("www.amazon.com") == 7;
}

function isAmazonUK(href) {
	return href.toLowerCase().indexOf("www.amazon.co.uk") == 7;
}

function isAmazonDE(href) {
	return href.toLowerCase().indexOf("www.amazon.de") == 7;
}
function isAmazonFR(href) {
	return href.toLowerCase().indexOf("www.amazon.fr") == 7;
}

function getGPSub(href) {
    var site = getFullDomain(href);
    site = site.toLowerCase();
    if (site.indexOf("https://") == 0) {
        site = site.substring(8, site.length);
    }
    else if (site.indexOf("http://") == 0) {
        site = site.substring(7, site.length);
    }
    if (site.indexOf("www.") == 0) {
        site = site.substring(4, site.length);
    }
    return site.length > 0 ? ""+site.charAt(0) : "a";
}

function getImageURL(href) {
    //bad soft warning
    var mw = href.match(/http:\/\/www\.google\..*\/interstitial\?url=/i);
    if (mw) {
        return IMG_MW;
    }

    var fullDomain = getFullDomain(href);
    var protocol = "unknown";
    var site = fullDomain;
    if (site.indexOf("http://") == 0) {
        site = site.substring(7, site.length);
        protocol = "http://";
    }
    else if (site.indexOf("https://") == 0) {
        site = site.substring(8, site.length);
        protocol = "https://";
    }

//    var idnasite = IDNA_SERVICE.convertUTF8toACE(site);
    var idnasite = site;    // ????????????????????????????????????????????????????
    var preview = "http://"+getGPSub(idnasite)+".googlepreview.com/preview?s=" + protocol + idnasite;
//    var preview = "http://open.thumbshots.org/image.pxf?url="+idnasite;

	if (!isAmazon(href)) {
		return preview;
	}
	var isbn = getASIN(href);
	if (isbn != null) {
		if (isAmazonCOM(href)) {
				return "http://images.amazon.com/images/P/" + isbn + ".01.TZZZZZZZ.jpg";
		}
		else if (isAmazonDE(href)) {
				return "http://images-eu.amazon.com/images/P/" + isbn + ".03.TZZZZZZZ.jpg";
		}
		else if (isAmazonUK(href)) {
				return "http://images-eu.amazon.com/images/P/" + isbn + ".02.TZZZZZZZ.jpg";
		}
		else if (isAmazonFR(href)) {
				return "http://images-eu.amazon.com/images/P/" + isbn + ".08.TZZZZZZZ.jpg";
		}
	}
    return preview;
}

function amazonifiy() {
	var allLinks = document.getElementsByTagName("a");
	for(i=0; i<allLinks.length; i++) {
		var href = allLinks[i].href;

		//never ever touch a tagged amazon affiliate URL
		var lowerURL = href.toLowerCase();
		if (lowerURL.indexOf("tag=") > 0 || lowerURL.indexOf("tag%3d") > 0)
		    continue;

		href = getRealURL(href);
		if (isAmazonCOM(href) && allLinks[i].getAttribute("amazonified") != "yupp" && href.indexOf("gp04-20") == -1) {
			var n = "http://www.amazon.com/exec/obidos/redirect?tag=gp04-20&path=" + escape(getAPath(href));
			allLinks[i].setAttribute("href", n);
			allLinks[i].setAttribute("amazonified", "yupp");
		}
		else if (isAmazonDE(href) && allLinks[i].getAttribute("amazonified") != "yupp" && href.indexOf("gp0409-21") == -1) {
			var n = "http://www.amazon.de/exec/obidos/redirect?tag=gp0409-21&path=" + escape(getAPath(href));
			allLinks[i].setAttribute("href", n);
			allLinks[i].setAttribute("amazonified", "yupp");
		}
		else if (isAmazonUK(href) && allLinks[i].getAttribute("amazonified") != "yupp" && href.indexOf("gp04-21") == -1) {
			var n = "http://www.amazon.co.uk/exec/obidos/redirect?tag=gp04-21&path=" + escape(getAPath(href));
			allLinks[i].setAttribute("href", n);
			allLinks[i].setAttribute("amazonified", "yupp");
		}
		else if (isAmazonFR(href) && allLinks[i].getAttribute("amazonified") != "yupp" && href.indexOf("googleprevi02-21") == -1) {
			var n = "http://www.amazon.fr/exec/obidos/redirect?tag=googleprevi02-21&path=" + escape(getAPath(href));
			allLinks[i].setAttribute("href", n);
			allLinks[i].setAttribute("amazonified", "yupp");
		}
	}
}

function stockify() {
	var images = document.getElementsByTagName("img");
	for (i=0; i<images.length; i++) {
		if (images[i].getAttribute("src") == "/images/stock_img.gif") {
			parent = images[i].parentNode;
			if (!parent)
				return;
			href = parent.getAttribute("href");
			if (!href)
				return;
			tokens = href.split("stocks:");
			if (tokens.length >= 2) {
				images[i].setAttribute("src", "http://ichart.yahoo.com/t?s=" + tokens[1]);
				images[i].setAttribute("width", "192px");
				images[i].setAttribute("height", "96px");
			}
		}
	}
}

function getFullDomain(href) {
    domain = href.match(/http(?:s)?:\/\/[^\/]+/i);
    return domain ? domain[0].toLowerCase() : href;
}

function getRealURL(href)
{
   if (getFullDomain(href).match(/(.*wrs|\.rds|rds)\.yahoo\.com/i)) {
        var nhref = href.match(/\*\*.+$/);
        if (nhref) {
            href = unescape(nhref[0].substr(2));
            //de does some special click through
            if (href.match(/http.*\.yahoo.com\/click/i)) {
                href = unescape(href.match(/u=(.*)&y=/)[1]);
            }
        }
    }
    return href;
}

function createThumbnail(href)
{
	href = getRealURL(href);
    thumb = document.createElement("img");
    thumb.setAttribute("align", "left");
	if (!getASIN(href)) {
		thumb.setAttribute("src", getImageURL(href));
        thumb.style.width = "111px";
        thumb.style.height = "82px";
		thumb.style.backgroundImage = "url("+IMG_LOADING+")";

        thumb.style.backgroundPosition = "center";
		thumb.style.backgroundRepeat = "no-repeat";
		thumb.style.border = "1px solid #BBBBBB";
	} else {
    	thumb.setAttribute("src", IMG_PIXEL);
    	thumb.style.margin = "2px 0px 2px 0px";
        thumb.style.width = "115px";
		thumb.style.backgroundImage = "url("+getImageURL(href)+")";
		thumb.style.backgroundPosition = "top";
		thumb.style.backgroundRepeat = "no-repeat";
		thumb.style.border = "1px solid #FFFFFF";
    }
	thumb.style.margin = "2px 4px 5px 0px";
    return thumb;
}

function thumbshots(url) {
	if (document.getElementsByTagName("head")[0].getAttribute("done") == "done")
		return;

	var t = 0;

	if (isGoogle(url)) {
    		var i = 0;
    		var a = document.getElementsByTagName("a")[i++];
    		var prevA = false;
    		while (a != null) {
    			var href = a.href;
    			url = href.match(/http:\/\/(?:www\.)?google\.[^\/]+\/url\?.*&q=(http:.+)$/i);
                if (url) href = unescape(url[1]);

    			if (href.indexOf("http://") == 0 || href.indexOf("https://") == 0) {
    				var aParent = a.parentNode;
    				if (aParent.getAttribute("class")=="r" && aParent.parentNode.getAttribute("class")=="g" && "done" != a.getAttribute("done")) {

              if (a.text != null && a.text.length > 0) {
                var thumb = createThumbnail(href);
      					var linka = document.createElement("a");
      					linka.href = href;
      					linka.insertBefore(thumb, linka.firstChild);
      					aParent.parentNode.insertBefore(linka, aParent.parentNode.firstChild);
      					a.setAttribute("done", "done");
      					t++;
      					aParent.parentNode.style.clear = "left";
      					if (t > 1 && prevA == null) {
      					   aParent.parentNode.style.paddingTop = "12px";
                }
                prevA = getASIN(getRealURL(href));
    				  }
    				}
    			}
    			a = document.getElementsByTagName("a")[i++];
    		}
			var hrs = document.getElementsByTagName("hr");
			if (hrs != null && hrs.length > 0) {
			    hrs[0].style.clear = "left";
			    hrs[0].style.marginTop = "35px";
			}
	}
	else if (isYahoo(url)) { //just com
		var i = 0;
		var a = document.getElementsByTagName("a")[i++];
		while (a != null) {
			var href = a.href;
			if (href.indexOf("http://") == 0 || href.indexOf("https://") == 0) {
				var aParent = a.parentNode;
				if ((a.getAttribute("class") == "yschttl" || a.getAttribute("class") == "rt") && a.getAttribute("done") != "done") {
					if (a.text != null && a.text.length > 0) {
            var thumb = createThumbnail(href);
  					var linka = document.createElement("a");
  					linka.href = href;
  					linka.insertBefore(thumb, linka.firstChild);
  					aParent.insertBefore(linka, aParent.firstChild);
  					a.setAttribute("done", "done");
  					t++;
				  }
        }
			}
			a = document.getElementsByTagName("a")[i++];
		}
        head = document.getElementsByTagName("head")[0];
        style = document.createElement("style");
        style.setAttribute("type", 'text/css');
        style.innerHTML = "\n#yschweb>OL>LI { height: 105px; clear: both; }\n";
        style.innerHTML += "\n#west>OL>LI { height: 105px; clear: both; }\n";
        head.insertBefore(style, head.lastChild);
	}

	if (t > 0) {
	   	document.getElementsByTagName("head")[0].setAttribute("done", "done");
    }
}

function reloadLocation() {
    	if (isEngine(document.location.href)) {
    		document.location.reload();
    	}
}

function isGoogle(href) {
	if (href.indexOf(".google.") == -1) {
		return false;
	}
	if (href.indexOf("news.google.") >= 0) {
		return false;
	}
	if (href.indexOf("blogsearch.google.") >= 0) {
		return false;
	}
	if (href.indexOf("images.google.") >= 0) {
		return false;
	}
	return true;
}

function isYahoo(href) {
    return href.match(/http:\/\/.*search\.yahoo\.com\/search/i);
}

function isEngine(href) {
	return isGoogle(href) || isYahoo(href);
}


function GP_main(focus)
{

	var url = window.document.location.href;
	var locationBarSearch = url.match(/^keyword:(.+)$/i)

	if (locationBarSearch) {
		url = GP_getPrefs().getCharPref("keyword.URL") + locationBarSearch[1];
	}

	if (!isEngine(url)) {
		return;
	}

	if (focus) {
		if (window.document && window.document.getElementById("nn"))
			;
		else
			return;
	}

	amazonifiy();
	if (ENABLE_IMAGE_INSERT) {
		if (isGoogle(url))
			stockify();
		thumbshots(url);
	}
}


window.addEventListener("load",function() {GP_main(false);} ,true);
window.addEventListener("focus",function() {GP_main(true);} ,true);
