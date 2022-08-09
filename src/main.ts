import { Notice, Plugin, TFile } from "obsidian";
import { OpenerNote, NoteOpenerPluginSettings, DEFAULT_SETTINGS, NoteOpenerSettingTab } from "./settings"

export default class NoteOpenerPlugin extends Plugin {
  settings: NoteOpenerPluginSettings;
  ribbonIcons: Array<HTMLElement> = new Array();

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();
    this.loadRibbon();
    //this.loadCommands();
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
      const openerNote = this.settings.openerNotes[i];

      const ic = this.addRibbonIcon(openerNote.icon, this.getTooltip(openerNote), (evt: MouseEvent) => {
        this.openNote(openerNote.path);
      });
      this.ribbonIcons.push(ic);
    }
  }

  loadCommands() {
    // TODO: remove commands before reloading

    for (var i = 0; i < this.settings.openerNotes.length; i++) {
      const openerNote = this.settings.openerNotes[i];
      this.addCommand({
        id: "open-note-" + i,
        name: this.getTooltip(openerNote),
        callback: () => {
          this.openNote(openerNote.path);
        }
      });
    }
  }

  //

  openNote(path: string) {
    const file = this.getFile(path);

    if (file) {
      const leaf = this.app.workspace.getLeaf()
      leaf.openFile(file, {active: true});
    }
    else {
      new Notice("Could not find note '" + path + "'");
    }
  }

  getFile(path: string): TFile | null {
    return this.app.vault.getAbstractFileByPath(path + ".md") as TFile;
  }

  getTooltip(openerNote: OpenerNote): string {
    return "Open '" + openerNote.path + "'";
  }
}
