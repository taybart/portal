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
export { network as default, network_params as params, refresh, request, ws };
