import { moddedLayout, moddedShow} from './modded-layout.js';

export default async function ({ addon, console, msg, safeMsg }){
  const ScratchBlocks = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;
  const ns = "http://www.w3.org/2000/svg";


  function myCustomBlocks(workspace){
    let xmlList = [];

    ScratchBlocks.Procedures.addCreateButton_(workspace, xmlList);


    let button = document.createElement('test');


    button.setAttribute('text', "A Custom Element");

    xmlList.push(button);

    let mutations = ScratchBlocks.Procedures.allProcedureMutations(workspace);
    let names = mutations.map((m) => m.getAttribute('proccode'));
    console.log(names);

    console.log(xmlList);
    return xmlList;

  }

  function renderFolders(){
    let canvas = document.querySelector(".ScratchBlocksFlyout .ScratchBlocksWorkspace .ScratchBlocksBlockCanvas");
    let categoryLabels = canvas.getElementsByClassName("ScratchBlocksFlyoutLabel categoryLabel");
    let myBlocks = categoryLabels[8];
    let rect = document.createElementNS(ns, "rect");
    rect.setAttribute("width", )
    console.log(categoryLabels);
  }

  ScratchBlocks.Flyout.prototype.show = function (xmlList) {
    let workspace;
    if (ScratchBlocks.registry)
      workspace = this.targetWorkspace; // new Blockly
    else workspace = this.workspace_;

    workspace.registerToolboxCategoryCallback(ScratchBlocks.PROCEDURE_CATEGORY_NAME, myCustomBlocks);
    moddedShow.call(this, xmlList, ScratchBlocks);
  };

  ScratchBlocks.VerticalFlyout.prototype.layout_ = function(contents, gaps){
    moddedLayout.call(this, contents, gaps, ScratchBlocks);
  };


}
