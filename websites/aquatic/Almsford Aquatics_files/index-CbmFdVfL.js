var Sh = (r) => {
  throw TypeError(r)
}
var mu = (r, n, s) => n.has(r) || Sh("Cannot " + s)
var k = (r, n, s) => (
    mu(r, n, "read from private field"),
    s ? s.call(r) : n.get(r)
  ),
  ue = (r, n, s) =>
    n.has(r)
      ? Sh("Cannot add the same private member more than once")
      : n instanceof WeakSet
        ? n.add(r)
        : n.set(r, s),
  G = (r, n, s, o) => (
    mu(r, n, "write to private field"),
    o ? o.call(r, s) : n.set(r, s),
    s
  ),
  xe = (r, n, s) => (mu(r, n, "access private method"), s)
var qo = (r, n, s, o) => ({
  set _(a) {
    G(r, n, a, s)
  },
  get _() {
    return k(r, n, o)
  },
})
function xv(r, n) {
  for (var s = 0; s < n.length; s++) {
    const o = n[s]
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const a in o)
        if (a !== "default" && !(a in r)) {
          const c = Object.getOwnPropertyDescriptor(o, a)
          c &&
            Object.defineProperty(
              r,
              a,
              c.get ? c : { enumerable: !0, get: () => o[a] },
            )
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }),
  )
}
;(function () {
  const n = document.createElement("link").relList
  if (n && n.supports && n.supports("modulepreload")) return
  for (const a of document.querySelectorAll('link[rel="modulepreload"]')) o(a)
  new MutationObserver((a) => {
    for (const c of a)
      if (c.type === "childList")
        for (const f of c.addedNodes)
          f.tagName === "LINK" && f.rel === "modulepreload" && o(f)
  }).observe(document, { childList: !0, subtree: !0 })
  function s(a) {
    const c = {}
    return (
      a.integrity && (c.integrity = a.integrity),
      a.referrerPolicy && (c.referrerPolicy = a.referrerPolicy),
      a.crossOrigin === "use-credentials"
        ? (c.credentials = "include")
        : a.crossOrigin === "anonymous"
          ? (c.credentials = "omit")
          : (c.credentials = "same-origin"),
      c
    )
  }
  function o(a) {
    if (a.ep) return
    a.ep = !0
    const c = s(a)
    fetch(a.href, c)
  }
})()
function Gp(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default")
    ? r.default
    : r
}
var gu = { exports: {} },
  ai = {},
  yu = { exports: {} },
  we = {}
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var kh
function Sv() {
  if (kh) return we
  kh = 1
  var r = Symbol.for("react.element"),
    n = Symbol.for("react.portal"),
    s = Symbol.for("react.fragment"),
    o = Symbol.for("react.strict_mode"),
    a = Symbol.for("react.profiler"),
    c = Symbol.for("react.provider"),
    f = Symbol.for("react.context"),
    h = Symbol.for("react.forward_ref"),
    m = Symbol.for("react.suspense"),
    g = Symbol.for("react.memo"),
    y = Symbol.for("react.lazy"),
    S = Symbol.iterator
  function A(C) {
    return C === null || typeof C != "object"
      ? null
      : ((C = (S && C[S]) || C["@@iterator"]),
        typeof C == "function" ? C : null)
  }
  var L = {
      isMounted: function () {
        return !1
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    E = Object.assign,
    b = {}
  function w(C, D, pe) {
    ;((this.props = C),
      (this.context = D),
      (this.refs = b),
      (this.updater = pe || L))
  }
  ;((w.prototype.isReactComponent = {}),
    (w.prototype.setState = function (C, D) {
      if (typeof C != "object" && typeof C != "function" && C != null)
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
        )
      this.updater.enqueueSetState(this, C, D, "setState")
    }),
    (w.prototype.forceUpdate = function (C) {
      this.updater.enqueueForceUpdate(this, C, "forceUpdate")
    }))
  function F() {}
  F.prototype = w.prototype
  function Q(C, D, pe) {
    ;((this.props = C),
      (this.context = D),
      (this.refs = b),
      (this.updater = pe || L))
  }
  var B = (Q.prototype = new F())
  ;((B.constructor = Q), E(B, w.prototype), (B.isPureReactComponent = !0))
  var j = Array.isArray,
    K = Object.prototype.hasOwnProperty,
    ne = { current: null },
    se = { key: !0, ref: !0, __self: !0, __source: !0 }
  function z(C, D, pe) {
    var me,
      ae = {},
      de = null,
      Re = null
    if (D != null)
      for (me in (D.ref !== void 0 && (Re = D.ref),
      D.key !== void 0 && (de = "" + D.key),
      D))
        K.call(D, me) && !se.hasOwnProperty(me) && (ae[me] = D[me])
    var be = arguments.length - 2
    if (be === 1) ae.children = pe
    else if (1 < be) {
      for (var ge = Array(be), ot = 0; ot < be; ot++) ge[ot] = arguments[ot + 2]
      ae.children = ge
    }
    if (C && C.defaultProps)
      for (me in ((be = C.defaultProps), be))
        ae[me] === void 0 && (ae[me] = be[me])
    return {
      $$typeof: r,
      type: C,
      key: de,
      ref: Re,
      props: ae,
      _owner: ne.current,
    }
  }
  function ce(C, D) {
    return {
      $$typeof: r,
      type: C.type,
      key: D,
      ref: C.ref,
      props: C.props,
      _owner: C._owner,
    }
  }
  function le(C) {
    return typeof C == "object" && C !== null && C.$$typeof === r
  }
  function Oe(C) {
    var D = { "=": "=0", ":": "=2" }
    return (
      "$" +
      C.replace(/[=:]/g, function (pe) {
        return D[pe]
      })
    )
  }
  var je = /\/+/g
  function Ie(C, D) {
    return typeof C == "object" && C !== null && C.key != null
      ? Oe("" + C.key)
      : D.toString(36)
  }
  function Ne(C, D, pe, me, ae) {
    var de = typeof C
    ;(de === "undefined" || de === "boolean") && (C = null)
    var Re = !1
    if (C === null) Re = !0
    else
      switch (de) {
        case "string":
        case "number":
          Re = !0
          break
        case "object":
          switch (C.$$typeof) {
            case r:
            case n:
              Re = !0
          }
      }
    if (Re)
      return (
        (Re = C),
        (ae = ae(Re)),
        (C = me === "" ? "." + Ie(Re, 0) : me),
        j(ae)
          ? ((pe = ""),
            C != null && (pe = C.replace(je, "$&/") + "/"),
            Ne(ae, D, pe, "", function (ot) {
              return ot
            }))
          : ae != null &&
            (le(ae) &&
              (ae = ce(
                ae,
                pe +
                  (!ae.key || (Re && Re.key === ae.key)
                    ? ""
                    : ("" + ae.key).replace(je, "$&/") + "/") +
                  C,
              )),
            D.push(ae)),
        1
      )
    if (((Re = 0), (me = me === "" ? "." : me + ":"), j(C)))
      for (var be = 0; be < C.length; be++) {
        de = C[be]
        var ge = me + Ie(de, be)
        Re += Ne(de, D, pe, ge, ae)
      }
    else if (((ge = A(C)), typeof ge == "function"))
      for (C = ge.call(C), be = 0; !(de = C.next()).done; )
        ((de = de.value),
          (ge = me + Ie(de, be++)),
          (Re += Ne(de, D, pe, ge, ae)))
    else if (de === "object")
      throw (
        (D = String(C)),
        Error(
          "Objects are not valid as a React child (found: " +
            (D === "[object Object]"
              ? "object with keys {" + Object.keys(C).join(", ") + "}"
              : D) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      )
    return Re
  }
  function De(C, D, pe) {
    if (C == null) return C
    var me = [],
      ae = 0
    return (
      Ne(C, me, "", "", function (de) {
        return D.call(pe, de, ae++)
      }),
      me
    )
  }
  function ye(C) {
    if (C._status === -1) {
      var D = C._result
      ;((D = D()),
        D.then(
          function (pe) {
            ;(C._status === 0 || C._status === -1) &&
              ((C._status = 1), (C._result = pe))
          },
          function (pe) {
            ;(C._status === 0 || C._status === -1) &&
              ((C._status = 2), (C._result = pe))
          },
        ),
        C._status === -1 && ((C._status = 0), (C._result = D)))
    }
    if (C._status === 1) return C._result.default
    throw C._result
  }
  var Ee = { current: null },
    H = { transition: null },
    re = {
      ReactCurrentDispatcher: Ee,
      ReactCurrentBatchConfig: H,
      ReactCurrentOwner: ne,
    }
  function I() {
    throw Error("act(...) is not supported in production builds of React.")
  }
  return (
    (we.Children = {
      map: De,
      forEach: function (C, D, pe) {
        De(
          C,
          function () {
            D.apply(this, arguments)
          },
          pe,
        )
      },
      count: function (C) {
        var D = 0
        return (
          De(C, function () {
            D++
          }),
          D
        )
      },
      toArray: function (C) {
        return (
          De(C, function (D) {
            return D
          }) || []
        )
      },
      only: function (C) {
        if (!le(C))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          )
        return C
      },
    }),
    (we.Component = w),
    (we.Fragment = s),
    (we.Profiler = a),
    (we.PureComponent = Q),
    (we.StrictMode = o),
    (we.Suspense = m),
    (we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = re),
    (we.act = I),
    (we.cloneElement = function (C, D, pe) {
      if (C == null)
        throw Error(
          "React.cloneElement(...): The argument must be a React element, but you passed " +
            C +
            ".",
        )
      var me = E({}, C.props),
        ae = C.key,
        de = C.ref,
        Re = C._owner
      if (D != null) {
        if (
          (D.ref !== void 0 && ((de = D.ref), (Re = ne.current)),
          D.key !== void 0 && (ae = "" + D.key),
          C.type && C.type.defaultProps)
        )
          var be = C.type.defaultProps
        for (ge in D)
          K.call(D, ge) &&
            !se.hasOwnProperty(ge) &&
            (me[ge] = D[ge] === void 0 && be !== void 0 ? be[ge] : D[ge])
      }
      var ge = arguments.length - 2
      if (ge === 1) me.children = pe
      else if (1 < ge) {
        be = Array(ge)
        for (var ot = 0; ot < ge; ot++) be[ot] = arguments[ot + 2]
        me.children = be
      }
      return {
        $$typeof: r,
        type: C.type,
        key: ae,
        ref: de,
        props: me,
        _owner: Re,
      }
    }),
    (we.createContext = function (C) {
      return (
        (C = {
          $$typeof: f,
          _currentValue: C,
          _currentValue2: C,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (C.Provider = { $$typeof: c, _context: C }),
        (C.Consumer = C)
      )
    }),
    (we.createElement = z),
    (we.createFactory = function (C) {
      var D = z.bind(null, C)
      return ((D.type = C), D)
    }),
    (we.createRef = function () {
      return { current: null }
    }),
    (we.forwardRef = function (C) {
      return { $$typeof: h, render: C }
    }),
    (we.isValidElement = le),
    (we.lazy = function (C) {
      return { $$typeof: y, _payload: { _status: -1, _result: C }, _init: ye }
    }),
    (we.memo = function (C, D) {
      return { $$typeof: g, type: C, compare: D === void 0 ? null : D }
    }),
    (we.startTransition = function (C) {
      var D = H.transition
      H.transition = {}
      try {
        C()
      } finally {
        H.transition = D
      }
    }),
    (we.unstable_act = I),
    (we.useCallback = function (C, D) {
      return Ee.current.useCallback(C, D)
    }),
    (we.useContext = function (C) {
      return Ee.current.useContext(C)
    }),
    (we.useDebugValue = function () {}),
    (we.useDeferredValue = function (C) {
      return Ee.current.useDeferredValue(C)
    }),
    (we.useEffect = function (C, D) {
      return Ee.current.useEffect(C, D)
    }),
    (we.useId = function () {
      return Ee.current.useId()
    }),
    (we.useImperativeHandle = function (C, D, pe) {
      return Ee.current.useImperativeHandle(C, D, pe)
    }),
    (we.useInsertionEffect = function (C, D) {
      return Ee.current.useInsertionEffect(C, D)
    }),
    (we.useLayoutEffect = function (C, D) {
      return Ee.current.useLayoutEffect(C, D)
    }),
    (we.useMemo = function (C, D) {
      return Ee.current.useMemo(C, D)
    }),
    (we.useReducer = function (C, D, pe) {
      return Ee.current.useReducer(C, D, pe)
    }),
    (we.useRef = function (C) {
      return Ee.current.useRef(C)
    }),
    (we.useState = function (C) {
      return Ee.current.useState(C)
    }),
    (we.useSyncExternalStore = function (C, D, pe) {
      return Ee.current.useSyncExternalStore(C, D, pe)
    }),
    (we.useTransition = function () {
      return Ee.current.useTransition()
    }),
    (we.version = "18.3.1"),
    we
  )
}
var Eh
function ac() {
  return (Eh || ((Eh = 1), (yu.exports = Sv())), yu.exports)
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var _h
function kv() {
  if (_h) return ai
  _h = 1
  var r = ac(),
    n = Symbol.for("react.element"),
    s = Symbol.for("react.fragment"),
    o = Object.prototype.hasOwnProperty,
    a = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    c = { key: !0, ref: !0, __self: !0, __source: !0 }
  function f(h, m, g) {
    var y,
      S = {},
      A = null,
      L = null
    ;(g !== void 0 && (A = "" + g),
      m.key !== void 0 && (A = "" + m.key),
      m.ref !== void 0 && (L = m.ref))
    for (y in m) o.call(m, y) && !c.hasOwnProperty(y) && (S[y] = m[y])
    if (h && h.defaultProps)
      for (y in ((m = h.defaultProps), m)) S[y] === void 0 && (S[y] = m[y])
    return { $$typeof: n, type: h, key: A, ref: L, props: S, _owner: a.current }
  }
  return ((ai.Fragment = s), (ai.jsx = f), (ai.jsxs = f), ai)
}
var bh
function Ev() {
  return (bh || ((bh = 1), (gu.exports = kv())), gu.exports)
}
var R = Ev(),
  q = ac()
const _v = Gp(q),
  bv = xv({ __proto__: null, default: _v }, [q])
var Ho = {},
  vu = { exports: {} },
  St = {},
  wu = { exports: {} },
  xu = {}
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ch
function Cv() {
  return (
    Ch ||
      ((Ch = 1),
      (function (r) {
        function n(H, re) {
          var I = H.length
          H.push(re)
          e: for (; 0 < I; ) {
            var C = (I - 1) >>> 1,
              D = H[C]
            if (0 < a(D, re)) ((H[C] = re), (H[I] = D), (I = C))
            else break e
          }
        }
        function s(H) {
          return H.length === 0 ? null : H[0]
        }
        function o(H) {
          if (H.length === 0) return null
          var re = H[0],
            I = H.pop()
          if (I !== re) {
            H[0] = I
            e: for (var C = 0, D = H.length, pe = D >>> 1; C < pe; ) {
              var me = 2 * (C + 1) - 1,
                ae = H[me],
                de = me + 1,
                Re = H[de]
              if (0 > a(ae, I))
                de < D && 0 > a(Re, ae)
                  ? ((H[C] = Re), (H[de] = I), (C = de))
                  : ((H[C] = ae), (H[me] = I), (C = me))
              else if (de < D && 0 > a(Re, I))
                ((H[C] = Re), (H[de] = I), (C = de))
              else break e
            }
          }
          return re
        }
        function a(H, re) {
          var I = H.sortIndex - re.sortIndex
          return I !== 0 ? I : H.id - re.id
        }
        if (
          typeof performance == "object" &&
          typeof performance.now == "function"
        ) {
          var c = performance
          r.unstable_now = function () {
            return c.now()
          }
        } else {
          var f = Date,
            h = f.now()
          r.unstable_now = function () {
            return f.now() - h
          }
        }
        var m = [],
          g = [],
          y = 1,
          S = null,
          A = 3,
          L = !1,
          E = !1,
          b = !1,
          w = typeof setTimeout == "function" ? setTimeout : null,
          F = typeof clearTimeout == "function" ? clearTimeout : null,
          Q = typeof setImmediate < "u" ? setImmediate : null
        typeof navigator < "u" &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling)
        function B(H) {
          for (var re = s(g); re !== null; ) {
            if (re.callback === null) o(g)
            else if (re.startTime <= H)
              (o(g), (re.sortIndex = re.expirationTime), n(m, re))
            else break
            re = s(g)
          }
        }
        function j(H) {
          if (((b = !1), B(H), !E))
            if (s(m) !== null) ((E = !0), ye(K))
            else {
              var re = s(g)
              re !== null && Ee(j, re.startTime - H)
            }
        }
        function K(H, re) {
          ;((E = !1), b && ((b = !1), F(z), (z = -1)), (L = !0))
          var I = A
          try {
            for (
              B(re), S = s(m);
              S !== null && (!(S.expirationTime > re) || (H && !Oe()));
            ) {
              var C = S.callback
              if (typeof C == "function") {
                ;((S.callback = null), (A = S.priorityLevel))
                var D = C(S.expirationTime <= re)
                ;((re = r.unstable_now()),
                  typeof D == "function"
                    ? (S.callback = D)
                    : S === s(m) && o(m),
                  B(re))
              } else o(m)
              S = s(m)
            }
            if (S !== null) var pe = !0
            else {
              var me = s(g)
              ;(me !== null && Ee(j, me.startTime - re), (pe = !1))
            }
            return pe
          } finally {
            ;((S = null), (A = I), (L = !1))
          }
        }
        var ne = !1,
          se = null,
          z = -1,
          ce = 5,
          le = -1
        function Oe() {
          return !(r.unstable_now() - le < ce)
        }
        function je() {
          if (se !== null) {
            var H = r.unstable_now()
            le = H
            var re = !0
            try {
              re = se(!0, H)
            } finally {
              re ? Ie() : ((ne = !1), (se = null))
            }
          } else ne = !1
        }
        var Ie
        if (typeof Q == "function")
          Ie = function () {
            Q(je)
          }
        else if (typeof MessageChannel < "u") {
          var Ne = new MessageChannel(),
            De = Ne.port2
          ;((Ne.port1.onmessage = je),
            (Ie = function () {
              De.postMessage(null)
            }))
        } else
          Ie = function () {
            w(je, 0)
          }
        function ye(H) {
          ;((se = H), ne || ((ne = !0), Ie()))
        }
        function Ee(H, re) {
          z = w(function () {
            H(r.unstable_now())
          }, re)
        }
        ;((r.unstable_IdlePriority = 5),
          (r.unstable_ImmediatePriority = 1),
          (r.unstable_LowPriority = 4),
          (r.unstable_NormalPriority = 3),
          (r.unstable_Profiling = null),
          (r.unstable_UserBlockingPriority = 2),
          (r.unstable_cancelCallback = function (H) {
            H.callback = null
          }),
          (r.unstable_continueExecution = function () {
            E || L || ((E = !0), ye(K))
          }),
          (r.unstable_forceFrameRate = function (H) {
            0 > H || 125 < H
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (ce = 0 < H ? Math.floor(1e3 / H) : 5)
          }),
          (r.unstable_getCurrentPriorityLevel = function () {
            return A
          }),
          (r.unstable_getFirstCallbackNode = function () {
            return s(m)
          }),
          (r.unstable_next = function (H) {
            switch (A) {
              case 1:
              case 2:
              case 3:
                var re = 3
                break
              default:
                re = A
            }
            var I = A
            A = re
            try {
              return H()
            } finally {
              A = I
            }
          }),
          (r.unstable_pauseExecution = function () {}),
          (r.unstable_requestPaint = function () {}),
          (r.unstable_runWithPriority = function (H, re) {
            switch (H) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break
              default:
                H = 3
            }
            var I = A
            A = H
            try {
              return re()
            } finally {
              A = I
            }
          }),
          (r.unstable_scheduleCallback = function (H, re, I) {
            var C = r.unstable_now()
            switch (
              (typeof I == "object" && I !== null
                ? ((I = I.delay),
                  (I = typeof I == "number" && 0 < I ? C + I : C))
                : (I = C),
              H)
            ) {
              case 1:
                var D = -1
                break
              case 2:
                D = 250
                break
              case 5:
                D = 1073741823
                break
              case 4:
                D = 1e4
                break
              default:
                D = 5e3
            }
            return (
              (D = I + D),
              (H = {
                id: y++,
                callback: re,
                priorityLevel: H,
                startTime: I,
                expirationTime: D,
                sortIndex: -1,
              }),
              I > C
                ? ((H.sortIndex = I),
                  n(g, H),
                  s(m) === null &&
                    H === s(g) &&
                    (b ? (F(z), (z = -1)) : (b = !0), Ee(j, I - C)))
                : ((H.sortIndex = D), n(m, H), E || L || ((E = !0), ye(K))),
              H
            )
          }),
          (r.unstable_shouldYield = Oe),
          (r.unstable_wrapCallback = function (H) {
            var re = A
            return function () {
              var I = A
              A = re
              try {
                return H.apply(this, arguments)
              } finally {
                A = I
              }
            }
          }))
      })(xu)),
    xu
  )
}
var Rh
function Rv() {
  return (Rh || ((Rh = 1), (wu.exports = Cv())), wu.exports)
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Th
function Tv() {
  if (Th) return St
  Th = 1
  var r = ac(),
    n = Rv()
  function s(e) {
    for (
      var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
        i = 1;
      i < arguments.length;
      i++
    )
      t += "&args[]=" + encodeURIComponent(arguments[i])
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    )
  }
  var o = new Set(),
    a = {}
  function c(e, t) {
    ;(f(e, t), f(e + "Capture", t))
  }
  function f(e, t) {
    for (a[e] = t, e = 0; e < t.length; e++) o.add(t[e])
  }
  var h = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    m = Object.prototype.hasOwnProperty,
    g =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    y = {},
    S = {}
  function A(e) {
    return m.call(S, e)
      ? !0
      : m.call(y, e)
        ? !1
        : g.test(e)
          ? (S[e] = !0)
          : ((y[e] = !0), !1)
  }
  function L(e, t, i, l) {
    if (i !== null && i.type === 0) return !1
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0
      case "boolean":
        return l
          ? !1
          : i !== null
            ? !i.acceptsBooleans
            : ((e = e.toLowerCase().slice(0, 5)),
              e !== "data-" && e !== "aria-")
      default:
        return !1
    }
  }
  function E(e, t, i, l) {
    if (t === null || typeof t > "u" || L(e, t, i, l)) return !0
    if (l) return !1
    if (i !== null)
      switch (i.type) {
        case 3:
          return !t
        case 4:
          return t === !1
        case 5:
          return isNaN(t)
        case 6:
          return isNaN(t) || 1 > t
      }
    return !1
  }
  function b(e, t, i, l, u, d, p) {
    ;((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
      (this.attributeName = l),
      (this.attributeNamespace = u),
      (this.mustUseProperty = i),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = d),
      (this.removeEmptyString = p))
  }
  var w = {}
  ;("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (e) {
      w[e] = new b(e, 0, !1, e, null, !1, !1)
    }),
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (e) {
      var t = e[0]
      w[t] = new b(t, 1, !1, e[1], null, !1, !1)
    }),
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(
      function (e) {
        w[e] = new b(e, 2, !1, e.toLowerCase(), null, !1, !1)
      },
    ),
    [
      "autoReverse",
      "externalResourcesRequired",
      "focusable",
      "preserveAlpha",
    ].forEach(function (e) {
      w[e] = new b(e, 2, !1, e, null, !1, !1)
    }),
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
      .split(" ")
      .forEach(function (e) {
        w[e] = new b(e, 3, !1, e.toLowerCase(), null, !1, !1)
      }),
    ["checked", "multiple", "muted", "selected"].forEach(function (e) {
      w[e] = new b(e, 3, !0, e, null, !1, !1)
    }),
    ["capture", "download"].forEach(function (e) {
      w[e] = new b(e, 4, !1, e, null, !1, !1)
    }),
    ["cols", "rows", "size", "span"].forEach(function (e) {
      w[e] = new b(e, 6, !1, e, null, !1, !1)
    }),
    ["rowSpan", "start"].forEach(function (e) {
      w[e] = new b(e, 5, !1, e.toLowerCase(), null, !1, !1)
    }))
  var F = /[\-:]([a-z])/g
  function Q(e) {
    return e[1].toUpperCase()
  }
  ;("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (e) {
      var t = e.replace(F, Q)
      w[t] = new b(t, 1, !1, e, null, !1, !1)
    }),
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
      .split(" ")
      .forEach(function (e) {
        var t = e.replace(F, Q)
        w[t] = new b(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1)
      }),
    ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
      var t = e.replace(F, Q)
      w[t] = new b(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1)
    }),
    ["tabIndex", "crossOrigin"].forEach(function (e) {
      w[e] = new b(e, 1, !1, e.toLowerCase(), null, !1, !1)
    }),
    (w.xlinkHref = new b(
      "xlinkHref",
      1,
      !1,
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      !1,
    )),
    ["src", "href", "action", "formAction"].forEach(function (e) {
      w[e] = new b(e, 1, !1, e.toLowerCase(), null, !0, !0)
    }))
  function B(e, t, i, l) {
    var u = w.hasOwnProperty(t) ? w[t] : null
    ;(u !== null
      ? u.type !== 0
      : l ||
        !(2 < t.length) ||
        (t[0] !== "o" && t[0] !== "O") ||
        (t[1] !== "n" && t[1] !== "N")) &&
      (E(t, i, u, l) && (i = null),
      l || u === null
        ? A(t) &&
          (i === null ? e.removeAttribute(t) : e.setAttribute(t, "" + i))
        : u.mustUseProperty
          ? (e[u.propertyName] = i === null ? (u.type === 3 ? !1 : "") : i)
          : ((t = u.attributeName),
            (l = u.attributeNamespace),
            i === null
              ? e.removeAttribute(t)
              : ((u = u.type),
                (i = u === 3 || (u === 4 && i === !0) ? "" : "" + i),
                l ? e.setAttributeNS(l, t, i) : e.setAttribute(t, i))))
  }
  var j = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    K = Symbol.for("react.element"),
    ne = Symbol.for("react.portal"),
    se = Symbol.for("react.fragment"),
    z = Symbol.for("react.strict_mode"),
    ce = Symbol.for("react.profiler"),
    le = Symbol.for("react.provider"),
    Oe = Symbol.for("react.context"),
    je = Symbol.for("react.forward_ref"),
    Ie = Symbol.for("react.suspense"),
    Ne = Symbol.for("react.suspense_list"),
    De = Symbol.for("react.memo"),
    ye = Symbol.for("react.lazy"),
    Ee = Symbol.for("react.offscreen"),
    H = Symbol.iterator
  function re(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (H && e[H]) || e["@@iterator"]),
        typeof e == "function" ? e : null)
  }
  var I = Object.assign,
    C
  function D(e) {
    if (C === void 0)
      try {
        throw Error()
      } catch (i) {
        var t = i.stack.trim().match(/\n( *(at )?)/)
        C = (t && t[1]) || ""
      }
    return (
      `
` +
      C +
      e
    )
  }
  var pe = !1
  function me(e, t) {
    if (!e || pe) return ""
    pe = !0
    var i = Error.prepareStackTrace
    Error.prepareStackTrace = void 0
    try {
      if (t)
        if (
          ((t = function () {
            throw Error()
          }),
          Object.defineProperty(t.prototype, "props", {
            set: function () {
              throw Error()
            },
          }),
          typeof Reflect == "object" && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, [])
          } catch (N) {
            var l = N
          }
          Reflect.construct(e, [], t)
        } else {
          try {
            t.call()
          } catch (N) {
            l = N
          }
          e.call(t.prototype)
        }
      else {
        try {
          throw Error()
        } catch (N) {
          l = N
        }
        e()
      }
    } catch (N) {
      if (N && l && typeof N.stack == "string") {
        for (
          var u = N.stack.split(`
`),
            d = l.stack.split(`
`),
            p = u.length - 1,
            v = d.length - 1;
          1 <= p && 0 <= v && u[p] !== d[v];
        )
          v--
        for (; 1 <= p && 0 <= v; p--, v--)
          if (u[p] !== d[v]) {
            if (p !== 1 || v !== 1)
              do
                if ((p--, v--, 0 > v || u[p] !== d[v])) {
                  var x =
                    `
` + u[p].replace(" at new ", " at ")
                  return (
                    e.displayName &&
                      x.includes("<anonymous>") &&
                      (x = x.replace("<anonymous>", e.displayName)),
                    x
                  )
                }
              while (1 <= p && 0 <= v)
            break
          }
      }
    } finally {
      ;((pe = !1), (Error.prepareStackTrace = i))
    }
    return (e = e ? e.displayName || e.name : "") ? D(e) : ""
  }
  function ae(e) {
    switch (e.tag) {
      case 5:
        return D(e.type)
      case 16:
        return D("Lazy")
      case 13:
        return D("Suspense")
      case 19:
        return D("SuspenseList")
      case 0:
      case 2:
      case 15:
        return ((e = me(e.type, !1)), e)
      case 11:
        return ((e = me(e.type.render, !1)), e)
      case 1:
        return ((e = me(e.type, !0)), e)
      default:
        return ""
    }
  }
  function de(e) {
    if (e == null) return null
    if (typeof e == "function") return e.displayName || e.name || null
    if (typeof e == "string") return e
    switch (e) {
      case se:
        return "Fragment"
      case ne:
        return "Portal"
      case ce:
        return "Profiler"
      case z:
        return "StrictMode"
      case Ie:
        return "Suspense"
      case Ne:
        return "SuspenseList"
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Oe:
          return (e.displayName || "Context") + ".Consumer"
        case le:
          return (e._context.displayName || "Context") + ".Provider"
        case je:
          var t = e.render
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          )
        case De:
          return (
            (t = e.displayName || null),
            t !== null ? t : de(e.type) || "Memo"
          )
        case ye:
          ;((t = e._payload), (e = e._init))
          try {
            return de(e(t))
          } catch {}
      }
    return null
  }
  function Re(e) {
    var t = e.type
    switch (e.tag) {
      case 24:
        return "Cache"
      case 9:
        return (t.displayName || "Context") + ".Consumer"
      case 10:
        return (t._context.displayName || "Context") + ".Provider"
      case 18:
        return "DehydratedFragment"
      case 11:
        return (
          (e = t.render),
          (e = e.displayName || e.name || ""),
          t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
        )
      case 7:
        return "Fragment"
      case 5:
        return t
      case 4:
        return "Portal"
      case 3:
        return "Root"
      case 6:
        return "Text"
      case 16:
        return de(t)
      case 8:
        return t === z ? "StrictMode" : "Mode"
      case 22:
        return "Offscreen"
      case 12:
        return "Profiler"
      case 21:
        return "Scope"
      case 13:
        return "Suspense"
      case 19:
        return "SuspenseList"
      case 25:
        return "TracingMarker"
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null
        if (typeof t == "string") return t
    }
    return null
  }
  function be(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e
      case "object":
        return e
      default:
        return ""
    }
  }
  function ge(e) {
    var t = e.type
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    )
  }
  function ot(e) {
    var t = ge(e) ? "checked" : "value",
      i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
      l = "" + e[t]
    if (
      !e.hasOwnProperty(t) &&
      typeof i < "u" &&
      typeof i.get == "function" &&
      typeof i.set == "function"
    ) {
      var u = i.get,
        d = i.set
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return u.call(this)
          },
          set: function (p) {
            ;((l = "" + p), d.call(this, p))
          },
        }),
        Object.defineProperty(e, t, { enumerable: i.enumerable }),
        {
          getValue: function () {
            return l
          },
          setValue: function (p) {
            l = "" + p
          },
          stopTracking: function () {
            ;((e._valueTracker = null), delete e[t])
          },
        }
      )
    }
  }
  function un(e) {
    e._valueTracker || (e._valueTracker = ot(e))
  }
  function ir(e) {
    if (!e) return !1
    var t = e._valueTracker
    if (!t) return !0
    var i = t.getValue(),
      l = ""
    return (
      e && (l = ge(e) ? (e.checked ? "true" : "false") : e.value),
      (e = l),
      e !== i ? (t.setValue(e), !0) : !1
    )
  }
  function En(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null
    try {
      return e.activeElement || e.body
    } catch {
      return e.body
    }
  }
  function _n(e, t) {
    var i = t.checked
    return I({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: i ?? e._wrapperState.initialChecked,
    })
  }
  function Rc(e, t) {
    var i = t.defaultValue == null ? "" : t.defaultValue,
      l = t.checked != null ? t.checked : t.defaultChecked
    ;((i = be(t.value != null ? t.value : i)),
      (e._wrapperState = {
        initialChecked: l,
        initialValue: i,
        controlled:
          t.type === "checkbox" || t.type === "radio"
            ? t.checked != null
            : t.value != null,
      }))
  }
  function Tc(e, t) {
    ;((t = t.checked), t != null && B(e, "checked", t, !1))
  }
  function El(e, t) {
    Tc(e, t)
    var i = be(t.value),
      l = t.type
    if (i != null)
      l === "number"
        ? ((i === 0 && e.value === "") || e.value != i) && (e.value = "" + i)
        : e.value !== "" + i && (e.value = "" + i)
    else if (l === "submit" || l === "reset") {
      e.removeAttribute("value")
      return
    }
    ;(t.hasOwnProperty("value")
      ? _l(e, t.type, i)
      : t.hasOwnProperty("defaultValue") && _l(e, t.type, be(t.defaultValue)),
      t.checked == null &&
        t.defaultChecked != null &&
        (e.defaultChecked = !!t.defaultChecked))
  }
  function Pc(e, t, i) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var l = t.type
      if (
        !(
          (l !== "submit" && l !== "reset") ||
          (t.value !== void 0 && t.value !== null)
        )
      )
        return
      ;((t = "" + e._wrapperState.initialValue),
        i || t === e.value || (e.value = t),
        (e.defaultValue = t))
    }
    ;((i = e.name),
      i !== "" && (e.name = ""),
      (e.defaultChecked = !!e._wrapperState.initialChecked),
      i !== "" && (e.name = i))
  }
  function _l(e, t, i) {
    ;(t !== "number" || En(e.ownerDocument) !== e) &&
      (i == null
        ? (e.defaultValue = "" + e._wrapperState.initialValue)
        : e.defaultValue !== "" + i && (e.defaultValue = "" + i))
  }
  var Es = Array.isArray
  function Ir(e, t, i, l) {
    if (((e = e.options), t)) {
      t = {}
      for (var u = 0; u < i.length; u++) t["$" + i[u]] = !0
      for (i = 0; i < e.length; i++)
        ((u = t.hasOwnProperty("$" + e[i].value)),
          e[i].selected !== u && (e[i].selected = u),
          u && l && (e[i].defaultSelected = !0))
    } else {
      for (i = "" + be(i), t = null, u = 0; u < e.length; u++) {
        if (e[u].value === i) {
          ;((e[u].selected = !0), l && (e[u].defaultSelected = !0))
          return
        }
        t !== null || e[u].disabled || (t = e[u])
      }
      t !== null && (t.selected = !0)
    }
  }
  function bl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91))
    return I({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: "" + e._wrapperState.initialValue,
    })
  }
  function Nc(e, t) {
    var i = t.value
    if (i == null) {
      if (((i = t.children), (t = t.defaultValue), i != null)) {
        if (t != null) throw Error(s(92))
        if (Es(i)) {
          if (1 < i.length) throw Error(s(93))
          i = i[0]
        }
        t = i
      }
      ;(t == null && (t = ""), (i = t))
    }
    e._wrapperState = { initialValue: be(i) }
  }
  function Oc(e, t) {
    var i = be(t.value),
      l = be(t.defaultValue)
    ;(i != null &&
      ((i = "" + i),
      i !== e.value && (e.value = i),
      t.defaultValue == null && e.defaultValue !== i && (e.defaultValue = i)),
      l != null && (e.defaultValue = "" + l))
  }
  function Ac(e) {
    var t = e.textContent
    t === e._wrapperState.initialValue &&
      t !== "" &&
      t !== null &&
      (e.value = t)
  }
  function Lc(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg"
      case "math":
        return "http://www.w3.org/1998/Math/MathML"
      default:
        return "http://www.w3.org/1999/xhtml"
    }
  }
  function Cl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml"
      ? Lc(t)
      : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : e
  }
  var Ii,
    jc = (function (e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
        ? function (t, i, l, u) {
            MSApp.execUnsafeLocalFunction(function () {
              return e(t, i, l, u)
            })
          }
        : e
    })(function (e, t) {
      if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
        e.innerHTML = t
      else {
        for (
          Ii = Ii || document.createElement("div"),
            Ii.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
            t = Ii.firstChild;
          e.firstChild;
        )
          e.removeChild(e.firstChild)
        for (; t.firstChild; ) e.appendChild(t.firstChild)
      }
    })
  function _s(e, t) {
    if (t) {
      var i = e.firstChild
      if (i && i === e.lastChild && i.nodeType === 3) {
        i.nodeValue = t
        return
      }
    }
    e.textContent = t
  }
  var bs = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    _g = ["Webkit", "ms", "Moz", "O"]
  Object.keys(bs).forEach(function (e) {
    _g.forEach(function (t) {
      ;((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (bs[t] = bs[e]))
    })
  })
  function Ic(e, t, i) {
    return t == null || typeof t == "boolean" || t === ""
      ? ""
      : i || typeof t != "number" || t === 0 || (bs.hasOwnProperty(e) && bs[e])
        ? ("" + t).trim()
        : t + "px"
  }
  function Dc(e, t) {
    e = e.style
    for (var i in t)
      if (t.hasOwnProperty(i)) {
        var l = i.indexOf("--") === 0,
          u = Ic(i, t[i], l)
        ;(i === "float" && (i = "cssFloat"),
          l ? e.setProperty(i, u) : (e[i] = u))
      }
  }
  var bg = I(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    },
  )
  function Rl(e, t) {
    if (t) {
      if (bg[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
        throw Error(s(137, e))
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60))
        if (
          typeof t.dangerouslySetInnerHTML != "object" ||
          !("__html" in t.dangerouslySetInnerHTML)
        )
          throw Error(s(61))
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62))
    }
  }
  function Tl(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string"
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1
      default:
        return !0
    }
  }
  var Pl = null
  function Nl(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    )
  }
  var Ol = null,
    Dr = null,
    Fr = null
  function Fc(e) {
    if ((e = Ws(e))) {
      if (typeof Ol != "function") throw Error(s(280))
      var t = e.stateNode
      t && ((t = so(t)), Ol(e.stateNode, e.type, t))
    }
  }
  function Uc(e) {
    Dr ? (Fr ? Fr.push(e) : (Fr = [e])) : (Dr = e)
  }
  function Mc() {
    if (Dr) {
      var e = Dr,
        t = Fr
      if (((Fr = Dr = null), Fc(e), t)) for (e = 0; e < t.length; e++) Fc(t[e])
    }
  }
  function zc(e, t) {
    return e(t)
  }
  function Bc() {}
  var Al = !1
  function $c(e, t, i) {
    if (Al) return e(t, i)
    Al = !0
    try {
      return zc(e, t, i)
    } finally {
      ;((Al = !1), (Dr !== null || Fr !== null) && (Bc(), Mc()))
    }
  }
  function Cs(e, t) {
    var i = e.stateNode
    if (i === null) return null
    var l = so(i)
    if (l === null) return null
    i = l[t]
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ;((l = !l.disabled) ||
          ((e = e.type),
          (l = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !l))
        break e
      default:
        e = !1
    }
    if (e) return null
    if (i && typeof i != "function") throw Error(s(231, t, typeof i))
    return i
  }
  var Ll = !1
  if (h)
    try {
      var Rs = {}
      ;(Object.defineProperty(Rs, "passive", {
        get: function () {
          Ll = !0
        },
      }),
        window.addEventListener("test", Rs, Rs),
        window.removeEventListener("test", Rs, Rs))
    } catch {
      Ll = !1
    }
  function Cg(e, t, i, l, u, d, p, v, x) {
    var N = Array.prototype.slice.call(arguments, 3)
    try {
      t.apply(i, N)
    } catch (M) {
      this.onError(M)
    }
  }
  var Ts = !1,
    Di = null,
    Fi = !1,
    jl = null,
    Rg = {
      onError: function (e) {
        ;((Ts = !0), (Di = e))
      },
    }
  function Tg(e, t, i, l, u, d, p, v, x) {
    ;((Ts = !1), (Di = null), Cg.apply(Rg, arguments))
  }
  function Pg(e, t, i, l, u, d, p, v, x) {
    if ((Tg.apply(this, arguments), Ts)) {
      if (Ts) {
        var N = Di
        ;((Ts = !1), (Di = null))
      } else throw Error(s(198))
      Fi || ((Fi = !0), (jl = N))
    }
  }
  function or(e) {
    var t = e,
      i = e
    if (e.alternate) for (; t.return; ) t = t.return
    else {
      e = t
      do ((t = e), (t.flags & 4098) !== 0 && (i = t.return), (e = t.return))
      while (e)
    }
    return t.tag === 3 ? i : null
  }
  function Vc(e) {
    if (e.tag === 13) {
      var t = e.memoizedState
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated
    }
    return null
  }
  function qc(e) {
    if (or(e) !== e) throw Error(s(188))
  }
  function Ng(e) {
    var t = e.alternate
    if (!t) {
      if (((t = or(e)), t === null)) throw Error(s(188))
      return t !== e ? null : e
    }
    for (var i = e, l = t; ; ) {
      var u = i.return
      if (u === null) break
      var d = u.alternate
      if (d === null) {
        if (((l = u.return), l !== null)) {
          i = l
          continue
        }
        break
      }
      if (u.child === d.child) {
        for (d = u.child; d; ) {
          if (d === i) return (qc(u), e)
          if (d === l) return (qc(u), t)
          d = d.sibling
        }
        throw Error(s(188))
      }
      if (i.return !== l.return) ((i = u), (l = d))
      else {
        for (var p = !1, v = u.child; v; ) {
          if (v === i) {
            ;((p = !0), (i = u), (l = d))
            break
          }
          if (v === l) {
            ;((p = !0), (l = u), (i = d))
            break
          }
          v = v.sibling
        }
        if (!p) {
          for (v = d.child; v; ) {
            if (v === i) {
              ;((p = !0), (i = d), (l = u))
              break
            }
            if (v === l) {
              ;((p = !0), (l = d), (i = u))
              break
            }
            v = v.sibling
          }
          if (!p) throw Error(s(189))
        }
      }
      if (i.alternate !== l) throw Error(s(190))
    }
    if (i.tag !== 3) throw Error(s(188))
    return i.stateNode.current === i ? e : t
  }
  function Hc(e) {
    return ((e = Ng(e)), e !== null ? Qc(e) : null)
  }
  function Qc(e) {
    if (e.tag === 5 || e.tag === 6) return e
    for (e = e.child; e !== null; ) {
      var t = Qc(e)
      if (t !== null) return t
      e = e.sibling
    }
    return null
  }
  var Wc = n.unstable_scheduleCallback,
    Kc = n.unstable_cancelCallback,
    Og = n.unstable_shouldYield,
    Ag = n.unstable_requestPaint,
    qe = n.unstable_now,
    Lg = n.unstable_getCurrentPriorityLevel,
    Il = n.unstable_ImmediatePriority,
    Gc = n.unstable_UserBlockingPriority,
    Ui = n.unstable_NormalPriority,
    jg = n.unstable_LowPriority,
    Yc = n.unstable_IdlePriority,
    Mi = null,
    Xt = null
  function Ig(e) {
    if (Xt && typeof Xt.onCommitFiberRoot == "function")
      try {
        Xt.onCommitFiberRoot(Mi, e, void 0, (e.current.flags & 128) === 128)
      } catch {}
  }
  var Bt = Math.clz32 ? Math.clz32 : Ug,
    Dg = Math.log,
    Fg = Math.LN2
  function Ug(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((Dg(e) / Fg) | 0)) | 0)
  }
  var zi = 64,
    Bi = 4194304
  function Ps(e) {
    switch (e & -e) {
      case 1:
        return 1
      case 2:
        return 2
      case 4:
        return 4
      case 8:
        return 8
      case 16:
        return 16
      case 32:
        return 32
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424
      case 134217728:
        return 134217728
      case 268435456:
        return 268435456
      case 536870912:
        return 536870912
      case 1073741824:
        return 1073741824
      default:
        return e
    }
  }
  function $i(e, t) {
    var i = e.pendingLanes
    if (i === 0) return 0
    var l = 0,
      u = e.suspendedLanes,
      d = e.pingedLanes,
      p = i & 268435455
    if (p !== 0) {
      var v = p & ~u
      v !== 0 ? (l = Ps(v)) : ((d &= p), d !== 0 && (l = Ps(d)))
    } else ((p = i & ~u), p !== 0 ? (l = Ps(p)) : d !== 0 && (l = Ps(d)))
    if (l === 0) return 0
    if (
      t !== 0 &&
      t !== l &&
      (t & u) === 0 &&
      ((u = l & -l), (d = t & -t), u >= d || (u === 16 && (d & 4194240) !== 0))
    )
      return t
    if (((l & 4) !== 0 && (l |= i & 16), (t = e.entangledLanes), t !== 0))
      for (e = e.entanglements, t &= l; 0 < t; )
        ((i = 31 - Bt(t)), (u = 1 << i), (l |= e[i]), (t &= ~u))
    return l
  }
  function Mg(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1
      default:
        return -1
    }
  }
  function zg(e, t) {
    for (
      var i = e.suspendedLanes,
        l = e.pingedLanes,
        u = e.expirationTimes,
        d = e.pendingLanes;
      0 < d;
    ) {
      var p = 31 - Bt(d),
        v = 1 << p,
        x = u[p]
      ;(x === -1
        ? ((v & i) === 0 || (v & l) !== 0) && (u[p] = Mg(v, t))
        : x <= t && (e.expiredLanes |= v),
        (d &= ~v))
    }
  }
  function Dl(e) {
    return (
      (e = e.pendingLanes & -1073741825),
      e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
    )
  }
  function Jc() {
    var e = zi
    return ((zi <<= 1), (zi & 4194240) === 0 && (zi = 64), e)
  }
  function Fl(e) {
    for (var t = [], i = 0; 31 > i; i++) t.push(e)
    return t
  }
  function Ns(e, t, i) {
    ;((e.pendingLanes |= t),
      t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
      (e = e.eventTimes),
      (t = 31 - Bt(t)),
      (e[t] = i))
  }
  function Bg(e, t) {
    var i = e.pendingLanes & ~t
    ;((e.pendingLanes = t),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.expiredLanes &= t),
      (e.mutableReadLanes &= t),
      (e.entangledLanes &= t),
      (t = e.entanglements))
    var l = e.eventTimes
    for (e = e.expirationTimes; 0 < i; ) {
      var u = 31 - Bt(i),
        d = 1 << u
      ;((t[u] = 0), (l[u] = -1), (e[u] = -1), (i &= ~d))
    }
  }
  function Ul(e, t) {
    var i = (e.entangledLanes |= t)
    for (e = e.entanglements; i; ) {
      var l = 31 - Bt(i),
        u = 1 << l
      ;((u & t) | (e[l] & t) && (e[l] |= t), (i &= ~u))
    }
  }
  var Pe = 0
  function Xc(e) {
    return (
      (e &= -e),
      1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
    )
  }
  var Zc,
    Ml,
    ed,
    td,
    nd,
    zl = !1,
    Vi = [],
    bn = null,
    Cn = null,
    Rn = null,
    Os = new Map(),
    As = new Map(),
    Tn = [],
    $g =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
        " ",
      )
  function rd(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        bn = null
        break
      case "dragenter":
      case "dragleave":
        Cn = null
        break
      case "mouseover":
      case "mouseout":
        Rn = null
        break
      case "pointerover":
      case "pointerout":
        Os.delete(t.pointerId)
        break
      case "gotpointercapture":
      case "lostpointercapture":
        As.delete(t.pointerId)
    }
  }
  function Ls(e, t, i, l, u, d) {
    return e === null || e.nativeEvent !== d
      ? ((e = {
          blockedOn: t,
          domEventName: i,
          eventSystemFlags: l,
          nativeEvent: d,
          targetContainers: [u],
        }),
        t !== null && ((t = Ws(t)), t !== null && Ml(t)),
        e)
      : ((e.eventSystemFlags |= l),
        (t = e.targetContainers),
        u !== null && t.indexOf(u) === -1 && t.push(u),
        e)
  }
  function Vg(e, t, i, l, u) {
    switch (t) {
      case "focusin":
        return ((bn = Ls(bn, e, t, i, l, u)), !0)
      case "dragenter":
        return ((Cn = Ls(Cn, e, t, i, l, u)), !0)
      case "mouseover":
        return ((Rn = Ls(Rn, e, t, i, l, u)), !0)
      case "pointerover":
        var d = u.pointerId
        return (Os.set(d, Ls(Os.get(d) || null, e, t, i, l, u)), !0)
      case "gotpointercapture":
        return (
          (d = u.pointerId),
          As.set(d, Ls(As.get(d) || null, e, t, i, l, u)),
          !0
        )
    }
    return !1
  }
  function sd(e) {
    var t = lr(e.target)
    if (t !== null) {
      var i = or(t)
      if (i !== null) {
        if (((t = i.tag), t === 13)) {
          if (((t = Vc(i)), t !== null)) {
            ;((e.blockedOn = t),
              nd(e.priority, function () {
                ed(i)
              }))
            return
          }
        } else if (t === 3 && i.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = i.tag === 3 ? i.stateNode.containerInfo : null
          return
        }
      }
    }
    e.blockedOn = null
  }
  function qi(e) {
    if (e.blockedOn !== null) return !1
    for (var t = e.targetContainers; 0 < t.length; ) {
      var i = $l(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent)
      if (i === null) {
        i = e.nativeEvent
        var l = new i.constructor(i.type, i)
        ;((Pl = l), i.target.dispatchEvent(l), (Pl = null))
      } else return ((t = Ws(i)), t !== null && Ml(t), (e.blockedOn = i), !1)
      t.shift()
    }
    return !0
  }
  function id(e, t, i) {
    qi(e) && i.delete(t)
  }
  function qg() {
    ;((zl = !1),
      bn !== null && qi(bn) && (bn = null),
      Cn !== null && qi(Cn) && (Cn = null),
      Rn !== null && qi(Rn) && (Rn = null),
      Os.forEach(id),
      As.forEach(id))
  }
  function js(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      zl ||
        ((zl = !0), n.unstable_scheduleCallback(n.unstable_NormalPriority, qg)))
  }
  function Is(e) {
    function t(u) {
      return js(u, e)
    }
    if (0 < Vi.length) {
      js(Vi[0], e)
      for (var i = 1; i < Vi.length; i++) {
        var l = Vi[i]
        l.blockedOn === e && (l.blockedOn = null)
      }
    }
    for (
      bn !== null && js(bn, e),
        Cn !== null && js(Cn, e),
        Rn !== null && js(Rn, e),
        Os.forEach(t),
        As.forEach(t),
        i = 0;
      i < Tn.length;
      i++
    )
      ((l = Tn[i]), l.blockedOn === e && (l.blockedOn = null))
    for (; 0 < Tn.length && ((i = Tn[0]), i.blockedOn === null); )
      (sd(i), i.blockedOn === null && Tn.shift())
  }
  var Ur = j.ReactCurrentBatchConfig,
    Hi = !0
  function Hg(e, t, i, l) {
    var u = Pe,
      d = Ur.transition
    Ur.transition = null
    try {
      ;((Pe = 1), Bl(e, t, i, l))
    } finally {
      ;((Pe = u), (Ur.transition = d))
    }
  }
  function Qg(e, t, i, l) {
    var u = Pe,
      d = Ur.transition
    Ur.transition = null
    try {
      ;((Pe = 4), Bl(e, t, i, l))
    } finally {
      ;((Pe = u), (Ur.transition = d))
    }
  }
  function Bl(e, t, i, l) {
    if (Hi) {
      var u = $l(e, t, i, l)
      if (u === null) (ia(e, t, l, Qi, i), rd(e, l))
      else if (Vg(u, e, t, i, l)) l.stopPropagation()
      else if ((rd(e, l), t & 4 && -1 < $g.indexOf(e))) {
        for (; u !== null; ) {
          var d = Ws(u)
          if (
            (d !== null && Zc(d),
            (d = $l(e, t, i, l)),
            d === null && ia(e, t, l, Qi, i),
            d === u)
          )
            break
          u = d
        }
        u !== null && l.stopPropagation()
      } else ia(e, t, l, null, i)
    }
  }
  var Qi = null
  function $l(e, t, i, l) {
    if (((Qi = null), (e = Nl(l)), (e = lr(e)), e !== null))
      if (((t = or(e)), t === null)) e = null
      else if (((i = t.tag), i === 13)) {
        if (((e = Vc(t)), e !== null)) return e
        e = null
      } else if (i === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return t.tag === 3 ? t.stateNode.containerInfo : null
        e = null
      } else t !== e && (e = null)
    return ((Qi = e), null)
  }
  function od(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4
      case "message":
        switch (Lg()) {
          case Il:
            return 1
          case Gc:
            return 4
          case Ui:
          case jg:
            return 16
          case Yc:
            return 536870912
          default:
            return 16
        }
      default:
        return 16
    }
  }
  var Pn = null,
    Vl = null,
    Wi = null
  function ld() {
    if (Wi) return Wi
    var e,
      t = Vl,
      i = t.length,
      l,
      u = "value" in Pn ? Pn.value : Pn.textContent,
      d = u.length
    for (e = 0; e < i && t[e] === u[e]; e++);
    var p = i - e
    for (l = 1; l <= p && t[i - l] === u[d - l]; l++);
    return (Wi = u.slice(e, 1 < l ? 1 - l : void 0))
  }
  function Ki(e) {
    var t = e.keyCode
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
        : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    )
  }
  function Gi() {
    return !0
  }
  function ad() {
    return !1
  }
  function Rt(e) {
    function t(i, l, u, d, p) {
      ;((this._reactName = i),
        (this._targetInst = u),
        (this.type = l),
        (this.nativeEvent = d),
        (this.target = p),
        (this.currentTarget = null))
      for (var v in e)
        e.hasOwnProperty(v) && ((i = e[v]), (this[v] = i ? i(d) : d[v]))
      return (
        (this.isDefaultPrevented = (
          d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1
        )
          ? Gi
          : ad),
        (this.isPropagationStopped = ad),
        this
      )
    }
    return (
      I(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0
          var i = this.nativeEvent
          i &&
            (i.preventDefault
              ? i.preventDefault()
              : typeof i.returnValue != "unknown" && (i.returnValue = !1),
            (this.isDefaultPrevented = Gi))
        },
        stopPropagation: function () {
          var i = this.nativeEvent
          i &&
            (i.stopPropagation
              ? i.stopPropagation()
              : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0),
            (this.isPropagationStopped = Gi))
        },
        persist: function () {},
        isPersistent: Gi,
      }),
      t
    )
  }
  var Mr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now()
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    ql = Rt(Mr),
    Ds = I({}, Mr, { view: 0, detail: 0 }),
    Wg = Rt(Ds),
    Hl,
    Ql,
    Fs,
    Yi = I({}, Ds, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Kl,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== Fs &&
              (Fs && e.type === "mousemove"
                ? ((Hl = e.screenX - Fs.screenX), (Ql = e.screenY - Fs.screenY))
                : (Ql = Hl = 0),
              (Fs = e)),
            Hl)
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : Ql
      },
    }),
    ud = Rt(Yi),
    Kg = I({}, Yi, { dataTransfer: 0 }),
    Gg = Rt(Kg),
    Yg = I({}, Ds, { relatedTarget: 0 }),
    Wl = Rt(Yg),
    Jg = I({}, Mr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Xg = Rt(Jg),
    Zg = I({}, Mr, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData
      },
    }),
    ey = Rt(Zg),
    ty = I({}, Mr, { data: 0 }),
    cd = Rt(ty),
    ny = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    ry = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    sy = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    }
  function iy(e) {
    var t = this.nativeEvent
    return t.getModifierState
      ? t.getModifierState(e)
      : (e = sy[e])
        ? !!t[e]
        : !1
  }
  function Kl() {
    return iy
  }
  var oy = I({}, Ds, {
      key: function (e) {
        if (e.key) {
          var t = ny[e.key] || e.key
          if (t !== "Unidentified") return t
        }
        return e.type === "keypress"
          ? ((e = Ki(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? ry[e.keyCode] || "Unidentified"
            : ""
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Kl,
      charCode: function (e) {
        return e.type === "keypress" ? Ki(e) : 0
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
      },
      which: function (e) {
        return e.type === "keypress"
          ? Ki(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0
      },
    }),
    ly = Rt(oy),
    ay = I({}, Yi, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    dd = Rt(ay),
    uy = I({}, Ds, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Kl,
    }),
    cy = Rt(uy),
    dy = I({}, Mr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    fy = Rt(dy),
    hy = I({}, Yi, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
            ? -e.wheelDeltaX
            : 0
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    py = Rt(hy),
    my = [9, 13, 27, 32],
    Gl = h && "CompositionEvent" in window,
    Us = null
  h && "documentMode" in document && (Us = document.documentMode)
  var gy = h && "TextEvent" in window && !Us,
    fd = h && (!Gl || (Us && 8 < Us && 11 >= Us)),
    hd = " ",
    pd = !1
  function md(e, t) {
    switch (e) {
      case "keyup":
        return my.indexOf(t.keyCode) !== -1
      case "keydown":
        return t.keyCode !== 229
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0
      default:
        return !1
    }
  }
  function gd(e) {
    return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null)
  }
  var zr = !1
  function yy(e, t) {
    switch (e) {
      case "compositionend":
        return gd(t)
      case "keypress":
        return t.which !== 32 ? null : ((pd = !0), hd)
      case "textInput":
        return ((e = t.data), e === hd && pd ? null : e)
      default:
        return null
    }
  }
  function vy(e, t) {
    if (zr)
      return e === "compositionend" || (!Gl && md(e, t))
        ? ((e = ld()), (Wi = Vl = Pn = null), (zr = !1), e)
        : null
    switch (e) {
      case "paste":
        return null
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char
          if (t.which) return String.fromCharCode(t.which)
        }
        return null
      case "compositionend":
        return fd && t.locale !== "ko" ? null : t.data
      default:
        return null
    }
  }
  var wy = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  }
  function yd(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase()
    return t === "input" ? !!wy[e.type] : t === "textarea"
  }
  function vd(e, t, i, l) {
    ;(Uc(l),
      (t = to(t, "onChange")),
      0 < t.length &&
        ((i = new ql("onChange", "change", null, i, l)),
        e.push({ event: i, listeners: t })))
  }
  var Ms = null,
    zs = null
  function xy(e) {
    Dd(e, 0)
  }
  function Ji(e) {
    var t = Hr(e)
    if (ir(t)) return e
  }
  function Sy(e, t) {
    if (e === "change") return t
  }
  var wd = !1
  if (h) {
    var Yl
    if (h) {
      var Jl = "oninput" in document
      if (!Jl) {
        var xd = document.createElement("div")
        ;(xd.setAttribute("oninput", "return;"),
          (Jl = typeof xd.oninput == "function"))
      }
      Yl = Jl
    } else Yl = !1
    wd = Yl && (!document.documentMode || 9 < document.documentMode)
  }
  function Sd() {
    Ms && (Ms.detachEvent("onpropertychange", kd), (zs = Ms = null))
  }
  function kd(e) {
    if (e.propertyName === "value" && Ji(zs)) {
      var t = []
      ;(vd(t, zs, e, Nl(e)), $c(xy, t))
    }
  }
  function ky(e, t, i) {
    e === "focusin"
      ? (Sd(), (Ms = t), (zs = i), Ms.attachEvent("onpropertychange", kd))
      : e === "focusout" && Sd()
  }
  function Ey(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Ji(zs)
  }
  function _y(e, t) {
    if (e === "click") return Ji(t)
  }
  function by(e, t) {
    if (e === "input" || e === "change") return Ji(t)
  }
  function Cy(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t)
  }
  var $t = typeof Object.is == "function" ? Object.is : Cy
  function Bs(e, t) {
    if ($t(e, t)) return !0
    if (
      typeof e != "object" ||
      e === null ||
      typeof t != "object" ||
      t === null
    )
      return !1
    var i = Object.keys(e),
      l = Object.keys(t)
    if (i.length !== l.length) return !1
    for (l = 0; l < i.length; l++) {
      var u = i[l]
      if (!m.call(t, u) || !$t(e[u], t[u])) return !1
    }
    return !0
  }
  function Ed(e) {
    for (; e && e.firstChild; ) e = e.firstChild
    return e
  }
  function _d(e, t) {
    var i = Ed(e)
    e = 0
    for (var l; i; ) {
      if (i.nodeType === 3) {
        if (((l = e + i.textContent.length), e <= t && l >= t))
          return { node: i, offset: t - e }
        e = l
      }
      e: {
        for (; i; ) {
          if (i.nextSibling) {
            i = i.nextSibling
            break e
          }
          i = i.parentNode
        }
        i = void 0
      }
      i = Ed(i)
    }
  }
  function bd(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? bd(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1
  }
  function Cd() {
    for (var e = window, t = En(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var i = typeof t.contentWindow.location.href == "string"
      } catch {
        i = !1
      }
      if (i) e = t.contentWindow
      else break
      t = En(e.document)
    }
    return t
  }
  function Xl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase()
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    )
  }
  function Ry(e) {
    var t = Cd(),
      i = e.focusedElem,
      l = e.selectionRange
    if (
      t !== i &&
      i &&
      i.ownerDocument &&
      bd(i.ownerDocument.documentElement, i)
    ) {
      if (l !== null && Xl(i)) {
        if (
          ((t = l.start),
          (e = l.end),
          e === void 0 && (e = t),
          "selectionStart" in i)
        )
          ((i.selectionStart = t),
            (i.selectionEnd = Math.min(e, i.value.length)))
        else if (
          ((e = ((t = i.ownerDocument || document) && t.defaultView) || window),
          e.getSelection)
        ) {
          e = e.getSelection()
          var u = i.textContent.length,
            d = Math.min(l.start, u)
          ;((l = l.end === void 0 ? d : Math.min(l.end, u)),
            !e.extend && d > l && ((u = l), (l = d), (d = u)),
            (u = _d(i, d)))
          var p = _d(i, l)
          u &&
            p &&
            (e.rangeCount !== 1 ||
              e.anchorNode !== u.node ||
              e.anchorOffset !== u.offset ||
              e.focusNode !== p.node ||
              e.focusOffset !== p.offset) &&
            ((t = t.createRange()),
            t.setStart(u.node, u.offset),
            e.removeAllRanges(),
            d > l
              ? (e.addRange(t), e.extend(p.node, p.offset))
              : (t.setEnd(p.node, p.offset), e.addRange(t)))
        }
      }
      for (t = [], e = i; (e = e.parentNode); )
        e.nodeType === 1 &&
          t.push({ element: e, left: e.scrollLeft, top: e.scrollTop })
      for (typeof i.focus == "function" && i.focus(), i = 0; i < t.length; i++)
        ((e = t[i]),
          (e.element.scrollLeft = e.left),
          (e.element.scrollTop = e.top))
    }
  }
  var Ty = h && "documentMode" in document && 11 >= document.documentMode,
    Br = null,
    Zl = null,
    $s = null,
    ea = !1
  function Rd(e, t, i) {
    var l = i.window === i ? i.document : i.nodeType === 9 ? i : i.ownerDocument
    ea ||
      Br == null ||
      Br !== En(l) ||
      ((l = Br),
      "selectionStart" in l && Xl(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = (
            (l.ownerDocument && l.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      ($s && Bs($s, l)) ||
        (($s = l),
        (l = to(Zl, "onSelect")),
        0 < l.length &&
          ((t = new ql("onSelect", "select", null, t, i)),
          e.push({ event: t, listeners: l }),
          (t.target = Br))))
  }
  function Xi(e, t) {
    var i = {}
    return (
      (i[e.toLowerCase()] = t.toLowerCase()),
      (i["Webkit" + e] = "webkit" + t),
      (i["Moz" + e] = "moz" + t),
      i
    )
  }
  var $r = {
      animationend: Xi("Animation", "AnimationEnd"),
      animationiteration: Xi("Animation", "AnimationIteration"),
      animationstart: Xi("Animation", "AnimationStart"),
      transitionend: Xi("Transition", "TransitionEnd"),
    },
    ta = {},
    Td = {}
  h &&
    ((Td = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete $r.animationend.animation,
      delete $r.animationiteration.animation,
      delete $r.animationstart.animation),
    "TransitionEvent" in window || delete $r.transitionend.transition)
  function Zi(e) {
    if (ta[e]) return ta[e]
    if (!$r[e]) return e
    var t = $r[e],
      i
    for (i in t) if (t.hasOwnProperty(i) && i in Td) return (ta[e] = t[i])
    return e
  }
  var Pd = Zi("animationend"),
    Nd = Zi("animationiteration"),
    Od = Zi("animationstart"),
    Ad = Zi("transitionend"),
    Ld = new Map(),
    jd =
      "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      )
  function Nn(e, t) {
    ;(Ld.set(e, t), c(t, [e]))
  }
  for (var na = 0; na < jd.length; na++) {
    var ra = jd[na],
      Py = ra.toLowerCase(),
      Ny = ra[0].toUpperCase() + ra.slice(1)
    Nn(Py, "on" + Ny)
  }
  ;(Nn(Pd, "onAnimationEnd"),
    Nn(Nd, "onAnimationIteration"),
    Nn(Od, "onAnimationStart"),
    Nn("dblclick", "onDoubleClick"),
    Nn("focusin", "onFocus"),
    Nn("focusout", "onBlur"),
    Nn(Ad, "onTransitionEnd"),
    f("onMouseEnter", ["mouseout", "mouseover"]),
    f("onMouseLeave", ["mouseout", "mouseover"]),
    f("onPointerEnter", ["pointerout", "pointerover"]),
    f("onPointerLeave", ["pointerout", "pointerover"]),
    c(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    c(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    c("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    c(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    c(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    c(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ))
  var Vs =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Oy = new Set(
      "cancel close invalid load scroll toggle".split(" ").concat(Vs),
    )
  function Id(e, t, i) {
    var l = e.type || "unknown-event"
    ;((e.currentTarget = i), Pg(l, t, void 0, e), (e.currentTarget = null))
  }
  function Dd(e, t) {
    t = (t & 4) !== 0
    for (var i = 0; i < e.length; i++) {
      var l = e[i],
        u = l.event
      l = l.listeners
      e: {
        var d = void 0
        if (t)
          for (var p = l.length - 1; 0 <= p; p--) {
            var v = l[p],
              x = v.instance,
              N = v.currentTarget
            if (((v = v.listener), x !== d && u.isPropagationStopped())) break e
            ;(Id(u, v, N), (d = x))
          }
        else
          for (p = 0; p < l.length; p++) {
            if (
              ((v = l[p]),
              (x = v.instance),
              (N = v.currentTarget),
              (v = v.listener),
              x !== d && u.isPropagationStopped())
            )
              break e
            ;(Id(u, v, N), (d = x))
          }
      }
    }
    if (Fi) throw ((e = jl), (Fi = !1), (jl = null), e)
  }
  function Fe(e, t) {
    var i = t[da]
    i === void 0 && (i = t[da] = new Set())
    var l = e + "__bubble"
    i.has(l) || (Fd(t, e, 2, !1), i.add(l))
  }
  function sa(e, t, i) {
    var l = 0
    ;(t && (l |= 4), Fd(i, e, l, t))
  }
  var eo = "_reactListening" + Math.random().toString(36).slice(2)
  function qs(e) {
    if (!e[eo]) {
      ;((e[eo] = !0),
        o.forEach(function (i) {
          i !== "selectionchange" && (Oy.has(i) || sa(i, !1, e), sa(i, !0, e))
        }))
      var t = e.nodeType === 9 ? e : e.ownerDocument
      t === null || t[eo] || ((t[eo] = !0), sa("selectionchange", !1, t))
    }
  }
  function Fd(e, t, i, l) {
    switch (od(t)) {
      case 1:
        var u = Hg
        break
      case 4:
        u = Qg
        break
      default:
        u = Bl
    }
    ;((i = u.bind(null, t, i, e)),
      (u = void 0),
      !Ll ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (u = !0),
      l
        ? u !== void 0
          ? e.addEventListener(t, i, { capture: !0, passive: u })
          : e.addEventListener(t, i, !0)
        : u !== void 0
          ? e.addEventListener(t, i, { passive: u })
          : e.addEventListener(t, i, !1))
  }
  function ia(e, t, i, l, u) {
    var d = l
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (;;) {
        if (l === null) return
        var p = l.tag
        if (p === 3 || p === 4) {
          var v = l.stateNode.containerInfo
          if (v === u || (v.nodeType === 8 && v.parentNode === u)) break
          if (p === 4)
            for (p = l.return; p !== null; ) {
              var x = p.tag
              if (
                (x === 3 || x === 4) &&
                ((x = p.stateNode.containerInfo),
                x === u || (x.nodeType === 8 && x.parentNode === u))
              )
                return
              p = p.return
            }
          for (; v !== null; ) {
            if (((p = lr(v)), p === null)) return
            if (((x = p.tag), x === 5 || x === 6)) {
              l = d = p
              continue e
            }
            v = v.parentNode
          }
        }
        l = l.return
      }
    $c(function () {
      var N = d,
        M = Nl(i),
        $ = []
      e: {
        var U = Ld.get(e)
        if (U !== void 0) {
          var W = ql,
            J = e
          switch (e) {
            case "keypress":
              if (Ki(i) === 0) break e
            case "keydown":
            case "keyup":
              W = ly
              break
            case "focusin":
              ;((J = "focus"), (W = Wl))
              break
            case "focusout":
              ;((J = "blur"), (W = Wl))
              break
            case "beforeblur":
            case "afterblur":
              W = Wl
              break
            case "click":
              if (i.button === 2) break e
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              W = ud
              break
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              W = Gg
              break
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              W = cy
              break
            case Pd:
            case Nd:
            case Od:
              W = Xg
              break
            case Ad:
              W = fy
              break
            case "scroll":
              W = Wg
              break
            case "wheel":
              W = py
              break
            case "copy":
            case "cut":
            case "paste":
              W = ey
              break
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              W = dd
          }
          var ee = (t & 4) !== 0,
            He = !ee && e === "scroll",
            T = ee ? (U !== null ? U + "Capture" : null) : U
          ee = []
          for (var _ = N, P; _ !== null; ) {
            P = _
            var V = P.stateNode
            if (
              (P.tag === 5 &&
                V !== null &&
                ((P = V),
                T !== null &&
                  ((V = Cs(_, T)), V != null && ee.push(Hs(_, V, P)))),
              He)
            )
              break
            _ = _.return
          }
          0 < ee.length &&
            ((U = new W(U, J, null, i, M)), $.push({ event: U, listeners: ee }))
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((U = e === "mouseover" || e === "pointerover"),
            (W = e === "mouseout" || e === "pointerout"),
            U &&
              i !== Pl &&
              (J = i.relatedTarget || i.fromElement) &&
              (lr(J) || J[cn]))
          )
            break e
          if (
            (W || U) &&
            ((U =
              M.window === M
                ? M
                : (U = M.ownerDocument)
                  ? U.defaultView || U.parentWindow
                  : window),
            W
              ? ((J = i.relatedTarget || i.toElement),
                (W = N),
                (J = J ? lr(J) : null),
                J !== null &&
                  ((He = or(J)), J !== He || (J.tag !== 5 && J.tag !== 6)) &&
                  (J = null))
              : ((W = null), (J = N)),
            W !== J)
          ) {
            if (
              ((ee = ud),
              (V = "onMouseLeave"),
              (T = "onMouseEnter"),
              (_ = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((ee = dd),
                (V = "onPointerLeave"),
                (T = "onPointerEnter"),
                (_ = "pointer")),
              (He = W == null ? U : Hr(W)),
              (P = J == null ? U : Hr(J)),
              (U = new ee(V, _ + "leave", W, i, M)),
              (U.target = He),
              (U.relatedTarget = P),
              (V = null),
              lr(M) === N &&
                ((ee = new ee(T, _ + "enter", J, i, M)),
                (ee.target = P),
                (ee.relatedTarget = He),
                (V = ee)),
              (He = V),
              W && J)
            )
              t: {
                for (ee = W, T = J, _ = 0, P = ee; P; P = Vr(P)) _++
                for (P = 0, V = T; V; V = Vr(V)) P++
                for (; 0 < _ - P; ) ((ee = Vr(ee)), _--)
                for (; 0 < P - _; ) ((T = Vr(T)), P--)
                for (; _--; ) {
                  if (ee === T || (T !== null && ee === T.alternate)) break t
                  ;((ee = Vr(ee)), (T = Vr(T)))
                }
                ee = null
              }
            else ee = null
            ;(W !== null && Ud($, U, W, ee, !1),
              J !== null && He !== null && Ud($, He, J, ee, !0))
          }
        }
        e: {
          if (
            ((U = N ? Hr(N) : window),
            (W = U.nodeName && U.nodeName.toLowerCase()),
            W === "select" || (W === "input" && U.type === "file"))
          )
            var te = Sy
          else if (yd(U))
            if (wd) te = by
            else {
              te = Ey
              var ie = ky
            }
          else
            (W = U.nodeName) &&
              W.toLowerCase() === "input" &&
              (U.type === "checkbox" || U.type === "radio") &&
              (te = _y)
          if (te && (te = te(e, N))) {
            vd($, te, i, M)
            break e
          }
          ;(ie && ie(e, U, N),
            e === "focusout" &&
              (ie = U._wrapperState) &&
              ie.controlled &&
              U.type === "number" &&
              _l(U, "number", U.value))
        }
        switch (((ie = N ? Hr(N) : window), e)) {
          case "focusin":
            ;(yd(ie) || ie.contentEditable === "true") &&
              ((Br = ie), (Zl = N), ($s = null))
            break
          case "focusout":
            $s = Zl = Br = null
            break
          case "mousedown":
            ea = !0
            break
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ;((ea = !1), Rd($, i, M))
            break
          case "selectionchange":
            if (Ty) break
          case "keydown":
          case "keyup":
            Rd($, i, M)
        }
        var oe
        if (Gl)
          e: {
            switch (e) {
              case "compositionstart":
                var he = "onCompositionStart"
                break e
              case "compositionend":
                he = "onCompositionEnd"
                break e
              case "compositionupdate":
                he = "onCompositionUpdate"
                break e
            }
            he = void 0
          }
        else
          zr
            ? md(e, i) && (he = "onCompositionEnd")
            : e === "keydown" &&
              i.keyCode === 229 &&
              (he = "onCompositionStart")
        ;(he &&
          (fd &&
            i.locale !== "ko" &&
            (zr || he !== "onCompositionStart"
              ? he === "onCompositionEnd" && zr && (oe = ld())
              : ((Pn = M),
                (Vl = "value" in Pn ? Pn.value : Pn.textContent),
                (zr = !0))),
          (ie = to(N, he)),
          0 < ie.length &&
            ((he = new cd(he, e, null, i, M)),
            $.push({ event: he, listeners: ie }),
            oe
              ? (he.data = oe)
              : ((oe = gd(i)), oe !== null && (he.data = oe)))),
          (oe = gy ? yy(e, i) : vy(e, i)) &&
            ((N = to(N, "onBeforeInput")),
            0 < N.length &&
              ((M = new cd("onBeforeInput", "beforeinput", null, i, M)),
              $.push({ event: M, listeners: N }),
              (M.data = oe))))
      }
      Dd($, t)
    })
  }
  function Hs(e, t, i) {
    return { instance: e, listener: t, currentTarget: i }
  }
  function to(e, t) {
    for (var i = t + "Capture", l = []; e !== null; ) {
      var u = e,
        d = u.stateNode
      ;(u.tag === 5 &&
        d !== null &&
        ((u = d),
        (d = Cs(e, i)),
        d != null && l.unshift(Hs(e, d, u)),
        (d = Cs(e, t)),
        d != null && l.push(Hs(e, d, u))),
        (e = e.return))
    }
    return l
  }
  function Vr(e) {
    if (e === null) return null
    do e = e.return
    while (e && e.tag !== 5)
    return e || null
  }
  function Ud(e, t, i, l, u) {
    for (var d = t._reactName, p = []; i !== null && i !== l; ) {
      var v = i,
        x = v.alternate,
        N = v.stateNode
      if (x !== null && x === l) break
      ;(v.tag === 5 &&
        N !== null &&
        ((v = N),
        u
          ? ((x = Cs(i, d)), x != null && p.unshift(Hs(i, x, v)))
          : u || ((x = Cs(i, d)), x != null && p.push(Hs(i, x, v)))),
        (i = i.return))
    }
    p.length !== 0 && e.push({ event: t, listeners: p })
  }
  var Ay = /\r\n?/g,
    Ly = /\u0000|\uFFFD/g
  function Md(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Ay,
        `
`,
      )
      .replace(Ly, "")
  }
  function no(e, t, i) {
    if (((t = Md(t)), Md(e) !== t && i)) throw Error(s(425))
  }
  function ro() {}
  var oa = null,
    la = null
  function aa(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    )
  }
  var ua = typeof setTimeout == "function" ? setTimeout : void 0,
    jy = typeof clearTimeout == "function" ? clearTimeout : void 0,
    zd = typeof Promise == "function" ? Promise : void 0,
    Iy =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof zd < "u"
          ? function (e) {
              return zd.resolve(null).then(e).catch(Dy)
            }
          : ua
  function Dy(e) {
    setTimeout(function () {
      throw e
    })
  }
  function ca(e, t) {
    var i = t,
      l = 0
    do {
      var u = i.nextSibling
      if ((e.removeChild(i), u && u.nodeType === 8))
        if (((i = u.data), i === "/$")) {
          if (l === 0) {
            ;(e.removeChild(u), Is(t))
            return
          }
          l--
        } else (i !== "$" && i !== "$?" && i !== "$!") || l++
      i = u
    } while (i)
    Is(t)
  }
  function On(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType
      if (t === 1 || t === 3) break
      if (t === 8) {
        if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break
        if (t === "/$") return null
      }
    }
    return e
  }
  function Bd(e) {
    e = e.previousSibling
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var i = e.data
        if (i === "$" || i === "$!" || i === "$?") {
          if (t === 0) return e
          t--
        } else i === "/$" && t++
      }
      e = e.previousSibling
    }
    return null
  }
  var qr = Math.random().toString(36).slice(2),
    Zt = "__reactFiber$" + qr,
    Qs = "__reactProps$" + qr,
    cn = "__reactContainer$" + qr,
    da = "__reactEvents$" + qr,
    Fy = "__reactListeners$" + qr,
    Uy = "__reactHandles$" + qr
  function lr(e) {
    var t = e[Zt]
    if (t) return t
    for (var i = e.parentNode; i; ) {
      if ((t = i[cn] || i[Zt])) {
        if (
          ((i = t.alternate),
          t.child !== null || (i !== null && i.child !== null))
        )
          for (e = Bd(e); e !== null; ) {
            if ((i = e[Zt])) return i
            e = Bd(e)
          }
        return t
      }
      ;((e = i), (i = e.parentNode))
    }
    return null
  }
  function Ws(e) {
    return (
      (e = e[Zt] || e[cn]),
      !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3)
        ? null
        : e
    )
  }
  function Hr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode
    throw Error(s(33))
  }
  function so(e) {
    return e[Qs] || null
  }
  var fa = [],
    Qr = -1
  function An(e) {
    return { current: e }
  }
  function Ue(e) {
    0 > Qr || ((e.current = fa[Qr]), (fa[Qr] = null), Qr--)
  }
  function Le(e, t) {
    ;(Qr++, (fa[Qr] = e.current), (e.current = t))
  }
  var Ln = {},
    lt = An(Ln),
    gt = An(!1),
    ar = Ln
  function Wr(e, t) {
    var i = e.type.contextTypes
    if (!i) return Ln
    var l = e.stateNode
    if (l && l.__reactInternalMemoizedUnmaskedChildContext === t)
      return l.__reactInternalMemoizedMaskedChildContext
    var u = {},
      d
    for (d in i) u[d] = t[d]
    return (
      l &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = t),
        (e.__reactInternalMemoizedMaskedChildContext = u)),
      u
    )
  }
  function yt(e) {
    return ((e = e.childContextTypes), e != null)
  }
  function io() {
    ;(Ue(gt), Ue(lt))
  }
  function $d(e, t, i) {
    if (lt.current !== Ln) throw Error(s(168))
    ;(Le(lt, t), Le(gt, i))
  }
  function Vd(e, t, i) {
    var l = e.stateNode
    if (((t = t.childContextTypes), typeof l.getChildContext != "function"))
      return i
    l = l.getChildContext()
    for (var u in l) if (!(u in t)) throw Error(s(108, Re(e) || "Unknown", u))
    return I({}, i, l)
  }
  function oo(e) {
    return (
      (e =
        ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) ||
        Ln),
      (ar = lt.current),
      Le(lt, e),
      Le(gt, gt.current),
      !0
    )
  }
  function qd(e, t, i) {
    var l = e.stateNode
    if (!l) throw Error(s(169))
    ;(i
      ? ((e = Vd(e, t, ar)),
        (l.__reactInternalMemoizedMergedChildContext = e),
        Ue(gt),
        Ue(lt),
        Le(lt, e))
      : Ue(gt),
      Le(gt, i))
  }
  var dn = null,
    lo = !1,
    ha = !1
  function Hd(e) {
    dn === null ? (dn = [e]) : dn.push(e)
  }
  function My(e) {
    ;((lo = !0), Hd(e))
  }
  function jn() {
    if (!ha && dn !== null) {
      ha = !0
      var e = 0,
        t = Pe
      try {
        var i = dn
        for (Pe = 1; e < i.length; e++) {
          var l = i[e]
          do l = l(!0)
          while (l !== null)
        }
        ;((dn = null), (lo = !1))
      } catch (u) {
        throw (dn !== null && (dn = dn.slice(e + 1)), Wc(Il, jn), u)
      } finally {
        ;((Pe = t), (ha = !1))
      }
    }
    return null
  }
  var Kr = [],
    Gr = 0,
    ao = null,
    uo = 0,
    Ot = [],
    At = 0,
    ur = null,
    fn = 1,
    hn = ""
  function cr(e, t) {
    ;((Kr[Gr++] = uo), (Kr[Gr++] = ao), (ao = e), (uo = t))
  }
  function Qd(e, t, i) {
    ;((Ot[At++] = fn), (Ot[At++] = hn), (Ot[At++] = ur), (ur = e))
    var l = fn
    e = hn
    var u = 32 - Bt(l) - 1
    ;((l &= ~(1 << u)), (i += 1))
    var d = 32 - Bt(t) + u
    if (30 < d) {
      var p = u - (u % 5)
      ;((d = (l & ((1 << p) - 1)).toString(32)),
        (l >>= p),
        (u -= p),
        (fn = (1 << (32 - Bt(t) + u)) | (i << u) | l),
        (hn = d + e))
    } else ((fn = (1 << d) | (i << u) | l), (hn = e))
  }
  function pa(e) {
    e.return !== null && (cr(e, 1), Qd(e, 1, 0))
  }
  function ma(e) {
    for (; e === ao; )
      ((ao = Kr[--Gr]), (Kr[Gr] = null), (uo = Kr[--Gr]), (Kr[Gr] = null))
    for (; e === ur; )
      ((ur = Ot[--At]),
        (Ot[At] = null),
        (hn = Ot[--At]),
        (Ot[At] = null),
        (fn = Ot[--At]),
        (Ot[At] = null))
  }
  var Tt = null,
    Pt = null,
    Me = !1,
    Vt = null
  function Wd(e, t) {
    var i = Dt(5, null, null, 0)
    ;((i.elementType = "DELETED"),
      (i.stateNode = t),
      (i.return = e),
      (t = e.deletions),
      t === null ? ((e.deletions = [i]), (e.flags |= 16)) : t.push(i))
  }
  function Kd(e, t) {
    switch (e.tag) {
      case 5:
        var i = e.type
        return (
          (t =
            t.nodeType !== 1 || i.toLowerCase() !== t.nodeName.toLowerCase()
              ? null
              : t),
          t !== null
            ? ((e.stateNode = t), (Tt = e), (Pt = On(t.firstChild)), !0)
            : !1
        )
      case 6:
        return (
          (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
          t !== null ? ((e.stateNode = t), (Tt = e), (Pt = null), !0) : !1
        )
      case 13:
        return (
          (t = t.nodeType !== 8 ? null : t),
          t !== null
            ? ((i = ur !== null ? { id: fn, overflow: hn } : null),
              (e.memoizedState = {
                dehydrated: t,
                treeContext: i,
                retryLane: 1073741824,
              }),
              (i = Dt(18, null, null, 0)),
              (i.stateNode = t),
              (i.return = e),
              (e.child = i),
              (Tt = e),
              (Pt = null),
              !0)
            : !1
        )
      default:
        return !1
    }
  }
  function ga(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0
  }
  function ya(e) {
    if (Me) {
      var t = Pt
      if (t) {
        var i = t
        if (!Kd(e, t)) {
          if (ga(e)) throw Error(s(418))
          t = On(i.nextSibling)
          var l = Tt
          t && Kd(e, t)
            ? Wd(l, i)
            : ((e.flags = (e.flags & -4097) | 2), (Me = !1), (Tt = e))
        }
      } else {
        if (ga(e)) throw Error(s(418))
        ;((e.flags = (e.flags & -4097) | 2), (Me = !1), (Tt = e))
      }
    }
  }
  function Gd(e) {
    for (
      e = e.return;
      e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;
    )
      e = e.return
    Tt = e
  }
  function co(e) {
    if (e !== Tt) return !1
    if (!Me) return (Gd(e), (Me = !0), !1)
    var t
    if (
      ((t = e.tag !== 3) &&
        !(t = e.tag !== 5) &&
        ((t = e.type),
        (t = t !== "head" && t !== "body" && !aa(e.type, e.memoizedProps))),
      t && (t = Pt))
    ) {
      if (ga(e)) throw (Yd(), Error(s(418)))
      for (; t; ) (Wd(e, t), (t = On(t.nextSibling)))
    }
    if ((Gd(e), e.tag === 13)) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(s(317))
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var i = e.data
            if (i === "/$") {
              if (t === 0) {
                Pt = On(e.nextSibling)
                break e
              }
              t--
            } else (i !== "$" && i !== "$!" && i !== "$?") || t++
          }
          e = e.nextSibling
        }
        Pt = null
      }
    } else Pt = Tt ? On(e.stateNode.nextSibling) : null
    return !0
  }
  function Yd() {
    for (var e = Pt; e; ) e = On(e.nextSibling)
  }
  function Yr() {
    ;((Pt = Tt = null), (Me = !1))
  }
  function va(e) {
    Vt === null ? (Vt = [e]) : Vt.push(e)
  }
  var zy = j.ReactCurrentBatchConfig
  function Ks(e, t, i) {
    if (
      ((e = i.ref),
      e !== null && typeof e != "function" && typeof e != "object")
    ) {
      if (i._owner) {
        if (((i = i._owner), i)) {
          if (i.tag !== 1) throw Error(s(309))
          var l = i.stateNode
        }
        if (!l) throw Error(s(147, e))
        var u = l,
          d = "" + e
        return t !== null &&
          t.ref !== null &&
          typeof t.ref == "function" &&
          t.ref._stringRef === d
          ? t.ref
          : ((t = function (p) {
              var v = u.refs
              p === null ? delete v[d] : (v[d] = p)
            }),
            (t._stringRef = d),
            t)
      }
      if (typeof e != "string") throw Error(s(284))
      if (!i._owner) throw Error(s(290, e))
    }
    return e
  }
  function fo(e, t) {
    throw (
      (e = Object.prototype.toString.call(t)),
      Error(
        s(
          31,
          e === "[object Object]"
            ? "object with keys {" + Object.keys(t).join(", ") + "}"
            : e,
        ),
      )
    )
  }
  function Jd(e) {
    var t = e._init
    return t(e._payload)
  }
  function Xd(e) {
    function t(T, _) {
      if (e) {
        var P = T.deletions
        P === null ? ((T.deletions = [_]), (T.flags |= 16)) : P.push(_)
      }
    }
    function i(T, _) {
      if (!e) return null
      for (; _ !== null; ) (t(T, _), (_ = _.sibling))
      return null
    }
    function l(T, _) {
      for (T = new Map(); _ !== null; )
        (_.key !== null ? T.set(_.key, _) : T.set(_.index, _), (_ = _.sibling))
      return T
    }
    function u(T, _) {
      return ((T = $n(T, _)), (T.index = 0), (T.sibling = null), T)
    }
    function d(T, _, P) {
      return (
        (T.index = P),
        e
          ? ((P = T.alternate),
            P !== null
              ? ((P = P.index), P < _ ? ((T.flags |= 2), _) : P)
              : ((T.flags |= 2), _))
          : ((T.flags |= 1048576), _)
      )
    }
    function p(T) {
      return (e && T.alternate === null && (T.flags |= 2), T)
    }
    function v(T, _, P, V) {
      return _ === null || _.tag !== 6
        ? ((_ = uu(P, T.mode, V)), (_.return = T), _)
        : ((_ = u(_, P)), (_.return = T), _)
    }
    function x(T, _, P, V) {
      var te = P.type
      return te === se
        ? M(T, _, P.props.children, V, P.key)
        : _ !== null &&
            (_.elementType === te ||
              (typeof te == "object" &&
                te !== null &&
                te.$$typeof === ye &&
                Jd(te) === _.type))
          ? ((V = u(_, P.props)), (V.ref = Ks(T, _, P)), (V.return = T), V)
          : ((V = Do(P.type, P.key, P.props, null, T.mode, V)),
            (V.ref = Ks(T, _, P)),
            (V.return = T),
            V)
    }
    function N(T, _, P, V) {
      return _ === null ||
        _.tag !== 4 ||
        _.stateNode.containerInfo !== P.containerInfo ||
        _.stateNode.implementation !== P.implementation
        ? ((_ = cu(P, T.mode, V)), (_.return = T), _)
        : ((_ = u(_, P.children || [])), (_.return = T), _)
    }
    function M(T, _, P, V, te) {
      return _ === null || _.tag !== 7
        ? ((_ = vr(P, T.mode, V, te)), (_.return = T), _)
        : ((_ = u(_, P)), (_.return = T), _)
    }
    function $(T, _, P) {
      if ((typeof _ == "string" && _ !== "") || typeof _ == "number")
        return ((_ = uu("" + _, T.mode, P)), (_.return = T), _)
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case K:
            return (
              (P = Do(_.type, _.key, _.props, null, T.mode, P)),
              (P.ref = Ks(T, null, _)),
              (P.return = T),
              P
            )
          case ne:
            return ((_ = cu(_, T.mode, P)), (_.return = T), _)
          case ye:
            var V = _._init
            return $(T, V(_._payload), P)
        }
        if (Es(_) || re(_))
          return ((_ = vr(_, T.mode, P, null)), (_.return = T), _)
        fo(T, _)
      }
      return null
    }
    function U(T, _, P, V) {
      var te = _ !== null ? _.key : null
      if ((typeof P == "string" && P !== "") || typeof P == "number")
        return te !== null ? null : v(T, _, "" + P, V)
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case K:
            return P.key === te ? x(T, _, P, V) : null
          case ne:
            return P.key === te ? N(T, _, P, V) : null
          case ye:
            return ((te = P._init), U(T, _, te(P._payload), V))
        }
        if (Es(P) || re(P)) return te !== null ? null : M(T, _, P, V, null)
        fo(T, P)
      }
      return null
    }
    function W(T, _, P, V, te) {
      if ((typeof V == "string" && V !== "") || typeof V == "number")
        return ((T = T.get(P) || null), v(_, T, "" + V, te))
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case K:
            return (
              (T = T.get(V.key === null ? P : V.key) || null),
              x(_, T, V, te)
            )
          case ne:
            return (
              (T = T.get(V.key === null ? P : V.key) || null),
              N(_, T, V, te)
            )
          case ye:
            var ie = V._init
            return W(T, _, P, ie(V._payload), te)
        }
        if (Es(V) || re(V))
          return ((T = T.get(P) || null), M(_, T, V, te, null))
        fo(_, V)
      }
      return null
    }
    function J(T, _, P, V) {
      for (
        var te = null, ie = null, oe = _, he = (_ = 0), et = null;
        oe !== null && he < P.length;
        he++
      ) {
        oe.index > he ? ((et = oe), (oe = null)) : (et = oe.sibling)
        var Ce = U(T, oe, P[he], V)
        if (Ce === null) {
          oe === null && (oe = et)
          break
        }
        ;(e && oe && Ce.alternate === null && t(T, oe),
          (_ = d(Ce, _, he)),
          ie === null ? (te = Ce) : (ie.sibling = Ce),
          (ie = Ce),
          (oe = et))
      }
      if (he === P.length) return (i(T, oe), Me && cr(T, he), te)
      if (oe === null) {
        for (; he < P.length; he++)
          ((oe = $(T, P[he], V)),
            oe !== null &&
              ((_ = d(oe, _, he)),
              ie === null ? (te = oe) : (ie.sibling = oe),
              (ie = oe)))
        return (Me && cr(T, he), te)
      }
      for (oe = l(T, oe); he < P.length; he++)
        ((et = W(oe, T, he, P[he], V)),
          et !== null &&
            (e &&
              et.alternate !== null &&
              oe.delete(et.key === null ? he : et.key),
            (_ = d(et, _, he)),
            ie === null ? (te = et) : (ie.sibling = et),
            (ie = et)))
      return (
        e &&
          oe.forEach(function (Vn) {
            return t(T, Vn)
          }),
        Me && cr(T, he),
        te
      )
    }
    function ee(T, _, P, V) {
      var te = re(P)
      if (typeof te != "function") throw Error(s(150))
      if (((P = te.call(P)), P == null)) throw Error(s(151))
      for (
        var ie = (te = null), oe = _, he = (_ = 0), et = null, Ce = P.next();
        oe !== null && !Ce.done;
        he++, Ce = P.next()
      ) {
        oe.index > he ? ((et = oe), (oe = null)) : (et = oe.sibling)
        var Vn = U(T, oe, Ce.value, V)
        if (Vn === null) {
          oe === null && (oe = et)
          break
        }
        ;(e && oe && Vn.alternate === null && t(T, oe),
          (_ = d(Vn, _, he)),
          ie === null ? (te = Vn) : (ie.sibling = Vn),
          (ie = Vn),
          (oe = et))
      }
      if (Ce.done) return (i(T, oe), Me && cr(T, he), te)
      if (oe === null) {
        for (; !Ce.done; he++, Ce = P.next())
          ((Ce = $(T, Ce.value, V)),
            Ce !== null &&
              ((_ = d(Ce, _, he)),
              ie === null ? (te = Ce) : (ie.sibling = Ce),
              (ie = Ce)))
        return (Me && cr(T, he), te)
      }
      for (oe = l(T, oe); !Ce.done; he++, Ce = P.next())
        ((Ce = W(oe, T, he, Ce.value, V)),
          Ce !== null &&
            (e &&
              Ce.alternate !== null &&
              oe.delete(Ce.key === null ? he : Ce.key),
            (_ = d(Ce, _, he)),
            ie === null ? (te = Ce) : (ie.sibling = Ce),
            (ie = Ce)))
      return (
        e &&
          oe.forEach(function (wv) {
            return t(T, wv)
          }),
        Me && cr(T, he),
        te
      )
    }
    function He(T, _, P, V) {
      if (
        (typeof P == "object" &&
          P !== null &&
          P.type === se &&
          P.key === null &&
          (P = P.props.children),
        typeof P == "object" && P !== null)
      ) {
        switch (P.$$typeof) {
          case K:
            e: {
              for (var te = P.key, ie = _; ie !== null; ) {
                if (ie.key === te) {
                  if (((te = P.type), te === se)) {
                    if (ie.tag === 7) {
                      ;(i(T, ie.sibling),
                        (_ = u(ie, P.props.children)),
                        (_.return = T),
                        (T = _))
                      break e
                    }
                  } else if (
                    ie.elementType === te ||
                    (typeof te == "object" &&
                      te !== null &&
                      te.$$typeof === ye &&
                      Jd(te) === ie.type)
                  ) {
                    ;(i(T, ie.sibling),
                      (_ = u(ie, P.props)),
                      (_.ref = Ks(T, ie, P)),
                      (_.return = T),
                      (T = _))
                    break e
                  }
                  i(T, ie)
                  break
                } else t(T, ie)
                ie = ie.sibling
              }
              P.type === se
                ? ((_ = vr(P.props.children, T.mode, V, P.key)),
                  (_.return = T),
                  (T = _))
                : ((V = Do(P.type, P.key, P.props, null, T.mode, V)),
                  (V.ref = Ks(T, _, P)),
                  (V.return = T),
                  (T = V))
            }
            return p(T)
          case ne:
            e: {
              for (ie = P.key; _ !== null; ) {
                if (_.key === ie)
                  if (
                    _.tag === 4 &&
                    _.stateNode.containerInfo === P.containerInfo &&
                    _.stateNode.implementation === P.implementation
                  ) {
                    ;(i(T, _.sibling),
                      (_ = u(_, P.children || [])),
                      (_.return = T),
                      (T = _))
                    break e
                  } else {
                    i(T, _)
                    break
                  }
                else t(T, _)
                _ = _.sibling
              }
              ;((_ = cu(P, T.mode, V)), (_.return = T), (T = _))
            }
            return p(T)
          case ye:
            return ((ie = P._init), He(T, _, ie(P._payload), V))
        }
        if (Es(P)) return J(T, _, P, V)
        if (re(P)) return ee(T, _, P, V)
        fo(T, P)
      }
      return (typeof P == "string" && P !== "") || typeof P == "number"
        ? ((P = "" + P),
          _ !== null && _.tag === 6
            ? (i(T, _.sibling), (_ = u(_, P)), (_.return = T), (T = _))
            : (i(T, _), (_ = uu(P, T.mode, V)), (_.return = T), (T = _)),
          p(T))
        : i(T, _)
    }
    return He
  }
  var Jr = Xd(!0),
    Zd = Xd(!1),
    ho = An(null),
    po = null,
    Xr = null,
    wa = null
  function xa() {
    wa = Xr = po = null
  }
  function Sa(e) {
    var t = ho.current
    ;(Ue(ho), (e._currentValue = t))
  }
  function ka(e, t, i) {
    for (; e !== null; ) {
      var l = e.alternate
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), l !== null && (l.childLanes |= t))
          : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t),
        e === i)
      )
        break
      e = e.return
    }
  }
  function Zr(e, t) {
    ;((po = e),
      (wa = Xr = null),
      (e = e.dependencies),
      e !== null &&
        e.firstContext !== null &&
        ((e.lanes & t) !== 0 && (vt = !0), (e.firstContext = null)))
  }
  function Lt(e) {
    var t = e._currentValue
    if (wa !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), Xr === null)) {
        if (po === null) throw Error(s(308))
        ;((Xr = e), (po.dependencies = { lanes: 0, firstContext: e }))
      } else Xr = Xr.next = e
    return t
  }
  var dr = null
  function Ea(e) {
    dr === null ? (dr = [e]) : dr.push(e)
  }
  function ef(e, t, i, l) {
    var u = t.interleaved
    return (
      u === null ? ((i.next = i), Ea(t)) : ((i.next = u.next), (u.next = i)),
      (t.interleaved = i),
      pn(e, l)
    )
  }
  function pn(e, t) {
    e.lanes |= t
    var i = e.alternate
    for (i !== null && (i.lanes |= t), i = e, e = e.return; e !== null; )
      ((e.childLanes |= t),
        (i = e.alternate),
        i !== null && (i.childLanes |= t),
        (i = e),
        (e = e.return))
    return i.tag === 3 ? i.stateNode : null
  }
  var In = !1
  function _a(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    }
  }
  function tf(e, t) {
    ;((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        }))
  }
  function mn(e, t) {
    return {
      eventTime: e,
      lane: t,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
    }
  }
  function Dn(e, t, i) {
    var l = e.updateQueue
    if (l === null) return null
    if (((l = l.shared), (_e & 2) !== 0)) {
      var u = l.pending
      return (
        u === null ? (t.next = t) : ((t.next = u.next), (u.next = t)),
        (l.pending = t),
        pn(e, i)
      )
    }
    return (
      (u = l.interleaved),
      u === null ? ((t.next = t), Ea(l)) : ((t.next = u.next), (u.next = t)),
      (l.interleaved = t),
      pn(e, i)
    )
  }
  function mo(e, t, i) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (i & 4194240) !== 0))
    ) {
      var l = t.lanes
      ;((l &= e.pendingLanes), (i |= l), (t.lanes = i), Ul(e, i))
    }
  }
  function nf(e, t) {
    var i = e.updateQueue,
      l = e.alternate
    if (l !== null && ((l = l.updateQueue), i === l)) {
      var u = null,
        d = null
      if (((i = i.firstBaseUpdate), i !== null)) {
        do {
          var p = {
            eventTime: i.eventTime,
            lane: i.lane,
            tag: i.tag,
            payload: i.payload,
            callback: i.callback,
            next: null,
          }
          ;(d === null ? (u = d = p) : (d = d.next = p), (i = i.next))
        } while (i !== null)
        d === null ? (u = d = t) : (d = d.next = t)
      } else u = d = t
      ;((i = {
        baseState: l.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: d,
        shared: l.shared,
        effects: l.effects,
      }),
        (e.updateQueue = i))
      return
    }
    ;((e = i.lastBaseUpdate),
      e === null ? (i.firstBaseUpdate = t) : (e.next = t),
      (i.lastBaseUpdate = t))
  }
  function go(e, t, i, l) {
    var u = e.updateQueue
    In = !1
    var d = u.firstBaseUpdate,
      p = u.lastBaseUpdate,
      v = u.shared.pending
    if (v !== null) {
      u.shared.pending = null
      var x = v,
        N = x.next
      ;((x.next = null), p === null ? (d = N) : (p.next = N), (p = x))
      var M = e.alternate
      M !== null &&
        ((M = M.updateQueue),
        (v = M.lastBaseUpdate),
        v !== p &&
          (v === null ? (M.firstBaseUpdate = N) : (v.next = N),
          (M.lastBaseUpdate = x)))
    }
    if (d !== null) {
      var $ = u.baseState
      ;((p = 0), (M = N = x = null), (v = d))
      do {
        var U = v.lane,
          W = v.eventTime
        if ((l & U) === U) {
          M !== null &&
            (M = M.next =
              {
                eventTime: W,
                lane: 0,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null,
              })
          e: {
            var J = e,
              ee = v
            switch (((U = t), (W = i), ee.tag)) {
              case 1:
                if (((J = ee.payload), typeof J == "function")) {
                  $ = J.call(W, $, U)
                  break e
                }
                $ = J
                break e
              case 3:
                J.flags = (J.flags & -65537) | 128
              case 0:
                if (
                  ((J = ee.payload),
                  (U = typeof J == "function" ? J.call(W, $, U) : J),
                  U == null)
                )
                  break e
                $ = I({}, $, U)
                break e
              case 2:
                In = !0
            }
          }
          v.callback !== null &&
            v.lane !== 0 &&
            ((e.flags |= 64),
            (U = u.effects),
            U === null ? (u.effects = [v]) : U.push(v))
        } else
          ((W = {
            eventTime: W,
            lane: U,
            tag: v.tag,
            payload: v.payload,
            callback: v.callback,
            next: null,
          }),
            M === null ? ((N = M = W), (x = $)) : (M = M.next = W),
            (p |= U))
        if (((v = v.next), v === null)) {
          if (((v = u.shared.pending), v === null)) break
          ;((U = v),
            (v = U.next),
            (U.next = null),
            (u.lastBaseUpdate = U),
            (u.shared.pending = null))
        }
      } while (!0)
      if (
        (M === null && (x = $),
        (u.baseState = x),
        (u.firstBaseUpdate = N),
        (u.lastBaseUpdate = M),
        (t = u.shared.interleaved),
        t !== null)
      ) {
        u = t
        do ((p |= u.lane), (u = u.next))
        while (u !== t)
      } else d === null && (u.shared.lanes = 0)
      ;((pr |= p), (e.lanes = p), (e.memoizedState = $))
    }
  }
  function rf(e, t, i) {
    if (((e = t.effects), (t.effects = null), e !== null))
      for (t = 0; t < e.length; t++) {
        var l = e[t],
          u = l.callback
        if (u !== null) {
          if (((l.callback = null), (l = i), typeof u != "function"))
            throw Error(s(191, u))
          u.call(l)
        }
      }
  }
  var Gs = {},
    en = An(Gs),
    Ys = An(Gs),
    Js = An(Gs)
  function fr(e) {
    if (e === Gs) throw Error(s(174))
    return e
  }
  function ba(e, t) {
    switch ((Le(Js, t), Le(Ys, e), Le(en, Gs), (e = t.nodeType), e)) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Cl(null, "")
        break
      default:
        ;((e = e === 8 ? t.parentNode : t),
          (t = e.namespaceURI || null),
          (e = e.tagName),
          (t = Cl(t, e)))
    }
    ;(Ue(en), Le(en, t))
  }
  function es() {
    ;(Ue(en), Ue(Ys), Ue(Js))
  }
  function sf(e) {
    fr(Js.current)
    var t = fr(en.current),
      i = Cl(t, e.type)
    t !== i && (Le(Ys, e), Le(en, i))
  }
  function Ca(e) {
    Ys.current === e && (Ue(en), Ue(Ys))
  }
  var ze = An(0)
  function yo(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var i = t.memoizedState
        if (
          i !== null &&
          ((i = i.dehydrated), i === null || i.data === "$?" || i.data === "$!")
        )
          return t
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t
      } else if (t.child !== null) {
        ;((t.child.return = t), (t = t.child))
        continue
      }
      if (t === e) break
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null
        t = t.return
      }
      ;((t.sibling.return = t.return), (t = t.sibling))
    }
    return null
  }
  var Ra = []
  function Ta() {
    for (var e = 0; e < Ra.length; e++)
      Ra[e]._workInProgressVersionPrimary = null
    Ra.length = 0
  }
  var vo = j.ReactCurrentDispatcher,
    Pa = j.ReactCurrentBatchConfig,
    hr = 0,
    Be = null,
    Ge = null,
    Xe = null,
    wo = !1,
    Xs = !1,
    Zs = 0,
    By = 0
  function at() {
    throw Error(s(321))
  }
  function Na(e, t) {
    if (t === null) return !1
    for (var i = 0; i < t.length && i < e.length; i++)
      if (!$t(e[i], t[i])) return !1
    return !0
  }
  function Oa(e, t, i, l, u, d) {
    if (
      ((hr = d),
      (Be = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (vo.current = e === null || e.memoizedState === null ? Hy : Qy),
      (e = i(l, u)),
      Xs)
    ) {
      d = 0
      do {
        if (((Xs = !1), (Zs = 0), 25 <= d)) throw Error(s(301))
        ;((d += 1),
          (Xe = Ge = null),
          (t.updateQueue = null),
          (vo.current = Wy),
          (e = i(l, u)))
      } while (Xs)
    }
    if (
      ((vo.current = ko),
      (t = Ge !== null && Ge.next !== null),
      (hr = 0),
      (Xe = Ge = Be = null),
      (wo = !1),
      t)
    )
      throw Error(s(300))
    return e
  }
  function Aa() {
    var e = Zs !== 0
    return ((Zs = 0), e)
  }
  function tn() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    }
    return (Xe === null ? (Be.memoizedState = Xe = e) : (Xe = Xe.next = e), Xe)
  }
  function jt() {
    if (Ge === null) {
      var e = Be.alternate
      e = e !== null ? e.memoizedState : null
    } else e = Ge.next
    var t = Xe === null ? Be.memoizedState : Xe.next
    if (t !== null) ((Xe = t), (Ge = e))
    else {
      if (e === null) throw Error(s(310))
      ;((Ge = e),
        (e = {
          memoizedState: Ge.memoizedState,
          baseState: Ge.baseState,
          baseQueue: Ge.baseQueue,
          queue: Ge.queue,
          next: null,
        }),
        Xe === null ? (Be.memoizedState = Xe = e) : (Xe = Xe.next = e))
    }
    return Xe
  }
  function ei(e, t) {
    return typeof t == "function" ? t(e) : t
  }
  function La(e) {
    var t = jt(),
      i = t.queue
    if (i === null) throw Error(s(311))
    i.lastRenderedReducer = e
    var l = Ge,
      u = l.baseQueue,
      d = i.pending
    if (d !== null) {
      if (u !== null) {
        var p = u.next
        ;((u.next = d.next), (d.next = p))
      }
      ;((l.baseQueue = u = d), (i.pending = null))
    }
    if (u !== null) {
      ;((d = u.next), (l = l.baseState))
      var v = (p = null),
        x = null,
        N = d
      do {
        var M = N.lane
        if ((hr & M) === M)
          (x !== null &&
            (x = x.next =
              {
                lane: 0,
                action: N.action,
                hasEagerState: N.hasEagerState,
                eagerState: N.eagerState,
                next: null,
              }),
            (l = N.hasEagerState ? N.eagerState : e(l, N.action)))
        else {
          var $ = {
            lane: M,
            action: N.action,
            hasEagerState: N.hasEagerState,
            eagerState: N.eagerState,
            next: null,
          }
          ;(x === null ? ((v = x = $), (p = l)) : (x = x.next = $),
            (Be.lanes |= M),
            (pr |= M))
        }
        N = N.next
      } while (N !== null && N !== d)
      ;(x === null ? (p = l) : (x.next = v),
        $t(l, t.memoizedState) || (vt = !0),
        (t.memoizedState = l),
        (t.baseState = p),
        (t.baseQueue = x),
        (i.lastRenderedState = l))
    }
    if (((e = i.interleaved), e !== null)) {
      u = e
      do ((d = u.lane), (Be.lanes |= d), (pr |= d), (u = u.next))
      while (u !== e)
    } else u === null && (i.lanes = 0)
    return [t.memoizedState, i.dispatch]
  }
  function ja(e) {
    var t = jt(),
      i = t.queue
    if (i === null) throw Error(s(311))
    i.lastRenderedReducer = e
    var l = i.dispatch,
      u = i.pending,
      d = t.memoizedState
    if (u !== null) {
      i.pending = null
      var p = (u = u.next)
      do ((d = e(d, p.action)), (p = p.next))
      while (p !== u)
      ;($t(d, t.memoizedState) || (vt = !0),
        (t.memoizedState = d),
        t.baseQueue === null && (t.baseState = d),
        (i.lastRenderedState = d))
    }
    return [d, l]
  }
  function of() {}
  function lf(e, t) {
    var i = Be,
      l = jt(),
      u = t(),
      d = !$t(l.memoizedState, u)
    if (
      (d && ((l.memoizedState = u), (vt = !0)),
      (l = l.queue),
      Ia(cf.bind(null, i, l, e), [e]),
      l.getSnapshot !== t || d || (Xe !== null && Xe.memoizedState.tag & 1))
    ) {
      if (
        ((i.flags |= 2048),
        ti(9, uf.bind(null, i, l, u, t), void 0, null),
        Ze === null)
      )
        throw Error(s(349))
      ;(hr & 30) !== 0 || af(i, t, u)
    }
    return u
  }
  function af(e, t, i) {
    ;((e.flags |= 16384),
      (e = { getSnapshot: t, value: i }),
      (t = Be.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (Be.updateQueue = t),
          (t.stores = [e]))
        : ((i = t.stores), i === null ? (t.stores = [e]) : i.push(e)))
  }
  function uf(e, t, i, l) {
    ;((t.value = i), (t.getSnapshot = l), df(t) && ff(e))
  }
  function cf(e, t, i) {
    return i(function () {
      df(t) && ff(e)
    })
  }
  function df(e) {
    var t = e.getSnapshot
    e = e.value
    try {
      var i = t()
      return !$t(e, i)
    } catch {
      return !0
    }
  }
  function ff(e) {
    var t = pn(e, 1)
    t !== null && Wt(t, e, 1, -1)
  }
  function hf(e) {
    var t = tn()
    return (
      typeof e == "function" && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ei,
        lastRenderedState: e,
      }),
      (t.queue = e),
      (e = e.dispatch = qy.bind(null, Be, e)),
      [t.memoizedState, e]
    )
  }
  function ti(e, t, i, l) {
    return (
      (e = { tag: e, create: t, destroy: i, deps: l, next: null }),
      (t = Be.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (Be.updateQueue = t),
          (t.lastEffect = e.next = e))
        : ((i = t.lastEffect),
          i === null
            ? (t.lastEffect = e.next = e)
            : ((l = i.next), (i.next = e), (e.next = l), (t.lastEffect = e))),
      e
    )
  }
  function pf() {
    return jt().memoizedState
  }
  function xo(e, t, i, l) {
    var u = tn()
    ;((Be.flags |= e),
      (u.memoizedState = ti(1 | t, i, void 0, l === void 0 ? null : l)))
  }
  function So(e, t, i, l) {
    var u = jt()
    l = l === void 0 ? null : l
    var d = void 0
    if (Ge !== null) {
      var p = Ge.memoizedState
      if (((d = p.destroy), l !== null && Na(l, p.deps))) {
        u.memoizedState = ti(t, i, d, l)
        return
      }
    }
    ;((Be.flags |= e), (u.memoizedState = ti(1 | t, i, d, l)))
  }
  function mf(e, t) {
    return xo(8390656, 8, e, t)
  }
  function Ia(e, t) {
    return So(2048, 8, e, t)
  }
  function gf(e, t) {
    return So(4, 2, e, t)
  }
  function yf(e, t) {
    return So(4, 4, e, t)
  }
  function vf(e, t) {
    if (typeof t == "function")
      return (
        (e = e()),
        t(e),
        function () {
          t(null)
        }
      )
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null
        }
      )
  }
  function wf(e, t, i) {
    return (
      (i = i != null ? i.concat([e]) : null),
      So(4, 4, vf.bind(null, t, e), i)
    )
  }
  function Da() {}
  function xf(e, t) {
    var i = jt()
    t = t === void 0 ? null : t
    var l = i.memoizedState
    return l !== null && t !== null && Na(t, l[1])
      ? l[0]
      : ((i.memoizedState = [e, t]), e)
  }
  function Sf(e, t) {
    var i = jt()
    t = t === void 0 ? null : t
    var l = i.memoizedState
    return l !== null && t !== null && Na(t, l[1])
      ? l[0]
      : ((e = e()), (i.memoizedState = [e, t]), e)
  }
  function kf(e, t, i) {
    return (hr & 21) === 0
      ? (e.baseState && ((e.baseState = !1), (vt = !0)), (e.memoizedState = i))
      : ($t(i, t) ||
          ((i = Jc()), (Be.lanes |= i), (pr |= i), (e.baseState = !0)),
        t)
  }
  function $y(e, t) {
    var i = Pe
    ;((Pe = i !== 0 && 4 > i ? i : 4), e(!0))
    var l = Pa.transition
    Pa.transition = {}
    try {
      ;(e(!1), t())
    } finally {
      ;((Pe = i), (Pa.transition = l))
    }
  }
  function Ef() {
    return jt().memoizedState
  }
  function Vy(e, t, i) {
    var l = zn(e)
    if (
      ((i = {
        lane: l,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      _f(e))
    )
      bf(t, i)
    else if (((i = ef(e, t, i, l)), i !== null)) {
      var u = pt()
      ;(Wt(i, e, l, u), Cf(i, t, l))
    }
  }
  function qy(e, t, i) {
    var l = zn(e),
      u = {
        lane: l,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }
    if (_f(e)) bf(t, u)
    else {
      var d = e.alternate
      if (
        e.lanes === 0 &&
        (d === null || d.lanes === 0) &&
        ((d = t.lastRenderedReducer), d !== null)
      )
        try {
          var p = t.lastRenderedState,
            v = d(p, i)
          if (((u.hasEagerState = !0), (u.eagerState = v), $t(v, p))) {
            var x = t.interleaved
            ;(x === null
              ? ((u.next = u), Ea(t))
              : ((u.next = x.next), (x.next = u)),
              (t.interleaved = u))
            return
          }
        } catch {
        } finally {
        }
      ;((i = ef(e, t, u, l)),
        i !== null && ((u = pt()), Wt(i, e, l, u), Cf(i, t, l)))
    }
  }
  function _f(e) {
    var t = e.alternate
    return e === Be || (t !== null && t === Be)
  }
  function bf(e, t) {
    Xs = wo = !0
    var i = e.pending
    ;(i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
      (e.pending = t))
  }
  function Cf(e, t, i) {
    if ((i & 4194240) !== 0) {
      var l = t.lanes
      ;((l &= e.pendingLanes), (i |= l), (t.lanes = i), Ul(e, i))
    }
  }
  var ko = {
      readContext: Lt,
      useCallback: at,
      useContext: at,
      useEffect: at,
      useImperativeHandle: at,
      useInsertionEffect: at,
      useLayoutEffect: at,
      useMemo: at,
      useReducer: at,
      useRef: at,
      useState: at,
      useDebugValue: at,
      useDeferredValue: at,
      useTransition: at,
      useMutableSource: at,
      useSyncExternalStore: at,
      useId: at,
      unstable_isNewReconciler: !1,
    },
    Hy = {
      readContext: Lt,
      useCallback: function (e, t) {
        return ((tn().memoizedState = [e, t === void 0 ? null : t]), e)
      },
      useContext: Lt,
      useEffect: mf,
      useImperativeHandle: function (e, t, i) {
        return (
          (i = i != null ? i.concat([e]) : null),
          xo(4194308, 4, vf.bind(null, t, e), i)
        )
      },
      useLayoutEffect: function (e, t) {
        return xo(4194308, 4, e, t)
      },
      useInsertionEffect: function (e, t) {
        return xo(4, 2, e, t)
      },
      useMemo: function (e, t) {
        var i = tn()
        return (
          (t = t === void 0 ? null : t),
          (e = e()),
          (i.memoizedState = [e, t]),
          e
        )
      },
      useReducer: function (e, t, i) {
        var l = tn()
        return (
          (t = i !== void 0 ? i(t) : t),
          (l.memoizedState = l.baseState = t),
          (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
          (l.queue = e),
          (e = e.dispatch = Vy.bind(null, Be, e)),
          [l.memoizedState, e]
        )
      },
      useRef: function (e) {
        var t = tn()
        return ((e = { current: e }), (t.memoizedState = e))
      },
      useState: hf,
      useDebugValue: Da,
      useDeferredValue: function (e) {
        return (tn().memoizedState = e)
      },
      useTransition: function () {
        var e = hf(!1),
          t = e[0]
        return ((e = $y.bind(null, e[1])), (tn().memoizedState = e), [t, e])
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, i) {
        var l = Be,
          u = tn()
        if (Me) {
          if (i === void 0) throw Error(s(407))
          i = i()
        } else {
          if (((i = t()), Ze === null)) throw Error(s(349))
          ;(hr & 30) !== 0 || af(l, t, i)
        }
        u.memoizedState = i
        var d = { value: i, getSnapshot: t }
        return (
          (u.queue = d),
          mf(cf.bind(null, l, d, e), [e]),
          (l.flags |= 2048),
          ti(9, uf.bind(null, l, d, i, t), void 0, null),
          i
        )
      },
      useId: function () {
        var e = tn(),
          t = Ze.identifierPrefix
        if (Me) {
          var i = hn,
            l = fn
          ;((i = (l & ~(1 << (32 - Bt(l) - 1))).toString(32) + i),
            (t = ":" + t + "R" + i),
            (i = Zs++),
            0 < i && (t += "H" + i.toString(32)),
            (t += ":"))
        } else ((i = By++), (t = ":" + t + "r" + i.toString(32) + ":"))
        return (e.memoizedState = t)
      },
      unstable_isNewReconciler: !1,
    },
    Qy = {
      readContext: Lt,
      useCallback: xf,
      useContext: Lt,
      useEffect: Ia,
      useImperativeHandle: wf,
      useInsertionEffect: gf,
      useLayoutEffect: yf,
      useMemo: Sf,
      useReducer: La,
      useRef: pf,
      useState: function () {
        return La(ei)
      },
      useDebugValue: Da,
      useDeferredValue: function (e) {
        var t = jt()
        return kf(t, Ge.memoizedState, e)
      },
      useTransition: function () {
        var e = La(ei)[0],
          t = jt().memoizedState
        return [e, t]
      },
      useMutableSource: of,
      useSyncExternalStore: lf,
      useId: Ef,
      unstable_isNewReconciler: !1,
    },
    Wy = {
      readContext: Lt,
      useCallback: xf,
      useContext: Lt,
      useEffect: Ia,
      useImperativeHandle: wf,
      useInsertionEffect: gf,
      useLayoutEffect: yf,
      useMemo: Sf,
      useReducer: ja,
      useRef: pf,
      useState: function () {
        return ja(ei)
      },
      useDebugValue: Da,
      useDeferredValue: function (e) {
        var t = jt()
        return Ge === null ? (t.memoizedState = e) : kf(t, Ge.memoizedState, e)
      },
      useTransition: function () {
        var e = ja(ei)[0],
          t = jt().memoizedState
        return [e, t]
      },
      useMutableSource: of,
      useSyncExternalStore: lf,
      useId: Ef,
      unstable_isNewReconciler: !1,
    }
  function qt(e, t) {
    if (e && e.defaultProps) {
      ;((t = I({}, t)), (e = e.defaultProps))
      for (var i in e) t[i] === void 0 && (t[i] = e[i])
      return t
    }
    return t
  }
  function Fa(e, t, i, l) {
    ;((t = e.memoizedState),
      (i = i(l, t)),
      (i = i == null ? t : I({}, t, i)),
      (e.memoizedState = i),
      e.lanes === 0 && (e.updateQueue.baseState = i))
  }
  var Eo = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? or(e) === e : !1
    },
    enqueueSetState: function (e, t, i) {
      e = e._reactInternals
      var l = pt(),
        u = zn(e),
        d = mn(l, u)
      ;((d.payload = t),
        i != null && (d.callback = i),
        (t = Dn(e, d, u)),
        t !== null && (Wt(t, e, u, l), mo(t, e, u)))
    },
    enqueueReplaceState: function (e, t, i) {
      e = e._reactInternals
      var l = pt(),
        u = zn(e),
        d = mn(l, u)
      ;((d.tag = 1),
        (d.payload = t),
        i != null && (d.callback = i),
        (t = Dn(e, d, u)),
        t !== null && (Wt(t, e, u, l), mo(t, e, u)))
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals
      var i = pt(),
        l = zn(e),
        u = mn(i, l)
      ;((u.tag = 2),
        t != null && (u.callback = t),
        (t = Dn(e, u, l)),
        t !== null && (Wt(t, e, l, i), mo(t, e, l)))
    },
  }
  function Rf(e, t, i, l, u, d, p) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(l, d, p)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Bs(i, l) || !Bs(u, d)
          : !0
    )
  }
  function Tf(e, t, i) {
    var l = !1,
      u = Ln,
      d = t.contextType
    return (
      typeof d == "object" && d !== null
        ? (d = Lt(d))
        : ((u = yt(t) ? ar : lt.current),
          (l = t.contextTypes),
          (d = (l = l != null) ? Wr(e, u) : Ln)),
      (t = new t(i, d)),
      (e.memoizedState =
        t.state !== null && t.state !== void 0 ? t.state : null),
      (t.updater = Eo),
      (e.stateNode = t),
      (t._reactInternals = e),
      l &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = u),
        (e.__reactInternalMemoizedMaskedChildContext = d)),
      t
    )
  }
  function Pf(e, t, i, l) {
    ;((e = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(i, l),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(i, l),
      t.state !== e && Eo.enqueueReplaceState(t, t.state, null))
  }
  function Ua(e, t, i, l) {
    var u = e.stateNode
    ;((u.props = i), (u.state = e.memoizedState), (u.refs = {}), _a(e))
    var d = t.contextType
    ;(typeof d == "object" && d !== null
      ? (u.context = Lt(d))
      : ((d = yt(t) ? ar : lt.current), (u.context = Wr(e, d))),
      (u.state = e.memoizedState),
      (d = t.getDerivedStateFromProps),
      typeof d == "function" && (Fa(e, t, d, i), (u.state = e.memoizedState)),
      typeof t.getDerivedStateFromProps == "function" ||
        typeof u.getSnapshotBeforeUpdate == "function" ||
        (typeof u.UNSAFE_componentWillMount != "function" &&
          typeof u.componentWillMount != "function") ||
        ((t = u.state),
        typeof u.componentWillMount == "function" && u.componentWillMount(),
        typeof u.UNSAFE_componentWillMount == "function" &&
          u.UNSAFE_componentWillMount(),
        t !== u.state && Eo.enqueueReplaceState(u, u.state, null),
        go(e, i, u, l),
        (u.state = e.memoizedState)),
      typeof u.componentDidMount == "function" && (e.flags |= 4194308))
  }
  function ts(e, t) {
    try {
      var i = "",
        l = t
      do ((i += ae(l)), (l = l.return))
      while (l)
      var u = i
    } catch (d) {
      u =
        `
Error generating stack: ` +
        d.message +
        `
` +
        d.stack
    }
    return { value: e, source: t, stack: u, digest: null }
  }
  function Ma(e, t, i) {
    return { value: e, source: null, stack: i ?? null, digest: t ?? null }
  }
  function za(e, t) {
    try {
      console.error(t.value)
    } catch (i) {
      setTimeout(function () {
        throw i
      })
    }
  }
  var Ky = typeof WeakMap == "function" ? WeakMap : Map
  function Nf(e, t, i) {
    ;((i = mn(-1, i)), (i.tag = 3), (i.payload = { element: null }))
    var l = t.value
    return (
      (i.callback = function () {
        ;(No || ((No = !0), (tu = l)), za(e, t))
      }),
      i
    )
  }
  function Of(e, t, i) {
    ;((i = mn(-1, i)), (i.tag = 3))
    var l = e.type.getDerivedStateFromError
    if (typeof l == "function") {
      var u = t.value
      ;((i.payload = function () {
        return l(u)
      }),
        (i.callback = function () {
          za(e, t)
        }))
    }
    var d = e.stateNode
    return (
      d !== null &&
        typeof d.componentDidCatch == "function" &&
        (i.callback = function () {
          ;(za(e, t),
            typeof l != "function" &&
              (Un === null ? (Un = new Set([this])) : Un.add(this)))
          var p = t.stack
          this.componentDidCatch(t.value, {
            componentStack: p !== null ? p : "",
          })
        }),
      i
    )
  }
  function Af(e, t, i) {
    var l = e.pingCache
    if (l === null) {
      l = e.pingCache = new Ky()
      var u = new Set()
      l.set(t, u)
    } else ((u = l.get(t)), u === void 0 && ((u = new Set()), l.set(t, u)))
    u.has(i) || (u.add(i), (e = av.bind(null, e, t, i)), t.then(e, e))
  }
  function Lf(e) {
    do {
      var t
      if (
        ((t = e.tag === 13) &&
          ((t = e.memoizedState),
          (t = t !== null ? t.dehydrated !== null : !0)),
        t)
      )
        return e
      e = e.return
    } while (e !== null)
    return null
  }
  function jf(e, t, i, l, u) {
    return (e.mode & 1) === 0
      ? (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (i.flags |= 131072),
            (i.flags &= -52805),
            i.tag === 1 &&
              (i.alternate === null
                ? (i.tag = 17)
                : ((t = mn(-1, 1)), (t.tag = 2), Dn(i, t, 1))),
            (i.lanes |= 1)),
        e)
      : ((e.flags |= 65536), (e.lanes = u), e)
  }
  var Gy = j.ReactCurrentOwner,
    vt = !1
  function ht(e, t, i, l) {
    t.child = e === null ? Zd(t, null, i, l) : Jr(t, e.child, i, l)
  }
  function If(e, t, i, l, u) {
    i = i.render
    var d = t.ref
    return (
      Zr(t, u),
      (l = Oa(e, t, i, l, d, u)),
      (i = Aa()),
      e !== null && !vt
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~u),
          gn(e, t, u))
        : (Me && i && pa(t), (t.flags |= 1), ht(e, t, l, u), t.child)
    )
  }
  function Df(e, t, i, l, u) {
    if (e === null) {
      var d = i.type
      return typeof d == "function" &&
        !au(d) &&
        d.defaultProps === void 0 &&
        i.compare === null &&
        i.defaultProps === void 0
        ? ((t.tag = 15), (t.type = d), Ff(e, t, d, l, u))
        : ((e = Do(i.type, null, l, t, t.mode, u)),
          (e.ref = t.ref),
          (e.return = t),
          (t.child = e))
    }
    if (((d = e.child), (e.lanes & u) === 0)) {
      var p = d.memoizedProps
      if (
        ((i = i.compare), (i = i !== null ? i : Bs), i(p, l) && e.ref === t.ref)
      )
        return gn(e, t, u)
    }
    return (
      (t.flags |= 1),
      (e = $n(d, l)),
      (e.ref = t.ref),
      (e.return = t),
      (t.child = e)
    )
  }
  function Ff(e, t, i, l, u) {
    if (e !== null) {
      var d = e.memoizedProps
      if (Bs(d, l) && e.ref === t.ref)
        if (((vt = !1), (t.pendingProps = l = d), (e.lanes & u) !== 0))
          (e.flags & 131072) !== 0 && (vt = !0)
        else return ((t.lanes = e.lanes), gn(e, t, u))
    }
    return Ba(e, t, i, l, u)
  }
  function Uf(e, t, i) {
    var l = t.pendingProps,
      u = l.children,
      d = e !== null ? e.memoizedState : null
    if (l.mode === "hidden")
      if ((t.mode & 1) === 0)
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          Le(rs, Nt),
          (Nt |= i))
      else {
        if ((i & 1073741824) === 0)
          return (
            (e = d !== null ? d.baseLanes | i : i),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = {
              baseLanes: e,
              cachePool: null,
              transitions: null,
            }),
            (t.updateQueue = null),
            Le(rs, Nt),
            (Nt |= e),
            null
          )
        ;((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          (l = d !== null ? d.baseLanes : i),
          Le(rs, Nt),
          (Nt |= l))
      }
    else
      (d !== null ? ((l = d.baseLanes | i), (t.memoizedState = null)) : (l = i),
        Le(rs, Nt),
        (Nt |= l))
    return (ht(e, t, u, i), t.child)
  }
  function Mf(e, t) {
    var i = t.ref
    ;((e === null && i !== null) || (e !== null && e.ref !== i)) &&
      ((t.flags |= 512), (t.flags |= 2097152))
  }
  function Ba(e, t, i, l, u) {
    var d = yt(i) ? ar : lt.current
    return (
      (d = Wr(t, d)),
      Zr(t, u),
      (i = Oa(e, t, i, l, d, u)),
      (l = Aa()),
      e !== null && !vt
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~u),
          gn(e, t, u))
        : (Me && l && pa(t), (t.flags |= 1), ht(e, t, i, u), t.child)
    )
  }
  function zf(e, t, i, l, u) {
    if (yt(i)) {
      var d = !0
      oo(t)
    } else d = !1
    if ((Zr(t, u), t.stateNode === null))
      (bo(e, t), Tf(t, i, l), Ua(t, i, l, u), (l = !0))
    else if (e === null) {
      var p = t.stateNode,
        v = t.memoizedProps
      p.props = v
      var x = p.context,
        N = i.contextType
      typeof N == "object" && N !== null
        ? (N = Lt(N))
        : ((N = yt(i) ? ar : lt.current), (N = Wr(t, N)))
      var M = i.getDerivedStateFromProps,
        $ =
          typeof M == "function" ||
          typeof p.getSnapshotBeforeUpdate == "function"
      ;($ ||
        (typeof p.UNSAFE_componentWillReceiveProps != "function" &&
          typeof p.componentWillReceiveProps != "function") ||
        ((v !== l || x !== N) && Pf(t, p, l, N)),
        (In = !1))
      var U = t.memoizedState
      ;((p.state = U),
        go(t, l, p, u),
        (x = t.memoizedState),
        v !== l || U !== x || gt.current || In
          ? (typeof M == "function" && (Fa(t, i, M, l), (x = t.memoizedState)),
            (v = In || Rf(t, i, v, l, U, x, N))
              ? ($ ||
                  (typeof p.UNSAFE_componentWillMount != "function" &&
                    typeof p.componentWillMount != "function") ||
                  (typeof p.componentWillMount == "function" &&
                    p.componentWillMount(),
                  typeof p.UNSAFE_componentWillMount == "function" &&
                    p.UNSAFE_componentWillMount()),
                typeof p.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof p.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = l),
                (t.memoizedState = x)),
            (p.props = l),
            (p.state = x),
            (p.context = N),
            (l = v))
          : (typeof p.componentDidMount == "function" && (t.flags |= 4194308),
            (l = !1)))
    } else {
      ;((p = t.stateNode),
        tf(e, t),
        (v = t.memoizedProps),
        (N = t.type === t.elementType ? v : qt(t.type, v)),
        (p.props = N),
        ($ = t.pendingProps),
        (U = p.context),
        (x = i.contextType),
        typeof x == "object" && x !== null
          ? (x = Lt(x))
          : ((x = yt(i) ? ar : lt.current), (x = Wr(t, x))))
      var W = i.getDerivedStateFromProps
      ;((M =
        typeof W == "function" ||
        typeof p.getSnapshotBeforeUpdate == "function") ||
        (typeof p.UNSAFE_componentWillReceiveProps != "function" &&
          typeof p.componentWillReceiveProps != "function") ||
        ((v !== $ || U !== x) && Pf(t, p, l, x)),
        (In = !1),
        (U = t.memoizedState),
        (p.state = U),
        go(t, l, p, u))
      var J = t.memoizedState
      v !== $ || U !== J || gt.current || In
        ? (typeof W == "function" && (Fa(t, i, W, l), (J = t.memoizedState)),
          (N = In || Rf(t, i, N, l, U, J, x) || !1)
            ? (M ||
                (typeof p.UNSAFE_componentWillUpdate != "function" &&
                  typeof p.componentWillUpdate != "function") ||
                (typeof p.componentWillUpdate == "function" &&
                  p.componentWillUpdate(l, J, x),
                typeof p.UNSAFE_componentWillUpdate == "function" &&
                  p.UNSAFE_componentWillUpdate(l, J, x)),
              typeof p.componentDidUpdate == "function" && (t.flags |= 4),
              typeof p.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof p.componentDidUpdate != "function" ||
                (v === e.memoizedProps && U === e.memoizedState) ||
                (t.flags |= 4),
              typeof p.getSnapshotBeforeUpdate != "function" ||
                (v === e.memoizedProps && U === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = l),
              (t.memoizedState = J)),
          (p.props = l),
          (p.state = J),
          (p.context = x),
          (l = N))
        : (typeof p.componentDidUpdate != "function" ||
            (v === e.memoizedProps && U === e.memoizedState) ||
            (t.flags |= 4),
          typeof p.getSnapshotBeforeUpdate != "function" ||
            (v === e.memoizedProps && U === e.memoizedState) ||
            (t.flags |= 1024),
          (l = !1))
    }
    return $a(e, t, i, l, d, u)
  }
  function $a(e, t, i, l, u, d) {
    Mf(e, t)
    var p = (t.flags & 128) !== 0
    if (!l && !p) return (u && qd(t, i, !1), gn(e, t, d))
    ;((l = t.stateNode), (Gy.current = t))
    var v =
      p && typeof i.getDerivedStateFromError != "function" ? null : l.render()
    return (
      (t.flags |= 1),
      e !== null && p
        ? ((t.child = Jr(t, e.child, null, d)), (t.child = Jr(t, null, v, d)))
        : ht(e, t, v, d),
      (t.memoizedState = l.state),
      u && qd(t, i, !0),
      t.child
    )
  }
  function Bf(e) {
    var t = e.stateNode
    ;(t.pendingContext
      ? $d(e, t.pendingContext, t.pendingContext !== t.context)
      : t.context && $d(e, t.context, !1),
      ba(e, t.containerInfo))
  }
  function $f(e, t, i, l, u) {
    return (Yr(), va(u), (t.flags |= 256), ht(e, t, i, l), t.child)
  }
  var Va = { dehydrated: null, treeContext: null, retryLane: 0 }
  function qa(e) {
    return { baseLanes: e, cachePool: null, transitions: null }
  }
  function Vf(e, t, i) {
    var l = t.pendingProps,
      u = ze.current,
      d = !1,
      p = (t.flags & 128) !== 0,
      v
    if (
      ((v = p) ||
        (v = e !== null && e.memoizedState === null ? !1 : (u & 2) !== 0),
      v
        ? ((d = !0), (t.flags &= -129))
        : (e === null || e.memoizedState !== null) && (u |= 1),
      Le(ze, u & 1),
      e === null)
    )
      return (
        ya(t),
        (e = t.memoizedState),
        e !== null && ((e = e.dehydrated), e !== null)
          ? ((t.mode & 1) === 0
              ? (t.lanes = 1)
              : e.data === "$!"
                ? (t.lanes = 8)
                : (t.lanes = 1073741824),
            null)
          : ((p = l.children),
            (e = l.fallback),
            d
              ? ((l = t.mode),
                (d = t.child),
                (p = { mode: "hidden", children: p }),
                (l & 1) === 0 && d !== null
                  ? ((d.childLanes = 0), (d.pendingProps = p))
                  : (d = Fo(p, l, 0, null)),
                (e = vr(e, l, i, null)),
                (d.return = t),
                (e.return = t),
                (d.sibling = e),
                (t.child = d),
                (t.child.memoizedState = qa(i)),
                (t.memoizedState = Va),
                e)
              : Ha(t, p))
      )
    if (((u = e.memoizedState), u !== null && ((v = u.dehydrated), v !== null)))
      return Yy(e, t, p, l, v, u, i)
    if (d) {
      ;((d = l.fallback), (p = t.mode), (u = e.child), (v = u.sibling))
      var x = { mode: "hidden", children: l.children }
      return (
        (p & 1) === 0 && t.child !== u
          ? ((l = t.child),
            (l.childLanes = 0),
            (l.pendingProps = x),
            (t.deletions = null))
          : ((l = $n(u, x)), (l.subtreeFlags = u.subtreeFlags & 14680064)),
        v !== null ? (d = $n(v, d)) : ((d = vr(d, p, i, null)), (d.flags |= 2)),
        (d.return = t),
        (l.return = t),
        (l.sibling = d),
        (t.child = l),
        (l = d),
        (d = t.child),
        (p = e.child.memoizedState),
        (p =
          p === null
            ? qa(i)
            : {
                baseLanes: p.baseLanes | i,
                cachePool: null,
                transitions: p.transitions,
              }),
        (d.memoizedState = p),
        (d.childLanes = e.childLanes & ~i),
        (t.memoizedState = Va),
        l
      )
    }
    return (
      (d = e.child),
      (e = d.sibling),
      (l = $n(d, { mode: "visible", children: l.children })),
      (t.mode & 1) === 0 && (l.lanes = i),
      (l.return = t),
      (l.sibling = null),
      e !== null &&
        ((i = t.deletions),
        i === null ? ((t.deletions = [e]), (t.flags |= 16)) : i.push(e)),
      (t.child = l),
      (t.memoizedState = null),
      l
    )
  }
  function Ha(e, t) {
    return (
      (t = Fo({ mode: "visible", children: t }, e.mode, 0, null)),
      (t.return = e),
      (e.child = t)
    )
  }
  function _o(e, t, i, l) {
    return (
      l !== null && va(l),
      Jr(t, e.child, null, i),
      (e = Ha(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    )
  }
  function Yy(e, t, i, l, u, d, p) {
    if (i)
      return t.flags & 256
        ? ((t.flags &= -257), (l = Ma(Error(s(422)))), _o(e, t, p, l))
        : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((d = l.fallback),
            (u = t.mode),
            (l = Fo({ mode: "visible", children: l.children }, u, 0, null)),
            (d = vr(d, u, p, null)),
            (d.flags |= 2),
            (l.return = t),
            (d.return = t),
            (l.sibling = d),
            (t.child = l),
            (t.mode & 1) !== 0 && Jr(t, e.child, null, p),
            (t.child.memoizedState = qa(p)),
            (t.memoizedState = Va),
            d)
    if ((t.mode & 1) === 0) return _o(e, t, p, null)
    if (u.data === "$!") {
      if (((l = u.nextSibling && u.nextSibling.dataset), l)) var v = l.dgst
      return (
        (l = v),
        (d = Error(s(419))),
        (l = Ma(d, l, void 0)),
        _o(e, t, p, l)
      )
    }
    if (((v = (p & e.childLanes) !== 0), vt || v)) {
      if (((l = Ze), l !== null)) {
        switch (p & -p) {
          case 4:
            u = 2
            break
          case 16:
            u = 8
            break
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            u = 32
            break
          case 536870912:
            u = 268435456
            break
          default:
            u = 0
        }
        ;((u = (u & (l.suspendedLanes | p)) !== 0 ? 0 : u),
          u !== 0 &&
            u !== d.retryLane &&
            ((d.retryLane = u), pn(e, u), Wt(l, e, u, -1)))
      }
      return (lu(), (l = Ma(Error(s(421)))), _o(e, t, p, l))
    }
    return u.data === "$?"
      ? ((t.flags |= 128),
        (t.child = e.child),
        (t = uv.bind(null, e)),
        (u._reactRetry = t),
        null)
      : ((e = d.treeContext),
        (Pt = On(u.nextSibling)),
        (Tt = t),
        (Me = !0),
        (Vt = null),
        e !== null &&
          ((Ot[At++] = fn),
          (Ot[At++] = hn),
          (Ot[At++] = ur),
          (fn = e.id),
          (hn = e.overflow),
          (ur = t)),
        (t = Ha(t, l.children)),
        (t.flags |= 4096),
        t)
  }
  function qf(e, t, i) {
    e.lanes |= t
    var l = e.alternate
    ;(l !== null && (l.lanes |= t), ka(e.return, t, i))
  }
  function Qa(e, t, i, l, u) {
    var d = e.memoizedState
    d === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: l,
          tail: i,
          tailMode: u,
        })
      : ((d.isBackwards = t),
        (d.rendering = null),
        (d.renderingStartTime = 0),
        (d.last = l),
        (d.tail = i),
        (d.tailMode = u))
  }
  function Hf(e, t, i) {
    var l = t.pendingProps,
      u = l.revealOrder,
      d = l.tail
    if ((ht(e, t, l.children, i), (l = ze.current), (l & 2) !== 0))
      ((l = (l & 1) | 2), (t.flags |= 128))
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && qf(e, i, t)
          else if (e.tag === 19) qf(e, i, t)
          else if (e.child !== null) {
            ;((e.child.return = e), (e = e.child))
            continue
          }
          if (e === t) break e
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break e
            e = e.return
          }
          ;((e.sibling.return = e.return), (e = e.sibling))
        }
      l &= 1
    }
    if ((Le(ze, l), (t.mode & 1) === 0)) t.memoizedState = null
    else
      switch (u) {
        case "forwards":
          for (i = t.child, u = null; i !== null; )
            ((e = i.alternate),
              e !== null && yo(e) === null && (u = i),
              (i = i.sibling))
          ;((i = u),
            i === null
              ? ((u = t.child), (t.child = null))
              : ((u = i.sibling), (i.sibling = null)),
            Qa(t, !1, u, i, d))
          break
        case "backwards":
          for (i = null, u = t.child, t.child = null; u !== null; ) {
            if (((e = u.alternate), e !== null && yo(e) === null)) {
              t.child = u
              break
            }
            ;((e = u.sibling), (u.sibling = i), (i = u), (u = e))
          }
          Qa(t, !0, i, null, d)
          break
        case "together":
          Qa(t, !1, null, null, void 0)
          break
        default:
          t.memoizedState = null
      }
    return t.child
  }
  function bo(e, t) {
    ;(t.mode & 1) === 0 &&
      e !== null &&
      ((e.alternate = null), (t.alternate = null), (t.flags |= 2))
  }
  function gn(e, t, i) {
    if (
      (e !== null && (t.dependencies = e.dependencies),
      (pr |= t.lanes),
      (i & t.childLanes) === 0)
    )
      return null
    if (e !== null && t.child !== e.child) throw Error(s(153))
    if (t.child !== null) {
      for (
        e = t.child, i = $n(e, e.pendingProps), t.child = i, i.return = t;
        e.sibling !== null;
      )
        ((e = e.sibling),
          (i = i.sibling = $n(e, e.pendingProps)),
          (i.return = t))
      i.sibling = null
    }
    return t.child
  }
  function Jy(e, t, i) {
    switch (t.tag) {
      case 3:
        ;(Bf(t), Yr())
        break
      case 5:
        sf(t)
        break
      case 1:
        yt(t.type) && oo(t)
        break
      case 4:
        ba(t, t.stateNode.containerInfo)
        break
      case 10:
        var l = t.type._context,
          u = t.memoizedProps.value
        ;(Le(ho, l._currentValue), (l._currentValue = u))
        break
      case 13:
        if (((l = t.memoizedState), l !== null))
          return l.dehydrated !== null
            ? (Le(ze, ze.current & 1), (t.flags |= 128), null)
            : (i & t.child.childLanes) !== 0
              ? Vf(e, t, i)
              : (Le(ze, ze.current & 1),
                (e = gn(e, t, i)),
                e !== null ? e.sibling : null)
        Le(ze, ze.current & 1)
        break
      case 19:
        if (((l = (i & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
          if (l) return Hf(e, t, i)
          t.flags |= 128
        }
        if (
          ((u = t.memoizedState),
          u !== null &&
            ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          Le(ze, ze.current),
          l)
        )
          break
        return null
      case 22:
      case 23:
        return ((t.lanes = 0), Uf(e, t, i))
    }
    return gn(e, t, i)
  }
  var Qf, Wa, Wf, Kf
  ;((Qf = function (e, t) {
    for (var i = t.child; i !== null; ) {
      if (i.tag === 5 || i.tag === 6) e.appendChild(i.stateNode)
      else if (i.tag !== 4 && i.child !== null) {
        ;((i.child.return = i), (i = i.child))
        continue
      }
      if (i === t) break
      for (; i.sibling === null; ) {
        if (i.return === null || i.return === t) return
        i = i.return
      }
      ;((i.sibling.return = i.return), (i = i.sibling))
    }
  }),
    (Wa = function () {}),
    (Wf = function (e, t, i, l) {
      var u = e.memoizedProps
      if (u !== l) {
        ;((e = t.stateNode), fr(en.current))
        var d = null
        switch (i) {
          case "input":
            ;((u = _n(e, u)), (l = _n(e, l)), (d = []))
            break
          case "select":
            ;((u = I({}, u, { value: void 0 })),
              (l = I({}, l, { value: void 0 })),
              (d = []))
            break
          case "textarea":
            ;((u = bl(e, u)), (l = bl(e, l)), (d = []))
            break
          default:
            typeof u.onClick != "function" &&
              typeof l.onClick == "function" &&
              (e.onclick = ro)
        }
        Rl(i, l)
        var p
        i = null
        for (N in u)
          if (!l.hasOwnProperty(N) && u.hasOwnProperty(N) && u[N] != null)
            if (N === "style") {
              var v = u[N]
              for (p in v) v.hasOwnProperty(p) && (i || (i = {}), (i[p] = ""))
            } else
              N !== "dangerouslySetInnerHTML" &&
                N !== "children" &&
                N !== "suppressContentEditableWarning" &&
                N !== "suppressHydrationWarning" &&
                N !== "autoFocus" &&
                (a.hasOwnProperty(N)
                  ? d || (d = [])
                  : (d = d || []).push(N, null))
        for (N in l) {
          var x = l[N]
          if (
            ((v = u != null ? u[N] : void 0),
            l.hasOwnProperty(N) && x !== v && (x != null || v != null))
          )
            if (N === "style")
              if (v) {
                for (p in v)
                  !v.hasOwnProperty(p) ||
                    (x && x.hasOwnProperty(p)) ||
                    (i || (i = {}), (i[p] = ""))
                for (p in x)
                  x.hasOwnProperty(p) &&
                    v[p] !== x[p] &&
                    (i || (i = {}), (i[p] = x[p]))
              } else (i || (d || (d = []), d.push(N, i)), (i = x))
            else
              N === "dangerouslySetInnerHTML"
                ? ((x = x ? x.__html : void 0),
                  (v = v ? v.__html : void 0),
                  x != null && v !== x && (d = d || []).push(N, x))
                : N === "children"
                  ? (typeof x != "string" && typeof x != "number") ||
                    (d = d || []).push(N, "" + x)
                  : N !== "suppressContentEditableWarning" &&
                    N !== "suppressHydrationWarning" &&
                    (a.hasOwnProperty(N)
                      ? (x != null && N === "onScroll" && Fe("scroll", e),
                        d || v === x || (d = []))
                      : (d = d || []).push(N, x))
        }
        i && (d = d || []).push("style", i)
        var N = d
        ;(t.updateQueue = N) && (t.flags |= 4)
      }
    }),
    (Kf = function (e, t, i, l) {
      i !== l && (t.flags |= 4)
    }))
  function ni(e, t) {
    if (!Me)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail
          for (var i = null; t !== null; )
            (t.alternate !== null && (i = t), (t = t.sibling))
          i === null ? (e.tail = null) : (i.sibling = null)
          break
        case "collapsed":
          i = e.tail
          for (var l = null; i !== null; )
            (i.alternate !== null && (l = i), (i = i.sibling))
          l === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (l.sibling = null)
      }
  }
  function ut(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      i = 0,
      l = 0
    if (t)
      for (var u = e.child; u !== null; )
        ((i |= u.lanes | u.childLanes),
          (l |= u.subtreeFlags & 14680064),
          (l |= u.flags & 14680064),
          (u.return = e),
          (u = u.sibling))
    else
      for (u = e.child; u !== null; )
        ((i |= u.lanes | u.childLanes),
          (l |= u.subtreeFlags),
          (l |= u.flags),
          (u.return = e),
          (u = u.sibling))
    return ((e.subtreeFlags |= l), (e.childLanes = i), t)
  }
  function Xy(e, t, i) {
    var l = t.pendingProps
    switch ((ma(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (ut(t), null)
      case 1:
        return (yt(t.type) && io(), ut(t), null)
      case 3:
        return (
          (l = t.stateNode),
          es(),
          Ue(gt),
          Ue(lt),
          Ta(),
          l.pendingContext &&
            ((l.context = l.pendingContext), (l.pendingContext = null)),
          (e === null || e.child === null) &&
            (co(t)
              ? (t.flags |= 4)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Vt !== null && (su(Vt), (Vt = null)))),
          Wa(e, t),
          ut(t),
          null
        )
      case 5:
        Ca(t)
        var u = fr(Js.current)
        if (((i = t.type), e !== null && t.stateNode != null))
          (Wf(e, t, i, l, u),
            e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)))
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(s(166))
            return (ut(t), null)
          }
          if (((e = fr(en.current)), co(t))) {
            ;((l = t.stateNode), (i = t.type))
            var d = t.memoizedProps
            switch (((l[Zt] = t), (l[Qs] = d), (e = (t.mode & 1) !== 0), i)) {
              case "dialog":
                ;(Fe("cancel", l), Fe("close", l))
                break
              case "iframe":
              case "object":
              case "embed":
                Fe("load", l)
                break
              case "video":
              case "audio":
                for (u = 0; u < Vs.length; u++) Fe(Vs[u], l)
                break
              case "source":
                Fe("error", l)
                break
              case "img":
              case "image":
              case "link":
                ;(Fe("error", l), Fe("load", l))
                break
              case "details":
                Fe("toggle", l)
                break
              case "input":
                ;(Rc(l, d), Fe("invalid", l))
                break
              case "select":
                ;((l._wrapperState = { wasMultiple: !!d.multiple }),
                  Fe("invalid", l))
                break
              case "textarea":
                ;(Nc(l, d), Fe("invalid", l))
            }
            ;(Rl(i, d), (u = null))
            for (var p in d)
              if (d.hasOwnProperty(p)) {
                var v = d[p]
                p === "children"
                  ? typeof v == "string"
                    ? l.textContent !== v &&
                      (d.suppressHydrationWarning !== !0 &&
                        no(l.textContent, v, e),
                      (u = ["children", v]))
                    : typeof v == "number" &&
                      l.textContent !== "" + v &&
                      (d.suppressHydrationWarning !== !0 &&
                        no(l.textContent, v, e),
                      (u = ["children", "" + v]))
                  : a.hasOwnProperty(p) &&
                    v != null &&
                    p === "onScroll" &&
                    Fe("scroll", l)
              }
            switch (i) {
              case "input":
                ;(un(l), Pc(l, d, !0))
                break
              case "textarea":
                ;(un(l), Ac(l))
                break
              case "select":
              case "option":
                break
              default:
                typeof d.onClick == "function" && (l.onclick = ro)
            }
            ;((l = u), (t.updateQueue = l), l !== null && (t.flags |= 4))
          } else {
            ;((p = u.nodeType === 9 ? u : u.ownerDocument),
              e === "http://www.w3.org/1999/xhtml" && (e = Lc(i)),
              e === "http://www.w3.org/1999/xhtml"
                ? i === "script"
                  ? ((e = p.createElement("div")),
                    (e.innerHTML = "<script><\/script>"),
                    (e = e.removeChild(e.firstChild)))
                  : typeof l.is == "string"
                    ? (e = p.createElement(i, { is: l.is }))
                    : ((e = p.createElement(i)),
                      i === "select" &&
                        ((p = e),
                        l.multiple
                          ? (p.multiple = !0)
                          : l.size && (p.size = l.size)))
                : (e = p.createElementNS(e, i)),
              (e[Zt] = t),
              (e[Qs] = l),
              Qf(e, t, !1, !1),
              (t.stateNode = e))
            e: {
              switch (((p = Tl(i, l)), i)) {
                case "dialog":
                  ;(Fe("cancel", e), Fe("close", e), (u = l))
                  break
                case "iframe":
                case "object":
                case "embed":
                  ;(Fe("load", e), (u = l))
                  break
                case "video":
                case "audio":
                  for (u = 0; u < Vs.length; u++) Fe(Vs[u], e)
                  u = l
                  break
                case "source":
                  ;(Fe("error", e), (u = l))
                  break
                case "img":
                case "image":
                case "link":
                  ;(Fe("error", e), Fe("load", e), (u = l))
                  break
                case "details":
                  ;(Fe("toggle", e), (u = l))
                  break
                case "input":
                  ;(Rc(e, l), (u = _n(e, l)), Fe("invalid", e))
                  break
                case "option":
                  u = l
                  break
                case "select":
                  ;((e._wrapperState = { wasMultiple: !!l.multiple }),
                    (u = I({}, l, { value: void 0 })),
                    Fe("invalid", e))
                  break
                case "textarea":
                  ;(Nc(e, l), (u = bl(e, l)), Fe("invalid", e))
                  break
                default:
                  u = l
              }
              ;(Rl(i, u), (v = u))
              for (d in v)
                if (v.hasOwnProperty(d)) {
                  var x = v[d]
                  d === "style"
                    ? Dc(e, x)
                    : d === "dangerouslySetInnerHTML"
                      ? ((x = x ? x.__html : void 0), x != null && jc(e, x))
                      : d === "children"
                        ? typeof x == "string"
                          ? (i !== "textarea" || x !== "") && _s(e, x)
                          : typeof x == "number" && _s(e, "" + x)
                        : d !== "suppressContentEditableWarning" &&
                          d !== "suppressHydrationWarning" &&
                          d !== "autoFocus" &&
                          (a.hasOwnProperty(d)
                            ? x != null && d === "onScroll" && Fe("scroll", e)
                            : x != null && B(e, d, x, p))
                }
              switch (i) {
                case "input":
                  ;(un(e), Pc(e, l, !1))
                  break
                case "textarea":
                  ;(un(e), Ac(e))
                  break
                case "option":
                  l.value != null && e.setAttribute("value", "" + be(l.value))
                  break
                case "select":
                  ;((e.multiple = !!l.multiple),
                    (d = l.value),
                    d != null
                      ? Ir(e, !!l.multiple, d, !1)
                      : l.defaultValue != null &&
                        Ir(e, !!l.multiple, l.defaultValue, !0))
                  break
                default:
                  typeof u.onClick == "function" && (e.onclick = ro)
              }
              switch (i) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  l = !!l.autoFocus
                  break e
                case "img":
                  l = !0
                  break e
                default:
                  l = !1
              }
            }
            l && (t.flags |= 4)
          }
          t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152))
        }
        return (ut(t), null)
      case 6:
        if (e && t.stateNode != null) Kf(e, t, e.memoizedProps, l)
        else {
          if (typeof l != "string" && t.stateNode === null) throw Error(s(166))
          if (((i = fr(Js.current)), fr(en.current), co(t))) {
            if (
              ((l = t.stateNode),
              (i = t.memoizedProps),
              (l[Zt] = t),
              (d = l.nodeValue !== i) && ((e = Tt), e !== null))
            )
              switch (e.tag) {
                case 3:
                  no(l.nodeValue, i, (e.mode & 1) !== 0)
                  break
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 &&
                    no(l.nodeValue, i, (e.mode & 1) !== 0)
              }
            d && (t.flags |= 4)
          } else
            ((l = (i.nodeType === 9 ? i : i.ownerDocument).createTextNode(l)),
              (l[Zt] = t),
              (t.stateNode = l))
        }
        return (ut(t), null)
      case 13:
        if (
          (Ue(ze),
          (l = t.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (Me && Pt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
            (Yd(), Yr(), (t.flags |= 98560), (d = !1))
          else if (((d = co(t)), l !== null && l.dehydrated !== null)) {
            if (e === null) {
              if (!d) throw Error(s(318))
              if (
                ((d = t.memoizedState),
                (d = d !== null ? d.dehydrated : null),
                !d)
              )
                throw Error(s(317))
              d[Zt] = t
            } else
              (Yr(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4))
            ;(ut(t), (d = !1))
          } else (Vt !== null && (su(Vt), (Vt = null)), (d = !0))
          if (!d) return t.flags & 65536 ? t : null
        }
        return (t.flags & 128) !== 0
          ? ((t.lanes = i), t)
          : ((l = l !== null),
            l !== (e !== null && e.memoizedState !== null) &&
              l &&
              ((t.child.flags |= 8192),
              (t.mode & 1) !== 0 &&
                (e === null || (ze.current & 1) !== 0
                  ? Ye === 0 && (Ye = 3)
                  : lu())),
            t.updateQueue !== null && (t.flags |= 4),
            ut(t),
            null)
      case 4:
        return (
          es(),
          Wa(e, t),
          e === null && qs(t.stateNode.containerInfo),
          ut(t),
          null
        )
      case 10:
        return (Sa(t.type._context), ut(t), null)
      case 17:
        return (yt(t.type) && io(), ut(t), null)
      case 19:
        if ((Ue(ze), (d = t.memoizedState), d === null)) return (ut(t), null)
        if (((l = (t.flags & 128) !== 0), (p = d.rendering), p === null))
          if (l) ni(d, !1)
          else {
            if (Ye !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((p = yo(e)), p !== null)) {
                  for (
                    t.flags |= 128,
                      ni(d, !1),
                      l = p.updateQueue,
                      l !== null && ((t.updateQueue = l), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      l = i,
                      i = t.child;
                    i !== null;
                  )
                    ((d = i),
                      (e = l),
                      (d.flags &= 14680066),
                      (p = d.alternate),
                      p === null
                        ? ((d.childLanes = 0),
                          (d.lanes = e),
                          (d.child = null),
                          (d.subtreeFlags = 0),
                          (d.memoizedProps = null),
                          (d.memoizedState = null),
                          (d.updateQueue = null),
                          (d.dependencies = null),
                          (d.stateNode = null))
                        : ((d.childLanes = p.childLanes),
                          (d.lanes = p.lanes),
                          (d.child = p.child),
                          (d.subtreeFlags = 0),
                          (d.deletions = null),
                          (d.memoizedProps = p.memoizedProps),
                          (d.memoizedState = p.memoizedState),
                          (d.updateQueue = p.updateQueue),
                          (d.type = p.type),
                          (e = p.dependencies),
                          (d.dependencies =
                            e === null
                              ? null
                              : {
                                  lanes: e.lanes,
                                  firstContext: e.firstContext,
                                })),
                      (i = i.sibling))
                  return (Le(ze, (ze.current & 1) | 2), t.child)
                }
                e = e.sibling
              }
            d.tail !== null &&
              qe() > ss &&
              ((t.flags |= 128), (l = !0), ni(d, !1), (t.lanes = 4194304))
          }
        else {
          if (!l)
            if (((e = yo(p)), e !== null)) {
              if (
                ((t.flags |= 128),
                (l = !0),
                (i = e.updateQueue),
                i !== null && ((t.updateQueue = i), (t.flags |= 4)),
                ni(d, !0),
                d.tail === null &&
                  d.tailMode === "hidden" &&
                  !p.alternate &&
                  !Me)
              )
                return (ut(t), null)
            } else
              2 * qe() - d.renderingStartTime > ss &&
                i !== 1073741824 &&
                ((t.flags |= 128), (l = !0), ni(d, !1), (t.lanes = 4194304))
          d.isBackwards
            ? ((p.sibling = t.child), (t.child = p))
            : ((i = d.last),
              i !== null ? (i.sibling = p) : (t.child = p),
              (d.last = p))
        }
        return d.tail !== null
          ? ((t = d.tail),
            (d.rendering = t),
            (d.tail = t.sibling),
            (d.renderingStartTime = qe()),
            (t.sibling = null),
            (i = ze.current),
            Le(ze, l ? (i & 1) | 2 : i & 1),
            t)
          : (ut(t), null)
      case 22:
      case 23:
        return (
          ou(),
          (l = t.memoizedState !== null),
          e !== null && (e.memoizedState !== null) !== l && (t.flags |= 8192),
          l && (t.mode & 1) !== 0
            ? (Nt & 1073741824) !== 0 &&
              (ut(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : ut(t),
          null
        )
      case 24:
        return null
      case 25:
        return null
    }
    throw Error(s(156, t.tag))
  }
  function Zy(e, t) {
    switch ((ma(t), t.tag)) {
      case 1:
        return (
          yt(t.type) && io(),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        )
      case 3:
        return (
          es(),
          Ue(gt),
          Ue(lt),
          Ta(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((t.flags = (e & -65537) | 128), t)
            : null
        )
      case 5:
        return (Ca(t), null)
      case 13:
        if (
          (Ue(ze), (e = t.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(s(340))
          Yr()
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        )
      case 19:
        return (Ue(ze), null)
      case 4:
        return (es(), null)
      case 10:
        return (Sa(t.type._context), null)
      case 22:
      case 23:
        return (ou(), null)
      case 24:
        return null
      default:
        return null
    }
  }
  var Co = !1,
    ct = !1,
    ev = typeof WeakSet == "function" ? WeakSet : Set,
    Y = null
  function ns(e, t) {
    var i = e.ref
    if (i !== null)
      if (typeof i == "function")
        try {
          i(null)
        } catch (l) {
          $e(e, t, l)
        }
      else i.current = null
  }
  function Ka(e, t, i) {
    try {
      i()
    } catch (l) {
      $e(e, t, l)
    }
  }
  var Gf = !1
  function tv(e, t) {
    if (((oa = Hi), (e = Cd()), Xl(e))) {
      if ("selectionStart" in e)
        var i = { start: e.selectionStart, end: e.selectionEnd }
      else
        e: {
          i = ((i = e.ownerDocument) && i.defaultView) || window
          var l = i.getSelection && i.getSelection()
          if (l && l.rangeCount !== 0) {
            i = l.anchorNode
            var u = l.anchorOffset,
              d = l.focusNode
            l = l.focusOffset
            try {
              ;(i.nodeType, d.nodeType)
            } catch {
              i = null
              break e
            }
            var p = 0,
              v = -1,
              x = -1,
              N = 0,
              M = 0,
              $ = e,
              U = null
            t: for (;;) {
              for (
                var W;
                $ !== i || (u !== 0 && $.nodeType !== 3) || (v = p + u),
                  $ !== d || (l !== 0 && $.nodeType !== 3) || (x = p + l),
                  $.nodeType === 3 && (p += $.nodeValue.length),
                  (W = $.firstChild) !== null;
              )
                ((U = $), ($ = W))
              for (;;) {
                if ($ === e) break t
                if (
                  (U === i && ++N === u && (v = p),
                  U === d && ++M === l && (x = p),
                  (W = $.nextSibling) !== null)
                )
                  break
                ;(($ = U), (U = $.parentNode))
              }
              $ = W
            }
            i = v === -1 || x === -1 ? null : { start: v, end: x }
          } else i = null
        }
      i = i || { start: 0, end: 0 }
    } else i = null
    for (
      la = { focusedElem: e, selectionRange: i }, Hi = !1, Y = t;
      Y !== null;
    )
      if (((t = Y), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (Y = e))
      else
        for (; Y !== null; ) {
          t = Y
          try {
            var J = t.alternate
            if ((t.flags & 1024) !== 0)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  break
                case 1:
                  if (J !== null) {
                    var ee = J.memoizedProps,
                      He = J.memoizedState,
                      T = t.stateNode,
                      _ = T.getSnapshotBeforeUpdate(
                        t.elementType === t.type ? ee : qt(t.type, ee),
                        He,
                      )
                    T.__reactInternalSnapshotBeforeUpdate = _
                  }
                  break
                case 3:
                  var P = t.stateNode.containerInfo
                  P.nodeType === 1
                    ? (P.textContent = "")
                    : P.nodeType === 9 &&
                      P.documentElement &&
                      P.removeChild(P.documentElement)
                  break
                case 5:
                case 6:
                case 4:
                case 17:
                  break
                default:
                  throw Error(s(163))
              }
          } catch (V) {
            $e(t, t.return, V)
          }
          if (((e = t.sibling), e !== null)) {
            ;((e.return = t.return), (Y = e))
            break
          }
          Y = t.return
        }
    return ((J = Gf), (Gf = !1), J)
  }
  function ri(e, t, i) {
    var l = t.updateQueue
    if (((l = l !== null ? l.lastEffect : null), l !== null)) {
      var u = (l = l.next)
      do {
        if ((u.tag & e) === e) {
          var d = u.destroy
          ;((u.destroy = void 0), d !== void 0 && Ka(t, i, d))
        }
        u = u.next
      } while (u !== l)
    }
  }
  function Ro(e, t) {
    if (
      ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
    ) {
      var i = (t = t.next)
      do {
        if ((i.tag & e) === e) {
          var l = i.create
          i.destroy = l()
        }
        i = i.next
      } while (i !== t)
    }
  }
  function Ga(e) {
    var t = e.ref
    if (t !== null) {
      var i = e.stateNode
      switch (e.tag) {
        case 5:
          e = i
          break
        default:
          e = i
      }
      typeof t == "function" ? t(e) : (t.current = e)
    }
  }
  function Yf(e) {
    var t = e.alternate
    ;(t !== null && ((e.alternate = null), Yf(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 &&
        ((t = e.stateNode),
        t !== null &&
          (delete t[Zt],
          delete t[Qs],
          delete t[da],
          delete t[Fy],
          delete t[Uy])),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null))
  }
  function Jf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4
  }
  function Xf(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || Jf(e.return)) return null
        e = e.return
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e
        ;((e.child.return = e), (e = e.child))
      }
      if (!(e.flags & 2)) return e.stateNode
    }
  }
  function Ya(e, t, i) {
    var l = e.tag
    if (l === 5 || l === 6)
      ((e = e.stateNode),
        t
          ? i.nodeType === 8
            ? i.parentNode.insertBefore(e, t)
            : i.insertBefore(e, t)
          : (i.nodeType === 8
              ? ((t = i.parentNode), t.insertBefore(e, i))
              : ((t = i), t.appendChild(e)),
            (i = i._reactRootContainer),
            i != null || t.onclick !== null || (t.onclick = ro)))
    else if (l !== 4 && ((e = e.child), e !== null))
      for (Ya(e, t, i), e = e.sibling; e !== null; )
        (Ya(e, t, i), (e = e.sibling))
  }
  function Ja(e, t, i) {
    var l = e.tag
    if (l === 5 || l === 6)
      ((e = e.stateNode), t ? i.insertBefore(e, t) : i.appendChild(e))
    else if (l !== 4 && ((e = e.child), e !== null))
      for (Ja(e, t, i), e = e.sibling; e !== null; )
        (Ja(e, t, i), (e = e.sibling))
  }
  var nt = null,
    Ht = !1
  function Fn(e, t, i) {
    for (i = i.child; i !== null; ) (Zf(e, t, i), (i = i.sibling))
  }
  function Zf(e, t, i) {
    if (Xt && typeof Xt.onCommitFiberUnmount == "function")
      try {
        Xt.onCommitFiberUnmount(Mi, i)
      } catch {}
    switch (i.tag) {
      case 5:
        ct || ns(i, t)
      case 6:
        var l = nt,
          u = Ht
        ;((nt = null),
          Fn(e, t, i),
          (nt = l),
          (Ht = u),
          nt !== null &&
            (Ht
              ? ((e = nt),
                (i = i.stateNode),
                e.nodeType === 8
                  ? e.parentNode.removeChild(i)
                  : e.removeChild(i))
              : nt.removeChild(i.stateNode)))
        break
      case 18:
        nt !== null &&
          (Ht
            ? ((e = nt),
              (i = i.stateNode),
              e.nodeType === 8
                ? ca(e.parentNode, i)
                : e.nodeType === 1 && ca(e, i),
              Is(e))
            : ca(nt, i.stateNode))
        break
      case 4:
        ;((l = nt),
          (u = Ht),
          (nt = i.stateNode.containerInfo),
          (Ht = !0),
          Fn(e, t, i),
          (nt = l),
          (Ht = u))
        break
      case 0:
      case 11:
      case 14:
      case 15:
        if (
          !ct &&
          ((l = i.updateQueue), l !== null && ((l = l.lastEffect), l !== null))
        ) {
          u = l = l.next
          do {
            var d = u,
              p = d.destroy
            ;((d = d.tag),
              p !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && Ka(i, t, p),
              (u = u.next))
          } while (u !== l)
        }
        Fn(e, t, i)
        break
      case 1:
        if (
          !ct &&
          (ns(i, t),
          (l = i.stateNode),
          typeof l.componentWillUnmount == "function")
        )
          try {
            ;((l.props = i.memoizedProps),
              (l.state = i.memoizedState),
              l.componentWillUnmount())
          } catch (v) {
            $e(i, t, v)
          }
        Fn(e, t, i)
        break
      case 21:
        Fn(e, t, i)
        break
      case 22:
        i.mode & 1
          ? ((ct = (l = ct) || i.memoizedState !== null), Fn(e, t, i), (ct = l))
          : Fn(e, t, i)
        break
      default:
        Fn(e, t, i)
    }
  }
  function eh(e) {
    var t = e.updateQueue
    if (t !== null) {
      e.updateQueue = null
      var i = e.stateNode
      ;(i === null && (i = e.stateNode = new ev()),
        t.forEach(function (l) {
          var u = cv.bind(null, e, l)
          i.has(l) || (i.add(l), l.then(u, u))
        }))
    }
  }
  function Qt(e, t) {
    var i = t.deletions
    if (i !== null)
      for (var l = 0; l < i.length; l++) {
        var u = i[l]
        try {
          var d = e,
            p = t,
            v = p
          e: for (; v !== null; ) {
            switch (v.tag) {
              case 5:
                ;((nt = v.stateNode), (Ht = !1))
                break e
              case 3:
                ;((nt = v.stateNode.containerInfo), (Ht = !0))
                break e
              case 4:
                ;((nt = v.stateNode.containerInfo), (Ht = !0))
                break e
            }
            v = v.return
          }
          if (nt === null) throw Error(s(160))
          ;(Zf(d, p, u), (nt = null), (Ht = !1))
          var x = u.alternate
          ;(x !== null && (x.return = null), (u.return = null))
        } catch (N) {
          $e(u, t, N)
        }
      }
    if (t.subtreeFlags & 12854)
      for (t = t.child; t !== null; ) (th(t, e), (t = t.sibling))
  }
  function th(e, t) {
    var i = e.alternate,
      l = e.flags
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((Qt(t, e), nn(e), l & 4)) {
          try {
            ;(ri(3, e, e.return), Ro(3, e))
          } catch (ee) {
            $e(e, e.return, ee)
          }
          try {
            ri(5, e, e.return)
          } catch (ee) {
            $e(e, e.return, ee)
          }
        }
        break
      case 1:
        ;(Qt(t, e), nn(e), l & 512 && i !== null && ns(i, i.return))
        break
      case 5:
        if (
          (Qt(t, e),
          nn(e),
          l & 512 && i !== null && ns(i, i.return),
          e.flags & 32)
        ) {
          var u = e.stateNode
          try {
            _s(u, "")
          } catch (ee) {
            $e(e, e.return, ee)
          }
        }
        if (l & 4 && ((u = e.stateNode), u != null)) {
          var d = e.memoizedProps,
            p = i !== null ? i.memoizedProps : d,
            v = e.type,
            x = e.updateQueue
          if (((e.updateQueue = null), x !== null))
            try {
              ;(v === "input" &&
                d.type === "radio" &&
                d.name != null &&
                Tc(u, d),
                Tl(v, p))
              var N = Tl(v, d)
              for (p = 0; p < x.length; p += 2) {
                var M = x[p],
                  $ = x[p + 1]
                M === "style"
                  ? Dc(u, $)
                  : M === "dangerouslySetInnerHTML"
                    ? jc(u, $)
                    : M === "children"
                      ? _s(u, $)
                      : B(u, M, $, N)
              }
              switch (v) {
                case "input":
                  El(u, d)
                  break
                case "textarea":
                  Oc(u, d)
                  break
                case "select":
                  var U = u._wrapperState.wasMultiple
                  u._wrapperState.wasMultiple = !!d.multiple
                  var W = d.value
                  W != null
                    ? Ir(u, !!d.multiple, W, !1)
                    : U !== !!d.multiple &&
                      (d.defaultValue != null
                        ? Ir(u, !!d.multiple, d.defaultValue, !0)
                        : Ir(u, !!d.multiple, d.multiple ? [] : "", !1))
              }
              u[Qs] = d
            } catch (ee) {
              $e(e, e.return, ee)
            }
        }
        break
      case 6:
        if ((Qt(t, e), nn(e), l & 4)) {
          if (e.stateNode === null) throw Error(s(162))
          ;((u = e.stateNode), (d = e.memoizedProps))
          try {
            u.nodeValue = d
          } catch (ee) {
            $e(e, e.return, ee)
          }
        }
        break
      case 3:
        if (
          (Qt(t, e), nn(e), l & 4 && i !== null && i.memoizedState.isDehydrated)
        )
          try {
            Is(t.containerInfo)
          } catch (ee) {
            $e(e, e.return, ee)
          }
        break
      case 4:
        ;(Qt(t, e), nn(e))
        break
      case 13:
        ;(Qt(t, e),
          nn(e),
          (u = e.child),
          u.flags & 8192 &&
            ((d = u.memoizedState !== null),
            (u.stateNode.isHidden = d),
            !d ||
              (u.alternate !== null && u.alternate.memoizedState !== null) ||
              (eu = qe())),
          l & 4 && eh(e))
        break
      case 22:
        if (
          ((M = i !== null && i.memoizedState !== null),
          e.mode & 1 ? ((ct = (N = ct) || M), Qt(t, e), (ct = N)) : Qt(t, e),
          nn(e),
          l & 8192)
        ) {
          if (
            ((N = e.memoizedState !== null),
            (e.stateNode.isHidden = N) && !M && (e.mode & 1) !== 0)
          )
            for (Y = e, M = e.child; M !== null; ) {
              for ($ = Y = M; Y !== null; ) {
                switch (((U = Y), (W = U.child), U.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    ri(4, U, U.return)
                    break
                  case 1:
                    ns(U, U.return)
                    var J = U.stateNode
                    if (typeof J.componentWillUnmount == "function") {
                      ;((l = U), (i = U.return))
                      try {
                        ;((t = l),
                          (J.props = t.memoizedProps),
                          (J.state = t.memoizedState),
                          J.componentWillUnmount())
                      } catch (ee) {
                        $e(l, i, ee)
                      }
                    }
                    break
                  case 5:
                    ns(U, U.return)
                    break
                  case 22:
                    if (U.memoizedState !== null) {
                      sh($)
                      continue
                    }
                }
                W !== null ? ((W.return = U), (Y = W)) : sh($)
              }
              M = M.sibling
            }
          e: for (M = null, $ = e; ; ) {
            if ($.tag === 5) {
              if (M === null) {
                M = $
                try {
                  ;((u = $.stateNode),
                    N
                      ? ((d = u.style),
                        typeof d.setProperty == "function"
                          ? d.setProperty("display", "none", "important")
                          : (d.display = "none"))
                      : ((v = $.stateNode),
                        (x = $.memoizedProps.style),
                        (p =
                          x != null && x.hasOwnProperty("display")
                            ? x.display
                            : null),
                        (v.style.display = Ic("display", p))))
                } catch (ee) {
                  $e(e, e.return, ee)
                }
              }
            } else if ($.tag === 6) {
              if (M === null)
                try {
                  $.stateNode.nodeValue = N ? "" : $.memoizedProps
                } catch (ee) {
                  $e(e, e.return, ee)
                }
            } else if (
              (($.tag !== 22 && $.tag !== 23) ||
                $.memoizedState === null ||
                $ === e) &&
              $.child !== null
            ) {
              ;(($.child.return = $), ($ = $.child))
              continue
            }
            if ($ === e) break e
            for (; $.sibling === null; ) {
              if ($.return === null || $.return === e) break e
              ;(M === $ && (M = null), ($ = $.return))
            }
            ;(M === $ && (M = null),
              ($.sibling.return = $.return),
              ($ = $.sibling))
          }
        }
        break
      case 19:
        ;(Qt(t, e), nn(e), l & 4 && eh(e))
        break
      case 21:
        break
      default:
        ;(Qt(t, e), nn(e))
    }
  }
  function nn(e) {
    var t = e.flags
    if (t & 2) {
      try {
        e: {
          for (var i = e.return; i !== null; ) {
            if (Jf(i)) {
              var l = i
              break e
            }
            i = i.return
          }
          throw Error(s(160))
        }
        switch (l.tag) {
          case 5:
            var u = l.stateNode
            l.flags & 32 && (_s(u, ""), (l.flags &= -33))
            var d = Xf(e)
            Ja(e, d, u)
            break
          case 3:
          case 4:
            var p = l.stateNode.containerInfo,
              v = Xf(e)
            Ya(e, v, p)
            break
          default:
            throw Error(s(161))
        }
      } catch (x) {
        $e(e, e.return, x)
      }
      e.flags &= -3
    }
    t & 4096 && (e.flags &= -4097)
  }
  function nv(e, t, i) {
    ;((Y = e), nh(e))
  }
  function nh(e, t, i) {
    for (var l = (e.mode & 1) !== 0; Y !== null; ) {
      var u = Y,
        d = u.child
      if (u.tag === 22 && l) {
        var p = u.memoizedState !== null || Co
        if (!p) {
          var v = u.alternate,
            x = (v !== null && v.memoizedState !== null) || ct
          v = Co
          var N = ct
          if (((Co = p), (ct = x) && !N))
            for (Y = u; Y !== null; )
              ((p = Y),
                (x = p.child),
                p.tag === 22 && p.memoizedState !== null
                  ? ih(u)
                  : x !== null
                    ? ((x.return = p), (Y = x))
                    : ih(u))
          for (; d !== null; ) ((Y = d), nh(d), (d = d.sibling))
          ;((Y = u), (Co = v), (ct = N))
        }
        rh(e)
      } else
        (u.subtreeFlags & 8772) !== 0 && d !== null
          ? ((d.return = u), (Y = d))
          : rh(e)
    }
  }
  function rh(e) {
    for (; Y !== null; ) {
      var t = Y
      if ((t.flags & 8772) !== 0) {
        var i = t.alternate
        try {
          if ((t.flags & 8772) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                ct || Ro(5, t)
                break
              case 1:
                var l = t.stateNode
                if (t.flags & 4 && !ct)
                  if (i === null) l.componentDidMount()
                  else {
                    var u =
                      t.elementType === t.type
                        ? i.memoizedProps
                        : qt(t.type, i.memoizedProps)
                    l.componentDidUpdate(
                      u,
                      i.memoizedState,
                      l.__reactInternalSnapshotBeforeUpdate,
                    )
                  }
                var d = t.updateQueue
                d !== null && rf(t, d, l)
                break
              case 3:
                var p = t.updateQueue
                if (p !== null) {
                  if (((i = null), t.child !== null))
                    switch (t.child.tag) {
                      case 5:
                        i = t.child.stateNode
                        break
                      case 1:
                        i = t.child.stateNode
                    }
                  rf(t, p, i)
                }
                break
              case 5:
                var v = t.stateNode
                if (i === null && t.flags & 4) {
                  i = v
                  var x = t.memoizedProps
                  switch (t.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      x.autoFocus && i.focus()
                      break
                    case "img":
                      x.src && (i.src = x.src)
                  }
                }
                break
              case 6:
                break
              case 4:
                break
              case 12:
                break
              case 13:
                if (t.memoizedState === null) {
                  var N = t.alternate
                  if (N !== null) {
                    var M = N.memoizedState
                    if (M !== null) {
                      var $ = M.dehydrated
                      $ !== null && Is($)
                    }
                  }
                }
                break
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break
              default:
                throw Error(s(163))
            }
          ct || (t.flags & 512 && Ga(t))
        } catch (U) {
          $e(t, t.return, U)
        }
      }
      if (t === e) {
        Y = null
        break
      }
      if (((i = t.sibling), i !== null)) {
        ;((i.return = t.return), (Y = i))
        break
      }
      Y = t.return
    }
  }
  function sh(e) {
    for (; Y !== null; ) {
      var t = Y
      if (t === e) {
        Y = null
        break
      }
      var i = t.sibling
      if (i !== null) {
        ;((i.return = t.return), (Y = i))
        break
      }
      Y = t.return
    }
  }
  function ih(e) {
    for (; Y !== null; ) {
      var t = Y
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var i = t.return
            try {
              Ro(4, t)
            } catch (x) {
              $e(t, i, x)
            }
            break
          case 1:
            var l = t.stateNode
            if (typeof l.componentDidMount == "function") {
              var u = t.return
              try {
                l.componentDidMount()
              } catch (x) {
                $e(t, u, x)
              }
            }
            var d = t.return
            try {
              Ga(t)
            } catch (x) {
              $e(t, d, x)
            }
            break
          case 5:
            var p = t.return
            try {
              Ga(t)
            } catch (x) {
              $e(t, p, x)
            }
        }
      } catch (x) {
        $e(t, t.return, x)
      }
      if (t === e) {
        Y = null
        break
      }
      var v = t.sibling
      if (v !== null) {
        ;((v.return = t.return), (Y = v))
        break
      }
      Y = t.return
    }
  }
  var rv = Math.ceil,
    To = j.ReactCurrentDispatcher,
    Xa = j.ReactCurrentOwner,
    It = j.ReactCurrentBatchConfig,
    _e = 0,
    Ze = null,
    We = null,
    rt = 0,
    Nt = 0,
    rs = An(0),
    Ye = 0,
    si = null,
    pr = 0,
    Po = 0,
    Za = 0,
    ii = null,
    wt = null,
    eu = 0,
    ss = 1 / 0,
    yn = null,
    No = !1,
    tu = null,
    Un = null,
    Oo = !1,
    Mn = null,
    Ao = 0,
    oi = 0,
    nu = null,
    Lo = -1,
    jo = 0
  function pt() {
    return (_e & 6) !== 0 ? qe() : Lo !== -1 ? Lo : (Lo = qe())
  }
  function zn(e) {
    return (e.mode & 1) === 0
      ? 1
      : (_e & 2) !== 0 && rt !== 0
        ? rt & -rt
        : zy.transition !== null
          ? (jo === 0 && (jo = Jc()), jo)
          : ((e = Pe),
            e !== 0 ||
              ((e = window.event), (e = e === void 0 ? 16 : od(e.type))),
            e)
  }
  function Wt(e, t, i, l) {
    if (50 < oi) throw ((oi = 0), (nu = null), Error(s(185)))
    ;(Ns(e, i, l),
      ((_e & 2) === 0 || e !== Ze) &&
        (e === Ze && ((_e & 2) === 0 && (Po |= i), Ye === 4 && Bn(e, rt)),
        xt(e, l),
        i === 1 &&
          _e === 0 &&
          (t.mode & 1) === 0 &&
          ((ss = qe() + 500), lo && jn())))
  }
  function xt(e, t) {
    var i = e.callbackNode
    zg(e, t)
    var l = $i(e, e === Ze ? rt : 0)
    if (l === 0)
      (i !== null && Kc(i), (e.callbackNode = null), (e.callbackPriority = 0))
    else if (((t = l & -l), e.callbackPriority !== t)) {
      if ((i != null && Kc(i), t === 1))
        (e.tag === 0 ? My(lh.bind(null, e)) : Hd(lh.bind(null, e)),
          Iy(function () {
            ;(_e & 6) === 0 && jn()
          }),
          (i = null))
      else {
        switch (Xc(l)) {
          case 1:
            i = Il
            break
          case 4:
            i = Gc
            break
          case 16:
            i = Ui
            break
          case 536870912:
            i = Yc
            break
          default:
            i = Ui
        }
        i = mh(i, oh.bind(null, e))
      }
      ;((e.callbackPriority = t), (e.callbackNode = i))
    }
  }
  function oh(e, t) {
    if (((Lo = -1), (jo = 0), (_e & 6) !== 0)) throw Error(s(327))
    var i = e.callbackNode
    if (is() && e.callbackNode !== i) return null
    var l = $i(e, e === Ze ? rt : 0)
    if (l === 0) return null
    if ((l & 30) !== 0 || (l & e.expiredLanes) !== 0 || t) t = Io(e, l)
    else {
      t = l
      var u = _e
      _e |= 2
      var d = uh()
      ;(Ze !== e || rt !== t) && ((yn = null), (ss = qe() + 500), gr(e, t))
      do
        try {
          ov()
          break
        } catch (v) {
          ah(e, v)
        }
      while (!0)
      ;(xa(),
        (To.current = d),
        (_e = u),
        We !== null ? (t = 0) : ((Ze = null), (rt = 0), (t = Ye)))
    }
    if (t !== 0) {
      if (
        (t === 2 && ((u = Dl(e)), u !== 0 && ((l = u), (t = ru(e, u)))),
        t === 1)
      )
        throw ((i = si), gr(e, 0), Bn(e, l), xt(e, qe()), i)
      if (t === 6) Bn(e, l)
      else {
        if (
          ((u = e.current.alternate),
          (l & 30) === 0 &&
            !sv(u) &&
            ((t = Io(e, l)),
            t === 2 && ((d = Dl(e)), d !== 0 && ((l = d), (t = ru(e, d)))),
            t === 1))
        )
          throw ((i = si), gr(e, 0), Bn(e, l), xt(e, qe()), i)
        switch (((e.finishedWork = u), (e.finishedLanes = l), t)) {
          case 0:
          case 1:
            throw Error(s(345))
          case 2:
            yr(e, wt, yn)
            break
          case 3:
            if (
              (Bn(e, l),
              (l & 130023424) === l && ((t = eu + 500 - qe()), 10 < t))
            ) {
              if ($i(e, 0) !== 0) break
              if (((u = e.suspendedLanes), (u & l) !== l)) {
                ;(pt(), (e.pingedLanes |= e.suspendedLanes & u))
                break
              }
              e.timeoutHandle = ua(yr.bind(null, e, wt, yn), t)
              break
            }
            yr(e, wt, yn)
            break
          case 4:
            if ((Bn(e, l), (l & 4194240) === l)) break
            for (t = e.eventTimes, u = -1; 0 < l; ) {
              var p = 31 - Bt(l)
              ;((d = 1 << p), (p = t[p]), p > u && (u = p), (l &= ~d))
            }
            if (
              ((l = u),
              (l = qe() - l),
              (l =
                (120 > l
                  ? 120
                  : 480 > l
                    ? 480
                    : 1080 > l
                      ? 1080
                      : 1920 > l
                        ? 1920
                        : 3e3 > l
                          ? 3e3
                          : 4320 > l
                            ? 4320
                            : 1960 * rv(l / 1960)) - l),
              10 < l)
            ) {
              e.timeoutHandle = ua(yr.bind(null, e, wt, yn), l)
              break
            }
            yr(e, wt, yn)
            break
          case 5:
            yr(e, wt, yn)
            break
          default:
            throw Error(s(329))
        }
      }
    }
    return (xt(e, qe()), e.callbackNode === i ? oh.bind(null, e) : null)
  }
  function ru(e, t) {
    var i = ii
    return (
      e.current.memoizedState.isDehydrated && (gr(e, t).flags |= 256),
      (e = Io(e, t)),
      e !== 2 && ((t = wt), (wt = i), t !== null && su(t)),
      e
    )
  }
  function su(e) {
    wt === null ? (wt = e) : wt.push.apply(wt, e)
  }
  function sv(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var i = t.updateQueue
        if (i !== null && ((i = i.stores), i !== null))
          for (var l = 0; l < i.length; l++) {
            var u = i[l],
              d = u.getSnapshot
            u = u.value
            try {
              if (!$t(d(), u)) return !1
            } catch {
              return !1
            }
          }
      }
      if (((i = t.child), t.subtreeFlags & 16384 && i !== null))
        ((i.return = t), (t = i))
      else {
        if (t === e) break
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0
          t = t.return
        }
        ;((t.sibling.return = t.return), (t = t.sibling))
      }
    }
    return !0
  }
  function Bn(e, t) {
    for (
      t &= ~Za,
        t &= ~Po,
        e.suspendedLanes |= t,
        e.pingedLanes &= ~t,
        e = e.expirationTimes;
      0 < t;
    ) {
      var i = 31 - Bt(t),
        l = 1 << i
      ;((e[i] = -1), (t &= ~l))
    }
  }
  function lh(e) {
    if ((_e & 6) !== 0) throw Error(s(327))
    is()
    var t = $i(e, 0)
    if ((t & 1) === 0) return (xt(e, qe()), null)
    var i = Io(e, t)
    if (e.tag !== 0 && i === 2) {
      var l = Dl(e)
      l !== 0 && ((t = l), (i = ru(e, l)))
    }
    if (i === 1) throw ((i = si), gr(e, 0), Bn(e, t), xt(e, qe()), i)
    if (i === 6) throw Error(s(345))
    return (
      (e.finishedWork = e.current.alternate),
      (e.finishedLanes = t),
      yr(e, wt, yn),
      xt(e, qe()),
      null
    )
  }
  function iu(e, t) {
    var i = _e
    _e |= 1
    try {
      return e(t)
    } finally {
      ;((_e = i), _e === 0 && ((ss = qe() + 500), lo && jn()))
    }
  }
  function mr(e) {
    Mn !== null && Mn.tag === 0 && (_e & 6) === 0 && is()
    var t = _e
    _e |= 1
    var i = It.transition,
      l = Pe
    try {
      if (((It.transition = null), (Pe = 1), e)) return e()
    } finally {
      ;((Pe = l), (It.transition = i), (_e = t), (_e & 6) === 0 && jn())
    }
  }
  function ou() {
    ;((Nt = rs.current), Ue(rs))
  }
  function gr(e, t) {
    ;((e.finishedWork = null), (e.finishedLanes = 0))
    var i = e.timeoutHandle
    if ((i !== -1 && ((e.timeoutHandle = -1), jy(i)), We !== null))
      for (i = We.return; i !== null; ) {
        var l = i
        switch ((ma(l), l.tag)) {
          case 1:
            ;((l = l.type.childContextTypes), l != null && io())
            break
          case 3:
            ;(es(), Ue(gt), Ue(lt), Ta())
            break
          case 5:
            Ca(l)
            break
          case 4:
            es()
            break
          case 13:
            Ue(ze)
            break
          case 19:
            Ue(ze)
            break
          case 10:
            Sa(l.type._context)
            break
          case 22:
          case 23:
            ou()
        }
        i = i.return
      }
    if (
      ((Ze = e),
      (We = e = $n(e.current, null)),
      (rt = Nt = t),
      (Ye = 0),
      (si = null),
      (Za = Po = pr = 0),
      (wt = ii = null),
      dr !== null)
    ) {
      for (t = 0; t < dr.length; t++)
        if (((i = dr[t]), (l = i.interleaved), l !== null)) {
          i.interleaved = null
          var u = l.next,
            d = i.pending
          if (d !== null) {
            var p = d.next
            ;((d.next = u), (l.next = p))
          }
          i.pending = l
        }
      dr = null
    }
    return e
  }
  function ah(e, t) {
    do {
      var i = We
      try {
        if ((xa(), (vo.current = ko), wo)) {
          for (var l = Be.memoizedState; l !== null; ) {
            var u = l.queue
            ;(u !== null && (u.pending = null), (l = l.next))
          }
          wo = !1
        }
        if (
          ((hr = 0),
          (Xe = Ge = Be = null),
          (Xs = !1),
          (Zs = 0),
          (Xa.current = null),
          i === null || i.return === null)
        ) {
          ;((Ye = 1), (si = t), (We = null))
          break
        }
        e: {
          var d = e,
            p = i.return,
            v = i,
            x = t
          if (
            ((t = rt),
            (v.flags |= 32768),
            x !== null && typeof x == "object" && typeof x.then == "function")
          ) {
            var N = x,
              M = v,
              $ = M.tag
            if ((M.mode & 1) === 0 && ($ === 0 || $ === 11 || $ === 15)) {
              var U = M.alternate
              U
                ? ((M.updateQueue = U.updateQueue),
                  (M.memoizedState = U.memoizedState),
                  (M.lanes = U.lanes))
                : ((M.updateQueue = null), (M.memoizedState = null))
            }
            var W = Lf(p)
            if (W !== null) {
              ;((W.flags &= -257),
                jf(W, p, v, d, t),
                W.mode & 1 && Af(d, N, t),
                (t = W),
                (x = N))
              var J = t.updateQueue
              if (J === null) {
                var ee = new Set()
                ;(ee.add(x), (t.updateQueue = ee))
              } else J.add(x)
              break e
            } else {
              if ((t & 1) === 0) {
                ;(Af(d, N, t), lu())
                break e
              }
              x = Error(s(426))
            }
          } else if (Me && v.mode & 1) {
            var He = Lf(p)
            if (He !== null) {
              ;((He.flags & 65536) === 0 && (He.flags |= 256),
                jf(He, p, v, d, t),
                va(ts(x, v)))
              break e
            }
          }
          ;((d = x = ts(x, v)),
            Ye !== 4 && (Ye = 2),
            ii === null ? (ii = [d]) : ii.push(d),
            (d = p))
          do {
            switch (d.tag) {
              case 3:
                ;((d.flags |= 65536), (t &= -t), (d.lanes |= t))
                var T = Nf(d, x, t)
                nf(d, T)
                break e
              case 1:
                v = x
                var _ = d.type,
                  P = d.stateNode
                if (
                  (d.flags & 128) === 0 &&
                  (typeof _.getDerivedStateFromError == "function" ||
                    (P !== null &&
                      typeof P.componentDidCatch == "function" &&
                      (Un === null || !Un.has(P))))
                ) {
                  ;((d.flags |= 65536), (t &= -t), (d.lanes |= t))
                  var V = Of(d, v, t)
                  nf(d, V)
                  break e
                }
            }
            d = d.return
          } while (d !== null)
        }
        dh(i)
      } catch (te) {
        ;((t = te), We === i && i !== null && (We = i = i.return))
        continue
      }
      break
    } while (!0)
  }
  function uh() {
    var e = To.current
    return ((To.current = ko), e === null ? ko : e)
  }
  function lu() {
    ;((Ye === 0 || Ye === 3 || Ye === 2) && (Ye = 4),
      Ze === null ||
        ((pr & 268435455) === 0 && (Po & 268435455) === 0) ||
        Bn(Ze, rt))
  }
  function Io(e, t) {
    var i = _e
    _e |= 2
    var l = uh()
    ;(Ze !== e || rt !== t) && ((yn = null), gr(e, t))
    do
      try {
        iv()
        break
      } catch (u) {
        ah(e, u)
      }
    while (!0)
    if ((xa(), (_e = i), (To.current = l), We !== null)) throw Error(s(261))
    return ((Ze = null), (rt = 0), Ye)
  }
  function iv() {
    for (; We !== null; ) ch(We)
  }
  function ov() {
    for (; We !== null && !Og(); ) ch(We)
  }
  function ch(e) {
    var t = ph(e.alternate, e, Nt)
    ;((e.memoizedProps = e.pendingProps),
      t === null ? dh(e) : (We = t),
      (Xa.current = null))
  }
  function dh(e) {
    var t = e
    do {
      var i = t.alternate
      if (((e = t.return), (t.flags & 32768) === 0)) {
        if (((i = Xy(i, t, Nt)), i !== null)) {
          We = i
          return
        }
      } else {
        if (((i = Zy(i, t)), i !== null)) {
          ;((i.flags &= 32767), (We = i))
          return
        }
        if (e !== null)
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null))
        else {
          ;((Ye = 6), (We = null))
          return
        }
      }
      if (((t = t.sibling), t !== null)) {
        We = t
        return
      }
      We = t = e
    } while (t !== null)
    Ye === 0 && (Ye = 5)
  }
  function yr(e, t, i) {
    var l = Pe,
      u = It.transition
    try {
      ;((It.transition = null), (Pe = 1), lv(e, t, i, l))
    } finally {
      ;((It.transition = u), (Pe = l))
    }
    return null
  }
  function lv(e, t, i, l) {
    do is()
    while (Mn !== null)
    if ((_e & 6) !== 0) throw Error(s(327))
    i = e.finishedWork
    var u = e.finishedLanes
    if (i === null) return null
    if (((e.finishedWork = null), (e.finishedLanes = 0), i === e.current))
      throw Error(s(177))
    ;((e.callbackNode = null), (e.callbackPriority = 0))
    var d = i.lanes | i.childLanes
    if (
      (Bg(e, d),
      e === Ze && ((We = Ze = null), (rt = 0)),
      ((i.subtreeFlags & 2064) === 0 && (i.flags & 2064) === 0) ||
        Oo ||
        ((Oo = !0),
        mh(Ui, function () {
          return (is(), null)
        })),
      (d = (i.flags & 15990) !== 0),
      (i.subtreeFlags & 15990) !== 0 || d)
    ) {
      ;((d = It.transition), (It.transition = null))
      var p = Pe
      Pe = 1
      var v = _e
      ;((_e |= 4),
        (Xa.current = null),
        tv(e, i),
        th(i, e),
        Ry(la),
        (Hi = !!oa),
        (la = oa = null),
        (e.current = i),
        nv(i),
        Ag(),
        (_e = v),
        (Pe = p),
        (It.transition = d))
    } else e.current = i
    if (
      (Oo && ((Oo = !1), (Mn = e), (Ao = u)),
      (d = e.pendingLanes),
      d === 0 && (Un = null),
      Ig(i.stateNode),
      xt(e, qe()),
      t !== null)
    )
      for (l = e.onRecoverableError, i = 0; i < t.length; i++)
        ((u = t[i]), l(u.value, { componentStack: u.stack, digest: u.digest }))
    if (No) throw ((No = !1), (e = tu), (tu = null), e)
    return (
      (Ao & 1) !== 0 && e.tag !== 0 && is(),
      (d = e.pendingLanes),
      (d & 1) !== 0 ? (e === nu ? oi++ : ((oi = 0), (nu = e))) : (oi = 0),
      jn(),
      null
    )
  }
  function is() {
    if (Mn !== null) {
      var e = Xc(Ao),
        t = It.transition,
        i = Pe
      try {
        if (((It.transition = null), (Pe = 16 > e ? 16 : e), Mn === null))
          var l = !1
        else {
          if (((e = Mn), (Mn = null), (Ao = 0), (_e & 6) !== 0))
            throw Error(s(331))
          var u = _e
          for (_e |= 4, Y = e.current; Y !== null; ) {
            var d = Y,
              p = d.child
            if ((Y.flags & 16) !== 0) {
              var v = d.deletions
              if (v !== null) {
                for (var x = 0; x < v.length; x++) {
                  var N = v[x]
                  for (Y = N; Y !== null; ) {
                    var M = Y
                    switch (M.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ri(8, M, d)
                    }
                    var $ = M.child
                    if ($ !== null) (($.return = M), (Y = $))
                    else
                      for (; Y !== null; ) {
                        M = Y
                        var U = M.sibling,
                          W = M.return
                        if ((Yf(M), M === N)) {
                          Y = null
                          break
                        }
                        if (U !== null) {
                          ;((U.return = W), (Y = U))
                          break
                        }
                        Y = W
                      }
                  }
                }
                var J = d.alternate
                if (J !== null) {
                  var ee = J.child
                  if (ee !== null) {
                    J.child = null
                    do {
                      var He = ee.sibling
                      ;((ee.sibling = null), (ee = He))
                    } while (ee !== null)
                  }
                }
                Y = d
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && p !== null)
              ((p.return = d), (Y = p))
            else
              e: for (; Y !== null; ) {
                if (((d = Y), (d.flags & 2048) !== 0))
                  switch (d.tag) {
                    case 0:
                    case 11:
                    case 15:
                      ri(9, d, d.return)
                  }
                var T = d.sibling
                if (T !== null) {
                  ;((T.return = d.return), (Y = T))
                  break e
                }
                Y = d.return
              }
          }
          var _ = e.current
          for (Y = _; Y !== null; ) {
            p = Y
            var P = p.child
            if ((p.subtreeFlags & 2064) !== 0 && P !== null)
              ((P.return = p), (Y = P))
            else
              e: for (p = _; Y !== null; ) {
                if (((v = Y), (v.flags & 2048) !== 0))
                  try {
                    switch (v.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ro(9, v)
                    }
                  } catch (te) {
                    $e(v, v.return, te)
                  }
                if (v === p) {
                  Y = null
                  break e
                }
                var V = v.sibling
                if (V !== null) {
                  ;((V.return = v.return), (Y = V))
                  break e
                }
                Y = v.return
              }
          }
          if (
            ((_e = u),
            jn(),
            Xt && typeof Xt.onPostCommitFiberRoot == "function")
          )
            try {
              Xt.onPostCommitFiberRoot(Mi, e)
            } catch {}
          l = !0
        }
        return l
      } finally {
        ;((Pe = i), (It.transition = t))
      }
    }
    return !1
  }
  function fh(e, t, i) {
    ;((t = ts(i, t)),
      (t = Nf(e, t, 1)),
      (e = Dn(e, t, 1)),
      (t = pt()),
      e !== null && (Ns(e, 1, t), xt(e, t)))
  }
  function $e(e, t, i) {
    if (e.tag === 3) fh(e, e, i)
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          fh(t, e, i)
          break
        } else if (t.tag === 1) {
          var l = t.stateNode
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof l.componentDidCatch == "function" &&
              (Un === null || !Un.has(l)))
          ) {
            ;((e = ts(i, e)),
              (e = Of(t, e, 1)),
              (t = Dn(t, e, 1)),
              (e = pt()),
              t !== null && (Ns(t, 1, e), xt(t, e)))
            break
          }
        }
        t = t.return
      }
  }
  function av(e, t, i) {
    var l = e.pingCache
    ;(l !== null && l.delete(t),
      (t = pt()),
      (e.pingedLanes |= e.suspendedLanes & i),
      Ze === e &&
        (rt & i) === i &&
        (Ye === 4 || (Ye === 3 && (rt & 130023424) === rt && 500 > qe() - eu)
          ? gr(e, 0)
          : (Za |= i)),
      xt(e, t))
  }
  function hh(e, t) {
    t === 0 &&
      ((e.mode & 1) === 0
        ? (t = 1)
        : ((t = Bi), (Bi <<= 1), (Bi & 130023424) === 0 && (Bi = 4194304)))
    var i = pt()
    ;((e = pn(e, t)), e !== null && (Ns(e, t, i), xt(e, i)))
  }
  function uv(e) {
    var t = e.memoizedState,
      i = 0
    ;(t !== null && (i = t.retryLane), hh(e, i))
  }
  function cv(e, t) {
    var i = 0
    switch (e.tag) {
      case 13:
        var l = e.stateNode,
          u = e.memoizedState
        u !== null && (i = u.retryLane)
        break
      case 19:
        l = e.stateNode
        break
      default:
        throw Error(s(314))
    }
    ;(l !== null && l.delete(t), hh(e, i))
  }
  var ph
  ph = function (e, t, i) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps || gt.current) vt = !0
      else {
        if ((e.lanes & i) === 0 && (t.flags & 128) === 0)
          return ((vt = !1), Jy(e, t, i))
        vt = (e.flags & 131072) !== 0
      }
    else ((vt = !1), Me && (t.flags & 1048576) !== 0 && Qd(t, uo, t.index))
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var l = t.type
        ;(bo(e, t), (e = t.pendingProps))
        var u = Wr(t, lt.current)
        ;(Zr(t, i), (u = Oa(null, t, l, e, u, i)))
        var d = Aa()
        return (
          (t.flags |= 1),
          typeof u == "object" &&
          u !== null &&
          typeof u.render == "function" &&
          u.$$typeof === void 0
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              yt(l) ? ((d = !0), oo(t)) : (d = !1),
              (t.memoizedState =
                u.state !== null && u.state !== void 0 ? u.state : null),
              _a(t),
              (u.updater = Eo),
              (t.stateNode = u),
              (u._reactInternals = t),
              Ua(t, l, e, i),
              (t = $a(null, t, l, !0, d, i)))
            : ((t.tag = 0), Me && d && pa(t), ht(null, t, u, i), (t = t.child)),
          t
        )
      case 16:
        l = t.elementType
        e: {
          switch (
            (bo(e, t),
            (e = t.pendingProps),
            (u = l._init),
            (l = u(l._payload)),
            (t.type = l),
            (u = t.tag = fv(l)),
            (e = qt(l, e)),
            u)
          ) {
            case 0:
              t = Ba(null, t, l, e, i)
              break e
            case 1:
              t = zf(null, t, l, e, i)
              break e
            case 11:
              t = If(null, t, l, e, i)
              break e
            case 14:
              t = Df(null, t, l, qt(l.type, e), i)
              break e
          }
          throw Error(s(306, l, ""))
        }
        return t
      case 0:
        return (
          (l = t.type),
          (u = t.pendingProps),
          (u = t.elementType === l ? u : qt(l, u)),
          Ba(e, t, l, u, i)
        )
      case 1:
        return (
          (l = t.type),
          (u = t.pendingProps),
          (u = t.elementType === l ? u : qt(l, u)),
          zf(e, t, l, u, i)
        )
      case 3:
        e: {
          if ((Bf(t), e === null)) throw Error(s(387))
          ;((l = t.pendingProps),
            (d = t.memoizedState),
            (u = d.element),
            tf(e, t),
            go(t, l, null, i))
          var p = t.memoizedState
          if (((l = p.element), d.isDehydrated))
            if (
              ((d = {
                element: l,
                isDehydrated: !1,
                cache: p.cache,
                pendingSuspenseBoundaries: p.pendingSuspenseBoundaries,
                transitions: p.transitions,
              }),
              (t.updateQueue.baseState = d),
              (t.memoizedState = d),
              t.flags & 256)
            ) {
              ;((u = ts(Error(s(423)), t)), (t = $f(e, t, l, i, u)))
              break e
            } else if (l !== u) {
              ;((u = ts(Error(s(424)), t)), (t = $f(e, t, l, i, u)))
              break e
            } else
              for (
                Pt = On(t.stateNode.containerInfo.firstChild),
                  Tt = t,
                  Me = !0,
                  Vt = null,
                  i = Zd(t, null, l, i),
                  t.child = i;
                i;
              )
                ((i.flags = (i.flags & -3) | 4096), (i = i.sibling))
          else {
            if ((Yr(), l === u)) {
              t = gn(e, t, i)
              break e
            }
            ht(e, t, l, i)
          }
          t = t.child
        }
        return t
      case 5:
        return (
          sf(t),
          e === null && ya(t),
          (l = t.type),
          (u = t.pendingProps),
          (d = e !== null ? e.memoizedProps : null),
          (p = u.children),
          aa(l, u) ? (p = null) : d !== null && aa(l, d) && (t.flags |= 32),
          Mf(e, t),
          ht(e, t, p, i),
          t.child
        )
      case 6:
        return (e === null && ya(t), null)
      case 13:
        return Vf(e, t, i)
      case 4:
        return (
          ba(t, t.stateNode.containerInfo),
          (l = t.pendingProps),
          e === null ? (t.child = Jr(t, null, l, i)) : ht(e, t, l, i),
          t.child
        )
      case 11:
        return (
          (l = t.type),
          (u = t.pendingProps),
          (u = t.elementType === l ? u : qt(l, u)),
          If(e, t, l, u, i)
        )
      case 7:
        return (ht(e, t, t.pendingProps, i), t.child)
      case 8:
        return (ht(e, t, t.pendingProps.children, i), t.child)
      case 12:
        return (ht(e, t, t.pendingProps.children, i), t.child)
      case 10:
        e: {
          if (
            ((l = t.type._context),
            (u = t.pendingProps),
            (d = t.memoizedProps),
            (p = u.value),
            Le(ho, l._currentValue),
            (l._currentValue = p),
            d !== null)
          )
            if ($t(d.value, p)) {
              if (d.children === u.children && !gt.current) {
                t = gn(e, t, i)
                break e
              }
            } else
              for (d = t.child, d !== null && (d.return = t); d !== null; ) {
                var v = d.dependencies
                if (v !== null) {
                  p = d.child
                  for (var x = v.firstContext; x !== null; ) {
                    if (x.context === l) {
                      if (d.tag === 1) {
                        ;((x = mn(-1, i & -i)), (x.tag = 2))
                        var N = d.updateQueue
                        if (N !== null) {
                          N = N.shared
                          var M = N.pending
                          ;(M === null
                            ? (x.next = x)
                            : ((x.next = M.next), (M.next = x)),
                            (N.pending = x))
                        }
                      }
                      ;((d.lanes |= i),
                        (x = d.alternate),
                        x !== null && (x.lanes |= i),
                        ka(d.return, i, t),
                        (v.lanes |= i))
                      break
                    }
                    x = x.next
                  }
                } else if (d.tag === 10) p = d.type === t.type ? null : d.child
                else if (d.tag === 18) {
                  if (((p = d.return), p === null)) throw Error(s(341))
                  ;((p.lanes |= i),
                    (v = p.alternate),
                    v !== null && (v.lanes |= i),
                    ka(p, i, t),
                    (p = d.sibling))
                } else p = d.child
                if (p !== null) p.return = d
                else
                  for (p = d; p !== null; ) {
                    if (p === t) {
                      p = null
                      break
                    }
                    if (((d = p.sibling), d !== null)) {
                      ;((d.return = p.return), (p = d))
                      break
                    }
                    p = p.return
                  }
                d = p
              }
          ;(ht(e, t, u.children, i), (t = t.child))
        }
        return t
      case 9:
        return (
          (u = t.type),
          (l = t.pendingProps.children),
          Zr(t, i),
          (u = Lt(u)),
          (l = l(u)),
          (t.flags |= 1),
          ht(e, t, l, i),
          t.child
        )
      case 14:
        return (
          (l = t.type),
          (u = qt(l, t.pendingProps)),
          (u = qt(l.type, u)),
          Df(e, t, l, u, i)
        )
      case 15:
        return Ff(e, t, t.type, t.pendingProps, i)
      case 17:
        return (
          (l = t.type),
          (u = t.pendingProps),
          (u = t.elementType === l ? u : qt(l, u)),
          bo(e, t),
          (t.tag = 1),
          yt(l) ? ((e = !0), oo(t)) : (e = !1),
          Zr(t, i),
          Tf(t, l, u),
          Ua(t, l, u, i),
          $a(null, t, l, !0, e, i)
        )
      case 19:
        return Hf(e, t, i)
      case 22:
        return Uf(e, t, i)
    }
    throw Error(s(156, t.tag))
  }
  function mh(e, t) {
    return Wc(e, t)
  }
  function dv(e, t, i, l) {
    ;((this.tag = e),
      (this.key = i),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null))
  }
  function Dt(e, t, i, l) {
    return new dv(e, t, i, l)
  }
  function au(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent))
  }
  function fv(e) {
    if (typeof e == "function") return au(e) ? 1 : 0
    if (e != null) {
      if (((e = e.$$typeof), e === je)) return 11
      if (e === De) return 14
    }
    return 2
  }
  function $n(e, t) {
    var i = e.alternate
    return (
      i === null
        ? ((i = Dt(e.tag, t, e.key, e.mode)),
          (i.elementType = e.elementType),
          (i.type = e.type),
          (i.stateNode = e.stateNode),
          (i.alternate = e),
          (e.alternate = i))
        : ((i.pendingProps = t),
          (i.type = e.type),
          (i.flags = 0),
          (i.subtreeFlags = 0),
          (i.deletions = null)),
      (i.flags = e.flags & 14680064),
      (i.childLanes = e.childLanes),
      (i.lanes = e.lanes),
      (i.child = e.child),
      (i.memoizedProps = e.memoizedProps),
      (i.memoizedState = e.memoizedState),
      (i.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (i.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (i.sibling = e.sibling),
      (i.index = e.index),
      (i.ref = e.ref),
      i
    )
  }
  function Do(e, t, i, l, u, d) {
    var p = 2
    if (((l = e), typeof e == "function")) au(e) && (p = 1)
    else if (typeof e == "string") p = 5
    else
      e: switch (e) {
        case se:
          return vr(i.children, u, d, t)
        case z:
          ;((p = 8), (u |= 8))
          break
        case ce:
          return (
            (e = Dt(12, i, t, u | 2)),
            (e.elementType = ce),
            (e.lanes = d),
            e
          )
        case Ie:
          return ((e = Dt(13, i, t, u)), (e.elementType = Ie), (e.lanes = d), e)
        case Ne:
          return ((e = Dt(19, i, t, u)), (e.elementType = Ne), (e.lanes = d), e)
        case Ee:
          return Fo(i, u, d, t)
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case le:
                p = 10
                break e
              case Oe:
                p = 9
                break e
              case je:
                p = 11
                break e
              case De:
                p = 14
                break e
              case ye:
                ;((p = 16), (l = null))
                break e
            }
          throw Error(s(130, e == null ? e : typeof e, ""))
      }
    return (
      (t = Dt(p, i, t, u)),
      (t.elementType = e),
      (t.type = l),
      (t.lanes = d),
      t
    )
  }
  function vr(e, t, i, l) {
    return ((e = Dt(7, e, l, t)), (e.lanes = i), e)
  }
  function Fo(e, t, i, l) {
    return (
      (e = Dt(22, e, l, t)),
      (e.elementType = Ee),
      (e.lanes = i),
      (e.stateNode = { isHidden: !1 }),
      e
    )
  }
  function uu(e, t, i) {
    return ((e = Dt(6, e, null, t)), (e.lanes = i), e)
  }
  function cu(e, t, i) {
    return (
      (t = Dt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = i),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    )
  }
  function hv(e, t, i, l, u) {
    ;((this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork =
        this.pingCache =
        this.current =
        this.pendingChildren =
          null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = Fl(0)),
      (this.expirationTimes = Fl(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Fl(0)),
      (this.identifierPrefix = l),
      (this.onRecoverableError = u),
      (this.mutableSourceEagerHydrationData = null))
  }
  function du(e, t, i, l, u, d, p, v, x) {
    return (
      (e = new hv(e, t, i, v, x)),
      t === 1 ? ((t = 1), d === !0 && (t |= 8)) : (t = 0),
      (d = Dt(3, null, null, t)),
      (e.current = d),
      (d.stateNode = e),
      (d.memoizedState = {
        element: l,
        isDehydrated: i,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      _a(d),
      e
    )
  }
  function pv(e, t, i) {
    var l =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null
    return {
      $$typeof: ne,
      key: l == null ? null : "" + l,
      children: e,
      containerInfo: t,
      implementation: i,
    }
  }
  function gh(e) {
    if (!e) return Ln
    e = e._reactInternals
    e: {
      if (or(e) !== e || e.tag !== 1) throw Error(s(170))
      var t = e
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context
            break e
          case 1:
            if (yt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext
              break e
            }
        }
        t = t.return
      } while (t !== null)
      throw Error(s(171))
    }
    if (e.tag === 1) {
      var i = e.type
      if (yt(i)) return Vd(e, i, t)
    }
    return t
  }
  function yh(e, t, i, l, u, d, p, v, x) {
    return (
      (e = du(i, l, !0, e, u, d, p, v, x)),
      (e.context = gh(null)),
      (i = e.current),
      (l = pt()),
      (u = zn(i)),
      (d = mn(l, u)),
      (d.callback = t ?? null),
      Dn(i, d, u),
      (e.current.lanes = u),
      Ns(e, u, l),
      xt(e, l),
      e
    )
  }
  function Uo(e, t, i, l) {
    var u = t.current,
      d = pt(),
      p = zn(u)
    return (
      (i = gh(i)),
      t.context === null ? (t.context = i) : (t.pendingContext = i),
      (t = mn(d, p)),
      (t.payload = { element: e }),
      (l = l === void 0 ? null : l),
      l !== null && (t.callback = l),
      (e = Dn(u, t, p)),
      e !== null && (Wt(e, u, p, d), mo(e, u, p)),
      p
    )
  }
  function Mo(e) {
    if (((e = e.current), !e.child)) return null
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode
      default:
        return e.child.stateNode
    }
  }
  function vh(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var i = e.retryLane
      e.retryLane = i !== 0 && i < t ? i : t
    }
  }
  function fu(e, t) {
    ;(vh(e, t), (e = e.alternate) && vh(e, t))
  }
  function mv() {
    return null
  }
  var wh =
    typeof reportError == "function"
      ? reportError
      : function (e) {
          console.error(e)
        }
  function hu(e) {
    this._internalRoot = e
  }
  ;((zo.prototype.render = hu.prototype.render =
    function (e) {
      var t = this._internalRoot
      if (t === null) throw Error(s(409))
      Uo(e, t, null, null)
    }),
    (zo.prototype.unmount = hu.prototype.unmount =
      function () {
        var e = this._internalRoot
        if (e !== null) {
          this._internalRoot = null
          var t = e.containerInfo
          ;(mr(function () {
            Uo(null, e, null, null)
          }),
            (t[cn] = null))
        }
      }))
  function zo(e) {
    this._internalRoot = e
  }
  zo.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = td()
      e = { blockedOn: null, target: e, priority: t }
      for (var i = 0; i < Tn.length && t !== 0 && t < Tn[i].priority; i++);
      ;(Tn.splice(i, 0, e), i === 0 && sd(e))
    }
  }
  function pu(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11))
  }
  function Bo(e) {
    return !(
      !e ||
      (e.nodeType !== 1 &&
        e.nodeType !== 9 &&
        e.nodeType !== 11 &&
        (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
    )
  }
  function xh() {}
  function gv(e, t, i, l, u) {
    if (u) {
      if (typeof l == "function") {
        var d = l
        l = function () {
          var N = Mo(p)
          d.call(N)
        }
      }
      var p = yh(t, l, e, 0, null, !1, !1, "", xh)
      return (
        (e._reactRootContainer = p),
        (e[cn] = p.current),
        qs(e.nodeType === 8 ? e.parentNode : e),
        mr(),
        p
      )
    }
    for (; (u = e.lastChild); ) e.removeChild(u)
    if (typeof l == "function") {
      var v = l
      l = function () {
        var N = Mo(x)
        v.call(N)
      }
    }
    var x = du(e, 0, !1, null, null, !1, !1, "", xh)
    return (
      (e._reactRootContainer = x),
      (e[cn] = x.current),
      qs(e.nodeType === 8 ? e.parentNode : e),
      mr(function () {
        Uo(t, x, i, l)
      }),
      x
    )
  }
  function $o(e, t, i, l, u) {
    var d = i._reactRootContainer
    if (d) {
      var p = d
      if (typeof u == "function") {
        var v = u
        u = function () {
          var x = Mo(p)
          v.call(x)
        }
      }
      Uo(t, p, e, u)
    } else p = gv(i, t, e, u, l)
    return Mo(p)
  }
  ;((Zc = function (e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode
        if (t.current.memoizedState.isDehydrated) {
          var i = Ps(t.pendingLanes)
          i !== 0 &&
            (Ul(t, i | 1),
            xt(t, qe()),
            (_e & 6) === 0 && ((ss = qe() + 500), jn()))
        }
        break
      case 13:
        ;(mr(function () {
          var l = pn(e, 1)
          if (l !== null) {
            var u = pt()
            Wt(l, e, 1, u)
          }
        }),
          fu(e, 1))
    }
  }),
    (Ml = function (e) {
      if (e.tag === 13) {
        var t = pn(e, 134217728)
        if (t !== null) {
          var i = pt()
          Wt(t, e, 134217728, i)
        }
        fu(e, 134217728)
      }
    }),
    (ed = function (e) {
      if (e.tag === 13) {
        var t = zn(e),
          i = pn(e, t)
        if (i !== null) {
          var l = pt()
          Wt(i, e, t, l)
        }
        fu(e, t)
      }
    }),
    (td = function () {
      return Pe
    }),
    (nd = function (e, t) {
      var i = Pe
      try {
        return ((Pe = e), t())
      } finally {
        Pe = i
      }
    }),
    (Ol = function (e, t, i) {
      switch (t) {
        case "input":
          if ((El(e, i), (t = i.name), i.type === "radio" && t != null)) {
            for (i = e; i.parentNode; ) i = i.parentNode
            for (
              i = i.querySelectorAll(
                "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
              ),
                t = 0;
              t < i.length;
              t++
            ) {
              var l = i[t]
              if (l !== e && l.form === e.form) {
                var u = so(l)
                if (!u) throw Error(s(90))
                ;(ir(l), El(l, u))
              }
            }
          }
          break
        case "textarea":
          Oc(e, i)
          break
        case "select":
          ;((t = i.value), t != null && Ir(e, !!i.multiple, t, !1))
      }
    }),
    (zc = iu),
    (Bc = mr))
  var yv = { usingClientEntryPoint: !1, Events: [Ws, Hr, so, Uc, Mc, iu] },
    li = {
      findFiberByHostInstance: lr,
      bundleType: 0,
      version: "18.3.1",
      rendererPackageName: "react-dom",
    },
    vv = {
      bundleType: li.bundleType,
      version: li.version,
      rendererPackageName: li.rendererPackageName,
      rendererConfig: li.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: j.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return ((e = Hc(e)), e === null ? null : e.stateNode)
      },
      findFiberByHostInstance: li.findFiberByHostInstance || mv,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    }
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vo = __REACT_DEVTOOLS_GLOBAL_HOOK__
    if (!Vo.isDisabled && Vo.supportsFiber)
      try {
        ;((Mi = Vo.inject(vv)), (Xt = Vo))
      } catch {}
  }
  return (
    (St.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = yv),
    (St.createPortal = function (e, t) {
      var i =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null
      if (!pu(t)) throw Error(s(200))
      return pv(e, t, null, i)
    }),
    (St.createRoot = function (e, t) {
      if (!pu(e)) throw Error(s(299))
      var i = !1,
        l = "",
        u = wh
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (i = !0),
          t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
          t.onRecoverableError !== void 0 && (u = t.onRecoverableError)),
        (t = du(e, 1, !1, null, null, i, !1, l, u)),
        (e[cn] = t.current),
        qs(e.nodeType === 8 ? e.parentNode : e),
        new hu(t)
      )
    }),
    (St.findDOMNode = function (e) {
      if (e == null) return null
      if (e.nodeType === 1) return e
      var t = e._reactInternals
      if (t === void 0)
        throw typeof e.render == "function"
          ? Error(s(188))
          : ((e = Object.keys(e).join(",")), Error(s(268, e)))
      return ((e = Hc(t)), (e = e === null ? null : e.stateNode), e)
    }),
    (St.flushSync = function (e) {
      return mr(e)
    }),
    (St.hydrate = function (e, t, i) {
      if (!Bo(t)) throw Error(s(200))
      return $o(null, e, t, !0, i)
    }),
    (St.hydrateRoot = function (e, t, i) {
      if (!pu(e)) throw Error(s(405))
      var l = (i != null && i.hydratedSources) || null,
        u = !1,
        d = "",
        p = wh
      if (
        (i != null &&
          (i.unstable_strictMode === !0 && (u = !0),
          i.identifierPrefix !== void 0 && (d = i.identifierPrefix),
          i.onRecoverableError !== void 0 && (p = i.onRecoverableError)),
        (t = yh(t, null, e, 1, i ?? null, u, !1, d, p)),
        (e[cn] = t.current),
        qs(e),
        l)
      )
        for (e = 0; e < l.length; e++)
          ((i = l[e]),
            (u = i._getVersion),
            (u = u(i._source)),
            t.mutableSourceEagerHydrationData == null
              ? (t.mutableSourceEagerHydrationData = [i, u])
              : t.mutableSourceEagerHydrationData.push(i, u))
      return new zo(t)
    }),
    (St.render = function (e, t, i) {
      if (!Bo(t)) throw Error(s(200))
      return $o(null, e, t, !1, i)
    }),
    (St.unmountComponentAtNode = function (e) {
      if (!Bo(e)) throw Error(s(40))
      return e._reactRootContainer
        ? (mr(function () {
            $o(null, null, e, !1, function () {
              ;((e._reactRootContainer = null), (e[cn] = null))
            })
          }),
          !0)
        : !1
    }),
    (St.unstable_batchedUpdates = iu),
    (St.unstable_renderSubtreeIntoContainer = function (e, t, i, l) {
      if (!Bo(i)) throw Error(s(200))
      if (e == null || e._reactInternals === void 0) throw Error(s(38))
      return $o(e, t, i, !1, l)
    }),
    (St.version = "18.3.1-next-f1338f8080-20240426"),
    St
  )
}
var Ph
function Yp() {
  if (Ph) return vu.exports
  Ph = 1
  function r() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)
      } catch (n) {
        console.error(n)
      }
  }
  return (r(), (vu.exports = Tv()), vu.exports)
}
var Nh
function Pv() {
  if (Nh) return Ho
  Nh = 1
  var r = Yp()
  return ((Ho.createRoot = r.createRoot), (Ho.hydrateRoot = r.hydrateRoot), Ho)
}
var Nv = Pv()
const Ov = Gp(Nv),
  Av = 20,
  Lv = 1e6,
  kn = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
  }
let Su = 0
function jv() {
  return ((Su = (Su + 1) % Number.MAX_VALUE), Su.toString())
}
const ku = new Map(),
  Oh = (r) => {
    if (ku.has(r)) return
    const n = setTimeout(() => {
      ;(ku.delete(r), vi({ type: kn.REMOVE_TOAST, toastId: r }))
    }, Lv)
    ku.set(r, n)
  },
  Iv = (r, n) => {
    switch (n.type) {
      case kn.ADD_TOAST:
        return { ...r, toasts: [n.toast, ...r.toasts].slice(0, Av) }
      case kn.UPDATE_TOAST:
        return {
          ...r,
          toasts: r.toasts.map((s) =>
            s.id === n.toast.id ? { ...s, ...n.toast } : s,
          ),
        }
      case kn.DISMISS_TOAST: {
        const { toastId: s } = n
        return (
          s
            ? Oh(s)
            : r.toasts.forEach((o) => {
                Oh(o.id)
              }),
          {
            ...r,
            toasts: r.toasts.map((o) =>
              o.id === s || s === void 0 ? { ...o, open: !1 } : o,
            ),
          }
        )
      }
      case kn.REMOVE_TOAST:
        return n.toastId === void 0
          ? { ...r, toasts: [] }
          : { ...r, toasts: r.toasts.filter((s) => s.id !== n.toastId) }
    }
  },
  Xo = []
let Zo = { toasts: [] }
function vi(r) {
  ;((Zo = Iv(Zo, r)),
    Xo.forEach((n) => {
      n(Zo)
    }))
}
function Dv({ ...r }) {
  const n = jv(),
    s = (a) => vi({ type: kn.UPDATE_TOAST, toast: { ...a, id: n } }),
    o = () => vi({ type: kn.DISMISS_TOAST, toastId: n })
  return (
    vi({
      type: kn.ADD_TOAST,
      toast: {
        ...r,
        id: n,
        open: !0,
        onOpenChange: (a) => {
          a || o()
        },
      },
    }),
    { id: n, dismiss: o, update: s }
  )
}
function Fv() {
  const [r, n] = q.useState(Zo)
  return (
    q.useEffect(
      () => (
        Xo.push(n),
        () => {
          const s = Xo.indexOf(n)
          s > -1 && Xo.splice(s, 1)
        }
      ),
      [r],
    ),
    {
      ...r,
      toast: Dv,
      dismiss: (s) => vi({ type: kn.DISMISS_TOAST, toastId: s }),
    }
  )
}
function Jp(r) {
  var n,
    s,
    o = ""
  if (typeof r == "string" || typeof r == "number") o += r
  else if (typeof r == "object")
    if (Array.isArray(r)) {
      var a = r.length
      for (n = 0; n < a; n++)
        r[n] && (s = Jp(r[n])) && (o && (o += " "), (o += s))
    } else for (s in r) r[s] && (o && (o += " "), (o += s))
  return o
}
function Xp() {
  for (var r, n, s = 0, o = "", a = arguments.length; s < a; s++)
    (r = arguments[s]) && (n = Jp(r)) && (o && (o += " "), (o += n))
  return o
}
const Ah = (r) => (typeof r == "boolean" ? `${r}` : r === 0 ? "0" : r),
  Lh = Xp,
  Uv = (r, n) => (s) => {
    var o
    if ((n == null ? void 0 : n.variants) == null)
      return Lh(
        r,
        s == null ? void 0 : s.class,
        s == null ? void 0 : s.className,
      )
    const { variants: a, defaultVariants: c } = n,
      f = Object.keys(a).map((g) => {
        const y = s == null ? void 0 : s[g],
          S = c == null ? void 0 : c[g]
        if (y === null) return null
        const A = Ah(y) || Ah(S)
        return a[g][A]
      }),
      h =
        s &&
        Object.entries(s).reduce((g, y) => {
          let [S, A] = y
          return (A === void 0 || (g[S] = A), g)
        }, {}),
      m =
        n == null || (o = n.compoundVariants) === null || o === void 0
          ? void 0
          : o.reduce((g, y) => {
              let { class: S, className: A, ...L } = y
              return Object.entries(L).every((E) => {
                let [b, w] = E
                return Array.isArray(w)
                  ? w.includes({ ...c, ...h }[b])
                  : { ...c, ...h }[b] === w
              })
                ? [...g, S, A]
                : g
            }, [])
    return Lh(
      r,
      f,
      m,
      s == null ? void 0 : s.class,
      s == null ? void 0 : s.className,
    )
  }
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Mv = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Zp = (...r) =>
    r
      .filter((n, s, o) => !!n && n.trim() !== "" && o.indexOf(n) === s)
      .join(" ")
      .trim()
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var zv = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bv = q.forwardRef(
  (
    {
      color: r = "currentColor",
      size: n = 24,
      strokeWidth: s = 2,
      absoluteStrokeWidth: o,
      className: a = "",
      children: c,
      iconNode: f,
      ...h
    },
    m,
  ) =>
    q.createElement(
      "svg",
      {
        ref: m,
        ...zv,
        width: n,
        height: n,
        stroke: r,
        strokeWidth: o ? (Number(s) * 24) / Number(n) : s,
        className: Zp("lucide", a),
        ...h,
      },
      [
        ...f.map(([g, y]) => q.createElement(g, y)),
        ...(Array.isArray(c) ? c : [c]),
      ],
    ),
)
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ri = (r, n) => {
  const s = q.forwardRef(({ className: o, ...a }, c) =>
    q.createElement(Bv, {
      ref: c,
      iconNode: n,
      className: Zp(`lucide-${Mv(r)}`, o),
      ...a,
    }),
  )
  return ((s.displayName = `${r}`), s)
}
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $v = [
    ["path", { d: "M12 22V8", key: "qkxhtm" }],
    ["path", { d: "M5 12H2a10 10 0 0 0 20 0h-3", key: "1hv3nh" }],
    ["circle", { cx: "12", cy: "5", r: "3", key: "rqqgnr" }],
  ],
  Vv = Ri("Anchor", $v)
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qv = [
    ["path", { d: "M7 7h10v10", key: "1tivn9" }],
    ["path", { d: "M7 17 17 7", key: "1vkiza" }],
  ],
  uc = Ri("ArrowUpRight", qv)
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hv = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
  ],
  Qv = Ri("Shield", Hv)
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wv = [
    [
      "path",
      {
        d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        key: "knzxuh",
      },
    ],
    [
      "path",
      {
        d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        key: "2jd2cc",
      },
    ],
    [
      "path",
      {
        d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        key: "rd2r6e",
      },
    ],
  ],
  Kv = Ri("Waves", Wv)
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gv = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  Yv = Ri("X", Gv),
  Jv = (r, n) => {
    const s = new Array(r.length + n.length)
    for (let o = 0; o < r.length; o++) s[o] = r[o]
    for (let o = 0; o < n.length; o++) s[r.length + o] = n[o]
    return s
  },
  Xv = (r, n) => ({ classGroupId: r, validator: n }),
  em = (r = new Map(), n = null, s) => ({
    nextPart: r,
    validators: n,
    classGroupId: s,
  }),
  ll = "-",
  jh = [],
  Zv = "arbitrary..",
  e0 = (r) => {
    const n = n0(r),
      { conflictingClassGroups: s, conflictingClassGroupModifiers: o } = r
    return {
      getClassGroupId: (f) => {
        if (f.startsWith("[") && f.endsWith("]")) return t0(f)
        const h = f.split(ll),
          m = h[0] === "" && h.length > 1 ? 1 : 0
        return tm(h, m, n)
      },
      getConflictingClassGroupIds: (f, h) => {
        if (h) {
          const m = o[f],
            g = s[f]
          return m ? (g ? Jv(g, m) : m) : g || jh
        }
        return s[f] || jh
      },
    }
  },
  tm = (r, n, s) => {
    if (r.length - n === 0) return s.classGroupId
    const a = r[n],
      c = s.nextPart.get(a)
    if (c) {
      const g = tm(r, n + 1, c)
      if (g) return g
    }
    const f = s.validators
    if (f === null) return
    const h = n === 0 ? r.join(ll) : r.slice(n).join(ll),
      m = f.length
    for (let g = 0; g < m; g++) {
      const y = f[g]
      if (y.validator(h)) return y.classGroupId
    }
  },
  t0 = (r) =>
    r.slice(1, -1).indexOf(":") === -1
      ? void 0
      : (() => {
          const n = r.slice(1, -1),
            s = n.indexOf(":"),
            o = n.slice(0, s)
          return o ? Zv + o : void 0
        })(),
  n0 = (r) => {
    const { theme: n, classGroups: s } = r
    return r0(s, n)
  },
  r0 = (r, n) => {
    const s = em()
    for (const o in r) {
      const a = r[o]
      cc(a, s, o, n)
    }
    return s
  },
  cc = (r, n, s, o) => {
    const a = r.length
    for (let c = 0; c < a; c++) {
      const f = r[c]
      s0(f, n, s, o)
    }
  },
  s0 = (r, n, s, o) => {
    if (typeof r == "string") {
      i0(r, n, s)
      return
    }
    if (typeof r == "function") {
      o0(r, n, s, o)
      return
    }
    l0(r, n, s, o)
  },
  i0 = (r, n, s) => {
    const o = r === "" ? n : nm(n, r)
    o.classGroupId = s
  },
  o0 = (r, n, s, o) => {
    if (a0(r)) {
      cc(r(o), n, s, o)
      return
    }
    ;(n.validators === null && (n.validators = []), n.validators.push(Xv(s, r)))
  },
  l0 = (r, n, s, o) => {
    const a = Object.entries(r),
      c = a.length
    for (let f = 0; f < c; f++) {
      const [h, m] = a[f]
      cc(m, nm(n, h), s, o)
    }
  },
  nm = (r, n) => {
    let s = r
    const o = n.split(ll),
      a = o.length
    for (let c = 0; c < a; c++) {
      const f = o[c]
      let h = s.nextPart.get(f)
      ;(h || ((h = em()), s.nextPart.set(f, h)), (s = h))
    }
    return s
  },
  a0 = (r) => "isThemeGetter" in r && r.isThemeGetter === !0,
  u0 = (r) => {
    if (r < 1) return { get: () => {}, set: () => {} }
    let n = 0,
      s = Object.create(null),
      o = Object.create(null)
    const a = (c, f) => {
      ;((s[c] = f), n++, n > r && ((n = 0), (o = s), (s = Object.create(null))))
    }
    return {
      get(c) {
        let f = s[c]
        if (f !== void 0) return f
        if ((f = o[c]) !== void 0) return (a(c, f), f)
      },
      set(c, f) {
        c in s ? (s[c] = f) : a(c, f)
      },
    }
  },
  Lu = "!",
  Ih = ":",
  c0 = [],
  Dh = (r, n, s, o, a) => ({
    modifiers: r,
    hasImportantModifier: n,
    baseClassName: s,
    maybePostfixModifierPosition: o,
    isExternal: a,
  }),
  d0 = (r) => {
    const { prefix: n, experimentalParseClassName: s } = r
    let o = (a) => {
      const c = []
      let f = 0,
        h = 0,
        m = 0,
        g
      const y = a.length
      for (let b = 0; b < y; b++) {
        const w = a[b]
        if (f === 0 && h === 0) {
          if (w === Ih) {
            ;(c.push(a.slice(m, b)), (m = b + 1))
            continue
          }
          if (w === "/") {
            g = b
            continue
          }
        }
        w === "[" ? f++ : w === "]" ? f-- : w === "(" ? h++ : w === ")" && h--
      }
      const S = c.length === 0 ? a : a.slice(m)
      let A = S,
        L = !1
      S.endsWith(Lu)
        ? ((A = S.slice(0, -1)), (L = !0))
        : S.startsWith(Lu) && ((A = S.slice(1)), (L = !0))
      const E = g && g > m ? g - m : void 0
      return Dh(c, L, A, E)
    }
    if (n) {
      const a = n + Ih,
        c = o
      o = (f) =>
        f.startsWith(a) ? c(f.slice(a.length)) : Dh(c0, !1, f, void 0, !0)
    }
    if (s) {
      const a = o
      o = (c) => s({ className: c, parseClassName: a })
    }
    return o
  },
  f0 = (r) => {
    const n = new Map()
    return (
      r.orderSensitiveModifiers.forEach((s, o) => {
        n.set(s, 1e6 + o)
      }),
      (s) => {
        const o = []
        let a = []
        for (let c = 0; c < s.length; c++) {
          const f = s[c],
            h = f[0] === "[",
            m = n.has(f)
          h || m
            ? (a.length > 0 && (a.sort(), o.push(...a), (a = [])), o.push(f))
            : a.push(f)
        }
        return (a.length > 0 && (a.sort(), o.push(...a)), o)
      }
    )
  },
  h0 = (r) => ({
    cache: u0(r.cacheSize),
    parseClassName: d0(r),
    sortModifiers: f0(r),
    ...e0(r),
  }),
  p0 = /\s+/,
  m0 = (r, n) => {
    const {
        parseClassName: s,
        getClassGroupId: o,
        getConflictingClassGroupIds: a,
        sortModifiers: c,
      } = n,
      f = [],
      h = r.trim().split(p0)
    let m = ""
    for (let g = h.length - 1; g >= 0; g -= 1) {
      const y = h[g],
        {
          isExternal: S,
          modifiers: A,
          hasImportantModifier: L,
          baseClassName: E,
          maybePostfixModifierPosition: b,
        } = s(y)
      if (S) {
        m = y + (m.length > 0 ? " " + m : m)
        continue
      }
      let w = !!b,
        F = o(w ? E.substring(0, b) : E)
      if (!F) {
        if (!w) {
          m = y + (m.length > 0 ? " " + m : m)
          continue
        }
        if (((F = o(E)), !F)) {
          m = y + (m.length > 0 ? " " + m : m)
          continue
        }
        w = !1
      }
      const Q = A.length === 0 ? "" : A.length === 1 ? A[0] : c(A).join(":"),
        B = L ? Q + Lu : Q,
        j = B + F
      if (f.indexOf(j) > -1) continue
      f.push(j)
      const K = a(F, w)
      for (let ne = 0; ne < K.length; ++ne) {
        const se = K[ne]
        f.push(B + se)
      }
      m = y + (m.length > 0 ? " " + m : m)
    }
    return m
  },
  g0 = (...r) => {
    let n = 0,
      s,
      o,
      a = ""
    for (; n < r.length; )
      (s = r[n++]) && (o = rm(s)) && (a && (a += " "), (a += o))
    return a
  },
  rm = (r) => {
    if (typeof r == "string") return r
    let n,
      s = ""
    for (let o = 0; o < r.length; o++)
      r[o] && (n = rm(r[o])) && (s && (s += " "), (s += n))
    return s
  },
  y0 = (r, ...n) => {
    let s, o, a, c
    const f = (m) => {
        const g = n.reduce((y, S) => S(y), r())
        return (
          (s = h0(g)),
          (o = s.cache.get),
          (a = s.cache.set),
          (c = h),
          h(m)
        )
      },
      h = (m) => {
        const g = o(m)
        if (g) return g
        const y = m0(m, s)
        return (a(m, y), y)
      }
    return ((c = f), (...m) => c(g0(...m)))
  },
  v0 = [],
  Je = (r) => {
    const n = (s) => s[r] || v0
    return ((n.isThemeGetter = !0), n)
  },
  sm = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  im = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  w0 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  x0 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  S0 =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  k0 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  E0 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  _0 =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  qn = (r) => w0.test(r),
  ve = (r) => !!r && !Number.isNaN(Number(r)),
  Hn = (r) => !!r && Number.isInteger(Number(r)),
  Eu = (r) => r.endsWith("%") && ve(r.slice(0, -1)),
  vn = (r) => x0.test(r),
  om = () => !0,
  b0 = (r) => S0.test(r) && !k0.test(r),
  dc = () => !1,
  C0 = (r) => E0.test(r),
  R0 = (r) => _0.test(r),
  T0 = (r) => !X(r) && !Z(r),
  P0 = (r) => sr(r, um, dc),
  X = (r) => sm.test(r),
  wr = (r) => sr(r, cm, b0),
  Fh = (r) => sr(r, F0, ve),
  N0 = (r) => sr(r, fm, om),
  O0 = (r) => sr(r, dm, dc),
  Uh = (r) => sr(r, lm, dc),
  A0 = (r) => sr(r, am, R0),
  Qo = (r) => sr(r, hm, C0),
  Z = (r) => im.test(r),
  ui = (r) => jr(r, cm),
  L0 = (r) => jr(r, dm),
  Mh = (r) => jr(r, lm),
  j0 = (r) => jr(r, um),
  I0 = (r) => jr(r, am),
  Wo = (r) => jr(r, hm, !0),
  D0 = (r) => jr(r, fm, !0),
  sr = (r, n, s) => {
    const o = sm.exec(r)
    return o ? (o[1] ? n(o[1]) : s(o[2])) : !1
  },
  jr = (r, n, s = !1) => {
    const o = im.exec(r)
    return o ? (o[1] ? n(o[1]) : s) : !1
  },
  lm = (r) => r === "position" || r === "percentage",
  am = (r) => r === "image" || r === "url",
  um = (r) => r === "length" || r === "size" || r === "bg-size",
  cm = (r) => r === "length",
  F0 = (r) => r === "number",
  dm = (r) => r === "family-name",
  fm = (r) => r === "number" || r === "weight",
  hm = (r) => r === "shadow",
  U0 = () => {
    const r = Je("color"),
      n = Je("font"),
      s = Je("text"),
      o = Je("font-weight"),
      a = Je("tracking"),
      c = Je("leading"),
      f = Je("breakpoint"),
      h = Je("container"),
      m = Je("spacing"),
      g = Je("radius"),
      y = Je("shadow"),
      S = Je("inset-shadow"),
      A = Je("text-shadow"),
      L = Je("drop-shadow"),
      E = Je("blur"),
      b = Je("perspective"),
      w = Je("aspect"),
      F = Je("ease"),
      Q = Je("animate"),
      B = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      j = () => [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "left-top",
        "top-right",
        "right-top",
        "bottom-right",
        "right-bottom",
        "bottom-left",
        "left-bottom",
      ],
      K = () => [...j(), Z, X],
      ne = () => ["auto", "hidden", "clip", "visible", "scroll"],
      se = () => ["auto", "contain", "none"],
      z = () => [Z, X, m],
      ce = () => [qn, "full", "auto", ...z()],
      le = () => [Hn, "none", "subgrid", Z, X],
      Oe = () => ["auto", { span: ["full", Hn, Z, X] }, Hn, Z, X],
      je = () => [Hn, "auto", Z, X],
      Ie = () => ["auto", "min", "max", "fr", Z, X],
      Ne = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
        "baseline",
        "center-safe",
        "end-safe",
      ],
      De = () => [
        "start",
        "end",
        "center",
        "stretch",
        "center-safe",
        "end-safe",
      ],
      ye = () => ["auto", ...z()],
      Ee = () => [
        qn,
        "auto",
        "full",
        "dvw",
        "dvh",
        "lvw",
        "lvh",
        "svw",
        "svh",
        "min",
        "max",
        "fit",
        ...z(),
      ],
      H = () => [
        qn,
        "screen",
        "full",
        "dvw",
        "lvw",
        "svw",
        "min",
        "max",
        "fit",
        ...z(),
      ],
      re = () => [
        qn,
        "screen",
        "full",
        "lh",
        "dvh",
        "lvh",
        "svh",
        "min",
        "max",
        "fit",
        ...z(),
      ],
      I = () => [r, Z, X],
      C = () => [...j(), Mh, Uh, { position: [Z, X] }],
      D = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
      pe = () => ["auto", "cover", "contain", j0, P0, { size: [Z, X] }],
      me = () => [Eu, ui, wr],
      ae = () => ["", "none", "full", g, Z, X],
      de = () => ["", ve, ui, wr],
      Re = () => ["solid", "dashed", "dotted", "double"],
      be = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      ge = () => [ve, Eu, Mh, Uh],
      ot = () => ["", "none", E, Z, X],
      un = () => ["none", ve, Z, X],
      ir = () => ["none", ve, Z, X],
      En = () => [ve, Z, X],
      _n = () => [qn, "full", ...z()]
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [vn],
        breakpoint: [vn],
        color: [om],
        container: [vn],
        "drop-shadow": [vn],
        ease: ["in", "out", "in-out"],
        font: [T0],
        "font-weight": [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ],
        "inset-shadow": [vn],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: [
          "dramatic",
          "near",
          "normal",
          "midrange",
          "distant",
          "none",
        ],
        radius: [vn],
        shadow: [vn],
        spacing: ["px", ve],
        text: [vn],
        "text-shadow": [vn],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", qn, X, Z, w] }],
        container: ["container"],
        columns: [{ columns: [ve, X, Z, h] }],
        "break-after": [{ "break-after": B() }],
        "break-before": [{ "break-before": B() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        sr: ["sr-only", "not-sr-only"],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: K() }],
        overflow: [{ overflow: ne() }],
        "overflow-x": [{ "overflow-x": ne() }],
        "overflow-y": [{ "overflow-y": ne() }],
        overscroll: [{ overscroll: se() }],
        "overscroll-x": [{ "overscroll-x": se() }],
        "overscroll-y": [{ "overscroll-y": se() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: ce() }],
        "inset-x": [{ "inset-x": ce() }],
        "inset-y": [{ "inset-y": ce() }],
        start: [{ "inset-s": ce(), start: ce() }],
        end: [{ "inset-e": ce(), end: ce() }],
        "inset-bs": [{ "inset-bs": ce() }],
        "inset-be": [{ "inset-be": ce() }],
        top: [{ top: ce() }],
        right: [{ right: ce() }],
        bottom: [{ bottom: ce() }],
        left: [{ left: ce() }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: [Hn, "auto", Z, X] }],
        basis: [{ basis: [qn, "full", "auto", h, ...z()] }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
        flex: [{ flex: [ve, qn, "auto", "initial", "none", X] }],
        grow: [{ grow: ["", ve, Z, X] }],
        shrink: [{ shrink: ["", ve, Z, X] }],
        order: [{ order: [Hn, "first", "last", "none", Z, X] }],
        "grid-cols": [{ "grid-cols": le() }],
        "col-start-end": [{ col: Oe() }],
        "col-start": [{ "col-start": je() }],
        "col-end": [{ "col-end": je() }],
        "grid-rows": [{ "grid-rows": le() }],
        "row-start-end": [{ row: Oe() }],
        "row-start": [{ "row-start": je() }],
        "row-end": [{ "row-end": je() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": Ie() }],
        "auto-rows": [{ "auto-rows": Ie() }],
        gap: [{ gap: z() }],
        "gap-x": [{ "gap-x": z() }],
        "gap-y": [{ "gap-y": z() }],
        "justify-content": [{ justify: [...Ne(), "normal"] }],
        "justify-items": [{ "justify-items": [...De(), "normal"] }],
        "justify-self": [{ "justify-self": ["auto", ...De()] }],
        "align-content": [{ content: ["normal", ...Ne()] }],
        "align-items": [{ items: [...De(), { baseline: ["", "last"] }] }],
        "align-self": [{ self: ["auto", ...De(), { baseline: ["", "last"] }] }],
        "place-content": [{ "place-content": Ne() }],
        "place-items": [{ "place-items": [...De(), "baseline"] }],
        "place-self": [{ "place-self": ["auto", ...De()] }],
        p: [{ p: z() }],
        px: [{ px: z() }],
        py: [{ py: z() }],
        ps: [{ ps: z() }],
        pe: [{ pe: z() }],
        pbs: [{ pbs: z() }],
        pbe: [{ pbe: z() }],
        pt: [{ pt: z() }],
        pr: [{ pr: z() }],
        pb: [{ pb: z() }],
        pl: [{ pl: z() }],
        m: [{ m: ye() }],
        mx: [{ mx: ye() }],
        my: [{ my: ye() }],
        ms: [{ ms: ye() }],
        me: [{ me: ye() }],
        mbs: [{ mbs: ye() }],
        mbe: [{ mbe: ye() }],
        mt: [{ mt: ye() }],
        mr: [{ mr: ye() }],
        mb: [{ mb: ye() }],
        ml: [{ ml: ye() }],
        "space-x": [{ "space-x": z() }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": z() }],
        "space-y-reverse": ["space-y-reverse"],
        size: [{ size: Ee() }],
        "inline-size": [{ inline: ["auto", ...H()] }],
        "min-inline-size": [{ "min-inline": ["auto", ...H()] }],
        "max-inline-size": [{ "max-inline": ["none", ...H()] }],
        "block-size": [{ block: ["auto", ...re()] }],
        "min-block-size": [{ "min-block": ["auto", ...re()] }],
        "max-block-size": [{ "max-block": ["none", ...re()] }],
        w: [{ w: [h, "screen", ...Ee()] }],
        "min-w": [{ "min-w": [h, "screen", "none", ...Ee()] }],
        "max-w": [
          { "max-w": [h, "screen", "none", "prose", { screen: [f] }, ...Ee()] },
        ],
        h: [{ h: ["screen", "lh", ...Ee()] }],
        "min-h": [{ "min-h": ["screen", "lh", "none", ...Ee()] }],
        "max-h": [{ "max-h": ["screen", "lh", ...Ee()] }],
        "font-size": [{ text: ["base", s, ui, wr] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [{ font: [o, D0, N0] }],
        "font-stretch": [
          {
            "font-stretch": [
              "ultra-condensed",
              "extra-condensed",
              "condensed",
              "semi-condensed",
              "normal",
              "semi-expanded",
              "expanded",
              "extra-expanded",
              "ultra-expanded",
              Eu,
              X,
            ],
          },
        ],
        "font-family": [{ font: [L0, O0, n] }],
        "font-features": [{ "font-features": [X] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [{ tracking: [a, Z, X] }],
        "line-clamp": [{ "line-clamp": [ve, "none", Z, Fh] }],
        leading: [{ leading: [c, ...z()] }],
        "list-image": [{ "list-image": ["none", Z, X] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "list-style-type": [{ list: ["disc", "decimal", "none", Z, X] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "placeholder-color": [{ placeholder: I() }],
        "text-color": [{ text: I() }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...Re(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: [ve, "from-font", "auto", Z, wr] },
        ],
        "text-decoration-color": [{ decoration: I() }],
        "underline-offset": [{ "underline-offset": [ve, "auto", Z, X] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: z() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              Z,
              X,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", Z, X] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: C() }],
        "bg-repeat": [{ bg: D() }],
        "bg-size": [{ bg: pe() }],
        "bg-image": [
          {
            bg: [
              "none",
              {
                linear: [
                  { to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
                  Hn,
                  Z,
                  X,
                ],
                radial: ["", Z, X],
                conic: [Hn, Z, X],
              },
              I0,
              A0,
            ],
          },
        ],
        "bg-color": [{ bg: I() }],
        "gradient-from-pos": [{ from: me() }],
        "gradient-via-pos": [{ via: me() }],
        "gradient-to-pos": [{ to: me() }],
        "gradient-from": [{ from: I() }],
        "gradient-via": [{ via: I() }],
        "gradient-to": [{ to: I() }],
        rounded: [{ rounded: ae() }],
        "rounded-s": [{ "rounded-s": ae() }],
        "rounded-e": [{ "rounded-e": ae() }],
        "rounded-t": [{ "rounded-t": ae() }],
        "rounded-r": [{ "rounded-r": ae() }],
        "rounded-b": [{ "rounded-b": ae() }],
        "rounded-l": [{ "rounded-l": ae() }],
        "rounded-ss": [{ "rounded-ss": ae() }],
        "rounded-se": [{ "rounded-se": ae() }],
        "rounded-ee": [{ "rounded-ee": ae() }],
        "rounded-es": [{ "rounded-es": ae() }],
        "rounded-tl": [{ "rounded-tl": ae() }],
        "rounded-tr": [{ "rounded-tr": ae() }],
        "rounded-br": [{ "rounded-br": ae() }],
        "rounded-bl": [{ "rounded-bl": ae() }],
        "border-w": [{ border: de() }],
        "border-w-x": [{ "border-x": de() }],
        "border-w-y": [{ "border-y": de() }],
        "border-w-s": [{ "border-s": de() }],
        "border-w-e": [{ "border-e": de() }],
        "border-w-bs": [{ "border-bs": de() }],
        "border-w-be": [{ "border-be": de() }],
        "border-w-t": [{ "border-t": de() }],
        "border-w-r": [{ "border-r": de() }],
        "border-w-b": [{ "border-b": de() }],
        "border-w-l": [{ "border-l": de() }],
        "divide-x": [{ "divide-x": de() }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": de() }],
        "divide-y-reverse": ["divide-y-reverse"],
        "border-style": [{ border: [...Re(), "hidden", "none"] }],
        "divide-style": [{ divide: [...Re(), "hidden", "none"] }],
        "border-color": [{ border: I() }],
        "border-color-x": [{ "border-x": I() }],
        "border-color-y": [{ "border-y": I() }],
        "border-color-s": [{ "border-s": I() }],
        "border-color-e": [{ "border-e": I() }],
        "border-color-bs": [{ "border-bs": I() }],
        "border-color-be": [{ "border-be": I() }],
        "border-color-t": [{ "border-t": I() }],
        "border-color-r": [{ "border-r": I() }],
        "border-color-b": [{ "border-b": I() }],
        "border-color-l": [{ "border-l": I() }],
        "divide-color": [{ divide: I() }],
        "outline-style": [{ outline: [...Re(), "none", "hidden"] }],
        "outline-offset": [{ "outline-offset": [ve, Z, X] }],
        "outline-w": [{ outline: ["", ve, ui, wr] }],
        "outline-color": [{ outline: I() }],
        shadow: [{ shadow: ["", "none", y, Wo, Qo] }],
        "shadow-color": [{ shadow: I() }],
        "inset-shadow": [{ "inset-shadow": ["none", S, Wo, Qo] }],
        "inset-shadow-color": [{ "inset-shadow": I() }],
        "ring-w": [{ ring: de() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: I() }],
        "ring-offset-w": [{ "ring-offset": [ve, wr] }],
        "ring-offset-color": [{ "ring-offset": I() }],
        "inset-ring-w": [{ "inset-ring": de() }],
        "inset-ring-color": [{ "inset-ring": I() }],
        "text-shadow": [{ "text-shadow": ["none", A, Wo, Qo] }],
        "text-shadow-color": [{ "text-shadow": I() }],
        opacity: [{ opacity: [ve, Z, X] }],
        "mix-blend": [
          { "mix-blend": [...be(), "plus-darker", "plus-lighter"] },
        ],
        "bg-blend": [{ "bg-blend": be() }],
        "mask-clip": [
          {
            "mask-clip": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
          "mask-no-clip",
        ],
        "mask-composite": [
          { mask: ["add", "subtract", "intersect", "exclude"] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [ve] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": ge() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": ge() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": I() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": I() }],
        "mask-image-t-from-pos": [{ "mask-t-from": ge() }],
        "mask-image-t-to-pos": [{ "mask-t-to": ge() }],
        "mask-image-t-from-color": [{ "mask-t-from": I() }],
        "mask-image-t-to-color": [{ "mask-t-to": I() }],
        "mask-image-r-from-pos": [{ "mask-r-from": ge() }],
        "mask-image-r-to-pos": [{ "mask-r-to": ge() }],
        "mask-image-r-from-color": [{ "mask-r-from": I() }],
        "mask-image-r-to-color": [{ "mask-r-to": I() }],
        "mask-image-b-from-pos": [{ "mask-b-from": ge() }],
        "mask-image-b-to-pos": [{ "mask-b-to": ge() }],
        "mask-image-b-from-color": [{ "mask-b-from": I() }],
        "mask-image-b-to-color": [{ "mask-b-to": I() }],
        "mask-image-l-from-pos": [{ "mask-l-from": ge() }],
        "mask-image-l-to-pos": [{ "mask-l-to": ge() }],
        "mask-image-l-from-color": [{ "mask-l-from": I() }],
        "mask-image-l-to-color": [{ "mask-l-to": I() }],
        "mask-image-x-from-pos": [{ "mask-x-from": ge() }],
        "mask-image-x-to-pos": [{ "mask-x-to": ge() }],
        "mask-image-x-from-color": [{ "mask-x-from": I() }],
        "mask-image-x-to-color": [{ "mask-x-to": I() }],
        "mask-image-y-from-pos": [{ "mask-y-from": ge() }],
        "mask-image-y-to-pos": [{ "mask-y-to": ge() }],
        "mask-image-y-from-color": [{ "mask-y-from": I() }],
        "mask-image-y-to-color": [{ "mask-y-to": I() }],
        "mask-image-radial": [{ "mask-radial": [Z, X] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": ge() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": ge() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": I() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": I() }],
        "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: ["side", "corner"], farthest: ["side", "corner"] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": j() }],
        "mask-image-conic-pos": [{ "mask-conic": [ve] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": ge() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": ge() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": I() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": I() }],
        "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
        "mask-origin": [
          {
            "mask-origin": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
        ],
        "mask-position": [{ mask: C() }],
        "mask-repeat": [{ mask: D() }],
        "mask-size": [{ mask: pe() }],
        "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
        "mask-image": [{ mask: ["none", Z, X] }],
        filter: [{ filter: ["", "none", Z, X] }],
        blur: [{ blur: ot() }],
        brightness: [{ brightness: [ve, Z, X] }],
        contrast: [{ contrast: [ve, Z, X] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", L, Wo, Qo] }],
        "drop-shadow-color": [{ "drop-shadow": I() }],
        grayscale: [{ grayscale: ["", ve, Z, X] }],
        "hue-rotate": [{ "hue-rotate": [ve, Z, X] }],
        invert: [{ invert: ["", ve, Z, X] }],
        saturate: [{ saturate: [ve, Z, X] }],
        sepia: [{ sepia: ["", ve, Z, X] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none", Z, X] }],
        "backdrop-blur": [{ "backdrop-blur": ot() }],
        "backdrop-brightness": [{ "backdrop-brightness": [ve, Z, X] }],
        "backdrop-contrast": [{ "backdrop-contrast": [ve, Z, X] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": ["", ve, Z, X] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [ve, Z, X] }],
        "backdrop-invert": [{ "backdrop-invert": ["", ve, Z, X] }],
        "backdrop-opacity": [{ "backdrop-opacity": [ve, Z, X] }],
        "backdrop-saturate": [{ "backdrop-saturate": [ve, Z, X] }],
        "backdrop-sepia": [{ "backdrop-sepia": ["", ve, Z, X] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": z() }],
        "border-spacing-x": [{ "border-spacing-x": z() }],
        "border-spacing-y": [{ "border-spacing-y": z() }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "",
              "all",
              "colors",
              "opacity",
              "shadow",
              "transform",
              "none",
              Z,
              X,
            ],
          },
        ],
        "transition-behavior": [{ transition: ["normal", "discrete"] }],
        duration: [{ duration: [ve, "initial", Z, X] }],
        ease: [{ ease: ["linear", "initial", F, Z, X] }],
        delay: [{ delay: [ve, Z, X] }],
        animate: [{ animate: ["none", Q, Z, X] }],
        backface: [{ backface: ["hidden", "visible"] }],
        perspective: [{ perspective: [b, Z, X] }],
        "perspective-origin": [{ "perspective-origin": K() }],
        rotate: [{ rotate: un() }],
        "rotate-x": [{ "rotate-x": un() }],
        "rotate-y": [{ "rotate-y": un() }],
        "rotate-z": [{ "rotate-z": un() }],
        scale: [{ scale: ir() }],
        "scale-x": [{ "scale-x": ir() }],
        "scale-y": [{ "scale-y": ir() }],
        "scale-z": [{ "scale-z": ir() }],
        "scale-3d": ["scale-3d"],
        skew: [{ skew: En() }],
        "skew-x": [{ "skew-x": En() }],
        "skew-y": [{ "skew-y": En() }],
        transform: [{ transform: [Z, X, "", "none", "gpu", "cpu"] }],
        "transform-origin": [{ origin: K() }],
        "transform-style": [{ transform: ["3d", "flat"] }],
        translate: [{ translate: _n() }],
        "translate-x": [{ "translate-x": _n() }],
        "translate-y": [{ "translate-y": _n() }],
        "translate-z": [{ "translate-z": _n() }],
        "translate-none": ["translate-none"],
        accent: [{ accent: I() }],
        appearance: [{ appearance: ["none", "auto"] }],
        "caret-color": [{ caret: I() }],
        "color-scheme": [
          {
            scheme: [
              "normal",
              "dark",
              "light",
              "light-dark",
              "only-dark",
              "only-light",
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              Z,
              X,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
        "pointer-events": [{ "pointer-events": ["auto", "none"] }],
        resize: [{ resize: ["none", "", "y", "x"] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": z() }],
        "scroll-mx": [{ "scroll-mx": z() }],
        "scroll-my": [{ "scroll-my": z() }],
        "scroll-ms": [{ "scroll-ms": z() }],
        "scroll-me": [{ "scroll-me": z() }],
        "scroll-mbs": [{ "scroll-mbs": z() }],
        "scroll-mbe": [{ "scroll-mbe": z() }],
        "scroll-mt": [{ "scroll-mt": z() }],
        "scroll-mr": [{ "scroll-mr": z() }],
        "scroll-mb": [{ "scroll-mb": z() }],
        "scroll-ml": [{ "scroll-ml": z() }],
        "scroll-p": [{ "scroll-p": z() }],
        "scroll-px": [{ "scroll-px": z() }],
        "scroll-py": [{ "scroll-py": z() }],
        "scroll-ps": [{ "scroll-ps": z() }],
        "scroll-pe": [{ "scroll-pe": z() }],
        "scroll-pbs": [{ "scroll-pbs": z() }],
        "scroll-pbe": [{ "scroll-pbe": z() }],
        "scroll-pt": [{ "scroll-pt": z() }],
        "scroll-pr": [{ "scroll-pr": z() }],
        "scroll-pb": [{ "scroll-pb": z() }],
        "scroll-pl": [{ "scroll-pl": z() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          { "will-change": ["auto", "scroll", "contents", "transform", Z, X] },
        ],
        fill: [{ fill: ["none", ...I()] }],
        "stroke-w": [{ stroke: [ve, ui, wr, Fh] }],
        stroke: [{ stroke: ["none", ...I()] }],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "inset-bs",
          "inset-be",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-x",
          "border-w-y",
          "border-w-s",
          "border-w-e",
          "border-w-bs",
          "border-w-be",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-x",
          "border-color-y",
          "border-color-s",
          "border-color-e",
          "border-color-bs",
          "border-color-be",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": [
          "translate",
          "translate-x",
          "translate-y",
          "translate-z",
        ],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mbs",
          "scroll-mbe",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pbs",
          "scroll-pbe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
      orderSensitiveModifiers: [
        "*",
        "**",
        "after",
        "backdrop",
        "before",
        "details-content",
        "file",
        "first-letter",
        "first-line",
        "marker",
        "placeholder",
        "selection",
      ],
    }
  },
  M0 = y0(U0)
function Ti(...r) {
  return M0(Xp(r))
}
const pm = q.forwardRef(({ ...r }, n) =>
  R.jsx("div", {
    ref: n,
    className:
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
    ...r,
  }),
)
pm.displayName = "ToastProvider"
const mm = q.forwardRef(({ ...r }, n) =>
  R.jsx("div", {
    ref: n,
    className:
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
    ...r,
  }),
)
mm.displayName = "ToastViewport"
const z0 = Uv(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
      variants: {
        variant: {
          default: "border bg-background text-foreground",
          destructive:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
        },
      },
      defaultVariants: { variant: "default" },
    },
  ),
  gm = q.forwardRef(({ className: r, variant: n, ...s }, o) =>
    R.jsx("div", { ref: o, className: Ti(z0({ variant: n }), r), ...s }),
  )
gm.displayName = "Toast"
const B0 = q.forwardRef(({ className: r, ...n }, s) =>
  R.jsx("div", {
    ref: s,
    className: Ti(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      r,
    ),
    ...n,
  }),
)
B0.displayName = "ToastAction"
const ym = q.forwardRef(({ className: r, ...n }, s) =>
  R.jsx("button", {
    ref: s,
    className: Ti(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      r,
    ),
    "toast-close": "",
    ...n,
    children: R.jsx(Yv, { className: "h-4 w-4" }),
  }),
)
ym.displayName = "ToastClose"
const vm = q.forwardRef(({ className: r, ...n }, s) =>
  R.jsx("div", { ref: s, className: Ti("text-sm font-semibold", r), ...n }),
)
vm.displayName = "ToastTitle"
const wm = q.forwardRef(({ className: r, ...n }, s) =>
  R.jsx("div", { ref: s, className: Ti("text-sm opacity-90", r), ...n }),
)
wm.displayName = "ToastDescription"
function $0() {
  const { toasts: r } = Fv()
  return R.jsxs(pm, {
    children: [
      r.map(function ({ id: n, title: s, description: o, action: a, ...c }) {
        return R.jsxs(
          gm,
          {
            ...c,
            children: [
              R.jsxs("div", {
                className: "grid gap-1",
                children: [
                  s && R.jsx(vm, { children: s }),
                  o && R.jsx(wm, { children: o }),
                ],
              }),
              a,
              R.jsx(ym, {}),
            ],
          },
          n,
        )
      }),
      R.jsx(mm, {}),
    ],
  })
}
var Pi = class {
    constructor() {
      ;((this.listeners = new Set()),
        (this.subscribe = this.subscribe.bind(this)))
    }
    subscribe(r) {
      return (
        this.listeners.add(r),
        this.onSubscribe(),
        () => {
          ;(this.listeners.delete(r), this.onUnsubscribe())
        }
      )
    }
    hasListeners() {
      return this.listeners.size > 0
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  V0 = {
    setTimeout: (r, n) => setTimeout(r, n),
    clearTimeout: (r) => clearTimeout(r),
    setInterval: (r, n) => setInterval(r, n),
    clearInterval: (r) => clearInterval(r),
  },
  Wn,
  lc,
  Mp,
  q0 =
    ((Mp = class {
      constructor() {
        ue(this, Wn, V0)
        ue(this, lc, !1)
      }
      setTimeoutProvider(r) {
        G(this, Wn, r)
      }
      setTimeout(r, n) {
        return k(this, Wn).setTimeout(r, n)
      }
      clearTimeout(r) {
        k(this, Wn).clearTimeout(r)
      }
      setInterval(r, n) {
        return k(this, Wn).setInterval(r, n)
      }
      clearInterval(r) {
        k(this, Wn).clearInterval(r)
      }
    }),
    (Wn = new WeakMap()),
    (lc = new WeakMap()),
    Mp),
  xr = new q0()
function H0(r) {
  setTimeout(r, 0)
}
var Ar = typeof window > "u" || "Deno" in globalThis
function Et() {}
function Q0(r, n) {
  return typeof r == "function" ? r(n) : r
}
function ju(r) {
  return typeof r == "number" && r >= 0 && r !== 1 / 0
}
function xm(r, n) {
  return Math.max(r + (n || 0) - Date.now(), 0)
}
function nr(r, n) {
  return typeof r == "function" ? r(n) : r
}
function Mt(r, n) {
  return typeof r == "function" ? r(n) : r
}
function zh(r, n) {
  const {
    type: s = "all",
    exact: o,
    fetchStatus: a,
    predicate: c,
    queryKey: f,
    stale: h,
  } = r
  if (f) {
    if (o) {
      if (n.queryHash !== fc(f, n.options)) return !1
    } else if (!Si(n.queryKey, f)) return !1
  }
  if (s !== "all") {
    const m = n.isActive()
    if ((s === "active" && !m) || (s === "inactive" && m)) return !1
  }
  return !(
    (typeof h == "boolean" && n.isStale() !== h) ||
    (a && a !== n.state.fetchStatus) ||
    (c && !c(n))
  )
}
function Bh(r, n) {
  const { exact: s, status: o, predicate: a, mutationKey: c } = r
  if (c) {
    if (!n.options.mutationKey) return !1
    if (s) {
      if (xi(n.options.mutationKey) !== xi(c)) return !1
    } else if (!Si(n.options.mutationKey, c)) return !1
  }
  return !((o && n.state.status !== o) || (a && !a(n)))
}
function fc(r, n) {
  return ((n == null ? void 0 : n.queryKeyHashFn) || xi)(r)
}
function xi(r) {
  return JSON.stringify(r, (n, s) =>
    Du(s)
      ? Object.keys(s)
          .sort()
          .reduce((o, a) => ((o[a] = s[a]), o), {})
      : s,
  )
}
function Si(r, n) {
  return r === n
    ? !0
    : typeof r != typeof n
      ? !1
      : r && n && typeof r == "object" && typeof n == "object"
        ? Object.keys(n).every((s) => Si(r[s], n[s]))
        : !1
}
var W0 = Object.prototype.hasOwnProperty
function Sm(r, n, s = 0) {
  if (r === n) return r
  if (s > 500) return n
  const o = $h(r) && $h(n)
  if (!o && !(Du(r) && Du(n))) return n
  const c = (o ? r : Object.keys(r)).length,
    f = o ? n : Object.keys(n),
    h = f.length,
    m = o ? new Array(h) : {}
  let g = 0
  for (let y = 0; y < h; y++) {
    const S = o ? y : f[y],
      A = r[S],
      L = n[S]
    if (A === L) {
      ;((m[S] = A), (o ? y < c : W0.call(r, S)) && g++)
      continue
    }
    if (
      A === null ||
      L === null ||
      typeof A != "object" ||
      typeof L != "object"
    ) {
      m[S] = L
      continue
    }
    const E = Sm(A, L, s + 1)
    ;((m[S] = E), E === A && g++)
  }
  return c === h && g === c ? r : m
}
function Iu(r, n) {
  if (!n || Object.keys(r).length !== Object.keys(n).length) return !1
  for (const s in r) if (r[s] !== n[s]) return !1
  return !0
}
function $h(r) {
  return Array.isArray(r) && r.length === Object.keys(r).length
}
function Du(r) {
  if (!Vh(r)) return !1
  const n = r.constructor
  if (n === void 0) return !0
  const s = n.prototype
  return !(
    !Vh(s) ||
    !s.hasOwnProperty("isPrototypeOf") ||
    Object.getPrototypeOf(r) !== Object.prototype
  )
}
function Vh(r) {
  return Object.prototype.toString.call(r) === "[object Object]"
}
function K0(r) {
  return new Promise((n) => {
    xr.setTimeout(n, r)
  })
}
function Fu(r, n, s) {
  return typeof s.structuralSharing == "function"
    ? s.structuralSharing(r, n)
    : s.structuralSharing !== !1
      ? Sm(r, n)
      : n
}
function G0(r, n, s = 0) {
  const o = [...r, n]
  return s && o.length > s ? o.slice(1) : o
}
function Y0(r, n, s = 0) {
  const o = [n, ...r]
  return s && o.length > s ? o.slice(0, -1) : o
}
var hc = Symbol()
function km(r, n) {
  return !r.queryFn && n != null && n.initialPromise
    ? () => n.initialPromise
    : !r.queryFn || r.queryFn === hc
      ? () => Promise.reject(new Error(`Missing queryFn: '${r.queryHash}'`))
      : r.queryFn
}
function Em(r, n) {
  return typeof r == "function" ? r(...n) : !!r
}
function J0(r, n, s) {
  let o = !1,
    a
  return (
    Object.defineProperty(r, "signal", {
      enumerable: !0,
      get: () => (
        a ?? (a = n()),
        o ||
          ((o = !0),
          a.aborted ? s() : a.addEventListener("abort", s, { once: !0 })),
        a
      ),
    }),
    r
  )
}
var kr,
  Kn,
  as,
  zp,
  X0 =
    ((zp = class extends Pi {
      constructor() {
        super()
        ue(this, kr)
        ue(this, Kn)
        ue(this, as)
        G(this, as, (n) => {
          if (!Ar && window.addEventListener) {
            const s = () => n()
            return (
              window.addEventListener("visibilitychange", s, !1),
              () => {
                window.removeEventListener("visibilitychange", s)
              }
            )
          }
        })
      }
      onSubscribe() {
        k(this, Kn) || this.setEventListener(k(this, as))
      }
      onUnsubscribe() {
        var n
        this.hasListeners() ||
          ((n = k(this, Kn)) == null || n.call(this), G(this, Kn, void 0))
      }
      setEventListener(n) {
        var s
        ;(G(this, as, n),
          (s = k(this, Kn)) == null || s.call(this),
          G(
            this,
            Kn,
            n((o) => {
              typeof o == "boolean" ? this.setFocused(o) : this.onFocus()
            }),
          ))
      }
      setFocused(n) {
        k(this, kr) !== n && (G(this, kr, n), this.onFocus())
      }
      onFocus() {
        const n = this.isFocused()
        this.listeners.forEach((s) => {
          s(n)
        })
      }
      isFocused() {
        var n
        return typeof k(this, kr) == "boolean"
          ? k(this, kr)
          : ((n = globalThis.document) == null ? void 0 : n.visibilityState) !==
              "hidden"
      }
    }),
    (kr = new WeakMap()),
    (Kn = new WeakMap()),
    (as = new WeakMap()),
    zp),
  pc = new X0()
function Uu() {
  let r, n
  const s = new Promise((a, c) => {
    ;((r = a), (n = c))
  })
  ;((s.status = "pending"), s.catch(() => {}))
  function o(a) {
    ;(Object.assign(s, a), delete s.resolve, delete s.reject)
  }
  return (
    (s.resolve = (a) => {
      ;(o({ status: "fulfilled", value: a }), r(a))
    }),
    (s.reject = (a) => {
      ;(o({ status: "rejected", reason: a }), n(a))
    }),
    s
  )
}
var Z0 = H0
function ew() {
  let r = [],
    n = 0,
    s = (h) => {
      h()
    },
    o = (h) => {
      h()
    },
    a = Z0
  const c = (h) => {
      n
        ? r.push(h)
        : a(() => {
            s(h)
          })
    },
    f = () => {
      const h = r
      ;((r = []),
        h.length &&
          a(() => {
            o(() => {
              h.forEach((m) => {
                s(m)
              })
            })
          }))
    }
  return {
    batch: (h) => {
      let m
      n++
      try {
        m = h()
      } finally {
        ;(n--, n || f())
      }
      return m
    },
    batchCalls:
      (h) =>
      (...m) => {
        c(() => {
          h(...m)
        })
      },
    schedule: c,
    setNotifyFunction: (h) => {
      s = h
    },
    setBatchNotifyFunction: (h) => {
      o = h
    },
    setScheduler: (h) => {
      a = h
    },
  }
}
var it = ew(),
  us,
  Gn,
  cs,
  Bp,
  tw =
    ((Bp = class extends Pi {
      constructor() {
        super()
        ue(this, us, !0)
        ue(this, Gn)
        ue(this, cs)
        G(this, cs, (n) => {
          if (!Ar && window.addEventListener) {
            const s = () => n(!0),
              o = () => n(!1)
            return (
              window.addEventListener("online", s, !1),
              window.addEventListener("offline", o, !1),
              () => {
                ;(window.removeEventListener("online", s),
                  window.removeEventListener("offline", o))
              }
            )
          }
        })
      }
      onSubscribe() {
        k(this, Gn) || this.setEventListener(k(this, cs))
      }
      onUnsubscribe() {
        var n
        this.hasListeners() ||
          ((n = k(this, Gn)) == null || n.call(this), G(this, Gn, void 0))
      }
      setEventListener(n) {
        var s
        ;(G(this, cs, n),
          (s = k(this, Gn)) == null || s.call(this),
          G(this, Gn, n(this.setOnline.bind(this))))
      }
      setOnline(n) {
        k(this, us) !== n &&
          (G(this, us, n),
          this.listeners.forEach((o) => {
            o(n)
          }))
      }
      isOnline() {
        return k(this, us)
      }
    }),
    (us = new WeakMap()),
    (Gn = new WeakMap()),
    (cs = new WeakMap()),
    Bp),
  al = new tw()
function nw(r) {
  return Math.min(1e3 * 2 ** r, 3e4)
}
function _m(r) {
  return (r ?? "online") === "online" ? al.isOnline() : !0
}
var Mu = class extends Error {
  constructor(r) {
    ;(super("CancelledError"),
      (this.revert = r == null ? void 0 : r.revert),
      (this.silent = r == null ? void 0 : r.silent))
  }
}
function bm(r) {
  let n = !1,
    s = 0,
    o
  const a = Uu(),
    c = () => a.status !== "pending",
    f = (b) => {
      var w
      if (!c()) {
        const F = new Mu(b)
        ;(A(F), (w = r.onCancel) == null || w.call(r, F))
      }
    },
    h = () => {
      n = !0
    },
    m = () => {
      n = !1
    },
    g = () =>
      pc.isFocused() &&
      (r.networkMode === "always" || al.isOnline()) &&
      r.canRun(),
    y = () => _m(r.networkMode) && r.canRun(),
    S = (b) => {
      c() || (o == null || o(), a.resolve(b))
    },
    A = (b) => {
      c() || (o == null || o(), a.reject(b))
    },
    L = () =>
      new Promise((b) => {
        var w
        ;((o = (F) => {
          ;(c() || g()) && b(F)
        }),
          (w = r.onPause) == null || w.call(r))
      }).then(() => {
        var b
        ;((o = void 0), c() || (b = r.onContinue) == null || b.call(r))
      }),
    E = () => {
      if (c()) return
      let b
      const w = s === 0 ? r.initialPromise : void 0
      try {
        b = w ?? r.fn()
      } catch (F) {
        b = Promise.reject(F)
      }
      Promise.resolve(b)
        .then(S)
        .catch((F) => {
          var ne
          if (c()) return
          const Q = r.retry ?? (Ar ? 0 : 3),
            B = r.retryDelay ?? nw,
            j = typeof B == "function" ? B(s, F) : B,
            K =
              Q === !0 ||
              (typeof Q == "number" && s < Q) ||
              (typeof Q == "function" && Q(s, F))
          if (n || !K) {
            A(F)
            return
          }
          ;(s++,
            (ne = r.onFail) == null || ne.call(r, s, F),
            K0(j)
              .then(() => (g() ? void 0 : L()))
              .then(() => {
                n ? A(F) : E()
              }))
        })
    }
  return {
    promise: a,
    status: () => a.status,
    cancel: f,
    continue: () => (o == null || o(), a),
    cancelRetry: h,
    continueRetry: m,
    canStart: y,
    start: () => (y() ? E() : L().then(E), a),
  }
}
var Er,
  $p,
  Cm =
    (($p = class {
      constructor() {
        ue(this, Er)
      }
      destroy() {
        this.clearGcTimeout()
      }
      scheduleGc() {
        ;(this.clearGcTimeout(),
          ju(this.gcTime) &&
            G(
              this,
              Er,
              xr.setTimeout(() => {
                this.optionalRemove()
              }, this.gcTime),
            ))
      }
      updateGcTime(r) {
        this.gcTime = Math.max(this.gcTime || 0, r ?? (Ar ? 1 / 0 : 300 * 1e3))
      }
      clearGcTimeout() {
        k(this, Er) && (xr.clearTimeout(k(this, Er)), G(this, Er, void 0))
      }
    }),
    (Er = new WeakMap()),
    $p),
  _r,
  ds,
  Ut,
  br,
  tt,
  ki,
  Cr,
  Kt,
  wn,
  Vp,
  rw =
    ((Vp = class extends Cm {
      constructor(n) {
        super()
        ue(this, Kt)
        ue(this, _r)
        ue(this, ds)
        ue(this, Ut)
        ue(this, br)
        ue(this, tt)
        ue(this, ki)
        ue(this, Cr)
        ;(G(this, Cr, !1),
          G(this, ki, n.defaultOptions),
          this.setOptions(n.options),
          (this.observers = []),
          G(this, br, n.client),
          G(this, Ut, k(this, br).getQueryCache()),
          (this.queryKey = n.queryKey),
          (this.queryHash = n.queryHash),
          G(this, _r, Hh(this.options)),
          (this.state = n.state ?? k(this, _r)),
          this.scheduleGc())
      }
      get meta() {
        return this.options.meta
      }
      get promise() {
        var n
        return (n = k(this, tt)) == null ? void 0 : n.promise
      }
      setOptions(n) {
        if (
          ((this.options = { ...k(this, ki), ...n }),
          this.updateGcTime(this.options.gcTime),
          this.state && this.state.data === void 0)
        ) {
          const s = Hh(this.options)
          s.data !== void 0 &&
            (this.setState(qh(s.data, s.dataUpdatedAt)), G(this, _r, s))
        }
      }
      optionalRemove() {
        !this.observers.length &&
          this.state.fetchStatus === "idle" &&
          k(this, Ut).remove(this)
      }
      setData(n, s) {
        const o = Fu(this.state.data, n, this.options)
        return (
          xe(this, Kt, wn).call(this, {
            data: o,
            type: "success",
            dataUpdatedAt: s == null ? void 0 : s.updatedAt,
            manual: s == null ? void 0 : s.manual,
          }),
          o
        )
      }
      setState(n, s) {
        xe(this, Kt, wn).call(this, {
          type: "setState",
          state: n,
          setStateOptions: s,
        })
      }
      cancel(n) {
        var o, a
        const s = (o = k(this, tt)) == null ? void 0 : o.promise
        return (
          (a = k(this, tt)) == null || a.cancel(n),
          s ? s.then(Et).catch(Et) : Promise.resolve()
        )
      }
      destroy() {
        ;(super.destroy(), this.cancel({ silent: !0 }))
      }
      reset() {
        ;(this.destroy(), this.setState(k(this, _r)))
      }
      isActive() {
        return this.observers.some((n) => Mt(n.options.enabled, this) !== !1)
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === hc ||
              this.state.dataUpdateCount + this.state.errorUpdateCount === 0
      }
      isStatic() {
        return this.getObserversCount() > 0
          ? this.observers.some(
              (n) => nr(n.options.staleTime, this) === "static",
            )
          : !1
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some((n) => n.getCurrentResult().isStale)
          : this.state.data === void 0 || this.state.isInvalidated
      }
      isStaleByTime(n = 0) {
        return this.state.data === void 0
          ? !0
          : n === "static"
            ? !1
            : this.state.isInvalidated
              ? !0
              : !xm(this.state.dataUpdatedAt, n)
      }
      onFocus() {
        var s
        const n = this.observers.find((o) => o.shouldFetchOnWindowFocus())
        ;(n == null || n.refetch({ cancelRefetch: !1 }),
          (s = k(this, tt)) == null || s.continue())
      }
      onOnline() {
        var s
        const n = this.observers.find((o) => o.shouldFetchOnReconnect())
        ;(n == null || n.refetch({ cancelRefetch: !1 }),
          (s = k(this, tt)) == null || s.continue())
      }
      addObserver(n) {
        this.observers.includes(n) ||
          (this.observers.push(n),
          this.clearGcTimeout(),
          k(this, Ut).notify({
            type: "observerAdded",
            query: this,
            observer: n,
          }))
      }
      removeObserver(n) {
        this.observers.includes(n) &&
          ((this.observers = this.observers.filter((s) => s !== n)),
          this.observers.length ||
            (k(this, tt) &&
              (k(this, Cr)
                ? k(this, tt).cancel({ revert: !0 })
                : k(this, tt).cancelRetry()),
            this.scheduleGc()),
          k(this, Ut).notify({
            type: "observerRemoved",
            query: this,
            observer: n,
          }))
      }
      getObserversCount() {
        return this.observers.length
      }
      invalidate() {
        this.state.isInvalidated ||
          xe(this, Kt, wn).call(this, { type: "invalidate" })
      }
      async fetch(n, s) {
        var m, g, y, S, A, L, E, b, w, F, Q, B
        if (
          this.state.fetchStatus !== "idle" &&
          ((m = k(this, tt)) == null ? void 0 : m.status()) !== "rejected"
        ) {
          if (this.state.data !== void 0 && s != null && s.cancelRefetch)
            this.cancel({ silent: !0 })
          else if (k(this, tt))
            return (k(this, tt).continueRetry(), k(this, tt).promise)
        }
        if ((n && this.setOptions(n), !this.options.queryFn)) {
          const j = this.observers.find((K) => K.options.queryFn)
          j && this.setOptions(j.options)
        }
        const o = new AbortController(),
          a = (j) => {
            Object.defineProperty(j, "signal", {
              enumerable: !0,
              get: () => (G(this, Cr, !0), o.signal),
            })
          },
          c = () => {
            const j = km(this.options, s),
              ne = (() => {
                const se = {
                  client: k(this, br),
                  queryKey: this.queryKey,
                  meta: this.meta,
                }
                return (a(se), se)
              })()
            return (
              G(this, Cr, !1),
              this.options.persister
                ? this.options.persister(j, ne, this)
                : j(ne)
            )
          },
          h = (() => {
            const j = {
              fetchOptions: s,
              options: this.options,
              queryKey: this.queryKey,
              client: k(this, br),
              state: this.state,
              fetchFn: c,
            }
            return (a(j), j)
          })()
        ;((g = this.options.behavior) == null || g.onFetch(h, this),
          G(this, ds, this.state),
          (this.state.fetchStatus === "idle" ||
            this.state.fetchMeta !==
              ((y = h.fetchOptions) == null ? void 0 : y.meta)) &&
            xe(this, Kt, wn).call(this, {
              type: "fetch",
              meta: (S = h.fetchOptions) == null ? void 0 : S.meta,
            }),
          G(
            this,
            tt,
            bm({
              initialPromise: s == null ? void 0 : s.initialPromise,
              fn: h.fetchFn,
              onCancel: (j) => {
                ;(j instanceof Mu &&
                  j.revert &&
                  this.setState({ ...k(this, ds), fetchStatus: "idle" }),
                  o.abort())
              },
              onFail: (j, K) => {
                xe(this, Kt, wn).call(this, {
                  type: "failed",
                  failureCount: j,
                  error: K,
                })
              },
              onPause: () => {
                xe(this, Kt, wn).call(this, { type: "pause" })
              },
              onContinue: () => {
                xe(this, Kt, wn).call(this, { type: "continue" })
              },
              retry: h.options.retry,
              retryDelay: h.options.retryDelay,
              networkMode: h.options.networkMode,
              canRun: () => !0,
            }),
          ))
        try {
          const j = await k(this, tt).start()
          if (j === void 0)
            throw new Error(`${this.queryHash} data is undefined`)
          return (
            this.setData(j),
            (L = (A = k(this, Ut).config).onSuccess) == null ||
              L.call(A, j, this),
            (b = (E = k(this, Ut).config).onSettled) == null ||
              b.call(E, j, this.state.error, this),
            j
          )
        } catch (j) {
          if (j instanceof Mu) {
            if (j.silent) return k(this, tt).promise
            if (j.revert) {
              if (this.state.data === void 0) throw j
              return this.state.data
            }
          }
          throw (
            xe(this, Kt, wn).call(this, { type: "error", error: j }),
            (F = (w = k(this, Ut).config).onError) == null ||
              F.call(w, j, this),
            (B = (Q = k(this, Ut).config).onSettled) == null ||
              B.call(Q, this.state.data, j, this),
            j
          )
        } finally {
          this.scheduleGc()
        }
      }
    }),
    (_r = new WeakMap()),
    (ds = new WeakMap()),
    (Ut = new WeakMap()),
    (br = new WeakMap()),
    (tt = new WeakMap()),
    (ki = new WeakMap()),
    (Cr = new WeakMap()),
    (Kt = new WeakSet()),
    (wn = function (n) {
      const s = (o) => {
        switch (n.type) {
          case "failed":
            return {
              ...o,
              fetchFailureCount: n.failureCount,
              fetchFailureReason: n.error,
            }
          case "pause":
            return { ...o, fetchStatus: "paused" }
          case "continue":
            return { ...o, fetchStatus: "fetching" }
          case "fetch":
            return {
              ...o,
              ...Rm(o.data, this.options),
              fetchMeta: n.meta ?? null,
            }
          case "success":
            const a = {
              ...o,
              ...qh(n.data, n.dataUpdatedAt),
              dataUpdateCount: o.dataUpdateCount + 1,
              ...(!n.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            }
            return (G(this, ds, n.manual ? a : void 0), a)
          case "error":
            const c = n.error
            return {
              ...o,
              error: c,
              errorUpdateCount: o.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: o.fetchFailureCount + 1,
              fetchFailureReason: c,
              fetchStatus: "idle",
              status: "error",
              isInvalidated: !0,
            }
          case "invalidate":
            return { ...o, isInvalidated: !0 }
          case "setState":
            return { ...o, ...n.state }
        }
      }
      ;((this.state = s(this.state)),
        it.batch(() => {
          ;(this.observers.forEach((o) => {
            o.onQueryUpdate()
          }),
            k(this, Ut).notify({ query: this, type: "updated", action: n }))
        }))
    }),
    Vp)
function Rm(r, n) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: _m(n.networkMode) ? "fetching" : "paused",
    ...(r === void 0 && { error: null, status: "pending" }),
  }
}
function qh(r, n) {
  return {
    data: r,
    dataUpdatedAt: n ?? Date.now(),
    error: null,
    isInvalidated: !1,
    status: "success",
  }
}
function Hh(r) {
  const n =
      typeof r.initialData == "function" ? r.initialData() : r.initialData,
    s = n !== void 0,
    o = s
      ? typeof r.initialDataUpdatedAt == "function"
        ? r.initialDataUpdatedAt()
        : r.initialDataUpdatedAt
      : 0
  return {
    data: n,
    dataUpdateCount: 0,
    dataUpdatedAt: s ? (o ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: s ? "success" : "pending",
    fetchStatus: "idle",
  }
}
var kt,
  Se,
  Ei,
  mt,
  Rr,
  fs,
  xn,
  Yn,
  _i,
  hs,
  ps,
  Tr,
  Pr,
  Jn,
  ms,
  Te,
  hi,
  zu,
  Bu,
  $u,
  Vu,
  qu,
  Hu,
  Qu,
  Tm,
  qp,
  sw =
    ((qp = class extends Pi {
      constructor(n, s) {
        super()
        ue(this, Te)
        ue(this, kt)
        ue(this, Se)
        ue(this, Ei)
        ue(this, mt)
        ue(this, Rr)
        ue(this, fs)
        ue(this, xn)
        ue(this, Yn)
        ue(this, _i)
        ue(this, hs)
        ue(this, ps)
        ue(this, Tr)
        ue(this, Pr)
        ue(this, Jn)
        ue(this, ms, new Set())
        ;((this.options = s),
          G(this, kt, n),
          G(this, Yn, null),
          G(this, xn, Uu()),
          this.bindMethods(),
          this.setOptions(s))
      }
      bindMethods() {
        this.refetch = this.refetch.bind(this)
      }
      onSubscribe() {
        this.listeners.size === 1 &&
          (k(this, Se).addObserver(this),
          Qh(k(this, Se), this.options)
            ? xe(this, Te, hi).call(this)
            : this.updateResult(),
          xe(this, Te, Vu).call(this))
      }
      onUnsubscribe() {
        this.hasListeners() || this.destroy()
      }
      shouldFetchOnReconnect() {
        return Wu(k(this, Se), this.options, this.options.refetchOnReconnect)
      }
      shouldFetchOnWindowFocus() {
        return Wu(k(this, Se), this.options, this.options.refetchOnWindowFocus)
      }
      destroy() {
        ;((this.listeners = new Set()),
          xe(this, Te, qu).call(this),
          xe(this, Te, Hu).call(this),
          k(this, Se).removeObserver(this))
      }
      setOptions(n) {
        const s = this.options,
          o = k(this, Se)
        if (
          ((this.options = k(this, kt).defaultQueryOptions(n)),
          this.options.enabled !== void 0 &&
            typeof this.options.enabled != "boolean" &&
            typeof this.options.enabled != "function" &&
            typeof Mt(this.options.enabled, k(this, Se)) != "boolean")
        )
          throw new Error(
            "Expected enabled to be a boolean or a callback that returns a boolean",
          )
        ;(xe(this, Te, Qu).call(this),
          k(this, Se).setOptions(this.options),
          s._defaulted &&
            !Iu(this.options, s) &&
            k(this, kt)
              .getQueryCache()
              .notify({
                type: "observerOptionsUpdated",
                query: k(this, Se),
                observer: this,
              }))
        const a = this.hasListeners()
        ;(a &&
          Wh(k(this, Se), o, this.options, s) &&
          xe(this, Te, hi).call(this),
          this.updateResult(),
          a &&
            (k(this, Se) !== o ||
              Mt(this.options.enabled, k(this, Se)) !==
                Mt(s.enabled, k(this, Se)) ||
              nr(this.options.staleTime, k(this, Se)) !==
                nr(s.staleTime, k(this, Se))) &&
            xe(this, Te, zu).call(this))
        const c = xe(this, Te, Bu).call(this)
        a &&
          (k(this, Se) !== o ||
            Mt(this.options.enabled, k(this, Se)) !==
              Mt(s.enabled, k(this, Se)) ||
            c !== k(this, Jn)) &&
          xe(this, Te, $u).call(this, c)
      }
      getOptimisticResult(n) {
        const s = k(this, kt).getQueryCache().build(k(this, kt), n),
          o = this.createResult(s, n)
        return (
          ow(this, o) &&
            (G(this, mt, o),
            G(this, fs, this.options),
            G(this, Rr, k(this, Se).state)),
          o
        )
      }
      getCurrentResult() {
        return k(this, mt)
      }
      trackResult(n, s) {
        return new Proxy(n, {
          get: (o, a) => (
            this.trackProp(a),
            s == null || s(a),
            a === "promise" &&
              (this.trackProp("data"),
              !this.options.experimental_prefetchInRender &&
                k(this, xn).status === "pending" &&
                k(this, xn).reject(
                  new Error(
                    "experimental_prefetchInRender feature flag is not enabled",
                  ),
                )),
            Reflect.get(o, a)
          ),
        })
      }
      trackProp(n) {
        k(this, ms).add(n)
      }
      getCurrentQuery() {
        return k(this, Se)
      }
      refetch({ ...n } = {}) {
        return this.fetch({ ...n })
      }
      fetchOptimistic(n) {
        const s = k(this, kt).defaultQueryOptions(n),
          o = k(this, kt).getQueryCache().build(k(this, kt), s)
        return o.fetch().then(() => this.createResult(o, s))
      }
      fetch(n) {
        return xe(this, Te, hi)
          .call(this, { ...n, cancelRefetch: n.cancelRefetch ?? !0 })
          .then(() => (this.updateResult(), k(this, mt)))
      }
      createResult(n, s) {
        var ce
        const o = k(this, Se),
          a = this.options,
          c = k(this, mt),
          f = k(this, Rr),
          h = k(this, fs),
          g = n !== o ? n.state : k(this, Ei),
          { state: y } = n
        let S = { ...y },
          A = !1,
          L
        if (s._optimisticResults) {
          const le = this.hasListeners(),
            Oe = !le && Qh(n, s),
            je = le && Wh(n, o, s, a)
          ;((Oe || je) && (S = { ...S, ...Rm(y.data, n.options) }),
            s._optimisticResults === "isRestoring" && (S.fetchStatus = "idle"))
        }
        let { error: E, errorUpdatedAt: b, status: w } = S
        L = S.data
        let F = !1
        if (s.placeholderData !== void 0 && L === void 0 && w === "pending") {
          let le
          ;(c != null &&
          c.isPlaceholderData &&
          s.placeholderData === (h == null ? void 0 : h.placeholderData)
            ? ((le = c.data), (F = !0))
            : (le =
                typeof s.placeholderData == "function"
                  ? s.placeholderData(
                      (ce = k(this, ps)) == null ? void 0 : ce.state.data,
                      k(this, ps),
                    )
                  : s.placeholderData),
            le !== void 0 &&
              ((w = "success"),
              (L = Fu(c == null ? void 0 : c.data, le, s)),
              (A = !0)))
        }
        if (s.select && L !== void 0 && !F)
          if (
            c &&
            L === (f == null ? void 0 : f.data) &&
            s.select === k(this, _i)
          )
            L = k(this, hs)
          else
            try {
              ;(G(this, _i, s.select),
                (L = s.select(L)),
                (L = Fu(c == null ? void 0 : c.data, L, s)),
                G(this, hs, L),
                G(this, Yn, null))
            } catch (le) {
              G(this, Yn, le)
            }
        k(this, Yn) &&
          ((E = k(this, Yn)),
          (L = k(this, hs)),
          (b = Date.now()),
          (w = "error"))
        const Q = S.fetchStatus === "fetching",
          B = w === "pending",
          j = w === "error",
          K = B && Q,
          ne = L !== void 0,
          z = {
            status: w,
            fetchStatus: S.fetchStatus,
            isPending: B,
            isSuccess: w === "success",
            isError: j,
            isInitialLoading: K,
            isLoading: K,
            data: L,
            dataUpdatedAt: S.dataUpdatedAt,
            error: E,
            errorUpdatedAt: b,
            failureCount: S.fetchFailureCount,
            failureReason: S.fetchFailureReason,
            errorUpdateCount: S.errorUpdateCount,
            isFetched: S.dataUpdateCount > 0 || S.errorUpdateCount > 0,
            isFetchedAfterMount:
              S.dataUpdateCount > g.dataUpdateCount ||
              S.errorUpdateCount > g.errorUpdateCount,
            isFetching: Q,
            isRefetching: Q && !B,
            isLoadingError: j && !ne,
            isPaused: S.fetchStatus === "paused",
            isPlaceholderData: A,
            isRefetchError: j && ne,
            isStale: mc(n, s),
            refetch: this.refetch,
            promise: k(this, xn),
            isEnabled: Mt(s.enabled, n) !== !1,
          }
        if (this.options.experimental_prefetchInRender) {
          const le = z.data !== void 0,
            Oe = z.status === "error" && !le,
            je = (De) => {
              Oe ? De.reject(z.error) : le && De.resolve(z.data)
            },
            Ie = () => {
              const De = G(this, xn, (z.promise = Uu()))
              je(De)
            },
            Ne = k(this, xn)
          switch (Ne.status) {
            case "pending":
              n.queryHash === o.queryHash && je(Ne)
              break
            case "fulfilled":
              ;(Oe || z.data !== Ne.value) && Ie()
              break
            case "rejected":
              ;(!Oe || z.error !== Ne.reason) && Ie()
              break
          }
        }
        return z
      }
      updateResult() {
        const n = k(this, mt),
          s = this.createResult(k(this, Se), this.options)
        if (
          (G(this, Rr, k(this, Se).state),
          G(this, fs, this.options),
          k(this, Rr).data !== void 0 && G(this, ps, k(this, Se)),
          Iu(s, n))
        )
          return
        G(this, mt, s)
        const o = () => {
          if (!n) return !0
          const { notifyOnChangeProps: a } = this.options,
            c = typeof a == "function" ? a() : a
          if (c === "all" || (!c && !k(this, ms).size)) return !0
          const f = new Set(c ?? k(this, ms))
          return (
            this.options.throwOnError && f.add("error"),
            Object.keys(k(this, mt)).some((h) => {
              const m = h
              return k(this, mt)[m] !== n[m] && f.has(m)
            })
          )
        }
        xe(this, Te, Tm).call(this, { listeners: o() })
      }
      onQueryUpdate() {
        ;(this.updateResult(),
          this.hasListeners() && xe(this, Te, Vu).call(this))
      }
    }),
    (kt = new WeakMap()),
    (Se = new WeakMap()),
    (Ei = new WeakMap()),
    (mt = new WeakMap()),
    (Rr = new WeakMap()),
    (fs = new WeakMap()),
    (xn = new WeakMap()),
    (Yn = new WeakMap()),
    (_i = new WeakMap()),
    (hs = new WeakMap()),
    (ps = new WeakMap()),
    (Tr = new WeakMap()),
    (Pr = new WeakMap()),
    (Jn = new WeakMap()),
    (ms = new WeakMap()),
    (Te = new WeakSet()),
    (hi = function (n) {
      xe(this, Te, Qu).call(this)
      let s = k(this, Se).fetch(this.options, n)
      return ((n != null && n.throwOnError) || (s = s.catch(Et)), s)
    }),
    (zu = function () {
      xe(this, Te, qu).call(this)
      const n = nr(this.options.staleTime, k(this, Se))
      if (Ar || k(this, mt).isStale || !ju(n)) return
      const o = xm(k(this, mt).dataUpdatedAt, n) + 1
      G(
        this,
        Tr,
        xr.setTimeout(() => {
          k(this, mt).isStale || this.updateResult()
        }, o),
      )
    }),
    (Bu = function () {
      return (
        (typeof this.options.refetchInterval == "function"
          ? this.options.refetchInterval(k(this, Se))
          : this.options.refetchInterval) ?? !1
      )
    }),
    ($u = function (n) {
      ;(xe(this, Te, Hu).call(this),
        G(this, Jn, n),
        !(
          Ar ||
          Mt(this.options.enabled, k(this, Se)) === !1 ||
          !ju(k(this, Jn)) ||
          k(this, Jn) === 0
        ) &&
          G(
            this,
            Pr,
            xr.setInterval(
              () => {
                ;(this.options.refetchIntervalInBackground || pc.isFocused()) &&
                  xe(this, Te, hi).call(this)
              },
              k(this, Jn),
            ),
          ))
    }),
    (Vu = function () {
      ;(xe(this, Te, zu).call(this),
        xe(this, Te, $u).call(this, xe(this, Te, Bu).call(this)))
    }),
    (qu = function () {
      k(this, Tr) && (xr.clearTimeout(k(this, Tr)), G(this, Tr, void 0))
    }),
    (Hu = function () {
      k(this, Pr) && (xr.clearInterval(k(this, Pr)), G(this, Pr, void 0))
    }),
    (Qu = function () {
      const n = k(this, kt).getQueryCache().build(k(this, kt), this.options)
      if (n === k(this, Se)) return
      const s = k(this, Se)
      ;(G(this, Se, n),
        G(this, Ei, n.state),
        this.hasListeners() &&
          (s == null || s.removeObserver(this), n.addObserver(this)))
    }),
    (Tm = function (n) {
      it.batch(() => {
        ;(n.listeners &&
          this.listeners.forEach((s) => {
            s(k(this, mt))
          }),
          k(this, kt)
            .getQueryCache()
            .notify({ query: k(this, Se), type: "observerResultsUpdated" }))
      })
    }),
    qp)
function iw(r, n) {
  return (
    Mt(n.enabled, r) !== !1 &&
    r.state.data === void 0 &&
    !(r.state.status === "error" && n.retryOnMount === !1)
  )
}
function Qh(r, n) {
  return iw(r, n) || (r.state.data !== void 0 && Wu(r, n, n.refetchOnMount))
}
function Wu(r, n, s) {
  if (Mt(n.enabled, r) !== !1 && nr(n.staleTime, r) !== "static") {
    const o = typeof s == "function" ? s(r) : s
    return o === "always" || (o !== !1 && mc(r, n))
  }
  return !1
}
function Wh(r, n, s, o) {
  return (
    (r !== n || Mt(o.enabled, r) === !1) &&
    (!s.suspense || r.state.status !== "error") &&
    mc(r, s)
  )
}
function mc(r, n) {
  return Mt(n.enabled, r) !== !1 && r.isStaleByTime(nr(n.staleTime, r))
}
function ow(r, n) {
  return !Iu(r.getCurrentResult(), n)
}
function Kh(r) {
  return {
    onFetch: (n, s) => {
      var y, S, A, L, E
      const o = n.options,
        a =
          (A =
            (S = (y = n.fetchOptions) == null ? void 0 : y.meta) == null
              ? void 0
              : S.fetchMore) == null
            ? void 0
            : A.direction,
        c = ((L = n.state.data) == null ? void 0 : L.pages) || [],
        f = ((E = n.state.data) == null ? void 0 : E.pageParams) || []
      let h = { pages: [], pageParams: [] },
        m = 0
      const g = async () => {
        let b = !1
        const w = (B) => {
            J0(
              B,
              () => n.signal,
              () => (b = !0),
            )
          },
          F = km(n.options, n.fetchOptions),
          Q = async (B, j, K) => {
            if (b) return Promise.reject()
            if (j == null && B.pages.length) return Promise.resolve(B)
            const se = (() => {
                const Oe = {
                  client: n.client,
                  queryKey: n.queryKey,
                  pageParam: j,
                  direction: K ? "backward" : "forward",
                  meta: n.options.meta,
                }
                return (w(Oe), Oe)
              })(),
              z = await F(se),
              { maxPages: ce } = n.options,
              le = K ? Y0 : G0
            return {
              pages: le(B.pages, z, ce),
              pageParams: le(B.pageParams, j, ce),
            }
          }
        if (a && c.length) {
          const B = a === "backward",
            j = B ? lw : Gh,
            K = { pages: c, pageParams: f },
            ne = j(o, K)
          h = await Q(K, ne, B)
        } else {
          const B = r ?? c.length
          do {
            const j = m === 0 ? (f[0] ?? o.initialPageParam) : Gh(o, h)
            if (m > 0 && j == null) break
            ;((h = await Q(h, j)), m++)
          } while (m < B)
        }
        return h
      }
      n.options.persister
        ? (n.fetchFn = () => {
            var b, w
            return (w = (b = n.options).persister) == null
              ? void 0
              : w.call(
                  b,
                  g,
                  {
                    client: n.client,
                    queryKey: n.queryKey,
                    meta: n.options.meta,
                    signal: n.signal,
                  },
                  s,
                )
          })
        : (n.fetchFn = g)
    },
  }
}
function Gh(r, { pages: n, pageParams: s }) {
  const o = n.length - 1
  return n.length > 0 ? r.getNextPageParam(n[o], n, s[o], s) : void 0
}
function lw(r, { pages: n, pageParams: s }) {
  var o
  return n.length > 0
    ? (o = r.getPreviousPageParam) == null
      ? void 0
      : o.call(r, n[0], n, s[0], s)
    : void 0
}
var bi,
  rn,
  dt,
  Nr,
  sn,
  Qn,
  Hp,
  aw =
    ((Hp = class extends Cm {
      constructor(n) {
        super()
        ue(this, sn)
        ue(this, bi)
        ue(this, rn)
        ue(this, dt)
        ue(this, Nr)
        ;(G(this, bi, n.client),
          (this.mutationId = n.mutationId),
          G(this, dt, n.mutationCache),
          G(this, rn, []),
          (this.state = n.state || uw()),
          this.setOptions(n.options),
          this.scheduleGc())
      }
      setOptions(n) {
        ;((this.options = n), this.updateGcTime(this.options.gcTime))
      }
      get meta() {
        return this.options.meta
      }
      addObserver(n) {
        k(this, rn).includes(n) ||
          (k(this, rn).push(n),
          this.clearGcTimeout(),
          k(this, dt).notify({
            type: "observerAdded",
            mutation: this,
            observer: n,
          }))
      }
      removeObserver(n) {
        ;(G(
          this,
          rn,
          k(this, rn).filter((s) => s !== n),
        ),
          this.scheduleGc(),
          k(this, dt).notify({
            type: "observerRemoved",
            mutation: this,
            observer: n,
          }))
      }
      optionalRemove() {
        k(this, rn).length ||
          (this.state.status === "pending"
            ? this.scheduleGc()
            : k(this, dt).remove(this))
      }
      continue() {
        var n
        return (
          ((n = k(this, Nr)) == null ? void 0 : n.continue()) ??
          this.execute(this.state.variables)
        )
      }
      async execute(n) {
        var f, h, m, g, y, S, A, L, E, b, w, F, Q, B, j, K, ne, se
        const s = () => {
            xe(this, sn, Qn).call(this, { type: "continue" })
          },
          o = {
            client: k(this, bi),
            meta: this.options.meta,
            mutationKey: this.options.mutationKey,
          }
        G(
          this,
          Nr,
          bm({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(n, o)
                : Promise.reject(new Error("No mutationFn found")),
            onFail: (z, ce) => {
              xe(this, sn, Qn).call(this, {
                type: "failed",
                failureCount: z,
                error: ce,
              })
            },
            onPause: () => {
              xe(this, sn, Qn).call(this, { type: "pause" })
            },
            onContinue: s,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => k(this, dt).canRun(this),
          }),
        )
        const a = this.state.status === "pending",
          c = !k(this, Nr).canStart()
        try {
          if (a) s()
          else {
            ;(xe(this, sn, Qn).call(this, {
              type: "pending",
              variables: n,
              isPaused: c,
            }),
              k(this, dt).config.onMutate &&
                (await k(this, dt).config.onMutate(n, this, o)))
            const ce = await ((h = (f = this.options).onMutate) == null
              ? void 0
              : h.call(f, n, o))
            ce !== this.state.context &&
              xe(this, sn, Qn).call(this, {
                type: "pending",
                context: ce,
                variables: n,
                isPaused: c,
              })
          }
          const z = await k(this, Nr).start()
          return (
            await ((g = (m = k(this, dt).config).onSuccess) == null
              ? void 0
              : g.call(m, z, n, this.state.context, this, o)),
            await ((S = (y = this.options).onSuccess) == null
              ? void 0
              : S.call(y, z, n, this.state.context, o)),
            await ((L = (A = k(this, dt).config).onSettled) == null
              ? void 0
              : L.call(
                  A,
                  z,
                  null,
                  this.state.variables,
                  this.state.context,
                  this,
                  o,
                )),
            await ((b = (E = this.options).onSettled) == null
              ? void 0
              : b.call(E, z, null, n, this.state.context, o)),
            xe(this, sn, Qn).call(this, { type: "success", data: z }),
            z
          )
        } catch (z) {
          try {
            await ((F = (w = k(this, dt).config).onError) == null
              ? void 0
              : F.call(w, z, n, this.state.context, this, o))
          } catch (ce) {
            Promise.reject(ce)
          }
          try {
            await ((B = (Q = this.options).onError) == null
              ? void 0
              : B.call(Q, z, n, this.state.context, o))
          } catch (ce) {
            Promise.reject(ce)
          }
          try {
            await ((K = (j = k(this, dt).config).onSettled) == null
              ? void 0
              : K.call(
                  j,
                  void 0,
                  z,
                  this.state.variables,
                  this.state.context,
                  this,
                  o,
                ))
          } catch (ce) {
            Promise.reject(ce)
          }
          try {
            await ((se = (ne = this.options).onSettled) == null
              ? void 0
              : se.call(ne, void 0, z, n, this.state.context, o))
          } catch (ce) {
            Promise.reject(ce)
          }
          throw (xe(this, sn, Qn).call(this, { type: "error", error: z }), z)
        } finally {
          k(this, dt).runNext(this)
        }
      }
    }),
    (bi = new WeakMap()),
    (rn = new WeakMap()),
    (dt = new WeakMap()),
    (Nr = new WeakMap()),
    (sn = new WeakSet()),
    (Qn = function (n) {
      const s = (o) => {
        switch (n.type) {
          case "failed":
            return {
              ...o,
              failureCount: n.failureCount,
              failureReason: n.error,
            }
          case "pause":
            return { ...o, isPaused: !0 }
          case "continue":
            return { ...o, isPaused: !1 }
          case "pending":
            return {
              ...o,
              context: n.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: n.isPaused,
              status: "pending",
              variables: n.variables,
              submittedAt: Date.now(),
            }
          case "success":
            return {
              ...o,
              data: n.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: !1,
            }
          case "error":
            return {
              ...o,
              data: void 0,
              error: n.error,
              failureCount: o.failureCount + 1,
              failureReason: n.error,
              isPaused: !1,
              status: "error",
            }
        }
      }
      ;((this.state = s(this.state)),
        it.batch(() => {
          ;(k(this, rn).forEach((o) => {
            o.onMutationUpdate(n)
          }),
            k(this, dt).notify({ mutation: this, type: "updated", action: n }))
        }))
    }),
    Hp)
function uw() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  }
}
var Sn,
  Gt,
  Ci,
  Qp,
  cw =
    ((Qp = class extends Pi {
      constructor(n = {}) {
        super()
        ue(this, Sn)
        ue(this, Gt)
        ue(this, Ci)
        ;((this.config = n),
          G(this, Sn, new Set()),
          G(this, Gt, new Map()),
          G(this, Ci, 0))
      }
      build(n, s, o) {
        const a = new aw({
          client: n,
          mutationCache: this,
          mutationId: ++qo(this, Ci)._,
          options: n.defaultMutationOptions(s),
          state: o,
        })
        return (this.add(a), a)
      }
      add(n) {
        k(this, Sn).add(n)
        const s = Ko(n)
        if (typeof s == "string") {
          const o = k(this, Gt).get(s)
          o ? o.push(n) : k(this, Gt).set(s, [n])
        }
        this.notify({ type: "added", mutation: n })
      }
      remove(n) {
        if (k(this, Sn).delete(n)) {
          const s = Ko(n)
          if (typeof s == "string") {
            const o = k(this, Gt).get(s)
            if (o)
              if (o.length > 1) {
                const a = o.indexOf(n)
                a !== -1 && o.splice(a, 1)
              } else o[0] === n && k(this, Gt).delete(s)
          }
        }
        this.notify({ type: "removed", mutation: n })
      }
      canRun(n) {
        const s = Ko(n)
        if (typeof s == "string") {
          const o = k(this, Gt).get(s),
            a = o == null ? void 0 : o.find((c) => c.state.status === "pending")
          return !a || a === n
        } else return !0
      }
      runNext(n) {
        var o
        const s = Ko(n)
        if (typeof s == "string") {
          const a =
            (o = k(this, Gt).get(s)) == null
              ? void 0
              : o.find((c) => c !== n && c.state.isPaused)
          return (a == null ? void 0 : a.continue()) ?? Promise.resolve()
        } else return Promise.resolve()
      }
      clear() {
        it.batch(() => {
          ;(k(this, Sn).forEach((n) => {
            this.notify({ type: "removed", mutation: n })
          }),
            k(this, Sn).clear(),
            k(this, Gt).clear())
        })
      }
      getAll() {
        return Array.from(k(this, Sn))
      }
      find(n) {
        const s = { exact: !0, ...n }
        return this.getAll().find((o) => Bh(s, o))
      }
      findAll(n = {}) {
        return this.getAll().filter((s) => Bh(n, s))
      }
      notify(n) {
        it.batch(() => {
          this.listeners.forEach((s) => {
            s(n)
          })
        })
      }
      resumePausedMutations() {
        const n = this.getAll().filter((s) => s.state.isPaused)
        return it.batch(() => Promise.all(n.map((s) => s.continue().catch(Et))))
      }
    }),
    (Sn = new WeakMap()),
    (Gt = new WeakMap()),
    (Ci = new WeakMap()),
    Qp)
function Ko(r) {
  var n
  return (n = r.options.scope) == null ? void 0 : n.id
}
var on,
  Wp,
  dw =
    ((Wp = class extends Pi {
      constructor(n = {}) {
        super()
        ue(this, on)
        ;((this.config = n), G(this, on, new Map()))
      }
      build(n, s, o) {
        const a = s.queryKey,
          c = s.queryHash ?? fc(a, s)
        let f = this.get(c)
        return (
          f ||
            ((f = new rw({
              client: n,
              queryKey: a,
              queryHash: c,
              options: n.defaultQueryOptions(s),
              state: o,
              defaultOptions: n.getQueryDefaults(a),
            })),
            this.add(f)),
          f
        )
      }
      add(n) {
        k(this, on).has(n.queryHash) ||
          (k(this, on).set(n.queryHash, n),
          this.notify({ type: "added", query: n }))
      }
      remove(n) {
        const s = k(this, on).get(n.queryHash)
        s &&
          (n.destroy(),
          s === n && k(this, on).delete(n.queryHash),
          this.notify({ type: "removed", query: n }))
      }
      clear() {
        it.batch(() => {
          this.getAll().forEach((n) => {
            this.remove(n)
          })
        })
      }
      get(n) {
        return k(this, on).get(n)
      }
      getAll() {
        return [...k(this, on).values()]
      }
      find(n) {
        const s = { exact: !0, ...n }
        return this.getAll().find((o) => zh(s, o))
      }
      findAll(n = {}) {
        const s = this.getAll()
        return Object.keys(n).length > 0 ? s.filter((o) => zh(n, o)) : s
      }
      notify(n) {
        it.batch(() => {
          this.listeners.forEach((s) => {
            s(n)
          })
        })
      }
      onFocus() {
        it.batch(() => {
          this.getAll().forEach((n) => {
            n.onFocus()
          })
        })
      }
      onOnline() {
        it.batch(() => {
          this.getAll().forEach((n) => {
            n.onOnline()
          })
        })
      }
    }),
    (on = new WeakMap()),
    Wp),
  Ve,
  Xn,
  Zn,
  gs,
  ys,
  er,
  vs,
  ws,
  Kp,
  fw =
    ((Kp = class {
      constructor(r = {}) {
        ue(this, Ve)
        ue(this, Xn)
        ue(this, Zn)
        ue(this, gs)
        ue(this, ys)
        ue(this, er)
        ue(this, vs)
        ue(this, ws)
        ;(G(this, Ve, r.queryCache || new dw()),
          G(this, Xn, r.mutationCache || new cw()),
          G(this, Zn, r.defaultOptions || {}),
          G(this, gs, new Map()),
          G(this, ys, new Map()),
          G(this, er, 0))
      }
      mount() {
        ;(qo(this, er)._++,
          k(this, er) === 1 &&
            (G(
              this,
              vs,
              pc.subscribe(async (r) => {
                r && (await this.resumePausedMutations(), k(this, Ve).onFocus())
              }),
            ),
            G(
              this,
              ws,
              al.subscribe(async (r) => {
                r &&
                  (await this.resumePausedMutations(), k(this, Ve).onOnline())
              }),
            )))
      }
      unmount() {
        var r, n
        ;(qo(this, er)._--,
          k(this, er) === 0 &&
            ((r = k(this, vs)) == null || r.call(this),
            G(this, vs, void 0),
            (n = k(this, ws)) == null || n.call(this),
            G(this, ws, void 0)))
      }
      isFetching(r) {
        return k(this, Ve).findAll({ ...r, fetchStatus: "fetching" }).length
      }
      isMutating(r) {
        return k(this, Xn).findAll({ ...r, status: "pending" }).length
      }
      getQueryData(r) {
        var s
        const n = this.defaultQueryOptions({ queryKey: r })
        return (s = k(this, Ve).get(n.queryHash)) == null
          ? void 0
          : s.state.data
      }
      ensureQueryData(r) {
        const n = this.defaultQueryOptions(r),
          s = k(this, Ve).build(this, n),
          o = s.state.data
        return o === void 0
          ? this.fetchQuery(r)
          : (r.revalidateIfStale &&
              s.isStaleByTime(nr(n.staleTime, s)) &&
              this.prefetchQuery(n),
            Promise.resolve(o))
      }
      getQueriesData(r) {
        return k(this, Ve)
          .findAll(r)
          .map(({ queryKey: n, state: s }) => {
            const o = s.data
            return [n, o]
          })
      }
      setQueryData(r, n, s) {
        const o = this.defaultQueryOptions({ queryKey: r }),
          a = k(this, Ve).get(o.queryHash),
          c = a == null ? void 0 : a.state.data,
          f = Q0(n, c)
        if (f !== void 0)
          return k(this, Ve)
            .build(this, o)
            .setData(f, { ...s, manual: !0 })
      }
      setQueriesData(r, n, s) {
        return it.batch(() =>
          k(this, Ve)
            .findAll(r)
            .map(({ queryKey: o }) => [o, this.setQueryData(o, n, s)]),
        )
      }
      getQueryState(r) {
        var s
        const n = this.defaultQueryOptions({ queryKey: r })
        return (s = k(this, Ve).get(n.queryHash)) == null ? void 0 : s.state
      }
      removeQueries(r) {
        const n = k(this, Ve)
        it.batch(() => {
          n.findAll(r).forEach((s) => {
            n.remove(s)
          })
        })
      }
      resetQueries(r, n) {
        const s = k(this, Ve)
        return it.batch(
          () => (
            s.findAll(r).forEach((o) => {
              o.reset()
            }),
            this.refetchQueries({ type: "active", ...r }, n)
          ),
        )
      }
      cancelQueries(r, n = {}) {
        const s = { revert: !0, ...n },
          o = it.batch(() =>
            k(this, Ve)
              .findAll(r)
              .map((a) => a.cancel(s)),
          )
        return Promise.all(o).then(Et).catch(Et)
      }
      invalidateQueries(r, n = {}) {
        return it.batch(
          () => (
            k(this, Ve)
              .findAll(r)
              .forEach((s) => {
                s.invalidate()
              }),
            (r == null ? void 0 : r.refetchType) === "none"
              ? Promise.resolve()
              : this.refetchQueries(
                  {
                    ...r,
                    type:
                      (r == null ? void 0 : r.refetchType) ??
                      (r == null ? void 0 : r.type) ??
                      "active",
                  },
                  n,
                )
          ),
        )
      }
      refetchQueries(r, n = {}) {
        const s = { ...n, cancelRefetch: n.cancelRefetch ?? !0 },
          o = it.batch(() =>
            k(this, Ve)
              .findAll(r)
              .filter((a) => !a.isDisabled() && !a.isStatic())
              .map((a) => {
                let c = a.fetch(void 0, s)
                return (
                  s.throwOnError || (c = c.catch(Et)),
                  a.state.fetchStatus === "paused" ? Promise.resolve() : c
                )
              }),
          )
        return Promise.all(o).then(Et)
      }
      fetchQuery(r) {
        const n = this.defaultQueryOptions(r)
        n.retry === void 0 && (n.retry = !1)
        const s = k(this, Ve).build(this, n)
        return s.isStaleByTime(nr(n.staleTime, s))
          ? s.fetch(n)
          : Promise.resolve(s.state.data)
      }
      prefetchQuery(r) {
        return this.fetchQuery(r).then(Et).catch(Et)
      }
      fetchInfiniteQuery(r) {
        return ((r.behavior = Kh(r.pages)), this.fetchQuery(r))
      }
      prefetchInfiniteQuery(r) {
        return this.fetchInfiniteQuery(r).then(Et).catch(Et)
      }
      ensureInfiniteQueryData(r) {
        return ((r.behavior = Kh(r.pages)), this.ensureQueryData(r))
      }
      resumePausedMutations() {
        return al.isOnline()
          ? k(this, Xn).resumePausedMutations()
          : Promise.resolve()
      }
      getQueryCache() {
        return k(this, Ve)
      }
      getMutationCache() {
        return k(this, Xn)
      }
      getDefaultOptions() {
        return k(this, Zn)
      }
      setDefaultOptions(r) {
        G(this, Zn, r)
      }
      setQueryDefaults(r, n) {
        k(this, gs).set(xi(r), { queryKey: r, defaultOptions: n })
      }
      getQueryDefaults(r) {
        const n = [...k(this, gs).values()],
          s = {}
        return (
          n.forEach((o) => {
            Si(r, o.queryKey) && Object.assign(s, o.defaultOptions)
          }),
          s
        )
      }
      setMutationDefaults(r, n) {
        k(this, ys).set(xi(r), { mutationKey: r, defaultOptions: n })
      }
      getMutationDefaults(r) {
        const n = [...k(this, ys).values()],
          s = {}
        return (
          n.forEach((o) => {
            Si(r, o.mutationKey) && Object.assign(s, o.defaultOptions)
          }),
          s
        )
      }
      defaultQueryOptions(r) {
        if (r._defaulted) return r
        const n = {
          ...k(this, Zn).queries,
          ...this.getQueryDefaults(r.queryKey),
          ...r,
          _defaulted: !0,
        }
        return (
          n.queryHash || (n.queryHash = fc(n.queryKey, n)),
          n.refetchOnReconnect === void 0 &&
            (n.refetchOnReconnect = n.networkMode !== "always"),
          n.throwOnError === void 0 && (n.throwOnError = !!n.suspense),
          !n.networkMode && n.persister && (n.networkMode = "offlineFirst"),
          n.queryFn === hc && (n.enabled = !1),
          n
        )
      }
      defaultMutationOptions(r) {
        return r != null && r._defaulted
          ? r
          : {
              ...k(this, Zn).mutations,
              ...((r == null ? void 0 : r.mutationKey) &&
                this.getMutationDefaults(r.mutationKey)),
              ...r,
              _defaulted: !0,
            }
      }
      clear() {
        ;(k(this, Ve).clear(), k(this, Xn).clear())
      }
    }),
    (Ve = new WeakMap()),
    (Xn = new WeakMap()),
    (Zn = new WeakMap()),
    (gs = new WeakMap()),
    (ys = new WeakMap()),
    (er = new WeakMap()),
    (vs = new WeakMap()),
    (ws = new WeakMap()),
    Kp),
  Pm = q.createContext(void 0),
  hw = (r) => {
    const n = q.useContext(Pm)
    if (!n)
      throw new Error("No QueryClient set, use QueryClientProvider to set one")
    return n
  },
  pw = ({ client: r, children: n }) => (
    q.useEffect(
      () => (
        r.mount(),
        () => {
          r.unmount()
        }
      ),
      [r],
    ),
    R.jsx(Pm.Provider, { value: r, children: n })
  ),
  Nm = q.createContext(!1),
  mw = () => q.useContext(Nm)
Nm.Provider
function gw() {
  let r = !1
  return {
    clearReset: () => {
      r = !1
    },
    reset: () => {
      r = !0
    },
    isReset: () => r,
  }
}
var yw = q.createContext(gw()),
  vw = () => q.useContext(yw),
  ww = (r, n, s) => {
    const o =
      s != null && s.state.error && typeof r.throwOnError == "function"
        ? Em(r.throwOnError, [s.state.error, s])
        : r.throwOnError
    ;(r.suspense || r.experimental_prefetchInRender || o) &&
      (n.isReset() || (r.retryOnMount = !1))
  },
  xw = (r) => {
    q.useEffect(() => {
      r.clearReset()
    }, [r])
  },
  Sw = ({
    result: r,
    errorResetBoundary: n,
    throwOnError: s,
    query: o,
    suspense: a,
  }) =>
    r.isError &&
    !n.isReset() &&
    !r.isFetching &&
    o &&
    ((a && r.data === void 0) || Em(s, [r.error, o])),
  kw = (r) => {
    if (r.suspense) {
      const s = (a) => (a === "static" ? a : Math.max(a ?? 1e3, 1e3)),
        o = r.staleTime
      ;((r.staleTime = typeof o == "function" ? (...a) => s(o(...a)) : s(o)),
        typeof r.gcTime == "number" && (r.gcTime = Math.max(r.gcTime, 1e3)))
    }
  },
  Ew = (r, n) => r.isLoading && r.isFetching && !n,
  _w = (r, n) => (r == null ? void 0 : r.suspense) && n.isPending,
  Yh = (r, n, s) =>
    n.fetchOptimistic(r).catch(() => {
      s.clearReset()
    })
function bw(r, n, s) {
  var A, L, E, b
  const o = mw(),
    a = vw(),
    c = hw(),
    f = c.defaultQueryOptions(r)
  ;(L =
    (A = c.getDefaultOptions().queries) == null
      ? void 0
      : A._experimental_beforeQuery) == null || L.call(A, f)
  const h = c.getQueryCache().get(f.queryHash)
  ;((f._optimisticResults = o ? "isRestoring" : "optimistic"),
    kw(f),
    ww(f, a, h),
    xw(a))
  const m = !c.getQueryCache().get(f.queryHash),
    [g] = q.useState(() => new n(c, f)),
    y = g.getOptimisticResult(f),
    S = !o && r.subscribed !== !1
  if (
    (q.useSyncExternalStore(
      q.useCallback(
        (w) => {
          const F = S ? g.subscribe(it.batchCalls(w)) : Et
          return (g.updateResult(), F)
        },
        [g, S],
      ),
      () => g.getCurrentResult(),
      () => g.getCurrentResult(),
    ),
    q.useEffect(() => {
      g.setOptions(f)
    }, [f, g]),
    _w(f, y))
  )
    throw Yh(f, g, a)
  if (
    Sw({
      result: y,
      errorResetBoundary: a,
      throwOnError: f.throwOnError,
      query: h,
      suspense: f.suspense,
    })
  )
    throw y.error
  if (
    ((b =
      (E = c.getDefaultOptions().queries) == null
        ? void 0
        : E._experimental_afterQuery) == null || b.call(E, f, y),
    f.experimental_prefetchInRender && !Ar && Ew(y, o))
  ) {
    const w = m ? Yh(f, g, a) : h == null ? void 0 : h.promise
    w == null ||
      w.catch(Et).finally(() => {
        g.updateResult()
      })
  }
  return f.notifyOnChangeProps ? y : g.trackResult(y)
}
function Cw(r, n) {
  return bw(r, sw)
}
const Rw = new fw({
  defaultOptions: { queries: { refetchOnWindowFocus: !1, retry: 1 } },
})
Yp()
/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function ul() {
  return (
    (ul = Object.assign
      ? Object.assign.bind()
      : function (r) {
          for (var n = 1; n < arguments.length; n++) {
            var s = arguments[n]
            for (var o in s)
              Object.prototype.hasOwnProperty.call(s, o) && (r[o] = s[o])
          }
          return r
        }),
    ul.apply(this, arguments)
  )
}
var tr
;(function (r) {
  ;((r.Pop = "POP"), (r.Push = "PUSH"), (r.Replace = "REPLACE"))
})(tr || (tr = {}))
const Jh = "popstate"
function Tw(r) {
  r === void 0 && (r = {})
  function n(o, a) {
    let { pathname: c, search: f, hash: h } = o.location
    return Ku(
      "",
      { pathname: c, search: f, hash: h },
      (a.state && a.state.usr) || null,
      (a.state && a.state.key) || "default",
    )
  }
  function s(o, a) {
    return typeof a == "string" ? a : Am(a)
  }
  return Nw(n, s, null, r)
}
function Ct(r, n) {
  if (r === !1 || r === null || typeof r > "u") throw new Error(n)
}
function Om(r, n) {
  if (!r) {
    typeof console < "u" && console.warn(n)
    try {
      throw new Error(n)
    } catch {}
  }
}
function Pw() {
  return Math.random().toString(36).substr(2, 8)
}
function Xh(r, n) {
  return { usr: r.state, key: r.key, idx: n }
}
function Ku(r, n, s, o) {
  return (
    s === void 0 && (s = null),
    ul(
      { pathname: typeof r == "string" ? r : r.pathname, search: "", hash: "" },
      typeof n == "string" ? hl(n) : n,
      { state: s, key: (n && n.key) || o || Pw() },
    )
  )
}
function Am(r) {
  let { pathname: n = "/", search: s = "", hash: o = "" } = r
  return (
    s && s !== "?" && (n += s.charAt(0) === "?" ? s : "?" + s),
    o && o !== "#" && (n += o.charAt(0) === "#" ? o : "#" + o),
    n
  )
}
function hl(r) {
  let n = {}
  if (r) {
    let s = r.indexOf("#")
    s >= 0 && ((n.hash = r.substr(s)), (r = r.substr(0, s)))
    let o = r.indexOf("?")
    ;(o >= 0 && ((n.search = r.substr(o)), (r = r.substr(0, o))),
      r && (n.pathname = r))
  }
  return n
}
function Nw(r, n, s, o) {
  o === void 0 && (o = {})
  let { window: a = document.defaultView, v5Compat: c = !1 } = o,
    f = a.history,
    h = tr.Pop,
    m = null,
    g = y()
  g == null && ((g = 0), f.replaceState(ul({}, f.state, { idx: g }), ""))
  function y() {
    return (f.state || { idx: null }).idx
  }
  function S() {
    h = tr.Pop
    let w = y(),
      F = w == null ? null : w - g
    ;((g = w), m && m({ action: h, location: b.location, delta: F }))
  }
  function A(w, F) {
    h = tr.Push
    let Q = Ku(b.location, w, F)
    g = y() + 1
    let B = Xh(Q, g),
      j = b.createHref(Q)
    try {
      f.pushState(B, "", j)
    } catch (K) {
      if (K instanceof DOMException && K.name === "DataCloneError") throw K
      a.location.assign(j)
    }
    c && m && m({ action: h, location: b.location, delta: 1 })
  }
  function L(w, F) {
    h = tr.Replace
    let Q = Ku(b.location, w, F)
    g = y()
    let B = Xh(Q, g),
      j = b.createHref(Q)
    ;(f.replaceState(B, "", j),
      c && m && m({ action: h, location: b.location, delta: 0 }))
  }
  function E(w) {
    let F = a.location.origin !== "null" ? a.location.origin : a.location.href,
      Q = typeof w == "string" ? w : Am(w)
    return (
      (Q = Q.replace(/ $/, "%20")),
      Ct(
        F,
        "No window.location.(origin|href) available to create URL for href: " +
          Q,
      ),
      new URL(Q, F)
    )
  }
  let b = {
    get action() {
      return h
    },
    get location() {
      return r(a, f)
    },
    listen(w) {
      if (m) throw new Error("A history only accepts one active listener")
      return (
        a.addEventListener(Jh, S),
        (m = w),
        () => {
          ;(a.removeEventListener(Jh, S), (m = null))
        }
      )
    },
    createHref(w) {
      return n(a, w)
    },
    createURL: E,
    encodeLocation(w) {
      let F = E(w)
      return { pathname: F.pathname, search: F.search, hash: F.hash }
    },
    push: A,
    replace: L,
    go(w) {
      return f.go(w)
    },
  }
  return b
}
var Zh
;(function (r) {
  ;((r.data = "data"),
    (r.deferred = "deferred"),
    (r.redirect = "redirect"),
    (r.error = "error"))
})(Zh || (Zh = {}))
function Ow(r, n, s) {
  return (s === void 0 && (s = "/"), Aw(r, n, s))
}
function Aw(r, n, s, o) {
  let a = typeof n == "string" ? hl(n) : n,
    c = Im(a.pathname || "/", s)
  if (c == null) return null
  let f = Lm(r)
  Lw(f)
  let h = null
  for (let m = 0; h == null && m < f.length; ++m) {
    let g = Hw(c)
    h = $w(f[m], g)
  }
  return h
}
function Lm(r, n, s, o) {
  ;(n === void 0 && (n = []),
    s === void 0 && (s = []),
    o === void 0 && (o = ""))
  let a = (c, f, h) => {
    let m = {
      relativePath: h === void 0 ? c.path || "" : h,
      caseSensitive: c.caseSensitive === !0,
      childrenIndex: f,
      route: c,
    }
    m.relativePath.startsWith("/") &&
      (Ct(
        m.relativePath.startsWith(o),
        'Absolute route path "' +
          m.relativePath +
          '" nested under path ' +
          ('"' + o + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes.",
      ),
      (m.relativePath = m.relativePath.slice(o.length)))
    let g = ls([o, m.relativePath]),
      y = s.concat(m)
    ;(c.children &&
      c.children.length > 0 &&
      (Ct(
        c.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + g + '".'),
      ),
      Lm(c.children, n, y, g)),
      !(c.path == null && !c.index) &&
        n.push({ path: g, score: zw(g, c.index), routesMeta: y }))
  }
  return (
    r.forEach((c, f) => {
      var h
      if (c.path === "" || !((h = c.path) != null && h.includes("?"))) a(c, f)
      else for (let m of jm(c.path)) a(c, f, m)
    }),
    n
  )
}
function jm(r) {
  let n = r.split("/")
  if (n.length === 0) return []
  let [s, ...o] = n,
    a = s.endsWith("?"),
    c = s.replace(/\?$/, "")
  if (o.length === 0) return a ? [c, ""] : [c]
  let f = jm(o.join("/")),
    h = []
  return (
    h.push(...f.map((m) => (m === "" ? c : [c, m].join("/")))),
    a && h.push(...f),
    h.map((m) => (r.startsWith("/") && m === "" ? "/" : m))
  )
}
function Lw(r) {
  r.sort((n, s) =>
    n.score !== s.score
      ? s.score - n.score
      : Bw(
          n.routesMeta.map((o) => o.childrenIndex),
          s.routesMeta.map((o) => o.childrenIndex),
        ),
  )
}
const jw = /^:[\w-]+$/,
  Iw = 3,
  Dw = 2,
  Fw = 1,
  Uw = 10,
  Mw = -2,
  ep = (r) => r === "*"
function zw(r, n) {
  let s = r.split("/"),
    o = s.length
  return (
    s.some(ep) && (o += Mw),
    n && (o += Dw),
    s
      .filter((a) => !ep(a))
      .reduce((a, c) => a + (jw.test(c) ? Iw : c === "" ? Fw : Uw), o)
  )
}
function Bw(r, n) {
  return r.length === n.length && r.slice(0, -1).every((o, a) => o === n[a])
    ? r[r.length - 1] - n[n.length - 1]
    : 0
}
function $w(r, n, s) {
  let { routesMeta: o } = r,
    a = {},
    c = "/",
    f = []
  for (let h = 0; h < o.length; ++h) {
    let m = o[h],
      g = h === o.length - 1,
      y = c === "/" ? n : n.slice(c.length) || "/",
      S = Vw(
        { path: m.relativePath, caseSensitive: m.caseSensitive, end: g },
        y,
      ),
      A = m.route
    if (!S) return null
    ;(Object.assign(a, S.params),
      f.push({
        params: a,
        pathname: ls([c, S.pathname]),
        pathnameBase: Qw(ls([c, S.pathnameBase])),
        route: A,
      }),
      S.pathnameBase !== "/" && (c = ls([c, S.pathnameBase])))
  }
  return f
}
function Vw(r, n) {
  typeof r == "string" && (r = { path: r, caseSensitive: !1, end: !0 })
  let [s, o] = qw(r.path, r.caseSensitive, r.end),
    a = n.match(s)
  if (!a) return null
  let c = a[0],
    f = c.replace(/(.)\/+$/, "$1"),
    h = a.slice(1)
  return {
    params: o.reduce((g, y, S) => {
      let { paramName: A, isOptional: L } = y
      if (A === "*") {
        let b = h[S] || ""
        f = c.slice(0, c.length - b.length).replace(/(.)\/+$/, "$1")
      }
      const E = h[S]
      return (
        L && !E ? (g[A] = void 0) : (g[A] = (E || "").replace(/%2F/g, "/")),
        g
      )
    }, {}),
    pathname: c,
    pathnameBase: f,
    pattern: r,
  }
}
function qw(r, n, s) {
  ;(n === void 0 && (n = !1),
    s === void 0 && (s = !0),
    Om(
      r === "*" || !r.endsWith("*") || r.endsWith("/*"),
      'Route path "' +
        r +
        '" will be treated as if it were ' +
        ('"' + r.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + r.replace(/\*$/, "/*") + '".'),
    ))
  let o = [],
    a =
      "^" +
      r
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (f, h, m) => (
            o.push({ paramName: h, isOptional: m != null }),
            m ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        )
  return (
    r.endsWith("*")
      ? (o.push({ paramName: "*" }),
        (a += r === "*" || r === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : s
        ? (a += "\\/*$")
        : r !== "" && r !== "/" && (a += "(?:(?=\\/|$))"),
    [new RegExp(a, n ? void 0 : "i"), o]
  )
}
function Hw(r) {
  try {
    return r
      .split("/")
      .map((n) => decodeURIComponent(n).replace(/\//g, "%2F"))
      .join("/")
  } catch (n) {
    return (
      Om(
        !1,
        'The URL path "' +
          r +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + n + ")."),
      ),
      r
    )
  }
}
function Im(r, n) {
  if (n === "/") return r
  if (!r.toLowerCase().startsWith(n.toLowerCase())) return null
  let s = n.endsWith("/") ? n.length - 1 : n.length,
    o = r.charAt(s)
  return o && o !== "/" ? null : r.slice(s) || "/"
}
const ls = (r) => r.join("/").replace(/\/\/+/g, "/"),
  Qw = (r) => r.replace(/\/+$/, "").replace(/^\/*/, "/")
function Ww(r) {
  return (
    r != null &&
    typeof r.status == "number" &&
    typeof r.statusText == "string" &&
    typeof r.internal == "boolean" &&
    "data" in r
  )
}
const Dm = ["post", "put", "patch", "delete"]
new Set(Dm)
const Kw = ["get", ...Dm]
new Set(Kw)
/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function cl() {
  return (
    (cl = Object.assign
      ? Object.assign.bind()
      : function (r) {
          for (var n = 1; n < arguments.length; n++) {
            var s = arguments[n]
            for (var o in s)
              Object.prototype.hasOwnProperty.call(s, o) && (r[o] = s[o])
          }
          return r
        }),
    cl.apply(this, arguments)
  )
}
const Gw = q.createContext(null),
  Yw = q.createContext(null),
  Fm = q.createContext(null),
  pl = q.createContext(null),
  ml = q.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Um = q.createContext(null)
function gc() {
  return q.useContext(pl) != null
}
function Mm() {
  return (gc() || Ct(!1), q.useContext(pl).location)
}
function Jw(r, n) {
  return Xw(r, n)
}
function Xw(r, n, s, o) {
  gc() || Ct(!1)
  let { navigator: a } = q.useContext(Fm),
    { matches: c } = q.useContext(ml),
    f = c[c.length - 1],
    h = f ? f.params : {}
  f && f.pathname
  let m = f ? f.pathnameBase : "/"
  f && f.route
  let g = Mm(),
    y
  if (n) {
    var S
    let w = typeof n == "string" ? hl(n) : n
    ;(m === "/" || ((S = w.pathname) != null && S.startsWith(m)) || Ct(!1),
      (y = w))
  } else y = g
  let A = y.pathname || "/",
    L = A
  if (m !== "/") {
    let w = m.replace(/^\//, "").split("/")
    L = "/" + A.replace(/^\//, "").split("/").slice(w.length).join("/")
  }
  let E = Ow(r, { pathname: L }),
    b = rx(
      E &&
        E.map((w) =>
          Object.assign({}, w, {
            params: Object.assign({}, h, w.params),
            pathname: ls([
              m,
              a.encodeLocation
                ? a.encodeLocation(w.pathname).pathname
                : w.pathname,
            ]),
            pathnameBase:
              w.pathnameBase === "/"
                ? m
                : ls([
                    m,
                    a.encodeLocation
                      ? a.encodeLocation(w.pathnameBase).pathname
                      : w.pathnameBase,
                  ]),
          }),
        ),
      c,
      s,
      o,
    )
  return n && b
    ? q.createElement(
        pl.Provider,
        {
          value: {
            location: cl(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              y,
            ),
            navigationType: tr.Pop,
          },
        },
        b,
      )
    : b
}
function Zw() {
  let r = lx(),
    n = Ww(r)
      ? r.status + " " + r.statusText
      : r instanceof Error
        ? r.message
        : JSON.stringify(r),
    s = r instanceof Error ? r.stack : null,
    a = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" }
  return q.createElement(
    q.Fragment,
    null,
    q.createElement("h2", null, "Unexpected Application Error!"),
    q.createElement("h3", { style: { fontStyle: "italic" } }, n),
    s ? q.createElement("pre", { style: a }, s) : null,
    null,
  )
}
const ex = q.createElement(Zw, null)
class tx extends q.Component {
  constructor(n) {
    ;(super(n),
      (this.state = {
        location: n.location,
        revalidation: n.revalidation,
        error: n.error,
      }))
  }
  static getDerivedStateFromError(n) {
    return { error: n }
  }
  static getDerivedStateFromProps(n, s) {
    return s.location !== n.location ||
      (s.revalidation !== "idle" && n.revalidation === "idle")
      ? { error: n.error, location: n.location, revalidation: n.revalidation }
      : {
          error: n.error !== void 0 ? n.error : s.error,
          location: s.location,
          revalidation: n.revalidation || s.revalidation,
        }
  }
  componentDidCatch(n, s) {
    console.error("React Router caught the following error during render", n, s)
  }
  render() {
    return this.state.error !== void 0
      ? q.createElement(
          ml.Provider,
          { value: this.props.routeContext },
          q.createElement(Um.Provider, {
            value: this.state.error,
            children: this.props.component,
          }),
        )
      : this.props.children
  }
}
function nx(r) {
  let { routeContext: n, match: s, children: o } = r,
    a = q.useContext(Gw)
  return (
    a &&
      a.static &&
      a.staticContext &&
      (s.route.errorElement || s.route.ErrorBoundary) &&
      (a.staticContext._deepestRenderedBoundaryId = s.route.id),
    q.createElement(ml.Provider, { value: n }, o)
  )
}
function rx(r, n, s, o) {
  var a
  if (
    (n === void 0 && (n = []),
    s === void 0 && (s = null),
    o === void 0 && (o = null),
    r == null)
  ) {
    var c
    if (!s) return null
    if (s.errors) r = s.matches
    else if (
      (c = o) != null &&
      c.v7_partialHydration &&
      n.length === 0 &&
      !s.initialized &&
      s.matches.length > 0
    )
      r = s.matches
    else return null
  }
  let f = r,
    h = (a = s) == null ? void 0 : a.errors
  if (h != null) {
    let y = f.findIndex(
      (S) => S.route.id && (h == null ? void 0 : h[S.route.id]) !== void 0,
    )
    ;(y >= 0 || Ct(!1), (f = f.slice(0, Math.min(f.length, y + 1))))
  }
  let m = !1,
    g = -1
  if (s && o && o.v7_partialHydration)
    for (let y = 0; y < f.length; y++) {
      let S = f[y]
      if (
        ((S.route.HydrateFallback || S.route.hydrateFallbackElement) && (g = y),
        S.route.id)
      ) {
        let { loaderData: A, errors: L } = s,
          E =
            S.route.loader &&
            A[S.route.id] === void 0 &&
            (!L || L[S.route.id] === void 0)
        if (S.route.lazy || E) {
          ;((m = !0), g >= 0 ? (f = f.slice(0, g + 1)) : (f = [f[0]]))
          break
        }
      }
    }
  return f.reduceRight((y, S, A) => {
    let L,
      E = !1,
      b = null,
      w = null
    s &&
      ((L = h && S.route.id ? h[S.route.id] : void 0),
      (b = S.route.errorElement || ex),
      m &&
        (g < 0 && A === 0
          ? (ax("route-fallback"), (E = !0), (w = null))
          : g === A &&
            ((E = !0), (w = S.route.hydrateFallbackElement || null))))
    let F = n.concat(f.slice(0, A + 1)),
      Q = () => {
        let B
        return (
          L
            ? (B = b)
            : E
              ? (B = w)
              : S.route.Component
                ? (B = q.createElement(S.route.Component, null))
                : S.route.element
                  ? (B = S.route.element)
                  : (B = y),
          q.createElement(nx, {
            match: S,
            routeContext: { outlet: y, matches: F, isDataRoute: s != null },
            children: B,
          })
        )
      }
    return s && (S.route.ErrorBoundary || S.route.errorElement || A === 0)
      ? q.createElement(tx, {
          location: s.location,
          revalidation: s.revalidation,
          component: b,
          error: L,
          children: Q(),
          routeContext: { outlet: null, matches: F, isDataRoute: !0 },
        })
      : Q()
  }, null)
}
var zm = (function (r) {
  return (
    (r.UseBlocker = "useBlocker"),
    (r.UseLoaderData = "useLoaderData"),
    (r.UseActionData = "useActionData"),
    (r.UseRouteError = "useRouteError"),
    (r.UseNavigation = "useNavigation"),
    (r.UseRouteLoaderData = "useRouteLoaderData"),
    (r.UseMatches = "useMatches"),
    (r.UseRevalidator = "useRevalidator"),
    (r.UseNavigateStable = "useNavigate"),
    (r.UseRouteId = "useRouteId"),
    r
  )
})(zm || {})
function sx(r) {
  let n = q.useContext(Yw)
  return (n || Ct(!1), n)
}
function ix(r) {
  let n = q.useContext(ml)
  return (n || Ct(!1), n)
}
function ox(r) {
  let n = ix(),
    s = n.matches[n.matches.length - 1]
  return (s.route.id || Ct(!1), s.route.id)
}
function lx() {
  var r
  let n = q.useContext(Um),
    s = sx(zm.UseRouteError),
    o = ox()
  return n !== void 0 ? n : (r = s.errors) == null ? void 0 : r[o]
}
const tp = {}
function ax(r, n, s) {
  tp[r] || (tp[r] = !0)
}
function ux(r, n) {
  ;(r == null || r.v7_startTransition, r == null || r.v7_relativeSplatPath)
}
function Gu(r) {
  Ct(!1)
}
function cx(r) {
  let {
    basename: n = "/",
    children: s = null,
    location: o,
    navigationType: a = tr.Pop,
    navigator: c,
    static: f = !1,
    future: h,
  } = r
  gc() && Ct(!1)
  let m = n.replace(/^\/*/, "/"),
    g = q.useMemo(
      () => ({
        basename: m,
        navigator: c,
        static: f,
        future: cl({ v7_relativeSplatPath: !1 }, h),
      }),
      [m, h, c, f],
    )
  typeof o == "string" && (o = hl(o))
  let {
      pathname: y = "/",
      search: S = "",
      hash: A = "",
      state: L = null,
      key: E = "default",
    } = o,
    b = q.useMemo(() => {
      let w = Im(y, m)
      return w == null
        ? null
        : {
            location: { pathname: w, search: S, hash: A, state: L, key: E },
            navigationType: a,
          }
    }, [m, y, S, A, L, E, a])
  return b == null
    ? null
    : q.createElement(
        Fm.Provider,
        { value: g },
        q.createElement(pl.Provider, { children: s, value: b }),
      )
}
function dx(r) {
  let { children: n, location: s } = r
  return Jw(Yu(n), s)
}
new Promise(() => {})
function Yu(r, n) {
  n === void 0 && (n = [])
  let s = []
  return (
    q.Children.forEach(r, (o, a) => {
      if (!q.isValidElement(o)) return
      let c = [...n, a]
      if (o.type === q.Fragment) {
        s.push.apply(s, Yu(o.props.children, c))
        return
      }
      ;(o.type !== Gu && Ct(!1), !o.props.index || !o.props.children || Ct(!1))
      let f = {
        id: o.props.id || c.join("-"),
        caseSensitive: o.props.caseSensitive,
        element: o.props.element,
        Component: o.props.Component,
        index: o.props.index,
        path: o.props.path,
        loader: o.props.loader,
        action: o.props.action,
        errorElement: o.props.errorElement,
        ErrorBoundary: o.props.ErrorBoundary,
        hasErrorBoundary:
          o.props.ErrorBoundary != null || o.props.errorElement != null,
        shouldRevalidate: o.props.shouldRevalidate,
        handle: o.props.handle,
        lazy: o.props.lazy,
      }
      ;(o.props.children && (f.children = Yu(o.props.children, c)), s.push(f))
    }),
    s
  )
}
/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ const fx = "6"
try {
  window.__reactRouterVersion = fx
} catch {}
const hx = "startTransition",
  np = bv[hx]
function px(r) {
  let { basename: n, children: s, future: o, window: a } = r,
    c = q.useRef()
  c.current == null && (c.current = Tw({ window: a, v5Compat: !0 }))
  let f = c.current,
    [h, m] = q.useState({ action: f.action, location: f.location }),
    { v7_startTransition: g } = o || {},
    y = q.useCallback(
      (S) => {
        g && np ? np(() => m(S)) : m(S)
      },
      [m, g],
    )
  return (
    q.useLayoutEffect(() => f.listen(y), [f, y]),
    q.useEffect(() => ux(o), [o]),
    q.createElement(cx, {
      basename: n,
      children: s,
      location: h.location,
      navigationType: h.action,
      navigator: f,
      future: o,
    })
  )
}
var rp
;(function (r) {
  ;((r.UseScrollRestoration = "useScrollRestoration"),
    (r.UseSubmit = "useSubmit"),
    (r.UseSubmitFetcher = "useSubmitFetcher"),
    (r.UseFetcher = "useFetcher"),
    (r.useViewTransitionState = "useViewTransitionState"))
})(rp || (rp = {}))
var sp
;(function (r) {
  ;((r.UseFetcher = "useFetcher"),
    (r.UseFetchers = "useFetchers"),
    (r.UseScrollRestoration = "useScrollRestoration"))
})(sp || (sp = {}))
function Bm(r, n) {
  return function () {
    return r.apply(n, arguments)
  }
}
const { toString: mx } = Object.prototype,
  { getPrototypeOf: yc } = Object,
  { iterator: gl, toStringTag: $m } = Symbol,
  yl = ((r) => (n) => {
    const s = mx.call(n)
    return r[s] || (r[s] = s.slice(8, -1).toLowerCase())
  })(Object.create(null)),
  Jt = (r) => ((r = r.toLowerCase()), (n) => yl(n) === r),
  vl = (r) => (n) => typeof n === r,
  { isArray: Ss } = Array,
  xs = vl("undefined")
function Ni(r) {
  return (
    r !== null &&
    !xs(r) &&
    r.constructor !== null &&
    !xs(r.constructor) &&
    _t(r.constructor.isBuffer) &&
    r.constructor.isBuffer(r)
  )
}
const Vm = Jt("ArrayBuffer")
function gx(r) {
  let n
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (n = ArrayBuffer.isView(r))
      : (n = r && r.buffer && Vm(r.buffer)),
    n
  )
}
const yx = vl("string"),
  _t = vl("function"),
  qm = vl("number"),
  Oi = (r) => r !== null && typeof r == "object",
  vx = (r) => r === !0 || r === !1,
  el = (r) => {
    if (yl(r) !== "object") return !1
    const n = yc(r)
    return (
      (n === null ||
        n === Object.prototype ||
        Object.getPrototypeOf(n) === null) &&
      !($m in r) &&
      !(gl in r)
    )
  },
  wx = (r) => {
    if (!Oi(r) || Ni(r)) return !1
    try {
      return (
        Object.keys(r).length === 0 &&
        Object.getPrototypeOf(r) === Object.prototype
      )
    } catch {
      return !1
    }
  },
  xx = Jt("Date"),
  Sx = Jt("File"),
  kx = Jt("Blob"),
  Ex = Jt("FileList"),
  _x = (r) => Oi(r) && _t(r.pipe),
  bx = (r) => {
    let n
    return (
      r &&
      ((typeof FormData == "function" && r instanceof FormData) ||
        (_t(r.append) &&
          ((n = yl(r)) === "formdata" ||
            (n === "object" &&
              _t(r.toString) &&
              r.toString() === "[object FormData]"))))
    )
  },
  Cx = Jt("URLSearchParams"),
  [Rx, Tx, Px, Nx] = ["ReadableStream", "Request", "Response", "Headers"].map(
    Jt,
  ),
  Ox = (r) =>
    r.trim ? r.trim() : r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
function Ai(r, n, { allOwnKeys: s = !1 } = {}) {
  if (r === null || typeof r > "u") return
  let o, a
  if ((typeof r != "object" && (r = [r]), Ss(r)))
    for (o = 0, a = r.length; o < a; o++) n.call(null, r[o], o, r)
  else {
    if (Ni(r)) return
    const c = s ? Object.getOwnPropertyNames(r) : Object.keys(r),
      f = c.length
    let h
    for (o = 0; o < f; o++) ((h = c[o]), n.call(null, r[h], h, r))
  }
}
function Hm(r, n) {
  if (Ni(r)) return null
  n = n.toLowerCase()
  const s = Object.keys(r)
  let o = s.length,
    a
  for (; o-- > 0; ) if (((a = s[o]), n === a.toLowerCase())) return a
  return null
}
const Sr =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
        ? self
        : typeof window < "u"
          ? window
          : global,
  Qm = (r) => !xs(r) && r !== Sr
function Ju() {
  const { caseless: r, skipUndefined: n } = (Qm(this) && this) || {},
    s = {},
    o = (a, c) => {
      if (c === "__proto__" || c === "constructor" || c === "prototype") return
      const f = (r && Hm(s, c)) || c
      el(s[f]) && el(a)
        ? (s[f] = Ju(s[f], a))
        : el(a)
          ? (s[f] = Ju({}, a))
          : Ss(a)
            ? (s[f] = a.slice())
            : (!n || !xs(a)) && (s[f] = a)
    }
  for (let a = 0, c = arguments.length; a < c; a++)
    arguments[a] && Ai(arguments[a], o)
  return s
}
const Ax = (r, n, s, { allOwnKeys: o } = {}) => (
    Ai(
      n,
      (a, c) => {
        s && _t(a)
          ? Object.defineProperty(r, c, {
              value: Bm(a, s),
              writable: !0,
              enumerable: !0,
              configurable: !0,
            })
          : Object.defineProperty(r, c, {
              value: a,
              writable: !0,
              enumerable: !0,
              configurable: !0,
            })
      },
      { allOwnKeys: o },
    ),
    r
  ),
  Lx = (r) => (r.charCodeAt(0) === 65279 && (r = r.slice(1)), r),
  jx = (r, n, s, o) => {
    ;((r.prototype = Object.create(n.prototype, o)),
      Object.defineProperty(r.prototype, "constructor", {
        value: r,
        writable: !0,
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(r, "super", { value: n.prototype }),
      s && Object.assign(r.prototype, s))
  },
  Ix = (r, n, s, o) => {
    let a, c, f
    const h = {}
    if (((n = n || {}), r == null)) return n
    do {
      for (a = Object.getOwnPropertyNames(r), c = a.length; c-- > 0; )
        ((f = a[c]),
          (!o || o(f, r, n)) && !h[f] && ((n[f] = r[f]), (h[f] = !0)))
      r = s !== !1 && yc(r)
    } while (r && (!s || s(r, n)) && r !== Object.prototype)
    return n
  },
  Dx = (r, n, s) => {
    ;((r = String(r)),
      (s === void 0 || s > r.length) && (s = r.length),
      (s -= n.length))
    const o = r.indexOf(n, s)
    return o !== -1 && o === s
  },
  Fx = (r) => {
    if (!r) return null
    if (Ss(r)) return r
    let n = r.length
    if (!qm(n)) return null
    const s = new Array(n)
    for (; n-- > 0; ) s[n] = r[n]
    return s
  },
  Ux = (
    (r) => (n) =>
      r && n instanceof r
  )(typeof Uint8Array < "u" && yc(Uint8Array)),
  Mx = (r, n) => {
    const o = (r && r[gl]).call(r)
    let a
    for (; (a = o.next()) && !a.done; ) {
      const c = a.value
      n.call(r, c[0], c[1])
    }
  },
  zx = (r, n) => {
    let s
    const o = []
    for (; (s = r.exec(n)) !== null; ) o.push(s)
    return o
  },
  Bx = Jt("HTMLFormElement"),
  $x = (r) =>
    r.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (s, o, a) {
      return o.toUpperCase() + a
    }),
  ip = (
    ({ hasOwnProperty: r }) =>
    (n, s) =>
      r.call(n, s)
  )(Object.prototype),
  Vx = Jt("RegExp"),
  Wm = (r, n) => {
    const s = Object.getOwnPropertyDescriptors(r),
      o = {}
    ;(Ai(s, (a, c) => {
      let f
      ;(f = n(a, c, r)) !== !1 && (o[c] = f || a)
    }),
      Object.defineProperties(r, o))
  },
  qx = (r) => {
    Wm(r, (n, s) => {
      if (_t(r) && ["arguments", "caller", "callee"].indexOf(s) !== -1)
        return !1
      const o = r[s]
      if (_t(o)) {
        if (((n.enumerable = !1), "writable" in n)) {
          n.writable = !1
          return
        }
        n.set ||
          (n.set = () => {
            throw Error("Can not rewrite read-only method '" + s + "'")
          })
      }
    })
  },
  Hx = (r, n) => {
    const s = {},
      o = (a) => {
        a.forEach((c) => {
          s[c] = !0
        })
      }
    return (Ss(r) ? o(r) : o(String(r).split(n)), s)
  },
  Qx = () => {},
  Wx = (r, n) => (r != null && Number.isFinite((r = +r)) ? r : n)
function Kx(r) {
  return !!(r && _t(r.append) && r[$m] === "FormData" && r[gl])
}
const Gx = (r) => {
    const n = new Array(10),
      s = (o, a) => {
        if (Oi(o)) {
          if (n.indexOf(o) >= 0) return
          if (Ni(o)) return o
          if (!("toJSON" in o)) {
            n[a] = o
            const c = Ss(o) ? [] : {}
            return (
              Ai(o, (f, h) => {
                const m = s(f, a + 1)
                !xs(m) && (c[h] = m)
              }),
              (n[a] = void 0),
              c
            )
          }
        }
        return o
      }
    return s(r, 0)
  },
  Yx = Jt("AsyncFunction"),
  Jx = (r) => r && (Oi(r) || _t(r)) && _t(r.then) && _t(r.catch),
  Km = ((r, n) =>
    r
      ? setImmediate
      : n
        ? ((s, o) => (
            Sr.addEventListener(
              "message",
              ({ source: a, data: c }) => {
                a === Sr && c === s && o.length && o.shift()()
              },
              !1,
            ),
            (a) => {
              ;(o.push(a), Sr.postMessage(s, "*"))
            }
          ))(`axios@${Math.random()}`, [])
        : (s) => setTimeout(s))(
    typeof setImmediate == "function",
    _t(Sr.postMessage),
  ),
  Xx =
    typeof queueMicrotask < "u"
      ? queueMicrotask.bind(Sr)
      : (typeof process < "u" && process.nextTick) || Km,
  Zx = (r) => r != null && _t(r[gl]),
  O = {
    isArray: Ss,
    isArrayBuffer: Vm,
    isBuffer: Ni,
    isFormData: bx,
    isArrayBufferView: gx,
    isString: yx,
    isNumber: qm,
    isBoolean: vx,
    isObject: Oi,
    isPlainObject: el,
    isEmptyObject: wx,
    isReadableStream: Rx,
    isRequest: Tx,
    isResponse: Px,
    isHeaders: Nx,
    isUndefined: xs,
    isDate: xx,
    isFile: Sx,
    isBlob: kx,
    isRegExp: Vx,
    isFunction: _t,
    isStream: _x,
    isURLSearchParams: Cx,
    isTypedArray: Ux,
    isFileList: Ex,
    forEach: Ai,
    merge: Ju,
    extend: Ax,
    trim: Ox,
    stripBOM: Lx,
    inherits: jx,
    toFlatObject: Ix,
    kindOf: yl,
    kindOfTest: Jt,
    endsWith: Dx,
    toArray: Fx,
    forEachEntry: Mx,
    matchAll: zx,
    isHTMLForm: Bx,
    hasOwnProperty: ip,
    hasOwnProp: ip,
    reduceDescriptors: Wm,
    freezeMethods: qx,
    toObjectSet: Hx,
    toCamelCase: $x,
    noop: Qx,
    toFiniteNumber: Wx,
    findKey: Hm,
    global: Sr,
    isContextDefined: Qm,
    isSpecCompliantForm: Kx,
    toJSONObject: Gx,
    isAsyncFn: Yx,
    isThenable: Jx,
    setImmediate: Km,
    asap: Xx,
    isIterable: Zx,
  }
let fe = class Gm extends Error {
  static from(n, s, o, a, c, f) {
    const h = new Gm(n.message, s || n.code, o, a, c)
    return ((h.cause = n), (h.name = n.name), f && Object.assign(h, f), h)
  }
  constructor(n, s, o, a, c) {
    ;(super(n),
      (this.name = "AxiosError"),
      (this.isAxiosError = !0),
      s && (this.code = s),
      o && (this.config = o),
      a && (this.request = a),
      c && ((this.response = c), (this.status = c.status)))
  }
  toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: O.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    }
  }
}
fe.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE"
fe.ERR_BAD_OPTION = "ERR_BAD_OPTION"
fe.ECONNABORTED = "ECONNABORTED"
fe.ETIMEDOUT = "ETIMEDOUT"
fe.ERR_NETWORK = "ERR_NETWORK"
fe.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS"
fe.ERR_DEPRECATED = "ERR_DEPRECATED"
fe.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE"
fe.ERR_BAD_REQUEST = "ERR_BAD_REQUEST"
fe.ERR_CANCELED = "ERR_CANCELED"
fe.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT"
fe.ERR_INVALID_URL = "ERR_INVALID_URL"
const e1 = null
function Xu(r) {
  return O.isPlainObject(r) || O.isArray(r)
}
function Ym(r) {
  return O.endsWith(r, "[]") ? r.slice(0, -2) : r
}
function op(r, n, s) {
  return r
    ? r
        .concat(n)
        .map(function (a, c) {
          return ((a = Ym(a)), !s && c ? "[" + a + "]" : a)
        })
        .join(s ? "." : "")
    : n
}
function t1(r) {
  return O.isArray(r) && !r.some(Xu)
}
const n1 = O.toFlatObject(O, {}, null, function (n) {
  return /^is[A-Z]/.test(n)
})
function wl(r, n, s) {
  if (!O.isObject(r)) throw new TypeError("target must be an object")
  ;((n = n || new FormData()),
    (s = O.toFlatObject(
      s,
      { metaTokens: !0, dots: !1, indexes: !1 },
      !1,
      function (b, w) {
        return !O.isUndefined(w[b])
      },
    )))
  const o = s.metaTokens,
    a = s.visitor || y,
    c = s.dots,
    f = s.indexes,
    m = (s.Blob || (typeof Blob < "u" && Blob)) && O.isSpecCompliantForm(n)
  if (!O.isFunction(a)) throw new TypeError("visitor must be a function")
  function g(E) {
    if (E === null) return ""
    if (O.isDate(E)) return E.toISOString()
    if (O.isBoolean(E)) return E.toString()
    if (!m && O.isBlob(E))
      throw new fe("Blob is not supported. Use a Buffer instead.")
    return O.isArrayBuffer(E) || O.isTypedArray(E)
      ? m && typeof Blob == "function"
        ? new Blob([E])
        : Buffer.from(E)
      : E
  }
  function y(E, b, w) {
    let F = E
    if (E && !w && typeof E == "object") {
      if (O.endsWith(b, "{}"))
        ((b = o ? b : b.slice(0, -2)), (E = JSON.stringify(E)))
      else if (
        (O.isArray(E) && t1(E)) ||
        ((O.isFileList(E) || O.endsWith(b, "[]")) && (F = O.toArray(E)))
      )
        return (
          (b = Ym(b)),
          F.forEach(function (B, j) {
            !(O.isUndefined(B) || B === null) &&
              n.append(
                f === !0 ? op([b], j, c) : f === null ? b : b + "[]",
                g(B),
              )
          }),
          !1
        )
    }
    return Xu(E) ? !0 : (n.append(op(w, b, c), g(E)), !1)
  }
  const S = [],
    A = Object.assign(n1, {
      defaultVisitor: y,
      convertValue: g,
      isVisitable: Xu,
    })
  function L(E, b) {
    if (!O.isUndefined(E)) {
      if (S.indexOf(E) !== -1)
        throw Error("Circular reference detected in " + b.join("."))
      ;(S.push(E),
        O.forEach(E, function (F, Q) {
          ;(!(O.isUndefined(F) || F === null) &&
            a.call(n, F, O.isString(Q) ? Q.trim() : Q, b, A)) === !0 &&
            L(F, b ? b.concat(Q) : [Q])
        }),
        S.pop())
    }
  }
  if (!O.isObject(r)) throw new TypeError("data must be an object")
  return (L(r), n)
}
function lp(r) {
  const n = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  }
  return encodeURIComponent(r).replace(/[!'()~]|%20|%00/g, function (o) {
    return n[o]
  })
}
function vc(r, n) {
  ;((this._pairs = []), r && wl(r, this, n))
}
const Jm = vc.prototype
Jm.append = function (n, s) {
  this._pairs.push([n, s])
}
Jm.toString = function (n) {
  const s = n
    ? function (o) {
        return n.call(this, o, lp)
      }
    : lp
  return this._pairs
    .map(function (a) {
      return s(a[0]) + "=" + s(a[1])
    }, "")
    .join("&")
}
function r1(r) {
  return encodeURIComponent(r)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
}
function Xm(r, n, s) {
  if (!n) return r
  const o = (s && s.encode) || r1,
    a = O.isFunction(s) ? { serialize: s } : s,
    c = a && a.serialize
  let f
  if (
    (c
      ? (f = c(n, a))
      : (f = O.isURLSearchParams(n) ? n.toString() : new vc(n, a).toString(o)),
    f)
  ) {
    const h = r.indexOf("#")
    ;(h !== -1 && (r = r.slice(0, h)),
      (r += (r.indexOf("?") === -1 ? "?" : "&") + f))
  }
  return r
}
class ap {
  constructor() {
    this.handlers = []
  }
  use(n, s, o) {
    return (
      this.handlers.push({
        fulfilled: n,
        rejected: s,
        synchronous: o ? o.synchronous : !1,
        runWhen: o ? o.runWhen : null,
      }),
      this.handlers.length - 1
    )
  }
  eject(n) {
    this.handlers[n] && (this.handlers[n] = null)
  }
  clear() {
    this.handlers && (this.handlers = [])
  }
  forEach(n) {
    O.forEach(this.handlers, function (o) {
      o !== null && n(o)
    })
  }
}
const wc = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
    legacyInterceptorReqResOrdering: !0,
  },
  s1 = typeof URLSearchParams < "u" ? URLSearchParams : vc,
  i1 = typeof FormData < "u" ? FormData : null,
  o1 = typeof Blob < "u" ? Blob : null,
  l1 = {
    isBrowser: !0,
    classes: { URLSearchParams: s1, FormData: i1, Blob: o1 },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  xc = typeof window < "u" && typeof document < "u",
  Zu = (typeof navigator == "object" && navigator) || void 0,
  a1 =
    xc &&
    (!Zu || ["ReactNative", "NativeScript", "NS"].indexOf(Zu.product) < 0),
  u1 =
    typeof WorkerGlobalScope < "u" &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == "function",
  c1 = (xc && window.location.href) || "http://localhost",
  d1 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: xc,
        hasStandardBrowserEnv: a1,
        hasStandardBrowserWebWorkerEnv: u1,
        navigator: Zu,
        origin: c1,
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  ),
  ft = { ...d1, ...l1 }
function f1(r, n) {
  return wl(r, new ft.classes.URLSearchParams(), {
    visitor: function (s, o, a, c) {
      return ft.isNode && O.isBuffer(s)
        ? (this.append(o, s.toString("base64")), !1)
        : c.defaultVisitor.apply(this, arguments)
    },
    ...n,
  })
}
function h1(r) {
  return O.matchAll(/\w+|\[(\w*)]/g, r).map((n) =>
    n[0] === "[]" ? "" : n[1] || n[0],
  )
}
function p1(r) {
  const n = {},
    s = Object.keys(r)
  let o
  const a = s.length
  let c
  for (o = 0; o < a; o++) ((c = s[o]), (n[c] = r[c]))
  return n
}
function Zm(r) {
  function n(s, o, a, c) {
    let f = s[c++]
    if (f === "__proto__") return !0
    const h = Number.isFinite(+f),
      m = c >= s.length
    return (
      (f = !f && O.isArray(a) ? a.length : f),
      m
        ? (O.hasOwnProp(a, f) ? (a[f] = [a[f], o]) : (a[f] = o), !h)
        : ((!a[f] || !O.isObject(a[f])) && (a[f] = []),
          n(s, o, a[f], c) && O.isArray(a[f]) && (a[f] = p1(a[f])),
          !h)
    )
  }
  if (O.isFormData(r) && O.isFunction(r.entries)) {
    const s = {}
    return (
      O.forEachEntry(r, (o, a) => {
        n(h1(o), a, s, 0)
      }),
      s
    )
  }
  return null
}
function m1(r, n, s) {
  if (O.isString(r))
    try {
      return ((n || JSON.parse)(r), O.trim(r))
    } catch (o) {
      if (o.name !== "SyntaxError") throw o
    }
  return (s || JSON.stringify)(r)
}
const Li = {
  transitional: wc,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function (n, s) {
      const o = s.getContentType() || "",
        a = o.indexOf("application/json") > -1,
        c = O.isObject(n)
      if ((c && O.isHTMLForm(n) && (n = new FormData(n)), O.isFormData(n)))
        return a ? JSON.stringify(Zm(n)) : n
      if (
        O.isArrayBuffer(n) ||
        O.isBuffer(n) ||
        O.isStream(n) ||
        O.isFile(n) ||
        O.isBlob(n) ||
        O.isReadableStream(n)
      )
        return n
      if (O.isArrayBufferView(n)) return n.buffer
      if (O.isURLSearchParams(n))
        return (
          s.setContentType(
            "application/x-www-form-urlencoded;charset=utf-8",
            !1,
          ),
          n.toString()
        )
      let h
      if (c) {
        if (o.indexOf("application/x-www-form-urlencoded") > -1)
          return f1(n, this.formSerializer).toString()
        if ((h = O.isFileList(n)) || o.indexOf("multipart/form-data") > -1) {
          const m = this.env && this.env.FormData
          return wl(h ? { "files[]": n } : n, m && new m(), this.formSerializer)
        }
      }
      return c || a ? (s.setContentType("application/json", !1), m1(n)) : n
    },
  ],
  transformResponse: [
    function (n) {
      const s = this.transitional || Li.transitional,
        o = s && s.forcedJSONParsing,
        a = this.responseType === "json"
      if (O.isResponse(n) || O.isReadableStream(n)) return n
      if (n && O.isString(n) && ((o && !this.responseType) || a)) {
        const f = !(s && s.silentJSONParsing) && a
        try {
          return JSON.parse(n, this.parseReviver)
        } catch (h) {
          if (f)
            throw h.name === "SyntaxError"
              ? fe.from(h, fe.ERR_BAD_RESPONSE, this, null, this.response)
              : h
        }
      }
      return n
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: ft.classes.FormData, Blob: ft.classes.Blob },
  validateStatus: function (n) {
    return n >= 200 && n < 300
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
}
O.forEach(["delete", "get", "head", "post", "put", "patch"], (r) => {
  Li.headers[r] = {}
})
const g1 = O.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]),
  y1 = (r) => {
    const n = {}
    let s, o, a
    return (
      r &&
        r
          .split(
            `
`,
          )
          .forEach(function (f) {
            ;((a = f.indexOf(":")),
              (s = f.substring(0, a).trim().toLowerCase()),
              (o = f.substring(a + 1).trim()),
              !(!s || (n[s] && g1[s])) &&
                (s === "set-cookie"
                  ? n[s]
                    ? n[s].push(o)
                    : (n[s] = [o])
                  : (n[s] = n[s] ? n[s] + ", " + o : o)))
          }),
      n
    )
  },
  up = Symbol("internals")
function ci(r) {
  return r && String(r).trim().toLowerCase()
}
function tl(r) {
  return r === !1 || r == null ? r : O.isArray(r) ? r.map(tl) : String(r)
}
function v1(r) {
  const n = Object.create(null),
    s = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g
  let o
  for (; (o = s.exec(r)); ) n[o[1]] = o[2]
  return n
}
const w1 = (r) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(r.trim())
function _u(r, n, s, o, a) {
  if (O.isFunction(o)) return o.call(this, n, s)
  if ((a && (n = s), !!O.isString(n))) {
    if (O.isString(o)) return n.indexOf(o) !== -1
    if (O.isRegExp(o)) return o.test(n)
  }
}
function x1(r) {
  return r
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (n, s, o) => s.toUpperCase() + o)
}
function S1(r, n) {
  const s = O.toCamelCase(" " + n)
  ;["get", "set", "has"].forEach((o) => {
    Object.defineProperty(r, o + s, {
      value: function (a, c, f) {
        return this[o].call(this, n, a, c, f)
      },
      configurable: !0,
    })
  })
}
let bt = class {
  constructor(n) {
    n && this.set(n)
  }
  set(n, s, o) {
    const a = this
    function c(h, m, g) {
      const y = ci(m)
      if (!y) throw new Error("header name must be a non-empty string")
      const S = O.findKey(a, y)
      ;(!S || a[S] === void 0 || g === !0 || (g === void 0 && a[S] !== !1)) &&
        (a[S || m] = tl(h))
    }
    const f = (h, m) => O.forEach(h, (g, y) => c(g, y, m))
    if (O.isPlainObject(n) || n instanceof this.constructor) f(n, s)
    else if (O.isString(n) && (n = n.trim()) && !w1(n)) f(y1(n), s)
    else if (O.isObject(n) && O.isIterable(n)) {
      let h = {},
        m,
        g
      for (const y of n) {
        if (!O.isArray(y))
          throw TypeError("Object iterator must return a key-value pair")
        h[(g = y[0])] = (m = h[g])
          ? O.isArray(m)
            ? [...m, y[1]]
            : [m, y[1]]
          : y[1]
      }
      f(h, s)
    } else n != null && c(s, n, o)
    return this
  }
  get(n, s) {
    if (((n = ci(n)), n)) {
      const o = O.findKey(this, n)
      if (o) {
        const a = this[o]
        if (!s) return a
        if (s === !0) return v1(a)
        if (O.isFunction(s)) return s.call(this, a, o)
        if (O.isRegExp(s)) return s.exec(a)
        throw new TypeError("parser must be boolean|regexp|function")
      }
    }
  }
  has(n, s) {
    if (((n = ci(n)), n)) {
      const o = O.findKey(this, n)
      return !!(o && this[o] !== void 0 && (!s || _u(this, this[o], o, s)))
    }
    return !1
  }
  delete(n, s) {
    const o = this
    let a = !1
    function c(f) {
      if (((f = ci(f)), f)) {
        const h = O.findKey(o, f)
        h && (!s || _u(o, o[h], h, s)) && (delete o[h], (a = !0))
      }
    }
    return (O.isArray(n) ? n.forEach(c) : c(n), a)
  }
  clear(n) {
    const s = Object.keys(this)
    let o = s.length,
      a = !1
    for (; o--; ) {
      const c = s[o]
      ;(!n || _u(this, this[c], c, n, !0)) && (delete this[c], (a = !0))
    }
    return a
  }
  normalize(n) {
    const s = this,
      o = {}
    return (
      O.forEach(this, (a, c) => {
        const f = O.findKey(o, c)
        if (f) {
          ;((s[f] = tl(a)), delete s[c])
          return
        }
        const h = n ? x1(c) : String(c).trim()
        ;(h !== c && delete s[c], (s[h] = tl(a)), (o[h] = !0))
      }),
      this
    )
  }
  concat(...n) {
    return this.constructor.concat(this, ...n)
  }
  toJSON(n) {
    const s = Object.create(null)
    return (
      O.forEach(this, (o, a) => {
        o != null && o !== !1 && (s[a] = n && O.isArray(o) ? o.join(", ") : o)
      }),
      s
    )
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]()
  }
  toString() {
    return Object.entries(this.toJSON()).map(([n, s]) => n + ": " + s).join(`
`)
  }
  getSetCookie() {
    return this.get("set-cookie") || []
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders"
  }
  static from(n) {
    return n instanceof this ? n : new this(n)
  }
  static concat(n, ...s) {
    const o = new this(n)
    return (s.forEach((a) => o.set(a)), o)
  }
  static accessor(n) {
    const o = (this[up] = this[up] = { accessors: {} }).accessors,
      a = this.prototype
    function c(f) {
      const h = ci(f)
      o[h] || (S1(a, f), (o[h] = !0))
    }
    return (O.isArray(n) ? n.forEach(c) : c(n), this)
  }
}
bt.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
])
O.reduceDescriptors(bt.prototype, ({ value: r }, n) => {
  let s = n[0].toUpperCase() + n.slice(1)
  return {
    get: () => r,
    set(o) {
      this[s] = o
    },
  }
})
O.freezeMethods(bt)
function bu(r, n) {
  const s = this || Li,
    o = n || s,
    a = bt.from(o.headers)
  let c = o.data
  return (
    O.forEach(r, function (h) {
      c = h.call(s, c, a.normalize(), n ? n.status : void 0)
    }),
    a.normalize(),
    c
  )
}
function eg(r) {
  return !!(r && r.__CANCEL__)
}
let ji = class extends fe {
  constructor(n, s, o) {
    ;(super(n ?? "canceled", fe.ERR_CANCELED, s, o),
      (this.name = "CanceledError"),
      (this.__CANCEL__ = !0))
  }
}
function tg(r, n, s) {
  const o = s.config.validateStatus
  !s.status || !o || o(s.status)
    ? r(s)
    : n(
        new fe(
          "Request failed with status code " + s.status,
          [fe.ERR_BAD_REQUEST, fe.ERR_BAD_RESPONSE][
            Math.floor(s.status / 100) - 4
          ],
          s.config,
          s.request,
          s,
        ),
      )
}
function k1(r) {
  const n = /^([-+\w]{1,25})(:?\/\/|:)/.exec(r)
  return (n && n[1]) || ""
}
function E1(r, n) {
  r = r || 10
  const s = new Array(r),
    o = new Array(r)
  let a = 0,
    c = 0,
    f
  return (
    (n = n !== void 0 ? n : 1e3),
    function (m) {
      const g = Date.now(),
        y = o[c]
      ;(f || (f = g), (s[a] = m), (o[a] = g))
      let S = c,
        A = 0
      for (; S !== a; ) ((A += s[S++]), (S = S % r))
      if (((a = (a + 1) % r), a === c && (c = (c + 1) % r), g - f < n)) return
      const L = y && g - y
      return L ? Math.round((A * 1e3) / L) : void 0
    }
  )
}
function _1(r, n) {
  let s = 0,
    o = 1e3 / n,
    a,
    c
  const f = (g, y = Date.now()) => {
    ;((s = y), (a = null), c && (clearTimeout(c), (c = null)), r(...g))
  }
  return [
    (...g) => {
      const y = Date.now(),
        S = y - s
      S >= o
        ? f(g, y)
        : ((a = g),
          c ||
            (c = setTimeout(() => {
              ;((c = null), f(a))
            }, o - S)))
    },
    () => a && f(a),
  ]
}
const dl = (r, n, s = 3) => {
    let o = 0
    const a = E1(50, 250)
    return _1((c) => {
      const f = c.loaded,
        h = c.lengthComputable ? c.total : void 0,
        m = f - o,
        g = a(m),
        y = f <= h
      o = f
      const S = {
        loaded: f,
        total: h,
        progress: h ? f / h : void 0,
        bytes: m,
        rate: g || void 0,
        estimated: g && h && y ? (h - f) / g : void 0,
        event: c,
        lengthComputable: h != null,
        [n ? "download" : "upload"]: !0,
      }
      r(S)
    }, s)
  },
  cp = (r, n) => {
    const s = r != null
    return [(o) => n[0]({ lengthComputable: s, total: r, loaded: o }), n[1]]
  },
  dp =
    (r) =>
    (...n) =>
      O.asap(() => r(...n)),
  b1 = ft.hasStandardBrowserEnv
    ? ((r, n) => (s) => (
        (s = new URL(s, ft.origin)),
        r.protocol === s.protocol &&
          r.host === s.host &&
          (n || r.port === s.port)
      ))(
        new URL(ft.origin),
        ft.navigator && /(msie|trident)/i.test(ft.navigator.userAgent),
      )
    : () => !0,
  C1 = ft.hasStandardBrowserEnv
    ? {
        write(r, n, s, o, a, c, f) {
          if (typeof document > "u") return
          const h = [`${r}=${encodeURIComponent(n)}`]
          ;(O.isNumber(s) && h.push(`expires=${new Date(s).toUTCString()}`),
            O.isString(o) && h.push(`path=${o}`),
            O.isString(a) && h.push(`domain=${a}`),
            c === !0 && h.push("secure"),
            O.isString(f) && h.push(`SameSite=${f}`),
            (document.cookie = h.join("; ")))
        },
        read(r) {
          if (typeof document > "u") return null
          const n = document.cookie.match(
            new RegExp("(?:^|; )" + r + "=([^;]*)"),
          )
          return n ? decodeURIComponent(n[1]) : null
        },
        remove(r) {
          this.write(r, "", Date.now() - 864e5, "/")
        },
      }
    : {
        write() {},
        read() {
          return null
        },
        remove() {},
      }
function R1(r) {
  return typeof r != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(r)
}
function T1(r, n) {
  return n ? r.replace(/\/?\/$/, "") + "/" + n.replace(/^\/+/, "") : r
}
function ng(r, n, s) {
  let o = !R1(n)
  return r && (o || s == !1) ? T1(r, n) : n
}
const fp = (r) => (r instanceof bt ? { ...r } : r)
function Lr(r, n) {
  n = n || {}
  const s = {}
  function o(g, y, S, A) {
    return O.isPlainObject(g) && O.isPlainObject(y)
      ? O.merge.call({ caseless: A }, g, y)
      : O.isPlainObject(y)
        ? O.merge({}, y)
        : O.isArray(y)
          ? y.slice()
          : y
  }
  function a(g, y, S, A) {
    if (O.isUndefined(y)) {
      if (!O.isUndefined(g)) return o(void 0, g, S, A)
    } else return o(g, y, S, A)
  }
  function c(g, y) {
    if (!O.isUndefined(y)) return o(void 0, y)
  }
  function f(g, y) {
    if (O.isUndefined(y)) {
      if (!O.isUndefined(g)) return o(void 0, g)
    } else return o(void 0, y)
  }
  function h(g, y, S) {
    if (S in n) return o(g, y)
    if (S in r) return o(void 0, g)
  }
  const m = {
    url: c,
    method: c,
    data: c,
    baseURL: f,
    transformRequest: f,
    transformResponse: f,
    paramsSerializer: f,
    timeout: f,
    timeoutMessage: f,
    withCredentials: f,
    withXSRFToken: f,
    adapter: f,
    responseType: f,
    xsrfCookieName: f,
    xsrfHeaderName: f,
    onUploadProgress: f,
    onDownloadProgress: f,
    decompress: f,
    maxContentLength: f,
    maxBodyLength: f,
    beforeRedirect: f,
    transport: f,
    httpAgent: f,
    httpsAgent: f,
    cancelToken: f,
    socketPath: f,
    responseEncoding: f,
    validateStatus: h,
    headers: (g, y, S) => a(fp(g), fp(y), S, !0),
  }
  return (
    O.forEach(Object.keys({ ...r, ...n }), function (y) {
      if (y === "__proto__" || y === "constructor" || y === "prototype") return
      const S = O.hasOwnProp(m, y) ? m[y] : a,
        A = S(r[y], n[y], y)
      ;(O.isUndefined(A) && S !== h) || (s[y] = A)
    }),
    s
  )
}
const rg = (r) => {
    const n = Lr({}, r)
    let {
      data: s,
      withXSRFToken: o,
      xsrfHeaderName: a,
      xsrfCookieName: c,
      headers: f,
      auth: h,
    } = n
    if (
      ((n.headers = f = bt.from(f)),
      (n.url = Xm(
        ng(n.baseURL, n.url, n.allowAbsoluteUrls),
        r.params,
        r.paramsSerializer,
      )),
      h &&
        f.set(
          "Authorization",
          "Basic " +
            btoa(
              (h.username || "") +
                ":" +
                (h.password ? unescape(encodeURIComponent(h.password)) : ""),
            ),
        ),
      O.isFormData(s))
    ) {
      if (ft.hasStandardBrowserEnv || ft.hasStandardBrowserWebWorkerEnv)
        f.setContentType(void 0)
      else if (O.isFunction(s.getHeaders)) {
        const m = s.getHeaders(),
          g = ["content-type", "content-length"]
        Object.entries(m).forEach(([y, S]) => {
          g.includes(y.toLowerCase()) && f.set(y, S)
        })
      }
    }
    if (
      ft.hasStandardBrowserEnv &&
      (o && O.isFunction(o) && (o = o(n)), o || (o !== !1 && b1(n.url)))
    ) {
      const m = a && c && C1.read(c)
      m && f.set(a, m)
    }
    return n
  },
  P1 = typeof XMLHttpRequest < "u",
  N1 =
    P1 &&
    function (r) {
      return new Promise(function (s, o) {
        const a = rg(r)
        let c = a.data
        const f = bt.from(a.headers).normalize()
        let { responseType: h, onUploadProgress: m, onDownloadProgress: g } = a,
          y,
          S,
          A,
          L,
          E
        function b() {
          ;(L && L(),
            E && E(),
            a.cancelToken && a.cancelToken.unsubscribe(y),
            a.signal && a.signal.removeEventListener("abort", y))
        }
        let w = new XMLHttpRequest()
        ;(w.open(a.method.toUpperCase(), a.url, !0), (w.timeout = a.timeout))
        function F() {
          if (!w) return
          const B = bt.from(
              "getAllResponseHeaders" in w && w.getAllResponseHeaders(),
            ),
            K = {
              data:
                !h || h === "text" || h === "json"
                  ? w.responseText
                  : w.response,
              status: w.status,
              statusText: w.statusText,
              headers: B,
              config: r,
              request: w,
            }
          ;(tg(
            function (se) {
              ;(s(se), b())
            },
            function (se) {
              ;(o(se), b())
            },
            K,
          ),
            (w = null))
        }
        ;("onloadend" in w
          ? (w.onloadend = F)
          : (w.onreadystatechange = function () {
              !w ||
                w.readyState !== 4 ||
                (w.status === 0 &&
                  !(w.responseURL && w.responseURL.indexOf("file:") === 0)) ||
                setTimeout(F)
            }),
          (w.onabort = function () {
            w &&
              (o(new fe("Request aborted", fe.ECONNABORTED, r, w)), (w = null))
          }),
          (w.onerror = function (j) {
            const K = j && j.message ? j.message : "Network Error",
              ne = new fe(K, fe.ERR_NETWORK, r, w)
            ;((ne.event = j || null), o(ne), (w = null))
          }),
          (w.ontimeout = function () {
            let j = a.timeout
              ? "timeout of " + a.timeout + "ms exceeded"
              : "timeout exceeded"
            const K = a.transitional || wc
            ;(a.timeoutErrorMessage && (j = a.timeoutErrorMessage),
              o(
                new fe(
                  j,
                  K.clarifyTimeoutError ? fe.ETIMEDOUT : fe.ECONNABORTED,
                  r,
                  w,
                ),
              ),
              (w = null))
          }),
          c === void 0 && f.setContentType(null),
          "setRequestHeader" in w &&
            O.forEach(f.toJSON(), function (j, K) {
              w.setRequestHeader(K, j)
            }),
          O.isUndefined(a.withCredentials) ||
            (w.withCredentials = !!a.withCredentials),
          h && h !== "json" && (w.responseType = a.responseType),
          g && (([A, E] = dl(g, !0)), w.addEventListener("progress", A)),
          m &&
            w.upload &&
            (([S, L] = dl(m)),
            w.upload.addEventListener("progress", S),
            w.upload.addEventListener("loadend", L)),
          (a.cancelToken || a.signal) &&
            ((y = (B) => {
              w &&
                (o(!B || B.type ? new ji(null, r, w) : B),
                w.abort(),
                (w = null))
            }),
            a.cancelToken && a.cancelToken.subscribe(y),
            a.signal &&
              (a.signal.aborted ? y() : a.signal.addEventListener("abort", y))))
        const Q = k1(a.url)
        if (Q && ft.protocols.indexOf(Q) === -1) {
          o(new fe("Unsupported protocol " + Q + ":", fe.ERR_BAD_REQUEST, r))
          return
        }
        w.send(c || null)
      })
    },
  O1 = (r, n) => {
    const { length: s } = (r = r ? r.filter(Boolean) : [])
    if (n || s) {
      let o = new AbortController(),
        a
      const c = function (g) {
        if (!a) {
          ;((a = !0), h())
          const y = g instanceof Error ? g : this.reason
          o.abort(
            y instanceof fe ? y : new ji(y instanceof Error ? y.message : y),
          )
        }
      }
      let f =
        n &&
        setTimeout(() => {
          ;((f = null), c(new fe(`timeout of ${n}ms exceeded`, fe.ETIMEDOUT)))
        }, n)
      const h = () => {
        r &&
          (f && clearTimeout(f),
          (f = null),
          r.forEach((g) => {
            g.unsubscribe ? g.unsubscribe(c) : g.removeEventListener("abort", c)
          }),
          (r = null))
      }
      r.forEach((g) => g.addEventListener("abort", c))
      const { signal: m } = o
      return ((m.unsubscribe = () => O.asap(h)), m)
    }
  },
  A1 = function* (r, n) {
    let s = r.byteLength
    if (s < n) {
      yield r
      return
    }
    let o = 0,
      a
    for (; o < s; ) ((a = o + n), yield r.slice(o, a), (o = a))
  },
  L1 = async function* (r, n) {
    for await (const s of j1(r)) yield* A1(s, n)
  },
  j1 = async function* (r) {
    if (r[Symbol.asyncIterator]) {
      yield* r
      return
    }
    const n = r.getReader()
    try {
      for (;;) {
        const { done: s, value: o } = await n.read()
        if (s) break
        yield o
      }
    } finally {
      await n.cancel()
    }
  },
  hp = (r, n, s, o) => {
    const a = L1(r, n)
    let c = 0,
      f,
      h = (m) => {
        f || ((f = !0), o && o(m))
      }
    return new ReadableStream(
      {
        async pull(m) {
          try {
            const { done: g, value: y } = await a.next()
            if (g) {
              ;(h(), m.close())
              return
            }
            let S = y.byteLength
            if (s) {
              let A = (c += S)
              s(A)
            }
            m.enqueue(new Uint8Array(y))
          } catch (g) {
            throw (h(g), g)
          }
        },
        cancel(m) {
          return (h(m), a.return())
        },
      },
      { highWaterMark: 2 },
    )
  },
  pp = 64 * 1024,
  { isFunction: Go } = O,
  I1 = (({ Request: r, Response: n }) => ({ Request: r, Response: n }))(
    O.global,
  ),
  { ReadableStream: mp, TextEncoder: gp } = O.global,
  yp = (r, ...n) => {
    try {
      return !!r(...n)
    } catch {
      return !1
    }
  },
  D1 = (r) => {
    r = O.merge.call({ skipUndefined: !0 }, I1, r)
    const { fetch: n, Request: s, Response: o } = r,
      a = n ? Go(n) : typeof fetch == "function",
      c = Go(s),
      f = Go(o)
    if (!a) return !1
    const h = a && Go(mp),
      m =
        a &&
        (typeof gp == "function"
          ? (
              (E) => (b) =>
                E.encode(b)
            )(new gp())
          : async (E) => new Uint8Array(await new s(E).arrayBuffer())),
      g =
        c &&
        h &&
        yp(() => {
          let E = !1
          const b = new s(ft.origin, {
            body: new mp(),
            method: "POST",
            get duplex() {
              return ((E = !0), "half")
            },
          }).headers.has("Content-Type")
          return E && !b
        }),
      y = f && h && yp(() => O.isReadableStream(new o("").body)),
      S = { stream: y && ((E) => E.body) }
    a &&
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((E) => {
        !S[E] &&
          (S[E] = (b, w) => {
            let F = b && b[E]
            if (F) return F.call(b)
            throw new fe(
              `Response type '${E}' is not supported`,
              fe.ERR_NOT_SUPPORT,
              w,
            )
          })
      })
    const A = async (E) => {
        if (E == null) return 0
        if (O.isBlob(E)) return E.size
        if (O.isSpecCompliantForm(E))
          return (
            await new s(ft.origin, { method: "POST", body: E }).arrayBuffer()
          ).byteLength
        if (O.isArrayBufferView(E) || O.isArrayBuffer(E)) return E.byteLength
        if ((O.isURLSearchParams(E) && (E = E + ""), O.isString(E)))
          return (await m(E)).byteLength
      },
      L = async (E, b) => {
        const w = O.toFiniteNumber(E.getContentLength())
        return w ?? A(b)
      }
    return async (E) => {
      let {
          url: b,
          method: w,
          data: F,
          signal: Q,
          cancelToken: B,
          timeout: j,
          onDownloadProgress: K,
          onUploadProgress: ne,
          responseType: se,
          headers: z,
          withCredentials: ce = "same-origin",
          fetchOptions: le,
        } = rg(E),
        Oe = n || fetch
      se = se ? (se + "").toLowerCase() : "text"
      let je = O1([Q, B && B.toAbortSignal()], j),
        Ie = null
      const Ne =
        je &&
        je.unsubscribe &&
        (() => {
          je.unsubscribe()
        })
      let De
      try {
        if (
          ne &&
          g &&
          w !== "get" &&
          w !== "head" &&
          (De = await L(z, F)) !== 0
        ) {
          let C = new s(b, { method: "POST", body: F, duplex: "half" }),
            D
          if (
            (O.isFormData(F) &&
              (D = C.headers.get("content-type")) &&
              z.setContentType(D),
            C.body)
          ) {
            const [pe, me] = cp(De, dl(dp(ne)))
            F = hp(C.body, pp, pe, me)
          }
        }
        O.isString(ce) || (ce = ce ? "include" : "omit")
        const ye = c && "credentials" in s.prototype,
          Ee = {
            ...le,
            signal: je,
            method: w.toUpperCase(),
            headers: z.normalize().toJSON(),
            body: F,
            duplex: "half",
            credentials: ye ? ce : void 0,
          }
        Ie = c && new s(b, Ee)
        let H = await (c ? Oe(Ie, le) : Oe(b, Ee))
        const re = y && (se === "stream" || se === "response")
        if (y && (K || (re && Ne))) {
          const C = {}
          ;["status", "statusText", "headers"].forEach((ae) => {
            C[ae] = H[ae]
          })
          const D = O.toFiniteNumber(H.headers.get("content-length")),
            [pe, me] = (K && cp(D, dl(dp(K), !0))) || []
          H = new o(
            hp(H.body, pp, pe, () => {
              ;(me && me(), Ne && Ne())
            }),
            C,
          )
        }
        se = se || "text"
        let I = await S[O.findKey(S, se) || "text"](H, E)
        return (
          !re && Ne && Ne(),
          await new Promise((C, D) => {
            tg(C, D, {
              data: I,
              headers: bt.from(H.headers),
              status: H.status,
              statusText: H.statusText,
              config: E,
              request: Ie,
            })
          })
        )
      } catch (ye) {
        throw (
          Ne && Ne(),
          ye && ye.name === "TypeError" && /Load failed|fetch/i.test(ye.message)
            ? Object.assign(
                new fe(
                  "Network Error",
                  fe.ERR_NETWORK,
                  E,
                  Ie,
                  ye && ye.response,
                ),
                { cause: ye.cause || ye },
              )
            : fe.from(ye, ye && ye.code, E, Ie, ye && ye.response)
        )
      }
    }
  },
  F1 = new Map(),
  sg = (r) => {
    let n = (r && r.env) || {}
    const { fetch: s, Request: o, Response: a } = n,
      c = [o, a, s]
    let f = c.length,
      h = f,
      m,
      g,
      y = F1
    for (; h--; )
      ((m = c[h]),
        (g = y.get(m)),
        g === void 0 && y.set(m, (g = h ? new Map() : D1(n))),
        (y = g))
    return g
  }
sg()
const Sc = { http: e1, xhr: N1, fetch: { get: sg } }
O.forEach(Sc, (r, n) => {
  if (r) {
    try {
      Object.defineProperty(r, "name", { value: n })
    } catch {}
    Object.defineProperty(r, "adapterName", { value: n })
  }
})
const vp = (r) => `- ${r}`,
  U1 = (r) => O.isFunction(r) || r === null || r === !1
function M1(r, n) {
  r = O.isArray(r) ? r : [r]
  const { length: s } = r
  let o, a
  const c = {}
  for (let f = 0; f < s; f++) {
    o = r[f]
    let h
    if (
      ((a = o),
      !U1(o) && ((a = Sc[(h = String(o)).toLowerCase()]), a === void 0))
    )
      throw new fe(`Unknown adapter '${h}'`)
    if (a && (O.isFunction(a) || (a = a.get(n)))) break
    c[h || "#" + f] = a
  }
  if (!a) {
    const f = Object.entries(c).map(
      ([m, g]) =>
        `adapter ${m} ` +
        (g === !1
          ? "is not supported by the environment"
          : "is not available in the build"),
    )
    let h = s
      ? f.length > 1
        ? `since :
` +
          f.map(vp).join(`
`)
        : " " + vp(f[0])
      : "as no adapter specified"
    throw new fe(
      "There is no suitable adapter to dispatch the request " + h,
      "ERR_NOT_SUPPORT",
    )
  }
  return a
}
const ig = { getAdapter: M1, adapters: Sc }
function Cu(r) {
  if (
    (r.cancelToken && r.cancelToken.throwIfRequested(),
    r.signal && r.signal.aborted)
  )
    throw new ji(null, r)
}
function wp(r) {
  return (
    Cu(r),
    (r.headers = bt.from(r.headers)),
    (r.data = bu.call(r, r.transformRequest)),
    ["post", "put", "patch"].indexOf(r.method) !== -1 &&
      r.headers.setContentType("application/x-www-form-urlencoded", !1),
    ig
      .getAdapter(
        r.adapter || Li.adapter,
        r,
      )(r)
      .then(
        function (o) {
          return (
            Cu(r),
            (o.data = bu.call(r, r.transformResponse, o)),
            (o.headers = bt.from(o.headers)),
            o
          )
        },
        function (o) {
          return (
            eg(o) ||
              (Cu(r),
              o &&
                o.response &&
                ((o.response.data = bu.call(
                  r,
                  r.transformResponse,
                  o.response,
                )),
                (o.response.headers = bt.from(o.response.headers)))),
            Promise.reject(o)
          )
        },
      )
  )
}
const og = "1.13.5",
  xl = {}
;["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (r, n) => {
    xl[r] = function (o) {
      return typeof o === r || "a" + (n < 1 ? "n " : " ") + r
    }
  },
)
const xp = {}
xl.transitional = function (n, s, o) {
  function a(c, f) {
    return (
      "[Axios v" +
      og +
      "] Transitional option '" +
      c +
      "'" +
      f +
      (o ? ". " + o : "")
    )
  }
  return (c, f, h) => {
    if (n === !1)
      throw new fe(
        a(f, " has been removed" + (s ? " in " + s : "")),
        fe.ERR_DEPRECATED,
      )
    return (
      s &&
        !xp[f] &&
        ((xp[f] = !0),
        console.warn(
          a(
            f,
            " has been deprecated since v" +
              s +
              " and will be removed in the near future",
          ),
        )),
      n ? n(c, f, h) : !0
    )
  }
}
xl.spelling = function (n) {
  return (s, o) => (console.warn(`${o} is likely a misspelling of ${n}`), !0)
}
function z1(r, n, s) {
  if (typeof r != "object")
    throw new fe("options must be an object", fe.ERR_BAD_OPTION_VALUE)
  const o = Object.keys(r)
  let a = o.length
  for (; a-- > 0; ) {
    const c = o[a],
      f = n[c]
    if (f) {
      const h = r[c],
        m = h === void 0 || f(h, c, r)
      if (m !== !0)
        throw new fe("option " + c + " must be " + m, fe.ERR_BAD_OPTION_VALUE)
      continue
    }
    if (s !== !0) throw new fe("Unknown option " + c, fe.ERR_BAD_OPTION)
  }
}
const nl = { assertOptions: z1, validators: xl },
  Ft = nl.validators
let Or = class {
  constructor(n) {
    ;((this.defaults = n || {}),
      (this.interceptors = { request: new ap(), response: new ap() }))
  }
  async request(n, s) {
    try {
      return await this._request(n, s)
    } catch (o) {
      if (o instanceof Error) {
        let a = {}
        Error.captureStackTrace ? Error.captureStackTrace(a) : (a = new Error())
        const c = a.stack ? a.stack.replace(/^.+\n/, "") : ""
        try {
          o.stack
            ? c &&
              !String(o.stack).endsWith(c.replace(/^.+\n.+\n/, "")) &&
              (o.stack +=
                `
` + c)
            : (o.stack = c)
        } catch {}
      }
      throw o
    }
  }
  _request(n, s) {
    ;(typeof n == "string" ? ((s = s || {}), (s.url = n)) : (s = n || {}),
      (s = Lr(this.defaults, s)))
    const { transitional: o, paramsSerializer: a, headers: c } = s
    ;(o !== void 0 &&
      nl.assertOptions(
        o,
        {
          silentJSONParsing: Ft.transitional(Ft.boolean),
          forcedJSONParsing: Ft.transitional(Ft.boolean),
          clarifyTimeoutError: Ft.transitional(Ft.boolean),
          legacyInterceptorReqResOrdering: Ft.transitional(Ft.boolean),
        },
        !1,
      ),
      a != null &&
        (O.isFunction(a)
          ? (s.paramsSerializer = { serialize: a })
          : nl.assertOptions(
              a,
              { encode: Ft.function, serialize: Ft.function },
              !0,
            )),
      s.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (s.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (s.allowAbsoluteUrls = !0)),
      nl.assertOptions(
        s,
        {
          baseUrl: Ft.spelling("baseURL"),
          withXsrfToken: Ft.spelling("withXSRFToken"),
        },
        !0,
      ),
      (s.method = (s.method || this.defaults.method || "get").toLowerCase()))
    let f = c && O.merge(c.common, c[s.method])
    ;(c &&
      O.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (E) => {
          delete c[E]
        },
      ),
      (s.headers = bt.concat(f, c)))
    const h = []
    let m = !0
    this.interceptors.request.forEach(function (b) {
      if (typeof b.runWhen == "function" && b.runWhen(s) === !1) return
      m = m && b.synchronous
      const w = s.transitional || wc
      w && w.legacyInterceptorReqResOrdering
        ? h.unshift(b.fulfilled, b.rejected)
        : h.push(b.fulfilled, b.rejected)
    })
    const g = []
    this.interceptors.response.forEach(function (b) {
      g.push(b.fulfilled, b.rejected)
    })
    let y,
      S = 0,
      A
    if (!m) {
      const E = [wp.bind(this), void 0]
      for (
        E.unshift(...h), E.push(...g), A = E.length, y = Promise.resolve(s);
        S < A;
      )
        y = y.then(E[S++], E[S++])
      return y
    }
    A = h.length
    let L = s
    for (; S < A; ) {
      const E = h[S++],
        b = h[S++]
      try {
        L = E(L)
      } catch (w) {
        b.call(this, w)
        break
      }
    }
    try {
      y = wp.call(this, L)
    } catch (E) {
      return Promise.reject(E)
    }
    for (S = 0, A = g.length; S < A; ) y = y.then(g[S++], g[S++])
    return y
  }
  getUri(n) {
    n = Lr(this.defaults, n)
    const s = ng(n.baseURL, n.url, n.allowAbsoluteUrls)
    return Xm(s, n.params, n.paramsSerializer)
  }
}
O.forEach(["delete", "get", "head", "options"], function (n) {
  Or.prototype[n] = function (s, o) {
    return this.request(
      Lr(o || {}, { method: n, url: s, data: (o || {}).data }),
    )
  }
})
O.forEach(["post", "put", "patch"], function (n) {
  function s(o) {
    return function (c, f, h) {
      return this.request(
        Lr(h || {}, {
          method: n,
          headers: o ? { "Content-Type": "multipart/form-data" } : {},
          url: c,
          data: f,
        }),
      )
    }
  }
  ;((Or.prototype[n] = s()), (Or.prototype[n + "Form"] = s(!0)))
})
let B1 = class lg {
  constructor(n) {
    if (typeof n != "function")
      throw new TypeError("executor must be a function.")
    let s
    this.promise = new Promise(function (c) {
      s = c
    })
    const o = this
    ;(this.promise.then((a) => {
      if (!o._listeners) return
      let c = o._listeners.length
      for (; c-- > 0; ) o._listeners[c](a)
      o._listeners = null
    }),
      (this.promise.then = (a) => {
        let c
        const f = new Promise((h) => {
          ;(o.subscribe(h), (c = h))
        }).then(a)
        return (
          (f.cancel = function () {
            o.unsubscribe(c)
          }),
          f
        )
      }),
      n(function (c, f, h) {
        o.reason || ((o.reason = new ji(c, f, h)), s(o.reason))
      }))
  }
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  subscribe(n) {
    if (this.reason) {
      n(this.reason)
      return
    }
    this._listeners ? this._listeners.push(n) : (this._listeners = [n])
  }
  unsubscribe(n) {
    if (!this._listeners) return
    const s = this._listeners.indexOf(n)
    s !== -1 && this._listeners.splice(s, 1)
  }
  toAbortSignal() {
    const n = new AbortController(),
      s = (o) => {
        n.abort(o)
      }
    return (
      this.subscribe(s),
      (n.signal.unsubscribe = () => this.unsubscribe(s)),
      n.signal
    )
  }
  static source() {
    let n
    return {
      token: new lg(function (a) {
        n = a
      }),
      cancel: n,
    }
  }
}
function $1(r) {
  return function (s) {
    return r.apply(null, s)
  }
}
function V1(r) {
  return O.isObject(r) && r.isAxiosError === !0
}
const ec = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526,
}
Object.entries(ec).forEach(([r, n]) => {
  ec[n] = r
})
function ag(r) {
  const n = new Or(r),
    s = Bm(Or.prototype.request, n)
  return (
    O.extend(s, Or.prototype, n, { allOwnKeys: !0 }),
    O.extend(s, n, null, { allOwnKeys: !0 }),
    (s.create = function (a) {
      return ag(Lr(r, a))
    }),
    s
  )
}
const Qe = ag(Li)
Qe.Axios = Or
Qe.CanceledError = ji
Qe.CancelToken = B1
Qe.isCancel = eg
Qe.VERSION = og
Qe.toFormData = wl
Qe.AxiosError = fe
Qe.Cancel = Qe.CanceledError
Qe.all = function (n) {
  return Promise.all(n)
}
Qe.spread = $1
Qe.isAxiosError = V1
Qe.mergeConfig = Lr
Qe.AxiosHeaders = bt
Qe.formToJSON = (r) => Zm(O.isHTMLForm(r) ? new FormData(r) : r)
Qe.getAdapter = ig.getAdapter
Qe.HttpStatusCode = ec
Qe.default = Qe
const {
    Axios: Hk,
    AxiosError: Qk,
    CanceledError: Wk,
    isCancel: Kk,
    CancelToken: Gk,
    VERSION: Yk,
    all: Jk,
    Cancel: Xk,
    isAxiosError: Zk,
    spread: eE,
    toFormData: tE,
    AxiosHeaders: nE,
    HttpStatusCode: rE,
    formToJSON: sE,
    getAdapter: iE,
    mergeConfig: oE,
  } = Qe,
  q1 = typeof window > "u",
  Sp = !q1 && window.self !== window.top,
  Ru = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15),
  st = []
for (let r = 0; r < 256; ++r) st.push((r + 256).toString(16).slice(1))
function H1(r, n = 0) {
  return (
    st[r[n + 0]] +
    st[r[n + 1]] +
    st[r[n + 2]] +
    st[r[n + 3]] +
    "-" +
    st[r[n + 4]] +
    st[r[n + 5]] +
    "-" +
    st[r[n + 6]] +
    st[r[n + 7]] +
    "-" +
    st[r[n + 8]] +
    st[r[n + 9]] +
    "-" +
    st[r[n + 10]] +
    st[r[n + 11]] +
    st[r[n + 12]] +
    st[r[n + 13]] +
    st[r[n + 14]] +
    st[r[n + 15]]
  ).toLowerCase()
}
let Tu
const Q1 = new Uint8Array(16)
function W1() {
  if (!Tu) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error(
        "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported",
      )
    Tu = crypto.getRandomValues.bind(crypto)
  }
  return Tu(Q1)
}
const K1 =
    typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto),
  kp = { randomUUID: K1 }
function G1(r, n, s) {
  var a
  r = r || {}
  const o = r.random ?? ((a = r.rng) == null ? void 0 : a.call(r)) ?? W1()
  if (o.length < 16) throw new Error("Random bytes length must be >= 16")
  return ((o[6] = (o[6] & 15) | 64), (o[8] = (o[8] & 63) | 128), H1(o))
}
function Y1(r, n, s) {
  return kp.randomUUID && !r ? kp.randomUUID() : G1(r)
}
class J1 extends Error {
  constructor(n, s, o, a, c) {
    ;(super(n),
      (this.name = "Base44Error"),
      (this.status = s),
      (this.code = o),
      (this.data = a),
      (this.originalError = c))
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      data: this.data,
    }
  }
}
function pi({
  baseURL: r,
  headers: n = {},
  token: s,
  interceptResponses: o = !0,
  onError: a,
}) {
  const c = Qe.create({
    baseURL: r,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...n,
    },
  })
  return (
    s && (c.defaults.headers.common.Authorization = `Bearer ${s}`),
    c.interceptors.request.use((f) => {
      typeof window < "u" && f.headers.set("X-Origin-URL", window.location.href)
      const h = Y1()
      if (((f.requestId = h), Sp))
        try {
          window.parent.postMessage(
            {
              type: "api-request-start",
              requestId: h,
              data: {
                url: r + f.url,
                method: f.method,
                body: f.data instanceof FormData ? "[FormData object]" : f.data,
              },
            },
            "*",
          )
        } catch {}
      return f
    }),
    o &&
      c.interceptors.response.use(
        (f) => {
          var h
          const m =
            (h = f.config) === null || h === void 0 ? void 0 : h.requestId
          try {
            Sp &&
              m &&
              window.parent.postMessage(
                {
                  type: "api-request-end",
                  requestId: m,
                  data: { statusCode: f.status, response: f.data },
                },
                "*",
              )
          } catch {}
          return f.data
        },
        (f) => {
          var h, m, g, y, S, A, L, E
          const b =
              ((m =
                (h = f.response) === null || h === void 0 ? void 0 : h.data) ===
                null || m === void 0
                ? void 0
                : m.message) ||
              ((y =
                (g = f.response) === null || g === void 0 ? void 0 : g.data) ===
                null || y === void 0
                ? void 0
                : y.detail) ||
              f.message,
            w = new J1(
              b,
              (S = f.response) === null || S === void 0 ? void 0 : S.status,
              (L =
                (A = f.response) === null || A === void 0 ? void 0 : A.data) ===
                null || L === void 0
                ? void 0
                : L.code,
              (E = f.response) === null || E === void 0 ? void 0 : E.data,
              f,
            )
          return (a == null || a(w), Promise.reject(w))
        },
      ),
    c
  )
}
function Ep(r) {
  const { axios: n, appId: s, getSocket: o } = r
  return new Proxy(
    {},
    {
      get(a, c) {
        if (!(typeof c != "string" || c === "then" || c.startsWith("_")))
          return Z1(n, s, c, o)
      },
    },
  )
}
function X1(r) {
  var n
  try {
    const s = JSON.parse(r)
    return {
      type: s.type,
      data: s.data,
      id: s.id || ((n = s.data) === null || n === void 0 ? void 0 : n.id),
      timestamp: s.timestamp || new Date().toISOString(),
    }
  } catch (s) {
    return (
      console.warn("[Base44 SDK] Failed to parse realtime message:", s),
      null
    )
  }
}
function Z1(r, n, s, o) {
  const a = `/apps/${n}/entities/${s}`
  return {
    async list(c, f, h, m) {
      const g = {}
      return (
        c && (g.sort = c),
        f && (g.limit = f),
        h && (g.skip = h),
        m && (g.fields = Array.isArray(m) ? m.join(",") : m),
        r.get(a, { params: g })
      )
    },
    async filter(c, f, h, m, g) {
      const y = { q: JSON.stringify(c) }
      return (
        f && (y.sort = f),
        h && (y.limit = h),
        m && (y.skip = m),
        g && (y.fields = Array.isArray(g) ? g.join(",") : g),
        r.get(a, { params: y })
      )
    },
    async get(c) {
      return r.get(`${a}/${c}`)
    },
    async create(c) {
      return r.post(a, c)
    },
    async update(c, f) {
      return r.put(`${a}/${c}`, f)
    },
    async delete(c) {
      return r.delete(`${a}/${c}`)
    },
    async deleteMany(c) {
      return r.delete(a, { data: c })
    },
    async bulkCreate(c) {
      return r.post(`${a}/bulk`, c)
    },
    async updateMany(c, f) {
      return r.patch(`${a}/update-many`, { query: c, data: f })
    },
    async bulkUpdate(c) {
      return r.put(`${a}/bulk`, c)
    },
    async importEntities(c) {
      const f = new FormData()
      return (
        f.append("file", c, c.name),
        r.post(`${a}/import`, f, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      )
    },
    subscribe(c) {
      const f = `entities:${n}:${s}`
      return o().subscribeToRoom(f, {
        update_model: (g) => {
          const y = X1(g.data)
          if (y)
            try {
              c(y)
            } catch (S) {
              console.error("[Base44 SDK] Subscription callback error:", S)
            }
        },
      })
    },
  }
}
function eS(r, n) {
  return {
    async call(s, o, a) {
      if (!(s != null && s.trim()))
        throw new Error("Integration slug is required and cannot be empty")
      if (!(o != null && o.trim()))
        throw new Error("Operation ID is required and cannot be empty")
      const { pathParams: c, queryParams: f, ...h } = a ?? {},
        m = {
          ...h,
          ...(c && { path_params: c }),
          ...(f && { query_params: f }),
        }
      return await r.post(`/apps/${n}/integrations/custom/${s}/${o}`, m)
    },
  }
}
function _p(r, n) {
  const s = eS(r, n)
  return new Proxy(
    {},
    {
      get(o, a) {
        if (!(typeof a != "string" || a === "then" || a.startsWith("_")))
          return a === "custom"
            ? s
            : new Proxy(
                {},
                {
                  get(c, f) {
                    if (
                      !(
                        typeof f != "string" ||
                        f === "then" ||
                        f.startsWith("_")
                      )
                    )
                      return async (h) => {
                        if (typeof h == "string")
                          throw new Error(
                            `Integration ${f} must receive an object with named parameters, received: ${h}`,
                          )
                        let m, g
                        return (
                          h instanceof FormData ||
                          (h && Object.values(h).some((y) => y instanceof File))
                            ? ((m = new FormData()),
                              Object.keys(h).forEach((y) => {
                                h[y] instanceof File
                                  ? m.append(y, h[y], h[y].name)
                                  : typeof h[y] == "object" && h[y] !== null
                                    ? m.append(y, JSON.stringify(h[y]))
                                    : m.append(y, h[y])
                              }),
                              (g = "multipart/form-data"))
                            : ((m = h), (g = "application/json")),
                          a === "Core"
                            ? r.post(
                                `/apps/${n}/integration-endpoints/Core/${f}`,
                                m || h,
                                { headers: { "Content-Type": g } },
                              )
                            : r.post(
                                `/apps/${n}/integration-endpoints/installable/${a}/integration-endpoints/${f}`,
                                m || h,
                                { headers: { "Content-Type": g } },
                              )
                        )
                      }
                  },
                },
              )
      },
    },
  )
}
function tS(r, n, s, o) {
  return {
    async me() {
      return r.get(`/apps/${s}/entities/User/me`)
    },
    async updateMe(a) {
      return r.put(`/apps/${s}/entities/User/me`, a)
    },
    redirectToLogin(a) {
      if (typeof window > "u")
        throw new Error(
          "Login method can only be used in a browser environment",
        )
      const c = a
          ? new URL(a, window.location.origin).toString()
          : window.location.href,
        f = `${o.appBaseUrl}/login?from_url=${encodeURIComponent(c)}`
      // window.location.href = f
    },
    loginWithProvider(a, c = "/") {
      const f = new URL(c, window.location.origin).toString(),
        h = `app_id=${s}&from_url=${encodeURIComponent(f)}`
      let m
      a === "sso"
        ? (m = `/apps/${s}/auth/sso/login`)
        : (m = `/apps/auth${a === "google" ? "" : `/${a}`}/login`)
      const g = `${o.appBaseUrl}/api${m}?${h}`
      // window.location.href = g
    },
    logout(a) {
      if (
        (delete r.defaults.headers.common.Authorization, typeof window < "u")
      ) {
        if (window.localStorage)
          try {
            ;(window.localStorage.removeItem("base44_access_token"),
              window.localStorage.removeItem("token"))
          } catch (h) {
            console.error("Failed to remove token from localStorage:", h)
          }
        const c = a || window.location.href,
          f = `${o.appBaseUrl}/api/apps/auth/logout?from_url=${encodeURIComponent(c)}`
        // window.location.href = f
      }
    },
    setToken(a, c = !0) {
      if (
        a &&
        ((r.defaults.headers.common.Authorization = `Bearer ${a}`),
        (n.defaults.headers.common.Authorization = `Bearer ${a}`),
        c && typeof window < "u" && window.localStorage)
      )
        try {
          ;(window.localStorage.setItem("base44_access_token", a),
            window.localStorage.setItem("token", a))
        } catch (f) {
          console.error("Failed to save token to localStorage:", f)
        }
    },
    async loginViaEmailPassword(a, c, f) {
      var h
      try {
        const m = await r.post(`/apps/${s}/auth/login`, {
            email: a,
            password: c,
            ...(f && { turnstile_token: f }),
          }),
          { access_token: g, user: y } = m
        return (g && this.setToken(g), { access_token: g, user: y })
      } catch (m) {
        throw (
          ((h = m.response) === null || h === void 0 ? void 0 : h.status) ===
            401 && (await this.logout()),
          m
        )
      }
    },
    async isAuthenticated() {
      try {
        return (await this.me(), !0)
      } catch {
        return !1
      }
    },
    inviteUser(a, c) {
      return r.post(`/apps/${s}/users/invite-user`, { user_email: a, role: c })
    },
    register(a) {
      return r.post(`/apps/${s}/auth/register`, a)
    },
    verifyOtp({ email: a, otpCode: c }) {
      return r.post(`/apps/${s}/auth/verify-otp`, { email: a, otp_code: c })
    },
    resendOtp(a) {
      return r.post(`/apps/${s}/auth/resend-otp`, { email: a })
    },
    resetPasswordRequest(a) {
      return r.post(`/apps/${s}/auth/reset-password-request`, { email: a })
    },
    resetPassword({ resetToken: a, newPassword: c }) {
      return r.post(`/apps/${s}/auth/reset-password`, {
        reset_token: a,
        new_password: c,
      })
    },
    changePassword({ userId: a, currentPassword: c, newPassword: f }) {
      return r.post(`/apps/${s}/auth/change-password`, {
        user_id: a,
        current_password: c,
        new_password: f,
      })
    },
  }
}
function nS(r, n, s) {
  return {
    async getAccessToken(o) {
      const a = `/apps/${n}/auth/sso/accesstoken/${o}`,
        c = {}
      return (
        s && (c["on-behalf-of"] = `Bearer ${s}`),
        r.get(a, { headers: c })
      )
    },
  }
}
function rS(r, n) {
  return {
    async getAccessToken(s) {
      if (!s || typeof s != "string")
        throw new Error("Integration type is required and must be a string")
      return (await r.get(`/apps/${n}/external-auth/tokens/${s}`)).access_token
    },
    async getConnection(s) {
      var o
      if (!s || typeof s != "string")
        throw new Error("Integration type is required and must be a string")
      const c = await r.get(`/apps/${n}/external-auth/tokens/${s}`)
      return {
        accessToken: c.access_token,
        connectionConfig:
          (o = c.connection_config) !== null && o !== void 0 ? o : null,
      }
    },
  }
}
function sS(r, n) {
  return {
    async getCurrentAppUserAccessToken(s) {
      if (!s || typeof s != "string")
        throw new Error("Connector ID is required and must be a string")
      return (await r.get(`/apps/${n}/app-user-auth/connectors/${s}/token`))
        .access_token
    },
    async connectAppUser(s) {
      if (!s || typeof s != "string")
        throw new Error("Connector ID is required and must be a string")
      return (await r.post(`/apps/${n}/app-user-auth/connectors/${s}/initiate`))
        .redirect_url
    },
    async disconnectAppUser(s) {
      if (!s || typeof s != "string")
        throw new Error("Connector ID is required and must be a string")
      await r.delete(`/apps/${n}/app-user-auth/connectors/${s}`)
    },
  }
}
function fl(r = {}) {
  const {
    storageKey: n = "base44_access_token",
    paramName: s = "access_token",
    saveToStorage: o = !0,
    removeFromUrl: a = !0,
  } = r
  let c = null
  if (typeof window < "u" && window.location)
    try {
      const f = new URLSearchParams(window.location.search)
      if (((c = f.get(s)), c)) {
        if ((o && iS(c, { storageKey: n }), a)) {
          f.delete(s)
          const h = `${window.location.pathname}${f.toString() ? `?${f.toString()}` : ""}${window.location.hash}`
          window.history.replaceState({}, document.title, h)
        }
        return c
      }
    } catch (f) {
      console.error("Error retrieving token from URL:", f)
    }
  if (typeof window < "u" && window.localStorage)
    try {
      return ((c = window.localStorage.getItem(n)), c)
    } catch (f) {
      console.error("Error retrieving token from local storage:", f)
    }
  return null
}
function iS(r, n) {
  const { storageKey: s = "base44_access_token" } = n
  if (typeof window > "u" || !window.localStorage || !r) return !1
  try {
    return (
      window.localStorage.setItem(s, r),
      window.localStorage.setItem("token", r),
      !0
    )
  } catch (o) {
    return (console.error("Error saving token to local storage:", o), !1)
  }
}
function bp(r, n, s) {
  const o = (c, f) => (c ? `${String(c).replace(/\/$/, "")}${f}` : f),
    a = (c) => {
      const f = new Headers()
      if (s != null && s.getAuthHeaders) {
        const h = s.getAuthHeaders()
        Object.entries(h).forEach(([m, g]) => {
          g != null && f.set(m, String(g))
        })
      }
      return (
        c &&
          new Headers(c).forEach((h, m) => {
            f.set(m, h)
          }),
        f
      )
    }
  return {
    async invoke(c, f) {
      if (typeof f == "string")
        throw new Error(
          `Function ${c} must receive an object with named parameters, received: ${f}`,
        )
      let h, m
      return (
        f instanceof FormData ||
        (f && Object.values(f).some((g) => g instanceof File))
          ? ((h = new FormData()),
            Object.keys(f).forEach((g) => {
              f[g] instanceof File
                ? h.append(g, f[g], f[g].name)
                : typeof f[g] == "object" && f[g] !== null
                  ? h.append(g, JSON.stringify(f[g]))
                  : h.append(g, f[g])
            }),
            (m = "multipart/form-data"))
          : ((h = f), (m = "application/json")),
        r.post(`/apps/${n}/functions/${c}`, h || f, {
          headers: { "Content-Type": m },
        })
      )
    },
    async fetch(c, f = {}) {
      const m = `/functions${c.startsWith("/") ? c : `/${c}`}`,
        g = a(f.headers),
        y = { ...f, headers: g }
      return await fetch(o(s == null ? void 0 : s.baseURL, m), y)
    },
  }
}
function Cp({ axios: r, getSocket: n, appId: s, serverUrl: o, token: a }) {
  const c = `/apps/${s}/agents`,
    f = {},
    h = () => r.get(`${c}/conversations`),
    m = (E) => r.get(`${c}/conversations/${E}`)
  return {
    getConversations: h,
    getConversation: m,
    listConversations: (E) => r.get(`${c}/conversations`, { params: E }),
    createConversation: (E) => r.post(`${c}/conversations`, E),
    addMessage: async (E, b) =>
      r.post(`${c}/conversations/v2/${E.id}/messages`, b),
    subscribeToConversation: (E, b) => {
      const w = `/agent-conversations/${E}`,
        F = n(),
        Q = m(E).then((B) => ((f[E] = B), B))
      return F.subscribeToRoom(w, {
        connect: () => {},
        update_model: async ({ data: B }) => {
          const j = JSON.parse(B)
          if (j._message) {
            await Q
            const K = j._message,
              ne = f[E]
            if (ne) {
              const se = ne.messages || [],
                z = se.findIndex((le) => le.id === K.id),
                ce =
                  z !== -1
                    ? se.map((le, Oe) => (Oe === z ? K : le))
                    : [...se, K]
              ;((f[E] = { ...ne, messages: ce }), b == null || b(f[E]))
            }
          }
        },
      })
    },
    getWhatsAppConnectURL: (E) => {
      const b = `${o}/api/apps/${s}/agents/${encodeURIComponent(E)}/whatsapp`,
        w = a ?? fl()
      return w ? `${b}?token=${w}` : b
    },
  }
}
function Rp(r, n) {
  const s = `/app-logs/${n}`
  return {
    async logUserInApp(o) {
      await r.post(`${s}/log-user-in-app/${o}`)
    },
    async fetchLogs(o = {}) {
      return await r.get(s, { params: o })
    },
    async getStats(o = {}) {
      return await r.get(`${s}/stats`, { params: o })
    },
  }
}
function oS(r, n) {
  return {
    async inviteUser(s, o) {
      if (o !== "user" && o !== "admin")
        throw new Error(
          `Invalid role: "${o}". Role must be either "user" or "admin".`,
        )
      return await r.post(`/apps/${n}/runtime/users/invite-user`, {
        user_email: s,
        role: o,
      })
    },
  }
}
const an = Object.create(null)
an.open = "0"
an.close = "1"
an.ping = "2"
an.pong = "3"
an.message = "4"
an.upgrade = "5"
an.noop = "6"
const rl = Object.create(null)
Object.keys(an).forEach((r) => {
  rl[an[r]] = r
})
const tc = { type: "error", data: "parser error" },
  ug =
    typeof Blob == "function" ||
    (typeof Blob < "u" &&
      Object.prototype.toString.call(Blob) === "[object BlobConstructor]"),
  cg = typeof ArrayBuffer == "function",
  dg = (r) =>
    typeof ArrayBuffer.isView == "function"
      ? ArrayBuffer.isView(r)
      : r && r.buffer instanceof ArrayBuffer,
  kc = ({ type: r, data: n }, s, o) =>
    ug && n instanceof Blob
      ? s
        ? o(n)
        : Tp(n, o)
      : cg && (n instanceof ArrayBuffer || dg(n))
        ? s
          ? o(n)
          : Tp(new Blob([n]), o)
        : o(an[r] + (n || "")),
  Tp = (r, n) => {
    const s = new FileReader()
    return (
      (s.onload = function () {
        const o = s.result.split(",")[1]
        n("b" + (o || ""))
      }),
      s.readAsDataURL(r)
    )
  }
function Pp(r) {
  return r instanceof Uint8Array
    ? r
    : r instanceof ArrayBuffer
      ? new Uint8Array(r)
      : new Uint8Array(r.buffer, r.byteOffset, r.byteLength)
}
let Pu
function lS(r, n) {
  if (ug && r.data instanceof Blob) return r.data.arrayBuffer().then(Pp).then(n)
  if (cg && (r.data instanceof ArrayBuffer || dg(r.data))) return n(Pp(r.data))
  kc(r, !1, (s) => {
    ;(Pu || (Pu = new TextEncoder()), n(Pu.encode(s)))
  })
}
const Np = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  mi = typeof Uint8Array > "u" ? [] : new Uint8Array(256)
for (let r = 0; r < Np.length; r++) mi[Np.charCodeAt(r)] = r
const aS = (r) => {
    let n = r.length * 0.75,
      s = r.length,
      o,
      a = 0,
      c,
      f,
      h,
      m
    r[r.length - 1] === "=" && (n--, r[r.length - 2] === "=" && n--)
    const g = new ArrayBuffer(n),
      y = new Uint8Array(g)
    for (o = 0; o < s; o += 4)
      ((c = mi[r.charCodeAt(o)]),
        (f = mi[r.charCodeAt(o + 1)]),
        (h = mi[r.charCodeAt(o + 2)]),
        (m = mi[r.charCodeAt(o + 3)]),
        (y[a++] = (c << 2) | (f >> 4)),
        (y[a++] = ((f & 15) << 4) | (h >> 2)),
        (y[a++] = ((h & 3) << 6) | (m & 63)))
    return g
  },
  uS = typeof ArrayBuffer == "function",
  Ec = (r, n) => {
    if (typeof r != "string") return { type: "message", data: fg(r, n) }
    const s = r.charAt(0)
    return s === "b"
      ? { type: "message", data: cS(r.substring(1), n) }
      : rl[s]
        ? r.length > 1
          ? { type: rl[s], data: r.substring(1) }
          : { type: rl[s] }
        : tc
  },
  cS = (r, n) => {
    if (uS) {
      const s = aS(r)
      return fg(s, n)
    } else return { base64: !0, data: r }
  },
  fg = (r, n) => {
    switch (n) {
      case "blob":
        return r instanceof Blob ? r : new Blob([r])
      case "arraybuffer":
      default:
        return r instanceof ArrayBuffer ? r : r.buffer
    }
  },
  hg = "",
  dS = (r, n) => {
    const s = r.length,
      o = new Array(s)
    let a = 0
    r.forEach((c, f) => {
      kc(c, !1, (h) => {
        ;((o[f] = h), ++a === s && n(o.join(hg)))
      })
    })
  },
  fS = (r, n) => {
    const s = r.split(hg),
      o = []
    for (let a = 0; a < s.length; a++) {
      const c = Ec(s[a], n)
      if ((o.push(c), c.type === "error")) break
    }
    return o
  }
function hS() {
  return new TransformStream({
    transform(r, n) {
      lS(r, (s) => {
        const o = s.length
        let a
        if (o < 126)
          ((a = new Uint8Array(1)), new DataView(a.buffer).setUint8(0, o))
        else if (o < 65536) {
          a = new Uint8Array(3)
          const c = new DataView(a.buffer)
          ;(c.setUint8(0, 126), c.setUint16(1, o))
        } else {
          a = new Uint8Array(9)
          const c = new DataView(a.buffer)
          ;(c.setUint8(0, 127), c.setBigUint64(1, BigInt(o)))
        }
        ;(r.data && typeof r.data != "string" && (a[0] |= 128),
          n.enqueue(a),
          n.enqueue(s))
      })
    },
  })
}
let Nu
function Yo(r) {
  return r.reduce((n, s) => n + s.length, 0)
}
function Jo(r, n) {
  if (r[0].length === n) return r.shift()
  const s = new Uint8Array(n)
  let o = 0
  for (let a = 0; a < n; a++)
    ((s[a] = r[0][o++]), o === r[0].length && (r.shift(), (o = 0)))
  return (r.length && o < r[0].length && (r[0] = r[0].slice(o)), s)
}
function pS(r, n) {
  Nu || (Nu = new TextDecoder())
  const s = []
  let o = 0,
    a = -1,
    c = !1
  return new TransformStream({
    transform(f, h) {
      for (s.push(f); ; ) {
        if (o === 0) {
          if (Yo(s) < 1) break
          const m = Jo(s, 1)
          ;((c = (m[0] & 128) === 128),
            (a = m[0] & 127),
            a < 126 ? (o = 3) : a === 126 ? (o = 1) : (o = 2))
        } else if (o === 1) {
          if (Yo(s) < 2) break
          const m = Jo(s, 2)
          ;((a = new DataView(m.buffer, m.byteOffset, m.length).getUint16(0)),
            (o = 3))
        } else if (o === 2) {
          if (Yo(s) < 8) break
          const m = Jo(s, 8),
            g = new DataView(m.buffer, m.byteOffset, m.length),
            y = g.getUint32(0)
          if (y > Math.pow(2, 21) - 1) {
            h.enqueue(tc)
            break
          }
          ;((a = y * Math.pow(2, 32) + g.getUint32(4)), (o = 3))
        } else {
          if (Yo(s) < a) break
          const m = Jo(s, a)
          ;(h.enqueue(Ec(c ? m : Nu.decode(m), n)), (o = 0))
        }
        if (a === 0 || a > r) {
          h.enqueue(tc)
          break
        }
      }
    },
  })
}
const pg = 4
function Ke(r) {
  if (r) return mS(r)
}
function mS(r) {
  for (var n in Ke.prototype) r[n] = Ke.prototype[n]
  return r
}
Ke.prototype.on = Ke.prototype.addEventListener = function (r, n) {
  return (
    (this._callbacks = this._callbacks || {}),
    (this._callbacks["$" + r] = this._callbacks["$" + r] || []).push(n),
    this
  )
}
Ke.prototype.once = function (r, n) {
  function s() {
    ;(this.off(r, s), n.apply(this, arguments))
  }
  return ((s.fn = n), this.on(r, s), this)
}
Ke.prototype.off =
  Ke.prototype.removeListener =
  Ke.prototype.removeAllListeners =
  Ke.prototype.removeEventListener =
    function (r, n) {
      if (((this._callbacks = this._callbacks || {}), arguments.length == 0))
        return ((this._callbacks = {}), this)
      var s = this._callbacks["$" + r]
      if (!s) return this
      if (arguments.length == 1) return (delete this._callbacks["$" + r], this)
      for (var o, a = 0; a < s.length; a++)
        if (((o = s[a]), o === n || o.fn === n)) {
          s.splice(a, 1)
          break
        }
      return (s.length === 0 && delete this._callbacks["$" + r], this)
    }
Ke.prototype.emit = function (r) {
  this._callbacks = this._callbacks || {}
  for (
    var n = new Array(arguments.length - 1),
      s = this._callbacks["$" + r],
      o = 1;
    o < arguments.length;
    o++
  )
    n[o - 1] = arguments[o]
  if (s) {
    s = s.slice(0)
    for (var o = 0, a = s.length; o < a; ++o) s[o].apply(this, n)
  }
  return this
}
Ke.prototype.emitReserved = Ke.prototype.emit
Ke.prototype.listeners = function (r) {
  return (
    (this._callbacks = this._callbacks || {}),
    this._callbacks["$" + r] || []
  )
}
Ke.prototype.hasListeners = function (r) {
  return !!this.listeners(r).length
}
const Sl =
    typeof Promise == "function" && typeof Promise.resolve == "function"
      ? (n) => Promise.resolve().then(n)
      : (n, s) => s(n, 0),
  zt =
    typeof self < "u"
      ? self
      : typeof window < "u"
        ? window
        : Function("return this")(),
  gS = "arraybuffer"
function mg(r, ...n) {
  return n.reduce((s, o) => (r.hasOwnProperty(o) && (s[o] = r[o]), s), {})
}
const yS = zt.setTimeout,
  vS = zt.clearTimeout
function kl(r, n) {
  n.useNativeTimers
    ? ((r.setTimeoutFn = yS.bind(zt)), (r.clearTimeoutFn = vS.bind(zt)))
    : ((r.setTimeoutFn = zt.setTimeout.bind(zt)),
      (r.clearTimeoutFn = zt.clearTimeout.bind(zt)))
}
const wS = 1.33
function xS(r) {
  return typeof r == "string" ? SS(r) : Math.ceil((r.byteLength || r.size) * wS)
}
function SS(r) {
  let n = 0,
    s = 0
  for (let o = 0, a = r.length; o < a; o++)
    ((n = r.charCodeAt(o)),
      n < 128
        ? (s += 1)
        : n < 2048
          ? (s += 2)
          : n < 55296 || n >= 57344
            ? (s += 3)
            : (o++, (s += 4)))
  return s
}
function gg() {
  return (
    Date.now().toString(36).substring(3) +
    Math.random().toString(36).substring(2, 5)
  )
}
function kS(r) {
  let n = ""
  for (let s in r)
    r.hasOwnProperty(s) &&
      (n.length && (n += "&"),
      (n += encodeURIComponent(s) + "=" + encodeURIComponent(r[s])))
  return n
}
function ES(r) {
  let n = {},
    s = r.split("&")
  for (let o = 0, a = s.length; o < a; o++) {
    let c = s[o].split("=")
    n[decodeURIComponent(c[0])] = decodeURIComponent(c[1])
  }
  return n
}
class _S extends Error {
  constructor(n, s, o) {
    ;(super(n),
      (this.description = s),
      (this.context = o),
      (this.type = "TransportError"))
  }
}
class _c extends Ke {
  constructor(n) {
    ;(super(),
      (this.writable = !1),
      kl(this, n),
      (this.opts = n),
      (this.query = n.query),
      (this.socket = n.socket),
      (this.supportsBinary = !n.forceBase64))
  }
  onError(n, s, o) {
    return (super.emitReserved("error", new _S(n, s, o)), this)
  }
  open() {
    return ((this.readyState = "opening"), this.doOpen(), this)
  }
  close() {
    return (
      (this.readyState === "opening" || this.readyState === "open") &&
        (this.doClose(), this.onClose()),
      this
    )
  }
  send(n) {
    this.readyState === "open" && this.write(n)
  }
  onOpen() {
    ;((this.readyState = "open"),
      (this.writable = !0),
      super.emitReserved("open"))
  }
  onData(n) {
    const s = Ec(n, this.socket.binaryType)
    this.onPacket(s)
  }
  onPacket(n) {
    super.emitReserved("packet", n)
  }
  onClose(n) {
    ;((this.readyState = "closed"), super.emitReserved("close", n))
  }
  pause(n) {}
  createUri(n, s = {}) {
    return (
      n +
      "://" +
      this._hostname() +
      this._port() +
      this.opts.path +
      this._query(s)
    )
  }
  _hostname() {
    const n = this.opts.hostname
    return n.indexOf(":") === -1 ? n : "[" + n + "]"
  }
  _port() {
    return this.opts.port &&
      ((this.opts.secure && Number(this.opts.port) !== 443) ||
        (!this.opts.secure && Number(this.opts.port) !== 80))
      ? ":" + this.opts.port
      : ""
  }
  _query(n) {
    const s = kS(n)
    return s.length ? "?" + s : ""
  }
}
class bS extends _c {
  constructor() {
    ;(super(...arguments), (this._polling = !1))
  }
  get name() {
    return "polling"
  }
  doOpen() {
    this._poll()
  }
  pause(n) {
    this.readyState = "pausing"
    const s = () => {
      ;((this.readyState = "paused"), n())
    }
    if (this._polling || !this.writable) {
      let o = 0
      ;(this._polling &&
        (o++,
        this.once("pollComplete", function () {
          --o || s()
        })),
        this.writable ||
          (o++,
          this.once("drain", function () {
            --o || s()
          })))
    } else s()
  }
  _poll() {
    ;((this._polling = !0), this.doPoll(), this.emitReserved("poll"))
  }
  onData(n) {
    const s = (o) => {
      if (
        (this.readyState === "opening" && o.type === "open" && this.onOpen(),
        o.type === "close")
      )
        return (
          this.onClose({ description: "transport closed by the server" }),
          !1
        )
      this.onPacket(o)
    }
    ;(fS(n, this.socket.binaryType).forEach(s),
      this.readyState !== "closed" &&
        ((this._polling = !1),
        this.emitReserved("pollComplete"),
        this.readyState === "open" && this._poll()))
  }
  doClose() {
    const n = () => {
      this.write([{ type: "close" }])
    }
    this.readyState === "open" ? n() : this.once("open", n)
  }
  write(n) {
    ;((this.writable = !1),
      dS(n, (s) => {
        this.doWrite(s, () => {
          ;((this.writable = !0), this.emitReserved("drain"))
        })
      }))
  }
  uri() {
    const n = this.opts.secure ? "https" : "http",
      s = this.query || {}
    return (
      this.opts.timestampRequests !== !1 &&
        (s[this.opts.timestampParam] = gg()),
      !this.supportsBinary && !s.sid && (s.b64 = 1),
      this.createUri(n, s)
    )
  }
}
let yg = !1
try {
  yg = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest()
} catch {}
const CS = yg
function RS() {}
class TS extends bS {
  constructor(n) {
    if ((super(n), typeof location < "u")) {
      const s = location.protocol === "https:"
      let o = location.port
      ;(o || (o = s ? "443" : "80"),
        (this.xd =
          (typeof location < "u" && n.hostname !== location.hostname) ||
          o !== n.port))
    }
  }
  doWrite(n, s) {
    const o = this.request({ method: "POST", data: n })
    ;(o.on("success", s),
      o.on("error", (a, c) => {
        this.onError("xhr post error", a, c)
      }))
  }
  doPoll() {
    const n = this.request()
    ;(n.on("data", this.onData.bind(this)),
      n.on("error", (s, o) => {
        this.onError("xhr poll error", s, o)
      }),
      (this.pollXhr = n))
  }
}
class ln extends Ke {
  constructor(n, s, o) {
    ;(super(),
      (this.createRequest = n),
      kl(this, o),
      (this._opts = o),
      (this._method = o.method || "GET"),
      (this._uri = s),
      (this._data = o.data !== void 0 ? o.data : null),
      this._create())
  }
  _create() {
    var n
    const s = mg(
      this._opts,
      "agent",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "rejectUnauthorized",
      "autoUnref",
    )
    s.xdomain = !!this._opts.xd
    const o = (this._xhr = this.createRequest(s))
    try {
      o.open(this._method, this._uri, !0)
      try {
        if (this._opts.extraHeaders) {
          o.setDisableHeaderCheck && o.setDisableHeaderCheck(!0)
          for (let a in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(a) &&
              o.setRequestHeader(a, this._opts.extraHeaders[a])
        }
      } catch {}
      if (this._method === "POST")
        try {
          o.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
        } catch {}
      try {
        o.setRequestHeader("Accept", "*/*")
      } catch {}
      ;((n = this._opts.cookieJar) === null || n === void 0 || n.addCookies(o),
        "withCredentials" in o &&
          (o.withCredentials = this._opts.withCredentials),
        this._opts.requestTimeout && (o.timeout = this._opts.requestTimeout),
        (o.onreadystatechange = () => {
          var a
          ;(o.readyState === 3 &&
            ((a = this._opts.cookieJar) === null ||
              a === void 0 ||
              a.parseCookies(o.getResponseHeader("set-cookie"))),
            o.readyState === 4 &&
              (o.status === 200 || o.status === 1223
                ? this._onLoad()
                : this.setTimeoutFn(() => {
                    this._onError(typeof o.status == "number" ? o.status : 0)
                  }, 0)))
        }),
        o.send(this._data))
    } catch (a) {
      this.setTimeoutFn(() => {
        this._onError(a)
      }, 0)
      return
    }
    typeof document < "u" &&
      ((this._index = ln.requestsCount++), (ln.requests[this._index] = this))
  }
  _onError(n) {
    ;(this.emitReserved("error", n, this._xhr), this._cleanup(!0))
  }
  _cleanup(n) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (((this._xhr.onreadystatechange = RS), n))
        try {
          this._xhr.abort()
        } catch {}
      ;(typeof document < "u" && delete ln.requests[this._index],
        (this._xhr = null))
    }
  }
  _onLoad() {
    const n = this._xhr.responseText
    n !== null &&
      (this.emitReserved("data", n),
      this.emitReserved("success"),
      this._cleanup())
  }
  abort() {
    this._cleanup()
  }
}
ln.requestsCount = 0
ln.requests = {}
if (typeof document < "u") {
  if (typeof attachEvent == "function") attachEvent("onunload", Op)
  else if (typeof addEventListener == "function") {
    const r = "onpagehide" in zt ? "pagehide" : "unload"
    addEventListener(r, Op, !1)
  }
}
function Op() {
  for (let r in ln.requests)
    ln.requests.hasOwnProperty(r) && ln.requests[r].abort()
}
const PS = (function () {
  const r = vg({ xdomain: !1 })
  return r && r.responseType !== null
})()
class NS extends TS {
  constructor(n) {
    super(n)
    const s = n && n.forceBase64
    this.supportsBinary = PS && !s
  }
  request(n = {}) {
    return (
      Object.assign(n, { xd: this.xd }, this.opts),
      new ln(vg, this.uri(), n)
    )
  }
}
function vg(r) {
  const n = r.xdomain
  try {
    if (typeof XMLHttpRequest < "u" && (!n || CS)) return new XMLHttpRequest()
  } catch {}
  if (!n)
    try {
      return new zt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")
    } catch {}
}
const wg =
  typeof navigator < "u" &&
  typeof navigator.product == "string" &&
  navigator.product.toLowerCase() === "reactnative"
class OS extends _c {
  get name() {
    return "websocket"
  }
  doOpen() {
    const n = this.uri(),
      s = this.opts.protocols,
      o = wg
        ? {}
        : mg(
            this.opts,
            "agent",
            "perMessageDeflate",
            "pfx",
            "key",
            "passphrase",
            "cert",
            "ca",
            "ciphers",
            "rejectUnauthorized",
            "localAddress",
            "protocolVersion",
            "origin",
            "maxPayload",
            "family",
            "checkServerIdentity",
          )
    this.opts.extraHeaders && (o.headers = this.opts.extraHeaders)
    try {
      this.ws = this.createSocket(n, s, o)
    } catch (a) {
      return this.emitReserved("error", a)
    }
    ;((this.ws.binaryType = this.socket.binaryType), this.addEventListeners())
  }
  addEventListeners() {
    ;((this.ws.onopen = () => {
      ;(this.opts.autoUnref && this.ws._socket.unref(), this.onOpen())
    }),
      (this.ws.onclose = (n) =>
        this.onClose({
          description: "websocket connection closed",
          context: n,
        })),
      (this.ws.onmessage = (n) => this.onData(n.data)),
      (this.ws.onerror = (n) => this.onError("websocket error", n)))
  }
  write(n) {
    this.writable = !1
    for (let s = 0; s < n.length; s++) {
      const o = n[s],
        a = s === n.length - 1
      kc(o, this.supportsBinary, (c) => {
        try {
          this.doWrite(o, c)
        } catch {}
        a &&
          Sl(() => {
            ;((this.writable = !0), this.emitReserved("drain"))
          }, this.setTimeoutFn)
      })
    }
  }
  doClose() {
    typeof this.ws < "u" &&
      ((this.ws.onerror = () => {}), this.ws.close(), (this.ws = null))
  }
  uri() {
    const n = this.opts.secure ? "wss" : "ws",
      s = this.query || {}
    return (
      this.opts.timestampRequests && (s[this.opts.timestampParam] = gg()),
      this.supportsBinary || (s.b64 = 1),
      this.createUri(n, s)
    )
  }
}
const Ou = zt.WebSocket || zt.MozWebSocket
class AS extends OS {
  createSocket(n, s, o) {
    return wg ? new Ou(n, s, o) : s ? new Ou(n, s) : new Ou(n)
  }
  doWrite(n, s) {
    this.ws.send(s)
  }
}
class LS extends _c {
  get name() {
    return "webtransport"
  }
  doOpen() {
    try {
      this._transport = new WebTransport(
        this.createUri("https"),
        this.opts.transportOptions[this.name],
      )
    } catch (n) {
      return this.emitReserved("error", n)
    }
    ;(this._transport.closed
      .then(() => {
        this.onClose()
      })
      .catch((n) => {
        this.onError("webtransport error", n)
      }),
      this._transport.ready.then(() => {
        this._transport.createBidirectionalStream().then((n) => {
          const s = pS(Number.MAX_SAFE_INTEGER, this.socket.binaryType),
            o = n.readable.pipeThrough(s).getReader(),
            a = hS()
          ;(a.readable.pipeTo(n.writable),
            (this._writer = a.writable.getWriter()))
          const c = () => {
            o.read()
              .then(({ done: h, value: m }) => {
                h || (this.onPacket(m), c())
              })
              .catch((h) => {})
          }
          c()
          const f = { type: "open" }
          ;(this.query.sid && (f.data = `{"sid":"${this.query.sid}"}`),
            this._writer.write(f).then(() => this.onOpen()))
        })
      }))
  }
  write(n) {
    this.writable = !1
    for (let s = 0; s < n.length; s++) {
      const o = n[s],
        a = s === n.length - 1
      this._writer.write(o).then(() => {
        a &&
          Sl(() => {
            ;((this.writable = !0), this.emitReserved("drain"))
          }, this.setTimeoutFn)
      })
    }
  }
  doClose() {
    var n
    ;(n = this._transport) === null || n === void 0 || n.close()
  }
}
const jS = { websocket: AS, webtransport: LS, polling: NS },
  IS =
    /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  DS = [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor",
  ]
function nc(r) {
  if (r.length > 8e3) throw "URI too long"
  const n = r,
    s = r.indexOf("["),
    o = r.indexOf("]")
  s != -1 &&
    o != -1 &&
    (r =
      r.substring(0, s) +
      r.substring(s, o).replace(/:/g, ";") +
      r.substring(o, r.length))
  let a = IS.exec(r || ""),
    c = {},
    f = 14
  for (; f--; ) c[DS[f]] = a[f] || ""
  return (
    s != -1 &&
      o != -1 &&
      ((c.source = n),
      (c.host = c.host.substring(1, c.host.length - 1).replace(/;/g, ":")),
      (c.authority = c.authority
        .replace("[", "")
        .replace("]", "")
        .replace(/;/g, ":")),
      (c.ipv6uri = !0)),
    (c.pathNames = FS(c, c.path)),
    (c.queryKey = US(c, c.query)),
    c
  )
}
function FS(r, n) {
  const s = /\/{2,9}/g,
    o = n.replace(s, "/").split("/")
  return (
    (n.slice(0, 1) == "/" || n.length === 0) && o.splice(0, 1),
    n.slice(-1) == "/" && o.splice(o.length - 1, 1),
    o
  )
}
function US(r, n) {
  const s = {}
  return (
    n.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (o, a, c) {
      a && (s[a] = c)
    }),
    s
  )
}
const rc =
    typeof addEventListener == "function" &&
    typeof removeEventListener == "function",
  sl = []
rc &&
  addEventListener(
    "offline",
    () => {
      sl.forEach((r) => r())
    },
    !1,
  )
class rr extends Ke {
  constructor(n, s) {
    if (
      (super(),
      (this.binaryType = gS),
      (this.writeBuffer = []),
      (this._prevBufferLen = 0),
      (this._pingInterval = -1),
      (this._pingTimeout = -1),
      (this._maxPayload = -1),
      (this._pingTimeoutTime = 1 / 0),
      n && typeof n == "object" && ((s = n), (n = null)),
      n)
    ) {
      const o = nc(n)
      ;((s.hostname = o.host),
        (s.secure = o.protocol === "https" || o.protocol === "wss"),
        (s.port = o.port),
        o.query && (s.query = o.query))
    } else s.host && (s.hostname = nc(s.host).host)
    ;(kl(this, s),
      (this.secure =
        s.secure != null
          ? s.secure
          : typeof location < "u" && location.protocol === "https:"),
      s.hostname && !s.port && (s.port = this.secure ? "443" : "80"),
      (this.hostname =
        s.hostname ||
        (typeof location < "u" ? location.hostname : "localhost")),
      (this.port =
        s.port ||
        (typeof location < "u" && location.port
          ? location.port
          : this.secure
            ? "443"
            : "80")),
      (this.transports = []),
      (this._transportsByName = {}),
      s.transports.forEach((o) => {
        const a = o.prototype.name
        ;(this.transports.push(a), (this._transportsByName[a] = o))
      }),
      (this.opts = Object.assign(
        {
          path: "/engine.io",
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          timestampParam: "t",
          rememberUpgrade: !1,
          addTrailingSlash: !0,
          rejectUnauthorized: !0,
          perMessageDeflate: { threshold: 1024 },
          transportOptions: {},
          closeOnBeforeunload: !1,
        },
        s,
      )),
      (this.opts.path =
        this.opts.path.replace(/\/$/, "") +
        (this.opts.addTrailingSlash ? "/" : "")),
      typeof this.opts.query == "string" &&
        (this.opts.query = ES(this.opts.query)),
      rc &&
        (this.opts.closeOnBeforeunload &&
          ((this._beforeunloadEventListener = () => {
            this.transport &&
              (this.transport.removeAllListeners(), this.transport.close())
          }),
          addEventListener(
            "beforeunload",
            this._beforeunloadEventListener,
            !1,
          )),
        this.hostname !== "localhost" &&
          ((this._offlineEventListener = () => {
            this._onClose("transport close", {
              description: "network connection lost",
            })
          }),
          sl.push(this._offlineEventListener))),
      this.opts.withCredentials && (this._cookieJar = void 0),
      this._open())
  }
  createTransport(n) {
    const s = Object.assign({}, this.opts.query)
    ;((s.EIO = pg), (s.transport = n), this.id && (s.sid = this.id))
    const o = Object.assign(
      {},
      this.opts,
      {
        query: s,
        socket: this,
        hostname: this.hostname,
        secure: this.secure,
        port: this.port,
      },
      this.opts.transportOptions[n],
    )
    return new this._transportsByName[n](o)
  }
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available")
      }, 0)
      return
    }
    const n =
      this.opts.rememberUpgrade &&
      rr.priorWebsocketSuccess &&
      this.transports.indexOf("websocket") !== -1
        ? "websocket"
        : this.transports[0]
    this.readyState = "opening"
    const s = this.createTransport(n)
    ;(s.open(), this.setTransport(s))
  }
  setTransport(n) {
    ;(this.transport && this.transport.removeAllListeners(),
      (this.transport = n),
      n
        .on("drain", this._onDrain.bind(this))
        .on("packet", this._onPacket.bind(this))
        .on("error", this._onError.bind(this))
        .on("close", (s) => this._onClose("transport close", s)))
  }
  onOpen() {
    ;((this.readyState = "open"),
      (rr.priorWebsocketSuccess = this.transport.name === "websocket"),
      this.emitReserved("open"),
      this.flush())
  }
  _onPacket(n) {
    if (
      this.readyState === "opening" ||
      this.readyState === "open" ||
      this.readyState === "closing"
    )
      switch (
        (this.emitReserved("packet", n), this.emitReserved("heartbeat"), n.type)
      ) {
        case "open":
          this.onHandshake(JSON.parse(n.data))
          break
        case "ping":
          ;(this._sendPacket("pong"),
            this.emitReserved("ping"),
            this.emitReserved("pong"),
            this._resetPingTimeout())
          break
        case "error":
          const s = new Error("server error")
          ;((s.code = n.data), this._onError(s))
          break
        case "message":
          ;(this.emitReserved("data", n.data),
            this.emitReserved("message", n.data))
          break
      }
  }
  onHandshake(n) {
    ;(this.emitReserved("handshake", n),
      (this.id = n.sid),
      (this.transport.query.sid = n.sid),
      (this._pingInterval = n.pingInterval),
      (this._pingTimeout = n.pingTimeout),
      (this._maxPayload = n.maxPayload),
      this.onOpen(),
      this.readyState !== "closed" && this._resetPingTimeout())
  }
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer)
    const n = this._pingInterval + this._pingTimeout
    ;((this._pingTimeoutTime = Date.now() + n),
      (this._pingTimeoutTimer = this.setTimeoutFn(() => {
        this._onClose("ping timeout")
      }, n)),
      this.opts.autoUnref && this._pingTimeoutTimer.unref())
  }
  _onDrain() {
    ;(this.writeBuffer.splice(0, this._prevBufferLen),
      (this._prevBufferLen = 0),
      this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush())
  }
  flush() {
    if (
      this.readyState !== "closed" &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length
    ) {
      const n = this._getWritablePackets()
      ;(this.transport.send(n),
        (this._prevBufferLen = n.length),
        this.emitReserved("flush"))
    }
  }
  _getWritablePackets() {
    if (
      !(
        this._maxPayload &&
        this.transport.name === "polling" &&
        this.writeBuffer.length > 1
      )
    )
      return this.writeBuffer
    let s = 1
    for (let o = 0; o < this.writeBuffer.length; o++) {
      const a = this.writeBuffer[o].data
      if ((a && (s += xS(a)), o > 0 && s > this._maxPayload))
        return this.writeBuffer.slice(0, o)
      s += 2
    }
    return this.writeBuffer
  }
  _hasPingExpired() {
    if (!this._pingTimeoutTime) return !0
    const n = Date.now() > this._pingTimeoutTime
    return (
      n &&
        ((this._pingTimeoutTime = 0),
        Sl(() => {
          this._onClose("ping timeout")
        }, this.setTimeoutFn)),
      n
    )
  }
  write(n, s, o) {
    return (this._sendPacket("message", n, s, o), this)
  }
  send(n, s, o) {
    return (this._sendPacket("message", n, s, o), this)
  }
  _sendPacket(n, s, o, a) {
    if (
      (typeof s == "function" && ((a = s), (s = void 0)),
      typeof o == "function" && ((a = o), (o = null)),
      this.readyState === "closing" || this.readyState === "closed")
    )
      return
    ;((o = o || {}), (o.compress = o.compress !== !1))
    const c = { type: n, data: s, options: o }
    ;(this.emitReserved("packetCreate", c),
      this.writeBuffer.push(c),
      a && this.once("flush", a),
      this.flush())
  }
  close() {
    const n = () => {
        ;(this._onClose("forced close"), this.transport.close())
      },
      s = () => {
        ;(this.off("upgrade", s), this.off("upgradeError", s), n())
      },
      o = () => {
        ;(this.once("upgrade", s), this.once("upgradeError", s))
      }
    return (
      (this.readyState === "opening" || this.readyState === "open") &&
        ((this.readyState = "closing"),
        this.writeBuffer.length
          ? this.once("drain", () => {
              this.upgrading ? o() : n()
            })
          : this.upgrading
            ? o()
            : n()),
      this
    )
  }
  _onError(n) {
    if (
      ((rr.priorWebsocketSuccess = !1),
      this.opts.tryAllTransports &&
        this.transports.length > 1 &&
        this.readyState === "opening")
    )
      return (this.transports.shift(), this._open())
    ;(this.emitReserved("error", n), this._onClose("transport error", n))
  }
  _onClose(n, s) {
    if (
      this.readyState === "opening" ||
      this.readyState === "open" ||
      this.readyState === "closing"
    ) {
      if (
        (this.clearTimeoutFn(this._pingTimeoutTimer),
        this.transport.removeAllListeners("close"),
        this.transport.close(),
        this.transport.removeAllListeners(),
        rc &&
          (this._beforeunloadEventListener &&
            removeEventListener(
              "beforeunload",
              this._beforeunloadEventListener,
              !1,
            ),
          this._offlineEventListener))
      ) {
        const o = sl.indexOf(this._offlineEventListener)
        o !== -1 && sl.splice(o, 1)
      }
      ;((this.readyState = "closed"),
        (this.id = null),
        this.emitReserved("close", n, s),
        (this.writeBuffer = []),
        (this._prevBufferLen = 0))
    }
  }
}
rr.protocol = pg
class MS extends rr {
  constructor() {
    ;(super(...arguments), (this._upgrades = []))
  }
  onOpen() {
    if ((super.onOpen(), this.readyState === "open" && this.opts.upgrade))
      for (let n = 0; n < this._upgrades.length; n++)
        this._probe(this._upgrades[n])
  }
  _probe(n) {
    let s = this.createTransport(n),
      o = !1
    rr.priorWebsocketSuccess = !1
    const a = () => {
      o ||
        (s.send([{ type: "ping", data: "probe" }]),
        s.once("packet", (S) => {
          if (!o)
            if (S.type === "pong" && S.data === "probe") {
              if (
                ((this.upgrading = !0), this.emitReserved("upgrading", s), !s)
              )
                return
              ;((rr.priorWebsocketSuccess = s.name === "websocket"),
                this.transport.pause(() => {
                  o ||
                    (this.readyState !== "closed" &&
                      (y(),
                      this.setTransport(s),
                      s.send([{ type: "upgrade" }]),
                      this.emitReserved("upgrade", s),
                      (s = null),
                      (this.upgrading = !1),
                      this.flush()))
                }))
            } else {
              const A = new Error("probe error")
              ;((A.transport = s.name), this.emitReserved("upgradeError", A))
            }
        }))
    }
    function c() {
      o || ((o = !0), y(), s.close(), (s = null))
    }
    const f = (S) => {
      const A = new Error("probe error: " + S)
      ;((A.transport = s.name), c(), this.emitReserved("upgradeError", A))
    }
    function h() {
      f("transport closed")
    }
    function m() {
      f("socket closed")
    }
    function g(S) {
      s && S.name !== s.name && c()
    }
    const y = () => {
      ;(s.removeListener("open", a),
        s.removeListener("error", f),
        s.removeListener("close", h),
        this.off("close", m),
        this.off("upgrading", g))
    }
    ;(s.once("open", a),
      s.once("error", f),
      s.once("close", h),
      this.once("close", m),
      this.once("upgrading", g),
      this._upgrades.indexOf("webtransport") !== -1 && n !== "webtransport"
        ? this.setTimeoutFn(() => {
            o || s.open()
          }, 200)
        : s.open())
  }
  onHandshake(n) {
    ;((this._upgrades = this._filterUpgrades(n.upgrades)), super.onHandshake(n))
  }
  _filterUpgrades(n) {
    const s = []
    for (let o = 0; o < n.length; o++)
      ~this.transports.indexOf(n[o]) && s.push(n[o])
    return s
  }
}
let zS = class extends MS {
  constructor(n, s = {}) {
    const o = typeof n == "object" ? n : s
    ;((!o.transports || (o.transports && typeof o.transports[0] == "string")) &&
      (o.transports = (o.transports || ["polling", "websocket", "webtransport"])
        .map((a) => jS[a])
        .filter((a) => !!a)),
      super(n, o))
  }
}
function BS(r, n = "", s) {
  let o = r
  ;((s = s || (typeof location < "u" && location)),
    r == null && (r = s.protocol + "//" + s.host),
    typeof r == "string" &&
      (r.charAt(0) === "/" &&
        (r.charAt(1) === "/" ? (r = s.protocol + r) : (r = s.host + r)),
      /^(https?|wss?):\/\//.test(r) ||
        (typeof s < "u" ? (r = s.protocol + "//" + r) : (r = "https://" + r)),
      (o = nc(r))),
    o.port ||
      (/^(http|ws)$/.test(o.protocol)
        ? (o.port = "80")
        : /^(http|ws)s$/.test(o.protocol) && (o.port = "443")),
    (o.path = o.path || "/"))
  const c = o.host.indexOf(":") !== -1 ? "[" + o.host + "]" : o.host
  return (
    (o.id = o.protocol + "://" + c + ":" + o.port + n),
    (o.href =
      o.protocol + "://" + c + (s && s.port === o.port ? "" : ":" + o.port)),
    o
  )
}
const $S = typeof ArrayBuffer == "function",
  VS = (r) =>
    typeof ArrayBuffer.isView == "function"
      ? ArrayBuffer.isView(r)
      : r.buffer instanceof ArrayBuffer,
  xg = Object.prototype.toString,
  qS =
    typeof Blob == "function" ||
    (typeof Blob < "u" && xg.call(Blob) === "[object BlobConstructor]"),
  HS =
    typeof File == "function" ||
    (typeof File < "u" && xg.call(File) === "[object FileConstructor]")
function bc(r) {
  return (
    ($S && (r instanceof ArrayBuffer || VS(r))) ||
    (qS && r instanceof Blob) ||
    (HS && r instanceof File)
  )
}
function il(r, n) {
  if (!r || typeof r != "object") return !1
  if (Array.isArray(r)) {
    for (let s = 0, o = r.length; s < o; s++) if (il(r[s])) return !0
    return !1
  }
  if (bc(r)) return !0
  if (r.toJSON && typeof r.toJSON == "function" && arguments.length === 1)
    return il(r.toJSON(), !0)
  for (const s in r)
    if (Object.prototype.hasOwnProperty.call(r, s) && il(r[s])) return !0
  return !1
}
function QS(r) {
  const n = [],
    s = r.data,
    o = r
  return (
    (o.data = sc(s, n)),
    (o.attachments = n.length),
    { packet: o, buffers: n }
  )
}
function sc(r, n) {
  if (!r) return r
  if (bc(r)) {
    const s = { _placeholder: !0, num: n.length }
    return (n.push(r), s)
  } else if (Array.isArray(r)) {
    const s = new Array(r.length)
    for (let o = 0; o < r.length; o++) s[o] = sc(r[o], n)
    return s
  } else if (typeof r == "object" && !(r instanceof Date)) {
    const s = {}
    for (const o in r)
      Object.prototype.hasOwnProperty.call(r, o) && (s[o] = sc(r[o], n))
    return s
  }
  return r
}
function WS(r, n) {
  return ((r.data = ic(r.data, n)), delete r.attachments, r)
}
function ic(r, n) {
  if (!r) return r
  if (r && r._placeholder === !0) {
    if (typeof r.num == "number" && r.num >= 0 && r.num < n.length)
      return n[r.num]
    throw new Error("illegal attachments")
  } else if (Array.isArray(r))
    for (let s = 0; s < r.length; s++) r[s] = ic(r[s], n)
  else if (typeof r == "object")
    for (const s in r)
      Object.prototype.hasOwnProperty.call(r, s) && (r[s] = ic(r[s], n))
  return r
}
const KS = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener",
]
var ke
;(function (r) {
  ;((r[(r.CONNECT = 0)] = "CONNECT"),
    (r[(r.DISCONNECT = 1)] = "DISCONNECT"),
    (r[(r.EVENT = 2)] = "EVENT"),
    (r[(r.ACK = 3)] = "ACK"),
    (r[(r.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
    (r[(r.BINARY_EVENT = 5)] = "BINARY_EVENT"),
    (r[(r.BINARY_ACK = 6)] = "BINARY_ACK"))
})(ke || (ke = {}))
class GS {
  constructor(n) {
    this.replacer = n
  }
  encode(n) {
    return (n.type === ke.EVENT || n.type === ke.ACK) && il(n)
      ? this.encodeAsBinary({
          type: n.type === ke.EVENT ? ke.BINARY_EVENT : ke.BINARY_ACK,
          nsp: n.nsp,
          data: n.data,
          id: n.id,
        })
      : [this.encodeAsString(n)]
  }
  encodeAsString(n) {
    let s = "" + n.type
    return (
      (n.type === ke.BINARY_EVENT || n.type === ke.BINARY_ACK) &&
        (s += n.attachments + "-"),
      n.nsp && n.nsp !== "/" && (s += n.nsp + ","),
      n.id != null && (s += n.id),
      n.data != null && (s += JSON.stringify(n.data, this.replacer)),
      s
    )
  }
  encodeAsBinary(n) {
    const s = QS(n),
      o = this.encodeAsString(s.packet),
      a = s.buffers
    return (a.unshift(o), a)
  }
}
class Cc extends Ke {
  constructor(n) {
    ;(super(), (this.reviver = n))
  }
  add(n) {
    let s
    if (typeof n == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet")
      s = this.decodeString(n)
      const o = s.type === ke.BINARY_EVENT
      o || s.type === ke.BINARY_ACK
        ? ((s.type = o ? ke.EVENT : ke.ACK),
          (this.reconstructor = new YS(s)),
          s.attachments === 0 && super.emitReserved("decoded", s))
        : super.emitReserved("decoded", s)
    } else if (bc(n) || n.base64)
      if (this.reconstructor)
        ((s = this.reconstructor.takeBinaryData(n)),
          s && ((this.reconstructor = null), super.emitReserved("decoded", s)))
      else throw new Error("got binary data when not reconstructing a packet")
    else throw new Error("Unknown type: " + n)
  }
  decodeString(n) {
    let s = 0
    const o = { type: Number(n.charAt(0)) }
    if (ke[o.type] === void 0) throw new Error("unknown packet type " + o.type)
    if (o.type === ke.BINARY_EVENT || o.type === ke.BINARY_ACK) {
      const c = s + 1
      for (; n.charAt(++s) !== "-" && s != n.length; );
      const f = n.substring(c, s)
      if (f != Number(f) || n.charAt(s) !== "-")
        throw new Error("Illegal attachments")
      o.attachments = Number(f)
    }
    if (n.charAt(s + 1) === "/") {
      const c = s + 1
      for (; ++s && !(n.charAt(s) === "," || s === n.length); );
      o.nsp = n.substring(c, s)
    } else o.nsp = "/"
    const a = n.charAt(s + 1)
    if (a !== "" && Number(a) == a) {
      const c = s + 1
      for (; ++s; ) {
        const f = n.charAt(s)
        if (f == null || Number(f) != f) {
          --s
          break
        }
        if (s === n.length) break
      }
      o.id = Number(n.substring(c, s + 1))
    }
    if (n.charAt(++s)) {
      const c = this.tryParse(n.substr(s))
      if (Cc.isPayloadValid(o.type, c)) o.data = c
      else throw new Error("invalid payload")
    }
    return o
  }
  tryParse(n) {
    try {
      return JSON.parse(n, this.reviver)
    } catch {
      return !1
    }
  }
  static isPayloadValid(n, s) {
    switch (n) {
      case ke.CONNECT:
        return Ap(s)
      case ke.DISCONNECT:
        return s === void 0
      case ke.CONNECT_ERROR:
        return typeof s == "string" || Ap(s)
      case ke.EVENT:
      case ke.BINARY_EVENT:
        return (
          Array.isArray(s) &&
          (typeof s[0] == "number" ||
            (typeof s[0] == "string" && KS.indexOf(s[0]) === -1))
        )
      case ke.ACK:
      case ke.BINARY_ACK:
        return Array.isArray(s)
    }
  }
  destroy() {
    this.reconstructor &&
      (this.reconstructor.finishedReconstruction(), (this.reconstructor = null))
  }
}
class YS {
  constructor(n) {
    ;((this.packet = n), (this.buffers = []), (this.reconPack = n))
  }
  takeBinaryData(n) {
    if (
      (this.buffers.push(n), this.buffers.length === this.reconPack.attachments)
    ) {
      const s = WS(this.reconPack, this.buffers)
      return (this.finishedReconstruction(), s)
    }
    return null
  }
  finishedReconstruction() {
    ;((this.reconPack = null), (this.buffers = []))
  }
}
function Ap(r) {
  return Object.prototype.toString.call(r) === "[object Object]"
}
const JS = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      Decoder: Cc,
      Encoder: GS,
      get PacketType() {
        return ke
      },
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
)
function Yt(r, n, s) {
  return (
    r.on(n, s),
    function () {
      r.off(n, s)
    }
  )
}
const XS = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  newListener: 1,
  removeListener: 1,
})
class Sg extends Ke {
  constructor(n, s, o) {
    ;(super(),
      (this.connected = !1),
      (this.recovered = !1),
      (this.receiveBuffer = []),
      (this.sendBuffer = []),
      (this._queue = []),
      (this._queueSeq = 0),
      (this.ids = 0),
      (this.acks = {}),
      (this.flags = {}),
      (this.io = n),
      (this.nsp = s),
      o && o.auth && (this.auth = o.auth),
      (this._opts = Object.assign({}, o)),
      this.io._autoConnect && this.open())
  }
  get disconnected() {
    return !this.connected
  }
  subEvents() {
    if (this.subs) return
    const n = this.io
    this.subs = [
      Yt(n, "open", this.onopen.bind(this)),
      Yt(n, "packet", this.onpacket.bind(this)),
      Yt(n, "error", this.onerror.bind(this)),
      Yt(n, "close", this.onclose.bind(this)),
    ]
  }
  get active() {
    return !!this.subs
  }
  connect() {
    return this.connected
      ? this
      : (this.subEvents(),
        this.io._reconnecting || this.io.open(),
        this.io._readyState === "open" && this.onopen(),
        this)
  }
  open() {
    return this.connect()
  }
  send(...n) {
    return (n.unshift("message"), this.emit.apply(this, n), this)
  }
  emit(n, ...s) {
    var o, a, c
    if (XS.hasOwnProperty(n))
      throw new Error('"' + n.toString() + '" is a reserved event name')
    if (
      (s.unshift(n),
      this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
    )
      return (this._addToQueue(s), this)
    const f = { type: ke.EVENT, data: s }
    if (
      ((f.options = {}),
      (f.options.compress = this.flags.compress !== !1),
      typeof s[s.length - 1] == "function")
    ) {
      const y = this.ids++,
        S = s.pop()
      ;(this._registerAckCallback(y, S), (f.id = y))
    }
    const h =
        (a =
          (o = this.io.engine) === null || o === void 0
            ? void 0
            : o.transport) === null || a === void 0
          ? void 0
          : a.writable,
      m =
        this.connected &&
        !(
          !((c = this.io.engine) === null || c === void 0) &&
          c._hasPingExpired()
        )
    return (
      (this.flags.volatile && !h) ||
        (m
          ? (this.notifyOutgoingListeners(f), this.packet(f))
          : this.sendBuffer.push(f)),
      (this.flags = {}),
      this
    )
  }
  _registerAckCallback(n, s) {
    var o
    const a =
      (o = this.flags.timeout) !== null && o !== void 0
        ? o
        : this._opts.ackTimeout
    if (a === void 0) {
      this.acks[n] = s
      return
    }
    const c = this.io.setTimeoutFn(() => {
        delete this.acks[n]
        for (let h = 0; h < this.sendBuffer.length; h++)
          this.sendBuffer[h].id === n && this.sendBuffer.splice(h, 1)
        s.call(this, new Error("operation has timed out"))
      }, a),
      f = (...h) => {
        ;(this.io.clearTimeoutFn(c), s.apply(this, h))
      }
    ;((f.withError = !0), (this.acks[n] = f))
  }
  emitWithAck(n, ...s) {
    return new Promise((o, a) => {
      const c = (f, h) => (f ? a(f) : o(h))
      ;((c.withError = !0), s.push(c), this.emit(n, ...s))
    })
  }
  _addToQueue(n) {
    let s
    typeof n[n.length - 1] == "function" && (s = n.pop())
    const o = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: n,
      flags: Object.assign({ fromQueue: !0 }, this.flags),
    }
    ;(n.push(
      (a, ...c) => (
        this._queue[0],
        a !== null
          ? o.tryCount > this._opts.retries && (this._queue.shift(), s && s(a))
          : (this._queue.shift(), s && s(null, ...c)),
        (o.pending = !1),
        this._drainQueue()
      ),
    ),
      this._queue.push(o),
      this._drainQueue())
  }
  _drainQueue(n = !1) {
    if (!this.connected || this._queue.length === 0) return
    const s = this._queue[0]
    ;(s.pending && !n) ||
      ((s.pending = !0),
      s.tryCount++,
      (this.flags = s.flags),
      this.emit.apply(this, s.args))
  }
  packet(n) {
    ;((n.nsp = this.nsp), this.io._packet(n))
  }
  onopen() {
    typeof this.auth == "function"
      ? this.auth((n) => {
          this._sendConnectPacket(n)
        })
      : this._sendConnectPacket(this.auth)
  }
  _sendConnectPacket(n) {
    this.packet({
      type: ke.CONNECT,
      data: this._pid
        ? Object.assign({ pid: this._pid, offset: this._lastOffset }, n)
        : n,
    })
  }
  onerror(n) {
    this.connected || this.emitReserved("connect_error", n)
  }
  onclose(n, s) {
    ;((this.connected = !1),
      delete this.id,
      this.emitReserved("disconnect", n, s),
      this._clearAcks())
  }
  _clearAcks() {
    Object.keys(this.acks).forEach((n) => {
      if (!this.sendBuffer.some((o) => String(o.id) === n)) {
        const o = this.acks[n]
        ;(delete this.acks[n],
          o.withError &&
            o.call(this, new Error("socket has been disconnected")))
      }
    })
  }
  onpacket(n) {
    if (n.nsp === this.nsp)
      switch (n.type) {
        case ke.CONNECT:
          n.data && n.data.sid
            ? this.onconnect(n.data.sid, n.data.pid)
            : this.emitReserved(
                "connect_error",
                new Error(
                  "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)",
                ),
              )
          break
        case ke.EVENT:
        case ke.BINARY_EVENT:
          this.onevent(n)
          break
        case ke.ACK:
        case ke.BINARY_ACK:
          this.onack(n)
          break
        case ke.DISCONNECT:
          this.ondisconnect()
          break
        case ke.CONNECT_ERROR:
          this.destroy()
          const o = new Error(n.data.message)
          ;((o.data = n.data.data), this.emitReserved("connect_error", o))
          break
      }
  }
  onevent(n) {
    const s = n.data || []
    ;(n.id != null && s.push(this.ack(n.id)),
      this.connected
        ? this.emitEvent(s)
        : this.receiveBuffer.push(Object.freeze(s)))
  }
  emitEvent(n) {
    if (this._anyListeners && this._anyListeners.length) {
      const s = this._anyListeners.slice()
      for (const o of s) o.apply(this, n)
    }
    ;(super.emit.apply(this, n),
      this._pid &&
        n.length &&
        typeof n[n.length - 1] == "string" &&
        (this._lastOffset = n[n.length - 1]))
  }
  ack(n) {
    const s = this
    let o = !1
    return function (...a) {
      o || ((o = !0), s.packet({ type: ke.ACK, id: n, data: a }))
    }
  }
  onack(n) {
    const s = this.acks[n.id]
    typeof s == "function" &&
      (delete this.acks[n.id],
      s.withError && n.data.unshift(null),
      s.apply(this, n.data))
  }
  onconnect(n, s) {
    ;((this.id = n),
      (this.recovered = s && this._pid === s),
      (this._pid = s),
      (this.connected = !0),
      this.emitBuffered(),
      this._drainQueue(!0),
      this.emitReserved("connect"))
  }
  emitBuffered() {
    ;(this.receiveBuffer.forEach((n) => this.emitEvent(n)),
      (this.receiveBuffer = []),
      this.sendBuffer.forEach((n) => {
        ;(this.notifyOutgoingListeners(n), this.packet(n))
      }),
      (this.sendBuffer = []))
  }
  ondisconnect() {
    ;(this.destroy(), this.onclose("io server disconnect"))
  }
  destroy() {
    ;(this.subs && (this.subs.forEach((n) => n()), (this.subs = void 0)),
      this.io._destroy(this))
  }
  disconnect() {
    return (
      this.connected && this.packet({ type: ke.DISCONNECT }),
      this.destroy(),
      this.connected && this.onclose("io client disconnect"),
      this
    )
  }
  close() {
    return this.disconnect()
  }
  compress(n) {
    return ((this.flags.compress = n), this)
  }
  get volatile() {
    return ((this.flags.volatile = !0), this)
  }
  timeout(n) {
    return ((this.flags.timeout = n), this)
  }
  onAny(n) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.push(n),
      this
    )
  }
  prependAny(n) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.unshift(n),
      this
    )
  }
  offAny(n) {
    if (!this._anyListeners) return this
    if (n) {
      const s = this._anyListeners
      for (let o = 0; o < s.length; o++)
        if (n === s[o]) return (s.splice(o, 1), this)
    } else this._anyListeners = []
    return this
  }
  listenersAny() {
    return this._anyListeners || []
  }
  onAnyOutgoing(n) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.push(n),
      this
    )
  }
  prependAnyOutgoing(n) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.unshift(n),
      this
    )
  }
  offAnyOutgoing(n) {
    if (!this._anyOutgoingListeners) return this
    if (n) {
      const s = this._anyOutgoingListeners
      for (let o = 0; o < s.length; o++)
        if (n === s[o]) return (s.splice(o, 1), this)
    } else this._anyOutgoingListeners = []
    return this
  }
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || []
  }
  notifyOutgoingListeners(n) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const s = this._anyOutgoingListeners.slice()
      for (const o of s) o.apply(this, n.data)
    }
  }
}
function ks(r) {
  ;((r = r || {}),
    (this.ms = r.min || 100),
    (this.max = r.max || 1e4),
    (this.factor = r.factor || 2),
    (this.jitter = r.jitter > 0 && r.jitter <= 1 ? r.jitter : 0),
    (this.attempts = 0))
}
ks.prototype.duration = function () {
  var r = this.ms * Math.pow(this.factor, this.attempts++)
  if (this.jitter) {
    var n = Math.random(),
      s = Math.floor(n * this.jitter * r)
    r = (Math.floor(n * 10) & 1) == 0 ? r - s : r + s
  }
  return Math.min(r, this.max) | 0
}
ks.prototype.reset = function () {
  this.attempts = 0
}
ks.prototype.setMin = function (r) {
  this.ms = r
}
ks.prototype.setMax = function (r) {
  this.max = r
}
ks.prototype.setJitter = function (r) {
  this.jitter = r
}
class oc extends Ke {
  constructor(n, s) {
    var o
    ;(super(),
      (this.nsps = {}),
      (this.subs = []),
      n && typeof n == "object" && ((s = n), (n = void 0)),
      (s = s || {}),
      (s.path = s.path || "/socket.io"),
      (this.opts = s),
      kl(this, s),
      this.reconnection(s.reconnection !== !1),
      this.reconnectionAttempts(s.reconnectionAttempts || 1 / 0),
      this.reconnectionDelay(s.reconnectionDelay || 1e3),
      this.reconnectionDelayMax(s.reconnectionDelayMax || 5e3),
      this.randomizationFactor(
        (o = s.randomizationFactor) !== null && o !== void 0 ? o : 0.5,
      ),
      (this.backoff = new ks({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor(),
      })),
      this.timeout(s.timeout == null ? 2e4 : s.timeout),
      (this._readyState = "closed"),
      (this.uri = n))
    const a = s.parser || JS
    ;((this.encoder = new a.Encoder()),
      (this.decoder = new a.Decoder()),
      (this._autoConnect = s.autoConnect !== !1),
      this._autoConnect && this.open())
  }
  reconnection(n) {
    return arguments.length
      ? ((this._reconnection = !!n), n || (this.skipReconnect = !0), this)
      : this._reconnection
  }
  reconnectionAttempts(n) {
    return n === void 0
      ? this._reconnectionAttempts
      : ((this._reconnectionAttempts = n), this)
  }
  reconnectionDelay(n) {
    var s
    return n === void 0
      ? this._reconnectionDelay
      : ((this._reconnectionDelay = n),
        (s = this.backoff) === null || s === void 0 || s.setMin(n),
        this)
  }
  randomizationFactor(n) {
    var s
    return n === void 0
      ? this._randomizationFactor
      : ((this._randomizationFactor = n),
        (s = this.backoff) === null || s === void 0 || s.setJitter(n),
        this)
  }
  reconnectionDelayMax(n) {
    var s
    return n === void 0
      ? this._reconnectionDelayMax
      : ((this._reconnectionDelayMax = n),
        (s = this.backoff) === null || s === void 0 || s.setMax(n),
        this)
  }
  timeout(n) {
    return arguments.length ? ((this._timeout = n), this) : this._timeout
  }
  maybeReconnectOnOpen() {
    !this._reconnecting &&
      this._reconnection &&
      this.backoff.attempts === 0 &&
      this.reconnect()
  }
  open(n) {
    if (~this._readyState.indexOf("open")) return this
    this.engine = new zS(this.uri, this.opts)
    const s = this.engine,
      o = this
    ;((this._readyState = "opening"), (this.skipReconnect = !1))
    const a = Yt(s, "open", function () {
        ;(o.onopen(), n && n())
      }),
      c = (h) => {
        ;(this.cleanup(),
          (this._readyState = "closed"),
          this.emitReserved("error", h),
          n ? n(h) : this.maybeReconnectOnOpen())
      },
      f = Yt(s, "error", c)
    if (this._timeout !== !1) {
      const h = this._timeout,
        m = this.setTimeoutFn(() => {
          ;(a(), c(new Error("timeout")), s.close())
        }, h)
      ;(this.opts.autoUnref && m.unref(),
        this.subs.push(() => {
          this.clearTimeoutFn(m)
        }))
    }
    return (this.subs.push(a), this.subs.push(f), this)
  }
  connect(n) {
    return this.open(n)
  }
  onopen() {
    ;(this.cleanup(), (this._readyState = "open"), this.emitReserved("open"))
    const n = this.engine
    this.subs.push(
      Yt(n, "ping", this.onping.bind(this)),
      Yt(n, "data", this.ondata.bind(this)),
      Yt(n, "error", this.onerror.bind(this)),
      Yt(n, "close", this.onclose.bind(this)),
      Yt(this.decoder, "decoded", this.ondecoded.bind(this)),
    )
  }
  onping() {
    this.emitReserved("ping")
  }
  ondata(n) {
    try {
      this.decoder.add(n)
    } catch (s) {
      this.onclose("parse error", s)
    }
  }
  ondecoded(n) {
    Sl(() => {
      this.emitReserved("packet", n)
    }, this.setTimeoutFn)
  }
  onerror(n) {
    this.emitReserved("error", n)
  }
  socket(n, s) {
    let o = this.nsps[n]
    return (
      o
        ? this._autoConnect && !o.active && o.connect()
        : ((o = new Sg(this, n, s)), (this.nsps[n] = o)),
      o
    )
  }
  _destroy(n) {
    const s = Object.keys(this.nsps)
    for (const o of s) if (this.nsps[o].active) return
    this._close()
  }
  _packet(n) {
    const s = this.encoder.encode(n)
    for (let o = 0; o < s.length; o++) this.engine.write(s[o], n.options)
  }
  cleanup() {
    ;(this.subs.forEach((n) => n()),
      (this.subs.length = 0),
      this.decoder.destroy())
  }
  _close() {
    ;((this.skipReconnect = !0),
      (this._reconnecting = !1),
      this.onclose("forced close"))
  }
  disconnect() {
    return this._close()
  }
  onclose(n, s) {
    var o
    ;(this.cleanup(),
      (o = this.engine) === null || o === void 0 || o.close(),
      this.backoff.reset(),
      (this._readyState = "closed"),
      this.emitReserved("close", n, s),
      this._reconnection && !this.skipReconnect && this.reconnect())
  }
  reconnect() {
    if (this._reconnecting || this.skipReconnect) return this
    const n = this
    if (this.backoff.attempts >= this._reconnectionAttempts)
      (this.backoff.reset(),
        this.emitReserved("reconnect_failed"),
        (this._reconnecting = !1))
    else {
      const s = this.backoff.duration()
      this._reconnecting = !0
      const o = this.setTimeoutFn(() => {
        n.skipReconnect ||
          (this.emitReserved("reconnect_attempt", n.backoff.attempts),
          !n.skipReconnect &&
            n.open((a) => {
              a
                ? ((n._reconnecting = !1),
                  n.reconnect(),
                  this.emitReserved("reconnect_error", a))
                : n.onreconnect()
            }))
      }, s)
      ;(this.opts.autoUnref && o.unref(),
        this.subs.push(() => {
          this.clearTimeoutFn(o)
        }))
    }
  }
  onreconnect() {
    const n = this.backoff.attempts
    ;((this._reconnecting = !1),
      this.backoff.reset(),
      this.emitReserved("reconnect", n))
  }
}
const di = {}
function ol(r, n) {
  ;(typeof r == "object" && ((n = r), (r = void 0)), (n = n || {}))
  const s = BS(r, n.path || "/socket.io"),
    o = s.source,
    a = s.id,
    c = s.path,
    f = di[a] && c in di[a].nsps,
    h = n.forceNew || n["force new connection"] || n.multiplex === !1 || f
  let m
  return (
    h ? (m = new oc(o, n)) : (di[a] || (di[a] = new oc(o, n)), (m = di[a])),
    s.query && !n.query && (n.query = s.queryKey),
    m.socket(s.path, n)
  )
}
Object.assign(ol, { Manager: oc, Socket: Sg, io: ol, connect: ol })
function Lp(r, n) {
  var s
  const o = ol(r.serverUrl, {
    path: r.mountPath,
    transports: r.transports,
    query: {
      app_id: r.appId,
      token: (s = r.token) !== null && s !== void 0 ? s : fl(),
    },
  })
  return (
    o.on("connect", async () => {
      var a
      return (
        console.log("connect", o.id),
        (a = n.connect) === null || a === void 0 ? void 0 : a.call(n)
      )
    }),
    o.on("update_model", async (a) => {
      var c
      return (c = n.update_model) === null || c === void 0
        ? void 0
        : c.call(n, a)
    }),
    o.on("error", async (a) => {
      var c
      return (c = n.error) === null || c === void 0 ? void 0 : c.call(n, a)
    }),
    o.on("connect_error", async (a) => {
      var c
      return (
        console.error("connect_error", a),
        (c = n.error) === null || c === void 0 ? void 0 : c.call(n, a)
      )
    }),
    o
  )
}
function ZS({ config: r }) {
  let n = { ...r }
  const s = {},
    o = {
      connect: async () => {
        const L = []
        ;(Object.keys(s).forEach((E) => {
          m(E)
          const b = S(E)
          b == null ||
            b.forEach(({ connect: w }) => {
              const F = async () => (w == null ? void 0 : w())
              L.push(F())
            })
        }),
          await Promise.all(L))
      },
      update_model: async (L) => {
        const b = S(L.room).map((w) => {
          var F
          return (F = w.update_model) === null || F === void 0
            ? void 0
            : F.call(w, L)
        })
        await Promise.all(b)
      },
      error: async (L) => {
        console.error("error", L)
        const E = Object.values(s)
          .flat()
          .map((b) => {
            var w
            return (w = b.error) === null || w === void 0
              ? void 0
              : w.call(b, L)
          })
        await Promise.all(E)
      },
    }
  let a = Lp(r, o)
  function c() {
    f()
  }
  function f() {
    a && a.disconnect()
  }
  function h(L) {
    ;(c(), (n = { ...n, ...L }), (a = Lp(n, o)))
  }
  function m(L) {
    a.emit("join", L)
  }
  function g(L) {
    a.emit("leave", L)
  }
  async function y(L, E) {
    var b
    const w = JSON.stringify(E)
    return (b = o.update_model) === null || b === void 0
      ? void 0
      : b.call(o, { room: L, data: w })
  }
  function S(L) {
    return s[L]
  }
  return {
    socket: a,
    subscribeToRoom: (L, E) => (
      s[L] || (m(L), (s[L] = [])),
      s[L].push(E),
      () => {
        var b, w
        ;((s[L] =
          (w =
            (b = s[L]) === null || b === void 0
              ? void 0
              : b.filter((F) => F !== E)) !== null && w !== void 0
            ? w
            : []),
          s[L].length === 0 && g(L))
      }
    ),
    updateConfig: h,
    updateModel: y,
    disconnect: f,
  }
}
const fi = typeof window < "u" ? window : { base44SharedInstances: {} }
function ek(r, n) {
  return (
    fi.base44SharedInstances || (fi.base44SharedInstances = {}),
    fi.base44SharedInstances[r] ||
      (fi.base44SharedInstances[r] = { instance: n() }),
    fi.base44SharedInstances[r].instance
  )
}
// const tk = "__user_heartbeat_event__",
//   nk = "__initialization_event__",
//   rk = "__session_duration_event__",
//   jp = "analytics-enable",
//   Ip = "base44_analytics_session_id",
//   sk = {
//     enabled: !0,
//     maxQueueSize: 1e3,
//     throttleTime: 1e3,
//     batchSize: 30,
//     heartBeatInterval: 60 * 1e3,
//   },
//   ik = "analytics",
//   Ae = ek(ik, () => ({
//     requestsQueue: [],
//     isProcessing: !1,
//     isHeartBeatProcessing: !1,
//     wasInitializationTracked: !1,
//     sessionContext: null,
//     sessionStartTime: null,
//     config: { ...sk, ...hk() },
//   })),
//   ok = ({ axiosClient: r, serverUrl: n, appId: s, userAuthModule: o }) => {
//     var a
//     const { maxQueueSize: c, throttleTime: f, batchSize: h } = Ae.config
//     if (!(!((a = Ae.config) === null || a === void 0) && a.enabled))
//       return { track: () => {}, cleanup: () => {} }
//     let m
//     const g = `${n}/api/apps/${s}/analytics/track/batch`,
//       y = async (B) => {
//         await r.request({
//           method: "POST",
//           url: `/apps/${s}/analytics/track/batch`,
//           data: { events: B },
//         })
//       },
//       S = (B) => {
//         try {
//           const j = JSON.stringify({ events: B }),
//             K = new Blob([j], { type: "application/json" })
//           return (
//             typeof navigator > "u" ||
//             j.length > 6e4 ||
//             !navigator.sendBeacon(g, K)
//           )
//         } catch {
//           return !1
//         }
//       },
//       A = async (B, j = {}) => {
//         if (B.length === 0) return
//         const K = await fk(o),
//           ne = B.map(dk(K))
//         try {
//           ;(!j.isBeacon || !S(ne)) && (await y(ne))
//         } catch {}
//       },
//       L = () => {
//         Fp(A, { throttleTime: f, batchSize: h })
//       },
//       E = (B) => {
//         if (Ae.requestsQueue.length >= c) return
//         const j = ck()
//         ;(Ae.requestsQueue.push({ ...B, ...j }), L())
//       },
//       b = () => {
//         ;(Fp(A, { throttleTime: f, batchSize: h }), (m = Up(E)), ak())
//       },
//       w = () => {
//         ;(Dp(), m == null || m(), uk(E))
//         const B = Ae.requestsQueue.splice(0)
//         A(B, { isBeacon: !0 })
//       },
//       F = () => {
//         typeof window > "u" ||
//           (document.visibilityState === "hidden"
//             ? w()
//             : document.visibilityState === "visible" && b())
//       },
//       Q = () => {
//         ;(Dp(),
//           m == null || m(),
//           typeof window < "u" &&
//             window.removeEventListener("visibilitychange", F))
//       }
//     return (
//       L(),
//       (m = Up(E)),
//       lk(E),
//       typeof window < "u" && window.addEventListener("visibilitychange", F),
//       { track: E, cleanup: Q }
//     )
//   }
function Dp() {
  Ae.isProcessing = !1
}
async function Fp(r, n) {
  if (Ae.isProcessing) return
  Ae.isProcessing = !0
  const { throttleTime: s = 1e3, batchSize: o = 30 } = n ?? {}
  for (; Ae.isProcessing && Ae.requestsQueue.length > 0; ) {
    const a = Ae.requestsQueue.splice(0, o)
    ;(a.length && (await r(a)), await new Promise((c) => setTimeout(c, s)))
  }
  Ae.isProcessing = !1
}
function Up(r) {
  var n
  if (
    Ae.isHeartBeatProcessing ||
    ((n = Ae.config.heartBeatInterval) !== null && n !== void 0 ? n : 0) < 10
  )
    return () => {}
  Ae.isHeartBeatProcessing = !0
  const s = setInterval(() => {
    r({ eventName: tk })
  }, Ae.config.heartBeatInterval)
  return () => {
    ;(clearInterval(s), (Ae.isHeartBeatProcessing = !1))
  }
}
function lk(r) {
  typeof window > "u" ||
    Ae.wasInitializationTracked ||
    ((Ae.wasInitializationTracked = !0),
    r({
      eventName: nk,
      properties: { referrer: document == null ? void 0 : document.referrer },
    }))
}
function ak() {
  typeof window > "u" ||
    Ae.sessionStartTime !== null ||
    (Ae.sessionStartTime = new Date().toISOString())
}
function uk(r) {
  if (typeof window > "u" || Ae.sessionStartTime === null) return
  const n = new Date().getTime() - new Date(Ae.sessionStartTime).getTime()
  ;((Ae.sessionStartTime = null),
    r({ eventName: rk, properties: { sessionDuration: n } }))
}
function ck() {
  return {
    timestamp: new Date().toISOString(),
    pageUrl: typeof window < "u" ? window.location.pathname : null,
  }
}
function dk(r) {
  return (n) => ({
    event_name: n.eventName,
    properties: n.properties,
    timestamp: n.timestamp,
    page_url: n.pageUrl,
    ...r,
  })
}
let Au = null
async function fk(r) {
  if (!Ae.sessionContext) {
    if (!Au) {
      const n = pk()
      Au = r
        .me()
        .then((s) => ({ user_id: s.id, session_id: n }))
        .catch(() => ({ user_id: null, session_id: n }))
    }
    Ae.sessionContext = await Au
  }
  return Ae.sessionContext
}
function hk() {
  if (typeof window > "u") return
  const n = new URLSearchParams(window.location.search).get(jp)
  if (n == null || !n.length) return
  const s = new URLSearchParams(window.location.search)
  s.delete(jp)
  const o = window.location.pathname + (s.toString() ? "?" + s.toString() : "")
  return (window.history.replaceState({}, "", o), { enabled: n === "true" })
}
function pk() {
  if (typeof window > "u") return Ru()
  try {
    const r = localStorage.getItem(Ip)
    if (!r) {
      const n = Ru()
      return (localStorage.setItem(Ip, n), n)
    }
    return r
  } catch {
    return Ru()
  }
}
function mk(r) {
  var n, s
  const {
      serverUrl: o = "https://base44.app",
      appId: a,
      token: c,
      serviceToken: f,
      requiresAuth: h = !1,
      appBaseUrl: m,
      options: g,
      functionsVersion: y,
      headers: S,
    } = r,
    A = typeof m == "string" ? m : "",
    L = {
      serverUrl: o,
      mountPath: "/ws-user-apps/socket.io/",
      transports: ["websocket"],
      appId: a,
      token: c,
    }
  let E = null
  const b = () => (E || (E = ZS({ config: L })), E),
    w = { ...S, "X-App-Id": String(a) },
    F = y ? { ...w, "Base44-Functions-Version": y } : w,
    Q = pi({
      baseURL: `${o}/api`,
      headers: w,
      token: c,
      onError: g == null ? void 0 : g.onError,
    }),
    B = pi({
      baseURL: `${o}/api`,
      headers: F,
      token: c,
      interceptResponses: !1,
      onError: g == null ? void 0 : g.onError,
    }),
    j = pi({
      baseURL: `${o}/api`,
      headers: w,
      token: f,
      onError: g == null ? void 0 : g.onError,
    }),
    K = pi({
      baseURL: `${o}/api`,
      headers: F,
      token: f,
      interceptResponses: !1,
    }),
    ne = tS(Q, B, a, { appBaseUrl: A }),
    se = {
      entities: Ep({ axios: Q, appId: a, getSocket: b }),
      integrations: _p(Q, a),
      connectors: sS(Q, a),
      auth: ne,
      functions: bp(B, a, {
        getAuthHeaders: () => {
          const le = {},
            Oe = c || fl()
          return (Oe && (le.Authorization = `Bearer ${Oe}`), le)
        },
        baseURL: (n = B.defaults) === null || n === void 0 ? void 0 : n.baseURL,
      }),
      agents: Cp({ axios: Q, getSocket: b, appId: a, serverUrl: o, token: c }),
      appLogs: Rp(Q, a),
      users: oS(Q, a),
      analytics: ok({
        axiosClient: Q,
        serverUrl: o,
        appId: a,
        userAuthModule: ne,
      }),
      cleanup: () => {
        ;(se.analytics.cleanup(), E && E.disconnect())
      },
    },
    z = {
      entities: Ep({ axios: j, appId: a, getSocket: b }),
      integrations: _p(j, a),
      sso: nS(j, a, c),
      connectors: rS(j, a),
      functions: bp(K, a, {
        getAuthHeaders: () => {
          const le = {}
          return (f && (le.Authorization = `Bearer ${f}`), le)
        },
        baseURL: (s = K.defaults) === null || s === void 0 ? void 0 : s.baseURL,
      }),
      agents: Cp({ axios: j, getSocket: b, appId: a, serverUrl: o, token: c }),
      appLogs: Rp(j, a),
      cleanup: () => {
        E && E.disconnect()
      },
    }
  if (typeof window < "u") {
    const le = c || fl()
    le && se.auth.setToken(le)
  }
  return (
    h &&
      typeof window < "u" &&
      setTimeout(async () => {
        try {
          ;(await se.auth.isAuthenticated()) ||
            se.auth.redirectToLogin(window.location.href)
        } catch (le) {
          ;(console.error("Authentication check failed:", le),
            se.auth.redirectToLogin(window.location.href))
        }
      }, 0),
    {
      ...se,
      setToken(le) {
        ;(se.auth.setToken(le),
          E && E.updateConfig({ token: le }),
          (L.token = le))
      },
      getConfig() {
        return { serverUrl: o, appId: a, requiresAuth: h }
      },
      get asServiceRole() {
        if (!f)
          throw new Error(
            "Service token is required to use asServiceRole. Please provide a serviceToken when creating the client.",
          )
        return z
      },
    }
  )
}
const kg = typeof window > "u",
  gk = kg ? { localStorage: new Map() } : window,
  wi = gk.localStorage,
  yk = (r) => r.replace(/([A-Z])/g, "_$1").toLowerCase(),
  os = (r, { defaultValue: n = void 0, removeFromUrl: s = !1 } = {}) => {
    if (kg) return n
    const o = `base44_${yk(r)}`,
      a = new URLSearchParams(window.location.search),
      c = a.get(r)
    if (s) {
      a.delete(r)
      const h = `${window.location.pathname}${a.toString() ? `?${a.toString()}` : ""}${window.location.hash}`
      window.history.replaceState({}, document.title, h)
    }
    if (c) return (wi.setItem(o, c), c)
    if (n) return (wi.setItem(o, n), n)
    const f = wi.getItem(o)
    return f || null
  },
  vk = () => (
    os("clear_access_token") === "true" &&
      (wi.removeItem("base44_access_token"), wi.removeItem("token")),
    {
      appId: os("app_id", { defaultValue: "69c22093ca3b25a00f19aed0" }),
      token: os("access_token", { removeFromUrl: !0 }),
      fromUrl: os("from_url", { defaultValue: window.location.href }),
      functionsVersion: os("functions_version", { defaultValue: "prod" }),
      appBaseUrl: os("app_base_url", { defaultValue: void 0 }),
    }
  ),
  gi = { ...vk() },
  { appId: wk, token: xk, functionsVersion: Sk, appBaseUrl: kk } = gi,
  yi = mk({
    appId: wk,
    token: xk,
    functionsVersion: Sk,
    serverUrl: "",
    requiresAuth: !1,
    appBaseUrl: kk,
  })
function Ek({}) {
  var a
  const n = Mm().pathname.substring(1),
    { data: s, isFetched: o } = Cw({
      queryKey: ["user"],
      queryFn: async () => {
        try {
          return { user: await yi.auth.me(), isAuthenticated: !0 }
        } catch {
          return { user: null, isAuthenticated: !1 }
        }
      },
    })
  return R.jsx("div", {
    className: "min-h-screen flex items-center justify-center p-6 bg-slate-50",
    children: R.jsx("div", {
      className: "max-w-md w-full",
      children: R.jsxs("div", {
        className: "text-center space-y-6",
        children: [
          R.jsxs("div", {
            className: "space-y-2",
            children: [
              R.jsx("h1", {
                className: "text-7xl font-light text-slate-300",
                children: "404",
              }),
              R.jsx("div", { className: "h-0.5 w-16 bg-slate-200 mx-auto" }),
            ],
          }),
          R.jsxs("div", {
            className: "space-y-3",
            children: [
              R.jsx("h2", {
                className: "text-2xl font-medium text-slate-800",
                children: "Page Not Found",
              }),
              R.jsxs("p", {
                className: "text-slate-600 leading-relaxed",
                children: [
                  "The page ",
                  R.jsxs("span", {
                    className: "font-medium text-slate-700",
                    children: ['"', n, '"'],
                  }),
                  " could not be found in this application.",
                ],
              }),
            ],
          }),
          o &&
            s.isAuthenticated &&
            ((a = s.user) == null ? void 0 : a.role) === "admin" &&
            R.jsx("div", {
              className:
                "mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200",
              children: R.jsxs("div", {
                className: "flex items-start space-x-3",
                children: [
                  R.jsx("div", {
                    className:
                      "flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5",
                    children: R.jsx("div", {
                      className: "w-2 h-2 rounded-full bg-orange-400",
                    }),
                  }),
                  R.jsxs("div", {
                    className: "text-left space-y-1",
                    children: [
                      R.jsx("p", {
                        className: "text-sm font-medium text-slate-700",
                        children: "Admin Note",
                      }),
                      R.jsx("p", {
                        className: "text-sm text-slate-600 leading-relaxed",
                        children:
                          "This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          R.jsx("div", {
            className: "pt-6",
            children: R.jsxs("button", {
              onClick: () => (window.location.href = "/"),
              className:
                "inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
              children: [
                R.jsx("svg", {
                  className: "w-4 h-4 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: R.jsx("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                  }),
                }),
                "Go Home",
              ],
            }),
          }),
        ],
      }),
    }),
  })
}
const Eg = q.createContext(),
  _k = ({ children: r }) => {
    const [n, s] = q.useState(null),
      [o, a] = q.useState(!1),
      [c, f] = q.useState(!0),
      [h, m] = q.useState(!0),
      [g, y] = q.useState(null),
      [S, A] = q.useState(null)
    q.useEffect(() => {
      L()
    }, [])
    const L = async () => {
        var F, Q
      //   try {
      //     ;(m(!0), y(null))
      //     const B = pi({
      //       baseURL: "/api/apps/public",
      //       headers: { "X-App-Id": gi.appId },
      //       token: gi.token,
      //       interceptResponses: !0,
      //     })
      //     try {
      //       const j = await B.get(`/prod/public-settings/by-id/${gi.appId}`)
      //       ;(A(j), gi.token ? await E() : (f(!1), a(!1)), m(!1))
      //     } catch (j) {
      //       if (
      //         (console.error("App state check failed:", j),
      //         j.status === 403 &&
      //           (Q = (F = j.data) == null ? void 0 : F.extra_data) != null &&
      //           Q.reason)
      //       ) {
      //         const K = j.data.extra_data.reason
      //         y(
      //           K === "auth_required"
      //             ? {
      //                 type: "auth_required",
      //                 message: "Authentication required",
      //               }
      //             : K === "user_not_registered"
      //               ? {
      //                   type: "user_not_registered",
      //                   message: "User not registered for this app",
      //                 }
      //               : { type: K, message: j.message },
      //         )
      //       } else
      //         y({ type: "unknown", message: j.message || "Failed to load app" })
      //       ;(m(!1), f(!1))
      //     }
      //   } catch (B) {
      //     ;(console.error("Unexpected error:", B),
      //       y({
      //         type: "unknown",
      //         message: B.message || "An unexpected error occurred",
      //       }),
      //       m(!1),
      //       f(!1))
      //   }
      // },
      E = async () => {
        try {
          f(!0)
          const F = await yi.auth.me()
          ;(s(F), a(!0), f(!1))
        } catch (F) {
          ;(console.error("User auth check failed:", F),
            f(!1),
            a(!1),
            (F.status === 401 || F.status === 403) &&
              y({ type: "auth_required", message: "Authentication required" }))
        }
      },
      b = (F = !0) => {
        ;(s(null),
          a(!1),
          F ? yi.auth.logout(window.location.href) : yi.auth.logout())
      },
      w = () => {
        yi.auth.redirectToLogin(window.location.href)
      }
    return R.jsx(Eg.Provider, {
      value: {
        user: n,
        isAuthenticated: o,
        isLoadingAuth: c,
        isLoadingPublicSettings: h,
        authError: g,
        appPublicSettings: S,
        logout: b,
        navigateToLogin: w,
        checkAppState: L,
      },
      children: r,
    })
  },
  bk = () => {
    const r = q.useContext(Eg)
    if (!r) throw new Error("useAuth must be used within an AuthProvider")
    return r
  },
  Ck = () =>
    R.jsx("div", {
      className:
        "flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50",
      children: R.jsx("div", {
        className:
          "max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100",
        children: R.jsxs("div", {
          className: "text-center",
          children: [
            R.jsx("div", {
              className:
                "inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100",
              children: R.jsx("svg", {
                className: "w-8 h-8 text-orange-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: R.jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                }),
              }),
            }),
            R.jsx("h1", {
              className: "text-3xl font-bold text-slate-900 mb-4",
              children: "Access Restricted",
            }),
            R.jsx("p", {
              className: "text-slate-600 mb-8",
              children:
                "You are not registered to use this application. Please contact the app administrator to request access.",
            }),
            R.jsxs("div", {
              className: "p-4 bg-slate-50 rounded-md text-sm text-slate-600",
              children: [
                R.jsx("p", {
                  children: "If you believe this is an error, you can:",
                }),
                R.jsxs("ul", {
                  className: "list-disc list-inside mt-2 space-y-1",
                  children: [
                    R.jsx("li", {
                      children:
                        "Verify you are logged in with the correct account",
                    }),
                    R.jsx("li", {
                      children: "Contact the app administrator for access",
                    }),
                    R.jsx("li", {
                      children: "Try logging out and back in again",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    }),
  Rk = { wind: "12 knots SW", tide: "Incoming", visibility: "Excellent" }
function Tk() {
  const [r, n] = q.useState(!1),
    s = q.useRef(null)
  return (
    q.useEffect(() => {
      const o = setTimeout(() => n(!0), 100)
      return () => clearTimeout(o)
    }, []),
    R.jsxs("section", {
      ref: s,
      className: "relative w-full h-screen min-h-[600px] overflow-hidden",
      "aria-label": "Welcome to Almsford Aquatics",
      children: [
        R.jsxs("div", {
          className: "absolute inset-0",
          children: [
            R.jsx("img", {
              src: "https://media.base44.com/images/public/69c22093ca3b25a00f19aed0/09ad2203f_generated_image.png",
              alt: "Kayaker on the calm waters of Port Phillip Bay at sunrise",
              className: "w-full h-full object-cover object-center",
            }),
            R.jsx("div", { className: "absolute inset-0 image-scrim" }),
            R.jsx("div", {
              className:
                "absolute inset-0 bg-gradient-to-b from-bay-blue/40 via-transparent to-transparent",
            }),
          ],
        }),
        R.jsx("div", {
          className:
            "relative h-full flex flex-col justify-end pb-20 px-6 md:px-16 lg:px-24",
          children: R.jsxs("div", {
            className: `max-w-3xl transition-all duration-1000 ${r ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
            children: [
              R.jsx("p", {
                className:
                  "font-body text-sea-glass text-sm font-medium tracking-widest uppercase mb-4",
                children: "Port Phillip Bay · Melbourne",
              }),
              R.jsxs("h1", {
                className: "font-display text-salt-white leading-[0.9] mb-6",
                style: {
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  letterSpacing: "-0.04em",
                },
                children: ["Experience", R.jsx("br", {}), "the Bay"],
              }),
              R.jsx("p", {
                className:
                  "font-body text-white/80 text-lg md:text-xl max-w-xl mb-10 leading-relaxed",
                children:
                  "Ocean kayaking, scuba skills, and stand-up paddleboarding on Melbourne's beautiful Port Phillip Bay.",
              }),
              R.jsxs("div", {
                className: "flex flex-wrap gap-4",
                children: [
                  R.jsx("a", {
                    href: "#activities",
                    className:
                      "focus-ring rounded-full bg-sea-glass hover:bg-sea-glass/90 text-bay-blue font-display font-semibold text-base px-8 py-4 transition-all duration-200 hover:shadow-xl hover:scale-105 min-h-[52px] flex items-center",
                    children: "Explore Activities",
                  }),
                  R.jsx("a", {
                    href: "https://book.almsford.org",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className:
                      "focus-ring rounded-full border-2 border-white/60 hover:border-white text-salt-white font-display font-semibold text-base px-8 py-4 transition-all duration-200 hover:bg-white/10 min-h-[52px] flex items-center",
                    children: "Book a Session",
                  }),
                ],
              }),
            ],
          }),
        }),
        R.jsx("div", {
          className: `absolute bottom-8 right-6 md:right-16 transition-all duration-1000 delay-500 ${r ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`,
          children: R.jsxs("div", {
            className:
              "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 text-salt-white",
            children: [
              R.jsx("p", {
                className:
                  "text-xs font-body font-medium tracking-widest uppercase text-sea-glass mb-3",
                children: "Bay Conditions",
              }),
              R.jsx("div", {
                className: "flex flex-col gap-1.5",
                children: Object.entries(Rk).map(([o, a]) =>
                  R.jsxs(
                    "div",
                    {
                      className:
                        "flex items-center justify-between gap-6 text-sm",
                      children: [
                        R.jsx("span", {
                          className: "text-white/60 capitalize",
                          children: o,
                        }),
                        R.jsx("span", {
                          className: "font-semibold",
                          children: a,
                        }),
                      ],
                    },
                    o,
                  ),
                ),
              }),
            ],
          }),
        }),
        R.jsxs("div", {
          className:
            "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce",
          children: [
            R.jsx("div", { className: "w-px h-8 bg-white/30 rounded-full" }),
            R.jsx("span", {
              className: "text-xs font-body tracking-widest uppercase",
              children: "Scroll",
            }),
          ],
        }),
      ],
    })
  )
}
function Pk({ activity: r }) {
  const [n, s] = q.useState(!1)
  return R.jsxs("a", {
    href: r.bookUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className:
      "focus-ring group relative flex flex-col overflow-hidden rounded-[2.5rem] min-h-[520px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl",
    style: { minHeight: "520px" },
    onMouseEnter: () => s(!0),
    onMouseLeave: () => s(!1),
    "aria-label": `Book ${r.title} — ${r.price} per person`,
    children: [
      R.jsxs("div", {
        className: "absolute inset-0 overflow-hidden rounded-[2.5rem]",
        children: [
          R.jsx("img", {
            src: r.image,
            alt: r.title,
            className:
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
          }),
          R.jsx("div", { className: "absolute inset-0 image-scrim" }),
        ],
      }),
      R.jsx("div", {
        className: "relative z-10 p-6 flex justify-end",
        children: R.jsxs("div", {
          className:
            "bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-2 text-right",
          children: [
            R.jsx("p", {
              className:
                "font-display text-salt-white text-2xl font-semibold leading-none",
              children: r.price,
            }),
            R.jsx("p", {
              className: "font-body text-white/70 text-xs mt-0.5",
              children: r.priceNote,
            }),
          ],
        }),
      }),
      R.jsxs("div", {
        className: "relative z-10 mt-auto p-7 transition-all duration-500",
        children: [
          R.jsx("p", {
            className:
              "font-body text-sea-glass text-xs font-medium tracking-widest uppercase mb-2",
            children: r.subtitle,
          }),
          R.jsx("h3", {
            className: "font-display text-salt-white text-3xl mb-3",
            style: { letterSpacing: "-0.03em" },
            children: r.title,
          }),
          R.jsxs("div", {
            className: "overflow-hidden transition-all duration-500",
            style: { maxHeight: n ? "320px" : "0", opacity: n ? 1 : 0 },
            children: [
              R.jsx("p", {
                className:
                  "font-body text-white/80 text-sm leading-relaxed mb-4",
                children: r.description,
              }),
              R.jsx("ul", {
                className: "space-y-1.5 mb-6",
                children: r.details.map((o, a) =>
                  R.jsxs(
                    "li",
                    {
                      className:
                        "flex items-start gap-2 font-body text-white/70 text-sm",
                      children: [
                        R.jsx("span", {
                          className:
                            "mt-1.5 w-1.5 h-1.5 rounded-full bg-sea-glass flex-shrink-0",
                        }),
                        o,
                      ],
                    },
                    a,
                  ),
                ),
              }),
            ],
          }),
          R.jsxs("div", {
            className:
              "flex items-center gap-2 font-display font-semibold text-salt-white text-sm transition-all duration-300",
            style: { opacity: n ? 1 : 0.7 },
            children: [
              R.jsx("span", { children: "Book This Session" }),
              R.jsx(uc, { className: "w-4 h-4" }),
            ],
          }),
        ],
      }),
    ],
  })
}
const Nk = [
  {
    id: "kayaking",
    title: "Ocean Kayaking",
    subtitle: "Intro to Ocean Kayaking",
    description:
      "Discover the freedom of the open water. These monthly sessions are held at the Sandridge Life Saving Club, guided by an experienced life saver and rescue diver.",
    details: [
      "Monthly sessions at Sandridge LSC",
      "Kayak, paddle & lifevest hire included",
      "Perfect for all abilities",
      "You will get wet — wear a rashie & boardies",
    ],
    price: "$50",
    priceNote: "per person, all gear included",
    image:
      "https://media.base44.com/images/public/69c22093ca3b25a00f19aed0/1e92799eb_generated_image.png",
    bookUrl: "https://book.almsford.org",
    color: "#1A4B6E",
  },
  {
    id: "scuba",
    title: "Scuba Skills",
    subtitle: "Scuba Skills Practice",
    description:
      "Sharpen your underwater abilities on the Mornington Peninsula. Sessions are weather-dependent and offer structured skills practice in a safe, supervised environment.",
    details: [
      "Mornington Peninsula — location varies with conditions",
      "BYO wetsuit, gear & tanks",
      "Hire available at Xtreme Watersports",
      "Advanced buoyancy · Navigation · Obstacle courses",
    ],
    price: "$25",
    priceNote: "per person — BYO gear",
    image:
      "https://media.base44.com/images/public/69c22093ca3b25a00f19aed0/6889b8a2e_generated_image.png",
    bookUrl: "https://book.almsford.org",
    color: "#5A4A3B",
  },
  {
    id: "sup",
    title: "Stand-Up Paddleboarding",
    subtitle: "SUP Sessions",
    description:
      "Find your balance on the bay. Monthly SUP sessions at Sandridge LSC are a brilliant way to build core strength, improve balance, and connect with the ocean.",
    details: [
      "Monthly sessions at Sandridge LSC",
      "SUP board & paddle hire included",
      "Suitable for beginners",
      "You will get wet — wear a rashie & boardies",
    ],
    price: "$50",
    priceNote: "per person, all gear included",
    image:
      "https://media.base44.com/images/public/69c22093ca3b25a00f19aed0/559c45c79_generated_image.png",
    bookUrl: "https://book.almsford.org",
    color: "#7BB5B1",
  },
]
function Ok() {
  return R.jsx("section", {
    id: "activities",
    className: "bg-canvas py-32 px-6 md:px-12 lg:px-20",
    children: R.jsxs("div", {
      className: "max-w-7xl mx-auto",
      children: [
        R.jsxs("div", {
          className:
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 pb-10 border-b border-horizon",
          children: [
            R.jsxs("div", {
              children: [
                R.jsx("p", {
                  className:
                    "font-body text-sea-glass text-xs font-medium tracking-widest uppercase mb-3",
                  children: "What We Offer",
                }),
                R.jsxs("h2", {
                  className: "font-display text-bay-blue",
                  style: {
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    letterSpacing: "-0.04em",
                  },
                  children: ["Three ways to", R.jsx("br", {}), "meet the bay."],
                }),
              ],
            }),
            R.jsx("p", {
              className:
                "font-body text-driftwood text-base max-w-sm leading-relaxed",
              children:
                "All sessions are led by Mike — life saver, rescue diver, and coastguard crew. Safety is baked in from the start.",
            }),
          ],
        }),
        R.jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-3 gap-6",
          children: Nk.map((r) => R.jsx(Pk, { activity: r }, r.id)),
        }),
      ],
    }),
  })
}
function Ak({ group: r }) {
  const n = r.icon
  return R.jsxs("div", {
    className:
      "bg-white/8 border border-white/12 rounded-2xl p-5 backdrop-blur-sm",
    children: [
      R.jsxs("div", {
        className: "flex items-center gap-2 mb-4",
        children: [
          R.jsx("div", {
            className:
              "w-8 h-8 rounded-xl bg-sea-glass/20 flex items-center justify-center",
            children: R.jsx(n, { className: "w-4 h-4 text-sea-glass" }),
          }),
          R.jsx("p", {
            className:
              "font-display text-salt-white text-xs font-semibold tracking-wide uppercase",
            children: r.label,
          }),
        ],
      }),
      R.jsx("ul", {
        className: "space-y-2",
        children: r.items.map((s, o) =>
          R.jsxs(
            "li",
            {
              className:
                "flex items-start gap-2 font-body text-white/60 text-xs leading-relaxed",
              children: [
                R.jsx("span", {
                  className:
                    "mt-1.5 w-1 h-1 rounded-full bg-sea-glass flex-shrink-0",
                }),
                s,
              ],
            },
            o,
          ),
        ),
      }),
    ],
  })
}
const Lk = {
  lifesaving: {
    icon: Qv,
    label: "Life Saving",
    items: [
      "Apollo Bay SLSC — Volunteer",
      "Sandridge LSC — Volunteer",
      "St Kilda Coast Guard — Crew",
    ],
  },
  qualifications: {
    icon: Vv,
    label: "Qualifications",
    items: [
      "Bronze Medallion",
      "CPR & Advanced Resuscitation",
      "IRB Driver & Crew",
      "Trainer — Bronze & IRB Driver/Crew",
    ],
  },
  scuba: {
    icon: Kv,
    label: "Scuba Certifications",
    items: [
      "PADI Open Water Diver",
      "PADI Advanced Open Water",
      "PADI Rescue Diver",
      "PADI Dive Master",
    ],
  },
}
function jk() {
  return R.jsx("section", {
    id: "about-mike",
    className: "bg-bay-blue py-32 overflow-hidden",
    children: R.jsxs("div", {
      className: "max-w-7xl mx-auto px-6 md:px-12 lg:px-20",
      children: [
        R.jsx("p", {
          className:
            "font-body text-sea-glass text-xs font-medium tracking-widest uppercase mb-16",
          children: "Your Guide",
        }),
        R.jsxs("div", {
          className:
            "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",
          children: [
            R.jsxs("div", {
              className: "relative",
              children: [
                R.jsxs("div", {
                  className:
                    "relative overflow-hidden rounded-[2.5rem] aspect-[4/5]",
                  children: [
                    R.jsx("img", {
                      src: "https://media.base44.com/images/public/69c22093ca3b25a00f19aed0/4483d68ef_generated_image.png",
                      alt: "Mike — instructor and life saver at Almsford Aquatics",
                      className: "w-full h-full object-cover",
                    }),
                    R.jsx("div", {
                      className:
                        "absolute inset-0 bg-gradient-to-t from-bay-blue/30 via-transparent to-transparent",
                    }),
                  ],
                }),
                R.jsxs("div", {
                  className:
                    "absolute -bottom-6 -right-4 md:right-8 bg-sea-glass rounded-3xl px-7 py-5 shadow-2xl max-w-[220px]",
                  children: [
                    R.jsx("p", {
                      className:
                        "font-display text-bay-blue text-4xl font-bold leading-none",
                      children: "15+",
                    }),
                    R.jsx("p", {
                      className:
                        "font-body text-bay-blue/80 text-sm mt-1 leading-tight",
                      children: "Years in and around the water",
                    }),
                  ],
                }),
              ],
            }),
            R.jsxs("div", {
              children: [
                R.jsx("h2", {
                  className: "font-display text-salt-white mb-6",
                  style: {
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    letterSpacing: "-0.04em",
                  },
                  children: "Meet Mike.",
                }),
                R.jsx("p", {
                  className:
                    "font-body text-white/70 text-lg leading-relaxed mb-12 max-w-lg",
                  children:
                    "I spend a lot of time in and around the water — as a volunteer life saver, coastguard crew, and dive master. Every session I run is underpinned by real-world safety experience, so you can focus entirely on the adventure.",
                }),
                R.jsx("p", {
                  className:
                    "font-body text-white/60 text-base leading-relaxed mb-12 max-w-lg",
                  children:
                    "I have no formal qualifications for kayaking (there aren't any that I know of), but I have plenty of experience in a variety of — sometimes extreme — conditions.",
                }),
                R.jsx("div", {
                  className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                  children: Object.entries(Lk).map(([r, n]) =>
                    R.jsx(Ak, { group: n }, r),
                  ),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  })
}
function Ik() {
  return R.jsxs("footer", {
    className: "bg-canvas",
    children: [
      R.jsxs("div", {
        className:
          "relative overflow-hidden bg-bay-blue/5 border-t border-horizon py-40 px-6 text-center",
        children: [
          R.jsx("div", {
            className:
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sea-glass/5 pointer-events-none",
          }),
          R.jsx("div", {
            className:
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-sea-glass/5 pointer-events-none",
          }),
          R.jsxs("div", {
            className: "relative max-w-3xl mx-auto",
            children: [
              R.jsx("p", {
                className:
                  "font-body text-sea-glass text-xs font-medium tracking-widest uppercase mb-6",
                children: "Ready to go?",
              }),
              R.jsx("h2", {
                className: "font-display text-bay-blue mb-8",
                style: {
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                  letterSpacing: "-0.04em",
                },
                children: "Ready to get wet?",
              }),
              R.jsx("p", {
                className:
                  "font-body text-driftwood text-lg mb-12 max-w-lg mx-auto leading-relaxed",
                children:
                  "Browse all available sessions and secure your spot on Port Phillip Bay.",
              }),
              R.jsxs("a", {
                href: "https://book.almsford.org",
                target: "_blank",
                rel: "noopener noreferrer",
                className:
                  "focus-ring inline-flex items-center gap-3 bg-bay-blue hover:bg-bay-blue/90 text-salt-white font-display font-semibold text-lg px-10 py-5 rounded-full transition-all duration-200 hover:shadow-2xl hover:scale-105 min-h-[60px]",
                children: [
                  "Book a Session",
                  R.jsx(uc, { className: "w-5 h-5" }),
                ],
              }),
            ],
          }),
        ],
      }),
      R.jsxs("div", {
        className:
          "border-t border-horizon px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4",
        children: [
          R.jsxs("span", {
            className: "font-display text-bay-blue text-base font-semibold",
            children: [
              "Almsford ",
              R.jsx("span", {
                className: "text-sea-glass",
                children: "Aquatics",
              }),
            ],
          }),
          R.jsx("p", {
            className: "font-body text-driftwood/60 text-sm text-center",
            children: "Activities on Port Phillip Bay · Melbourne, Australia",
          }),
          R.jsxs("p", {
            className: "font-body text-driftwood/40 text-xs",
            children: ["© ", new Date().getFullYear(), " Almsford Aquatics"],
          }),
        ],
      }),
    ],
  })
}
function Dk() {
  const [r, n] = q.useState(!1)
  return (
    q.useEffect(() => {
      const s = () => n(window.scrollY > window.innerHeight * 0.6)
      return (
        window.addEventListener("scroll", s),
        () => window.removeEventListener("scroll", s)
      )
    }, []),
    R.jsx("div", {
      className: `fixed bottom-8 right-6 z-50 transition-all duration-500 ${r ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`,
      children: R.jsxs("a", {
        href: "https://book.almsford.org",
        target: "_blank",
        rel: "noopener noreferrer",
        className:
          "focus-ring flex items-center gap-2 bg-sea-glass hover:bg-sea-glass/90 text-bay-blue font-display font-semibold text-sm px-6 py-3.5 rounded-full shadow-2xl hover:shadow-sea-glass/30 transition-all duration-200 hover:scale-105 min-h-[52px]",
        "aria-label": "Book a session at book.almsford.org",
        children: ["Book a Session", R.jsx(uc, { className: "w-4 h-4" })],
      }),
    })
  )
}
function Fk() {
  const [r, n] = q.useState(!1)
  return (
    q.useEffect(() => {
      const s = () => n(window.scrollY > 60)
      return (
        window.addEventListener("scroll", s),
        () => window.removeEventListener("scroll", s)
      )
    }, []),
    R.jsx("header", {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${r ? "bg-bay-blue/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"}`,
      children: R.jsxs("div", {
        className: "max-w-7xl mx-auto px-6 flex items-center justify-between",
        children: [
          R.jsx("a", {
            href: "#",
            className: "focus-ring rounded-sm",
            children: R.jsxs("span", {
              className:
                "font-display text-xl font-semibold tracking-tight text-salt-white",
              children: [
                "Almsford ",
                R.jsx("span", {
                  className: "text-sea-glass",
                  children: "Aquatics",
                }),
              ],
            }),
          }),
          R.jsxs("nav", {
            className: "hidden md:flex items-center gap-8",
            children: [
              ["Activities", "About Mike"].map((s) =>
                R.jsx(
                  "a",
                  {
                    href: `#${s.toLowerCase().replace(" ", "-")}`,
                    className:
                      "font-body text-sm font-medium text-white/80 hover:text-salt-white transition-colors focus-ring rounded-sm",
                    children: s,
                  },
                  s,
                ),
              ),
              R.jsx("a", {
                href: "https://book.almsford.org",
                target: "_blank",
                rel: "noopener noreferrer",
                className:
                  "focus-ring rounded-full bg-sea-glass hover:bg-sea-glass/90 text-bay-blue font-semibold text-sm px-5 py-2.5 transition-all duration-200 hover:shadow-lg hover:scale-105 min-h-[44px] flex items-center",
                children: "Book Now",
              }),
            ],
          }),
          R.jsx("a", {
            href: "https://book.almsford.org",
            target: "_blank",
            rel: "noopener noreferrer",
            className:
              "md:hidden focus-ring rounded-full bg-sea-glass text-bay-blue font-semibold text-sm px-4 py-2 min-h-[44px] flex items-center",
            children: "Book Now",
          }),
        ],
      }),
    })
  )
}
function Uk() {
  return R.jsxs("div", {
    className: "min-h-screen bg-canvas font-body",
    children: [
      R.jsx(Fk, {}),
      R.jsx(Tk, {}),
      R.jsx(Ok, {}),
      R.jsx(jk, {}),
      R.jsx(Ik, {}),
      R.jsx(Dk, {}),
    ],
  })
}
const Mk = () => {
  const {
    isLoadingAuth: r,
    isLoadingPublicSettings: n,
    authError: s,
    navigateToLogin: o,
  } = bk()
  if (n || r)
    return R.jsx("div", {
      className: "fixed inset-0 flex items-center justify-center",
      children: R.jsx("div", {
        className:
          "w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin",
      }),
    })
  if (s) {
    if (s.type === "user_not_registered") return R.jsx(Ck, {})
    if (s.type === "auth_required") return (o(), null)
  }
  return R.jsxs(dx, {
    children: [
      R.jsx(Gu, { path: "/", element: R.jsx(Uk, {}) }),
      R.jsx(Gu, { path: "*", element: R.jsx(Ek, {}) }),
    ],
  })
}
function zk() {
  return R.jsx(_k, {
    children: R.jsxs(pw, {
      client: Rw,
      children: [R.jsx(px, { children: R.jsx(Mk, {}) }), R.jsx($0, {})],
    }),
  })
}
Ov.createRoot(document.getElementById("root")).render(R.jsx(zk, {}))
