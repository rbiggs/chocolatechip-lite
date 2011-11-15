/*		  
	pO\		
   6  /\
	 /OO\
	/OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/  
		
ChocolateChip.js: It's tiny but delicious
A JavaScript library for mobile Web app development.
 
Copyright 2011 Robert Biggs: www.choclatechip-ui.com
License: BSD
Version 1.0
 
*/
 
(function() {
	var $ = function ( selector, context ) {
		if (!!context) {
			if (typeof context === "string") {
				return document.querySelector(context + " " + selector);
			} else if (context.nodeType === 1) {
				return context.querySelector(selector);
			} 
		} else if (typeof selector === "function") {
			$.ready(function() {
				selector.call(selector);
				return this;
			});
		} else {
			return document.querySelector(selector);
		}
		return false;
	};
 
	$.extend = function(obj, prop) {
		if (!Object.keys) {
			if (!prop) {
				prop = obj;
				obj = this;
			}
			for (var i in prop) {
				obj[i] = prop[i];
			}
			return obj;
		} else {
			Object.keys(prop).forEach(function(p) {
				if (prop.hasOwnProperty(p)) {
					Object.defineProperty(obj, p, {
						value: prop[p],
						writable: true,
						enumerable: false,
						configurable: true
					});
				}
			});
		}
		return this;
	};
	
	$.extend(Array.prototype, {
		each : Array.prototype.forEach
	});
	
	$.extend($, {
 
		version : "1.0",
		
		libraryName : "ChocolateChip-Lite",
		 
		$$ : function ( selector, context ) {
			if (!!context) {
				if (typeof context === "string") {
					return [].slice.apply(document.querySelectorAll(context + " " + selector));
				} else if (context.nodeType === 1){
					return [].slice.apply(context.querySelectorAll(selector));
				}
			} else {
				return [].slice.apply(document.querySelectorAll(selector));
			}
		},
		
		make : function ( HTMLString ) {
			var nodes = [];
			var temp = document.createElement("div");
			temp.innerHTML = HTMLString;
			var i = 0;
			var len = temp.childNodes.length;
			while (i < len) {
				nodes[i] = temp.childNodes[i];
				i++;
			}
			return nodes;
		},
		 
		replace : function ( newElem, oldElem ) {
			 oldElem.parentNode.replaceChild(newElem, oldElem);
		},
		 
		processJSON : function ( data ) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			var scriptID = $.UIUuid();
			script.setAttribute("id", scriptID);
			script.insert(data);
			$("head").insert(script, "last");
			$.defer(function() {
				var id = "#" + scriptID;
				$(id).remove();
			});
		}
	});
	
	$.extend(Object.prototype, {
		each: function(callback, objectLength) {
			for (key in this) {
				if(callback(key, this[key]) === false) { return this; }
			}
		}
	});
	
	$.extend(HTMLElement.prototype, {
	
		find : function ( selector ) {
			return $(selector, this);
		},
		
		findAll : function ( selector ) {
			return $$(selector, this);
		},
			 
		previous : function ( ) {
			return this.previousElementSibling;
		},
	 
		next : function ( ) {
			return this.nextElementSibling;
		},
		 
		first : function ( ) {
			return this.firstElementChild;
		},
		 
		last : function ( ) {
			return this.lastElementChild;
		},
	 
		ancestor : function( selector ) {
			if (!selector) {
				return false;
			}
			var idCheck = new RegExp("^#");
			var classCheck = new RegExp("^.");
			var position = null;
			var newSelector = null;
			var p = this.parentNode;
			if (!p) {
				return false;
			}
			if (typeof selector === "string") {
				selector.trim();
			}
			if (typeof selector === "number") {
				position = selector || 1;
				 for (var i = 1; i < position; i++) {
					 if (p.nodeName === "HTML") {
						 return p;
					 } else {
						 if (p !== null) {
							 p = p.parentNode;
						 }
					 }
				 }	
				 return p;
			} else if (selector.substr(0,1) === "." ) {
				newSelector = selector.split(".")[1];
				if (p.nodeName === "BODY") {
					return false;
				}
				if (p.hasClass(newSelector)) {
					return p;
				} else {
					return p.ancestor(selector);
				}
			} else if (selector.substr(0,1) === "#" ) {
				newSelector = selector.split("#")[1];
				if (p.getAttribute("id") === newSelector) {
					return p;
				} else {
					return p.ancestor(selector);
				}
			} else { 
			   if (p.tagName.toLowerCase() === selector) {
				   return p;
			   } else {
				   return p.ancestor(selector);
			   } 
			}
		}, 

		text : function ( value ) {
			if (!!value) {
				this.innerText = value;
				return this;
			} else {
				return this.innerText;
			}
		},
		 
		fill : function ( content ) {
			this.empty();
			if (typeof content === "string") {
				this.textContent = content;
			} else {
				this.insert(content);
			}
			return this;
		},
		 
		empty : function ( ) {
			this.removeEvents();
			this.textContent = "";
			return this;
		},
		 
		remove : function ( ) {
			this.removeEvents();
			this.parentNode.removeChild(this);
		},
		 
		insert : function ( content, position ) {
			var c = "";
			if (typeof content === "string") {
				c = $.make(content);
			} else if (content.nodeType === 1) {
				c = [];
				c.push(content);
			} else {
				c = content;
			}
			var i = 0;
			var len = c.length;
			if (!position || position > (this.children.length + 1) || position === "last") {
				while (i < len) {
					this.appendChild(c[i]);
					i++;
				}
			} else if (position === 1 || position === "first") {
				while (i < len) {
					this.insertBefore(c[i], this.firstElementChild);
					i++;
				}
			} else {
				while (i < len) {
					this.insertBefore(c[i], this.children[position - 1]);
					i++;
				}
			}
			return this;
		},
		
		prepend : function ( content ) {
			this.insertAdjacentHTML("afterBegin", content);
			return this;
		},
		
		append : function ( content ) {
			this.insertAdjacentHTML("beforeEnd", content);
			return this;
		},
		
		before : function ( content ) {
			this.insertAdjacentHTML("beforeBgin", content);
			return this;
		},
		 
		after : function ( content ) {
			this.inserAdjacentHTML("afterEnd", content);
			return this;
		},
		 
		hasClass : function ( className ) {
			return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(this.className);
		},
		 
		addClass : function ( className ) {
			if (!this.hasClass(className)) {
				this.className = [this.className, className].join(' ').replace(/^\s*|\s*$/g, "");
				return this;
			}
		},
		 
		removeClass : function ( className ) {
			if (this.hasClass(className)) {
				var currentClasses = this.className;
				this.className = currentClasses.replace(new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g'), ' ').replace(/^\s*|\s*$/g, "");
				return this;
			}
		},
 
		toggleClass : function ( firstClassName, secondClassName ) {
		   if (!secondClassName) {
			   if (!this.hasClass(firstClassName)) {
				   this.addClass(firstClassName);
			   } else {
				   this.removeClass(firstClassName);
			   }
		   } else if (secondClassName) {
			   if (!this.hasClass(firstClassName)) {
				   this.addClass(firstClassName);
				   this.removeClass(secondClassName);
				} else {
					this.removeClass(firstClassName);
					this.addClass(secondClassName);
				}
			}
			return this;
		},

		css : function ( property, value ) {
			if (property instanceof Object) {
				for (var key in property) {
					this.style[key] = property[key];
				}
			} else if (typeof property === "string" && (/:/).test(property) && !value) {
				this.style.cssText += property;
			} else if (!value) {
				return document.defaultView.getComputedStyle(this, null).getPropertyValue(property.toLowerCase());
			} else if (value) {
				this.style.cssText += property + ":" + value + ";";
				return this;
			} else {
				return false;
			}
			return this;
		},
		 
		bind : function( event, callback ) {
			this.addEventListener(event, callback, false);
		},
		 
		unbind : function( event, callback ) {
			this.removeEventListener( event, callback, false );
		},
	   
		removeEvents : function ( ) {
			var i = 0, len = $.events.length;
			while (i < len) {
				this[$.events[i]] = null;
				i++;
			}
		},
		 
		delegate : function ( selector, event, callback ) {
			this.addEventListener(event, function(e) {
				var target = e.target;
				$.$$(selector, this).each(function(element) {
					if (element.isSameNode(target)) {
						callback.apply(this, arguments);
					} else {
						try {
						   var ancestor = target.ancestor(selector);
						   if (element.isSameNode(ancestor)) {
								e.stopPropagation();
								callback.call(this, ancestor);
							}
						} catch(err) {}
					}
				});
			}, false);
		},
		 
		trigger : function ( event ) {
			if( document.createEvent ) {
			  var evtObj = document.createEvent('Events');
			  evtObj.initEvent(event, true, false);
			  this.dispatchEvent(evtObj);
			}
		},

		xhr : function ( url, options ) {
			var o = options ? options : {};
			var successCallback = null;
			var errorCallback = null;
			if (!!options) {
				if (!!options.successCallback || !!options.success) {
					successCallback = options.successCallback || options.success;
				}
			}
			var that = this,
				request	   = new XMLHttpRequest(),
				method = o.method || 'get',
				async  = o.async || false,			 
				params = o.data || null,
				i = 0;
			request.queryString = params;
			request.open(method, url, async);
			if (o.headers) {
				for (; i<o.headers.length; i++) {
				  request.setRequestHeader(o.headers[i].name, o.headers[i].value);
				}
			}
			request.handleResp = (successCallback !== null) ? successCallback : function() { 
				that.insert(this.responseText); 
			}; 
			function hdl(){ 
				if(request.status===0 || request.status==200 && request.readyState==4) {	
					$.responseText = request.responseText;
					request.handleResp(); 
				} else {
					if (!!options.errorCallback || !!options.error) {
						var errorCallback = options.errorCallback || options.error;
						errorCallback();
					}
				}
			}
			if(async) request.onreadystatechange = hdl;
			request.send(params);
			if(!async) hdl();
			return this;
		},
		 
		xhrjson : function ( url, options ) {
			if (options === "undefined") {
				return this;
			}
			var c = options.callback;
			if (typeof c != 'function') {
				c = function (x) {
					return x;
				};
			}
			var callback = function () {
				var o = JSON.parse(this.responseText);
				for (var prop in o) {
					$(options[prop]).fill(c(o[prop]));
				}
			};
			options.successCallback = callback;
			this.xhr(url, options);
			return this;
		}	 
	});
	 
	$.extend($, {
		 
		delay : function ( fnc, time ) {
			var argv = Array.prototype.slice.call(arguments, 2);
			return setTimeout(function() { 
				return fnc.apply(fnc, argv); 
			}, time);
		},
		 
		defer : function ( fnc ) {
			return $.delay.apply($, [fnc, 1].concat(Array.prototype.slice.call(arguments, 1)));
		},
		 
		events : ['onmousedown', 'onmouseup', 'onmouseover', 'onmouseout', 'onclick', 'onmousemove', 'ondblclick', 'onerror', 'onresize', 'onscroll', 'onkeydown', 'onkeyup', 'onkeypress', 'onchange', 'onsubmit', 'onload', 'ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel', 'ongesturestart', 'ongesturechange', 'ongestureend', 'onorientationchange'],
		 
		loadEvent : function ( F ) {
			var oldonload = window.onload;
			if (typeof window.onload !== 'function') {
			   window.onload = F;
			} else {
			   window.onload = function () {
				  oldonload();
				  F();
			   };
			}
		},
		 
		DOMReadyList : [],
		 
		executeWhenDOMReady : function ( ) {
			var listLen = $.DOMReadyList.length;
			var i = 0;
			while (i < listLen) {
				$.DOMReadyList[i]();
				i++;
			}
			$.DOMReadyList = null;
			document.removeEventListener('DOMContentLoaded', $.executeWhenDOMReady, false);
		},
		 
		ready : function ( callback ) {
			if ($.DOMReadyList.length === 0) {
				document.addEventListener('DOMContentLoaded', $.executeWhenDOMReady, false);
			}
	 
			$.DOMReadyList.push(callback);
		},
		 
		importScript : function ( url ) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", url);
			$("head").appendChild(script);
		},
		 
		templates : {},
		 
		template : function(str, data) {
			if ($.ajaxStatus === null || $.ajaxStatus === false) {
				return data;
			}
			if ($.templates[str]) {
				str = $.templates[str];
			} else {
				str = str;
			}
			var tmpl = 'var p=[],print=function(){p.push.apply(p,arguments);};with(obj||{}){p.push(\''; 
			var regex1; 
			var regex2;
			if (/\{\{/.test(str) || (/$\{/).test(str)) {
				regex1 = /\$\{([\s\S]+?)\}/g;
				regex2 = /\{\{([\s\S]+?)\}\}/g;
			} else if (/\[\[/.test(str) || (/$\[/).test(str)) {
				regex1 = /\$\[([\s\S]+?)\]/g;
				regex2 = /\[\[([\s\S]+?)\]\]/g;
			} else if (/<%=/.test(str) || (/<%/).test(str)) {
				regex1 = /<%=([\s\S]+?)%>/g;
				regex2 = /<%([\s\S]+?)%>/g;
			}	
			tmpl +=
			  str.replace(/\\/g, '\\\\')
				 .replace(/'/g, "\\'")
				 .replace(regex1, function(match, code) {
					return "'," + code.replace(/\\'/g, "'") + ",'";
				 })
				 .replace(regex2 || null, function(match, code) {
					return "');" + code.replace(/\\'/g, "'")
					.replace(/[\r\n\t]/g, ' ') + "p.push('";
				 })
				 .replace(/\r/g, '\\r')
				 .replace(/\n/g, '\\n')
				 .replace(/\t/g, '\\t') + "');} return p.join('');";
			var fn = new Function('obj', tmpl);
			return data ? fn(data) : fn;
		}		
	});
	
	window.$chocolatechip = $;
	window.$$chocolatechip = $.$$;
	if (window.$ === undefined) {
		window.$chocolatechip = window.$ = $;
		window.$$chocolatechip = window.$$ = $.$$;
	}
})(); 
