// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { oneParamFunc, towParamsFunc } from './constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension is now active!');
  vscode.commands.registerCommand('extension.import-lodash-sub-module', function (name) {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      // Get the word within the selection
      editor.edit(editBuilder => {
        const importLine = `import ${name} from 'lodash/${name}';`;
        if (!document.getText().includes(importLine)) {
          editBuilder.insert(document.positionAt(0), importLine + '\n');
        }
      });
    }
  });
  const provider = vscode.languages.registerCompletionItemProvider(['javascript', 'typescript'], {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      // return all completion items as array
      return [...oneParamFunc, ...towParamsFunc].map(method => {
        const snippetCompletion = new vscode.CompletionItem(`${method}`);
        snippetCompletion.filterText = `_${method}`;
        snippetCompletion.detail = `lodash/${method}`;
        const str = oneParamFunc.includes(method) ? `${method}($1)` : `${method}($1, $2)`;
        snippetCompletion.insertText = new vscode.SnippetString(str);
        snippetCompletion.command = {
          command: 'extension.import-lodash-sub-module',
          arguments: [method],
          title: 'import-lodash-sub-module...'
        };
        return snippetCompletion;
      });
    }
  });

  context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() { }
