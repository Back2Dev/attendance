;(() => {
  var e = {
      3096: (e, t, n) => {
        var o = "Expected a function",
          i = /^\s+|\s+$/g,
          r = /^[-+]0x[0-9a-f]+$/i,
          s = /^0b[01]+$/i,
          c = /^0o[0-7]+$/i,
          a = parseInt,
          u = "object" == typeof n.g && n.g && n.g.Object === Object && n.g,
          l = "object" == typeof self && self && self.Object === Object && self,
          d = u || l || Function("return this")(),
          f = Object.prototype.toString,
          p = Math.max,
          g = Math.min,
          v = function () {
            return d.Date.now()
          }
        function m(e, t, n) {
          var i,
            r,
            s,
            c,
            a,
            u,
            l = 0,
            d = !1,
            f = !1,
            m = !0
          if ("function" != typeof e) throw new TypeError(o)
          function _(t) {
            var n = i,
              o = r
            return ((i = r = void 0), (l = t), (c = e.apply(o, n)))
          }
          function M(e) {
            return ((l = e), (a = setTimeout(h, t)), d ? _(e) : c)
          }
          function j(e) {
            var n = e - u
            return void 0 === u || n >= t || n < 0 || (f && e - l >= s)
          }
          function h() {
            var e = v()
            if (j(e)) return O(e)
            a = setTimeout(
              h,
              (function (e) {
                var n = t - (e - u)
                return f ? g(n, s - (e - l)) : n
              })(e),
            )
          }
          function O(e) {
            return ((a = void 0), m && i ? _(e) : ((i = r = void 0), c))
          }
          function w() {
            var e = v(),
              n = j(e)
            if (((i = arguments), (r = this), (u = e), n)) {
              if (void 0 === a) return M(u)
              if (f) return ((a = setTimeout(h, t)), _(u))
            }
            return (void 0 === a && (a = setTimeout(h, t)), c)
          }
          return (
            (t = b(t) || 0),
            y(n) &&
              ((d = !!n.leading),
              (s = (f = "maxWait" in n) ? p(b(n.maxWait) || 0, t) : s),
              (m = "trailing" in n ? !!n.trailing : m)),
            (w.cancel = function () {
              ;(void 0 !== a && clearTimeout(a),
                (l = 0),
                (i = u = r = a = void 0))
            }),
            (w.flush = function () {
              return void 0 === a ? c : O(v())
            }),
            w
          )
        }
        function y(e) {
          var t = typeof e
          return !!e && ("object" == t || "function" == t)
        }
        function b(e) {
          if ("number" == typeof e) return e
          if (
            (function (e) {
              return (
                "symbol" == typeof e ||
                ((function (e) {
                  return !!e && "object" == typeof e
                })(e) &&
                  "[object Symbol]" == f.call(e))
              )
            })(e)
          )
            return NaN
          if (y(e)) {
            var t = "function" == typeof e.valueOf ? e.valueOf() : e
            e = y(t) ? t + "" : t
          }
          if ("string" != typeof e) return 0 === e ? e : +e
          e = e.replace(i, "")
          var n = s.test(e)
          return n || c.test(e)
            ? a(e.slice(2), n ? 2 : 8)
            : r.test(e)
              ? NaN
              : +e
        }
        e.exports = function (e, t, n) {
          var i = !0,
            r = !0
          if ("function" != typeof e) throw new TypeError(o)
          return (
            y(n) &&
              ((i = "leading" in n ? !!n.leading : i),
              (r = "trailing" in n ? !!n.trailing : r)),
            m(e, t, { leading: i, maxWait: t, trailing: r })
          )
        }
      },
      1891: (e, t, n) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.injectAll =
            t.Registry =
            t.sendLogMessage =
            t.sendMessage =
              void 0))
        const o = n(2204),
          i = n(4635),
          r = n(1492),
          s = (function () {
            try {
              return window.self !== window.top
            } catch (e) {
              return !0
            }
          })(),
          c = /(\S*) \(([^)]+)\)/
        t.sendMessage = (e, t) => {
          window.postMessage(
            { eventType: e, data: t, source: "meteor-devtools-evolved" },
            "*",
          )
        }
        const a = (e) => {
          ;(0, t.sendMessage)("console", { type: "info", message: e })
        }
        function u() {
          if (!window.__meteor_devtools_evolved) {
            if (s) return !1
            a(
              s
                ? `Initializing from iframe "${location.href}"...`
                : "Initializing on the main page...",
            )
            let e = 100,
              n = null
            function c() {
              ;(--e,
                "object" != typeof Meteor ||
                  window.__meteor_devtools_evolved ||
                  ((window.__meteor_devtools_evolved = !0),
                  (0, o.DDPInjector)(),
                  (0, i.MinimongoInjector)(),
                  (0, r.MeteorAdapter)(),
                  (window.__meteor_devtools_evolved_receiveMessage =
                    t.Registry.run.bind(t.Registry)),
                  a(`Initialized. Attempts: ${100 - e}.`)),
                0 === e &&
                  (clearInterval(n),
                  window.Meteor ||
                    a(
                      s
                        ? `Unable to find Meteor on iframe "${location.href}"`
                        : "Unable to find Meteor on the main page.",
                    )))
            }
            ;(c(), (n = window.setInterval(c, 10)))
          }
        }
        ;((t.sendLogMessage = (e) => {
          const n = ((e) => {
            var t
            const n = Error.stackTraceLimit
            try {
              Error.stackTraceLimit = e
              const o = new Error()
              return o.stack
                ? null === (t = null == o ? void 0 : o.stack) || void 0 === t
                  ? void 0
                  : t
                      .split("\n")
                      .map((e) => {
                        const t = c.exec(e)
                        return t
                          ? {
                              callee: null == t ? void 0 : t[1],
                              url: null == t ? void 0 : t[2],
                            }
                          : null
                      })
                      .filter(Boolean)
                : []
            } finally {
              Error.stackTraceLimit = n
            }
          })(15)
          ;(n && n.length && n.splice(0, 2),
            (0, t.sendMessage)(
              "ddp-event",
              Object.assign(Object.assign({}, e), {
                trace: n,
                host: location.host,
              }),
            ),
            '{"msg":"ping"}' !== e.content &&
              '{"msg":"pong"}' !== e.content &&
              (0, i.updateCollections)())
        }),
          (t.Registry = {
            subscriptions: [],
            register(e, t) {
              this.subscriptions.push({ eventType: e, handler: t })
            },
            run(e) {
              this.subscriptions.forEach(
                ({ eventType: t, handler: n }) =>
                  "meteor-devtools-evolved" === e.source &&
                  t === e.eventType &&
                  n(e),
              )
            },
          }),
          (t.injectAll = u),
          u())
      },
      9292: (e, t, n) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getSubscriptions = void 0))
        const o = n(4323),
          i = n(6942)
        t.getSubscriptions = () => {
          var e, t
          const n = (0, i.mapValues)(
            null !==
              (t =
                null ===
                  (e =
                    null === Meteor || void 0 === Meteor
                      ? void 0
                      : Meteor.connection) || void 0 === e
                  ? void 0
                  : e._subscriptions) && void 0 !== t
              ? t
              : {},
            (e) => (0, i.omit)(e, ["connection", "readyDeps"]),
          )
          return o.JSONUtils.stringify(n)
        }
      },
      2204: (e, t, n) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.DDPInjector = void 0))
        const o = n(1891),
          i = () => (Date.now() + Math.random()).toString(36),
          r = (e) => {
            const t = Meteor.connection._stream.send
            Meteor.connection._stream.send = function (...n) {
              ;(t.apply(this, n),
                e({
                  id: i(),
                  content: n[0],
                  isOutbound: !0,
                  timestamp: Date.now(),
                }))
            }
          }
        t.DDPInjector = () => {
          var e
          ;(r(o.sendLogMessage),
            (e = o.sendLogMessage),
            Meteor.connection._stream.on("message", (...t) => {
              e({
                id: i(),
                content: t[0],
                isInbound: !0,
                timestamp: Date.now(),
              })
            }))
        }
      },
      1492: (e, t, n) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.MeteorAdapter = void 0))
        const o = n(1891),
          i = n(9292),
          r = n(4323)
        t.MeteorAdapter = () => {
          ;(o.Registry.register("ddp-run-method", (e) => {
            const { method: t, params: n } = e.data
            Meteor.call(t, ...n)
          }),
            o.Registry.register("sync-subscriptions", () => {
              ;(0, o.sendMessage)("sync-subscriptions", {
                subscriptions: (0, i.getSubscriptions)(),
              })
            }),
            o.Registry.register("stats", () => {
              ;(0, o.sendMessage)("stats", {
                gitCommitHash: Meteor.gitCommitHash,
              })
            }),
            o.Registry.register("cache:clear", () => {
              ;(0, o.sendMessage)("cache:clear", {})
            }))
          const e = Mongo.Collection.prototype
          Object.entries(e).forEach(([t, n]) => {
            if (
              [
                "find",
                "findOne",
                "insert",
                "update",
                "upsert",
                "remove",
              ].includes(t) &&
              "function" == typeof n
            ) {
              const n = e[t]
              e[t] = function (...e) {
                const i = Date.now(),
                  s = n.apply(this, e)
                return (
                  (0, o.sendMessage)("meteor-data-performance", {
                    collectionName: this._name,
                    key: t,
                    args: JSON.stringify(e, r.JSONUtils.getCircularReplacer()),
                    runtime: Date.now() - i,
                  }),
                  s
                )
              }
            }
          })
        }
      },
      4635: function (e, t, n) {
        "use strict"
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.MinimongoInjector = t.updateCollections = void 0))
        const i = n(1205),
          r = n(1891),
          s = o(n(3096))
        const c = (e) => {
            if ("object" != typeof e) return e
            const t = ((n = e), JSON.parse(JSON.stringify(n)))
            var n
            return t
              ? (Object.keys(t).forEach((e) => {
                  if (t[e] && "object" == typeof t[e]) {
                    if (
                      (function (e) {
                        return Array.isArray(e)
                      })(t[e])
                    )
                      return void (t[e] = t[e].map((e) => c(e)))
                    if (t[e] instanceof Date)
                      return void (t[e] =
                        `[Object::${t[e].constructor.name}] ${t[e].toISOString()}`)
                    if ("Object" !== t[e].constructor.name)
                      return "function" == typeof t[e].toString
                        ? void (t[e] =
                            `[Object::${t[e].constructor.name}] ${t[e].toString()}`)
                        : void (t[e] = `[Object::${t[e].constructor.name}]`)
                    t[e] = c(t[e])
                  }
                }),
                t)
              : t
          },
          a = (e) => {
            var t
            return e._docs._map instanceof Map
              ? (null === (t = e._docs._map) || void 0 === t
                  ? void 0
                  : t.values()) || []
              : Object.values(e._docs._map || {})
          },
          u = () => {
            const e = Meteor.connection._mongo_livedata_collections
            if (!e)
              return void (0, i.warning)(
                "Collections not initialized in the client yet. Possibly forgotten to be imported.",
              )
            const t = Object.values(e).reduce(
              (e, t) => Object.assign(e, { [t.name]: Array.from(a(t)).map(c) }),
              {},
            )
            ;(0, r.sendMessage)("minimongo-get-collections", t)
          }
        t.updateCollections = (0, s.default)(u, 100, {
          leading: !0,
          trailing: !0,
        })
        t.MinimongoInjector = () => {
          r.Registry.register("minimongo-get-collections", () => {
            u()
          })
        }
      },
      1205: (e, t) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.warning = void 0))
        t.warning = (e) => {
          console.log(
            "%c".concat("Meteor DevTools Evolved: ").concat(e),
            "color: #bada55",
          )
        }
      },
      4323: (e, t) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.JSONUtils = void 0),
          (function (e) {
            ;((e.getCircularReplacer = () => {
              const e = new WeakSet()
              return (t, n) => {
                if ("object" == typeof n && null !== n) {
                  if (e.has(n)) return
                  e.add(n)
                }
                return n
              }
            }),
              (e.stringify = (t) => JSON.stringify(t, e.getCircularReplacer())))
          })(t.JSONUtils || (t.JSONUtils = {})))
      },
      6942: (e, t) => {
        "use strict"
        ;(Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.isUndefined =
            t.isNil =
            t.compact =
            t.flatten =
            t.mapValues =
            t.omit =
            t.isObject =
              void 0))
        ;((t.isObject = (e) => "object" == typeof e),
          (t.omit = function (e, t) {
            return Object.keys(e).reduce(
              (n, o) => (t.includes(o) || (n[o] = e[o]), n),
              {},
            )
          }),
          (t.mapValues = function (e, t) {
            return Object.keys(e).reduce((n, o) => ((n[o] = t(e[o], o)), n), {})
          }),
          (t.flatten = function (e) {
            return e.reduce((e, t) => e.concat(t), [])
          }),
          (t.compact = function (e) {
            return e.filter(Boolean)
          }))
        t.isNil = (e) => null == e
        t.isUndefined = (e) => void 0 === e
      },
    },
    t = {}
  function n(o) {
    var i = t[o]
    if (void 0 !== i) return i.exports
    var r = (t[o] = { exports: {} })
    return (e[o].call(r.exports, r, r.exports, n), r.exports)
  }
  n.g = (function () {
    if ("object" == typeof globalThis) return globalThis
    try {
      return this || new Function("return this")()
    } catch (e) {
      if ("object" == typeof window) return window
    }
  })()
  n(1891)
})()
