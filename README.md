# opengrok-vscode

OpenGrok extension for VS Code

## Features

* Search for selected text within multiple projects
* Open a file at a line in the default project

## Extension Settings

This extension contributes the following settings:

* `opengrok-vscode.serverURL`: the OpenGrok's server URL
* `opengrok-vscode.defaultProjectName`: the default project to search/open file in
* `opengrok-vscode.additionalProjectNames`: additional projects used to search
* `opengrok-vscode.showInContextMenu`: toggles the commands' visibility in the context menu
* `opengrok-vscode.openExternal`: the command will open the result with the system default application (in browser, e.g.) or in VS Code
* `opengrok-vscode.useActiveColumn`: applicable only if `opengrok-vscode.openExternal` is `true`, will open the results in the active column

Note: if `opengrok-vscode.additionalProjectNames` is left empty, `opengrok-vscode.searchAdditionalProjects` won't be visible in the context menu

## Release Notes

### 1.1.0

Added support for showing the results inside VS Code (with the help of https://github.com/xionxiao)

### 1.0.2

Minor package fixes

### 1.0.0

Initial release.

-----------------------------------------------------------------------------------------------------------

**Enjoy!**