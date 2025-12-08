import { dom } from "@taybart/corvid";
import "go";
const el = dom.el;

let tools = {
  unscrambled: null,
};

async function submit(ev) {
  ev.preventDefault();
  const input = el.query("#args");
  const toolname = el.query("#tools");
  const output = el.query("#output");
  output.el.innerHTML = "";

  let logoutput = "";

  const log = console.log;
  console.log = function (...args) {
    logoutput += args.join(" ") + "\n";
    // log.apply(console, args);
  };

  try {
    const go = new Go();
    go.argv.push(input.value());

    const exe = tools[toolname.value()];
    if (!exe) {
      throw new Error(`No WASM for ${toolname.value()}`);
    }
    const wasmModule = await WebAssembly.instantiate(exe, go.importObject);
    await go.run(wasmModule.instance);

    output.el.innerHTML = logoutput.replace(/\n/g, "<br>");
  } catch (err) {
    console.error("WASM error:", err);
    output.el.innerHTML = `Error: ${err.message}`;
  } finally {
    console.log = log;
  }
}

// Load WASM bytes once on page load
async function loadWasmModules() {
  Object.keys(tools).forEach(async (tool) => {
    try {
      const response = await fetch(tool);
      tools[tool] = await response.arrayBuffer();
    } catch (err) {
      throw new Error(`Failed to load WASM for ${tool}: ${err}`);
    }
  });
}

dom.ready(() => {
  loadWasmModules().catch((err) => console.error(err));
  el.query("#input").on("submit", submit);
  const t = new el("#tools");
  for (let tool in tools) {
    new el({ type: "option", parent: t, content: tool }).value(tool);
  }
});
