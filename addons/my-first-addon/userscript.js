import { moddedLayout, moddedShow} from './modded-layout.js';

export default async function ({ addon, console, msg, safeMsg }){
  const ScratchBlocks = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;



  function myCustomBlocks(workspace){
    let xmlList = [];



    for(let i = 0; i < 2; i++){
      let folder = document.createElement('folder');


      folder.setAttribute('text', "A Custom Element");
      folder.innerHTML = `<block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`;
      xmlList.push(folder);
    }


    let mutations = ScratchBlocks.Procedures.allProcedureMutations(workspace);
    let names = mutations.map((m) => m.getAttribute('proccode'));
    console.log(names);

    ScratchBlocks.Procedures.addCreateButton_(workspace, xmlList);
    console.log(xmlList);
    return xmlList;

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
