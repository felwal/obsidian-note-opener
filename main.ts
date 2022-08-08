import { App, Notice, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";

interface NoteOpenerPluginSettings {
  note: string;
  icon: string;
}

const DEFAULT_SETTINGS: NoteOpenerPluginSettings = {
  note: "",
  icon: "note-glyph"
}

export default class NoteOpenerPlugin extends Plugin {
  settings: NoteOpenerPluginSettings;
  ribbonIcon: HTMLElement | null = null;

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
    // if reloading the ribbon, unload previous icon
    if (this.ribbonIcon) {
      this.ribbonIcon.remove();
    }

    this.ribbonIcon = this.addRibbonIcon(this.settings.icon, "Open note", (evt: MouseEvent) => {
      this.openNote();
    });
  }

  loadCommands() {
    this.addCommand({
      id: "open-note",
      name: "Open note",
      callback: () => {
        this.openNote();
      }
    });
  }

  //

  openNote() {
    const file = this.app.vault.getAbstractFileByPath(this.settings.note + ".md") as TFile;

    if (file) {
      const leaf = this.app.workspace.getLeaf()
      leaf.openFile(file, { active: true });
    }
    else {
      new Notice("Could not find note '" + this.settings.note + "'");
    }
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
