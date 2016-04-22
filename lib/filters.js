var _ = require('lodash'),
    moment = require('moment');

/**
 * object used store the methods registered as a 'filter' (of the same name) within nunjucks
 * filter.foo("input") here, becomes {{ "input" | foo }} within nunjucks templates
 * @type {Object}
 */
var filter = {};

/**
 * converts a parameter to a string
 * @param  {*} a a variable
 * @return {String}   The string value of the variable
 */
filter.s = filter.toString = function toString(a) {
  return typeof a.toString === 'function' ? a.toString() : '' + a;
};

/**
* checks if string contains passed substring
* @param {*} a variable - the string you want to test
* @param {String} the string you want to test for
* @return {Boolean} true if found else false
 */
filter.contains = function contains(a, s) {
  return a && s ? !!~a.indexOf(s) : false;
};

/**
* checks if string contains passed substring
* @param {*} a variable - the string you want to test
* @param {String} r the RegExp to test
* @return {Boolean} true if found else false
 */
filter.containsRegExp = function containsRegExp(a,r) {
  return new RegExp(r).test(a);
};

/**
 * ensure input is an array
 * @param  {*} i an item
 * @return {Array}   the item as an array
 */
filter.plural = function plural(i) {
  return Array.isArray(i) ? i : typeof i !== 'undefined' ? [i] : [];
};

/**
 * ensure input is not an array
 * @param  {*} a any variable
 * @return {*}   anything that isn't an array.
 */
filter.singular = function singular(a) {
  return _.isArray(a) ? a[0] : a;
};

/**
 * converts an array of objects or singular object to a list of pairs.
 * @param  {Array|Object} a  an array of objects or singular object
 * @param  {String} (optional) kp key property name, used if array of objects. defaults to 'key'
 * @param  {String} (optional) vp value property name, used if array of objects. defaults to 'value'
 * @return {Array}    array of key-value arrays
 */
filter.pairs = function pairs(a, kp, vp) {
  return _.isPlainObject(a) ? Object.keys(a).map(function(k) { return ! _.isEmpty(k) ? [k, a[k]] : '' }) :
         _.isArray(a) ? a.map(function(b) { return _.isPlainObject(b) ? [ _.get(b, kp || 'key'), _.get(b, vp || 'value') ] : b }) :
         a;
};

/**
 * converts an array of objects or singular object to a list of pairs.
 * @param  {Array|Object} a  an array of objects or singular object
 * @param  {String} (optional) kp key property name, used if array of objects. defaults to 'key'
 * @param  {String} (optional) vp value property name, used if array of objects. defaults to 'value'
 * @return {Array}    array of key-value arrays
 */
filter.pairs = function pairs(a, kp, vp) {
  return _.isPlainObject(a) ? Object.keys(a).map(function(k) { return ! _.isEmpty(k) ? [k, a[k]] : '' }) :
         _.isArray(a) ? a.map(function(b) { return _.isPlainObject(b) ? [ _.get(b, kp || 'key'), _.get(b, vp || 'value') ] : b }) :
         a;
};

/**
 * maps pair values to object keys.
 * @param  {Array|Object} p  an array
 * @param  {String} (optional) k1 key 1 will point to first value in array
 * @param  {String} (optional) k2 key 2 will point to second value in array
 * @return {Object} 	object with two key/values
 */
filter.unpackPair = function unpackPair(p, k1, k2) {
  var o = {}; return ( o[k1] = p[0], o[k2] = p[1], o);
};

/**
 * prefixes each item in a list
 * @param  {*} is a list of items, or a single item.
 * @param  {String|Function} p  a string or function to prefix the first item with.
 * @return {Array}    a list of prefixed items.
 */
filter.prefix = function prefix(is, p) {
  return filter.plural(is).map(function(i, index) {
    return _.isFunction(p) ? p(i, index) : _.isArray(p) ? p[index] + i : p + i;
  });
};

/**
 * in a list of lists (is), prefixes a string (p) to the first item of the inner list
 * @param  {Array} is a list of lists
 * @param  {String|Function} p  a string or function to prefix the first item with
 * @return {Array}    a list of items with the first item of the inner item prefixed
 */
filter.prefixFirst = function prefixFirst(is, p) {
  return filter.plural(is).map(function(i) {
    return _.isArray(i) ? (i[0] = _.isFunction(p) ? p(i[0]) : i[0], i) : i;
  });
};

/**
 * postfixes each item in a list
 * @param  {*} is a list of items, or a single item.
 * @param  {String|Number} p  used to postfix item.
 * @return {Array}    a list of postfixed items.
 */
filter.postfix = function postfix(is, p) {
  return filter.plural(is).map(function(i) { return _.isArray(i) ? filter.postfix(i, p) : i + p });
};

/**
 * wrap a string or a list of strings in two strings.
 * @param  {Array|String} w the string or list of strings to wrap
 * @param  {String} b the before string
 * @param  {String} a the after string
 * @return {Array}   the wrapped item
 */
filter.wrap = function wrap(w,a,b) {
  return a + w + b;
};

/**
 * gets the css modifiers of a base class namfilter.
 * @param  {String} b  base class name
 * @param  {Array|String} ms modifiers
 * @return {string}    modifiers
 */
filter.modifiers = function modifiers(b, ms) {
  return filter.plural(ms).map(function(m) { return b + '-' + m }).join(' ');
};

/**
 * prepends a base class with the modifiers of the base class.
 * @param  {String} b  base class
 * @param  {Array|String} ms modifiers
 * @return {String}    base class name and modifiers
 */
filter.withModifiers = function withModifiers(b, ms) {
  return [b].concat(filter.modifiers(b, ms) || []).join(' ');
};

