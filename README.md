# Panel Note
![screenshot](./images/screen1.png)

Add a small note to your GNOME panel. 

[<img src="https://github.com/GittyMac/PanelNote/assets/28932047/e4bec66e-ee85-40d6-b7e5-95cbdc781e27" height="100">](https://extensions.gnome.org/extension/6718/panel-note/)


> [!NOTE]
> This extension is inspired by the macOS app "One Thing."

## Usage
![screenshot](./images/screen2.png)

When you enable the extension, the default note will appear on your panel. To edit the note, simply click on the note and type in your new note.

## Warning

Please note that once you change something, the command is executed immediately, which may lead to dangerous commands being executed incorrectly, so it is recommended to always copy and paste to change the command

## Acknowledgments

In building this project, we would like to acknowledge the contributions of the following projects:

- https://github.com/GittyMac/PanelNote
- https://github.com/xelad0m/just-another-search-bar
- https://github.com/fablevi/OnTheTop/blob/main/schemas/org.gnome.shell.extensions.on-the-top.gschema.xml
- https://github.com/corecoding/Vitals/blob/c2348f1da1668bc6cf421b7cf7c73ceb86c1dfdc/extension.js#L300

```shell
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/shell/extensions/FocusedWindow --method org.gnome.shell.extensions.FocusedWindow.Get | sed 's/^\(.*\)$/\1/' | awk '{print substr($0, 3, length($0)-5)}' | jq -r '.title' | awk '{ if ($0 == "null") { print "" } else { print $0 } }'
```

```shell
```

```shell
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/shell/extensions/FocusedWindow --method org.gnome.shell.extensions.FocusedWindow.Get | sed 's/^\(.*\)$/\1/' | awk '{print substr($0, 3, length($0)-5)}' | jq -r '.title' | awk '{ if ($0 == "null") { system("curl https://v1.hitokoto.cn/?encode=text&c=i") } else { print $0 } }'
```