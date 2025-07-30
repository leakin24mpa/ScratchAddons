import { getFirstTextContent, getFolderName, getFolderPath, isCollapsed, isHidden, isInAnyFolder} from "./folder-path-util.js";


const FOLDER_IMAGE_DATA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gNTUgNDAgTCA2MCAzMCBMIDkwIDMwIEwgOTUgNDAgTCA5NSA5NSBMIDUgOTUgTCA1IDQwIFoiPjwvcGF0aD4KPC9zdmc+';


export function createFolderXML(Blockly, workspace){
  let xmlList = [];


  let mutations = Blockly.Procedures.allProcedureMutations(workspace);
  mutations = Blockly.Procedures.sortProcedureMutations_(mutations);
  let names = mutations.map((m) => {
    let name = m.getAttribute('proccode');
    let path;
    if(isInAnyFolder(name)){
      path = getFolderPath(name, true);
      path.pop();
    }
    else{
      path = [];
    }
    return {
      mutation: m,
      //grab folder names from block definition
      path: path
    }});
  let folderTree = {
    blocks: [],
    folders: {}
  };
  function addBlockToFolderTree(tree, block){
    if(block.path && block.path.length > 0){
      let subFolder = block.path[0];
      if(!tree.folders[subFolder]){
        tree.folders[subFolder] = {
          blocks: [],
          folders: {}
        }
      }
      block.path.splice(0, 1);
      addBlockToFolderTree(tree.folders[subFolder], block);
    }
    else{
      tree.blocks.push(block.mutation);
    }
  }
  names.map((block) => {
    addBlockToFolderTree(folderTree, block);
  });

  function folderTreeToXML(tree, pathName){
    let xmlList = [];
    for(let i = 0; i < tree.blocks.length; i++){
      let block = document.createElement('block');
      block.setAttribute('type', 'procedures_call');
      block.setAttribute("name", tree.blocks[i].getAttribute("proccode"));
      block.setAttribute('gap', 16);
      block.appendChild(tree.blocks[i]);
      xmlList.push(block);
    }
    for(var f in tree.folders){
      let subFolder = document.createElement('folder');
      subFolder.setAttribute("folder-name", getFolderName(f));
      subFolder.setAttribute("folder-path", f);
      subFolder.setAttribute("is-collapsed", isCollapsed(f));
      subFolder.setAttribute("is-hidden", isHidden(f));
      subFolder.append(...folderTreeToXML(tree.folders[f], pathName + "/" + f));
      xmlList.push(subFolder);
    }
    return xmlList;
  }


  xmlList.push(...folderTreeToXML(folderTree, ""));

  const parentItem = document.createElement("sa-my-blocks");
  parentItem.append(...xmlList);
  const output = [];
  Blockly.Procedures.addCreateButton_(workspace, output);
  output.push(parentItem);
  return output;
}

function createPopupDiv(pathList, x, y){
  const div = document.createElement("div");
  let html = "";
  pathList.forEach(element => {
    html += `<span class="sa-folder-separator">▸</span><span>${getFolderName(element)}</span>`
  });
  div.innerHTML = html;
  div.style.position = "absolute";
  div.style.top = y + "px";
  div.style.left = x + "px";
  div.classList.add("sa-custom-block-folder-popup");
  return div;
}
//the createAllInputs function creates the custom block's SVG representation from its text string content (proccode)
//this addon uses a modded version of this function to add the folder icon to the beginning of custom blocks that are inside folders
export function getCreateAllInputs(Blockly){
return function(connectionMap) {
  // Split the proc into components, by %n, %b, and %s (ignoring escaped).
  var procComponents = this.procCode_.split(/(?=[^\\]%[nbs])/);
  procComponents = procComponents.map(function(c) {
    return c.trim(); // Strip whitespace.
  });


  //identify if this custom block is in a folder
  if(isInAnyFolder(this.procCode_)){
    let field = new Blockly.FieldImage(FOLDER_IMAGE_DATA, 20, 20, false);

    //append the folder icon to the beginning of the block's SVG representation
    this.appendDummyInput("non-empty-name").appendField(field);
    field.init();
    let div;
    field.fieldGroup_.addEventListener("mouseenter", (e) => {
      div = createPopupDiv(getFolderPath(this.procCode_, true), e.clientX, e.clientY);
      document.body.appendChild(div);
    });
    field.fieldGroup_.addEventListener("mouseleave", (e) => {
      div.remove();
    })
    //remove the filepath section of the block's name (ex. "/my folder/other folder/block" => "block")
    let shortenedText = getFirstTextContent(this.procCode_);
    if(shortenedText[0] == '%'){
      procComponents.splice(0, 1);
    }
    else{
      procComponents[0] = shortenedText;
    }
  }

  // Create arguments and labels as appropriate.
  var argumentCount = 0;
  for (var i = 0, component; component = procComponents[i]; i++) {
    var labelText;
    if (component.substring(0, 1) == '%') {
      var argumentType = component.substring(1, 2);
      if (!(argumentType == 'n' || argumentType == 'b' || argumentType == 's')) {
        throw new Error(
            'Found an custom procedure with an invalid type: ' + argumentType);
      }
      labelText = component.substring(2).trim();

      var id = this.argumentIds_[argumentCount];

      var input = this.appendValueInput(id);
      if (argumentType == 'b') {
        input.setCheck('Boolean');
      }
      this.populateArgument_(argumentType, argumentCount, connectionMap, id,
          input);
      argumentCount++;
    } else {
      labelText = component.trim();
    }
    this.addProcedureLabel_(labelText.replace(/\\%/, '%'));
  }
};
};
