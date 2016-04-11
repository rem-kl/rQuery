(function () {
    'use strict';
    var $ = function (selector) {

        if ( ! (this instanceof $) ) {
            return new $(selector);
        }

        var elements;

        if (typeof selector === 'string') {
            elements = document.querySelectorAll(selector);
        }
        else {
            elements = selector;
        }
        for (var i = 0; i < elements.length; i++) {
            this[i] = elements[i];
        }
        this.length = elements.length;
    };

    // Method on '$' object -- copies over values from a defined object over to target object
    $.extend = function (target, object) {
        for (var prop in object) {
            target[prop] = object[prop];
        }
        return target;
    };

    // STATIC METHODS
    var isArrayLike = function (obj) {
        if (typeof obj.length === 'number') {
            if (obj.length === 0) { //empty array-like object
                return true
            }
            else if (obj.length > 0) {
                return (obj.length - 1) in obj; //array-like object with at least one property
            }
        }
        return false;
    };

    // Returns the inner text of a single node e.g $(#uniqueElement), or the text of multiple elements e.g. $(li)
    var getText = function(childNodes) {
        var text = "";
        $.each(childNodes, function(i, child) {
            if (child.nodeType === 3) {
                text += child.nodeValue;
            }
            else {
                text += getText(child.childNodes);
            }
        });
        return text;
    };


    // Extend '$' with core functionality
    $.extend($, {

        // IS ARRAY: checks if an object is an array
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },

        // FOREACH: Loops through array-like items and objects
        each: function (collection, cb) {
            if (isArrayLike(collection)) {
                for (var i = 0; i < collection.length; i++) {
                    if (cb.call(this, i, collection[i]) === false) { // still runs the callback function each time
                        break;
                    }
                }
            }
            else {
                for (var prop in collection) {
                    if (collection.hasOwnProperty(prop)) {
                        if (cb.call(this, prop, collection[prop]) === false) {
                            break;
                        }
                    }
                }
            }
            return collection;
        },

        // MAKEARRAY: turns an 'array-like' object into a real array
        makeArray: function (arr) {
            var array = [];
            $.each(arr, function (i, value) {
                array.push(value);
            });
            return array;
        },

        // PROXY: takes a function and returns a new function that calls the original function with a specific context
        proxy: function (fn, context) {
            return function () {
                return fn.apply(context, args);
            }
        }
    });

    // EXTEND '$' again with methods to have jQuery-like utilizing core functionality implemented above
    $.extend($.prototype, {

        // HTML: Get an elements inner-html, or set a element inner-html
        // called with args = set html, called without args = get html
        html: function (newHtml) {
            if (arguments.length) {
                $.each(this, function(i, element) { // 'element' is a HTML element, in the collection 'this'
                    element.innerHTML = newHtml;
                });
                return this;
            }
            else {
                if (this[0]) {
                    return this[0].innerHTML;
                }
            }
        },

        // VAL: Get or set the "value" property for a HTML 'input' tag
        val: function (newVal) {
            if (arguments.length) {
                $.each(this, function(i, element) {
                    element.value = newVal;
                });
                return this;
            }
            else {
                if (this[0]) {
                    return this[0].value;
                }
            }
        },

        // TEXT: Get or set the text INSIDE a HTML element (escapes any mark-up) -- NEED TO FIX THIS
        text: function(newText) {
            if (arguments.length) {
                this.html("");
                return $.each(this, function(i, element) {
                    var textNode = document.createTextNode(newText);
                    element.appendChild(textNode);
                });
            }
            else {
                return getText(this[0].childNodes);
            }
        },

        // FIND: Returns a list of all the child nodes of the selected element
        // e.g. $('div').find('img'); returns an array of all images inside all divs bound to an instance of '$'
        find: function (selector) {
            var elements = [];
            $.each(this, function(i, element) {
                var els = element.querySelectorAll(selector);
                [].push.apply(elements, els);
            });
            return $(elements);
        },

        // NEXT: Returns a element - not a text node - that is 'next' to the calling element (next sibling)
        next: function () {
            var elements = [];
            $.each(this, function(i, element) {
                var current = element.nextSibling;
                // if its a DOM node this while loop gets skipped, and it goes straight to being pushed onto the array
                while (current && current.nodeType !== 1) {
                    current = current.nextSibling;
                }
                if (current) {
                    elements.push(current);
                }
            });

            return $(elements);
        },

        // PREVIOUS: Same as 'next' but in the opposite direction
        prev: function () {
            var elements = [];
            $.each(this, function(i, element) {
                var current = element.previousSibling;
                while (current && current.nodeType !== 1) {
                    current = current.previousSibling;
                }
                if (current) {
                    elements.push(current);
                }
            });

            return $(elements);
        },

        parent: function() {

        },

        children: function () {
        },

        // ATTR: Read and write attribute (e.g. ID's and classnames) properties on an element
        attr: function (attrName, value) {
            // Setting attribute
            if (arguments.length > 1) {
                return $.each(this, function(i, element) {
                    element.setAttribute(attrName, value);
                });
            }
            // Getting attribute
            else {
                if (this[0]) {
                    return this[0].getAttribute(attrName);
                }
            }
        },

        // CSS: Read and write CSS Styles on an element.
        css: function (cssPropName, value) {
            // Setting CSS style
            if (arguments.length > 1) {
                return $.each(this, function(i, element) {
                    element.style[cssPropName] = value;   // add a new value to elements 'style' attribute
                });
            }
            // returning CSS style
            else {
                if (this[0]) {
                    return document.defaultView.getComputedStyle(this[0])
                        .getPropertyValue(cssPropName);
                }
            }
        },

        // WIDTH: Returns the width of the element (minus the padding) in the box model
        width: function () {
            var clientWidth = this[0].clientWidth;
            var leftPadding = this.css("padding-left"),
                rightPadding = this.css("padding-right");

            return clientWidth - parseInt(leftPadding)
                    - parseInt(rightPadding);
        },

        // OFFSET: Returns the position of an element in the page
        offset: function () {
            var offset = this[0].getBoundingClientRect();    // gets the offset relative to the viewport
            return {
                top: offset.top + window.pageYOffset,
                left: offset.left + window.pageXOffset  // returns offset that takes into account how far down you have already scrolled
            };
        },

        hide: function () {
            this.css("display", "none");
        },

        show: function () {
            this.css("display", "");
        },

        // Events
        bind: function (eventName, handler) {
            $.each(this, function(i, element) {
                element.addEventListener(eventName, handler, false);
            });
        },

        unbind: function (eventName, handler) {
            $.each(this, function(i, element) {
                element.removeEventListener(eventName, handler, false);
            });
        },

        has: function (selector) {
            var elements = [];

            $.each(this, function (i, el) {
                if (el.matches(selector)) {
                    elements.push(el);
                }
            });

            return $(elements);
        },

        on: function (eventType, selector, handler) {
            return this.bind(eventType, function (ev) {
                var cur = ev.target;
                do {
                    if ($([cur]).has(selector).length) {
                        handler.call(cur, ev);
                    }
                    cur = cur.parentNode;
                } while (cur && cur !== ev.currentTarget);
            });
        },

        off: function(eventType, selector, handler) {
          return $.each(this, function(i, element) {
            var events = $([ element ]).data("events");
            if (events[eventType] && events[eventType][selector]) {
              var delegates = events[eventType][selector], i = 0;
              while (i < delegates.length) {
                if (delegates[i].handler === handler) {
                  element.removeEventListener(eventType, delegates[i].delegator, false);
                  delegates.splice(i, 1);
                } else {
                  i++;
                }
              }
            }
          });
        },

        data: function (propName, data) {
        },

        addClass: function (className) {
        },

        removeClass: function (className) {
        },

        append: function (element) {
        }
    });

    $.buildFragment = function (html) {
    };


})();
