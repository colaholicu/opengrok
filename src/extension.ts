// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { config } from 'process';
import * as vscode from 'vscode';
import { env } from 'vscode';

export function getConfig() {
	const url = vscode.workspace.getConfiguration('opengrok').serverURL;
	const project = vscode.workspace.getConfiguration('opengrok').defaultProjectName;
	return { url, project };
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('opengrok.searchDefaultProject', () => {
		const {url, project} = getConfig();
		if (!url) {
			vscode.window.showErrorMessage("Server URL is empty.");
			return;
		}
		if (!project) {
			vscode.window.showErrorMessage("Default Project is not set.");
			return;
		}

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const selectedText = document.getText(selection);
			const query = url + "/search?project=" + project + "&q=" + selectedText + "&defs=&refs=&path=&hist=&type=";
			env.openExternal(vscode.Uri.parse(query));
		}

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
