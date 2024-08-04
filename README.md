# format-on-save-per-folder README

Formatter that enable to exclude files in folders from being formatted on save.

## Features

Exclude folders from being formatted on save, based on per language type configuration.

## Requirements

This formatter is a proxy formatter that uses other formatters commands, and does not do formatting by itself. Other foramtters for example Pettier, should be installed as an extension.

## Extension Settings

As of verion 0.0.1 there is not explicit exposure of the needed configurations to VSCode, thus when updating the settings.json file, needed configurations might be greyed out, please ignore it for now. In order for the plugin to work the settings.json file, needs to be updated as shown in the example below:

At the top level a dictionary describing languages and it's *command* to execute:

```json
  "lolacod.exclude-format-on-save.supportedLanguages": {
    "json": "prettier.forceFormatDocument",
    "python" : "ruff.executeFormat"
  },
```

Then in each of the language section, change or add the line: 

`editor.defaultFormatter": "lolacod.exclude-format-on-save"` 

Additionally to exclude folders from formatting on save add `lolacod.exclude-format-on-save.excludeFolders` key.

Example:

```json
    "lolacod.exclude-format-on-save.excludeFolders": [
      "src/excludedFolder"
    ]
```


Example of possible `settings.json` file contents:

```json
{
  "lolacod.exclude-format-on-save.supportedLanguages": {
    "json": "prettier.forceFormatDocument",
    "python" : "ruff.executeFormat"
  },

  "[json]": {
    "editor.defaultFormatter": "lolacod.exclude-format-on-save",
    "editor.formatOnSave": true,
  },
  "[python]": {
    "editor.defaultFormatter": "lolacod.exclude-format-on-save",
    "editor.formatOnSave": true,
    "lolacod.exclude-format-on-save.excludeFolders": [
      "src/excludedFolder"
    ]
  }
}
```

### How To Know Formatter Command

This is a little bit tricky part, and not always possible, but most of the good extensions, expose a command to format document. 

Usually it should be possible to find the command with the folliwing steps:

1. Go to command pallete `Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux .
2. Type the word format, from the list of commands try and see which one you would use. For example for prettier the name of the command is: 
   `Format Document (Forced)`
3. Click on the `gear wheel` next to the command, it says `Configure Keybindings` when hovering over it.
4. In the next window look at the top row that starts with: `@command:`, all the part after `:` is the command name to grab, and use it in the `lolacod.exclude-format-on-save.supportedLangs` configurations.


## Known Issues

* If a file format was made with the formatter, need to click save twice. Hold the `Cmd` (Mac) \ `Ctrl` (Win \ Linux) key, and press twice `s`, to make sure file is saved.
* This extension can work only with formatters that expose their format document operation as a *command* to vscode.

## Release Notes

### 0.0.1

Initial release.

**Enjoy!**
