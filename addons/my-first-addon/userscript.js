import { createPathString, getFolderPath, isBlockInFolder, isInAnyFolder } from './folder-path-util.js';
import { createFolderXML, getCreateAllInputs } from './folders.js';
import { moddedLayout, moddedShow} from './modded-layout.js';

export default async function ({ addon, console, msg, safeMsg }){
  const ScratchBlocks = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;



  ScratchBlocks.Blocks.procedures_call.createAllInputs_ = getCreateAllInputs(ScratchBlocks);
  ScratchBlocks.Blocks.procedures_prototype.createAllInputs_ = getCreateAllInputs(ScratchBlocks);

  ScratchBlocks.Flyout.prototype.show = function (xmlList) {
    let workspace;
    if (ScratchBlocks.registry)
      workspace = this.targetWorkspace; // new Blockly
    else workspace = this.workspace_;

    workspace.registerToolboxCategoryCallback(ScratchBlocks.PROCEDURE_CATEGORY_NAME, (workspace) => createFolderXML(ScratchBlocks, workspace));
    console.log(vm);
    moddedShow.call(this, xmlList, ScratchBlocks, vm);
  };

  ScratchBlocks.VerticalFlyout.prototype.layout_ = function(contents, gaps){
    moddedLayout.call(this, contents, gaps, ScratchBlocks);
  };


}
