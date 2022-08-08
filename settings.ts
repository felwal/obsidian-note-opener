import { App, PluginSettingTab, Setting } from "obsidian";
import NoteOpenerPlugin from "./main"

export interface NoteOpenerPluginSettings {
  note: string;
  icon: string;
}

export const DEFAULT_SETTINGS: NoteOpenerPluginSettings = {
  note: "",
  icon: "note-glyph"
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
        .setValue(this.plugin.settings.note)
        .onChange(async (value) => {
          console.log("Note: " + value);
          this.plugin.settings.note = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
    .setName("Ribbon icon")
    .setDesc("Desc")
    .addText(text => text
      .setPlaceholder("Icon name")
      .setValue(this.plugin.settings.icon)
      .onChange(async (value) => {
        console.log("Icon: " + value);
        this.plugin.settings.icon = value;
        await this.plugin.saveSettings();
        this.plugin.loadRibbon();
      }));
  }
}
