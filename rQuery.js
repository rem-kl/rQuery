(function () {

    $ = function (selector) {
        if ( !(this instanceof $) ) {
            return new $(selector);
        }
        var elements;
        // check if the selector is a string
        if (typeof selector === 'string') {
            elements = document.querySelectorAll(selector);
        }
        else {
            elements = selector;
        }
        for (var i = 0; i < elements.length; i++) {
            this[i] = elements[i];
        }
        this.length = elements.length; // 'this' refers to the object calling the '$' function
        // Could also just use Array.prototype.push.apply(this, elements);
        // 'push' does the same stuff as the code above, but maybe harder to comprehend
    };

    // Method on '$' object -- copies over values from a defined object over to target object
    $.extend = function (target, object) {
        for (var prop in object) {
            target[prop] = object[prop];
        }
        return target;
    };

    // Static method to check if an object behaves like an array (has items / length)
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

        next: function () {
        },

        prev: function () {
        },

        parent: function () {
        },

        children: function () {
        },

        attr: function (attrName, value) {
        },

        css: function (cssPropName, value) {
        },

        width: function () {
        },

        offset: function () {
            var offset = this[0].getBoundingClientRect();
            return {
                top: offset.top + window.pageYOffset,
                left: offset.left + window.pageXOffset
            };
        },

        hide: function () {
        },

        show: function () {
        },

        // Events
        bind: function (eventName, handler) {
        },

        unbind: function (eventName, handler) {
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
        off: function (eventType, selector, handler) {
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
