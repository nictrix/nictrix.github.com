! function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'")
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, f, f.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s
}({
    1: [function(require, module) {
        function JSONLoader() {
            var self = this;
            self.load = function(location, callback) {
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
                xhr.open("GET", location, !0), xhr.onreadystatechange = function() {
                    if (200 == xhr.status && 4 == xhr.readyState) try {
                        callback(null, JSON.parse(xhr.responseText)), console.log("got json")
                    } catch (err) {
                        callback(err, null)
                    }
                }, xhr.send()
            }
        }
        module.exports = new JSONLoader
    }, {}],
    2: [function(require, module) {
        function FuzzySearchStrategy() {
            this.matches = function(string, crit) {
                var regexp = new RegExp(crit.split("").join(".*?"), "gi");
                return !!string.match(regexp)
            }
        }
        module.exports = new FuzzySearchStrategy
    }, {}],
    3: [function(require, module) {
        function LiteralSearchStrategy() {
            this.matches = function(string, crit) {
                return string.toLowerCase().indexOf(crit.toLowerCase()) >= 0
            }
        }
        module.exports = new LiteralSearchStrategy
    }, {}],
    4: [function(require, module) {
        function Searcher() {
            var self = this,
                fuzzySearchStrategy = require("./SearchStrategies/fuzzy"),
                literalSearchStrategy = require("./SearchStrategies/literal"),
                fuzzy = !1,
                limit = 5;
            self.setFuzzy = function(_fuzzy) {
                fuzzy = !!_fuzzy
            }, self.setLimit = function(_limit) {
                limit = parseInt(_limit, 5) || limit
            }, self.search = function(data, crit) {
                var matches = [];
                if (!crit) return matches;
                crit = crit.replace(/^ */, "").replace(/ *$/, "");
                for (var strategy = fuzzy ? fuzzySearchStrategy : literalSearchStrategy, i = 0; i < data.length && limit > i; i++) {
                    var obj = data[i];
                    for (var key in obj)
                        if (obj.hasOwnProperty(key) && "string" == typeof obj[key] && strategy.matches(obj[key], crit)) {
                            matches.push(obj);
                            break
                        }
                }
                return matches
            }
        }
        module.exports = new Searcher
    }, {
        "./SearchStrategies/fuzzy": 2,
        "./SearchStrategies/literal": 3
    }],
    5: [function(require, module) {
        function Store() {
            function isObject(obj) {
                return "[object Object]" == Object.prototype.toString.call(obj)
            }

            function isArray(obj) {
                return "[object Array]" == Object.prototype.toString.call(obj)
            }

            function addObject(data) {
                return store.push(data), data
            }

            function addArray(data) {
                for (var added = [], i = 0; i < data.length; i++) isObject(data[i]) && added.push(addObject(data[i]));
                return added
            }
            var self = this,
                store = [];
            self.get = function() {
                return store
            }, self.put = function(data) {
                return isObject(data) ? addObject(data) : isArray(data) ? addArray(data) : void 0
            }
        }
        module.exports = new Store
    }, {}],
    6: [function(require, module) {
        function Templater() {
            var self = this,
                templatePattern = /\{(.*?)\}/g;
            self.setTemplatePattern = function(newTemplatePattern) {
                templatePattern = newTemplatePattern
            }, self.render = function(t, data) {
                return t.replace(templatePattern, function(match, prop) {
                    return data[prop] || match
                })
            }
        }
        module.exports = new Templater
    }, {}],
    7: [function(require) {
        ! function(window) {
            "use strict";

            function SimpleJekyllSearch() {
                function throwError(message) {
                    throw new Error("SimpleJekyllSearch --- " + message)
                }

                function validateOptions(_opt) {
                    for (var i = 0; i < requiredOptions.length; i++) {
                        var req = requiredOptions[i];
                        _opt[req] || throwError("You must specify a " + req)
                    }
                }

                function assignOptions(_opt) {
                    for (var option in opt) opt[option] = _opt[option] || opt[option]
                }

                function isJSON(json) {
                    try {
                        return json instanceof Object && JSON.parse(JSON.stringify(json))
                    } catch (e) {
                        return !1
                    }
                }

                function registerInput() {
                    opt.searchInput.addEventListener("keyup", function(e) {
                        render(searcher.search(store.get(), e.target.value))
                    })
                }

                function render(results) {
                    opt.resultsContainer.innerHTML = "";
                    for (var i = 0; i < results.length; i++) {
                        var result = results[i],
                            rendered = templater.render(opt.searchResultTemplate, result);
                        opt.resultsContainer.innerHTML += rendered
                    }
                }
                var self = this,
                    requiredOptions = ["searchInput", "resultsContainer", "dataSource"],
                    opt = {
                        searchInput: null,
                        resultsContainer: null,
                        dataSource: [],
                        searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
                        noResultsText: "No results found",
                        limit: 5,
                        fuzzy: 1
                    };
                self.init = function(_opt) {
                    validateOptions(_opt), assignOptions(_opt), isJSON(opt.dataSource) ? (store.put(opt.dataSource), registerInput()) : JSONLoader.load(opt.dataSource, function(err, json) {
                        err ? throwError("failed to get JSON (" + opt.dataSource + ")") : (store.put(json), registerInput())
                    })
                }
            }
            var templater = require("./Templater"),
                store = require("./Store"),
                searcher = require("./Searcher"),
                JSONLoader = require("./JSONLoader");
            window.SimpleJekyllSearch = new SimpleJekyllSearch
        }(window, document)
    }, {
        "./JSONLoader": 1,
        "./Searcher": 4,
        "./Store": 5,
        "./Templater": 6
    }]
}, {}, [7]);