// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { config } from 'process';
import * as vscode from 'vscode';
import { env } from 'vscode';

export function getConfig() {
	const url = vscode.workspace.getConfiguration('opengrok').serverURL;
	const project = vscode.workspace.getConfiguration('opengrok').defaultProjectName;
	const additionalProjects = vscode.workspace.getConfiguration('opengrok').additionalProjectNames;
	return { url, project, additionalProjects };
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let openAtLine = vscode.commands.registerCommand('opengrok.openFileAtLine', () => {
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
			const filePath = editor.document.uri.path;
			const line = editor.selection.active.line + 1;
			let relativePath = '';
			if(vscode.workspace.workspaceFolders !== undefined) {
				const rootPath = vscode.workspace.workspaceFolders[0].uri.path ;
				relativePath = filePath.split(rootPath)[1];
			}
			else {
				vscode.window.showErrorMessage("An error occured when retriveing path. Make sure the workspace/folder is valid!");
				return;
			}
			const query = url + "/xref/" + project + relativePath + "#" + line.toString();
			env.openExternal(vscode.Uri.parse(query));
		}

	});

	let searchDefaultProject = vscode.commands.registerCommand('opengrok.searchDefaultProject', () => {
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

	let searchAdditionalProjects = vscode.commands.registerCommand('opengrok.searchAdditionalProjects', () => {
		const {url, project, additionalProjects} = getConfig();
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
			const query = url + "/search?project=" + projectsQueryString + "&q=" + selectedText + "&defs=&refs=&path=&hist=&type=";
			env.openExternal(vscode.Uri.parse(query));
		}

	});	

	
	context.subscriptions.push(openAtLine);
	context.subscriptions.push(searchDefaultProject);
	context.subscriptions.push(searchAdditionalProjects);
}

// this method is called when your extension is deactivated
export function deactivate() {}
