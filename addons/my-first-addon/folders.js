import { getFirstTextContent, getFolderName, getFolderPath, isBlockHidden, isBlockInFolder, isCollapsed, isHidden, isInAnyFolder, isModified, setCollapsed, setHidden } from "./folder-path-util.js";
import { createTreeViewSVG } from "./tree-view-svg.js";

const ns = "http://www.w3.org/2000/svg";
const FOLDER_IMAGE_DATA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gNTUgNDAgTCA2MCAzMCBMIDkwIDMwIEwgOTUgNDAgTCA5NSA5NSBMIDUgOTUgTCA1IDQwIFoiPjwvcGF0aD4KPC9zdmc+';

export function createFolderSVG(Blockly, XMLitem, workspace, vm, getParentPath){
  const elt = document.createElementNS(ns, "g");

  const folderName = XMLitem.getAttribute("folder-name");
  const hidden = XMLitem.getAttribute("is-hidden") == "true";
  const collapsed = XMLitem.getAttribute("is-collapsed") == "true";

  let thisPath = XMLitem.getAttribute("folder-path");
  const getPath = () => getParentPath() + "/" + thisPath;

  const collapseCallback = (value) => {
    const newName = setCollapsed(thisPath, value);

    let ogPath = getPath();
    let newPath = getParentPath() + "/" + newName;
    renameFolder(Blockly, workspace, vm, ogPath, newPath);
    thisPath = newName;
    workspace.refreshToolboxSelection_();
  }
  const hideCallback = (value, forceUpdate) => {
    if(!forceUpdate && value == isHidden(thisPath)){
      return;
    }
    const newName = setHidden(thisPath, value);
    let ogPath = getPath();
    let newPath = getParentPath() + "/" + newName;
    renameFolder(Blockly, workspace, vm, ogPath, newPath);
    thisPath = newName;

    //check if block was already hidden by a parent folder
    if(isBlockHidden(newPath)){
      return;
    }

    let blocks = workspace.targetWorkspace.getAllBlocks().filter((b) =>
      b.type == 'procedures_definition' && isBlockInFolder(b.childBlocks_[0].procCode_,thisPath)
    );
    blocks.map((b) => {
      const blockShouldHide = isBlockHidden(b.childBlocks_[0].procCode_);
      b.svgGroup_.setAttribute("visibility", blockShouldHide? "hidden" : "visible");
      setScriptMovability(b, !blockShouldHide);
    });
  }
  const renameCallback = (text) => {
    let ogPath = getPath();
    let newPath = getParentPath() + "/" + text + (isModified(thisPath) ? thisPath.at(-1) : "");
    renameFolder(Blockly, workspace, vm, ogPath, newPath);
    thisPath = newPath;
  }



  elt.append(createTreeViewSVG(Blockly, workspace, folderName, collapsed, hidden, collapseCallback, hideCallback, renameCallback));
  if(collapsed){
    return { element: elt, height: 40};
  }


  let cursorY = 50;
  for(let i = 0; i < XMLitem.childNodes.length; i++){
    let xml = XMLitem.childNodes[i];
    let createdSVG;
    let height;
    if(xml.tagName == 'BLOCK'){
      let blockSVG = Blockly.Xml.domToBlock(xml, workspace);
      createdSVG = blockSVG.svgGroup_;
      height = 65;
    }
    else if(xml.tagName == 'FOLDER'){
      let subFolder = createFolderSVG(Blockly, xml, workspace, vm, getPath);
      createdSVG = subFolder.element;
      height = subFolder.height;
      cursorY += 20;
    }

    createdSVG.setAttribute("transform", `translate(20, ${cursorY})`);
    elt.appendChild(createdSVG);
    cursorY += height;
  }
  let line = document.createElementNS(ns, "line");
  line.setAttribute("x1", 4);
  line.setAttribute("y1", 40);
  line.setAttribute("x2", 4);
  line.setAttribute("y2", cursorY);
  line.setAttribute("stroke-width", 1);
  line.setAttribute("stroke", "#adadadff");
  elt.appendChild(line);
  return { element: elt, height: cursorY};
}

export function createFolderXML(Blockly, workspace){
  let xmlList = [];


  let mutations = Blockly.Procedures.allProcedureMutations(workspace);
  mutations = Blockly.Procedures.sortProcedureMutations_(mutations);
  let names = mutations.map((m) => {
    let name = m.getAttribute('proccode');
    let path;
    let displayName;
    if(isInAnyFolder(name)){
      path = getFolderPath(name, true);
      displayName = path.pop();
    }
    else{
      path = [];
      displayName = name;
    }


    return {
      name: displayName,
      mutation: m,
      //grab folder names from block definition
      path: path
    }});

  console.log(names);
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
      tree.blocks.push({name: block.name, mutation: block.mutation});
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
      block.setAttribute("name", tree.blocks[i].name);
      block.setAttribute('gap', 16);
      block.appendChild(tree.blocks[i].mutation);
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

  Blockly.Procedures.addCreateButton_(workspace, xmlList);
  xmlList.push(...folderTreeToXML(folderTree, ""));


  return xmlList;

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


//Since Scratch can't store the folder strucure in the sb3 file, we have to store all the folder information in the names of the custom blocks themselves
//so renaming a folder just consists of renaming every custom block inside that folder
function renameFolder(Blockly, workspace, vm, pathToFolder, newName){
  if(pathToFolder === newName){
    return;
  }
  //get all custom block names in the current sprite
  let mutations = Blockly.Procedures.allProcedureMutations(workspace.targetWorkspace);
  let procedures = mutations.map((m) => m.getAttribute('proccode'));


  if(procedures.some((p) => isBlockInFolder(p, newName))){
    //Folder already exists
    alert(`A folder named "${newName}" already exists`);
    return;
  }
  let blocksToRename = procedures.filter((p) =>isBlockInFolder(p, pathToFolder));
  console.log(blocksToRename);

  let newNames = blocksToRename.map((p) => newName + p.substring(pathToFolder.length));
  console.log(newNames);


  let blocks = workspace.targetWorkspace.getAllBlocks().filter((b) => b.type == 'procedures_prototype' || b.type == 'procedures_call');
  let flyoutBlocks = workspace.getAllBlocks().filter((b) => b.type == 'procedures_call');
  blocks.push(...flyoutBlocks);


  for(let i = 0; i < blocks.length; i++){
    let indexToReplace = blocksToRename.indexOf(blocks[i].procCode_);
    if(indexToReplace >= 0){

      blocks[i].procCode_ = newNames[indexToReplace];
      blocks[i].updateDisplay_();
      let vm_block = vm.runtime.flyoutBlocks.getBlock(blocks[i].id) || vm.editingTarget.blocks.getBlock(blocks[i].id);
      if(vm_block){
        vm_block.mutation.proccode = blocks[i].procCode_;
      }
    }
  }

}

function setScriptMovability(parentBlock, isMovable){
  parentBlock.movable_ = isMovable;
  parentBlock["sa-frozen"] = !isMovable;
  for(let i = 0; i < parentBlock.childBlocks_.length; i++){
    setScriptMovability(parentBlock.childBlocks_[i], isMovable);
  }
}
