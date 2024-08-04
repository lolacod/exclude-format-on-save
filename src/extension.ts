// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {  DocumentFormattingEditProvider } from 'vscode';
import { LoggingService } from './LoggingService';



export class ExcludeFormatOnSaveFormatter implements DocumentFormattingEditProvider {
	
	private readonly loggingService: LoggingService;
	private readonly supportedLanguages: { [key: string]: string };
  
	constructor(loggingService: LoggingService, config: { [key: string]: string }) {
	  this.loggingService = loggingService;
	  this.supportedLanguages = config;
	}	
	
	provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
		const langConfig = vscode.workspace.getConfiguration(`[${document.languageId}]`);
		this.loggingService.logInfo(`Saving for file: ${document.uri.path}`);
		const excludedFolders = langConfig["lolacod.exclude-format-on-save.excludeFolders"];
		this.loggingService.logInfo(`Excluded folders list for this file: ${excludedFolders}`);
		const documentRelativePath = vscode.workspace.asRelativePath(document.uri);
		this.loggingService.logInfo(`File relative path: ${documentRelativePath}`);
		if (Array.isArray(excludedFolders) && excludedFolders.length > 0) {
			for (let folder of excludedFolders) {
				if (documentRelativePath.startsWith(folder)) {
					// No need to do formatting just return
					this.loggingService.logInfo(`file ${documentRelativePath} is in excluded folder ${folder}`);
					return [];
				}
			}
		}
		
		const executeCommand = this.supportedLanguages[document.languageId];
		this.loggingService.logInfo(`file ${documentRelativePath} is formatted with command: ${executeCommand}`);
		vscode.commands.executeCommand(executeCommand, document).then(() => vscode.workspace.save(document.uri));

		return [];
	}

}




// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const loggingService = new LoggingService();
	registerFormatter(loggingService);
	vscode.workspace.onDidChangeConfiguration(event => {
		// Re-register formatter again.
		registerFormatter(loggingService);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }


function registerFormatter(loggingService: LoggingService) {
	const langsConfig = vscode.workspace.getConfiguration()["lolacod"]?.["exclude-format-on-save"]?.["supportedLanguages"];
	if (langsConfig === undefined) {
		loggingService.logInfo("Configuration with key `lolacod.exclude-format-on-save.supportedLanguages` was not found in settings.json");
	} else {
		loggingService.logInfo("Found configuraiton object: " + JSON.stringify(langsConfig));
	}

	if (langsConfig === undefined || Object.keys(langsConfig).length === 0) {
		// Nothing to do.
		return;
	}
	const supportedLanguages = Object.keys(langsConfig) as ReadonlyArray<string>;
	vscode.languages.registerDocumentFormattingEditProvider(supportedLanguages, new ExcludeFormatOnSaveFormatter(loggingService, langsConfig));
}