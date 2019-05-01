var HostedFields = new function() {
  this.create = function(t) {
    return new e(t)
  }
  var e = function(e) {
    function t(e, t, n) {
      n || (n = '*'), e.postMessage(JSON.stringify(t), n)
    }
    function n(e) {
      window.addEventListener(
        'message',
        function(t) {
          e(JSON.parse(t.data), t)
        },
        !1
      )
    }
    function i(e) {
      B['tokenize.' + e.requestId] &&
        B['tokenize.' + e.requestId].forEach(function(t) {
          t(e.err, e.response)
        })
    }
    function o(e) {
      var t = { type: 'cardTypeChange', cardType: e.cardType, timestamp: r() }
      O.trigger(t)
    }
    function s(e) {
      var t = { type: 'validityChange', field: e.fieldName, isValid: e.valid, timestamp: r() }
      O.trigger(t)
    }
    function a(e) {
      var t = { type: e.type, field: e.fieldName, timestamp: r() }
      O.trigger(t)
    }
    function r() {
      return Number(new Date())
    }
    function c(t) {
      var n = t.fieldName,
        i = t.valid,
        o = document.querySelector(e.fields[n].selector)
      i
        ? (l(o, 'hosted-fields-valid'), f(o, 'hosted-fields-invalid'))
        : (f(o, 'hosted-fields-valid'), l(o, 'hosted-fields-invalid'))
    }
    function l(e, t) {
      e &&
        (e.className ? e.className.includes && !e.className.includes(t) && (e.className += ' ' + t) : (e.className = t))
    }
    function f(e, t) {
      e &&
        e.className &&
        (e.className = e.className
          .replace(t, '')
          .replace(/^\s|\s$/g, '')
          .replace(/\s\s+/g, ' '))
    }
    function d(e, n) {
      Object.keys(e).forEach(function(i) {
        ;(J[i] = !1),
          h(e[i].selector, i, e[i], function(e, o) {
            var s = { type: 'applyStyles', data: n }
            t(e.contentWindow, s), u(e, o), g(i)
          })
      })
    }
    function u(e, t) {
      var n
      if (t.labelSelector) n = document.querySelectorAll(t.labelSelector)
      else {
        var i = t.selector.replace('#', '')
        n = document.querySelectorAll('label[for="' + i + '"]')
      }
      n.forEach &&
        n.forEach(function(t) {
          t.addEventListener('click', function() {
            e && e.contentWindow.focus()
          })
        })
    }
    function m(e) {
      var t = document.createElement('iframe')
      ;(t.class = 'pin-control-iframe'),
        (t.src = p()),
        (t.style.cssText = 'display: none;'),
        document.body.appendChild(t),
        t.addEventListener('load', function() {
          e(t)
        })
    }
    function p() {
      return I + '/hosted_fields.html?instance_identifier=' + W
    }
    function h(e, t, n, i) {
      var o = document.querySelector(e),
        s = y(t, n)
      o.appendChild(s),
        l(o, 'pin-form-field'),
        s.addEventListener('load', function() {
          var e = document.getElementById(_ + t)
          i(e, n)
        })
    }
    function y(e, t) {
      var n = document.createElement('iframe')
      return (
        (n.id = _ + e),
        (n.src = v(e, t)),
        (n.frameBorder = '0'),
        (n.scrolling = 'no'),
        (n.allowTransparency = 'true'),
        (n.style.cssText = j),
        n
      )
    }
    function v(e, t) {
      var n = I + '/field.html?field_name=' + e + '&instance_identifier=' + W
      return t.placeholder && (n += '&placeholder=' + w(t.placeholder)), M && (n += '&autocomplete=' + M), n
    }
    function g(e) {
      J[e] = !0
      var t = !0
      Object.keys(J).forEach(function(e) {
        J[e] || (t = !1)
      }),
        t && b()
    }
    function b() {
      var e = { type: 'ready', timestamp: r() }
      O.trigger(e)
    }
    function w(e) {
      return e.replace(/[^\w\/\s@\$]/g, '')
    }
    function k(e) {
      q(e, 'options must be a hash'),
        E(e, 'fields', 'options.fields is required'),
        q(e.fields, 'options.fields must be a hash'),
        S(Object.keys(e.fields), 4, 'options.fields must contain exactly 4 keys, ' + A),
        A.forEach(function(t) {
          E(e.fields, t, 'options.fields must contain key :: ' + t),
            E(e.fields[t], 'selector', 'options.fields.' + t + '.selector must be present'),
            N(e.fields[t].selector, 'string', 'options.fields.' + t + '.selector must a string')
          var n = document.querySelectorAll(e.fields[t].selector)
          S(n, 1, "Selector for field '" + t + "' matches " + n.length + ' elements, must match exactly 1 element'),
            e.fields[t].labelSelector &&
              N(e.fields[t].labelSelector, 'string', 'options.fields.' + t + '.labelSelector must a string')
        })
    }
    function S(e, t, n) {
      if (e.length !== t) throw n
    }
    function E(e, t, n) {
      if (!e[t]) throw n
    }
    function N(e, t, n) {
      if (typeof e !== t) throw n
    }
    function q(e, t) {
      if (!e || e.constructor !== Object) throw t
    }
    function T() {
      return x(Math.floor(268435456 * (1 + Math.random()))) + x(z() + 65536)
    }
    function x(e) {
      return e.toString(16).substring(1)
    }
    function z() {
      return new Date().getTime() % 1e3
    }
    var C,
      O = this,
      _ = 'pin.',
      I = 'https://cdn.pin.net.au/hosted_fields_assets',
      j = 'border: none; width: 100%; height: 100%; float: left; overflow: hidden;',
      L = !1,
      A = ['name', 'number', 'cvc', 'expiry'],
      M = !1,
      W = T(),
      B = {},
      D = 0,
      J = {}
    ;(O.tokenize = function(e, n) {
      q(e, 'Params must be a hash'), N(n, 'function', 'Tokenize callback must be a function')
      var i = { type: 'tokenize', params: e, sandbox: L, requestId: ++D }
      ;(B['tokenize.' + i.requestId] = [n]), t(C.contentWindow, i)
    }),
      (O.on = function(e, t) {
        B[e] || (B[e] = []), B[e].push(t)
      }),
      (O.trigger = function(e, t) {
        B[e.type] &&
          B[e.type].forEach(function(n) {
            n(e, t)
          })
      }),
      (function() {
        k(e),
          e.sandbox && (L = e.sandbox),
          e.autocomplete && (M = e.autocomplete),
          m(function(t) {
            ;(C = t), d(e.fields, e.styles)
          }),
          n(function(e) {
            switch (e.type) {
              case 'tokenizeResponse':
                i(e)
                break
              case 'validityChange':
                c(e), s(e)
                break
              case 'cardTypeChange':
                o(e)
                break
              default:
                a(e)
            }
          })
      })()
  }
}()
