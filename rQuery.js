(function() {

  $ = function(selector) {
    if (!(this instanceof $)) {
      return new $(selector);
    }
    var elements;
    if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector);
    } else if($.isArray(selector)) {
      elements = selector;
    }
    // copy over elements into the jQuery object
    [].push.apply(this, elements);
  };

  $.extend = function(target, object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
          target[key] = object[key];
      }
    }
    return target;
  };

  $.extend($, {
    isArray: function(obj) {
      return Array.isArray(obj);
    },
    each: function(collection, cb) {
      if (isArrayLike(collection)) {
        for (var i = 0; i < collection.length; i++) {
          var value = collection[i];
          cb.call(value, i, value);
        }
      }
      else {
        for (var key in collection) {
          if (collection.hasOwnProperty(key)) {
            cb.call(collection[key], key, collection[key]);
          }
        }
      }
      return collection;
    },
    makeArray: function(arr) {
      if ($.isArray(arr)) return arr;
      var result = [];
      $.each(arr, function(i, value) {
        result.push(value);
      })
      return result;
    },
    proxy: function(fn, context) {
      return function() {
        return fn.apply(context, arguments);
      }
    }
  });

  $.extend($.prototype, {
    html: function(newHtml) {
      html: function(newHtml) {
        if (arguments.length) {
          return $.each(this, function(i, element) {
            element.innerHTML = newHtml;
          });
        } else {
          return this[0].innerHTML;
        }
    },
    val: function(newVal) {
      if (arguments.length) {
        return $.each(this, function(i, element) {
          element.value = newVal;
        });
      } else {
        return this[0].value;
      }
    },
    text: function(newText) {},
    find: function(selector) {},
    next: function() {},
    prev: function() {},
    parent: function() {},
    children: function() {},
    attr: function(attrName, value) {},
    css: function(cssPropName, value) {},
    width: function() {},
    offset: function() {
      var offset = this[0].getBoundingClientRect();
      return {
        top: offset.top + window.pageYOffset,
        left: offset.left + window.pageXOffset
      };
    },
    hide: function() {},
    show: function() {},

    // Events
    bind: function(eventName, handler) {},
    unbind: function(eventName, handler) {},
    has: function(selector) {
      var elements = [];

      $.each(this, function(i, el) {
        if(el.matches(selector)) {
          elements.push(el);
        }
      });

      return $( elements );
    },
    on: function(eventType, selector, handler) {
      return this.bind(eventType, function(ev){
        var cur = ev.target;
        do {
          if ($([ cur ]).has(selector).length) {
            handler.call(cur, ev);
          }
          cur = cur.parentNode;
        } while (cur && cur !== ev.currentTarget);
      });
    },
    off: function(eventType, selector, handler) {},
    data: function(propName, data) {},

    // Extra
    addClass: function(className) {},
    removeClass: function(className) {},
    append: function(element) {}
  });

  $.buildFragment = function(html) {};

  // Static methods
  function isArrayLike(obj) {
    if (typeof obj.length === 'number') {
      if (obj.length === 0)
        return true;
      else
        return (obj.length - 1) in obj;
    }
    return false;
  }

})();
