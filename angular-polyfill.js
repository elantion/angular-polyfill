//please put this polyfill before your other polyfill


if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

//
if (!window.XMLHttpRequest) {
    //console.log('XMLHttpRequest not enabled');
    window.XMLHttpRequest = function () {
        var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP'),
            out = {
                isFake: true,
                send: function (a) {
                    return xmlhttp.send(a);
                },
                open: function (a, b, c, d, e) {
                    return xmlhttp.open(a, b, c, d, e);
                },
                abort: function () {
                    return xmlhttp.abort();
                },
                setRequestHeader: function (a, b) {
                    return xmlhttp.setRequestHeader(a, b);
                },
                getResponseHeader: function (a) {
                    return xmlhttp.getResponseHeader(a);
                },
                getAllResponseHeaders: function () {
                    return xmlhttp.getAllResponseHeaders();
                },
                overrideMimeType: function (a) {
                    return xmlhttp.overrideMimeType(a);
                }
            };

        xmlhttp.onreadystatechange = function () {
            out.readyState = xmlhttp.readyState;

            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                out.status = xmlhttp.status;
                out.responseText = xmlhttp.responseText;
                out.responseXML = xmlhttp.responseXML;
                out.statusText = xmlhttp.statusText;

                if (out.onload) {
                    out.onload.apply(this, arguments);
                }
            }

            if (out.onreadystatechange) {
                out.onreadystatechange.apply(this, arguments);
            }

        };

        return out;

    };
}

// ------ XMLHttpRequest.onload ------
// monkey patch XMLHttpRequest to make IE8 call onload when readyState === 4
var sendFn = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function () {
    // only if onreadystatechange has not already been set
    // to avoid breaking anything outside of angular
    if (!this.onreadystatechange) {
        this.onreadystatechange = function () {
            if (this.readyState === 4 && this.onload) {
                this.onload();
            }
        };
    }
    // apply this & args to original send
    sendFn.apply(this, arguments);
};

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create != 'function') {
    Object.create = (function() {
        var Temp = function() {};
        return function (prototype) {
            if (arguments.length > 1) {
                throw Error('Second argument not supported');
            }
            if (typeof prototype != 'object') {
                throw TypeError('Argument must be an object');
            }
            Temp.prototype = prototype;
            var result = new Temp();
            Temp.prototype = null;
            return result;
        };
    })();
}

//me
if(Node === undefined){
    var Node = function(){};
}

// ------ Object.getPrototypeOf ------
// http://stackoverflow.com/a/15851520/674863
if (typeof Object.getPrototypeOf !== 'function') {
    Object.getPrototypeOf = ''.__proto__ === String.prototype ? function (object) {
        return object.__proto__;
    } : function (object) {
        // May break if the constructor has been tampered with
        return object.constructor.prototype;
    };
}



/**
 * @license addEventListener polyfill 1.0 / Eirik Backer / MIT Licence
 * https://gist.github.com/2864711/946225eb3822c203e8d6218095d888aac5e1748e
 *
 * sounisi5011 version:
 * http://qiita.com/sounisi5011/items/a8fc80e075e4f767b79a#11
 */
(function (window, document, listeners_prop_name) {
    if ((!window.addEventListener || !window.removeEventListener) && window.attachEvent && window.detachEvent) {
        /**
         * @param {*} value
         * @return {boolean}
         */
        var is_callable = function (value) {
            return typeof value === 'function';
        };
        /**
         * @param {!Window|HTMLDocument|Node} self
         * @param {EventListener|function(!Event):(boolean|undefined)} listener
         * @return {!function(Event)|undefined}
         */
        var listener_get = function (self, listener) {
            var listeners = listener[listeners_prop_name];
            if (listeners) {
                var lis;
                var i = listeners.length;
                while (i--) {
                    lis = listeners[i];
                    if (lis[0] === self) {
                        return lis[1];
                    }
                }
            }
        };
        /**
         * @param {!Window|HTMLDocument|Node} self
         * @param {EventListener|function(!Event):(boolean|undefined)} listener
         * @param {!function(Event)} callback
         * @return {!function(Event)}
         */
        var listener_set = function (self, listener, callback) {
            var listeners = listener[listeners_prop_name] || (listener[listeners_prop_name] = []);
            return listener_get(self, listener) || (listeners[listeners.length] = [self, callback], callback);
        };
        /**
         * @param {string} methodName
         */
        var docHijack = function (methodName) {
            var old = document[methodName];
            document[methodName] = function (v) {
                return addListen(old(v));
            };
        };
        /**
         * @this {!Window|HTMLDocument|Node}
         * @param {string} type
         * @param {EventListener|function(!Event):(boolean|undefined)} listener
         * @param {boolean=} useCapture
         */
        var addEvent = function (type, listener, useCapture) {
            if (is_callable(listener)) {
                var self = this;
                self.attachEvent(
                    'on' + type,
                    listener_set(self, listener, function (e) {
                        e = e || window.event;
                        e.preventDefault = e.preventDefault || function () { e.returnValue = false };
                        e.stopPropagation = e.stopPropagation || function () { e.cancelBubble = true };
                        e.target = e.target || e.srcElement || document.documentElement;
                        e.currentTarget = e.currentTarget || self;
                        e.timeStamp = e.timeStamp || (new Date()).getTime();
                        listener.call(self, e);
                    })
                );
            }
        };
        /**
         * @this {!Window|HTMLDocument|Node}
         * @param {string} type
         * @param {EventListener|function(!Event):(boolean|undefined)} listener
         * @param {boolean=} useCapture
         */
        var removeEvent = function (type, listener, useCapture) {
            if (is_callable(listener)) {
                var self = this;
                var lis = listener_get(self, listener);
                if (lis) {
                    self.detachEvent('on' + type, lis);
                }
            }
        };
        /**
         * @param {!Node|NodeList|Array} obj
         * @return {!Node|NodeList|Array}
         */
        var addListen = function (obj) {
            var i = obj.length;
            if (i) {
                while (i--) {
                    obj[i].addEventListener = addEvent;
                    obj[i].removeEventListener = removeEvent;
                }
            } else {
                obj.addEventListener = addEvent;
                obj.removeEventListener = removeEvent;
            }
            return obj;
        };

        addListen([document, window]);
        if ('Element' in window) {
            /**
             * IE8
             */
            var element = window.Element;
            element.prototype.addEventListener = addEvent;
            element.prototype.removeEventListener = removeEvent;
        } else {
            /**
             * IE < 8
             */
                //Make sure we also init at domReady
            document.attachEvent('onreadystatechange', function () { addListen(document.all) });
            docHijack('getElementsByTagName');
            docHijack('getElementById');
            docHijack('createElement');
            addListen(document.all);
        }
    }
})(window, document, 'x-ms-event-listeners');

//add .ng-hide css style, only work in IE
var css = '.ng-hide {display: none !important;}';
var head = document.head || document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
head.appendChild(style);