var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = (exports, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    __webpack_require__.r = (exports)=>{
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports, '__esModule', {
            value: true
        });
    };
})();
var strings_namespaceObject = {};
__webpack_require__.r(strings_namespaceObject);
__webpack_require__.d(strings_namespaceObject, {
    bytesToHuman: ()=>bytesToHuman,
    toKebab: ()=>toKebab
});
var style_namespaceObject = {};
__webpack_require__.r(style_namespaceObject);
__webpack_require__.d(style_namespaceObject, {
    cssVar: ()=>cssVar,
    gradient: ()=>gradient,
    handleThemeSwitch: ()=>handleThemeSwitch,
    isDarkMode: ()=>isDarkMode,
    onDarkMode: ()=>onDarkMode,
    render: ()=>render,
    switchTheme: ()=>switchTheme
});
var dom_namespaceObject = {};
__webpack_require__.r(dom_namespaceObject);
__webpack_require__.d(dom_namespaceObject, {
    default: ()=>dom,
    el: ()=>dom_el,
    els: ()=>els,
    interpolate: ()=>interpolate,
    on: ()=>on,
    onKey: ()=>onKey,
    ready: ()=>ready
});
var network_namespaceObject = {};
__webpack_require__.r(network_namespaceObject);
__webpack_require__.d(network_namespaceObject, {
    default: ()=>network,
    params: ()=>network_params,
    refresh: ()=>refresh,
    request: ()=>request,
    ws: ()=>ws
});
var local_storage_namespaceObject = {};
__webpack_require__.r(local_storage_namespaceObject);
__webpack_require__.d(local_storage_namespaceObject, {
    clear: ()=>clear,
    get: ()=>get,
    listen: ()=>listen,
    set: ()=>set,
    setObj: ()=>setObj,
    update: ()=>local_storage_update
});
function bytesToHuman(bytes, options = {}) {
    const { useSI = false, decimals = 2, includeUnits = true, targetUnit = null } = options;
    const unit = useSI ? 1000 : 1024;
    const units = useSI ? [
        'B',
        'kB',
        'MB',
        'GB',
        'TB',
        'PB',
        'EB',
        'ZB',
        'YB'
    ] : [
        'B',
        'KiB',
        'MiB',
        'GiB',
        'TiB',
        'PiB',
        'EiB',
        'ZiB',
        'YiB'
    ];
    if (null === targetUnit) {
        let val = parseInt(bytes, 10);
        if (Math.abs(val) < unit) return `${bytes} B`;
        let u = 0;
        while(Math.abs(val) >= unit && u < units.length - 1){
            val /= unit;
            u++;
        }
        if (includeUnits) return `${val.toFixed(decimals)} ${units[u]}`;
        return `${val.toFixed(decimals)}`;
    }
    const targetUnitIndex = units.indexOf(targetUnit);
    if (-1 === targetUnitIndex) throw new Error(`Invalid unit: ${targetUnit}. Valid units are: ${units.join(', ')}`);
    let val = parseInt(bytes, 10);
    for(let i = 0; i < targetUnitIndex; i++)val /= unit;
    if (includeUnits) return `${val.toFixed(decimals)} ${targetUnit}`;
    return `${val.toFixed(decimals)}`;
}
function toKebab(str) {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, ofs)=>(ofs ? '-' : '') + s.toLowerCase());
}
function cssVar(name) {
    const style = window.getComputedStyle(document.body);
    return style.getPropertyValue(name);
}
function render(style) {
    let s = '';
    Object.entries(style).forEach(([k, v])=>s += `${toKebab(k)}:${v};`);
    return s;
}
function isDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function onDarkMode(cb) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (ev)=>{
        cb(ev.matches);
    });
}
function switchTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}
function handleThemeSwitch() {
    switchTheme(isDarkMode() ? 'dark' : 'light');
    onDarkMode((dark)=>{
        switchTheme(dark ? 'dark' : 'light');
    });
}
function gradient(start, end, value) {
    value = Math.max(0, Math.min(100, value));
    const red = Math.round(start.red + (end.red - start.red) * value / 100);
    const green = Math.round(start.green + (end.green - start.green) * value / 100);
    const blue = Math.round(start.blue + (end.blue - start.blue) * value / 100);
    return `rgb(${red}, ${green}, ${blue})`;
}
function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function genID(len = 15, alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
    return [
        ...crypto.getRandomValues(new Uint8Array(len))
    ].map((value)=>alphabet[Math.floor(value / 255 * alphabet.length)]).join('');
}
const clipboard = {
    check () {
        if (!navigator.clipboard) throw new Error('Clipboard API not supported, or context is not https');
    },
    async copy (text) {
        this.check();
        await navigator.clipboard.writeText(text);
    },
    async copyArbitrary (data) {
        this.check();
        await navigator.clipboard.write(data);
    },
    async read () {
        this.check();
        return await navigator.clipboard.readText();
    },
    async readArbitrary () {
        this.check();
        return await navigator.clipboard.read();
    },
    listen (query, cb) {
        let el;
        el = 'string' == typeof query ? document.querySelector(query) : query;
        if (!el) throw new Error(`no element from query: ${query}`);
        el.addEventListener('copy', (ev)=>{
            const cbEv = ev;
            const selection = document.getSelection();
            if (selection) {
                const text = selection.toString();
                if (text && cbEv.clipboardData) cbEv.clipboardData.setData('text/plain', cb(text));
            }
        });
    }
};
var utils_logLevel = /*#__PURE__*/ function(logLevel) {
    logLevel[logLevel["none"] = -1] = "none";
    logLevel[logLevel["error"] = 0] = "error";
    logLevel[logLevel["warn"] = 1] = "warn";
    logLevel[logLevel["info"] = 2] = "info";
    logLevel[logLevel["debug"] = 3] = "debug";
    logLevel[logLevel["trace"] = 4] = "trace";
    return logLevel;
}({});
class logger {
    error(...args) {
        if (this.level >= 0) console.error(`[corvid] ${this.prefix}`, ...args);
    }
    warn(...args) {
        if (this.level >= 1) console.warn(`[corvid] ${this.prefix}`, ...args);
    }
    info(...args) {
        if (this.level >= 2) console.info(`[corvid] ${this.prefix}`, ...args);
    }
    debug(...args) {
        if (this.level >= 3) console.debug(`[corvid] ${this.prefix}`, ...args);
    }
    trace(...args) {
        if (this.level >= 4) console.trace(`[corvid] ${this.prefix}`, ...args);
    }
    log(...args) {
        console.log(`[corvid] ${this.prefix}`, ...args);
    }
    constructor(level = 2, prefix){
        _define_property(this, "level", void 0);
        _define_property(this, "prefix", void 0);
        this.level = level;
        this.prefix = prefix ? `(${prefix}):` : ':';
        if (-1 === this.level) [
            'error',
            'warn',
            'info',
            'debug',
            'trace',
            'log'
        ].forEach((methodName)=>{
            this[methodName] = ()=>{};
        });
    }
}
function dom_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function ready(cb) {
    window.addEventListener('DOMContentLoaded', cb);
}
function on(event, cb) {
    document.addEventListener(event, cb);
    return ()=>{
        document.removeEventListener(event, cb);
    };
}
function onKey(key, cb, verbose = false) {
    const log = new logger(verbose ? utils_logLevel.debug : utils_logLevel.none, 'onKey');
    log.debug(`adding ${key} keydown listener`);
    const handler = (ev)=>{
        if (ev.key === key) cb({
            ctrl: ev.ctrlKey,
            alt: ev.altKey,
            meta: ev.metaKey,
            shift: ev.shiftKey
        });
    };
    window.addEventListener('keydown', handler);
    return ()=>{
        log.debug(`removing ${key} listener`);
        window.removeEventListener('keydown', handler);
    };
}
function els(query, verbose = false) {
    return Array.from(document.querySelectorAll(query)).map((n)=>new dom_el(n, verbose));
}
class dom_el {
    static query(query, verbose = false) {
        return new dom_el(query, verbose);
    }
    value(update) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (void 0 !== update) {
            if ('value' in this.el) this.el.value = update;
            if ('src' in this.el) this.el.src = update;
            return this;
        }
        if ('value' in this.el) return this.el.value;
        if ('innerText' in this.el) return this.el.innerText;
        if ('innerHTML' in this.el) return this.el.innerHTML;
        this.log.warn(`element (${this.query}) does not contain value, returning empty string`);
        return '';
    }
    parent(parent) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        parent.appendChild(this.el);
        return this;
    }
    appendChild(ch) {
        return this.child(ch);
    }
    child(ch) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (ch instanceof dom_el) this.el.appendChild(ch.el);
        else this.el.appendChild(ch);
        return this;
    }
    prependChild(ch) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (ch instanceof dom_el) this.el.prepend(ch.el);
        else this.el.prepend(ch);
        return this;
    }
    empty() {
        if (this.el) this.el.innerHTML = '';
        return this;
    }
    content(content, { text = false } = {}) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (text) this.el.textContent = content;
        else this.el.innerHTML = content;
        return this;
    }
    src(url) {
        if (this.el && 'src' in this.el) this.el.src = url;
        return this;
    }
    style(update, stringify = false) {
        if (this.el) {
            if ('string' == typeof update) this.el.style = update;
            else if ('object' == typeof update) {
                if (!stringify) {
                    for (const [k, v] of Object.entries(update))this.el.style[k] = v;
                    return;
                }
                const s = render(update);
                this.log.debug(`set style: ${this.el.style} -> ${s}`);
                this.el.style = s;
            }
        }
        return this;
    }
    hasClass(className) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        return this.el.classList.contains(className);
    }
    addClass(className) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if ('string' == typeof className) this.el.classList.add(className);
        else for (const sc of className)this.el.classList.add(sc);
        return this;
    }
    removeClass(className) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if ('string' == typeof className) this.el.classList.remove(className);
        else for (const sc of className)this.el.classList.remove(sc);
        return this;
    }
    html(content) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        this.el.innerHTML = content;
    }
    render(vars = {}) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        try {
            return interpolate(this.el.innerHTML, vars);
        } catch (e) {
            throw new Error(`could not render template ${this.query}: ${e}`);
        }
    }
    appendTemplate(template, vars) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (!template.el) throw new Error("template does not contain element");
        const tmpl = template.render(vars);
        this.el.insertAdjacentHTML('beforeend', tmpl);
    }
    on(event, cb) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
        this.el.addEventListener(event, cb);
        return this;
    }
    listen(event, cb) {
        return this.on(event, cb);
    }
    removeListeners(event) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (!this.listeners[event]) return this;
        for (const cb of this.listeners[event])this.el.removeEventListener(event, cb);
        this.listeners[event] = [];
        return this;
    }
    constructor(opts, verbose = false){
        dom_define_property(this, "el", void 0);
        dom_define_property(this, "query", '');
        dom_define_property(this, "log", void 0);
        dom_define_property(this, "listeners", {});
        this.log = new logger(verbose ? utils_logLevel.debug : utils_logLevel.none, 'element');
        if ('string' == typeof opts) {
            this.query = opts;
            this.el = document.querySelector(opts);
            return;
        }
        if (opts instanceof HTMLElement) {
            this.log.debug(`using existing element: ${opts}`);
            this.el = opts;
            return;
        }
        const { query, element, type, class: styleClass, style, id, content, parent } = opts;
        if (query) {
            this.log.debug(`using query: ${query}`);
            this.query = query;
            this.el = document.querySelector(query);
            if (!this.el) throw new Error(`no element from query: ${query}`);
        } else if (element) {
            this.log.debug(`using existing element: ${element}`);
            this.el = element;
        } else if (type) {
            this.query = type;
            this.log.debug(`creating element: ${type}`);
            this.el = document.createElement(type);
        } else throw new Error('no query or type provided');
        if (this.el) {
            if (id) {
                this.log.debug(`setting id: ${id}`);
                this.el.id = id;
            }
            if (styleClass) if ('string' == typeof styleClass) this.el.classList.add(styleClass);
            else for (const sc of styleClass)this.el.classList.add(sc);
            if (style) this.style(style);
            if (content) {
                this.log.debug(`setting content: ${content}`);
                this.el.innerHTML = content;
            }
            if (parent) {
                this.log.debug("adding to parent");
                parent.appendChild(this.el);
            }
        }
    }
}
function interpolate(str, params) {
    let names = Object.keys(params).map((k)=>`_${k}`);
    let vals = Object.values(params);
    return new Function(...names, `return \`${str.replace(/\$\{(\w*)\}/g, '${_$1}')}\`;`)(...vals);
}
const dom = {
    el: dom_el,
    els,
    ready,
    on,
    onKey
};
function network_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class network_params {
    set(p) {
        for (let [k, v] of Object.entries(p))this.params.set(k, v);
        return this;
    }
    toString() {
        return this.params.toString();
    }
    static render(p) {
        const params = new URLSearchParams();
        if (p) for (let [k, v] of Object.entries(p))params.set(k, v);
        return params.toString();
    }
    constructor(p){
        network_define_property(this, "params", void 0);
        this.params = new URLSearchParams();
        if (p) for (let [k, v] of Object.entries(p))this.params.set(k, v);
        return this;
    }
}
class request {
    auth(token) {
        const header = `Bearer ${token}`;
        this.log.debug(`adding auth token header ${header}`);
        this.opts.headers.Authorization = header;
        return this;
    }
    basicAuth(username, password) {
        const header = `Basic ${btoa(`${username}:${password}`)}`;
        this.log.debug(`adding basic auth header ${header}`);
        this.opts.headers.Authorization = header;
        return this;
    }
    body(body) {
        this.opts.body = body;
        return this;
    }
    build({ path, params: passedParams, override } = {}) {
        if (this.opts.auth && !this.opts.headers.Authorization) if ('string' == typeof this.opts.auth) this.opts.headers.Authorization = `Bearer ${this.opts.auth}`;
        else this.opts.headers.Authorization = `Basic ${btoa(`${this.opts.auth.username}:${this.opts.auth.password}`)}`;
        if (!override) override = {};
        const body = override.body || this.opts.body;
        let url = this.opts.url;
        if (path) url = `${this.opts.url}${path}`;
        let reqParams = this.opts.params;
        if (override.params) reqParams = new network_params(override.params);
        if (passedParams) if (reqParams) reqParams.set(passedParams);
        else reqParams = new network_params(passedParams);
        if (reqParams) {
            this.log.debug(`params: ${reqParams.toString()}`);
            url = `${url}?${reqParams.toString()}`;
        }
        override.headers = override.headers || {};
        this.log.debug(`${this.opts.method} ${url}`);
        return {
            url,
            options: {
                method: override.method || this.opts.method,
                credentials: this.opts.credentials,
                headers: {
                    ...this.opts.headers,
                    ...override.headers
                },
                body: JSON.stringify(body)
            }
        };
    }
    async do({ path, params: passedParams, override = {} } = {}) {
        const { url, options } = this.build({
            path,
            params: passedParams,
            override
        });
        this.log.debug(`${this.opts.method} ${url}`);
        const res = await this.opts.fetch(url, options);
        const expect = override.expect || this.opts.expect;
        if (res.status !== expect) {
            const body = await res.text();
            throw new Error(`bad response ${res.status} !== ${expect}, body: ${body}`);
        }
        this.log.debug(`content type: ${res.headers.get('content-type')}`);
        if ('application/json' === res.headers.get('content-type')) return await res.json();
        return await res.text();
    }
    constructor(opts = {}, verbose = false){
        network_define_property(this, "opts", void 0);
        network_define_property(this, "log", void 0);
        this.log = new logger(verbose ? utils_logLevel.debug : utils_logLevel.none, 'request');
        if (opts.type && 'json' !== opts.type) throw new Error('this class only provides json requests');
        if (!opts.url) throw new Error('must provide url');
        this.opts = opts;
        if (!this.opts.expect) this.opts.expect = 200;
        if (!this.opts.method) this.opts.method = 'GET';
        if (!this.opts.headers) this.opts.headers = {};
        if (!this.opts.credentials) this.opts.credentials = 'omit';
        if (this.opts.params && !(this.opts.params instanceof network_params)) {
            this.log.debug("converting object params to class");
            this.opts.params = new network_params(this.opts.params);
        }
        if (!this.opts.fetch) this.opts.fetch = window.fetch;
        this.log.debug(`with options: ${JSON.stringify(this.opts)}`);
    }
}
class ws {
    setup() {
        this.recursion_level += 1;
        if (this.ws) for(let key in this.event_listeners)this.event_listeners[key].forEach((cb)=>{
            this.ws.removeEventListener(key, cb);
        });
        this.ws = new WebSocket(this.url);
        this.backoff = 100;
        this.ws.addEventListener('open', ()=>{
            const rl = this.recursion_level;
            this.log.debug(`on open: reconnected(${rl})`);
            this.is_connected = true;
            if (!this.ws) return;
            for(let key in this.event_listeners)this.event_listeners[key].forEach((cb)=>{
                if (this.ws) {
                    this.log.debug(`adding listener(${rl}): ${key} `);
                    this.ws.addEventListener(key, cb);
                }
            });
        });
        this.ws.addEventListener('close', ()=>{
            this.log.debug('connection closed');
            this.is_connected = false;
            this.backoff = Math.min(2 * this.backoff, this.max_timeout);
            this.log.debug(`backoff: ${this.backoff} `);
            this.reconnect_timer = window.setTimeout(()=>{
                if (this.should_reconnect) {
                    this.ws = null;
                    this.setup();
                }
            }, this.backoff + 50 * Math.random());
        });
        this.ws.addEventListener('error', this.log.error);
    }
    send(data) {
        if (!this.is_connected || !this.ws) throw new Error('not connected');
        this.ws.send(JSON.stringify(data));
    }
    onMessage(cb) {
        if (!this.ws) throw new Error('ws is null');
        if (!this.event_listeners.message) this.event_listeners.message = [];
        const handler = (e)=>{
            const rl = this.recursion_level;
            this.log.debug(`message(${rl}): ${e.data} `);
            cb(e.data);
        };
        this.event_listeners.message.push(handler);
        this.ws.addEventListener('message', handler);
    }
    onJSON(cb) {
        this.onMessage((d)=>cb(JSON.parse(d)));
    }
    on(event, cb) {
        if (!this.ws) throw new Error('ws is null');
        if (!this.event_listeners[event]) this.event_listeners[event] = [];
        this.event_listeners[event].push(cb);
        this.ws.addEventListener(event, cb);
    }
    close() {
        if (this.reconnect_timer) clearTimeout(this.reconnect_timer);
        if (!this.is_connected || !this.ws) return;
        this.should_reconnect = false;
        this.ws.close();
    }
    constructor(url, verbose = false){
        network_define_property(this, "url", void 0);
        network_define_property(this, "ws", void 0);
        network_define_property(this, "backoff", 100);
        network_define_property(this, "max_timeout", 10000);
        network_define_property(this, "should_reconnect", true);
        network_define_property(this, "is_connected", false);
        network_define_property(this, "recursion_level", 0);
        network_define_property(this, "reconnect_timer", null);
        network_define_property(this, "log", void 0);
        network_define_property(this, "event_listeners", {});
        this.url = url;
        this.ws = null;
        this.log = new logger(verbose ? utils_logLevel.debug : utils_logLevel.none, 'websocket');
        this.setup();
    }
}
class refresh {
    listen() {
        const socket = new ws(this.url);
        if (socket) {
            socket.on('open', ()=>{
                if (this.should_reload) location.reload();
            });
            socket.on('close', ()=>{
                this.should_reload = true;
                setTimeout(this.listen, 500);
            });
        }
    }
    constructor(url){
        network_define_property(this, "url", void 0);
        network_define_property(this, "should_reload", false);
        this.url = url;
    }
}
const network = {
    params: network_params,
    request,
    ws,
    refresh
};
function get(key, _default) {
    let ret = localStorage.getItem(key);
    if (null === ret && null != _default) {
        ret = _default;
        if ('function' == typeof _default) ret = _default();
        set(key, ret);
    }
    return ret;
}
function local_storage_update(key, update1, broadcast = false) {
    const prev = get(key);
    const value = update1(prev);
    if (prev !== value || broadcast) {
        const event = new CustomEvent('@corvid/ls-update', {
            detail: {
                key,
                value
            }
        });
        document.dispatchEvent(event);
    }
    localStorage.setItem(key, value);
}
function set(key, value, broadcast = false) {
    const prev = get(key);
    if (prev !== value || broadcast) {
        const event = new CustomEvent('@corvid/ls-update', {
            detail: {
                key,
                value
            }
        });
        document.dispatchEvent(event);
    }
    localStorage.setItem(key, value);
}
function setObj(update, prefix, broadcast = false) {
    const flatten = (ob)=>{
        const ret = {};
        for(let i in ob)if (ob.hasOwnProperty(i)) if ('object' == typeof ob[i] && null !== ob[i]) {
            const flat = flatten(ob[i]);
            for(let x in flat)if (flat.hasOwnProperty(x)) ret[`${i}.${x}`] = flat[x];
        } else ret[i] = ob[i];
        return ret;
    };
    for (let [k, v] of Object.entries(flatten(update))){
        let key = k;
        if (prefix) key = `${prefix}.${k}`;
        set(key, v, broadcast);
    }
}
function listen(key, cb) {
    document.addEventListener('@corvid/ls-update', (ev)=>{
        if (ev.detail.key === key || '*' === key) {
            if (cb instanceof dom_el) {
                if (ev.detail.key === key) cb.content(ev.detail.value);
                return;
            }
            cb({
                key: ev.detail.key,
                value: ev.detail.value
            });
        }
    });
}
function clear(key) {
    localStorage.removeItem(key);
}
export { clipboard, dom_namespaceObject as dom, genID, utils_logLevel as logLevel, logger, local_storage_namespaceObject as ls, network_namespaceObject as network, strings_namespaceObject as strings, style_namespaceObject as style };
