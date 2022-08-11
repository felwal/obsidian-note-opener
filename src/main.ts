import { Notice, Plugin, TFile } from "obsidian";
import { OpenerNote, NoteOpenerPluginSettings, DEFAULT_SETTINGS, NoteOpenerSettingTab } from "./settings"

export default class NoteOpenerPlugin extends Plugin {
  settings: NoteOpenerPluginSettings;
  ribbonIcons: Array<HTMLElement> = new Array();

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();
    this.loadRibbon();
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
    // remove previous icons before reloading
    for (var i = 0; i < this.ribbonIcons.length; i++) {
      this.ribbonIcons[i].remove();
    }

    for (var i = 0; i < this.settings.openerNotes.length; i++) {
      this.addOpenerNoteRibbonIcon(this.settings.openerNotes[i]);
    }
  }

  //

  addOpenerNoteRibbonIcon(openerNote: OpenerNote) {
    const file = this.getFile(openerNote.path);
    const displayName = file != null ? file?.basename : openerNote.path;
    const tooltip = "Open '" + displayName + "'";

    const ic = this.addRibbonIcon(openerNote.icon, tooltip, (evt: MouseEvent) => {
      if (file) {
        this.openNote(file);
      }
      else {
        new Notice("Could not find note '" + openerNote.path + "'");
      }
    });

    this.ribbonIcons.push(ic);
  }

  openNote(file: TFile) {
    this.app.workspace.getLeaf().openFile(file, {active: true});
  }

  getFile(path: string): TFile | null {
    return this.app.vault.getAbstractFileByPath(path + ".md") as TFile;
  }
}
