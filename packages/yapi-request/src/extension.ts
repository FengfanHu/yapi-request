// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ViewProviderSidebar } from "./view-provider/view-provider-sidebar";
import { ViewProviderPanel } from "./view-provider/view-provider-panel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  /** 注册 Panel Webview */
  const panelViewDisposable = vscode.commands.registerCommand(
    "yapi-request.showConfiguration",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "yapi-request-configuration",
        "Yapi Request 配置",
        vscode.ViewColumn.One,
        {}
      );
      const viewProviderPanel = new ViewProviderPanel(context);
      viewProviderPanel.resolveWebviewView(panel as any);
    }
  );

  /** 注册 Sidebar Webview */
  const viewProviderSidebar = new ViewProviderSidebar(context);
  const sidebarViewDisposable = vscode.window.registerWebviewViewProvider(
    "sidebar-view",
    viewProviderSidebar
  );

  context.subscriptions.push(sidebarViewDisposable, panelViewDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
