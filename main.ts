import { App, Plugin, PluginSettingTab } from "obsidian";

interface NoteOpenerPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: NoteOpenerPluginSettings = {
  mySetting: "",
}

export default class NoteOpenerPlugin extends Plugin {
  settings: NoteOpenerPluginSettings;

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();
    this.loadRibbon();
    this.loadCommands();

    this.addSettingTab(new NoteOpenerSettingTab(this.app, this));
  }

  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  loadRibbon() {
  }

  loadCommands() {
  }
}

class NoteOpenerSettingTab extends PluginSettingTab {
  plugin: NoteOpenerPlugin;

  constructor(app: App, plugin: NoteOpenerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "General Settings" });
  }
}
