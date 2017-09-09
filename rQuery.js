;(function() {
  $ = function(selector) {
    if (!(this instanceof $)) {
      return new $(selector)
    }
    var elements
    if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector)
    } else if ($.isArray(selector)) {
      elements = selector
    }
    // copy over elements into the jQuery object
    ;[].push.apply(this, elements)
  }

  $.extend = function(target, object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        target[key] = object[key]
      }
    }
    return target
  }

  $.extend($, {
    isArray: function(obj) {
      return Array.isArray(obj)
    },
    each: function(collection, cb) {
      if (isArrayLike(collection)) {
        for (var i = 0; i < collection.length; i++) {
          var value = collection[i]
          cb.call(value, i, value)
        }
      } else {
        for (var key in collection) {
          if (collection.hasOwnProperty(key)) {
            cb.call(collection[key], key, collection[key])
          }
        }
      }
      return collection
    },
    makeArray: function(arr) {
      if ($.isArray(arr)) return arr
      var result = []
      $.each(arr, function(i, value) {
        result.push(value)
      })
      return result
    },
    proxy: function(fn, context) {
      return function() {
        return fn.apply(context, arguments)
      }
    }
  })

  $.extend($.prototype, {
    html: function(newHtml) {
      if (arguments.length) {
        return $.each(this, function(i, element) {
          element.innerHTML = newHtml
        })
      } else {
        return this[0] && this[0].innerHTML
      }
    },
    val: function(newVal) {
      if (arguments.length) {
        return $.each(this, function(i, element) {
          element.value = newVal
        })
      } else {
        return this[0].value
      }
    },
    text: function(newText) {
      if (arguments.length) {
        this.html('')
        return $.each(this, function(i, element) {
          var text = document.createTextNode(newText)
          element.appendChild(text)
        })
      } else {
        return this[0] && getText(this[0])
      }
    },
    find: function(selector) {
      var elements = []
      // find the elements defined by the selector for each child element
      $.each(this, function(i, element) {
        var els = element.querySelectorAll(selector)
        ;[].push.apply(elements, els)
      })
      return $(elements)
    },
    next: function() {
      var elements = []

      $.each(this, function(i, element) {
        var current = element.nextSibling
        while (current && current.nodeType !== Node.ELEMENT_NODE) {
          current = current.nextSibling
        }
        if (current) {
          elements.push(current)
        }
      })

      return $(elements)
    },
    prev: function() {
      var elements = []

      $.each(this, function(i, element) {
        var current = element.previousSibling
        while (current && current.nodeType !== Node.ELEMENT_NODE) {
          current = current.previousSibling
        }
        if (current) {
          elements.push(current)
        }
      })

      return $(elements)
    },
    parent: function() {
      var elements = []
      $.each(this, function(i, el) {
        elements.push(el.parentNode)
      })
      return $(elements)
    },
    children: function() {
      var elements = []
      $.each(this, function(i, el) {
        if (el.children) {
          for (var i = 0; i < el.children.length; i++) {
            elements.push(el.children[i])
          }
        }
      })
      return $(elements)
    },
    attr: function(attrName, value) {},
    css: function(cssPropName, value) {},
    width: function() {},
    offset: function() {
      var offset = this[0].getBoundingClientRect()
      return {
        top: offset.top + window.pageYOffset,
        left: offset.left + window.pageXOffset
      }
    },
    hide: function() {},
    show: function() {},

    // Events
    bind: function(eventName, handler) {},
    unbind: function(eventName, handler) {},
    has: function(selector) {
      var elements = []

      $.each(this, function(i, el) {
        if (el.matches(selector)) {
          elements.push(el)
        }
      })

      return $(elements)
    },
    on: function(eventType, selector, handler) {
      return this.bind(eventType, function(ev) {
        var cur = ev.target
        do {
          if ($([cur]).has(selector).length) {
            handler.call(cur, ev)
          }
          cur = cur.parentNode
        } while (cur && cur !== ev.currentTarget)
      })
    },
    off: function(eventType, selector, handler) {},
    data: function(propName, data) {},

    // Extra
    addClass: function(className) {},
    removeClass: function(className) {},
    append: function(element) {}
  })

  $.buildFragment = function(html) {}

  // Static methods
  function isArrayLike(obj) {
    if (typeof obj.length === 'number') {
      if (obj.length === 0) return true
      else return obj.length - 1 in obj
    }
    return false
  }

  function getText(element) {
    var text = ''
    $.each(element.childNodes, function(i, node) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        text += getText(node)
      }
    })
    return text
  }

  function createTraverserFunction(callback) {
    return function() {
      var elements = []
      var callbackArgs = arguments

      $.each(this, function(i, el) {
        var returnValue = cb.apply(el, callbackArgs) // e.g element.parentNode

        if (isArrayLike(returnValue)) {
          ;[].push.apply(elements, returnValue)
        } else if (returnValue) {
          elements.push(returnValue)
        }
      })

      return $(elements)
    }
  }
})()

// Function.prototype.method = function(name, fn) {
// this.prototype[name] = fn;
// return this;
// };
