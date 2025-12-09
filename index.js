import { dom } from "@taybart/corvid"
import "go"
const el = dom.el

let tools = {
  unscrambled: {},
  "unix-timestamp": {},
}

function makeArgs(values) {
  const ret = []
  for (const key in values) {
    if (!values[key] || key === "__stdin") {
      continue
    }
    ret.push(`--${key}`)
    ret.push(values[key])
  }
  ret.push(values["__stdin"])
  console.log(...ret)
  return ret
}

async function submit(ev) {
  ev.preventDefault()
  const form = new el("#input")
  const toolname = new el("#tools")
  const output = new el("#output")
  output.content("")

  const formData = Object.fromEntries(new FormData(form.el))

  let logoutput = ""

  const ogLog = console.log
  try {
    const go = new Go()
    go.argv.push(...makeArgs(formData))

    const exe = tools[toolname.value()].exe
    if (!exe) {
      throw new Error(`No WASM for ${toolname.value()}`)
    }
    const wasmModule = await WebAssembly.instantiate(exe, go.importObject)
    console.log = function (...args) {
      logoutput += args.join(" ") + "\n"
      // log.apply(console, args);
    }
    await go.run(wasmModule.instance)

    output.content(logoutput.replace(/\n/g, "<br>"))
  } catch (err) {
    console.error(`WASM error: ${err}`)
    output.content(`Error: ${err.message}`)
  } finally {
    console.log = ogLog
  }
}

// Load WASM bytes once on page load
async function loadWasmModules() {
  for (let tool in tools) {
    try {
      let response = await fetch(`tools/${tool}/main.wasm`)
      tools[tool].exe = await response.arrayBuffer()
      response = await fetch(`tools/${tool}/args.json`)
      tools[tool].args = await response.json()
      tools[tool].args.push({
        long: "__stdin",
        short: "__stdin",
        help: "stdin",
        example: "stdin",
      })
    } catch (err) {
      throw new Error(`Failed to load WASM for ${tool}: ${err}`)
    }
  }
}

async function addArgs(toolArgs) {
  const args = new el("#args").empty()
  // const stdin = new el("#stdin")
  // if (Object.keys(toolArgs).length === 0) {
  //   // stdin.style({ display: "block" })
  //
  //   return
  // }
  // stdin.style({ display: "none" })

  toolArgs.forEach((arg) => {
    const label = new el({ type: "label", parent: args, content: arg.long })
    const input = new el({ type: "input", parent: label })
    // replace with tooltip of arg.help
    input.el.name = arg.long || arg.short
    input.el.placeholder = arg.example
  })
}

dom.ready(() => {
  el.query("#input").on("submit", submit)
  const t = new el("#tools")
  for (let tool in tools) {
    new el({ type: "option", parent: t, content: tool }).value(tool)
  }
  t.value("unix-timestamp")

  loadWasmModules()
    .then(() => {
      addArgs(tools[t.value()].args)
    })
    .catch((err) => console.error(err))
  t.on("change", (ev) => {
    const args = tools[ev.target.value].args
    addArgs(args)
    // console.log(args)
  })
});
