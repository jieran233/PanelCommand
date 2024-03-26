/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

// Inspired by the macOS app 'One Thing'
// Extension uses elements from 'Just Another Search Bar' (https://extensions.gnome.org/extension/5522/just-another-search-bar/)

import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init(settings) {
            super._init(0.0, _('Panel Cmd'));

            this.buttonInPanel = new St.Label({
                text: '⌘',
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });

            this.add_child(this.buttonInPanel);

            /* ------------------------------- Panel Command ------------------------------- */
            this.noteInPanel = new St.Label({
                text: settings.get_string('command'),
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            
            let boxes = {
                left: Main.panel._leftBox,
                center: Main.panel._centerBox,
                right: Main.panel._rightBox
            };

            let gravities = {
                left: -1,
                center: -1,
                right: 0,
                far_left: 0,
                far_right:-1
            }

            // this.add_child(this.noteInPanel);
            
            // boxes['left'].insert_child_at_index(this.noteInPanel, gravities['left']);
            // boxes['right'].insert_child_at_index(this.noteInPanel, gravities['right']);
            boxes['center'].insert_child_at_index(this.noteInPanel, gravities['center']);
            // boxes['left'].insert_child_at_index(this.noteInPanel, gravities['far_left']);
            // boxes['right'].insert_child_at_index(this.noteInPanel, gravities['far_right']);

            /* ----------------------------- Command Entry Box ----------------------------- */
            this.entry = new St.Entry({
                text: settings.get_string('command'),
                can_focus: true,
                track_hover: true
            });

            this.entry.set_primary_icon(new St.Icon({
                icon_name: 'document-edit-symbolic',
                style_class: 'popup-menu-icon',
            }));

            this.entry.clutter_text.connect('text-changed', () => {
                let text = this.entry.get_text();
                settings.set_string('command', text);
                this.updateCommandOutput(text);
            });

            let popupEdit = new PopupMenu.PopupMenuSection();
            popupEdit.actor.add_child(this.entry);

            this.menu.addMenuItem(popupEdit);
            this.menu.actor.add_style_class_name('note-entry');
            
            // Update command output during initialization
            this.updateCommandOutput(settings.get_string('command'));

            // Polling update command output
            this.updateInterval = setInterval(() => {
                let command = settings.get_string('command');
                this.updateCommandOutput(command);
            }, 1000);
        }

        async updateCommandOutput(command) {
            try {
                const output = await execCommunicate(['/bin/bash', '-c', command]);
                this.noteInPanel.text = output;
            } catch (error) {
                logError(error.message);
                this.noteInPanel.text = _('Error executing command');
            }
        }
    });

async function execCommunicate(argv, input = null, cancellable = null) {
    let cancelId = 0;
    let flags = Gio.SubprocessFlags.STDOUT_PIPE |
                Gio.SubprocessFlags.STDERR_PIPE;

    if (input !== null)
        flags |= Gio.SubprocessFlags.STDIN_PIPE;

    const proc = new Gio.Subprocess({argv, flags});
    proc.init(cancellable);

    if (cancellable instanceof Gio.Cancellable)
        cancelId = cancellable.connect(() => proc.force_exit());

    try {
        const [stdout, stderr] = await proc.communicate_utf8_async(input, null);

        const status = proc.get_exit_status();

        if (status !== 0) {
            throw new Gio.IOErrorEnum({
                code: Gio.IOErrorEnum.FAILED,
                message: stderr ? stderr.trim() : `Command '${argv}' failed with exit code ${status}`,
            });
        }

        return stdout.trim();
    } finally {
        if (cancelId > 0)
            cancellable.disconnect(cancelId);
    }
}

function logError(message) {
    // Replace this with your error logging mechanism, e.g., Main.notifyError()
    log(message);
}

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._indicator = new Indicator(this._settings);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.entry.disconnect();
        this._indicator.destroy();
        clearInterval(this._indicator.updateInterval);
        this._indicator.buttonInPanel.destroy();
        this._indicator.noteInPanel.destroy();
        this._indicator = null;
        this._settings = null;
    }
}
