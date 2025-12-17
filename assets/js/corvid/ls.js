function toKebab(str) {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, ofs)=>(ofs ? '-' : '') + s.toLowerCase());
}
function render(style) {
    let s = '';
    Object.entries(style).forEach(([k, v])=>s += `${toKebab(k)}:${v};`);
    return s;
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
var utils_logLevel = /*#__PURE__*/ function(logLevel) {
    logLevel[logLevel["none"] = -1] = "none";
    logLevel[logLevel["error"] = 0] = "error";
    logLevel[logLevel["warn"] = 1] = "warn";
    logLevel[logLevel["info"] = 2] = "info";
    logLevel[logLevel["debug"] = 3] = "debug";
    logLevel[logLevel["trace"] = 4] = "trace";
    return logLevel;
}({});
class utils_logger {
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
        this.log = new utils_logger(verbose ? utils_logLevel.debug : utils_logLevel.none, 'element');
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
export { clear, get, listen, set, setObj, local_storage_update as update };
