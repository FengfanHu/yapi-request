import { Uri, workspace, WorkspaceFolder } from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { CONFIG_FILE_NAME, CONFIG_FILE_NAME_JS } from "./consts";

export function getWorkspaceFolders(): readonly WorkspaceFolder[] {
  return workspace.workspaceFolders ?? [];
}

export function getWorkspaceFolder(uri: Uri): WorkspaceFolder | undefined {
  return workspace.getWorkspaceFolder(uri);
}

export async function getProjectRoot(): Promise<WorkspaceFolder> {
  const workspaces: readonly WorkspaceFolder[] = getWorkspaceFolders();
  if (workspaces.length === 0) {
    return {
      uri: Uri.file(process.cwd()),
      name: path.basename(process.cwd()),
      index: 0,
    };
  } else if (workspaces.length === 1) {
    return workspaces[0];
  } else {
    let rootWorkspace = workspaces[0];

    for (const w of workspaces) {
      if (await fs.pathExists(w.uri.fsPath)) {
        rootWorkspace = w;
      }
    }
    return rootWorkspace;
  }
}

export async function isFileExists(fileNames: string[]): Promise<boolean> {
  const workspaceFolder = await getProjectRoot();
  if (workspaceFolder) {
    const files = fileNames?.map((fileName) =>
      Uri.joinPath(workspaceFolder.uri, fileName)
    );

    const results = await Promise.all(
      files?.map((path) => fs.pathExists(path.fsPath))
    );
    return results.some(Boolean);
  }
  return false;
}

export async function isConfigExists(): Promise<boolean> {
  return isFileExists([CONFIG_FILE_NAME, CONFIG_FILE_NAME_JS]);
}
