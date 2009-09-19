// ==UserScript==
// @name Operapedia (similar to the Googlepedia extension for Firefox)
// @author scipio 
// @namespace http://home.wanadoo.nl/sipke.reina/opera/index.html 
// @version 2.0
// @description  Adds a Wikipedia section to Google's result pages
// ==/UserScript==


/* 
 * This script is granted to the public domain.
 */
 
/* To find the changelog of all previous operapedia versions, please scroll down. */

function getScriptSettings(){
    // USER SETTINGS - USER SETTINGS - USER SETTINGS - USER SETTINGS - USER SETTINGS - USER SETTINGS - USER SETTINGS
    
    // The Wikipedia iframe can be shown and hidden by clicking on 'Wikipedia'; this setting sets the initial state.
    var ShowWikipediaByDefault = true; 
    
    // If the following string is left empty, the script will detect the Wikipedia language. You can force the script
    // to use a specific language by assigning a language code to this variable.
    // (See http://meta.wikimedia.org/wiki/Complete_list_of_language_Wikipedias_available for valid codes)
    var DefaultWikiLanguage = '';   // e.g., 'en', 'fr', or 'de'.
    
    // Enter a language code for an alternative Wikipedia language that you would like to easily switch to.
    var SecondaryWikiLanguage = 'en';
    
    // Enable or disable the automatic detection of a secondary language.
    var EnableAutomaticSecondaryLanguage = true;
    
    // Choose whether links to the same article in other languages should be shown.
    var ShowOtherLanguages = true;
    
    // Set whether the link to the original Wikipedia article should open in a new tab (if false, it will open in the same tab).
    var LinkToWikipediaOpensInNewPage = true;
    
    // Limit Wikipedia article height so that it doesn't take more space than Google results.
    var LimitWikipediaHeight = false;

    // END OF USER SETTINGS - END OF USER SETTINGS - END OF USER SETTINGS - END OF USER SETTINGS - END OF USER SETTINGS
    return [ShowWikipediaByDefault, DefaultWikiLanguage, SecondaryWikiLanguage, EnableAutomaticSecondaryLanguage, ShowOtherLanguages, LinkToWikipediaOpensInNewPage, LimitWikipediaHeight];
}
 
/* VERSION INFORMATION

2.0 RC1
- improved recognition of Google search results
- improved support for Czech language in Google
- added support for Yahoo! Search (and made Yahoo! results' URLs readable)
- removed some more unneeded notices from Wikipedia articles
- height of Wikipedia article can now be limited to screen height (which restores pre-1.7 lay-out)
- fixed external links in Wikipedia articles
- improved script efficiency here and there
- added user interface for script settings (settings are stored in cookies)

1.7
- changed links to open Wikipedia keywords in either Google or Wikipedia so that they have a links context menu

1.7 RC2
- small CSS fix in Wikipedia article
- added some DOM trickery to support Opera Kestrel

1.7 RC1
- removed lines referring to donations etc. from Wikipedia which sometimes became illegible
- changed script section that allows Wikipedia to be loaded in an iframe
- removed several search fields from Wikipedia's search page (that is shown when no article is found)
- added loading indicator when Wikipedia article is loading
- Wikipedia articles no longer have their own scrollbar, since they're no longer displayed in an iframe
- table of contents in Wikipedia articles is collapsed by default
- other languages for Wikipedia article are now shown in a dropdown menu in the blue page header
- links to other languages for Wikipedia article can be hidden 
- Google page links moved to left-hand side of screen
- Wikipedia article only shown on Google's first results page
- fixed error that caused "Wikipedia" to be displayed too large in some cases
- changed Wikipedia links option that allowed to do a new Google search or just open the corresponding Wikipedia article (removed "diamond" links

1.6.6
- solved compatibility problem with CustomizeGoogle UserScript (suggested by Tom)

1.6.5
- fixed regression that styled the regular Wikipedia page as the Wikipedia iframe in Operapedia (thanks Sombria)

1.6.4
- fixed removal of Wikipedia links from Google results
- disambiguation pages are no longer automatically hidden 
- fix for changed Wikipedia code that stopped script from hiding unnecessary elements on Wikipedia pages
- improved ad removal (suggested by Sombria)

1.6.3
- fix for changed Wikipedia code (submitted by Sombria)

1.6.2
- fix for changed Wikipedia code / improved recognition of "no results" pages in Wikipedia
- Wikipedia iframe stays visible when a link is clicked on a "no results" page
- improved check for conditions for hiding or showing Wikipedia iframe

1.6.1
- improved ads removal (suggested by Sombria)
- fix for changed Wikipedia code

1.6
- Wikipedia is now hidden by default if there is no Wikipedia result (i.e. no article or disambiguation page) 
  for the Google search
- fixed a typo that broke secondary language links
- added variable to enable/disable the automatic detection of a secondary language

1.5.3 (small bug fixes by GT500)
- fixed issue with Google detecting removal of ads by Operapedia script, and not printing description of 
  search results (fix proposed by bmisiekb on Opera Forums)
- added fix mentioned by Stoen to repair 1.5.2 script, and restore Wikipedia iFrame
- changed line mentioned by scipio to fix a possibly redundant conditional statement that was discovered by 
  Stoen

1.5.2
- added recognition of alternative coding of Google results page
- script is only enabled on www.google.* pages (i.e., not on Google Images Search etc.)
- all Wikipedia links are now displayed as on disambiguation pages: new links are added to start a new Google search
- added link to list of Wikipedia articles in other languages

1.5.1
- secondary language links give the option to revert to original language (with original search query!)
- improved recognition of Wikipedia links in Google results
- fixed link to show/hide ToC in Wikipedia section
- fixed Japanese Wikipedia address
- improved recognition of links in Wikipedia articles that should start a new Google search
- links on Wikipedia search pages now work like links on disambiguation pages (see changes of v1.3)

1.5 
- further improved automatic detection of secondary Wikipedia language 
- fixed problem with certain escaped characters in Wikipedia links
- fixed redrawing problem that sometimes occurred when the expanded Wikipedia section
  was hidden

1.4.2
- restored automatically detected secondary link (got broken in 1.4 or 1.4.1)
- fixed problem where secondary language would not work if a default language was selected

1.4.1
- restored check for Wikipedia header that was removed when the removeEventListener was added

1.4
- improved automatic detection of secondary Wikipedia language 
- added user-defined secondary Wikipedia language
- Wikipedia article will not load until it is made visible (either by setting ShowWikipediaByDefault  
  to true or by clicking on 'Wikipedia' in the headers)
- added removeEventListener

1.3
- fixed error that occurred when Google search term was at the end of the URL (Wikipedia would not load)
- links in the Wikipedia section now also start a new Google search, except for links on disambiguation 
  pages, after which a new link is added to start a separate Google search
- if one of the Google results corresponds to the Wikipedia article shown in the iframe, it is removed  
  from the results list
- link to open Wikipedia result is now a direct url rather than a search url
- link is added to change Wikipedia language based on the search results' TLDs
- language of Wikipedia is based on language parameter in Google URL if available

1.2
- fixed behavior when Google returns no results
- removed option to try Wikipedia article URLs directly; Wikipedia search is used now

1.1
- added automatic detection of LTR/RTL languages
- removed user setting related to LTR/RTL
- added expand/collapse button

1.0 
- first working version
*/


// SCRIPT STARTS HERE - NOT TO BE EDITED (UNLESS YOU KNOW WHAT YOU'RE DOING)

// identify search engine used
if(window.location.href.indexOf('http://www.google.') == 0 && !window.location.href.match(/&start=[^0]/)){
    var st = window.location.href.match(/[\?&]q=(.*?)(&|$)/);
    if(st) initOperapedia('Google', st[1]);
}

