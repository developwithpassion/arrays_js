parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Jpho":[function(require,module,exports) {
var define;
var e;parcelRequire=function(r,t,n,u){var o,i="function"==typeof parcelRequire&&parcelRequire,c="function"==typeof require&&require;function f(e,n){if(!t[e]){if(!r[e]){var u="function"==typeof parcelRequire&&parcelRequire;if(!n&&u)return u(e,!0);if(i)return i(e,!0);if(c&&"string"==typeof e)return c(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}l.resolve=function(t){return r[e][1][t]||t},l.cache={};var a=t[e]=new f.Module(e);r[e][0].call(a.exports,l,a,a.exports,this)}return t[e].exports;function l(e){return f(l.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=r,f.cache=t,f.parent=i,f.register=function(e,t){r[e]=[function(e,r){r.exports=t},{}]};for(var a=0;a<n.length;a++)try{f(n[a])}catch(r){o||(o=r)}if(n.length){var l=f(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof e&&e.amd&&e(function(){return l})}if(parcelRequire=f,o)throw o;return f}({bQ1c:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=function e(r){for(var t=arguments.length,n=new Array(t>1?t-1:0),u=1;u<t;u++)n[u-1]=arguments[u];return r.length<=n.length?r.apply(void 0,n):function(){for(var t=arguments.length,u=new Array(t),o=0;o<t;o++)u[o]=arguments[o];return e.apply(void 0,[r].concat(n,u))}};t.default=n},{}],Focm:[function(e,r,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return n.default}});var n=function(e){return e&&e.__esModule?e:{default:e}}(e("./curry"))},{"./curry":"bQ1c"}]},{},["Focm"]);
},{}],"NmBf":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.generate=exports.sort=exports.max=exports.true_for_all=exports.uniq=exports.flat_map=exports.map=exports.filter=exports.none=exports.any=exports.first=exports.last=exports.reduce=exports.each_in_reverse=exports.each=exports.each_in_reverse_until=exports.each_until=void 0;var r=e(require("@developwithpassion/curry_js"));function e(r){return r&&r.__esModule?r:{default:r}}var t=(0,r.default)(function(r,e){for(var t=Array.prototype.slice.call(e,0),n=0;n<t.length;n++){var a=r(t[n],n,t);if(null!=a&&!1===a)return}});exports.each_until=t;var n=(0,r.default)(function(r,e){for(var t=Array.prototype.slice.call(e,0),n=t.length-1;n>=0;n--){var a=r(t[n],n,t);if(null!=a&&!1===a)return}});exports.each_in_reverse_until=n;var a=function(e){return(0,r.default)(function(r,t){return e(function(){r.apply(void 0,arguments)},t)})},u=a(t);exports.each=u;var o=a(n);exports.each_in_reverse=o;var l=["+","-","/","*"],i=(0,r.default)(function(r,e){for(var t=arguments.length,n=new Array(t>2?t-2:0),a=2;a<t;a++)n[a-2]=arguments[a];var u=n.pop();return l.indexOf(r)>-1?c.apply(null,[r,e,u].concat(n)):f.apply(null,[e,r,u].concat(n))});function f(r,e,t){var n=0;void 0===e&&(e=t[0],n=1);var a=e;return u(function(e,t,u){t>=n&&(a=r(a,e,t,u))},t),a}function c(r,e,t){var n="return accumulator ".concat(r,"=current_value");return f(new Function("accumulator, current_value",n),e,t)}exports.reduce=i;var p=(0,r.default)(function(r,e,t){var n=null;return r(function(){var r=e.apply(void 0,arguments);return r&&(n=arguments.length<=0?void 0:arguments[0]),!r},t),n});function s(r){return function(e){if(Array.isArray(e))return e[0]||null;if(null===e)return null;for(var t=e,n=arguments.length,a=new Array(n>1?n-1:0),u=1;u<n;u++)a[u-1]=arguments[u];return a.length>0?p(r,t,a.pop()):p(r,t)}}var v=s(n);exports.last=v;var x=s(t);exports.first=x;var d=(0,r.default)(function(r,e){return!!x(r,e)});exports.any=d;var y=(0,r.default)(function(r,e){return!d(r,e)});exports.none=y;var _=(0,r.default)(function(r,e){return i([],function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),u=2;u<n;u++)a[u-2]=arguments[u];return r.apply(void 0,[t].concat(a))&&e.push(t),e},e)});exports.filter=_;var h=(0,r.default)(function(r,e){return i([],function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return e.push(r.apply(void 0,n)),e},e)});exports.map=h;var A=(0,r.default)(function(r,e){return i([],function(e,t){return e.concat(r(t))},e)});exports.flat_map=A;var g=A(function(r){return Array.isArray(r)?g(r):[r]}),m=(0,r.default)(function(r,e){return _(function(t,n){var a=r(t);return n===e.findIndex(function(e){return r(e)===a})},e)}),w=function(r){for(var e=arguments.length,t=new Array(e>1?e-1:0),n=1;n<e;n++)t[n-1]=arguments[n];return 0===t.length&&Array.isArray(r)?m(function(r){return r},r):m.apply(void 0,[r].concat(t))};exports.uniq=w;var q=(0,r.default)(function(r,e){return i(!0,function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return e&&r.apply(void 0,n)},e)});exports.true_for_all=q;var j=(0,r.default)(function(r,e){return i(0,function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];var u=r.apply(void 0,n);return u>e?u:e},e)});exports.max=j;var M=function(r){for(var e=(r||[]).slice(0),t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return e.sort.apply(e,n),e},O=function(r){return null===r?[]:Array.isArray(r)?M(r):function(e){return M(e,r)}};exports.sort=O;var b=function(r,e){return h(function(r,t){return e(t)},new Array(r).fill(null))};exports.generate=b;var F={each:u,each_until:t,each_in_reverse:o,each_in_reverse_until:n,last:v,first:x,any:d,none:y,filter:_,map:h,flat_map:A,flatten:g,uniq:w,true_for_all:q,reduce:i,sort:O,max:j,generate:b};exports.default=F;
},{"@developwithpassion/curry_js":"Jpho"}],"Focm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e={};Object.defineProperty(exports,"default",{enumerable:!0,get:function(){return t.default}});var t=n(require("./arrays"));function r(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return r=function(){return e},e}function n(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=r();if(t&&t.has(e))return t.get(e);var n={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if(Object.prototype.hasOwnProperty.call(e,u)){var f=o?Object.getOwnPropertyDescriptor(e,u):null;f&&(f.get||f.set)?Object.defineProperty(n,u,f):n[u]=e[u]}return n.default=e,t&&t.set(e,n),n}Object.keys(t).forEach(function(r){"default"!==r&&"__esModule"!==r&&(Object.prototype.hasOwnProperty.call(e,r)||Object.defineProperty(exports,r,{enumerable:!0,get:function(){return t[r]}}))});
},{"./arrays":"NmBf"}]},{},["Focm"], null)
//# sourceMappingURL=/index.js.map