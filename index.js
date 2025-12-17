import { dom } from "@taybart/corvid"
import "go"
const Go = globalThis.Go

const el = dom.el

const tools = {
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

async function loadWasmModules() {
  await Promise.allSettled(
    Object.entries(tools).map(async ([name, tool]) => {
      try {
        const response = await fetch(`tools/${name}/main.wasm`)
        tool.exe = await response.arrayBuffer()
      } catch (err) {
        throw new Error(`Failed to load WASM for ${tool}: ${err}`)
      }
    }),
  )
}
async function loadArgs() {
  await Promise.allSettled(
    Object.entries(tools).map(async ([name, tool]) => {
      try {
        const response = await fetch(`tools/${name}/args.json`)
        tool.args = await response.json()
      } catch (err) {
        tool.args = []
      } finally {
        tool.args.push({ long: "__stdin" })
      }
    }),
  )
}

async function addArgs(toolArgs) {
  const args = new el("#args").empty()

  const add = (arg) => {
    const label = new el({ type: "label", parent: args, content: arg.long })
    const input = new el({ type: "input", parent: label })
    // replace with tooltip of arg.help
    input.el.type = "text"
    input.el.name = arg.long || arg.short
    input.el.placeholder = arg.help
  }
  toolArgs.forEach(add)
}

async function submit(ev) {
  ev.preventDefault()
  const form = new el("#input")
  const toolname = new el("#tools")
  const output = new el("#output")
  output.content("")

  const formData = Object.fromEntries(new FormData(form.el))

  try {
    const go = new Go()
    go.argv.push(...makeArgs(formData))

    const exe = tools[toolname.value()].exe
    if (!exe) {
      throw new Error(`No WASM for ${toolname.value()}`)
    }
    const wasmModule = await WebAssembly.instantiate(exe, go.importObject)
    await go.run(wasmModule.instance)

    console.log("output:", globalThis.wasmOutput)
    if (!globalThis.wasmOutput) {
      output.content("Done")
      return
    }
    output.content(globalThis.wasmOutput.replace(/\n/g, "<br>"))
    globalThis.wasmOutput = ""
  } catch (err) {
    console.error(`WASM error: ${err}`)
    output.content(`Error: ${err.message}`)
  }
}

dom.ready(() => {
  el.query("#input").on("submit", submit)
  const t = new el("#tools")
  for (let tool in tools) {
    new el({ type: "option", parent: t, content: tool }).value(tool)
  }
  t.value("unix-timestamp")
  t.on("change", (ev) => {
    addArgs(tools[ev.target.value].args)
  })

  loadWasmModules()
  loadArgs()
    .then(() => {
      addArgs(tools[t.value()].args)
    })
    .catch((err) => console.error(err))
});