else if(window.location.href.match(/^http:\/\/(\w+\.)?search.yahoo.com\//)){
    var sFirstPage = window.location.href.match(/&pstart=1&b=(\d+)/);
    if(!sFirstPage || sFirstPage[1] == '1'){
        var st = window.location.href.match(/[\?&]p=(.*?)(&|$)/);
        if(st) initOperapedia('Yahoo', st[1]);
    }
}

else if(window.location.href.indexOf('.wikipedia.org') > -1 && top != self){
     // send Wikipedia article to Google page
     document.addEventListener(
        'message',
        function(ev){
            if(ev.uri.indexOf('http://www.google.') != 0 && !ev.uri.match(/^http:\/\/(\w+\.)?search.yahoo.com\//)) return;

            var arrSettings = ev.data.split(',');
            for(var i=0, ai; ai = arrSettings[i]; i++) arrSettings[i] = (ai == 'true');
            var sText = '';
            var eleContent = document.getElementById('content');
            
            // fix image src's
            var allLinks = eleContent.getElementsByTagName('img');
            for(var i = 0, ai; ai = allLinks[i]; i++) ai.src = ai.src;
            
            // fix link href's
            var allLinks = eleContent.getElementsByTagName('a');
            for(var i = 0, ai; ai = allLinks[i]; i++) ai.href = ai.href;
            
            // get Wikipedia stylesheet main.css
            sText = '';
            if(arrSettings[1]){
                allLinks = document.styleSheets;
                sText = '<style type="text/css" id="wikistyleforoperapedia">';
                sText += ReturnWikiStyle(allLinks, 'main.css') + '\n';
                sText += ReturnWikiStyle(allLinks, 'shared.css') + '\n';
                sText += ReturnWikiStyle(allLinks, 'mediawiki:common.css') + '\n';
                sText += '#operapedia_div { font-size: 11px; background: #fff; padding-left: 20px;} \n';
                sText += '#operapedia_div > #bodyContent { overflow: auto; } \n';
                sText += '#administrator, #coordinates, #siteNotice { display: none !important } \n';
                sText += '</style> \n';
            };
            
            // create Wikipedia language selector
            allLinks = (arrSettings[0])? document.getElementById('p-lang') : null;
            if(allLinks){
                allLinks = allLinks.getElementsByTagName('a');
                sText += '<select id="languageselector" onchange="javascript:ChangeWikiURL(this.value)" style="font-size:11px"> \n';
                sText += '<option>' + document.getElementById('p-lang').getElementsByTagName('h5')[0].innerText + '</option> \n';
                for(var i = 0, lii; lii = allLinks[i]; i++) 
                    sText += '<option value="' + lii.href + '">' + lii.innerText + '</option> \n';
                sText += '</select> \n';
            }
            
            // send article contents back to main document
            if(document.getElementById('ca-article') || document.getElementById('ca-nstab-special')){
                    ev.source.postMessage('SpecialPage' + sText + document.getElementById('content').innerHTML)}
            else { ev.source.postMessage(sText+document.getElementById('content').innerHTML) };
        }, false);
        
    // don't display education and donation links  
    window.opera.defineMagicVariable(
       'wgUserName',
       function(){return 'dont_show_donation_links'},
       null);
       
    // disable additional search fields on Wikipedia search page
    window.opera.defineMagicFunction(
       'SpecialSearchEnhanced',
       function(){return true});
       
    // allow Wikipedia to be loaded in an iframe
    window.opera.defineMagicVariable(
        'wgBreakFrames',
        function(){return false},
        null)
}
   
// start Operapedia
function initOperapedia(searchEngine, searchTerm){
    // read Operapedia settings
    var arrSettings = readSettings();
    var ShowWikipediaByDefault = arrSettings[0]; 
    var DefaultWikiLanguage = arrSettings[1];
    var SecondaryWikiLanguage = arrSettings[2];
    var EnableAutomaticSecondaryLanguage = arrSettings[3];
    var ShowOtherLanguages = arrSettings[4];
    var LinkToWikipediaOpensInNewPage = arrSettings[5];
    var LimitWikipediaHeight = arrSettings[6];
    arrSettings = null;
    
    var searchTlds;
    switch(searchEngine){
        case 'Google':
            searchTlds = getGoogleTLDs(); break;
        case 'Yahoo':
            searchTlds = getYahooTLDs(); break;
        default: 
            opera.postError('Unknown search engine'); return;
    }
    // load image
    var imgLoading = getImage('Loading');
    
    // identify primary language
    var wikiSubdomain = (DefaultWikiLanguage == '')? getPrimaryLanguage(searchEngine, window.location.href, searchTlds) : DefaultWikiLanguage;
    if(SecondaryWikiLanguage == wikiSubdomain) SecondaryWikiLanguage = '';
    
    // set Wikipedia url matching primary language
    var strLTR = true; 
    var strWikiTitle = 'Wikipedia';
    var strWiki = 'http://' + wikiSubdomain + '.wikipedia.org/w/wiki.phtml?go=GO&search=';
          
    // start results page modifications  
    window.opera.addEventListener(
        'AfterEventListener.load',
        function(){
            window.opera.removeEventListener('AfterEventListener.load', arguments.callee, false);
            if(document.getElementsByTagName('body')[0].hasAttribute('dir') && document.getElementsByTagName('body')[0].getAttribute('dir') == 'rtl') strLTR = false;
                        
            // create link to show/hide Wikipedia
            var eleTemp = createShowHideLink(strWikiTitle, strWiki, searchTerm, ShowWikipediaByDefault);            
            
            // change page header
            var frag, eleWikiHeader;              
            switch(searchEngine){
                case 'Google':
                    eleTemp.style = 'cursor: pointer; font-weight: bold; color: #000;';
                    if(document.getElementById('sd')) eleTemp.style.fontSize = window.getComputedStyle(document.getElementById('sd'), null).getPropertyValue('font-size');
                    eleWikiHeader = changeGoogleHeader(strWikiTitle);
                    frag = document.createDocumentFragment();
                    break;
                case 'Yahoo':
                    eleTemp.style = 'cursor: pointer; font-weight: bold';
                    eleWikiHeader = changeYahooHeader();
                    frag = document.createElement('div');
                    frag.style = 'float: right; margin-right: 8px; text-align: right; line-height: 13px';
                    break; 
            }
            frag.appendChild(eleTemp);
            frag.appendChild(createSettingsLink());
            frag.appendChild(document.createElement('br'));
                    
            // add link to open Wikipedia (in the same or in a separate tab)
            frag.appendChild(createOpenWikipediaLink(LinkToWikipediaOpensInNewPage));
            
            // add links for Wikipedia: expand/collapse and secondary language
            if(strLTR){ 
                frag.insertBefore(createExpandCollapseLink(strLTR), frag.childNodes[3]);
                frag.insertBefore(createSecondaryLanguageLink(SecondaryWikiLanguage), frag.childNodes[3]);
                if(SecondaryWikiLanguage) 
                    frag.insertBefore(createAutoSecondaryLanguage(SecondaryWikiLanguage), frag.childNodes[3]);
            } else { 
                frag.childNodes[3].appendChild(createExpandCollapseLink(strLTR));
                frag.childNodes[3].appendChild(createSecondaryLanguageLink(SecondaryWikiLanguage));
                if(SecondaryWikiLanguage) 
                    frag.childNodes[3].appendChild(createAutoSecondaryLanguage(SecondaryWikiLanguage))    
            }
            
            // insert Wikipedia links into page header
            switch(searchEngine){
                case 'Google':
                    if(eleWikiHeader){ 
                        eleWikiHeader.appendChild(frag);
                        while(eleWikiHeader.nodeName != 'TABLE') eleWikiHeader = eleWikiHeader.parentNode;
                    }
                    changeGoogleStyle(LimitWikipediaHeight);
                    break;
                case 'Yahoo':
                    if(eleWikiHeader) eleWikiHeader.insertBefore(frag, eleWikiHeader.firstChild);
                    changeYahooStyle();
                    break;                        
            }                         
            // add WikiPedia results
            var t = eleWikiHeader.nextSibling;
            while(t.nodeType != 1) t = t.nextSibling;
            var ShowWikipediaIframe = ShowWikipediaByDefault;
            var ifr = document.createElement('iframe');
            ifr.setAttribute('id', 'operapedia_iframe');
            ifr.style.display = 'none';
            t.parentNode.insertBefore(ifr, t);
                              
            // create popup for Wikipedia links
            document.body.appendChild(createPopup(searchEngine));
            
            // add Wikipedia block
            var idiv = document.createElement('div');
            idiv.setAttribute('id', 'operapedia_div');
            idiv.addEventListener('click', function(e){ clickOnPopup(e, searchEngine); }, false);
            if(strLTR){ idiv.style = 'width: 50%; float: right; margin: 4px 0 20px 20px; display: none' }
            else { idiv.style = 'width: 50%; float: left; margin: 4px 20px 20px 0; display: none' };
            if(LimitWikipediaHeight){
                idiv.style.overflow = 'auto';
                idiv.style.height = '100%';
                if(document.getElementById('yschres')) 
                    idiv.style.height = window.getComputedStyle(document.getElementById('yschres'), null).getPropertyValue('height');
                //if(document.getElementById('res')) idiv.style.height = window.getComputedStyle(document.getElementById('res'), null).getPropertyValue('height');
            }
            t.parentNode.insertBefore(idiv, ifr);
            idiv.parentNode.insertBefore(document.createElement("div"), idiv);
            
            // display Wikipedia article
            if(ShowWikipediaIframe){
                ChangeWikiURL(strWiki + searchTerm);
                idiv.style.display = 'block';
            }
            
            // Wikipedia changes
            ifr.addEventListener( 
                'load', 
                function(){
                    // prevent Wikipedia article from being reloaded when Back command of browser is used
                    if(document.getElementById('operapedia_div').childNodes.length != 1) return;
                    
                    var sSettings = [ShowOtherLanguages, (document.getElementById('wikistyleforoperapedia') == null)];
                    document.getElementById('operapedia_iframe').contentDocument.postMessage(sSettings); 
                }, false );
            document.addEventListener(
                'message',
                function(ev){
                    if(!ev.uri.match(/^http:\/\/\w+\.wikipedia\.org\/w/)) return;
                                        
                    var eleTemp = document.getElementById('openWikilink');
                    eleTemp.href = ev.uri;
                    eleTemp.setAttribute('title', ev.uri.substring(0, ev.uri.indexOf('/wiki/'))); 
                    var blnSpecial = (ev.data.indexOf('SpecialPage') == 0);
                    var sHTML = blnSpecial? ev.data.replace('SpecialPage', '') : ev.data;
                    
                    // determine whether Wikipedia article should be shown or hidden
                    var strShowHideStatus = document.getElementById('ShowHideLink').getAttribute('alt');
                    if(strShowHideStatus.indexOf('Default') >- 1){
                        if(blnSpecial){
                            ShowWikipediaIframe = false;
                            document.getElementById('ShowHideLink').setAttribute('alt', 'HideUser')
                        } else { ShowWikipediaIframe = ShowWikipediaByDefault }
                    } else { ShowWikipediaIframe = (strShowHideStatus == 'ShowUser') }
                    var odiv = document.getElementById('operapedia_div');
                    odiv.style.display = (ShowWikipediaIframe) ? "block" : "none";
                                               
                    // insert Wikipedia article into Google page
                    odiv.innerHTML = sHTML;
                    
                    // collapse table of contents; repair toggle function
                    var toc = document.getElementById('toc');
                    if(toc){
                        toc.getElementsByTagName('ul')[0].style.display = 'none';
                        var lnk = document.getElementById('togglelink');
                        lnk.innerText = '+';
                        lnk.onclick = 'var t=document.getElementById("toc").getElementsByTagName("ul")[0];if(t.style.display=="none"){t.style.display="block";this.innerText="-"}else{t.style.display="none";this.innerText="+"};return false;';
                        lnk.href = '';
                    }
                    
                    // move language selector to header
                    var ls = document.getElementById('languageselector');
                    var ll = document.getElementById('secondaryLanguagelink');
                    if(!ll) ll = document.getElementById('languagelink');
                    if(ls && ll){
                        ll = ll.parentNode;
                        ls.style.marginRight = '0.5em';
                        if(strLTR){
                            ll.parentNode.insertBefore(ls.parentNode.removeChild(ls), ll); 
                        } else {
                            ll.parentNode.appendChild(ls.parentNode.removeChild(ls));
                        }
                        // adjust header height so that Wikipedia links + language selector fits (Yahoo only)
                        var eleBlueHeader = document.getElementById('yschinfo') || document.getElementById('info');
                        if(eleBlueHeader) eleBlueHeader.style.height = window.getComputedStyle(eleBlueHeader.getElementsByTagName('div')[0], null).getPropertyValue('height'); 
                    }
                    var intMax = 0, strMax, strTld;
                    var arrTlds = new Array; 
                    var sSource = ev.uri.toLowerCase();
                    switch(searchEngine){
                        case 'Google':
                            tlink = EnableAutomaticSecondaryLanguage? document.getElementById('res').getElementsByTagName('a') : [];     
                            for(i = 0, ai; ai = tlink[i]; i++){
                                if(ai.getAttribute('class') == 'l'){
                                    // remove Wikipedia from Google results
                                    if(ai.href.toLowerCase() == sSource){
                                        ai.parentNode.parentNode.style.display = 'none';
                                    } else {    
                                        // detect secondary Wikipedia language based on Translate links in Google results...
                                        var tempLink = ai.parentNode.nextSibling;
                                        tempLink = (tempLink && tempLink.hasChildren)? tempLink.childNodes[1] : null;
                                        if(tempLink && tempLink.className == 'fl' && tempLink.href.indexOf('http://translate.google.') == 0){
                                            strTld = tempLink.href.match(/\&sl=(\w{2})/)[1];
                                        } else { 
                                        // ... or based on results' TLDs
                                            var strDom = ai.href.replace(/.*\/\/(.+?)\/.*/,'$1')+'';
                                            var strExt = strDom.replace(/.*\.(\w+)$/,'$1');
                                            strTld = (searchTlds[strExt] || searchTlds['com.' + strExt] || searchTlds['co.' + strExt]);
                                        }
                                        if(strTld && strTld != wikiSubdomain && strTld != SecondaryWikiLanguage){
                                            if(!arrTlds[strTld]){ arrTlds[strTld] = '1' 
                                            } else { arrTlds[strTld] = arrTlds[strTld] - (-1) };
                                            if(arrTlds[strTld] > intMax){ 
                                                intMax = arrTlds[strTld]; 
                                                strMax = strTld 
                                            };
                            }}}}
                            break;            
                        case 'Yahoo':
                            tlink = EnableAutomaticSecondaryLanguage? document.getElementById('yschres').getElementsByTagName('a') : [];
                            for(i = 0, ai; ai = tlink[i]; i++){
                                if(ai.getAttribute('class') == 'yschttl'){
                                    // make result links readable
                                    ai.href = unescape(ai.href.substring(ai.href.lastIndexOf('http%3A//'), ai.href.length).toLowerCase());
                                    
                                    // remove Wikipedia from Yahoo results
                                    if(ai.href == sSource){
                                        ai.parentNode.parentNode.style.display = 'none';
                                    } else {    
                                        // detect secondary Wikipedia language based on Translate links in Yahoo results...
                                        var tempLink = ai.parentNode.getElementsByTagName('a');
                                        if(tempLink && tempLink[1] && tempLink[1].href.indexOf('.babelfish.yahoo.com/') > -1){
                                            strTld = tempLink[1].href.match(/\&lp=(\w{2})/)[1];
                                        } else { 
                                        // ... or based on results' TLDs
                                            var strDom = ai.href.replace(/.*\/\/(.+?)\/.*/,'$1')+'';
                                            var strExt = strDom.replace(/.*\.(\w+)$/,'$1');
                                            strTld = (searchTlds[strExt] || searchTlds['com.' + strExt] || searchTlds['co.' + strExt]);
                                        }
                                        if(strTld && strTld != wikiSubdomain && strTld != SecondaryWikiLanguage){
                                            if(!arrTlds[strTld]){ arrTlds[strTld] = '1' 
                                            } else { arrTlds[strTld] = arrTlds[strTld] - (-1) };
                                            if(arrTlds[strTld] > intMax){ 
                                                intMax = arrTlds[strTld]; 
                                                strMax = strTld 
                                            };
                            }}}}
                            break;
                    }
                    
                    // set automatically detected secondary Wikipedia language
                    if(strMax) setSecondaryLanguage(searchTerm, SecondaryWikiLanguage, strMax, strLTR);
                    
                    eleTemp = null; frag = null; eleHeader = null; ePop = null; idiv = null; styl = null; ifr = null; odiv = null;
                }, false);
            
            // remove ads and <nobr> tags          
            if(searchEngine == 'Google') removeGoogleAds();
            removeNobrTags();
    }, false);   
}

function changeGoogleStyle(blnLimitHeight){
    // make sure Google page links are displayed directly under the search results
    if(!blnLimitHeight){
        var eleTemp = document.getElementById('res');
        if(eleTemp) eleTemp = eleTemp;
        for(var i = 0, bri; bri = eleTemp[i]; i++) 
            if(bri.getAttribute('clear') == 'all' && bri.parentNode.id == 'res')
                bri.parentNode.removeChild(bri);
    }
    eleTemp = document.getElementById('mbEnd');
    if(eleTemp) eleTemp.parentNode.removeChild(eleTemp);
}

function changeGoogleHeader(sTitle){
    var t = document.getElementsByTagName('table');
    if(!t || t.length == 0) return false;
    var i = 0;
    while(t[i] && t[i].getAttribute('bgcolor') != '#e5ecf9' && t[i].getAttribute('class') != 't bt') i++;
    if(i == t.length) return;
    t = t[i];

    var eleHeader = t.getElementsByTagName('td');
    var frag = document.createDocumentFragment();
    var blnResultsFound = (eleHeader.length > 1);
    if(!blnResultsFound || eleHeader[1].innerHTML.indexOf(sTitle) < 0){               
        // move Google results stats to the left
        if(blnResultsFound){
            frag.appendChild(document.createElement('br'));
            frag.appendChild(eleHeader[1].removeChild(eleHeader[1].firstChild));
            eleHeader[0].appendChild(frag);
        }
        eleHeader[0].style.padding = '0 4px 4px 4px';
        var sInternet = eleHeader[0].childNodes[0];
        sInternet.innerText = sInternet.innerText.replace(/^\s/,'');
        if(!blnResultsFound){
            eleHeader[0].parentNode.appendChild(document.createElement('td'));
            eleHeader[1].style.textAlign = 'right';
        }
        eleHeader[1].style.padding = '0 4px 4px 4px';
    }
    return eleHeader[1];
}

// load a Wikipedia article
function ChangeWikiURL(ref){
    // remove current language selector
    var eleTemp = document.getElementById('languageselector');
    if(eleTemp) eleTemp.parentNode.removeChild(eleTemp);

    // try to reduce number of times Wikipedia stylesheets are read
    var eleTemp = document.getElementById("operapedia_div");
    if(eleTemp && eleTemp.childNodes.length > 0){
        var elC = eleTemp.firstChild;
        if(elC.nodeType == 1 && elC.nodeName == 'STYLE')
            document.getElementsByTagName('head')[0].appendChild(eleTemp.removeChild(elC));
    }
    
    // set status of Wikipedia section to "Loading..."
    eleTemp.innerHTML = '<p style="font-size:11px;"><img src="' + getImage('Loading') + '"><br><span>Loading...</span></p>';
    document.getElementById("openWikilink").href = ref;
    var eleTemp = document.getElementById("operapedia_iframe");
    eleTemp.src = ref;
    var eleRes = document.getElementById("res");
    if(!eleRes) eleRes = document.getElementById("yschres");
    eleRes.parentNode.insertBefore(eleTemp.parentNode.removeChild(eleTemp), eleRes);
}

function changeYahooHeader(){
    var t = document.getElementById('yschinfo');
    if(t){ // "old" Yahoo (nl.search.yahoo.com etc.)
        var eleHeader = t.firstChild;
        if(eleHeader.nodeType == 3 || eleHeader.nodeName != 'DIV'){               
            // move Yahoo results stats to the left
            eleHeader = t.getElementsByTagName('p');
            if(eleHeader){
                eleHeader = eleHeader[0];
                eleHeader.style.textAlign = 'left';
                eleHeader.style.marginLeft = '8px';
                eleHeader.insertBefore(document.createElement('br'), eleHeader.firstChild);
            }                    
        }
    } else { // "new" Yahoo (us.search.yahoo.com etc.)
        t = document.getElementById('info');
        if(t) t.style = 'margin: 0; text-align: left; float: none;';
    }
    return t;
}

function changeYahooStyle(){
    if(document.getElementById('yschsec')) document.getElementById('yschsec').style = 'display: none !important';
    document.getElementById('yschcont').style = 'margin-left: 0 !important; float: none !important;';
    document.getElementById('yschpri').style = 'margin: 0 !important;'; 
    document.getElementById('yschweb').style = 'width: 100% !important;';
    document.getElementById('yschweb').getElementsByTagName('ol')[0].style = 'margin-left: 20px;';
    if(document.getElementById('yschpg')) document.getElementById('yschpg').style = 'clear: none;';
    if(document.getElementById('pg')) document.getElementById('pg').style = 'clear: none;';
    if(document.getElementById('ft')) document.getElementById('ft').style = 'clear: both;';
    var eleTemp = document.getElementById('yschpri').getElementsByTagName('li');
    for(var i = 0, ai; ai = eleTemp[i]; i++){
        ai.style = 'margin-left: 0';
        var eleDivs = ai.getElementsByTagName('div');
        for(var j = 0, aj; aj = eleDivs[j]; j++) aj.style = 'width: auto !important';
    }
}
    
function clickOnPopup(ev, sEngine){
    var sEle = ev.target;
    var ePop = document.getElementById('LinkPop');
    ePop.style.display = 'none';
    if(!sEle || sEle.nodeType != 1) return; 
    if(sEle.nodeName == 'IMG') sEle = sEle.parentNode;
    if(sEle.nodeName == 'A'){
        var sRealHref = sEle.href;
        var sSetHref = sEle.getAttribute('href');
        if(!sSetHref || sSetHref.charAt(0) == "#") return;
        if(sSetHref.indexOf('/wiki/') == 0 && sSetHref.indexOf(':') == -1){
            var imgG = ePop.childNodes[0];
            var imgW = ePop.childNodes[1];
            var sLoc = document.getElementById('openWikilink').title;
            
            imgW.onclick = 'javascript:document.getElementById("LinkPop").style.display="none";ChangeWikiURL("' + sLoc + sSetHref + '"); return false;';
            imgW.href = sLoc + sSetHref;
            imgW.title = sLoc + sSetHref;
            
            sLoc = window.location.href.match(/(.+[qp]=)(.*?)(&.+|$)/);
            var sURLf = sLoc[1];
            var sURLs = sLoc[3];
            var q = sSetHref.replace('/wiki/','').replace(/_/g, "+");
            imgG.href = sURLf + q + sURLs;
            imgG.title = sEngine + ': ' + q;
            
            ev.preventDefault();
            ePop.style.left = ev.pageX + 10 + 'px !important';
            ePop.style.top = ev.pageY + 3 + 'px !important';
            ePop.style.display = 'block';
            
            function checkClick(){
                if(trev) clearTimeout(trev);
                var trev = setTimeout(function(){ document.getElementById('LinkPop').style.display = 'none' }, 3000);
            }
            checkClick();     
        } else if (sSetHref.indexOf('javascript:') == 0){
            ev.preventDefault();                               
        } else if (sSetHref.indexOf('/w/') == 0 || (sSetHref.indexOf(':') > -1 && sSetHref.indexOf('http') == -1)){
            ev.preventDefault();
            window.location.href = document.getElementById('openWikilink').title + sSetHref;
        }
    }
}

function createAutoSecondaryLanguage(sSecLang){
    var tspan = document.createElement('span');
    tspan.style.fontSize = '11px';
    tspan.appendChild(document.createTextNode('['));
    var eleTemp = document.createElement('a');
    eleTemp.style.cursor = 'pointer';
    eleTemp.setAttribute('id', 'secondaryLanguagelink');
    eleTemp.onclick = 'javascript:var lng=document.getElementById("operapedia_iframe").src.match(/http:\\/\\/(\\w+?)\\./)[1]+"";ChangeWikiURL("http://"+this.innerText+".wikipedia.org/w/wiki.phtml?go=GO&search='+st+'");this.innerText=lng;';
    eleTemp.appendChild(document.createTextNode(sSecLang));
    tspan.appendChild(eleTemp);
    tspan.appendChild(document.createTextNode('] '));
    return tspan;
}

function createExpandCollapseLink(strLTR){
    var tspan = document.createElement('span');
    tspan.style.fontSize = '11px';
    tspan.setAttribute('id', 'expandcollapse');
    tspan.appendChild(document.createTextNode('['));
    var eleTemp = document.createElement('a');
    eleTemp.style.cursor = 'pointer';
    if(strLTR){
        eleTemp.setAttribute('onclick', 'javascript:var frm=document.getElementById("operapedia_div");if(frm.style.width=="50%"){frm.style.width="100%";frm.style.margin="0";frm.style.float="none";this.childNodes[0].nodeValue=">>"}else{frm.style.width="50%";frm.style.margin="0 0 20px 20px";frm.style.float="right";this.childNodes[0].nodeValue="<<"}');
    } else {
        eleTemp.setAttribute('onclick', 'javascript:var frm=document.getElementById("operapedia_div");if(frm.style.width=="50%"){frm.style.width="100%";frm.style.margin="0";frm.style.float="none";this.childNodes[0].nodeValue="<<"}else{frm.style.width="50%";frm.style.margin="0 20px 20px 0";frm.style.float="left";this.childNodes[0].nodeValue=">>"}');
    }
    eleTemp.appendChild(document.createTextNode(''));
    eleTemp.childNodes[0].nodeValue = (strLTR)? '<<' : '>>';
    tspan.appendChild(eleTemp);
    tspan.appendChild(document.createTextNode('] '));
    return tspan;
}

function createOpenWikipediaLink(blnOpenInNewPage){
    var tspan = document.createElement('span');
    tspan.style.fontSize = '11px';
    tspan.appendChild(document.createTextNode('['));
    eleTemp = document.createElement('a');
    eleTemp.setAttribute('id', 'openWikilink');
    if(blnOpenInNewPage) eleTemp.setAttribute('target', '_blank');
    eleTemp.appendChild(document.createTextNode('open'));
    tspan.appendChild(eleTemp);
    tspan.appendChild(document.createTextNode('] '));
    tspan.setAttribute('dir', 'LTR');
    return tspan;
}

function createPopup(sEngine){
    var ePop = document.createElement('div');
    var eleTemp = document.createElement('a');
    eleTemp.appendChild(document.createElement('img'));
    eleTemp.firstChild.src = getImage(sEngine);
    eleTemp.firstChild.setAttribute('alt', sEngine.charAt(0));
    ePop.appendChild(eleTemp);
    eleTemp = document.createElement('a');
    eleTemp.appendChild(document.createElement('img'));
    eleTemp.firstChild.src = getImage('Wikipedia');
    eleTemp.firstChild.setAttribute('alt', 'W');
    ePop.appendChild(eleTemp);
    ePop.style = 'position: absolute; background: #fff; display: none; cursor: pointer';
    ePop.setAttribute('id', 'LinkPop');
    return ePop;
}

function createSecondaryLanguageLink(sSecLang){
    var tspan = document.createElement('span');
    tspan.style.fontSize = '11px';
    tspan.style.display = 'none';
    if(!sSecLang) tspan.appendChild(document.createTextNode('['));
    var eleTemp = document.createElement('a');
    eleTemp.style.cursor = 'pointer';
    eleTemp.setAttribute('id', 'languagelink');
    eleTemp.appendChild(document.createTextNode(' '));
    tspan.appendChild(eleTemp);
    tspan.appendChild(document.createTextNode('] '));
    return tspan;
}

function createSettingsLink(){
    var eleTemp = document.createElement('img');
    eleTemp.style = 'cursor: pointer; margin-left: 4px';
    eleTemp.setAttribute('src', getImage('Settings'));
    eleTemp.onclick = 'displaySettings()';
    eleTemp.title = 'Operapedia settings';
    return eleTemp;
}

function createSettingsPanel(){
    // create container
    var eleOPSettings = document.createElement('div');
    eleOPSettings.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: url(' + getImage('SettingsBG') + '); direction: ltr'; 
    eleOPSettings.setAttribute('id', 'OperapediaSettings');
    var eleContainer = document.createElement('div');
    eleContainer.style = 'color: #000; width: 50%; margin: 30% auto auto auto; padding: 4px 8px; font-size: 80%; background: #ffc; border: solid 4px #000;'
    
    // create close link
    var eleBtn = document.createElement('img');
    eleBtn.style = 'display: block; float: right; cursor: pointer;';
    eleBtn.src = getImage('CloseButton');
    eleBtn.setAttribute('id', 'setCloseButton');
    eleContainer.appendChild(eleBtn);
        
    // create text
    eleText = document.createElement('h2');
    eleText.style = 'font-size: 100%; margin-top: 0;';
    eleText.appendChild(document.createTextNode('Operapedia Settings for ' + window.location.hostname));
    eleContainer.appendChild(eleText);
    
    var eleFrm = document.createElement('form');
    
    var elePara = document.createElement('p');
    var elem = document.createElement('input');
    elem.setAttribute('type', 'checkbox');
    elem.setAttribute('id', 'setDefaultShow');
    elePara.appendChild(elem);
    elem = document.createElement('label');
    elem.style.marginLeft = '8px';
    elem.appendChild(document.createTextNode('Show Wikipedia section by default'));
    elePara.appendChild(elem);
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elem = document.createElement('input');
    elem.setAttribute('type', 'checkbox');
    elem.setAttribute('id', 'setOtherLanguages');
    elePara.appendChild(elem);
    elem = document.createElement('label');
    elem.style.marginLeft = '8px';
    elem.appendChild(document.createTextNode('Show links to the same Wikipedia article in other languages'));
    elePara.appendChild(elem);
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elem = document.createElement('input');
    elem.setAttribute('type', 'checkbox');
    elem.setAttribute('id', 'setNewTab');
    elePara.appendChild(elem);
    elem = document.createElement('label');
    elem.style.marginLeft = '8px';
    elem.appendChild(document.createTextNode('Make the Open link open the Wikipedia article in a new tab'));
    elePara.appendChild(elem);
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elem = document.createElement('input');
    elem.setAttribute('type', 'checkbox');
    elem.setAttribute('id', 'setLimitHeight');
    elePara.appendChild(elem);
    elem = document.createElement('label');
    elem.style.marginLeft = '8px';
    elem.appendChild(document.createTextNode('Allow the Wikipedia article to be taller than the Google page'));
    elePara.appendChild(elem);
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elePara.style = 'margin-top: 1em; border-top: dotted 1px #000; padding-top: 1em;';
    elePara.appendChild(document.createTextNode('Below you are asked to select Wikipedia languages. Please use a code from '));
    elem = document.createElement('a');
    elem.href = 'http://meta.wikimedia.org/wiki/Complete_list_of_language_Wikipedias_available';
    elem.setAttribute('target', '_blank');
    elem.appendChild(document.createTextNode('Wikipedia\'s list'));
    elePara.appendChild(elem);
    elePara.appendChild(document.createTextNode(' (the code is found in the Wiki column of each table).'));
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elem = document.createElement('label');
    elem.style.marginRight = '8px';
    elem.appendChild(document.createTextNode('Select the Wikipedia language that should be used by default'));
    elePara.appendChild(elem);
    elem = document.createElement('input');
    elem.setAttribute('type', 'text');
    elem.setAttribute('id', 'setWikiLang');
    elem.style.width = '50px';
    elePara.appendChild(elem);
    elePara.appendChild(document.createElement('br'));
    elePara.appendChild(document.createTextNode('(Leave blank if Operapedia should detect the most suitable language)'));
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elem = document.createElement('input');
    elem.setAttribute('type', 'checkbox');
    elem.setAttribute('id', 'setAutoSecondary');
    elePara.appendChild(elem);
    elem = document.createElement('label');
    elem.style.marginLeft = '8px';
    elem.appendChild(document.createTextNode('Let Operapedia detect a secondary language'));
    elePara.appendChild(elem);
    eleFrm.appendChild(elePara);
    
    elePara = document.createElement('p');
    elem = document.createElement('label');
    elem.style.marginRight = '8px';
    elem.appendChild(document.createTextNode('Select a secondary Wikipedia language you would like to use'));
    elePara.appendChild(elem);
    elem = document.createElement('input');
    elem.setAttribute('type', 'text');
    elem.setAttribute('id', 'setSecLang');
    elem.style.width = '50px';
    elePara.appendChild(elem);
    elePara.appendChild(document.createElement('br'));
    elePara.appendChild(document.createTextNode('(Leave blank if you do not want to use a secondary language)'));
    eleFrm.appendChild(elePara);
    eleContainer.appendChild(eleFrm);
    
    elePara = document.createElement('p');
    elePara.style = 'margin-top: 1em; border-top: dotted 1px #000; padding: 1em 0; color: green; font-size: 90%;';
    elePara.appendChild(document.createTextNode('Note: these settings are stored in a separate cookie for each supported search engine. If you delete the cookies on your pc, the settings will be lost as well. To permanently keep Operapedia\'s settings, you can edit the the script file directly. Just open operapedia.js (in your UserScripts folder) with a text editor and follow the instructions in the first 50 lines.'));
    eleContainer.appendChild(elePara);
    
    eleOPSettings.appendChild(eleContainer);
    document.body.appendChild(eleOPSettings);
}

function createShowHideLink(sWikiName, sWikiURL, sTerm, blnShowWiki){
    var elem = document.createElement('a');
    elem.setAttribute('id', 'ShowHideLink');
    if(blnShowWiki){ 
        elem.setAttribute('alt', 'ShowDefault') 
    } else { 
        elem.setAttribute('alt', 'HideDefault')
    }
    elem.setAttribute('onclick', 'javascript:var t=document.getElementById("ShowHideLink");if(t.getAttribute("alt")=="ShowUser"||t.getAttribute("alt")=="ShowDefault"){t.setAttribute("alt","HideUser")}else{t.setAttribute("alt","ShowUser")};var g=document.getElementById("operapedia_iframe");var d=document.getElementById("operapedia_div");if(!g.src)ChangeWikiURL("' + sWikiURL + sTerm + '");if(d.style.display=="block"){d.style.display="none";d.parentNode.insertBefore(document.createElement("div"),d)}else{d.style.display="block";d.parentNode.removeChild(d.previousSibling)};');
    elem.appendChild(document.createTextNode(sWikiName));
    return elem;
}

function displayCurrentSettings(){
    var arrSet = readSettings();
    document.getElementById('setDefaultShow').checked = arrSet[0];
    document.getElementById('setWikiLang').value = arrSet[1];
    document.getElementById('setSecLang').value = arrSet[2];        
    document.getElementById('setAutoSecondary').checked = arrSet[3];
    document.getElementById('setOtherLanguages').checked = arrSet[4];
    document.getElementById('setNewTab').checked = arrSet[5];
    document.getElementById('setLimitHeight').checked = !arrSet[6];
}

function displaySettings(){
    if(document.getElementById('OperapediaSettings')){
        displayCurrentSettings();
        document.getElementById('OperapediaSettings').style.display = 'block';
    } else {
        createSettingsPanel();
        displayCurrentSettings();
        document.getElementById('setCloseButton').onclick = 'document.getElementById("OperapediaSettings").style.display = "none"; saveSettings(); document.body.style.overflow = "auto"';    
    }
    document.body.style.overflow = 'hidden';
}

function getCookieSettings(){
    var arrSettings = new Array;
    arrSettings[0] = readCookie('ShowWikipediaByDefault'); 
    arrSettings[0] = arrSettings[0]? (arrSettings[0] == 'true') : null;
    arrSettings[1] = readCookie('DefaultWikiLanguage');
    arrSettings[2] = readCookie('SecondaryWikiLanguage');
    arrSettings[3] = readCookie('EnableAutomaticSecondaryLanguage'); 
    arrSettings[3] = arrSettings[3]? (arrSettings[3] == 'true') : null;
    arrSettings[4] = readCookie('ShowOtherLanguages'); 
    arrSettings[4] = arrSettings[4]? (arrSettings[4] == 'true') : null;
    arrSettings[5] = readCookie('LinkToWikipediaOpensInNewPage'); 
    arrSettings[5] = arrSettings[5]? (arrSettings[5] == 'true') : null;
    arrSettings[6] = readCookie('LimitWikipediaHeight'); 
    arrSettings[6] = arrSettings[6]? (arrSettings[6] == 'false') : null;
    return arrSettings;
}

function getGoogleTLDs(){
    return {'com':'en','ae':'ar','com.af':'fa','com.ag':'en','off.ai':'en','am':'hy','com.ar':'es','as':'en','at':'de','com.au':'en','az':'az','ba':'bs','com.bd':'bn','be':'nl','bg':'bg','bh':'ar','bi':'fr','com.bo':'es','com.br':'pt','bs':'en','co.bw':'en','com.bz':'en','ca':'en','cd':'fr','cg':'fr','ch':'de','ci':'fr','co.ck':'en','cl':'es','cn':'zh','com.co':'es','co.cr':'es','com.cu':'es','cz':'cs','de':'de','dj':'ar','dk':'da','dm':'en','com.do':'es','com.ec':'es','com.eg':'ar','es':'es','com.et':'am','fi':'fi','com.fj':'en','fm':'en','fr':'fr','gg':'en','com.gi':'en','gl':'da','gm':'en','gr':'el','com.gt':'es','com.hk':'en','hn':'es','hr':'hr','ht':'fr','co.hu':'hu','co.id':'id','ie':'en','co.il':'he','co.im':'en','co.in':'en','is':'is','it':'it','co.je':'en','com.jm':'en','jo':'ar','co.jp':'ja','co.ke':'en','kg':'ru','co.kr':'ko','kz':'ru','li':'de','lk':'si','co.ls':'en','lt':'lt','lu':'fr','lv':'lv','com.ly':'ar','co.ma':'ar','md':'ro','mn':'mn','ms':'en','com.mt':'en','mu':'en','mw':'en','com.mx':'es','com.my':'ms','com.na':'en','com.nf':'en','com.ni':'es','nl':'nl','no':'no','com.np':'ne','nr':'en','nu':'en','co.nz':'en','com.om':'ar','com.pa':'es','com.pe':'es','com.ph':'tl','com.pk':'en','pl':'pl','pn':'en','com.pr':'es','pt':'pt','com.py':'es','ro':'ro','ru':'ru','rw':'fr','com.sa':'ar','com.sb':'en','sc':'en','se':'sv','com.sg':'ms','sh':'en','sk':'sk','sn':'fr','sm':'it','com.sv':'es','co.th':'th','com.tj':'tg','tm':'tk','to':'en','tp':'tet','com.tr':'tr','tt':'en','com.tw':'en','com.ua':'uk','co.ug':'en','co.uk':'en','com.uy':'es','co.uz':'uz','com.vc':'en','co.ve':'es','vg':'en','co.vi':'en','com.vn':'vi','vu':'en','ws':'en','co.za':'en','co.zm':'en'};
}

function getImage(imgname){
    switch(imgname){
        case 'Google':
            return "data:image/gif,GIF89a%10%00%10%00%E6%00%00Dq%D3*g%B9%17%2F%C7%DC%1A%00%FF%FD%F9%D1')%FF%FA%FEYn%B6%F6%FD%FF%F6%FF%F2%179%BA)7%B3H%B7O%88%8F%D5%26.%92%ED%FF%FE%19e%E4%DA%1C%10%CA%D2%D4%2BW%D7%FF%F9%FAS%B6%3B%1AY%F7%FF%F6%FF%E9%FF%FF%CB%26%00%15g%D1%1A_%D6%FA%FF%E1%D5%23%1B%FF%F5%F5%D1%E6%FF%1DF%B2J%B5%3A%14%2B%A5%F6%FB%FE%23%5C%CBM%B2C%FA%FB%FF%E5%F6%FE%F8%FF%FF%FB%FF%FF%F5%FF%EB%FF%FD%FF%FF%FD%FD%F9%FD%FF%F3%FF%FF%F0%FF%FF%EE%FF%F6%FF%F3%FF%E7%F9%FF%FD%FF%E9%FE%FF%F4%FA%FE%EF)0t-%B7%40%1CZ%B1%CA%EA%F9%81%99%DF%CA%D3%F2e%85%D8z%A4%D6%18%22%88%AA%B6%C2%FE%FF%FF%FC%FD%F7%F7%F1%FF%F2%FC%FD%E4%F6%F6%F7%FF%ED%F7%FF%FBO%ADU%DD%EB%FFw%9C%E9%F8%FB%F4%FF%F9%F3%FC%FF%F3%00%25%BD!X%E8%046%B1%FF%F1%F8%1C8%8C%FF%F5%FA%EA%F9%FF%D7%F2%FF%22%60%D9%AF%D2%FA%CE%12%0B%CE%14%19%E1%DF%EC%C9%D7%FF%0D%14%A2%FF%F8%D9%FF%F8%E6o%AC%EF%CD%DC%F3%7C%8F%C7%F0%FF%F7%F8%FF%E6%E0%E6%FC%EF%EF%FC%00%22%96%FF%F4%ED%17%3B%93%D2(%0F%BC%D7%FF%BF%DE%F0%A3%A9%CD%07c%E8%FB%F5%F7V%B6J%E8%FF%F6b%84%A9%EF%FF%F37%5B%D6%FC%FF%F6%FE%FF%F7%FC%FF%FF%C2%CE%FE%F6%FA%EB%C4%DB%E3%00%13V%D3%D9%F9%C1%F5%FF%FF%FC%FF%FE%FF%E3%3C%B5D%FF%FF%FF!%F9%04%00%00%00%00%00%2C%00%00%00%00%10%00%10%00%00%07%FE%80ln!G%25%0C%15%86~%15%0C!7~~%13w%7Fm%7D%18)'Y.d-%17%14P%05%16((%2FTI%07%0B%02O%01%5Ej%09%5D%19%1At0%7B%00%0Ac%96%18ZQ6d1W%24%7D(%3C%0ES%7D5%2C-%7C_%12%09Kh%10%08%3Agz(ba%1C%09%17%26%7C%093%19N%08I%0A%17%044%06%2F%2F%1E)4E%2CW%13%0F%0183%04%06%17%7C%7CR%2Bs*%14%11%10%18H%80%F0Dc%C8%05%3A%04R%AC%98%C1%A5%C0%86!%00%CA(a!%E4%8F%8B7xr%7C%D8%E1%ADJ%91%1EM%C0%C0%40%C1%87%8E%9D%05%22%164%08%D2%C1%C2%1F%19%02%B6%A41%02%C4%0C%1F%13%1F%7C%AC%E9%83e%03%8D%3Ec%1Cli%20%83I%9C%07V%F2%FC%E8%13A%C3%0B%04%08N%1C%F0!B%80%02%01%20%E0%10%F9%D3AN%8C%3E%7F%C2%8A%0D%3B%82%CF%05%0F%1D%1E%A9%5D%CB%D6%CF%80%40%00%3B";
            break;
        case 'Yahoo':
            return "data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////8AAP///yH5BAEAAAMALAAAAAAQABAAAAIpjI+py+0tohQOSADCnEd2kXkfFWUamEzmpZSfmaIHPHrRguUm/fT+UwAAOw%3D%3D";    
            break;
        case 'Wikipedia':
            return 'data:image/gif,GIF89a%10%00%10%00%F4%10%00%04%02%04%19%18%19(((%3C%3A%3CHGHWXWijiz%7Bz%84%83%84%98%98%98%A9%A8%A9%B9%BA%B9%C8%C7%C8%D8%D9%D8%E9%E8%E9%FC%FD%FC%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%10%00%2C%00%00%00%00%10%00%10%00%00%05%C8%E0%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%80%CF%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%3C%CF%B3%14%C4%F2(%C4%D1%3CG%016%8DQ%3C%88%B0%3C%0F!4%0E%92%3C%8E%91%3CM%608O%12(%0Ch%3C%8Fc%3C%CFS%04%CC%D3%10%02%A2%3C%CF%A2%3C%CF%B3%04%C8%F3%24%20P%3C%8F%83%2C%CF%F3%3C%04%D1%3C%CD%40%3COs%3C%CF%F3%3C%08%A0%80O3%08%CB%93%24%CF%F3%3C%CF%23%14%8Eb%0C%C6%838%CF%F3%3C%CF%03%22%C3%A14%87%90%20%CF%F3%3C%CF%F3(%82%A0%3C%8B%200%CF%F3%3C%0F%F8%3C%0FA4%CFc%08%CF%F3%3C%CF%F3%3C%CF%C2%3C%CF%D3%2C%CF%F3%3C%E0%F3%3C%CF%F3%3C%CF%F3%3C%CF%F3%3CO%08%00%3B';
            break;
        case 'Loading':
            return 'data:image/gif;base64,R0lGODlhEAAQALMMAKqooJGOhp2bk7e1rZ2bkre1rJCPhqqon8PBudDOxXd1bISCef///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAAMACwAAAAAEAAQAAAET5DJyYyhmAZ7sxQEs1nMsmACGJKmSaVEOLXnK1PuBADepCiMg/DQ+/2GRI8RKOxJfpTCIJNIYArS6aRajWYZCASDa41Ow+Fx2YMWOyfpTAQAIfkEBQAADAAsAAAAABAAEAAABE6QyckEoZgKe7MEQMUxhoEd6FFdQWlOqTq15SlT9VQM3rQsjMKO5/n9hANixgjc9SQ/CgKRUSgw0ynFapVmGYkEg3v1gsPibg8tfk7CnggAIfkEBQAADAAsAAAAABAAEAAABE2QycnOoZjaA/IsRWV1goCBoMiUJTW8A0XMBPZmM4Ug3hQEjN2uZygahDyP0RBMEpmTRCKzWGCkUkq1SsFOFQrG1tr9gsPc3jnco4A9EQAh+QQFAAAMACwAAAAAEAAQAAAETpDJyUqhmFqbJ0LMIA7McWDfF5LmAVApOLUvLFMmlSTdJAiM3a73+wl5HYKSEET2lBSFIhMIYKRSimFriGIZiwWD2/WCw+Jt7xxeU9qZCAAh+QQFAAAMACwAAAAAEAAQAAAETZDJyRCimFqbZ0rVxgwF9n3hSJbeSQ2rCWIkpSjddBzMfee7nQ/XCfJ+OQYAQFksMgQBxumkEKLSCfVpMDCugqyW2w18xZmuwZycdDsRACH5BAUAAAwALAAAAAAQABAAAARNkMnJUqKYWpunUtXGIAj2feFIlt5JrWybkdSydNNQMLaND7pC79YBFnY+HENHMRgyhwPGaQhQotGm00oQMLBSLYPQ9QIASrLAq5x0OxEAIfkEBQAADAAsAAAAABAAEAAABE2QycmUopham+da1cYkCfZ94UiW3kmtbJuRlGF0E4Iwto3rut6tA9wFAjiJjkIgZAYDTLNJgUIpgqyAcTgwCuACJssAdL3gpLmbpLAzEQA7';
            break;
        case 'SettingsBG':
            return 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%1DIDATx%9Ccd%60%608%C1%40%01%60%A2D%F3%A8%01%A3%06%8C%1A0%98%0C%00%00n%9D%00%E8%24%C7%FF%CB%00%00%00%00IEND%AEB%60%82';
            break; 
        case 'CloseButton':
            return 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%12%00%00%00%13%08%06%00%00%00%9D%92%5D%F2%00%00%00%07tIME%07%D7%0B%04%0F%09%0D%9Fr%A0%B8%00%00%00%09pHYs%00%00%0A%F0%00%00%0A%F0%01B%AC4%98%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%02%25IDATx%DA%85T%BF%CB%1AA%14%DCDQ%B1%08%DAx%FE%206%A7%9D%B5%7F%80%01mS%88%C5%D9%A6%B60X%E5%AB%C4B%14%04%5BI%9DJB%C0.%12%1B%AB%A0%88%85%85b%23%26%20%9F%11%A2v%12%F4%E5%CD%B2w%DCy%91%0C%0C%EC%BE73w%F7v9!%DCH0%9F%98%DF%99%17%8F%C7C%20%D6%AA%F6%A44%0E%BC%B8%DB%1B%CCN%24%12%D1%8A%C5%A2%C8%E5r%22%99L%CA%C6v%BB%15%A3%D1H%F4%FB%7D%B1%DF%EF%9F%B9Te~%FA%C7%8B%88%F7L2%0C%83%0E%87%03%3D%02z%D0%40%AB%3C%AE7%A1Z%ADF%D7%EB%95%CE%E7%F3%C3%20%F4%A0%81V%85%19%F6%99%FC%2C%97%CBt%BB%DD%A8T*Q0%18%A4v%BB%ED%0AA%0D%3Dh%A0%85%07%5Esf%1Fx%26%B4%DB%ED%E8t%3AQ%2C%163%9FD%F5z%DD%0A%C1%DA%ACC%03-%3C%F0%22%03A%D3j%B5j%19%3A%9D%8Ee%00%5B%AD%96%A4%BD%06%8D%09x%91%81%A0%3F%83%C1%C0%F1%09%CDf%D32%05%02%01Is%8F%9E%1D%F0%22C%F8%FD~%9A%CDf%AEyt%BB%5D%F2z%BDV%00%D6%A8%DD%03%5Ed%BCd%81%F0%F9%7C%AE%BBP(%14D8%1C%B6%F6X%A3v%0Fx%91%01%D0x%3Cv%3Ce%BD%5ES*%95r%CC%05D%0D%3D%3B%E0U%7D%F1%AB%D7%EBY%8D%D5j%E5%08I%A7%D3%92%F60hL%C0%8B%0C%04%7D%CE%E7%F3%B2x%B9%5C(%9B%CDZ%A6D%22A%D3%E9T%12k%B3%0E%0D%B4%00%BC%C8%40%D0%5B41%7D%DCZM%D3%A48%1E%8F%D3d2%B1%9E%8C5j%E8A%03%AD%3A1R%19%12_%A2%D1(-%97K%1A%0E%87T%A9Th%B1X%B8N%085%F4%A0%81%16%1Ex%ED%C3%8F3%17%BA%AE%D3%7C%3E%A7%FF%01%1Ah%E1Q%5E%07t%DCP%3Efj4%1A%B4%D9l%5C%01%A8%A1%07%8D%BA%CD%FA%A3%FF%D1%2B%F5%E3z%17%0A%85%C2%99LF%F0%89%C9%06%1F%BB%E0O%13%C7%E3%F17o%3F2%1B%CC%F3%A3%20%13%1A3%CF%7C%C3%7C%ADj%3F%98%DF%98_%99%CF%F7%86%BF%B2fm%98%8B04%2C%00%00%00%00IEND%AEB%60%82';
            break;
        case 'Settings':
            return "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0A%00%00%00%0A%08%06%00%00%00%8D2%CF%BD%00%00%00%07tIME%07%D7%0B%04%10%07%05%18P%E1I%00%00%00%09pHYs%00%00%0A%F0%00%00%0A%F0%01B%AC4%98%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%011IDATx%DA%5D%90%BFj%C2P%14%C6Om%A1%C5PPD%12I%06%C1E%A8%DD3%DA%8E%7D%97%E4%05%B2d%08%7D%85%08%16%B2%152%B7k%11%C1%C1fq%10%15B%E8h%12%C8%14KC%08%E6%F4%9CK%FF%D1%03%DF%E5%BB%9C%DF9%DC%EF%02%FC%D6%15%E9%A1%DB%EDn%24Iz%25%7FO%92%E1_%DDP%BD%EFv%3B%AC%AA%0A%D34%C5%D9l%86%83%C1%E0%8Dz%DA%CF%A6%F1x%7C%88%A2%08M%D3D%CB%B2P%D34L%92%04%97%CB%25%AA%AA%BA!%E6%92A%2F%0CC%CC%B2%0C%C9c%BF%DFGEQ%84%E7%C1%E9t%CA%DE%3E%93eYo%B7%DB0%1A%8D%80%20%D8n%B7P%D7%B5%B8%B7Z-%D0u%9D%97%DD5%8A%A2%F8%E8t%3A%E08%0E%94e)%A0%E3%F1(%BC%E7y%B0%DF%EF%19%3C4%F2%3C%7FY%2C%16%B0%5E%AF!%8Ec%B1i8%1C%0A%BFZ%AD%20%08%02%06%1F%F9%909%1D%3F%9C%D3%F6z%3D%9CL%26h%18%06%FA%BE%8F%CDf%F3%89%98%D3%EF%E4%1A%A7s%5D%17%E7%F3%B9Hk%DB6C%CF%D4%3Bg%E0%E4%CF_%5E%90nI%D7%A4%82%14%7C%A9%E6%E6'%F8%B1%93ts%86O%DE%00%00%00%00IEND%AEB%60%82";    
            break;
        default:
            return false;
    }
}

function getPrimaryLanguage(searchEng, sURL, aTLD){
    var ws;
    switch(searchEng){
        case 'Google':
            // get language from language setting in URL
            ws = sURL.match(/lr(=|%3D)lang_(\w{2})/);
            if(!ws) ws = sURL.match(/(\?|&)hl=(\w+)(&|$)/);
            if(ws){
                ws = ws[2];
            } else {
                // get language from Google TLD
                var googleTld = sURL.match(/http:\/\/(.*?)google\.(.*?)\//);
                ws = aTLD[googleTld[2]];
            }
            break;
        case 'Yahoo':
            // get language from language setting in URL
            ws = sURL.match(/vl(=|%3D)lang_(\w{2})/);
            if(ws){
                ws = ws[2];
            } else {
                // get language from Yahoo TLD
                var yahooTld = sURL.match(/^http:\/\/(\w+\.)?search.yahoo.com\//);
                if(yahooTld[1]){
                    yahooTld = yahooTld[1].replace('.', '');
                    ws = aTLD[yahooTld];  
                } 
            }
            break;        
    }
    if(!ws) ws = 'en';
    if(ws == 'iw') ws = 'he';
    return ws;    
}

function getYahooTLDs(){
    return {'ar':'es','au':'en','at':'de','be':'nl','br':'pt','ca':'en','ch':'de','cn':'zh','cz':'cs','de':'de','dk':'da','fi':'fi','fr':'fr','it':'it','jp':'ja','kr':'ko','nl':'nl','no':'no','pl':'pl','ru':'ru','es':'es','se':'sv','tw':'en','uk':'en','us':'en'};
}

function readSettings(){
    var arrSettings = new Array;
    var arrCSettings = getCookieSettings();
    var arrSSettings = getScriptSettings();
    arrSettings[0] = (arrCSettings[0] == null)? arrSSettings[0] : arrCSettings[0]; 
    arrSettings[1] = (arrCSettings[1] == null)? arrSSettings[1] : arrCSettings[1];
    arrSettings[2] = (arrCSettings[2] == null)? arrSSettings[2] : arrCSettings[2];
    arrSettings[3] = (arrCSettings[3] == null)? arrSSettings[3] : arrCSettings[3];
    arrSettings[4] = (arrCSettings[4] == null)? arrSSettings[4] : arrCSettings[4];
    arrSettings[5] = (arrCSettings[5] == null)? arrSSettings[5] : arrCSettings[5];
    arrSettings[6] = (arrCSettings[6] == null)? arrSSettings[6] : arrCSettings[6];
    return arrSettings;
}

function removeGoogleAds(){
    var styl = document.styleSheets[0];
    styl.insertRule('.e{width:48%;}', styl.cssRules.length);
    styl.insertRule('#gdst{width:100% !important;}', styl.cssRules.length);
    for(var i = 1, ai; ai = document.getElementById('tpa' + i); i++) ai.parentNode.removeChild(ai);
    styl.insertRule('table[width="25%"][align="right"]{display:none !important;}', styl.cssRules.length);
    styl.insertRule('table[width="25%"][align="right"]+table, #operapedia_iframe+table{display:none !important;}', styl.cssRules.length);
    // remove related search terms
    styl.insertRule('p.e + h2.r, p.e + h2.r + table {display:none !important;}', styl.cssRules.length);
}

function removeNobrTags(){
    var eleTemp = document.getElementsByTagName('nobr');
    for(var i = 0, ai; ai = eleTemp[i]; i++){
        while(ai.childNodes.length > 0){ ai.parentNode.insertBefore(ai.removeChild(ai.firstChild), ai) };
        ai.parentNode.removeChild(ai);
    }
}

// edit Wikipedia stylesheet so that it can be used in combination with Google's stylesheet(s)
function ReturnWikiStyle(ssheets, filename){
    var mainStyle;
    for(var i = 0, si; si = ssheets[i]; i++){
        if(si.ownerNode.nodeName == 'LINK'){
            if(si.href.toLowerCase().indexOf(filename) > -1) mainStyle = si; 
        } else {
            for(var j = 0, ji; ji = si.cssRules[j]; j++) 
                if(ji.styleSheet && ji.styleSheet.href.toLowerCase().indexOf(filename) > -1){
                    mainStyle = ji.styleSheet;
                    break;
                }
        }
        if(mainStyle) break;
    }
    var sStyle = '';
    if(mainStyle){
        var srMain = mainStyle.cssRules;
        for(var i = 0, si; si = srMain[i]; i++){
            var sRule = si.cssText;
            var sSelec = sRule.substr(0, sRule.indexOf('{'));
            var newSelec = sSelec.replace('body', '').replace('html', '').replace('#content','')
            if(newSelec.replace(/\s/g,'') != '') {
                newSelec = '#operapedia_div ' + newSelec.replace(/,/g,', #operapedia_div ');                    
                sStyle += sRule.replace(sSelec, newSelec) + '\n';                    
            }
        }
    }
    return sStyle;
}

function saveSettings(){
    eraseCookie('ShowWikipediaByDefault'); 
    createCookie('ShowWikipediaByDefault', document.getElementById('setDefaultShow').checked, 365)
    eraseCookie('DefaultWikiLanguage'); 
    createCookie('DefaultWikiLanguage', document.getElementById('setWikiLang').value, 365)
    eraseCookie('SecondaryWikiLanguage'); 
    createCookie('SecondaryWikiLanguage', document.getElementById('setSecLang').value, 365)
    eraseCookie('EnableAutomaticSecondaryLanguage'); 
    createCookie('EnableAutomaticSecondaryLanguage', document.getElementById('setAutoSecondary').checked, 365)
    eraseCookie('ShowOtherLanguages'); 
    createCookie('ShowOtherLanguages', document.getElementById('setOtherLanguages').checked, 365)
    eraseCookie('LinkToWikipediaOpensInNewPage'); 
    createCookie('LinkToWikipediaOpensInNewPage', document.getElementById('setNewTab').checked, 365)
    eraseCookie('LimitWikipediaHeight'); 
    createCookie('LimitWikipediaHeight', document.getElementById('setLimitHeight').checked, 365)
}

function setSecondaryLanguage(st, sUserSecondaryLang, sLang, bLTR){
    var ll = document.getElementById('languagelink');
    if(!ll) return false;
    ll.onclick = 'javascript:var lng=document.getElementById("operapedia_iframe").src.match(/http:\\/\\/(\\w+?)\\./)[1]+"";ChangeWikiURL("http://"+this.innerText+".wikipedia.org/w/wiki.phtml?go=GO&search=' + st + '");this.innerText=lng;';
    if(!ll.innerText.match(/\w{2}/))
        ll.innerText = sLang;
    ll.parentNode.style.display = 'inline';
    if(sUserSecondaryLang){
        document.getElementById('secondaryLanguagelink').nextSibling.nodeValue = '|';
        if(!bLTR)
            document.getElementById('secondaryLanguagelink').parentNode.parentNode.insertBefore(document.getElementById('secondaryLanguagelink').parentNode.parentNode.removeChild(document.getElementById('secondaryLanguagelink').parentNode), document.getElementById('languagelink').parentNode);
    }
}

// Cookie functions - borrowed from ppk (quirksmode.org) - Thanks :-)
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
