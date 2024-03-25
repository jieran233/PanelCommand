#!/usr/bin/env python3
import subprocess
import json
import time

result = subprocess.run(['gdbus', 'call', '--session', '--dest', 'org.gnome.Shell', '--object-path', '/org/gnome/shell/extensions/FocusedWindow', '--method', 'org.gnome.shell.extensions.FocusedWindow.Get'], capture_output=True, text=True)

output = result.stdout[2:-4]

data = json.loads(output)
title = data.get('title')

if title is None:
    print(time.strftime("%m-%d %H:%M", time.localtime()))
else:
    print(title)
