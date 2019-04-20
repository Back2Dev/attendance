const HostedFields = new function() {
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
        t => {
          if (typeof t.data === 'string') e(JSON.parse(t.data), t)
        },
        !1
      )
    }
    function i(e) {
      B[`tokenize.${e.requestId}`] &&
        B[`tokenize.${e.requestId}`].forEach(t => {
          t(e.err, e.response)
        })
    }
    function o(e) {
      let t = { type: 'cardTypeChange', cardType: e.cardType, timestamp: r() }
      O.trigger(t)
    }
    function s(e) {
      let t = { type: 'validityChange', field: e.fieldName, isValid: e.valid, timestamp: r() }
      O.trigger(t)
    }
    function a(e) {
      let t = { type: e.type, field: e.fieldName, timestamp: r() }
      O.trigger(t)
    }
    function r() {
      return Number(new Date())
    }
    function c(t) {
      let n = t.fieldName,
        i = t.valid,
        o = document.querySelector(e.fields[n].selector)
      i
        ? (l(o, 'hosted-fields-valid'), f(o, 'hosted-fields-invalid'))
        : (f(o, 'hosted-fields-valid'), l(o, 'hosted-fields-invalid'))
    }
    function l(e, t) {
      e &&
        (e.className ? e.className.includes && !e.className.includes(t) && (e.className += ` ${t}`) : (e.className = t))
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
      Object.keys(e).forEach(i => {
        ;(J[i] = !1),
          h(e[i].selector, i, e[i], (e, o) => {
            let s = { type: 'applyStyles', data: n }
            t(e.contentWindow, s), u(e, o), g(i)
          })
      })
    }
    function u(e, t) {
      let n
      if (t.labelSelector) n = document.querySelectorAll(t.labelSelector)
      else {
        let i = t.selector.replace('#', '')
        n = document.querySelectorAll(`label[for="${i}"]`)
      }
      n.forEach &&
        n.forEach(t => {
          t.addEventListener('click', () => {
            e && e.contentWindow.focus()
          })
        })
    }
    function m(e) {
      let t = document.createElement('iframe')
      ;(t.class = 'pin-control-iframe'),
        (t.src = p()),
        (t.style.cssText = 'display: none;'),
        document.body.appendChild(t),
        t.addEventListener('load', () => {
          e(t)
        })
    }
    function p() {
      return `${I}/hosted_fields.html?instance_identifier=${W}`
    }
    function h(e, t, n, i) {
      let o = document.querySelector(e),
        s = y(t, n)
      o.appendChild(s),
        l(o, 'pin-form-field'),
        s.addEventListener('load', () => {
          let e = document.getElementById(_ + t)
          i(e, n)
        })
    }
    function y(e, t) {
      let n = document.createElement('iframe')
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
      let n = `${I}/field.html?field_name=${e}&instance_identifier=${W}`
      return t.placeholder && (n += `&placeholder=${w(t.placeholder)}`), M && (n += `&autocomplete=${M}`), n
    }
    function g(e) {
      J[e] = !0
      let t = !0
      Object.keys(J).forEach(e => {
        J[e] || (t = !1)
      }),
        t && b()
    }
    function b() {
      let e = { type: 'ready', timestamp: r() }
      O.trigger(e)
    }
    function w(e) {
      return e.replace(/[^\w\/\s@\$]/g, '')
    }
    function k(e) {
      q(e, 'options must be a hash'),
        E(e, 'fields', 'options.fields is required'),
        q(e.fields, 'options.fields must be a hash'),
        S(Object.keys(e.fields), 4, `options.fields must contain exactly 4 keys, ${A}`),
        A.forEach(t => {
          E(e.fields, t, `options.fields must contain key :: ${t}`),
            E(e.fields[t], 'selector', `options.fields.${t}.selector must be present`),
            N(e.fields[t].selector, 'string', `options.fields.${t}.selector must a string`)
          let n = document.querySelectorAll(e.fields[t].selector)
          S(n, 1, "Selector for field '" + t + "' matches " + n.length + ' elements, must match exactly 1 element'),
            e.fields[t].labelSelector &&
              N(e.fields[t].labelSelector, 'string', `options.fields.${t}.labelSelector must a string`)
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
      let i = { type: 'tokenize', params: e, sandbox: L, requestId: ++D }
      ;(B[`tokenize.${i.requestId}`] = [n]), t(C.contentWindow, i)
    }),
      (O.on = function(e, t) {
        B[e] || (B[e] = []), B[e].push(t)
      }),
      (O.trigger = function(e, t) {
        B[e.type] &&
          B[e.type].forEach(n => {
            n(e, t)
          })
      }),
      (function() {
        k(e),
          e.sandbox && (L = e.sandbox),
          e.autocomplete && (M = e.autocomplete),
          m(t => {
            ;(C = t), d(e.fields, e.styles)
          }),
          n(e => {
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

export default HostedFields
