import { Notice, Plugin, TFile } from "obsidian";
import { NoteOpenerPluginSettings, DEFAULT_SETTINGS, NoteOpenerSettingTab } from "./settings"

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

    this.ribbonIcon = this.addRibbonIcon(this.settings.openerNote.icon, this.getCommandName(), (evt: MouseEvent) => {
      this.openNote();
    });
  }

  loadCommands() {
    this.addCommand({
      id: "open-note",
      name: this.getCommandName(),
      callback: () => {
        this.openNote();
      }
    });
  }

  //

  openNote() {
    const file = this.getFile(this.settings.openerNote.path);

    if (file) {
      const leaf = this.app.workspace.getLeaf()
      leaf.openFile(file, { active: true });
    }
    else {
      new Notice("Could not find note '" + this.settings.openerNote.path + "'");
    }
  }

  getFile(path: string): TFile | null {
    return this.app.vault.getAbstractFileByPath(path + ".md") as TFile;
  }

  getCommandName(): string {
    return "Open '" + this.settings.openerNote.path + "'";
  }
}
