import { app, BrowserWindow } from "electron";
import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const isDev = !app.isPackaged;
// Set by the Playwright test fixtures, which start the Nuxt server themselves via `webServer`.
const skipServerSpawn = process.env.ELECTRON_SKIP_SERVER_SPAWN === "1";

let serverProcess;
let mainWindow;

function waitForServer(url, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tryConnect = () => {
      http
        .get(url, (res) => {
          res.destroy();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Timed out waiting for ${url}`));
            return;
          }
          setTimeout(tryConnect, 300);
        });
    };
    tryConnect();
  });
}

function startNuxtServer() {
  if (isDev) {
    const nuxtBin = path.join(
      __dirname,
      "node_modules",
      ".bin",
      process.platform === "win32" ? "nuxt.cmd" : "nuxt",
    );
    serverProcess = spawn(nuxtBin, ["dev", "--port", String(PORT)], {
      cwd: __dirname,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
  } else {
    // Built by `npm run build`, served via Electron's own Node runtime.
    const serverEntry = path.join(__dirname, ".output", "server", "index.mjs");
    serverProcess = spawn(process.execPath, [serverEntry], {
      cwd: path.dirname(serverEntry),
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: String(PORT),
        HOST: "0.0.0.0",
        ELECTRON_RUN_AS_NODE: "1",
      },
    });
  }

  serverProcess.on("exit", (code) => {
    if (code !== null && code !== 0)
      console.error(`Nuxt server exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(SERVER_URL);
}

app.whenReady().then(async () => {
  if (!skipServerSpawn) startNuxtServer();
  await waitForServer(SERVER_URL);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  serverProcess?.kill();
});
