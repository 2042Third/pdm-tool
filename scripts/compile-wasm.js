const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const rootDir = path.resolve(__dirname, "../");

const ensureWasmOutputDirExists = () => {
  console.log("Preparing wasm output folder...\n");

  const src = path.resolve(rootDir, "src/assets/wasm");
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    for (let file of files) {
      fs.unlinkSync(path.join(src, file));
    }
  } else {
    fs.mkdirSync(src);
  }
};

const compileWasmSources = () => {
  console.log("Compiling wasm sources...");
  const pdm_crypt_dir='security/emscripten';
  const wasmDir = path.resolve(rootDir, "src/app/"+pdm_crypt_dir);
  // for (let item of fs.readdirSync(wasmDir)) {
    const itemPath = wasmDir;


    const buildFilePath = path.join(itemPath, "build-cmd.js");
    const { cmd } = require(buildFilePath);

    // fix for Windows
    const formattedCmd = cmd.replace("$(pwd)", rootDir);

    console.log("\nCompiling wasm source for", chalk.green(pdm_crypt_dir));
    console.log(formattedCmd);
    execSync(formattedCmd, { cwd: rootDir, stdio: "inherit" });
  // }
};

ensureWasmOutputDirExists();
compileWasmSources();
console.log("\nAll sources have been successfully compiled.");
