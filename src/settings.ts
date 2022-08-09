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
  openerNote: OpenerNote;
}

export const DEFAULT_SETTINGS: NoteOpenerPluginSettings = {
  openerNote: new OpenerNote("", "note-glyph")
}

export class NoteOpenerSettingTab extends PluginSettingTab {
  plugin: NoteOpenerPlugin;

  constructor(app: App, plugin: NoteOpenerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "General Settings" });

    new Setting(containerEl)
      .setName("Note to open")
      .setDesc("Desc")
      .addText(text => text
        .setPlaceholder("Path to note")
        .setValue(this.plugin.settings.openerNote.path)
        .onChange(async (value) => {
          console.log("Note: " + value);
          this.plugin.settings.openerNote.path = value;
          await this.plugin.saveSettings();
          this.plugin.loadRibbon();
          this.plugin.loadCommands();
        }));

    new Setting(containerEl)
    .setName("Ribbon icon")
    .setDesc("Desc")
    .addText(text => text
      .setPlaceholder("Icon name")
      .setValue(this.plugin.settings.openerNote.icon)
      .onChange(async (value) => {
        console.log("Icon: " + value);
        this.plugin.settings.openerNote.icon = value;
        await this.plugin.saveSettings();
        this.plugin.loadRibbon();
      }));
  }
}