/**
 * composes the classes for the component
 * @param  {String} b  base module class
 * @param  {Object} md the metadata object
 * @return {String}    component classes
 */
filter.componentClasses = filter.setClasses = function componentClasses(b, md) {
  return (md = md || {}, [filter.withModifiers(b, md.modifiers)].concat(md.classes || []).join(' '));
};

/**
 * creates rearranges values and creates new date object
 * @param  {String} d   A date string (must be) formatted (d)d/(m)m/yyy - in parens means optional
 * @return {String}     a javascript date string
 */
filter.newDate = function date(d) {
	var dateArr = d.split('/');
	return dateArr.length === 3 ? new Date(dateArr[2], parseInt(dateArr[1]) - 1, dateArr[0]) : NaN;
};

/**
 * returns a standard gov.uk date from a string using momentjs
 * moment documentation: http://momentjs.com/docs/
 * @method function
 * @param  {string} d date e.g 09/12/1981 or 9-12-1981
 * @param  {string} f moment.js format string (to override the default if needed)
 * @return {string} date string as per the current gov.uk standard 09/12/1981 -> 09 December 1981
 */
filter.formatDate = function(d,f) {
  return moment(filter.newDate(d)).locale('en-gb').format(f ? f : 'LL');
};

/**
 * logs an object in the template to the console on the client.
 * @param  {Any} a any type
 * @return {String}   a script tag with a console.log call.
 * @example {{ "hello world" | log }}
 * @example {{ "hello world" | log | safe }}  [for environments with autoescaping turned on]
 */
filter.log = function log(a) {
	return '<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>';
};

/**
 * Converts string to camel case
 * @param {String} any string
 * @return {String} a string
 * @example {{ "Hello There" | toCamelCase }} // helloThere
 */
filter.toCamelCase = function toCamelCase(s) {
	return s.trim().split(/-| /).reduce(function (pw, cw, i) {
		return pw += (i === 0 ? cw[0].toLowerCase() : cw[0].toUpperCase()) + cw.slice(1);
	}, '');
};

/**
 * Hypthenates a string
 * @param {String} string to be converted
 * @return {String}
 * @example {{ "Hello there" | toHyphenated }} // hello-there
 */
filter.toHyphenated = function toHyphenated(s) {
	return s.trim().toLowerCase().replace(/\s+/g, '-');
};

/**
 * writes the context as the value of an attribute
 * @param  {String} v the attribute value
 * @param  {String} a attribute name
 * @return {String}
 */
filter.attr = function attr(v, a, p) {
  return (!_.isEmpty(v) ? (p || '') + a + '="' + v + '"' : '');
};

/**
 * takes a list of key-value lists and converts them to attribute format
 * @param  {Array} is list of key-value lists
 * @param  {String} (optional) p  prefix the attribute name
 * @return {Array} list of attributes
 */
filter.attrs = function attrs(is, p) {
  return filter.plural(is).map( function(i) { return _.isArray(i) ? filter.attr(i[1], i[0], p) : '' } );
};

/**
 * slice an array (splice because slice is a default filter.)
 * @param  {Array} is items to slice
 * @param  {Number} a  Index to slice from
 * @param  {Number} (optional) b  Index to slice to
 * @return {Array}    a sliced list
 */
filter.splice = function splice(is, a, b) {
  return filter.plural(is).slice(a, b);
};


/**
 * splice an array
 * @param  {Array} 		is items to splice
 * @param  {Number} 	a  Index to splice from
 * @param  {Number} 	(optional) b  Index to splice to
 * @param  (optional) 	c  Item to inset at index a
 * @return {Array}   	a spliced list
 */
filter.spliceItem = function spliceItem(is, a, b, c) {
  return filter.plural(is).splice(a, b, c);
};

/**
 * deep merge that supports concating arrays & strings.
 * @param  {Object} o1           a plain object to merge
 * @param  {Object} o2           a plain object to merge
 * @param  {Boolean} mergeStrings will merge strings together if true
 * @return {Object}              the resulting merged object
 */
filter.deeperMerge = filter.defaultConfig = function deeperMerge(o1, o2, mergeStrings) {

  mergeStrings = typeof mergeStrings !== undefined ? mergeStrings : false;

  // exit conditions
  if      ( ! o1 && ! o2 )          { return; }
  else if ( ! _.isPlainObject(o1) ) { return o2; }
  else if ( ! _.isPlainObject(o2) ) { return o1; }

  return _
    .union(Object.keys(o1), Object.keys(o2))
    .map(function(k) {
      return [k, (
        ( typeof o1[k] === 'string' && typeof o2[k] === 'string' ) ? ( mergeStrings ? o1[k] + o2[k] : o2[k] ) :
        ( _.isPlainObject(o1[k]) || _.isPlainObject(o2[k]) ) ? deeperMerge(o1[k], o2[k], mergeStrings) :
        ( _.isArray(o1[k]) && _.isArray(o2[k]) ) ? o1[k].concat(o2[k]) :
        ( o1[k] && !o2[k] ) ? o1[k] : o2[k]
      )];
    })
    .reduce(function(a, b) { return (a[b[0]] = b[1], a) }, {});
};

// export some lodash methods directly.
// See: https://lodash.com/docs
filter.merge = filter.m = _.merge;
filter.defaults = filter.ds = _.defaults;
filter.keys = _.keys;
filter.values = _.values;
filter.first = _.first;
filter.flatten = _.flatten;
filter.flattenDeep = _.flattenDeep;
filter.get = _.get;
filter.pick = _.pick;
filter.range = _.range;
filter.zipObject = function(a) { return _.zipObject(a) };
filter.omit = _.omit;
filter.clone = _.clone;
filter.kebabCase = _.kebabCase;

module.exports = filter;
