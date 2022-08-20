import { App, PluginSettingTab, Setting } from "obsidian";
import NoteOpenerPlugin from "./main"

export class OpenerNote {
  path: string;
  icon: string;

  constructor(path: string, icon: string) {
    this.path = path;
    this.icon = icon;
  }
}

export interface NoteOpenerPluginSettings {
  openerNotes: Array<OpenerNote>;
}

export const DEFAULT_SETTINGS: NoteOpenerPluginSettings = {
  openerNotes: [new OpenerNote("", "note-glyph")]
}

export class NoteOpenerSettingTab extends PluginSettingTab {
  plugin: NoteOpenerPlugin;

  constructor(app: App, plugin: NoteOpenerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const {containerEl} = this;

    containerEl.empty();
    containerEl.createEl("h1", {text: "Note Opener"});
    containerEl.createEl("h2", {text: "Shortcuts"});

    if (this.plugin.settings.openerNotes.length == 0) {
      containerEl.createEl("p", {text: "You currently have no shortcuts."});
    }

    // note shortcuts
    for (var i = 0; i < this.plugin.settings.openerNotes.length; i++) {
      const openerNote = this.plugin.settings.openerNotes[i];

      new Setting(containerEl)
      .setName("Open ...")
      .addText(text => text
        .setPlaceholder("Path: folder/note")
        .setValue(openerNote.path)
        .onChange(async (value) => {
          console.log("note: " + value);
          openerNote.path = value;

          await this.plugin.saveSettings();
          this.plugin.loadRibbon();
        })
      )
      .addText(text => text
        .setPlaceholder("Icon name")
        .setValue(openerNote.icon)
        .onChange(async (value) => {
          console.log("icon: " + value);
          openerNote.icon = value;

          await this.plugin.saveSettings();
          this.plugin.loadRibbon();
        })
      )
      .addButton(button => button
        .setIcon("trash")
        .setTooltip("Delete")
        .setWarning()
        .onClick(async (callback) => {
          console.log("shortcut removed");
          this.plugin.settings.openerNotes.remove(openerNote);

          await this.plugin.saveSettings();
          this.display();
          this.plugin.loadRibbon();
        })
      )
    }

    // add shortcut
    new Setting(containerEl)
      .addButton(button => button
        .setButtonText("Add shortcut")
        .onClick(async (callback) => {
          console.log("shortcut added");
          this.plugin.settings.openerNotes.push(new OpenerNote("", "note-glyph"));

          await this.plugin.saveSettings();
          this.display();
          this.plugin.loadRibbon();
        })
      )
  }
}
