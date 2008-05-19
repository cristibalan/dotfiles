// ==UserScript==
// @name Cross-domain XMLHttpRequest
// @author Joao Eiras
// @ujs:modified 2007-04-11
// ==/UserScript==

/*
	Copyright © 2007 by João Eiras 

	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

/*

	Cross domain XMLHttpRequest implementation for Opera

*/

(function(opera){

	if( !opera )
		return;
	
	
	var commonToken = "opera.XMLHttp.";
	var crossDocRequest = commonToken+"Request.";
	var crossDocResponse = commonToken+"Response.";
	var acknowledge = commonToken+"acknowledge.";
	var urlToken = "#opera-XMLHttp-tk-";
	var location = window.location;
	
	
	//all user js run once before any page script, therefore this is executed, all 
	//opera.* functions and properties are the original ones, and not probable values
	//overridden by the current page
	var Function_call = Function.prototype.call;
	var setTimeout = window.setTimeout;
	var setInterval = window.setInterval;
	var clearInterval = window.clearInterval;
	var parseInt = window.parseInt;
	var postMessage = window.document.postMessage;
	var opera_addEventListener = opera.addEventListener;
	var window_addEventListener = window.addEventListener;
	var opera_getStackTrace = opera.getStackTrace;
	var String_match = String.prototype.match;
	var String_replace = String.prototype.replace;
	var String_split = String.prototype.split;
	var String_substring = String.prototype.substring;
	var String_toLowerCase = String.prototype.toLowerCase;
	var String_toUpperCase = String.prototype.toUpperCase;
	var Array_push = Array.prototype.push;
	var Array_join = Array.prototype.join;
	var Array_splice = Array.prototype.splice;
	var Document_createDocumentFragment = Document.prototype.createDocumentFragment;
	var Document_createElement = Document.prototype.createElement;
	var Document_createElementNS = Document.prototype.createElementNS;
	var DOMParser = window.DOMParser;
	var DOMParser_parseFromString = DOMParser.prototype?DOMParser.prototype.parseFromString:new DOMParser().parseFromString;
	var escape = window.escape;
	var encodeURIComponent = window.encodeURIComponent;
	var unescape = window.unescape;
	var XMLHttpRequest = window.XMLHttpRequest;
	var XMLHttpRequest_abort = XMLHttpRequest.prototype.abort;
	var XMLHttpRequest_open = XMLHttpRequest.prototype.open;
	var XMLHttpRequest_send = XMLHttpRequest.prototype.send;
	var XMLHttpRequest_setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
	var XMLHttpRequest_getResponseHeader = XMLHttpRequest.prototype.getResponseHeader;
	var XMLHttpRequest_getAllResponseHeaders = XMLHttpRequest.prototype.getAllResponseHeaders;
	var Event_preventDefault = Event.prototype.preventDefault
	var RegExp = window.RegExp;
	var RegExp_exec = RegExp.prototype.exec;
	var Math = window.Math;
	var Math_abs = Math.abs;
	var Math_random = Math.random;
	var Date = window.Date;
	var Date_getTime = Date.prototype.getTime;
	var Node_appendChild = Node.prototype.appendChild;
	var Node_removeChild = Node.prototype.removeChild;
	
	var DOMLoadedEventType = (opera.version() >= 9 ? 'DOMContentLoaded' : 'load');
	var documentLoaded = false;
	window_addEventListener.call(window,DOMLoadedEventType,function(){ documentLoaded = true; },false);
	
	function resetFunctionsCall(){
		setTimeout.call = parseInt.call = postMessage.call = opera_addEventListener.call =
		window_addEventListener.call = String_match.call = String_replace.call = String_split.call = 
		String_substring.call = String_toLowerCase.call = String_toUpperCase.call = Array_push.call =
		Array_join.call = Array_splice.call = Document_createDocumentFragment.call =
		Document_createElement.call = Document_createElementNS.call = DOMParser_parseFromString.call =
		XMLHttpRequest_abort.call =	XMLHttpRequest_open.call = XMLHttpRequest_send.call =
		XMLHttpRequest_setRequestHeader.call = XMLHttpRequest_getResponseHeader.call = 
		XMLHttpRequest_getAllResponseHeaders.call = Event_preventDefault.call = RegExp_exec.call = 
		Math_abs.call = Math_random.call = Date_getTime.call = Node_appendChild.call = Node_removeChild.call = 
		Function_call;
	};
	function _throw(ex){
		setTimeout(function(){ throw ex; },1);
	}
	function callWrapped(obj,fn){
		if( typeof obj[fn] == 'function' )
			try{ return obj[fn](); }catch(ex){ _throw(ex); }
	}
	function parseDOM(markup,useDocument){
		if(!markup)
			return document.implementation.createDocument(null,null,null);
		try{
			markup = trimString(markup);
			var nd = DOMParser_parseFromString.call(new DOMParser(),
				(String_match.call(markup,/<!\s*doctype\b/i)?'':
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">')
				+markup,'text/xml');
			return useDocument?nd:nd.documentElement;//doctype for entities
		}catch(ex){
			try{
				var frag = Document_createDocumentFragment.call(document);
				var d = Document_createElement.call(document, String_match.call(markup,/<(\w+)\b/) ? RegExp.$1: 'html');
				if( typeof d.innerHTML == 'undefined' )
					return null;
				d.innerHTML = markup;
				if( !useDocument ){ return d; }
				var doc=document.implementation.createDocument(null,null,null);
				doc.appendChild(d);
				return doc;
			}catch(ex){
				return null;
			}
		}
	}
	function trimString(str){
		return String_replace.call(String_replace.call(str, /^\s+/,''),/\s+$/,'');
	}
	function serializeRequestHeaders(hdrs){
		var s = '';
		for(var k=0; k<hdrs.length; k++)//cookie style :) ';' is escaped too - great
			s += escape(hdrs[k].name)+'='+escape(hdrs[k].value)+';';
		return s;
	}
	function deSerializeRequestHeaders(hdrs){
		var all = String_split.call(hdrs,';'), ret=[];
		for(var k=0; k<all.length; k++){
			var crumbs = String_split.call(all[k],'=');
			if(crumbs.length==2)
				Array_push.call(ret,{name:unescape(crumbs[0]),value:unescape(crumbs[1])});
		}
		return ret;
	}
	function getAllXMLHttpHeaders( xmlhttp ){
		var allHeaders = '', ret = [];
		try{
			allHeaders = String_split.call(XMLHttpRequest_getAllResponseHeaders.call(xmlhttp),'\n');
		}catch(ex){}
		
		for(var k=0; k<allHeaders.length; k++){
			var crumbs = String_split.call(allHeaders[k],':');
			if(crumbs.length>=2){
				Array_push.call(ret,{name:trimString(crumbs[0]),
					value:trimString(Array_join.call(Array_splice.call(crumbs,1,crumbs.length-1),':'))});
				//,toString:function(){return '['+this.name+','+this.value+']\n';}
			}
		}
		return ret;
	}
	function checkScriptRights(){
		//tells if current executing script can use cross domain XMLHttp
		if( !opera_getStackTrace )
			throw "opera.StackTrace module required for opera.XMLHttpRequest module";
			
		if( !opera_getStackTrace().UserJsOnly() )
			throw "Security violation";
	}
	function cleanCurrentPage(){
		opera_addEventListener.call(opera,"BeforeExternalScript",function(ejs){resetFunctionsCall();Event_preventDefault.call(ejs);},false);
		opera_addEventListener.call(opera,"BeforeScript",function(ejs){resetFunctionsCall();Event_preventDefault.call(ejs);},false);
		opera_addEventListener.call(opera,"BeforeEventListener",function(ejs){resetFunctionsCall();Event_preventDefault.call(ejs);},false);
		opera_addEventListener.call(opera,"BeforeJavascriptURL",function(ejs){resetFunctionsCall();Event_preventDefault.call(ejs);},false);
		
		function doCleaning(){
			resetFunctionsCall();
			while( document.documentElement.firstChild )
				Node_removeChild.call(document.documentElement, document.documentElement.firstChild );
		}
		
		if( documentLoaded )
			doCleaning();
		else{
			if( opera.version() >= 9 ){
				window_addEventListener.call(window,DOMLoadedEventType,doCleaning,false);
			}
			else{
				var clean_n_calls = 0;
				var clean_interval;
				var clean_f = function(){
				
					doCleaning();
					
					clean_n_calls++;
					if( clean_n_calls == 20 )//10 seconds
						clearInterval(clean_interval);
				}
				clean_interval = setInterval(clean_f,500); 
				window_addEventListener.call(window,DOMLoadedEventType,function(){clean_f();clearInterval(clean_interval);},false);
			}
		}
	}
	function resolveUrl(url){
		var a=Document_createElementNS.call(document,'http://www.w3.org/1999/xhtml','a');
		a.href=url;
		return a.href;
	}
	
	var dummyRequest = new XMLHttpRequest();
	function copyXMLHttpObjProperties(src,dest){
		for(var prop in src)
			if( !(prop in dummyRequest) || String_substring.call(prop,0,2)=='on' )
				dest[prop] = src[prop];
	}
			
	//the fetching iframe
	if( ts = RegExp_exec.call(new RegExp( urlToken+"(\\d+)$" ), location.href ) ){
		cleanCurrentPage();
		
		var ts = parseInt(ts[1]);
		postMessage.call( window.parent.document, acknowledge+ts );
		
		function filterExcept(obj,prop){
			try{
				return obj[prop];
			}catch(ex){
				return undefined;
			}
		}
		opera_addEventListener.call(opera,'BeforeEvent.message',function(ev){
			resetFunctionsCall();
		
			if( !ev.event.data ){ return; }
			var data = String_split.call(ev.event.data, '\n');
			if( data[0]!=(crossDocRequest+ts) ){ return; }
			Event_preventDefault.call(ev);
			
			
			var method = data[1];
			var url = data[2];
			var username = data[3];
			var password = data[4];
			var postArgs = unescape(data[5]);
			var reqHeaders = deSerializeRequestHeaders(data[6]);
			
			var xmlhttp = new XMLHttpRequest();
			var evsource = ev.event.source;
			xmlhttp.onreadystatechange=function(){
	//uncomment me
	//window.alert("onreadystatechange: "+this.readyState);
				resetFunctionsCall();
				if( this.readyState >1 )
					postMessage.call( evsource,
						crossDocResponse+ts+'\n'+
						this.readyState+'\n'+
						escape(filterExcept(this,'responseText'))+'\n'+
						filterExcept(this,'status')+'\n'+
						filterExcept(this,'statusText')+'\n'+
						serializeRequestHeaders(getAllXMLHttpHeaders( this ))
					);
			};
			
			if(username&&password)
				XMLHttpRequest_open.call(xmlhttp,method,url,false,username,password);
			else
				XMLHttpRequest_open.call(xmlhttp,method,url,false);
			for(var k=0; k<reqHeaders.length; k++)
				try{
					XMLHttpRequest_setRequestHeader.call(xmlhttp,reqHeaders[k].name,reqHeaders[k].value);
				}catch(ex){}
				
			try{
				XMLHttpRequest_send.call(xmlhttp, postArgs);
			}catch(ex){
				postMessage.call( ev.event.source, crossDocResponse+ts+'\nERROR\n'+ex.message );
			}
			
		},false);
	}
	else{		
		
		//holds the data needed for the beforevent.message listener
		var allRequestsData = {};
		var precompRE = {
			//req:new RegExp(crossDocRequest+"(\\d+)"),
			res:new RegExp("^"+crossDocResponse.replace(/\./g,'\.')+"(\\d+)"),
			ack:new RegExp("^"+acknowledge.replace(/\./g,'\.')+"(\\d+)")
		};
		opera_addEventListener.call(opera,'BeforeEvent.message',function(ev){
			if( !ev.event.data )
				return;
			resetFunctionsCall();
			
			if( String_match.call(ev.event.data, precompRE.res ) ){
				Event_preventDefault.call(ev);
				var ts = parseInt(RegExp.$1);
				allRequestsData[ts].getResponseListener(ev.event);
			}
			else if( String_match.call(ev.event.data, precompRE.ack ) ){
				Event_preventDefault.call(ev);
				var ts = parseInt(RegExp.$1);
				allRequestsData[ts].acknowledgeListener(ev.event);
			}
			else{return;}
				
	
		},false);
		
		function XMLHttpRequestCD(){
			checkScriptRights();
			resetFunctionsCall();
			
			
			//unique random number to filter messages
			var ts = Math_abs.call(Math,Date_getTime.call(new Date()) ^ (Math_random.call(Math)*0x7fffffff|0) );
			var request = new XMLHttpRequest();
			var requestHeaders = [];
			var responseHeaders = [];
			var requestAborted = false;
			var uri,hostname,port,protocol,username,password,method;
			var sent = false;
			var this_xmlhttp = this;
			var ifr = null;
			
			allRequestsData[ts] = {};
			this.toString = function(){ return "[object opera.XMLHttpRequest]"; }
		
			function isCrossDomain(){
				return	location.hostname!=hostname ||
						location.port    !=port     ||
						location.protocol!=protocol;
			}
			
			this.timeout = 10000;//msec
			this.ontimeout = null;
			this.onreadystatechange = null;
			this.onload = null;
			
			this.open = function(p_method, p_uri, p_asyncFlag, p_username, p_password){
				checkScriptRights();
				resetFunctionsCall();
				
				
				protocol = "http:";
				hostname = "";
				port = "";
				method = p_method||'';
				uri = resolveUrl(p_uri||'');
				username = p_username||'';
				password = p_password||'';
				
				if( uri.match(/^((\w+:)\/\/?([^\/:]+)(:(\d+))?)\/(.*)$/) ){
					protocol = RegExp.$2;
					hostname = RegExp.$3;
					port = RegExp.$5||"";
					path = '/'+RegExp.$6;
				}else{
					throw "URI resolution failed or unknown";
				}
				
				copyXMLHttpObjProperties(this,request);
				if(username&&password)
					return XMLHttpRequest_open.call(request, method, uri, p_asyncFlag, username, password);
				else
					return XMLHttpRequest_open.call(request, method, uri, p_asyncFlag);
			}
		
			this.setRequestHeader = function(hdr, val){ 
				checkScriptRights();
				resetFunctionsCall();
				
				if( sent ){
					throw new Error("INVALID_STATE_ERR: setRequestHeader()");
				}else{
					for(var k=0; k<requestHeaders.length ;k++)
						if( String_toLowerCase.call(requestHeaders[k].name) == String_toLowerCase.call(''+hdr) ){
							requestHeaders[k].value = val;
							return;
						}
					Array_push.call(requestHeaders,{name:hdr,value:val});
				}
				XMLHttpRequest_setRequestHeader.call(request, hdr, val);
			}
			
			this.getResponseHeader = function(hdr){
				checkScriptRights();
				resetFunctionsCall();
				
				if( !isCrossDomain() )
					return XMLHttpRequest_getResponseHeader.call(request,hdr);
						
				if( sent ){
						
					for(var k=0; k<responseHeaders.length ;k++)
						if( String_toLowerCase.call(responseHeaders[k].name) == String_toLowerCase.call(''+hdr) )
							return responseHeaders[k].value;
					return null;
					
				}else{
					throw new Error("INVALID_STATE_ERR: getResponseHeader()");
				}
			}
		
			var opr_getAllResponseHeaders = this.getAllResponseHeaders = function(){ 
				checkScriptRights();
				resetFunctionsCall();
				
				if( !isCrossDomain() )
					return XMLHttpRequest_getAllResponseHeaders.call(request);
					
				if( sent ){
						
					var s = '';
					for(var k=0; k<responseHeaders.length ;k++)
						s += responseHeaders[k].name+': '+responseHeaders[k].value+'\n';
					return s;
				}else{
					throw new Error("INVALID_STATE_ERR: opr_getAllResponseHeaders()");
				}
				
			}
			
			allRequestsData[ts].getResponseListener = function(ev){
				function u(o){ return o == 'undefined' ? undefined : o; }
				
				var data = String_split.call(ev.data,'\n');
				
				if( requestAborted )
					return;
					
				if( data.length==3 && data[1]=='ERROR' ){ throw data[2]; return; }
				
				this_xmlhttp.readyState = parseInt(data[1]);
				this_xmlhttp.responseText = this_xmlhttp.readyState<3?'':unescape(data[2]);
				try{
					if( this_xmlhttp.readyState<4 ){
						this_xmlhttp.responseXML = null;
					}
					else{
						this_xmlhttp.responseXML = parseDOM(this_xmlhttp.responseText,true);
						if( !this_xmlhttp.responseXML ){
							if(ifr)ifr.location.href = 'data:text/html,'+encodeURIComponent(this_xmlhttp.responseText);
							this_xmlhttp.responseXML = ifr.contentDocument;
						}
					}
				}catch(ex){
					this_xmlhttp.responseXML = null;
				}
				
				this_xmlhttp.status = parseInt(data[3]);
				this_xmlhttp.statusText = u(data[4]);
				
				responseHeaders = deSerializeRequestHeaders(data[5]);
				sent = true;
				
				callWrapped( this_xmlhttp, 'onreadystatechange' );
				if( this_xmlhttp.readyState == 4 ){
					callWrapped( this_xmlhttp, 'onload' );
					if(ifr)ifr.style.display = 'none';
				}
			}
			
			this.abort = function(){
				checkScriptRights();
				resetFunctionsCall();
				
				if( isCrossDomain() )
					requestAborted = true;
				else
					XMLHttpRequest_abort.call(request);
				
			}
			
			this.send = function(args){
				checkScriptRights();
				resetFunctionsCall();
				
				if( !isCrossDomain() ){
					copyXMLHttpObjProperties(this,request);
					return XMLHttpRequest_send.call(request,args);
				}
				
				switch( method.toUpperCase() ){
					case 'GET':case 'HEAD':case 'POST':case 'DELETE':case 'PUT':break;
					default:throw "Unknown method";
				}
				if( protocol != 'http:' && protocol != 'https:' )
					throw "Unsupported protocol";
				
				var canTimeout = true;
				var self = this;
				allRequestsData[ts].acknowledgeListener = function(ev){
					canTimeout = false;
					opr_getAllResponseHeaders.call = Function_call;
					postMessage.call( ev.source,
						crossDocRequest+ts+'\n'+method+'\n'+uri+'\n'+
						username+'\n'+password+'\n'+escape(args||'')+'\n'+
						serializeRequestHeaders( requestHeaders )
					);
				}

				function sendRequest(){
					resetFunctionsCall();

					//these actions need the document to be able to append nodes
					var ifr = parseDOM('<iframe xmlns="http://www.w3.org/1999/xhtml" '+
						'frameborder="0" style="width:0px;height:0px;visibility:hidden;position:absolute;left:-999em;"></iframe>');
					Node_appendChild.call(document.body||document.documentElement,ifr);
					ifr.src = uri+urlToken+ts;
					setTimeout(function(){
						if( canTimeout )
							callWrapped( this_xmlhttp, 'ontimeout' );
					},this_xmlhttp.timeout||10000);
				}
				if( documentLoaded )
					sendRequest();
				else
					window_addEventListener.call(window,DOMLoadedEventType,sendRequest,false);
			}
		}
		
		opera.XMLHttpRequest = XMLHttpRequestCD;
	}

})(window.opera);
