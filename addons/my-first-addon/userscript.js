export default async function ({ addon, console, msg, safeMsg }){
  const ScratchBlocks = await addon.tab.traps.getBlockly();
  const vm = addon.tab.traps.vm;


  function myCustomBlocks(workspace){
    var xmlList = [];

    ScratchBlocks.Procedures.addCreateButton_(workspace, xmlList);
    var button = document.createElement('button');
    var msg = "A Custom Button";
    var callbackKey = 'CUSTOM_BUTTON';
    var callback = function() {
      console.log("click");
    };
    button.setAttribute('text', msg);
    button.setAttribute('callbackKey', callbackKey);
    workspace.registerButtonCallback(callbackKey, callback);

    xmlList.push(button);
    console.log(xmlList);
    return xmlList;

  }



  const oldShow = ScratchBlocks.Flyout.prototype.show;
  ScratchBlocks.Flyout.prototype.show = function (xmlList) {
    let workspace;
    if (ScratchBlocks.registry)
      workspace = this.targetWorkspace; // new Blockly
    else workspace = this.workspace_;
    console.log(ScratchBlocks.PROCEDURE_CATEGORY_NAME);
    workspace.registerToolboxCategoryCallback(ScratchBlocks.PROCEDURE_CATEGORY_NAME, myCustomBlocks);
    return oldShow.call(this, xmlList);
  };





}
