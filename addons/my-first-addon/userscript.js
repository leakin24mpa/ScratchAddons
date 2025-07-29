import { getFolderName, setCollapsed, setHidden} from './folder-path-util.js';
import { createFolderXML, getCreateAllInputs } from './folders.js';
import { moddedLayout, moddedShow} from './modded-layout.js';
import { createTreeViewSVG } from './tree-view-svg.js';

export default async function ({ addon, console, msg, safeMsg }){
  const ScratchBlocks = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;


  ScratchBlocks.Blocks.procedures_call.createAllInputs_ = getCreateAllInputs(ScratchBlocks);
  ScratchBlocks.Blocks.procedures_prototype.createAllInputs_ = getCreateAllInputs(ScratchBlocks);

  const oldCanConnect = ScratchBlocks.Connection.prototype.canConnectWithReason_;
  ScratchBlocks.Connection.prototype.canConnectWithReason_ = function(target){
    if(this.sourceBlock_["sa-frozen"] || target.sourceBlock_["sa-frozen"]){
      if(!(this.sourceBlock_["sa-frozen"] && target.sourceBlock_["sa-frozen"])){
        return ScratchBlocks.Connection.REASON_SHADOW_PARENT;
      }
    }
    return oldCanConnect.call(this, target);
  }

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
