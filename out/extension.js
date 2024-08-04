"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcludeFormatOnSaveFormatter = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const LoggingService_1 = require("./LoggingService");
class ExcludeFormatOnSaveFormatter {
    loggingService;
    supportedLanguages;
    constructor(loggingService, config) {
        this.loggingService = loggingService;
        this.supportedLanguages = config;
    }
    provideDocumentFormattingEdits(document, options, token) {
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
exports.ExcludeFormatOnSaveFormatter = ExcludeFormatOnSaveFormatter;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    const loggingService = new LoggingService_1.LoggingService();
    registerFormatter(loggingService);
    vscode.workspace.onDidChangeConfiguration(event => {
        // Re-register formatter again.
        registerFormatter(loggingService);
    });
}
// This method is called when your extension is deactivated
function deactivate() { }
function registerFormatter(loggingService) {
    const langsConfig = vscode.workspace.getConfiguration()["lolacod"]?.["exclude-format-on-save"]?.["supportedLanguages"];
    if (langsConfig === undefined) {
        loggingService.logInfo("Configuration with key `lolacod.exclude-format-on-save.supportedLanguages` was not found in settings.json");
    }
    else {
        loggingService.logInfo("Found configuraiton object: " + JSON.stringify(langsConfig));
    }
    if (langsConfig === undefined || Object.keys(langsConfig).length === 0) {
        // Nothing to do.
        return;
    }
    const supportedLanguages = Object.keys(langsConfig);
    vscode.languages.registerDocumentFormattingEditProvider(supportedLanguages, new ExcludeFormatOnSaveFormatter(loggingService, langsConfig));
}
//# sourceMappingURL=extension.js.map