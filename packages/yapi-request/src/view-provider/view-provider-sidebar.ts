import { ExtensionContext, WebviewView } from "vscode";
import { AbstractViewProvider } from "./view-provider-abstract";
import { isConfigExists } from "../core";
import { Dove, MsgType } from "shared";

export class ViewProviderSidebar extends AbstractViewProvider {
  dove?: Dove;

  constructor(context: ExtensionContext) {
    super(context, {
      distDir: "out/webview",
      indexPath: "out/webview/src/pages/sidebar/index.html",
    });
  }

  resolveWebviewView = async (webviewView: WebviewView) => {
    const { webview } = webviewView;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };
    webview.html = await this.getWebviewHtml(webview);
    const dove = new Dove((data: unknown) =>
      webviewView.webview.postMessage(data)
    );
    webviewView.webview.onDidReceiveMessage(dove.receiveMessage);
    this.dove = dove;
    webviewView.onDidDispose(() => this.onUnMount?.());
    this.onMount?.();
  };

  onUnMount = () => {};

  onMount = () => {
    this.dove?.subscribe(MsgType.IS_CONFIG_EXISTS, isConfigExists);
  };
}
