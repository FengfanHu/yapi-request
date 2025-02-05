import {
  ExtensionContext,
  ExtensionMode,
  Uri,
  Webview,
  WebviewPanel,
  WebviewView,
} from "vscode";
import { readFileSync } from "fs";
import { join } from "path";
import { modifyHtml } from "html-modifier";

export type ViewProviderOptions = {
  distDir: string;
  indexPath: string;
};

export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export abstract class AbstractViewProvider {
  // 这个是在前端应用插入代码的标识，用于在 index.html 文件适应的位置插入内容
  static WEBVIEW_INJECT_IN_MARK = "__webview_public_path__";

  /**
   * 构造方法
   * @param context 该插件的上下文，在插件激活时可以获取
   */
  constructor(
    protected context: ExtensionContext,
    protected viewProviderOptions: ViewProviderOptions
  ) {}

  /**
   * 用于实现 webviewView 的处理逻辑，例如：html 赋值、通讯、设置 webviewView 参数等
   * @param webviewView 可以为 vscode.WebviewView 或者 vscode.WebviewPanel 的实例
   */
  abstract resolveWebviewView(webviewView: WebviewView | WebviewPanel): void;

  /**
   * 处理前端应用 index.html 文件的方法
   * @param webview vscode.Webview 类型，指向 vscode.WebviewView 的一个属性：webview
   * @returns 处理好的 index.html 文本内容
   */
  protected async getWebviewHtml(webview: Webview) {
    const isProd = this.context.extensionMode === ExtensionMode.Production;

    // See https://github.com/jallen-dev/vscode-react-starter for hmr.
    if (!isProd) {
      const localPort = "5173";
      const localServerUrl = `localhost:${localPort}`;
      const scriptUri = `http://${localServerUrl}/src/pages/sidebar/main.tsx`;

      const reactRefresh = /*html*/ `
      <script type="module">
        import RefreshRuntime from "http://localhost:5173/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>`;

      const reactRefreshHash =
        "sha256-YmMpkm5ow6h+lfI3ZRp0uys+EUCt6FOyLkJERkfVnTY=";

      const csp = [
        `default-src 'none';`,
        `script-src 'unsafe-eval' https://* ${`http://${localServerUrl} http://0.0.0.0:${localPort} '${reactRefreshHash}'`}`,
        `style-src ${webview.cspSource} 'self' 'unsafe-inline' https://*`,
        `font-src ${webview.cspSource}`,
        `connect-src https://* ${`ws://${localServerUrl} ws://0.0.0.0:${localPort} http://${localServerUrl} http://0.0.0.0:${localPort}`}`,
      ];

      return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Security-Policy" content="${csp.join("; ")}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VSCode React Starter</title>
      </head>
      <body>
        <div id="root"></div>
        ${isProd ? "" : reactRefresh}
        <script type="module" src="${scriptUri}"></script>
      </body>
    </html>`;
    }

    const { distDir, indexPath } = this.viewProviderOptions;
    const webviewUri = webview
      .asWebviewUri(Uri.joinPath(this.context.extensionUri, distDir))
      .toString();

    const htmlPath = join(this.context.extensionPath, indexPath);
    const htmlText = readFileSync(htmlPath).toString();
    return await modifyHtml(htmlText, {
      onopentag(name, attribs) {
        if (name === "script") {
          attribs.src = join(webviewUri, attribs.src);
        }
        if (name === "link") {
          attribs.href = join(webviewUri, attribs.href);
        }
        return { name, attribs };
      },
    });
  }
}
