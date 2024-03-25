#!/usr/bin/env python3
import subprocess
import json
import time
import requests
import os

def get_hitokoto(c='i', default='落霞与孤鹜齐飞，秋水共长天一色', interval=300, tmpfile='/tmp/hitokoto_panelcommand.json'):

    def request_and_cache(c):
        # https://developer.hitokoto.cn/sentence/
        try:
            url = f'https://v1.hitokoto.cn/?encode=text&c={c}'
            r = requests.get(url, timeout=3)
        except:
            return default
        
        if r.text == '':
            return default

        text = r.text.rstrip('。？！.?!')

        data_w = json.dumps({'time': int(time.time()), 'text': text})
        with open(tmpfile, 'w') as f:
            f.write(data_w)
        
        return text


    if os.path.exists(tmpfile):
        # cache exists
        with open(tmpfile) as f:
            data_r = json.loads(f.read())

        if int(time.time()) >= int(data_r['time']) + interval:
            # cache is in time
            return request_and_cache(c)
        else:
            # cache is out of time
            return data_r['text']

    else:
        # cache does not exist
        return request_and_cache(c)


result = subprocess.run(['gdbus', 'call', '--session', '--dest', 'org.gnome.Shell', '--object-path', '/org/gnome/shell/extensions/FocusedWindow', '--method', 'org.gnome.shell.extensions.FocusedWindow.Get'], capture_output=True, text=True)

output = result.stdout[2:-4]

data = json.loads(output)
title = data.get('title')

if title is None:
    print(get_hitokoto())
else:
    print(title)
