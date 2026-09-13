(globalThis.webpackChunkextract_css = globalThis.webpackChunkextract_css || []).push([
    ["36796"], {
        275763: (function(t) {
            "use strict";
            t.exports = {}
        }),
        317386: (function(t, T, r) {
            "use strict";
            var c = r(548374),
                n = r.n(c),
                a = r(821379);
            YUI.add("squarespace-debugger", function(e) {
                e.namespace("Squarespace");
                var h = e.Squarespace.Legacy.Class;
                e.Squarespace.Debugger = h.create({
                    defaultOpts: {
                        output: !0,
                        ignore: [],
                        name: "GenericComponent"
                    },
                    initialize: function(i) {
                        if (this.params = e.merge(this.defaultOpts, i), a.Z.isProductionEnvironment() && (this.params.output = !1), this.params.uid && (this.params.name += " #" + this.getUID()), this.params.logEvents) {
                            var f = this;
                            this.params.logEvents.fire = function(m) {
                                f.log("Firing", m), e.EventTarget.prototype.fire.apply(f.params.logEvents, arguments)
                            }
                        }
                        this.logEnabled = this.params.output
                    },
                    enable: function() {
                        this.params.output = !0
                    },
                    disable: function() {
                        this.params.output = !1
                    },
                    isInfoEnabled: function() {
                        return e.Lang.isBoolean(this.params.output) ? this.params.output : !1
                    },
                    info: function() {
                        return this.log.apply(this, arguments)
                    },
                    log: function() {
                        if (this.params.output && !(this.params.ignore.indexOf(arguments[0]) >= 0)) {
                            var i = Array.prototype.slice.call(arguments),
                                f = "[" + this.params.name + "]";
                            typeof i[0] == "string" ? i[0] = f + " " + i[0] : i.unshift(f), console.log && (e.UA.ios ? console.log(i.join(" ")) : console.log.apply ? console.log.apply(console, i) : console.log(i))
                        }
                    },
                    error: function() {
                        var i = Array.prototype.slice.call(arguments),
                            f = i[i.length - 1];
                        f instanceof Error && i.pop(), i.unshift(this.params.name), e.UA.ios && (i = [i.join(" ")]), console.error && (e.UA.ios ? console.error(i.join(" ")) : console.error.apply ? console.error.apply(console, i) : console.error(i));
                        var m;
                        f && f instanceof Error ? (m = f.stack, console.error("Stack: " + m)) : console.trace && console.trace(), n().trackCaughtError("damask", i[0], m)
                    },
                    warn: function() {
                        var i = Array.prototype.slice.call(arguments),
                            f = "[" + this.params.name + "]";
                        typeof i[0] == "string" ? i[0] = f + " " + i[0] : i.unshift(f), console.warn && (e.UA.ios ? console.warn(i.join(" ")) : console.warn.apply ? console.warn.apply(console, i) : console.warn(i))
                    },
                    isTimingEnabled: function() {
                        return !!this.params.output
                    },
                    getUID: function() {
                        return e.Squarespace.Debugger.lastUID[this.params.name] === void 0 && (e.Squarespace.Debugger.lastUID[this.params.name] = 0), e.Squarespace.Debugger.lastUID[this.params.name]++
                    },
                    time: function(i) {
                        this.params.output && console.time && console.time("[" + this.params.name + "] " + i)
                    },
                    timeEnd: function(i) {
                        this.params.output && console.timeEnd && console.timeEnd("[" + this.params.name + "] " + i)
                    }
                }), e.Squarespace.Debugger.lastUID = {}
            }, "1.0", {
                requires: ["squarespace-legacy-class", "squarespace-util"]
            })
        }),
        767483: (function(t, T, r) {
            "use strict";
            var c = r(923781),
                n = r(305354),
                a = r(911163),
                e = r.n(a),
                h = r(907294),
                i = r.n(h),
                f = r(665005),
                m = r(275763),
                _ = r.n(m);
            YUI.add("squarespace-search-preview", function(u) {
                u.namespace("Squarespace");
                var l = 38,
                    d = 40,
                    p = 13,
                    E = 27,
                    A = "/search",
                    s = 200,
                    g = function(o) {
                        var S = u.QueryString.stringify(o);
                        S !== "" ? document.location.href = A + "?" + S : document.location.href = A
                    },
                    v = u.Base.create("searchPreviewDropdown", u.Squarespace.Widgets.SSWidget, [u.WidgetPosition], {
                        renderUI: function() {
                            v.superclass.renderUI.apply(this, arguments);
                            var o = this.get("contentBox"),
                                S = this.get("searchInput").get("offsetWidth");
                            o.addClass("sqs-search-preview-ui"), o.setStyle("width", S), o.setContent(v.TEMPLATE), this._startScrollCheckTimer(), this._close(), this._showImages = S >= s, this._showImages || o.addClass("no-image"), this._resizeEmitter = new u.Squarespace.ResizeEmitter({
                                timeout: 100
                            }), this.get("contentBox").one(".sqs-search-ui-list").plug(u.Plugin.ScrollInfo)
                        },
                        bindUI: function() {
                            v.superclass.bindUI.apply(this, arguments), this.after("searchInputChange", this._bindInputEvents, this), this._bindInputEvents()
                        },
                        _bindInputEvents: function() {
                            var o = this.get("searchInput"),
                                S = this.get("contentBox");
                            u.Lang.isValue(o) && (o.after("typing", this._onTyping, this), o.after("click", this._onSearchClick, this), o.after("searchQueryChange", this._onSearchQueryChange, this), o.after("searchQueryChange", this._trackOnQueryChange, this), o.after("focus", this._show, this), o.after("blur", this._onBlur, this)), this.after(this.get("id") + "|resultItemsChange", this._onSearchResultChange, this), this.after(this.get("id") + "|loadingChange", this.syncUI, this), S.on(this.get("id") + "|hover", this._onHover, this._onMouseLeave, this), S.delegate(this.get("id") + "|click", this._onResultClick, ".sqs-search-ui-list .search-result", this), S.delegate(this.get("id") + "|hover", this._onResultHover, ".sqs-search-ui-list .search-result", this), this._resizeEmitter.after("resize", this._ajustDropdownPosition, this)
                        },
                        syncUI: function() {
                            v.superclass.syncUI.apply(this, arguments);
                            var o = this.get("searchInput"),
                                S = this.get("contentBox"),
                                y = this.get("page"),
                                b = o.getY() + o.get("offsetHeight");
                            this.move(o.getX(), b);
                            var L = u.Node.create(u.Squarespace.UITemplates.render(v.TEMPLATE_RESULTS_NAME, this._getSearchDataModel()));
                            if (this._showImages && this._loadImages(L), this._toggleNotice(L), this._toggleLoader(), !!u.Lang.isValue(L)) {
                                var D = S.one(".sqs-search-ui-result .search-results"),
                                    C = L.all(".search-result");
                                if (y === 0) D.setContent(L);
                                else if (u.Lang.isValue(C)) {
                                    var R = D.get("children").size(),
                                        q = L.get("children");
                                    q = q.splice(R), D.append(q)
                                }
                                var w = S.one(".sqs-search-ui-list");
                                u.Lang.isValue(w) && w.plug(u.Squarespace.Plugin.ScrollLock)
                            }
                        },
                        destructor: function() {
                            u.Lang.isValue(this.scrollTimer) && this.scrollTimer.cancel(), this._resizeEmitter && this._resizeEmitter.destroy(), this._spinner && this._spinner.remove(!0)
                        },
                        _getSearchDataModel: function(o) {
                            var S = this.get("resultItems"),
                                y = {
                                    loading: this.get("loading"),
                                    items: S,
                                    itemsCount: this.get("totalCount")
                                };
                            return y
                        },
                        _loadImages: function(o) {
                            u.Lang.isValue(o) && o.all("img[data-src]").each(function(S) {
                                ImageLoader.load(S)
                            })
                        },
                        _toggleNotice: function(o) {
                            var S = this.get("contentBox").one(".search-result-notice"),
                                y = !u.Lang.isValue(o);
                            if (S.toggleClass("hide", !y), y) {
                                var b = this.get("contentBox").one(".sqs-search-ui-result .search-results");
                                b.empty(), this._itemSelected = null, S.setContent(this.get("strings.notice"))
                            }
                        },
                        _toggleLoader: function() {
                            var o = this.get("searchInput"),
                                S = o.previous(".spinner-wrapper"),
                                y = u.Lang.isValue(this.get("loading")) && this.get("loading");
                            y && !S.hasChildNodes() && (this._spinner = new u.Squarespace.Spinner({
                                color: this.get("theme"),
                                size: "default",
                                render: S
                            })), o.toggleClass("loading", y), S.toggleView(y)
                        },
                        isOpened: function() {
                            return this._opened
                        },
                        hasItemSelected: function() {
                            var o = this.get("contentBox");
                            return u.Lang.isValue(o.one(".sqs-search-ui-list .search-result.selected"))
                        },
                        _close: function() {
                            var o = this.get("contentBox");
                            u.Lang.isValue(this.scrollTimer) && this.scrollTimer.cancel(), u.Lang.isValue(this._itemSelected) && this._itemSelected.removeClass("selected"), this._itemSelected = null, o.hide(), this._opened = !1
                        },
                        _show: function() {
                            !u.Lang.isValue(this.get("resultItems")) || this.get("searchInput").get("value") === "" || (this.get("contentBox").show(), this._startScrollCheckTimer(), this._opened = !0)
                        },
                        _search: function() {
                            var o = this.get("searchInput"),
                                S = o.get("value"),
                                y = this.get("page"),
                                b = 3;
                            if (!(!u.Lang.isValue(S) || S.length < b)) {
                                this.set("loading", !0);
                                var L = {
                                        q: S,
                                        p: y,
                                        size: this.get("perPage")
                                    },
                                    D = this.get("collectionFilter");
                                u.Lang.isValue(D) && D !== "" && (L.f_collectionId = D), u.Data.get({
                                    url: "/api/search/GeneralSearch",
                                    data: L,
                                    success: this._searchResultCallback,
                                    failure: this._searchResultCallbackError
                                }, this)
                            }
                        },
                        _searchResultCallback: function(o) {
                            this.set("loading", !1), this.set("facets", o.facets), this.set("totalCount", o.totalCount);
                            var S = this.get("resultItems"),
                                y = this.get("page");
                            u.Lang.isValue(o.serviceError) || (y > 0 && u.Lang.isValue(S) ? (S = S.concat(o.items), this.set("resultItems", S)) : this.set("resultItems", o.items))
                        },
                        _searchResultCallbackError: function() {
                            this.set("loading", !1)
                        },
                        _onSearchResultChange: function(o) {
                            this.syncUI(), this._show()
                        },
                        _onSearchQueryChange: function(o) {
                            this.get("searchInput").get("value") === "" && (this.set("loading", !1), this.isOpened() && this._close()), this._clearResult(), this._search()
                        },
                        _trackOnQueryChange: function() {
                            var o = this.get("searchInput").get("value");
                            if (o !== "") {
                                var S = [],
                                    y = this.get("collectionFilter");
                                u.Lang.isValue(y) && S.push(y), f.j(e().SITE_SEARCH, {
                                    query: o,
                                    filters: {
                                        collectionIds: S
                                    },
                                    referrer: u.config.doc.location.href
                                })
                            }
                        },
                        _onSearchClick: function(o) {
                            u.later(1, this, function() {
                                this.get("searchInput").get("value") === "" && this.isOpened() && (this.set("loading", !1), this._close())
                            })
                        },
                        _clearResult: function() {
                            this.set("resultItems", null), this.set("page", 0)
                        },
                        _onTyping: function(o) {
                            if (o.keyCode === p && this._onEnter(), this.isOpened()) switch (o.keyCode) {
                                case d:
                                    this._moveSelectedItem(1);
                                    break;
                                case l:
                                    this._moveSelectedItem(-1);
                                    break
                            }
                        },
                        _moveSelectedItem: function(o) {
                            var S = this.get("contentBox").all(".search-result");
                            if (u.Lang.isValue(S)) {
                                var y = o < 0 ? S.size() - 1 : 0;
                                if (u.Lang.isValue(this._itemSelected)) {
                                    this._itemSelected.removeClass("selected");
                                    var b = S.indexOf(this._itemSelected),
                                        L = S.item(b + o);
                                    u.Lang.isValue(L) ? this._itemSelected = L.addClass("selected") : this._itemSelected = S.item(y).addClass("selected")
                                } else this._itemSelected = S.item(y).addClass("selected");
                                this._scrollTo(this._itemSelected, o)
                            }
                        },
                        _scrollTo: function(o, S) {
                            var y = this.get("contentBox").one(".sqs-search-ui-list"),
                                b = y.one(".search-results").get("children"),
                                L = b.indexOf(o);
                            switch (L) {
                                case 0:
                                    y.set("scrollTop", 0);
                                    break;
                                case b.size() - 1:
                                    y.set("scrollTop", y.scrollInfo.getScrollInfo().scrollHeight);
                                    break;
                                default:
                                    y.set("scrollTop", o.getY() - y.getY() + y.get("scrollTop"));
                                    break
                            }
                        },
                        _onResultHover: function(o) {
                            u.Lang.isValue(this._itemSelected) && this._itemSelected.removeClass("selected"), this._itemSelected = o.target.ancestor(".search-result", !0)
                        },
                        _onHover: function(o) {
                            this._isHovered = !0
                        },
                        _onMouseLeave: function() {
                            this._itemSelected = null, this._isHovered = !1
                        },
                        _onEnter: function() {
                            this._redirect(this._itemSelected)
                        },
                        _onBlur: function(o) {
                            o.halt(), this._isHovered || (this.get("searchInput").blur(), this._close())
                        },
                        _getSearchResultObject: function(o) {
                            var S = this.get("resultItems");
                            return u.Array.find(S, function(y) {
                                return y.id === o
                            })
                        },
                        _onResultClick: function(o) {
                            o.halt();
                            var S = o.target,
                                y = "search-result",
                                b = S.hasClass(y),
                                L = b ? S : S.ancestor("." + y);
                            this._trackSearchHelper(L), this._redirect(L)
                        },
                        _trackSearchHelper: function(o) {
                            var S = o.getAttribute("itemid"),
                                y = this.get("resultItems");
                            if (!i()(y)) {
                                for (var b, L, D, C = 0; C < y.length; C++)
                                    if (y[C].id === S) {
                                        b = y[C].title.replace(/<(.|\n)*?>/g, ""), L = y[C].categories, D = y[C].tags;
                                        break
                                    }
                                n.U3({
                                    content_name: b,
                                    content_category: L,
                                    content_tag: D,
                                    search_string: this.get("searchInput").get("value")
                                })
                            }
                        },
                        _redirect: function(o) {
                            if (!u.Lang.isValue(this._itemSelected)) {
                                g(this._getQueryStringObject());
                                return
                            }
                            var S = o.getAttribute("itemid");
                            if (u.Lang.isValue(S)) {
                                var y = this._getSearchResultObject(S);
                                this._close(), document.location.href = y.itemUrl + "?" + u.QueryString.stringify({
                                    rq: this.get("searchInput").get("value")
                                })
                            }
                        },
                        _getQueryStringObject: function() {
                            var o = {};
                            this.get("searchInput").get("value") !== "" && (o.q = this.get("searchInput").get("value"));
                            var S = this.get("collectionFilter");
                            return u.Lang.isValue(S) && (o.f_collectionId = S), o
                        },
                        _nextPage: function() {
                            var o = this.get("page") + 1;
                            this.set("page", o), this._search()
                        },
                        _infiniteScroll: function() {
                            var o = this.get("contentBox").one(".sqs-search-ui-list");
                            if (u.Lang.isValue(o)) {
                                var S = o.get("scrollHeight"),
                                    y = o.get("scrollTop"),
                                    b = o.get("offsetHeight"),
                                    L = S - b - y,
                                    D = this.get("resultItems"),
                                    C = this.get("totalCount");
                                u.Lang.isValue(D) && L < 100 && C > D.length && this._nextPage()
                            }
                        },
                        _startScrollCheckTimer: function(o) {
                            u.Lang.isValue(this.scrollTimer) && this.scrollTimer.cancel(), o = o || 250, this.scrollTimer = u.later(o, this, this._infiniteScroll, {}, !0)
                        },
                        _ajustDropdownPosition: function() {
                            var o = this.get("searchInput");
                            if (u.Lang.isValue(o.getDOMNode())) {
                                var S = o.getY() + o.get("offsetHeight");
                                this.get("contentBox").setStyle("width", o.get("offsetWidth")), this.move(o.getX(), S)
                            }
                        }
                    }, {
                        TEMPLATE_RESULTS_NAME: "search-result.html",
                        TEMPLATE: '<div class="sqs-search-preview-ui"><div class="sqs-search-ui-result"><div class="search-result-notice hide"></div><div class="sqs-search-ui-list"><div class="search-results"></div></div></div></div>',
                        ATTRS: {
                            strings: {
                                value: {
                                    notice: (0, c.t)("No results found.", null, {
                                        project: "website.search"
                                    })
                                }
                            },
                            searchInput: {
                                validator: u.Squarespace.AttrValidators.isNode
                            },
                            resultItems: {
                                validator: u.Squarespace.AttrValidators.isNullOrArray
                            },
                            totalCount: {
                                value: 0,
                                validator: u.Squarespace.AttrValidators.isNumber
                            },
                            page: {
                                value: 0,
                                validator: u.Squarespace.AttrValidators.isNumber
                            },
                            collectionFilter: {
                                validator: u.Squarespace.AttrValidators.isNullOrString
                            },
                            displayDelay: {
                                value: 1e3,
                                validator: u.Squarespace.AttrValidators.isNumber
                            },
                            perPage: {
                                value: 10,
                                validator: u.Squarespace.AttrValidators.isNumber
                            },
                            loading: {
                                value: !1,
                                validator: u.Squarespace.AttrValidators.isBoolean
                            },
                            theme: {
                                value: "dark",
                                validator: u.Squarespace.AttrValidators.isString
                            }
                        }
                    }),
                    I = u.namespace("Squarespace.Widgets").SearchPreview = u.Base.create("SearchPreview", u.Squarespace.SSWidget, [], {
                        initializer: function(o) {
                            var S = this.get("render");
                            this._searchInput = S.one(".search-input"), this.set("collection", S.getData("collection")), this.set("previewEnabled", S.getData("preview") === "true");
                            var y = S.get("className").match(/color-(.*)/);
                            u.Lang.isValue(y) && this.set("theme", y[1])
                        },
                        destructor: function() {
                            u.Lang.isValue(this._searchTypingTimeout) && this._searchTypingTimeout.cancel()
                        },
                        renderUI: function() {
                            I.superclass.renderUI.call(this), this._alterSearchInputStyle(), this.get("previewEnabled") && this._initPreview()
                        },
                        bindUI: function() {
                            this._searchInput.on("keyup", this._onKeyUp, this), this._searchInput.on("keydown", function(o) {
                                o.keyCode === E && o.preventDefault()
                            })
                        },
                        _onKeyUp: function(o) {
                            if (u.Lang.isValue(this.previewWidget)) {
                                if (u.Lang.isValue(this._searchTypingTimeout) && this._searchTypingTimeout.cancel(), o.keyCode === E && this.previewWidget.isOpened()) {
                                    this.previewWidget._close(), o.stopPropagation();
                                    return
                                }
                                var S = {
                                    keyCode: o.keyCode
                                };
                                this._searchInput.fire("typing", S), this._searchInput.get("value") !== this._prevVal && (this._searchTypingTimeout = u.later(this.previewWidget.get("displayDelay"), this, function() {
                                    this._searchInput.fire("searchQueryChange"), this._prevVal = this._searchInput.get("value")
                                }))
                            } else o.keyCode === p && g(this._getQueryStringObject())
                        },
                        _getQueryStringObject: function() {
                            var o = {},
                                S = this._searchInput.get("value");
                            return u.Lang.isValue(this._searchInput) && S !== "" && (o.q = S), this._appendCollectionFilter(o, "f_collectionId")
                        },
                        _initPreview: function() {
                            var o = {
                                searchInput: this._searchInput,
                                theme: this.get("theme")
                            };
                            this.previewWidget = new v(this._appendCollectionFilter(o, "collectionFilter")), this.previewWidget.render()
                        },
                        _appendCollectionFilter: function(o, S) {
                            var y = this.get("collection");
                            return u.Lang.isValue(y) && y !== "" && (o[S] = y), o
                        },
                        _alterSearchInputStyle: function() {
                            u.UA.safari && !u.UA.ios ? this._searchInput.setStyle("paddingRight", "0") : u.UA.safari && u.UA.ios ? this._searchInput.setAttribute("type", "text") : (!u.UA.chrome || !u.UA.ios) && this._searchInput.addClass("hover-effect")
                        }
                    }, {
                        CSS_PREFIX: "sqs-search-preview",
                        renderAllSearchPreviewNodes: function() {
                            u.all(".sqs-search-ui-text-input:not(.sqs-search-wrapper .sqs-search-ui-text-input)").each(function(o) {
                                !u.Widget.getByNode(o.one("." + u.Squarespace.Widgets.SearchPreview.CSS_PREFIX)) && u.Lang.isValue(o.one(".search-input")) && new u.Squarespace.Widgets.SearchPreview({
                                    render: o
                                })
                            })
                        }
                    });
                u.config.win.Squarespace.onInitialize(u, function() {
                    u.Squarespace.Widgets.SearchPreview.renderAllSearchPreviewNodes()
                })
            }, "1.0", {
                requires: ["base", "datasource", "event", "node-scroll-info", "squarespace-animations", "squarespace-dom-emitters-resize", "squarespace-plugin-scroll-lock", "squarespace-search-result-template", "squarespace-spinner", "squarespace-ss-widget", "squarespace-ui-templates", "widget", "widget-position"]
            })
        }),
        787633: (function() {
            YUI.add("squarespace-ss-widget", function(t) {
                t.namespace("Squarespace.Widgets");
                var T = t.Squarespace.Widgets.SSWidget = t.Squarespace.SSWidget = t.Base.create("ssWidget", t.Widget, [], {
                    delegatedEvents: {},
                    initializer: function(r) {
                        this.LOG = new t.Squarespace.Debugger({
                            name: this.name,
                            output: !1
                        }), this._anims = new t.Squarespace.Anims, this.on("classNameChange", function(c) {
                            var n = this.get("boundingBox");
                            n && n.removeClass(c.prevVal).addClass(c.newVal)
                        }, this), this._events = [], this._timers = []
                    },
                    destroy: function(r) {
                        if (!t.Lang.isBoolean(r) && !this.get("destroyed")) {
                            var c = this.get("boundingBox"),
                                n = this.get("contentBox");
                            c && c._node && n && n._node ? r = !0 : this.LOG.error("This widget's elements was improperly cleaned up!")
                        }
                        T.superclass.destroy.call(this, r)
                    },
                    destructor: function() {
                        for (this._anims.destroy(), t.detach(this.get("id") + "|*"), this.detach(this.get("id") + "|*"); this._events.length !== 0;) this._events.shift().detach();
                        for (; this._timers.length !== 0;) this._timers.shift().cancel();
                        this._anims = null, this._timers = [], this._events = [], this.LOG = null
                    },
                    _registerEvent: function() {
                        if (t.Lang.isArray(arguments[0])) this._registerEvent.apply(this, arguments[0]);
                        else
                            for (var r = 0, c = arguments.length; r < c; r++) t.Lang.isValue(arguments[r]) && this._events.push(arguments[r])
                    },
                    _registerPointerEvent: function(r, c, n, a) {
                        var e = t.Squarespace.Utils._attachPointerAction(r, c, n, a);
                        this._registerEvent(e)
                    },
                    _registerAnim: function(r) {
                        this._anims.add(r)
                    },
                    _registerCallback: function(r, c) {
                        return t.bind(function() {
                            this.get("destroyed") || r.apply(c || this, arguments)
                        }, this)
                    },
                    _registerTimer: function(r) {
                        return this._timers.push(r), r
                    },
                    renderUI: function() {
                        var r = this.get("className");
                        this.get("boundingBox").addClass(r), this.get("preventRenderTemplate") || this.get("contentBox").prepend(this.renderTemplate())
                    },
                    bindUI: function() {
                        var r = this.get("id");
                        this.after(r + "|stringsChange", function(n) {
                            n.noSyncUI || this.syncUI()
                        }, this);
                        var c = this.get("boundingBox");
                        t.Object.each(this.delegatedEvents, function(n, a) {
                            t.Object.each(n, function(e, h) {
                                c.delegate(r + "|" + h, this[e], a, this)
                            }, this)
                        }, this)
                    },
                    syncUI: function() {},
                    _getTemplateInfo: function() {
                        var r = T.TEMPLATE_TYPES,
                            c = !1,
                            n = this.constructor,
                            a, e, h, i, f = function() {
                                h = n.HANDLEBARS_TEMPLATE, e = n.TEMPLATE, c = t.Lang.isValue(h), i = c ? r.HANDLEBARS : r.HTML
                            };
                        for (f(); t.Lang.isUndefined(h) && t.Lang.isUndefined(e);) n = n.superclass.constructor, f();
                        return c ? a = t.Squarespace.UITemplates.getCompiledTemplate(h) : a = function() {
                            return t.Node.create(e)
                        }, {
                            type: i,
                            template: a
                        }
                    },
                    renderTemplate: function() {
                        var r = T.TEMPLATE_TYPES,
                            c = this._getTemplateInfo();
                        if (c.type === r.HANDLEBARS) {
                            var n = this._getHBTemplateContext();
                            return c.template(n)
                        }
                        return c.template()
                    },
                    getProperty: function(r) {
                        for (var c = this.constructor, n = this.constructor[r]; t.Lang.isUndefined(n) && c.superclass;) {
                            c = c.superclass.constructor;
                            if (t.Lang.isUndefined(c)) break;
                            n = c[r]
                        }
                        return n
                    },
                    _getHBTemplateContext: function() {
                        return this.getAttrs()
                    }
                }, {
                    CSS_PREFIX: "sqs-widget",
                    HANDLEBARS_TEMPLATE: null,
                    TEMPLATE: "",
                    TEMPLATE_TYPES: {
                        HANDLEBARS: "handlebars",
                        HTML: "html"
                    },
                    ATTRS: {
                        className: {
                            value: null
                        },
                        preventRenderTemplate: {
                            value: !1,
                            validator: t.Squarespace.AttrValidators.isBoolean
                        }
                    }
                })
            }, "1.0", {
                requires: ["base", "node", "squarespace-anims", "squarespace-attr-validators", "squarespace-debugger", "squarespace-template-helpers", "squarespace-ui-templates", "squarespace-util", "widget"]
            })
        }),
        265504: (function(t, T, r) {
            "use strict";
            var c = r(448720),
                n = r(417633),
                a = r.n(n),
                e = r(923781),
                h = r(571133);
            const i = l => l.topLeftAverage && l.topRightAverage && l.bottomLeftAverage && l.bottomRightAverage && l.centerAverage ? ` data-color-topleft="#${l.topLeftAverage}"
  data-color-topright="#${l.topRightAverage}"
  data-color-bottomleft="#${l.bottomLeftAverage}"
  data-color-bottomright="#${l.bottomRightAverage}"
  data-color-center="#${l.centerAverage}" ` : "",
                f = l => l.replace(/<(?:.|\n)*?>/gm, ""),
                m = function() {
                    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                    return l.title && l.title.length > 0 ? l.title : l.body && l.body.length > 0 ? f(l.body) : l.filename && l.filename.length > 0 ? l.filename : ""
                },
                u = {
                    video: l => ({
                        name: "video",
                        func: function(p, E, A) {
                            const s = p.oembed || {},
                                {
                                    assetUrl: g,
                                    colorData: v,
                                    mediaFocalPoint: I
                                } = p;
                            let o = !1,
                                S = !1;
                            if (A)
                                for (let D = 0; D < A.length; D++) {
                                    const C = A[D];
                                    C === "load-false" ? o = !0 : C === "color-data" && (S = !0)
                                }
                            const y = o ? 'data-load="false" ' : "",
                                b = l.Squarespace.Escaping.escapeForHtmlTag(s.html ? ? "");
                            let L = `<div class="sqs-video-wrapper"
      ${y}
      data-html="${b}"
      data-provider-name="${s.providerName}">`;
                            if (p.overlay) {
                                let D = '<div class="sqs-video-overlay';
                                p.mainImageId || p.systemDataId ? (D += '" style="opacity: 0;">', D += '<img data-load="false" data-image="' + g + '" data-src="' + g + '" data-image-dimensions="' + (p.originalSize || "") + '" data-image-focal-point="' + (I ? I.x + "," + I.y : "0.5,0.5") + '" ', S && v && (D += i(v)), D += "/>") : D += ' no-thumb" style="opacity: 0;">', D += '<div class="sqs-video-opaque"></div><div class="sqs-video-icon"></div>', D += "</div>", L += D
                            }
                            return L += "</div>", L
                        }
                    })
                };
            YUI.add("squarespace-template-helpers", function(l) {
                var d = {
                        get: function(s, g) {
                            return typeof s.get == "function" ? s.get(g) : s[g]
                        }
                    },
                    p = {
                        html: l.Squarespace.Escaping.escapeForHtml,
                        htmltag: l.Squarespace.Escaping.escapeForHtmlTag,
                        htmlattr: l.Squarespace.Escaping.escapeForHtmlTag,
                        str: function(s) {
                            if (s === null || typeof s > "u") return "";
                            try {
                                return s.toString()
                            } catch {
                                return "[JSONT: Can't format variable as string (typeof: " + typeof s + ").]"
                            }
                        },
                        raw: function(s) {
                            return s
                        },
                        capitalize: function(s) {
                            return s.toUpperCase()
                        },
                        safe: function(s) {
                            return s ? s.replace(/<.*?>/g, "") : ""
                        },
                        json: function(s) {
                            return l.JSON.stringify(s).replace(/<\/script>/g, '</scr"+"ipt>')
                        },
                        "json-pretty": function(s) {
                            return l.JSON.stringify(s, null, 2).replace(/<\/script>/g, '</scr"+"ipt>')
                        },
                        smartypants: function(s) {
                            return s = s.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018"), s = s.replace(/'/g, "\u2019"), s = s.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201C"), s = s.replace(/"/g, "\u201D"), s = s.replace(/--/g, "\u2014"), s
                        },
                        slugify: function(s) {
                            return s ? s.replace(/[^\-a-zA-Z0-9\s]+/ig, "").replace(/\s/g, "-").toLowerCase() : ""
                        },
                        "url-encode": function(s) {
                            return encodeURIComponent(s)
                        },
                        "activate-twitter-links": function(s) {
                            var g = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
                                v = /(^| )@([a-zA-Z0-9_]+)/ig,
                                I = /(^| )#([a-zA-Z0-9_]+)/ig;
                            return s.replace(g, '<a target="new" href="$1">$1</a>').replace(v, '$1<a target="new" href="http://www.twitter.com/$2/">@$2</a>').replace(I, function(o) {
                                return '<a target="new" href="http://www.twitter.com/search/' + encodeURIComponent(o) + '">' + o + "</a>"
                            })
                        },
                        count: function(g) {
                            var v = g.length;
                            if (!l.Lang.isValue(v) && typeof g == "object") {
                                v = 0;
                                for (var I in g) Object.prototype.hasOwnProperty.call(g, I) && v++
                            }
                            return v || 0
                        },
                        "audio-player": function(s) {
                            return `<script>Y.use('squarespace-audio-player-frontend');<\/script><div class="squarespace-audio-player" data-audio-asset-url="` + s.structuredContent.audioAssetUrl + '" data-item-id="' + s.id + '" id="audio-player-' + s.id + '"></div>'
                        },
                        "social-button": function(s, g) {
                            var v = g._LookUpStack("website"),
                                I = s.systemDataId || s.mainImageId || "",
                                o = s.assetUrl || (s.mainImage ? s.mainImage.assetUrl : "") || "";
                            if (v && v.shareButtonOptions && Object.keys(v.shareButtonOptions).length !== 0) return `<script>Y.use('squarespace-social-buttons');<\/script><div class="squarespace-social-buttons button-style" data-system-data-id="` + I + '" data-asset-url="' + o + '" data-record-type="' + s.recordType + '" data-full-url="' + s.fullUrl + '" data-title="' + l.Squarespace.Escaping.escapeForHtmlTag(s.title) + '"></div>'
                        },
                        "social-button-inline": function(s, g) {
                            var v = g._LookUpStack("website"),
                                I = s.systemDataId || s.mainImageId || "",
                                o = s.assetUrl || (s.mainImage ? s.mainImage.assetUrl : "") || "";
                            if (v && v.shareButtonOptions && Object.keys(v.shareButtonOptions).length !== 0) return `<script>Y.use('squarespace-social-buttons');<\/script><span class="squarespace-social-buttons inline-style" data-system-data-id="` + I + '" data-asset-url="' + o + '" data-record-type="' + s.recordType + '" data-full-url="' + s.fullUrl + '" data-title="' + l.Squarespace.Escaping.escapeForHtmlTag(s.title) + '"></span>'
                        },
                        "twitter-follow-button": function(s) {
                            var g = s.userName || s.profileUrl.split("/").pop();
                            return (0, c.Z)(`<script>Y.use('squarespace-follow-buttons', function(Y) { Y.on('domready', function() { Y.Squarespace.FollowButtonUtils.renderAll(); }); });<\/script><div class="squarespace-follow-button" data-username="{userName}"></div>`, {
                                userName: g
                            })
                        },
                        comments: function(s, g) {
                            var v = g._LookUpStack("websiteSettings");
                            return v && v.disqusShortname ? '<div class="squarespace-comments" id="disqus_thread"></div>' : '<div class="squarespace-comments" id="comments-' + s.id + '"></div>'
                        },
                        "comment-link": function(s, g) {
                            var v = g._LookUpStack("websiteSettings");
                            return v && v.disqusShortname ? '<a href="' + s.fullUrl + '" class="sqs-comment-link sqs-disqus-comment-link" data-id="' + s.id + '"></a>' : '<a href="' + s.fullUrl + "#comments-" + s.id + '" class="sqs-comment-link" data-id="' + s.id + '">' + s.publicCommentCount === 0 ? (0, e.t)("No", null, {
                                project: "website.comments"
                            }) : (0, e._6)({
                                one: "{%n} Comment",
                                other: "{%n} Comments"
                            }, s.publicCommentCount, null, {
                                project: "website.comments",
                                notes: "oldKey: publicCommentCount"
                            }) + "</a>"
                        },
                        "like-button": function(s, g) {
                            var v = g._LookUpStack("websiteSettings");
                            if (v && v.simpleLikingEnabled) return '<span class="sqs-simple-like" data-item-id="' + s.id + '" data-like-count="' + s.likeCount + '"><span class="like-icon"></span><span class="like-count"></span></span>'
                        },
                        "comment-count": function(s) {
                            var g = s.publicCommentCount;
                            return g === 0 ? (0, e.t)("No Comment", null, {
                                project: "website.comments"
                            }) : (0, e._6)({
                                one: "{%n} Comment",
                                other: "{%n} Comments"
                            }, g, null, {
                                project: "website.comments",
                                notes: "oldKey: commentsCount"
                            })
                        },
                        "image-meta": function(s) {
                            if (s) {
                                var g = "0.5,0.5";
                                s.mediaFocalPoint && (g = s.mediaFocalPoint.x + "," + s.mediaFocalPoint.y);
                                var v = m(s);
                                return v && (v = l.Squarespace.Escaping.escapeForHtmlTag(v)), 'data-image="' + s.assetUrl + '" data-src="' + s.assetUrl + '" data-image-dimensions="' + (s.originalSize || "") + '" data-image-focal-point="' + g + '" alt="' + v + '" '
                            }
                        },
                        height: function(s) {
                            var g = s.split("x");
                            if (g.length !== 2) return "Invalid source parameter.  Pass in 'originalSize'.";
                            var v = parseInt(g[1], 10);
                            return v
                        },
                        width: function(s) {
                            var g = s.split("x");
                            if (g.length !== 2) return "Invalid source parameter.  Pass in 'originalSize'.";
                            var v = parseInt(g[0], 10);
                            return v
                        },
                        "percentage-format": function(s) {
                            var g = s.toFixed(3),
                                v = g.length;
                            return g.charAt(v - 1) === "0" ? g.substring(0, v - 1) : g
                        },
                        AbsUrl: function(s, g) {
                            return d.get("base-url") + "/" + s
                        },
                        "item-classes": function(s, g) {
                            g.hash && (g = this);
                            var v = ["hentry"],
                                I = d.get(g, "promotedBlockType");
                            I && (v.push("promoted"), v.push(p.slugify("promoted-block-" + I)));
                            var o = d.get(g, "categories");
                            if (o)
                                for (var S = 0; S < o.length; S++) v.push(p.slugify("category-" + o[S]));
                            var y = d.get(g, "tags");
                            if (y)
                                for (var b = 0; b < y.length; b++) v.push(p.slugify("tag-" + y[b]));
                            var L = d.get(g, "author");
                            return L && L.displayName && v.push(p.slugify("author-" + L.displayName)), v.push("post-type-" + d.get(g, "recordTypeLabel")), v.push("article-index-" + d.get(g, "@index")), d.get(g, "starred") && v.push("featured"), s.recordType === a().STORE_ITEM && l.Squarespace.Commerce.onSale(s) && v.push("on-sale"), v.join(" ")
                        },
                        round: function(s, g, v) {
                            return Math.round(parseFloat(s))
                        },
                        iter: function(s) {
                            return d.get(s, "@index")
                        },
                        "product-status": function(s) {
                            if (l.Squarespace.Commerce.soldOut(s)) return '<div class="product-mark sold-out">sold out</div>';
                            if (l.Squarespace.Commerce.onSale(s)) return '<div class="product-mark sale">sale</div>'
                        },
                        "money-string": function(s) {
                            return l.Squarespace.Commerce.moneyString(s)
                        },
                        "product-price": function(s) {
                            return '<div class="product-price">' + l.Squarespace.Commerce.priceString(s) + "</div>"
                        },
                        "from-price": function(s) {
                            return l.Squarespace.Commerce.fromPrice(s)
                        },
                        "normal-price": function(s) {
                            return l.Squarespace.Commerce.normalPrice(s)
                        },
                        "sale-price": function(s) {
                            return l.Squarespace.Commerce.salePrice(s)
                        },
                        "variant-descriptor": function(s) {
                            return l.Squarespace.Commerce.variantFormat(s)
                        },
                        "color-weight": function(s) {
                            return s && s.length > 0 && s.length <= 7 ? (s = s.replace("#", ""), parseInt(s, 16) > 16777215 / 2 ? "light" : "dark") : ""
                        },
                        "summary-form-field": function(s) {
                            return l.Squarespace.Commerce.summaryFormFieldString(s)
                        },
                        timesince: function(s) {
                            if (!l.Lang.isNumber(s)) return "Invalid date.";
                            var g = (0, h.Z)(s).capitalize();
                            return '<span class="timesince" data-date="' + s + '">' + g + "</span>"
                        },
                        pluralize: function(s, g) {
                            var v, I;
                            switch (g.length) {
                                case 0:
                                    v = "", I = "s";
                                    break;
                                case 1:
                                    v = "", I = g[0];
                                    break;
                                case 2:
                                    v = g[0], I = g[1];
                                    break;
                                default:
                                    throw new Error("pluralize got too many args")
                            }
                            return s === 1 ? v : I
                        }
                    },
                    E = [{
                        name: "output",
                        func: function(s, g, v) {
                            return v.join(" ")
                        }
                    }, u.video(l), {
                        name: "image-color",
                        func: function(s, g, v) {
                            var I = "";
                            if (s.colorData)
                                if (v.length > 0) {
                                    var o = s.colorData[v[0] + "Average"];
                                    o ? v.length === 2 ? I = v[1] + ": #" + o : I = "#" + o : I = (0, c.Z)("{sub1} not found: valid position-- topLeft, topRight, bottomLeft, bottomRight, center", {
                                        sub1: v[0]
                                    })
                                } else I = i(s.colorData);
                            return I
                        }
                    }, {
                        name: "child-image-meta",
                        func: function(s, g, v) {
                            var I = s.items[v && v[0] ? v[0] : 0],
                                o = "0.5,0.5";
                            I.mediaFocalPoint && (o = I.mediaFocalPoint.x + "," + I.mediaFocalPoint.y);
                            var S = m(I);
                            return S && (S = l.Squarespace.Escaping.escapeForHtmlTag(S)), 'data-image="' + I.assetUrl + '" data-src="' + I.assetUrl + '" data-image-dimensions="' + (I.originalSize || "") + '" data-image-focal-point="' + o + '" alt="' + S + '" '
                        }
                    }],
                    A = {
                        debug: function() {
                            return function(s) {
                                var g = `DEBUG:
========================
`;
                                return g += JSON.stringify(this || s, null, 2), g += `END DEBUG:
========================
`, g
                            }
                        },
                        withUniqueId: function(s) {
                            var g;
                            return s.data && (g = l.Handlebars.createFrame(s.data), g.uniqueId = l.guid()), s.fn(this, {
                                data: g
                            })
                        }
                    };
                l.namespace("Squarespace"), l.Squarespace.HANDLEBARS_HELPERS = A, l.Squarespace.TEMPLATE_FORMATTERS = p, l.Squarespace.TEMPLATE_PREFIX_FORMATTERS = E, Object.keys(l.Squarespace.TEMPLATE_FORMATTERS).forEach(function(s) {
                    l.Handlebars.registerHelper(s, function(g) {
                        return l.Squarespace.TEMPLATE_FORMATTERS[s].apply(this, [this].concat(Array.prototype.slice.call(arguments)))
                    })
                }), Object.keys(l.Squarespace.HANDLEBARS_HELPERS).forEach(function(s) {
                    l.Handlebars.registerHelper(s, l.Squarespace.HANDLEBARS_HELPERS[s])
                })
            }, "1.0", {
                requires: ["handlebars-base", "json", "squarespace-commerce-utils", "squarespace-escaping-utils", "substitute"]
            })
        }),
        806806: (function() {
            YUI.add("squarespace-ui-templates", function(t) {
                var T = t.Base.create("UITemplates", t.Base, [], {
                    render: function(r, c) {
                        var n = this.getCompiledTemplate(r);
                        if (!n) throw new Error(this.name + ": Could not find UITemplate by the name of: " + r + ". Recompile templates?");
                        return n(c || {})
                    },
                    renderAsNodeOrDocFrag: function(r, c) {
                        return t.Node.create(this.render(r, c))
                    },
                    getCompiledTemplate: function(r) {
                        var c = this.get("compiledTemplates")[r];
                        if (!c) throw new Error(this.name + ": A template by the name " + r + " does not exist.");
                        return c
                    }
                }, {
                    ATTRS: {
                        compiledTemplates: {
                            readOnly: !0,
                            getter: function() {
                                var r = t.Handlebars.templates;
                                if (!t.Lang.isObject(r)) throw new Error(this.name + ": No templates are available. Have you loaded your template module?");
                                return r
                            }
                        }
                    }
                });
                t.namespace("Squarespace").UITemplates = new T
            }, "1.0", {
                requires: ["base", "handlebars-base"]
            })
        }),
        404832: (function() {
            YUI.add("cache-base", function(t, T) {
                var r = t.Lang,
                    c = t.Lang.isDate,
                    n = function() {
                        n.superclass.constructor.apply(this, arguments)
                    };
                t.mix(n, {
                    NAME: "cache",
                    ATTRS: {
                        max: {
                            value: 0,
                            setter: "_setMax"
                        },
                        size: {
                            readOnly: !0,
                            getter: "_getSize"
                        },
                        uniqueKeys: {
                            value: !1
                        },
                        expires: {
                            value: 0,
                            validator: function(a) {
                                return t.Lang.isDate(a) || t.Lang.isNumber(a) && a >= 0
                            }
                        },
                        entries: {
                            readOnly: !0,
                            getter: "_getEntries"
                        }
                    }
                }), t.extend(n, t.Base, {
                    _entries: null,
                    initializer: function(a) {
                        this.publish("add", {
                            defaultFn: this._defAddFn
                        }), this.publish("flush", {
                            defaultFn: this._defFlushFn
                        }), this._entries = []
                    },
                    destructor: function() {
                        this._entries = []
                    },
                    _setMax: function(a) {
                        var e = this._entries;
                        if (a > 0) {
                            if (e)
                                for (; e.length > a;) e.shift()
                        } else a = 0, this._entries = [];
                        return a
                    },
                    _getSize: function() {
                        return this._entries.length
                    },
                    _getEntries: function() {
                        return this._entries
                    },
                    _defAddFn: function(a) {
                        var e = this._entries,
                            h = a.entry,
                            i = this.get("max"),
                            f;
                        for (this.get("uniqueKeys") && (f = this._position(a.entry.request), r.isValue(f) && e.splice(f, 1)); i && e.length >= i;) e.shift();
                        e[e.length] = h
                    },
                    _defFlushFn: function(a) {
                        var e = this._entries,
                            h = a.details[0],
                            i;
                        h && r.isValue(h.request) ? (i = this._position(h.request), r.isValue(i) && e.splice(i, 1)) : this._entries = []
                    },
                    _isMatch: function(a, e) {
                        return !e.expires || new Date < e.expires ? a === e.request : !1
                    },
                    _position: function(a) {
                        var e = this._entries,
                            h = e.length,
                            i = h - 1;
                        if (this.get("max") === null || this.get("max") > 0) {
                            for (; i >= 0; i--)
                                if (this._isMatch(a, e[i])) return i
                        }
                        return null
                    },
                    add: function(a, e) {
                        var h = this.get("expires");
                        this.get("initialized") && (this.get("max") === null || this.get("max") > 0) && (r.isValue(a) || r.isNull(a) || r.isUndefined(a)) && this.fire("add", {
                            entry: {
                                request: a,
                                response: e,
                                cached: new Date,
                                expires: c(h) ? h : h ? new Date(new Date().getTime() + this.get("expires")) : null
                            }
                        })
                    },
                    flush: function(a) {
                        this.fire("flush", {
                            request: r.isValue(a) ? a : null
                        })
                    },
                    retrieve: function(a) {
                        var e = this._entries,
                            h = e.length,
                            i = null,
                            f;
                        return h > 0 && (this.get("max") === null || this.get("max") > 0) && (this.fire("request", {
                            request: a
                        }), f = this._position(a), r.isValue(f)) ? (i = e[f], this.fire("retrieve", {
                            entry: i
                        }), f < h - 1 && (e.splice(f, 1), e[e.length] = i), i) : null
                    }
                }), t.Cache = n
            }, "3.17.2", {
                requires: ["base"]
            })
        }),
        278813: (function() {
            YUI.add("dataschema-array", function(t, T) {
                var r = t.Lang,
                    c = {
                        apply: function(n, a) {
                            var e = a,
                                h = {
                                    results: [],
                                    meta: {}
                                };
                            return r.isArray(e) ? n && r.isArray(n.resultFields) ? h = c._parseResults.call(this, n.resultFields, e, h) : h.results = e : h.error = new Error("Array schema parse failure"), h
                        },
                        _parseResults: function(n, a, e) {
                            var h = [],
                                i, f, m, _, u, l, d, p;
                            for (d = a.length - 1; d > -1; d--) {
                                if (i = {}, f = a[d], m = r.isObject(f) && !r.isFunction(f) ? 2 : r.isArray(f) ? 1 : r.isString(f) ? 0 : -1, m > 0)
                                    for (p = n.length - 1; p > -1; p--) _ = n[p], u = r.isUndefined(_.key) ? _ : _.key, l = r.isUndefined(f[u]) ? f[p] : f[u], i[u] = t.DataSchema.Base.parse.call(this, l, _);
                                else m === 0 ? i = f : i = null;
                                h[d] = i
                            }
                            return e.results = h, e
                        }
                    };
                t.DataSchema.Array = t.mix(c, t.DataSchema.Base)
            }, "3.17.2", {
                requires: ["dataschema-base"]
            })
        }),
        116455: (function() {
            YUI.add("dataschema-base", function(t, T) {
                var r = t.Lang,
                    c = {
                        apply: function(n, a) {
                            return a
                        },
                        parse: function(n, a) {
                            if (a.parser) {
                                var e = r.isFunction(a.parser) ? a.parser : t.Parsers[a.parser + ""];
                                e && (n = e.call(this, n))
                            }
                            return n
                        }
                    };
                t.namespace("DataSchema").Base = c, t.namespace("Parsers")
            }, "3.17.2", {
                requires: ["base"]
            })
        }),
        330615: (function() {
            YUI.add("dataschema-json", function(t, T) {
                var r = t.Lang,
                    c = r.isFunction,
                    n = r.isObject,
                    a = r.isArray,
                    e = t.DataSchema.Base,
                    h;
                h = {
                    getPath: function(i) {
                        var f = null,
                            m = [],
                            _ = 0;
                        if (i)
                            for (i = i.replace(/\[\s*(['"])(.*?)\1\s*\]/g, function(u, l, d) {
                                    return m[_] = d, ".@" + _++
                                }).replace(/\[(\d+)\]/g, function(u, l) {
                                    return m[_] = parseInt(l, 10) | 0, ".@" + _++
                                }).replace(/^\./, ""), f = i.split("."), _ = f.length - 1; _ >= 0; --_) f[_].charAt(0) === "@" && (f[_] = m[parseInt(f[_].substr(1), 10)]);
                        return f
                    },
                    getLocationValue: function(i, f) {
                        for (var m = 0, _ = i.length; m < _; m++)
                            if (n(f) && i[m] in f) f = f[i[m]];
                            else {
                                f = void 0;
                                break
                            }
                        return f
                    },
                    apply: function(i, f) {
                        var m = f,
                            _ = {
                                results: [],
                                meta: {}
                            };
                        if (!n(f)) try {
                            m = t.JSON.parse(f)
                        } catch (u) {
                            return _.error = u, _
                        }
                        return n(m) && i ? (_ = h._parseResults.call(this, i, m, _), i.metaFields !== void 0 && (_ = h._parseMeta(i.metaFields, m, _))) : _.error = new Error("JSON schema parse failure"), _
                    },
                    _parseResults: function(i, f, m) {
                        var _ = h.getPath,
                            u = h.getLocationValue,
                            l = _(i.resultListLocator),
                            d = l ? u(l, f) || f[i.resultListLocator] : f;
                        return a(d) ? a(i.resultFields) ? m = h._getFieldValues.call(this, i.resultFields, d, m) : m.results = d : i.resultListLocator && (m.results = [], m.error = new Error("JSON results retrieval failure")), m
                    },
                    _getFieldValues: function(i, f, m) {
                        var _ = [],
                            u = i.length,
                            l, d, p, E, A, s, g, v, I = [],
                            o = [],
                            S = [],
                            y, b;
                        for (l = 0; l < u; l++) p = i[l], E = p.key || p, A = p.locator || E, s = h.getPath(A), s && (s.length === 1 ? I.push({
                            key: E,
                            path: s[0]
                        }) : o.push({
                            key: E,
                            path: s,
                            locator: A
                        })), g = c(p.parser) ? p.parser : t.Parsers[p.parser + ""], g && S.push({
                            key: E,
                            parser: g
                        });
                        for (l = f.length - 1; l >= 0; --l)
                            if (b = {}, y = f[l], y) {
                                for (d = o.length - 1; d >= 0; --d) {
                                    if (s = o[d], v = h.getLocationValue(s.path, y), v === void 0 && (v = h.getLocationValue([s.locator], y), v !== void 0)) {
                                        I.push({
                                            key: s.key,
                                            path: s.locator
                                        }), o.splice(l, 1);
                                        continue
                                    }
                                    b[s.key] = e.parse.call(this, h.getLocationValue(s.path, y), s)
                                }
                                for (d = I.length - 1; d >= 0; --d) s = I[d], b[s.key] = e.parse.call(this, y[s.path] === void 0 ? y[d] : y[s.path], s);
                                for (d = S.length - 1; d >= 0; --d) E = S[d].key, b[E] = S[d].parser.call(this, b[E]), b[E] === void 0 && (b[E] = null);
                                _[l] = b
                            }
                        return m.results = _, m
                    },
                    _parseMeta: function(i, f, m) {
                        if (n(i)) {
                            var _, u;
                            for (_ in i) i.hasOwnProperty(_) && (u = h.getPath(i[_]), u && f && (m.meta[_] = h.getLocationValue(u, f)))
                        } else m.error = new Error("JSON meta data retrieval failure");
                        return m
                    }
                }, t.DataSchema.JSON = t.mix(h, e)
            }, "3.17.2", {
                requires: ["dataschema-base", "json"]
            })
        }),
        295265: (function() {
            YUI.add("dataschema-text", function(t, T) {
                var r = t.Lang,
                    c = r.isString,
                    n = r.isUndefined,
                    a = {
                        apply: function(e, h) {
                            var i = h,
                                f = {
                                    results: [],
                                    meta: {}
                                };
                            return c(h) && e && c(e.resultDelimiter) ? f = a._parseResults.call(this, e, i, f) : f.error = new Error("Text schema parse failure"), f
                        },
                        _parseResults: function(e, h, i) {
                            var f = e.resultDelimiter,
                                m = c(e.fieldDelimiter) && e.fieldDelimiter,
                                _ = e.resultFields || [],
                                u = [],
                                l = t.DataSchema.Base.parse,
                                d, p, E, A, s, g, v, I, o;
                            if (h.slice(-f.length) === f && (h = h.slice(0, -f.length)), d = h.split(e.resultDelimiter), m)
                                for (I = d.length - 1; I >= 0; --I) {
                                    for (E = {}, A = d[I], p = A.split(e.fieldDelimiter), o = _.length - 1; o >= 0; --o) s = _[o], g = n(s.key) ? s : s.key, v = n(p[g]) ? p[o] : p[g], E[g] = l.call(this, v, s);
                                    u[I] = E
                                } else u = d;
                            return i.results = u, i
                        }
                    };
                t.DataSchema.Text = t.mix(a, t.DataSchema.Base)
            }, "3.17.2", {
                requires: ["dataschema-base"]
            })
        }),
        600534: (function() {
            YUI.add("dataschema-xml", function(t, T) {
                var r = t.Lang,
                    c = {
                        1: !0,
                        9: !0,
                        11: !0
                    },
                    n;
                n = {
                    apply: function(a, e) {
                        var h = e,
                            i = {
                                results: [],
                                meta: {}
                            };
                        return h && c[h.nodeType] && a ? (i = n._parseResults(a, h, i), i = n._parseMeta(a.metaFields, h, i)) : i.error = new Error("XML schema parse failure"), i
                    },
                    _getLocationValue: function(a, e) {
                        var h = a.locator || a.key || a,
                            i = e.ownerDocument || e,
                            f, m, _ = null;
                        try {
                            for (f = n._getXPathResult(h, e, i); m = f.iterateNext();) _ = m.textContent || m.value || m.text || m.innerHTML || m.innerText || null;
                            return t.DataSchema.Base.parse.call(this, _, a)
                        } catch {}
                        return null
                    },
                    _getXPathResult: function(a, e, h) {
                        if (r.isUndefined(h.evaluate)) {
                            var i = [],
                                f = a.split(/\b\/\b/),
                                m = 0,
                                _ = f.length,
                                u, l, d, p;
                            try {
                                try {
                                    h.setProperty("SelectionLanguage", "XPath")
                                } catch {}
                                i = e.selectNodes(a)
                            } catch {
                                for (; m < _ && e; m++)
                                    if (u = f[m], u.indexOf("[") > -1 && u.indexOf("]") > -1) l = u.slice(u.indexOf("[") + 1, u.indexOf("]")), l--, e = e.children[l], p = !0;
                                    else if (u.indexOf("@") > -1) l = u.substr(u.indexOf("@")), e = l ? e.getAttribute(l.replace("@", "")) : e;
                                else if (-1 < u.indexOf("//")) l = e.getElementsByTagName(u.substr(2)), e = l.length ? l[l.length - 1] : null;
                                else if (_ != m + 1)
                                    for (d = e.childNodes.length - 1; 0 <= d; d -= 1) u === e.childNodes[d].tagName && (e = e.childNodes[d], d = -1);
                                e && (r.isString(e) ? i[0] = {
                                    value: e
                                } : p ? i[0] = {
                                    value: e.innerHTML
                                } : i = t.Array(e.childNodes, 0, !0))
                            }
                            return {
                                index: 0,
                                iterateNext: function() {
                                    if (!(this.index >= this.values.length)) {
                                        var E = this.values[this.index];
                                        return this.index += 1, E
                                    }
                                },
                                values: i
                            }
                        } else return h.evaluate(a, e, h.createNSResolver(e.ownerDocument ? e.ownerDocument.documentElement : e.documentElement), 0, null)
                    },
                    _parseField: function(a, e, h) {
                        var i = a.key || a,
                            f;
                        a.schema ? (f = {
                            results: [],
                            meta: {}
                        }, f = n._parseResults(a.schema, h, f), e[i] = f.results) : e[i] = n._getLocationValue(a, h)
                    },
                    _parseMeta: function(a, e, h) {
                        if (r.isObject(a)) {
                            var i, f = e.ownerDocument || e;
                            for (i in a) a.hasOwnProperty(i) && (h.meta[i] = n._getLocationValue(a[i], f))
                        }
                        return h
                    },
                    _parseResult: function(a, e) {
                        var h = {},
                            i;
                        for (i = a.length - 1; 0 <= i; i--) n._parseField(a[i], h, e);
                        return h
                    },
                    _parseResults: function(a, e, h) {
                        if (a.resultListLocator && r.isArray(a.resultFields)) {
                            var i = e.ownerDocument || e,
                                f = a.resultFields,
                                m = [],
                                _, u, l = 0;
                            if (a.resultListLocator.match(/^[:\-\w]+$/))
                                for (u = e.getElementsByTagName(a.resultListLocator), l = u.length - 1; l >= 0; --l) m[l] = n._parseResult(f, u[l]);
                            else
                                for (u = n._getXPathResult(a.resultListLocator, e, i); _ = u.iterateNext();) m[l] = n._parseResult(f, _), l += 1;
                            m.length ? h.results = m : h.error = new Error("XML schema result nodes retrieval failure")
                        }
                        return h
                    }
                }, t.DataSchema.XML = t.mix(n, t.DataSchema.Base)
            }, "3.17.2", {
                requires: ["dataschema-base"]
            })
        }),
        855858: (function() {
            YUI.add("datasource-arrayschema", function(t, T) {
                var r = function() {
                    r.superclass.constructor.apply(this, arguments)
                };
                t.mix(r, {
                    NS: "schema",
                    NAME: "dataSourceArraySchema",
                    ATTRS: {
                        schema: {}
                    }
                }), t.extend(r, t.Plugin.Base, {
                    initializer: function(c) {
                        this.doBefore("_defDataFn", this._beforeDefDataFn)
                    },
                    _beforeDefDataFn: function(c) {
                        var n = t.DataSource.IO && this.get("host") instanceof t.DataSource.IO && t.Lang.isString(c.data.responseText) ? c.data.responseText : c.data,
                            a = t.DataSchema.Array.apply.call(this, this.get("schema"), n),
                            e = c.details[0];
                        return a || (a = {
                            meta: {},
                            results: n
                        }), e.response = a, this.get("host").fire("response", e), new t.Do.Halt("DataSourceArraySchema plugin halted _defDataFn")
                    }
                }), t.namespace("Plugin").DataSourceArraySchema = r
            }, "3.17.2", {
                requires: ["datasource-local", "plugin", "dataschema-array"]
            })
        }),
        930478: (function() {
            YUI.add("datasource-cache", function(t, T) {
                var r = function() {};
                t.mix(r, {
                    NS: "cache",
                    NAME: "dataSourceCacheExtension"
                }), r.prototype = {
                    initializer: function(n) {
                        this.doBefore("_defRequestFn", this._beforeDefRequestFn), this.doBefore("_defResponseFn", this._beforeDefResponseFn)
                    },
                    _beforeDefRequestFn: function(n) {
                        var a = this.retrieve(n.request) || null,
                            e = n.details[0];
                        if (a && a.response) return e.cached = a.cached, e.response = a.response, e.data = a.data, this.get("host").fire("response", e), new t.Do.Halt("DataSourceCache extension halted _defRequestFn")
                    },
                    _beforeDefResponseFn: function(n) {
                        n.response && !n.cached && this.add(n.request, n.response)
                    }
                }, t.namespace("Plugin").DataSourceCacheExtension = r;

                function c(n) {
                    var a = n && n.cache ? n.cache : t.Cache,
                        e = t.Base.create("dataSourceCache", a, [t.Plugin.Base, t.Plugin.DataSourceCacheExtension]),
                        h = new e(n);
                    return e.NS = "tmpClass", h
                }
                t.mix(c, {
                    NS: "cache",
                    NAME: "dataSourceCache"
                }), t.namespace("Plugin").DataSourceCache = c
            }, "3.17.2", {
                requires: ["datasource-local", "plugin", "cache-base"]
            })
        }),
        64739: (function() {
            YUI.add("datasource-function", function(t, T) {
                var r = t.Lang,
                    c = function() {
                        c.superclass.constructor.apply(this, arguments)
                    };
                t.mix(c, {
                    NAME: "dataSourceFunction",
                    ATTRS: {
                        source: {
                            validator: r.isFunction
                        }
                    }
                }), t.extend(c, t.DataSource.Local, {
                    _defRequestFn: function(n) {
                        var a = this.get("source"),
                            e = n.details[0];
                        if (a) try {
                            e.data = a(n.request, this, n)
                        } catch (h) {
                            e.error = h
                        } else e.error = new Error("Function data failure");
                        return this.fire("data", e), n.tId
                    }
                }), t.DataSource.Function = c
            }, "3.17.2", {
                requires: ["datasource-local"]
            })
        }),
        129003: (function() {
            YUI.add("datasource-get", function(t, T) {
                var r = function() {
                    r.superclass.constructor.apply(this, arguments)
                };
                t.DataSource.Get = t.extend(r, t.DataSource.Local, {
                    _defRequestFn: function(c) {
                        var n = this.get("source"),
                            a = this.get("get"),
                            e = t.guid().replace(/\-/g, "_"),
                            h = this.get("generateRequestCallback"),
                            i = c.details[0],
                            f = this;
                        return this._last = e, YUI.Env.DataSource.callbacks[e] = function(m) {
                            delete YUI.Env.DataSource.callbacks[e], delete t.DataSource.Local.transactions[c.tId];
                            var _ = f.get("asyncMode") !== "ignoreStaleResponses" || f._last === e;
                            _ && (i.data = m, f.fire("data", i))
                        }, n += c.request + h.call(this, e), t.DataSource.Local.transactions[c.tId] = a.script(n, {
                            autopurge: !0,
                            onFailure: function(m) {
                                delete YUI.Env.DataSource.callbacks[e], delete t.DataSource.Local.transactions[c.tId], i.error = new Error(m.msg || "Script node data failure"), f.fire("data", i)
                            },
                            onTimeout: function(m) {
                                delete YUI.Env.DataSource.callbacks[e], delete t.DataSource.Local.transactions[c.tId], i.error = new Error(m.msg || "Script node data timeout"), f.fire("data", i)
                            }
                        }), c.tId
                    },
                    _generateRequest: function(c) {
                        return "&" + this.get("scriptCallbackParam") + "=YUI.Env.DataSource.callbacks." + c
                    }
                }, {
                    NAME: "dataSourceGet",
                    ATTRS: {
                        get: {
                            value: t.Get,
                            cloneDefaultValue: !1
                        },
                        asyncMode: {
                            value: "allowAll"
                        },
                        scriptCallbackParam: {
                            value: "callback"
                        },
                        generateRequestCallback: {
                            value: function() {
                                return this._generateRequest.apply(this, arguments)
                            }
                        }
                    }
                }), YUI.namespace("Env.DataSource.callbacks")
            }, "3.17.2", {
                requires: ["datasource-local", "get"]
            })
        }),
        461422: (function() {
            YUI.add("datasource-io", function(t, T) {
                var r = function() {
                    r.superclass.constructor.apply(this, arguments)
                };
                t.mix(r, {
                    NAME: "dataSourceIO",
                    ATTRS: {
                        io: {
                            value: t.io,
                            cloneDefaultValue: !1
                        },
                        ioConfig: {
                            value: null
                        }
                    }
                }), t.extend(r, t.DataSource.Local, {
                    initializer: function(c) {
                        this._queue = {
                            interval: null,
                            conn: null,
                            requests: []
                        }
                    },
                    successHandler: function(c, n, a) {
                        var e = this.get("ioConfig"),
                            h = a.details[0];
                        delete t.DataSource.Local.transactions[a.tId], h.data = n, this.fire("data", h), e && e.on && e.on.success && e.on.success.apply(e.context || t, arguments)
                    },
                    failureHandler: function(c, n, a) {
                        var e = this.get("ioConfig"),
                            h = a.details[0];
                        delete t.DataSource.Local.transactions[a.tId], h.error = new Error("IO data failure"), h.data = n, this.fire("data", h), e && e.on && e.on.failure && e.on.failure.apply(e.context || t, arguments)
                    },
                    _queue: null,
                    _defRequestFn: function(c) {
                        var n = this.get("source"),
                            a = this.get("io"),
                            e = this.get("ioConfig"),
                            h = c.request,
                            i = t.merge(e, c.cfg, {
                                on: t.merge(e, {
                                    success: this.successHandler,
                                    failure: this.failureHandler
                                }),
                                context: this,
                                arguments: c
                            });
                        return t.Lang.isString(h) && (i.method && i.method.toUpperCase() === "POST" ? i.data = i.data ? i.data + h : h : n += h), t.DataSource.Local.transactions[c.tId] = a(n, i), c.tId
                    }
                }), t.DataSource.IO = r
            }, "3.17.2", {
                requires: ["datasource-local", "io-base"]
            })
        }),
        451622: (function() {
            YUI.add("datasource-jsonschema", function(t, T) {
                var r = function() {
                    r.superclass.constructor.apply(this, arguments)
                };
                t.mix(r, {
                    NS: "schema",
                    NAME: "dataSourceJSONSchema",
                    ATTRS: {
                        schema: {}
                    }
                }), t.extend(r, t.Plugin.Base, {
                    initializer: function(c) {
                        this.doBefore("_defDataFn", this._beforeDefDataFn)
                    },
                    _beforeDefDataFn: function(c) {
                        var n = c.data && (c.data.responseText || c.data),
                            a = this.get("schema"),
                            e = c.details[0];
                        return e.response = t.DataSchema.JSON.apply.call(this, a, n) || {
                            meta: {},
                            results: n
                        }, this.get("host").fire("response", e), new t.Do.Halt("DataSourceJSONSchema plugin halted _defDataFn")
                    }
                }), t.namespace("Plugin").DataSourceJSONSchema = r
            }, "3.17.2", {
                requires: ["datasource-local", "plugin", "dataschema-json"]
            })
        }),
        290143: (function() {
            YUI.add("datasource-local", function(t, T) {
                var r = t.Lang,
                    c = function() {
                        c.superclass.constructor.apply(this, arguments)
                    };
                t.mix(c, {
                    NAME: "dataSourceLocal",
                    ATTRS: {
                        source: {
                            value: null
                        }
                    },
                    _tId: 0,
                    transactions: {},
                    issueCallback: function(n, a) {
                        var e = n.on || n.callback,
                            h = e && e.success,
                            i = n.details[0];
                        i.error = n.error || n.response.error, i.error && (a.fire("error", i), h = e && e.failure), h && h(i)
                    }
                }), t.extend(c, t.Base, {
                    initializer: function(n) {
                        this._initEvents()
                    },
                    _initEvents: function() {
                        this.publish("request", {
                            defaultFn: t.bind("_defRequestFn", this),
                            queuable: !0
                        }), this.publish("data", {
                            defaultFn: t.bind("_defDataFn", this),
                            queuable: !0
                        }), this.publish("response", {
                            defaultFn: t.bind("_defResponseFn", this),
                            queuable: !0
                        })
                    },
                    _defRequestFn: function(n) {
                        var a = this.get("source"),
                            e = n.details[0];
                        r.isUndefined(a) && (e.error = new Error("Local source undefined")), e.data = a, this.fire("data", e)
                    },
                    _defDataFn: function(n) {
                        var a = n.data,
                            e = n.meta,
                            h = {
                                results: r.isArray(a) ? a : [a],
                                meta: e || {}
                            },
                            i = n.details[0];
                        i.response = h, this.fire("response", i)
                    },
                    _defResponseFn: function(n) {
                        c.issueCallback(n, this)
                    },
                    sendRequest: function(n) {
                        var a = c._tId++,
                            e;
                        return n = n || {}, e = n.on || n.callback, this.fire("request", {
                            tId: a,
                            request: n.request,
                            on: e,
                            callback: e,
                            cfg: n.cfg || {}
                        }), a
                    }
                }), t.namespace("DataSource").Local = c
            }, "3.17.2", {
                requires: ["base"]
            })
        }),
        853554: (function() {
            YUI.add("datasource-polling", function(t, T) {
                function r() {
                    this._intervals = {}
                }
                r.prototype = {
                    _intervals: null,
                    setInterval: function(c, n) {
                        var a = t.later(c, this, this.sendRequest, [n], !0);
                        return this._intervals[a.id] = a, t.later(0, this, this.sendRequest, [n]), a.id
                    },
                    clearInterval: function(c, n) {
                        c = n || c, this._intervals[c] && (this._intervals[c].cancel(), delete this._intervals[c])
                    },
                    clearAllIntervals: function() {
                        t.each(this._intervals, this.clearInterval, this)
                    }
                }, t.augment(t.DataSource.Local, r)
            }, "3.17.2", {
                requires: ["datasource-local"]
            })
        }),
        145830: (function() {
            YUI.add("datasource-textschema", function(t, T) {
                var r = function() {
                    r.superclass.constructor.apply(this, arguments)
                };
                t.mix(r, {
                    NS: "schema",
                    NAME: "dataSourceTextSchema",
                    ATTRS: {
                        schema: {}
                    }
                }), t.extend(r, t.Plugin.Base, {
                    initializer: function(c) {
                        this.doBefore("_defDataFn", this._beforeDefDataFn)
                    },
                    _beforeDefDataFn: function(c) {
                        var n = this.get("schema"),
                            a = c.details[0],
                            e = c.data.responseText || c.data;
                        return a.response = t.DataSchema.Text.apply.call(this, n, e) || {
                            meta: {},
                            results: e
                        }, this.get("host").fire("response", a), new t.Do.Halt("DataSourceTextSchema plugin halted _defDataFn")
                    }
                }), t.namespace("Plugin").DataSourceTextSchema = r
            }, "3.17.2", {
                requires: ["datasource-local", "plugin", "dataschema-text"]
            })
        }),
        204553: (function() {
            YUI.add("datasource-xmlschema", function(t, T) {
                var r = function() {
                    r.superclass.constructor.apply(this, arguments)
                };
                t.mix(r, {
                    NS: "schema",
                    NAME: "dataSourceXMLSchema",
                    ATTRS: {
                        schema: {}
                    }
                }), t.extend(r, t.Plugin.Base, {
                    initializer: function(c) {
                        this.doBefore("_defDataFn", this._beforeDefDataFn)
                    },
                    _beforeDefDataFn: function(c) {
                        var n = this.get("schema"),
                            a = c.details[0],
                            e = t.XML.parse(c.data.responseText) || c.data;
                        return a.response = t.DataSchema.XML.apply.call(this, n, e) || {
                            meta: {},
                            results: e
                        }, this.get("host").fire("response", a), new t.Do.Halt("DataSourceXMLSchema plugin halted _defDataFn")
                    }
                }), t.namespace("Plugin").DataSourceXMLSchema = r
            }, "3.17.2", {
                requires: ["datasource-local", "plugin", "datatype-xml", "dataschema-xml"]
            })
        }),
        97963: (function() {
            YUI.add("datatype-xml-format", function(t, T) {
                var r = t.Lang;
                t.mix(t.namespace("XML"), {
                    format: function(c) {
                        try {
                            if (!r.isUndefined(c.getXml)) return c.getXml();
                            if (!r.isUndefined(XMLSerializer)) return new XMLSerializer().serializeToString(c)
                        } catch {
                            return c && c.xml ? c.xml : r.isValue(c) && c.toString ? c.toString() : ""
                        }
                    }
                }), t.namespace("DataType"), t.DataType.XML = t.XML
            }, "3.17.2")
        }),
        907922: (function(t, T, r) {
            var c = r(63892);
            YUI.add("handlebars-base", function(n, a) {
                n.namespace("Handlebars"), n.namespace("Template").Handlebars = c, n.Handlebars = c
            }, "3.17.2", {
                requires: []
            })
        }),
        101848: (function() {
            YUI.add("node-scroll-info", function(t, T) {
                var r = t.config.doc,
                    c = t.config.win,
                    n = "scroll",
                    a = "scrollDown",
                    e = "scrollLeft",
                    h = "scrollRight",
                    i = "scrollUp",
                    f = "scrollToBottom",
                    m = "scrollToLeft",
                    _ = "scrollToRight",
                    u = "scrollToTop";
                t.Plugin.ScrollInfo = t.Base.create("scrollInfoPlugin", t.Plugin.Base, [], {
                    initializer: function(l) {
                        this._host = l.host, this._hostIsBody = this._host.get("nodeName").toLowerCase() === "body", this._scrollDelay = this.get("scrollDelay"), this._scrollMargin = this.get("scrollMargin"), this._scrollNode = this._getScrollNode(), this.refreshDimensions(), this._lastScroll = this.getScrollInfo(), this._bind()
                    },
                    destructor: function() {
                        new t.EventHandle(this._events).detach(), this._events = null
                    },
                    getOffscreenNodes: function(l, d) {
                        typeof d > "u" && (d = this._scrollMargin);
                        var p = t.Selector.query(l || "*", this._host._node);
                        return new t.NodeList(t.Array.filter(p, function(E) {
                            return !this._isElementOnscreen(E, d)
                        }, this))
                    },
                    getOnscreenNodes: function(l, d) {
                        typeof d > "u" && (d = this._scrollMargin);
                        var p = t.Selector.query(l || "*", this._host._node);
                        return new t.NodeList(t.Array.filter(p, function(E) {
                            return this._isElementOnscreen(E, d)
                        }, this))
                    },
                    getScrollInfo: function() {
                        var l = this._scrollNode,
                            d = this._lastScroll,
                            p = this._scrollMargin,
                            E = l.scrollLeft,
                            A = l.scrollHeight,
                            s = l.scrollTop,
                            g = l.scrollWidth,
                            v = s + this._height,
                            I = E + this._width;
                        return {
                            atBottom: v > A - p,
                            atLeft: E < p,
                            atRight: I > g - p,
                            atTop: s < p,
                            isScrollDown: d && s > d.scrollTop,
                            isScrollLeft: d && E < d.scrollLeft,
                            isScrollRight: d && E > d.scrollLeft,
                            isScrollUp: d && s < d.scrollTop,
                            scrollBottom: v,
                            scrollHeight: A,
                            scrollLeft: E,
                            scrollRight: I,
                            scrollTop: s,
                            scrollWidth: g
                        }
                    },
                    isNodeOnscreen: function(l, d) {
                        return l = t.one(l), !!(l && this._isElementOnscreen(l._node, d))
                    },
                    refreshDimensions: function() {
                        var l = r.documentElement;
                        t.UA.ios || t.UA.android && t.UA.chrome ? (this._winHeight = c.innerHeight, this._winWidth = c.innerWidth) : (this._winHeight = l.clientHeight, this._winWidth = l.clientWidth), this._hostIsBody ? (this._height = this._winHeight, this._width = this._winWidth) : (this._height = this._scrollNode.clientHeight, this._width = this._scrollNode.clientWidth), this._refreshHostBoundingRect()
                    },
                    _bind: function() {
                        var l = t.one("win");
                        this._events = [this.after({
                            scrollDelayChange: this._afterScrollDelayChange,
                            scrollMarginChange: this._afterScrollMarginChange
                        }), l.on("windowresize", this._afterResize, this)], this._hostIsBody ? this._events.push(l.after("scroll", this._afterHostScroll, this)) : this._events.push(l.after("scroll", this._afterWindowScroll, this), this._host.after("scroll", this._afterHostScroll, this))
                    },
                    _getScrollNode: function() {
                        return this._hostIsBody && !t.UA.webkit ? r.documentElement : t.Node.getDOMNode(this._host)
                    },
                    _isElementOnscreen: function(l, d) {
                        var p = this._hostRect,
                            E = l.getBoundingClientRect();
                        return typeof d > "u" && (d = this._scrollMargin), !(E.top > p.bottom + d || E.bottom < p.top - d || E.right < p.left - d || E.left > p.right + d)
                    },
                    _refreshHostBoundingRect: function() {
                        var l = this._winHeight,
                            d = this._winWidth,
                            p;
                        this._hostIsBody ? (p = {
                            bottom: l,
                            height: l,
                            left: 0,
                            right: d,
                            top: 0,
                            width: d
                        }, this._isHostOnscreen = !0) : p = this._scrollNode.getBoundingClientRect(), this._hostRect = p
                    },
                    _triggerScroll: function(l) {
                        var d = this.getScrollInfo(),
                            p = t.merge(l, d),
                            E = this._lastScroll;
                        this._lastScroll = d, this.fire(n, p), d.isScrollLeft ? this.fire(e, p) : d.isScrollRight && this.fire(h, p), d.isScrollUp ? this.fire(i, p) : d.isScrollDown && this.fire(a, p), d.atBottom && (!E.atBottom || d.scrollHeight > E.scrollHeight) && this.fire(f, p), d.atLeft && !E.atLeft && this.fire(m, p), d.atRight && (!E.atRight || d.scrollWidth > E.scrollWidth) && this.fire(_, p), d.atTop && !E.atTop && this.fire(u, p)
                    },
                    _afterHostScroll: function(l) {
                        var d = this;
                        clearTimeout(this._scrollTimeout), this._scrollTimeout = setTimeout(function() {
                            d._triggerScroll(l)
                        }, this._scrollDelay)
                    },
                    _afterResize: function() {
                        this.refreshDimensions()
                    },
                    _afterScrollDelayChange: function(l) {
                        this._scrollDelay = l.newVal
                    },
                    _afterScrollMarginChange: function(l) {
                        this._scrollMargin = l.newVal
                    },
                    _afterWindowScroll: function() {
                        this._refreshHostBoundingRect()
                    }
                }, {
                    NS: "scrollInfo",
                    ATTRS: {
                        scrollDelay: {
                            value: 50
                        },
                        scrollMargin: {
                            value: 50
                        }
                    }
                })
            }, "3.17.2", {
                requires: ["array-extras", "base-build", "event-resize", "node-pluginhost", "plugin", "selector"]
            })
        }),
        685241: (function() {
            YUI.add("substitute", function(t, T) {
                var r = t.Lang,
                    c = "dump",
                    n = " ",
                    a = "{",
                    e = "}",
                    h = /(~-(\d+)-~)/g,
                    i = /\{LBRACE\}/g,
                    f = /\{RBRACE\}/g,
                    m = function(_, u, l, d) {
                        for (var p, E, A, s, g, v, I = [], o, S, y = _.length; p = _.lastIndexOf(a, y), !(p < 0 || (E = _.indexOf(e, p), p + 1 >= E));) o = _.substring(p + 1, E), s = o, v = null, A = s.indexOf(n), A > -1 && (v = s.substring(A + 1), s = s.substring(0, A)), g = u[s], l && (g = l(s, g, v)), r.isObject(g) ? t.dump ? r.isArray(g) ? g = t.dump(g, parseInt(v, 10)) : (v = v || "", S = v.indexOf(c), S > -1 && (v = v.substring(4)), g.toString === Object.prototype.toString || S > -1 ? g = t.dump(g, parseInt(v, 10)) : g = g.toString()) : g = g.toString() : r.isUndefined(g) && (g = "~-" + I.length + "-~", I.push(o)), _ = _.substring(0, p) + g + _.substring(E + 1), d || (y = p - 1);
                        return _.replace(h, function(b, L, D) {
                            return a + I[parseInt(D, 10)] + e
                        }).replace(i, a).replace(f, e)
                    };
                t.substitute = m, r.substitute = m
            }, "3.17.2", {
                requires: ["yui-base"],
                optional: ["dump"]
            })
        }),
        859857: (function() {
            YUI.add("widget-position", function(t, T) {
                var r = t.Lang,
                    c = t.Widget,
                    n = "xy",
                    a = "position",
                    e = "positioned",
                    h = "boundingBox",
                    i = "relative",
                    f = "renderUI",
                    m = "bindUI",
                    _ = "syncUI",
                    u = c.UI_SRC,
                    l = "xyChange";

                function d(p) {}
                d.ATTRS = {
                    x: {
                        setter: function(p) {
                            this._setX(p)
                        },
                        getter: function() {
                            return this._getX()
                        },
                        lazyAdd: !1
                    },
                    y: {
                        setter: function(p) {
                            this._setY(p)
                        },
                        getter: function() {
                            return this._getY()
                        },
                        lazyAdd: !1
                    },
                    xy: {
                        value: [0, 0],
                        validator: function(p) {
                            return this._validateXY(p)
                        }
                    }
                }, d.POSITIONED_CLASS_NAME = c.getClassName(e), d.prototype = {
                    initializer: function() {
                        this._posNode = this.get(h), t.after(this._renderUIPosition, this, f), t.after(this._syncUIPosition, this, _), t.after(this._bindUIPosition, this, m)
                    },
                    _renderUIPosition: function() {
                        this._posNode.addClass(d.POSITIONED_CLASS_NAME)
                    },
                    _syncUIPosition: function() {
                        var p = this._posNode;
                        p.getStyle(a) === i && this.syncXY(), this._uiSetXY(this.get(n))
                    },
                    _bindUIPosition: function() {
                        this.after(l, this._afterXYChange)
                    },
                    move: function() {
                        var p = arguments,
                            E = r.isArray(p[0]) ? p[0] : [p[0], p[1]];
                        this.set(n, E)
                    },
                    syncXY: function() {
                        this.set(n, this._posNode.getXY(), {
                            src: u
                        })
                    },
                    _validateXY: function(p) {
                        return r.isArray(p) && r.isNumber(p[0]) && r.isNumber(p[1])
                    },
                    _setX: function(p) {
                        this.set(n, [p, this.get(n)[1]])
                    },
                    _setY: function(p) {
                        this.set(n, [this.get(n)[0], p])
                    },
                    _getX: function() {
                        return this.get(n)[0]
                    },
                    _getY: function() {
                        return this.get(n)[1]
                    },
                    _afterXYChange: function(p) {
                        p.src != u && this._uiSetXY(p.newVal)
                    },
                    _uiSetXY: function(p) {
                        this._posNode.setXY(p)
                    }
                }, t.WidgetPosition = d
            }, "3.17.2", {
                requires: ["base-build", "node-screen", "widget"]
            })
        }),
        91210: (function() {
            YUI.add("squarespace-search-result-template", function(t) {
                var T = t.Handlebars;
                (function() {
                    var c = T.template,
                        n = T.templates = T.templates || {};
                    n["search-result.html"] = c({
                        0: function(a, e, h, i, f) {
                            var m, _, u = e ? ? (a.nullContext || {}),
                                l = a.hooks.helperMissing,
                                d = "function",
                                p = a.escapeExpression,
                                E = a.lookupProperty || function(A, s) {
                                    if (Object.prototype.hasOwnProperty.call(A, s)) return A[s]
                                };
                            return `<div
  tabindex="0"
  role="link"
  class="search-result clear"
  itemid="` + p((_ = (_ = E(h, "id") || (e != null ? E(e, "id") : e)) != null ? _ : l, typeof _ === d ? _.call(u, {
                                name: "id",
                                hash: {},
                                data: f,
                                loc: {
                                    start: {
                                        line: 6,
                                        column: 10
                                    },
                                    end: {
                                        line: 6,
                                        column: 16
                                    }
                                }
                            }) : _)) + `"
>
  <div class="sqs-search-container-item sqs-search-ui-item sqs-post ` + ((m = E(h, "if").call(u, e != null ? E(e, "recordTypeName") : e, {
                                name: "if",
                                hash: {},
                                fn: a.program(1, f, 0),
                                inverse: a.noop,
                                data: f,
                                loc: {
                                    start: {
                                        line: 8,
                                        column: 68
                                    },
                                    end: {
                                        line: 8,
                                        column: 129
                                    }
                                }
                            })) != null ? m : "") + " " + p((_ = (_ = E(h, "documentType") || (e != null ? E(e, "documentType") : e)) != null ? _ : l, typeof _ === d ? _.call(u, {
                                name: "documentType",
                                hash: {},
                                data: f,
                                loc: {
                                    start: {
                                        line: 8,
                                        column: 130
                                    },
                                    end: {
                                        line: 8,
                                        column: 146
                                    }
                                }
                            }) : _)) + `">
` + ((m = E(h, "if").call(u, e != null ? E(e, "imageUrl") : e, {
                                name: "if",
                                hash: {},
                                fn: a.program(2, f, 0),
                                inverse: a.noop,
                                data: f,
                                loc: {
                                    start: {
                                        line: 9,
                                        column: 4
                                    },
                                    end: {
                                        line: 17,
                                        column: 11
                                    }
                                }
                            })) != null ? m : "") + `    <div class="sqs-main-content">
      <div class="sqs-title">` + ((m = (_ = (_ = E(h, "title") || (e != null ? E(e, "title") : e)) != null ? _ : l, typeof _ === d ? _.call(u, {
                                name: "title",
                                hash: {},
                                data: f,
                                loc: {
                                    start: {
                                        line: 19,
                                        column: 29
                                    },
                                    end: {
                                        line: 19,
                                        column: 40
                                    }
                                }
                            }) : _)) != null ? m : "") + `</div>
      <div class="sqs-content">
` + ((m = E(h, "each").call(u, e != null ? E(e, "highlight") : e, {
                                name: "each",
                                hash: {},
                                fn: a.program(3, f, 0),
                                inverse: a.noop,
                                data: f,
                                loc: {
                                    start: {
                                        line: 21,
                                        column: 8
                                    },
                                    end: {
                                        line: 24,
                                        column: 17
                                    }
                                }
                            })) != null ? m : "") + `      </div>
    </div>
  </div>
</div>
`
                        },
                        1: function(a, e, h, i, f) {
                            var m, _ = a.lookupProperty || function(u, l) {
                                if (Object.prototype.hasOwnProperty.call(u, l)) return u[l]
                            };
                            return "sqs-post-type-" + a.escapeExpression((m = (m = _(h, "recordTypeName") || (e != null ? _(e, "recordTypeName") : e)) != null ? m : a.hooks.helperMissing, typeof m == "function" ? m.call(e ? ? (a.nullContext || {}), {
                                name: "recordTypeName",
                                hash: {},
                                data: f,
                                loc: {
                                    start: {
                                        line: 8,
                                        column: 104
                                    },
                                    end: {
                                        line: 8,
                                        column: 122
                                    }
                                }
                            }) : m))
                        },
                        2: function(a, e, h, i, f) {
                            var m, _, u = a.escapeExpression,
                                l = a.lambda,
                                d = a.lookupProperty || function(p, E) {
                                    if (Object.prototype.hasOwnProperty.call(p, E)) return p[E]
                                };
                            return `    <div class="sqs-main-image-container">
      <div class="sqs-main-image-intrinsic">
        <div class="sqs-main-image content-fill">
          <img data-src="` + u((_ = (_ = d(h, "imageUrl") || (e != null ? d(e, "imageUrl") : e)) != null ? _ : a.hooks.helperMissing, typeof _ == "function" ? _.call(e ? ? (a.nullContext || {}), {
                                name: "imageUrl",
                                hash: {},
                                data: f,
                                loc: {
                                    start: {
                                        line: 13,
                                        column: 25
                                    },
                                    end: {
                                        line: 13,
                                        column: 37
                                    }
                                }
                            }) : _)) + '" data-image-focal-point="' + u(l((m = e != null ? d(e, "mediaFocalPoint") : e) != null ? d(m, "x") : m, e)) + "," + u(l((m = e != null ? d(e, "mediaFocalPoint") : e) != null ? d(m, "y") : m, e)) + `"/>
        </div>
      </div>
    </div>
`
                        },
                        3: function(a, e, h, i, f) {
                            var m;
                            return "        <span>" + ((m = a.lambda(e, e)) != null ? m : "") + `</span>
        <span>&hellip;</span>
`
                        },
                        compiler: [8, ">= 4.3.0"],
                        main: function(a, e, h, i, f) {
                            var m, _ = a.lookupProperty || function(u, l) {
                                if (Object.prototype.hasOwnProperty.call(u, l)) return u[l]
                            };
                            return (m = _(h, "each").call(e ? ? (a.nullContext || {}), e != null ? _(e, "items") : e, {
                                name: "each",
                                hash: {},
                                fn: a.program(0, f, 0),
                                inverse: a.noop,
                                data: f,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 0
                                    },
                                    end: {
                                        line: 29,
                                        column: 9
                                    }
                                }
                            })) != null ? m : ""
                        },
                        useData: !0
                    })
                })();
                var r = "search-result.html";
                t.Handlebars.registerPartial(r.replace("/", "."), T.templates[r])
            }, "1.0", {
                requires: ["handlebars-base"]
            })
        }),
        821379: (function(t, T, r) {
            "use strict";
            r.d(T, {
                Z: () => e
            });
            var c = r(350198),
                n = r.n(c);
            const e = {
                isProductionEnvironment: () => {
                    const h = (0, c.get)(window, "Static.SQUARESPACE_CONTEXT.appDomain", "");
                    return h && (h.indexOf("sqsp.com") !== -1 || h.indexOf("squarespace.com") !== -1)
                }
            }
        })
    }
]);

//# sourceMappingURL=https://sourcemaps.squarespace.net/universal/scripts-compressed/sourcemaps/cb89cefe3ce0a924/36796-246691b22f83d90f-min.en-US.js.map