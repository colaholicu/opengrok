// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { env } from 'vscode';

export function getConfig() {
	const url = vscode.workspace.getConfiguration('opengrok-vscode').serverURL;
	const project = vscode.workspace.getConfiguration('opengrok-vscode').defaultProjectName;
	const additionalProjects = vscode.workspace.getConfiguration('opengrok-vscode').additionalProjectNames;
	const openExternal = vscode.workspace.getConfiguration('opengrok-vscode').openExternal;
	return { url, project, additionalProjects, openExternal };
}

const getWebviewContent = (src: string) => (`<!DOCTYPE html>
<html lang="en"">
<head>
	<meta charset="UTF-8">
	<title>Preview</title>
	<style>
		html { width: 100%; height: 100%; min-height: 100%; display: flex; }
		body { flex: 1; display: flex; }
		iframe { flex: 1; border: none; background: white; }
	</style>
</head>
<body>
	<iframe src="${src}"></iframe>
</body>
</html>`);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let openAtLine = vscode.commands.registerCommand('opengrok-vscode.openFileAtLine', () => {
		const { url, project, openExternal } = getConfig();
		if (!url) {
			vscode.window.showErrorMessage("Server URL is empty.");
			return;
		}
		if (!project) {
			vscode.window.showErrorMessage("Default Project is not set.");
			return;
		}

		const useActiveColumn = vscode.workspace.getConfiguration('opengrok-vscode').useActiveColumn;

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const filePath = editor.document.uri.path;
			const line = editor.selection.active.line + 1;
			let relativePath = '';
			if (vscode.workspace.workspaceFolders !== undefined) {
				const rootPath = vscode.workspace.workspaceFolders[0].uri.path;
				relativePath = filePath.split(rootPath)[1];
			}
			else {
				vscode.window.showErrorMessage("An error occured when retriveing path. Make sure the workspace/folder is valid!");
				return;
			}
			const query = url + "/xref/" + project + relativePath + "#" + line.toString();
			if (!openExternal) {
				const panel = vscode.window.createWebviewPanel(
					'opengrok', // Identifies the type of the webview. Used internally
					'OpenGrok', // Title of the panel displayed to the user
					useActiveColumn ? vscode.ViewColumn.Active : vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
					{} // Webview options. More on these later.
				);
				panel.webview.html = getWebviewContent(query);
			} else {
				env.openExternal(vscode.Uri.parse(query));
			}
		}

	});

	let searchDefaultProject = vscode.commands.registerCommand('opengrok-vscode.searchDefaultProject', () => {
		const { url, project, openExternal } = getConfig();
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
			const useActiveColumn = vscode.workspace.getConfiguration('opengrok-vscode').useActiveColumn;			

			// Get the word within the selection
			const selectedText = document.getText(selection);
			const query = url + "/search?project=" + project + "&full=" + selectedText + "&defs=&refs=&path=&hist=&type=";
			if (!openExternal) {
				const panel = vscode.window.createWebviewPanel(
					'opengrok', // Identifies the type of the webview. Used internally
					'OpenGrok', // Title of the panel displayed to the user
					useActiveColumn ? vscode.ViewColumn.Active : vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
					{} // Webview options. More on these later.
				);
				panel.webview.html = getWebviewContent(query);
			} else {
				env.openExternal(vscode.Uri.parse(query));
			}
		}

	});

	let searchAdditionalProjects = vscode.commands.registerCommand('opengrok-vscode.searchAdditionalProjects', () => {
		const { url, project, additionalProjects, openExternal } = getConfig();
		if (!url) {
			vscode.window.showErrorMessage("Server URL is empty.");
			// return;
		}
		if (!project) {
			vscode.window.showErrorMessage("Default Project is not set.");
			// return;
		}
		if (!additionalProjects) {
			vscode.window.showWarningMessage("Additional Projects not set.");
		}

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const useActiveColumn = vscode.workspace.getConfiguration('opengrok-vscode').useActiveColumn;

			// Get the word within the selection
			const selectedText = document.getText(selection);
			const projectsArray = additionalProjects.replace(' ', '').split(',');
			let projectsQueryString: string = project;
			projectsArray.forEach((project: string) => {
				let trimmedProject = project.trim();
				if (trimmedProject.length !== 0) {
					projectsQueryString += "&project=" + trimmedProject;
				}
			});
			const query = url + "/search?project=" + projectsQueryString + "&full=" + selectedText + "&defs=&refs=&path=&hist=&type=";
			if (!openExternal) {
				const panel = vscode.window.createWebviewPanel(
					'opengrok', // Identifies the type of the webview. Used internally
					'OpenGrok', // Title of the panel displayed to the user
					useActiveColumn ? vscode.ViewColumn.Active : vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
					{} // Webview options. More on these later.
				);
				panel.webview.html = getWebviewContent(query);
			} else {
				env.openExternal(vscode.Uri.parse(query));
			}
		}

	});


	context.subscriptions.push(openAtLine);
	context.subscriptions.push(searchDefaultProject);
	context.subscriptions.push(searchAdditionalProjects);
}

// this method is called when your extension is deactivated
export function deactivate() { }
