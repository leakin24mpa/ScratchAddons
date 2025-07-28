import { createPathString, getFirstTextContent, getFolderPath, isInFolder, toggleHidden } from "./folderPathUtil.js";

const ns = "http://www.w3.org/2000/svg";
const FOLDER_IMAGE_DATA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gNTUgNDAgTCA2MCAzMCBMIDkwIDMwIEwgOTUgNDAgTCA5NSA5NSBMIDUgOTUgTCA1IDQwIFoiPjwvcGF0aD4KPC9zdmc+';
const SHOWN_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4yICgzOTA2OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+c2hvdy1pY29uLWFjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzaG93LWljb24tYWN0aXZlIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9IiM4NTVDRDYiPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMCwgMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41MDkxMjk1LDQuMzY0NzA5ODcgQzE0LjE1MDUxOTUsNS4yNjc4NTU2NiAxNC4xNzY1OTc2LDYuNzUzMjE5MjUgMTMuNTA5MTI5NSw3LjYzNTI5MDA5IEMxMy41MDkxMjk1LDcuNjM1MjkwMDkgMTEuNDc0NDQwMSwxMS41IDYuOTk5OTk5OTksMTEuNSBDMi41MjU1NTk4NiwxMS41IDAuNDkwODcwNDQsNy42MzUyOTAwOSAwLjQ5MDg3MDQ0LDcuNjM1MjkwMDkgQy0wLjE1MDUxOTUxOCw2LjczMjE0NDMgLTAuMTc2NTk3NTcxLDUuMjQ2NzgwNzEgMC40OTA4NzA0NCw0LjM2NDcwOTg3IEMwLjQ5MDg3MDQ0LDQuMzY0NzA5ODcgMi41MjU1NTk4NiwwLjUgNi45OTk5OTk5OSwwLjUgQzExLjQ3NDQ0MDEsMC41IDEzLjUwOTEyOTUsNC4zNjQ3MDk4NyAxMy41MDkxMjk1LDQuMzY0NzA5ODcgWiBNNi45OTg4OTQxMiw5Ljk5ODg5NDEyIEM5LjIwNzcyNzcsOS45OTg4OTQxMiAxMC45OTgzNDEyLDguMjA4MjgwNjggMTAuOTk4MzQxMiw1Ljk5OTQ0NzA2IEMxMC45OTgzNDEyLDMuNzkwNjEzNDQgOS4yMDc3Mjc3LDIgNi45OTg4OTQxMiwyIEM0Ljc5MDA2MDUsMiAyLjk5OTQ0NzA2LDMuNzkwNjEzNDQgMi45OTk0NDcwNiw1Ljk5OTQ0NzA2IEMyLjk5OTQ0NzA2LDguMjA4MjgwNjggNC43OTAwNjA1LDkuOTk4ODk0MTIgNi45OTg4OTQxMiw5Ljk5ODg5NDEyIFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjciIGN5PSI2IiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==";
const HIDDEN_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4yICgzOTA2OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aGlkZS1pY29uLWFjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJoaWRlLWljb24tYWN0aXZlIiBmaWxsPSIjODU1Q0Q2Ij4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSIgaWQ9IkNvbWJpbmVkLVNoYXBlIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLjA2Njc1NTM3LDEwLjU2Njk1MzEgQzAuOTk5Mjk5OTQ3LDkuNjAxMDA2MyAwLjQ5MDg3MDQ0LDguNjM1MjkwMDkgMC40OTA4NzA0NCw4LjYzNTI5MDA5IEMtMC4xNTA1MTk1MTgsNy43MzIxNDQzIC0wLjE3NjU5NzU3MSw2LjI0Njc4MDcxIDAuNDkwODcwNDQsNS4zNjQ3MDk4NyBDMC40OTA4NzA0NCw1LjM2NDcwOTg3IDIuNTI1NTU5ODYsMS41IDYuOTk5OTk5OTksMS41IEM4LjMxNjcyMTE4LDEuNSA5LjQyMjE2MzY4LDEuODM0Njc3OTggMTAuMzI2NjUsMi4zMDcwNTg0MiBMMTEuOTczNzA4NSwwLjY1OTk5OTk2NyBMMTIuNjgwODE1MiwxLjM2NzEwNjc1IEwxLjM2NzEwNjc1LDEyLjY4MDgxNTIgTDAuNjU5OTk5OTY3LDExLjk3MzcwODUgTDIuMDY2NzU1MzcsMTAuNTY2OTUzMSBaIE05LjA2MTUwNDQ3LDMuNTcyMjAzOTYgQzguNDU5MjUzMSwzLjIwODk3MzIxIDcuNzUzNDc3NzYsMyA2Ljk5ODg5NDEyLDMgQzQuNzkwMDYwNSwzIDIuOTk5NDQ3MDYsNC43OTA2MTM0NCAyLjk5OTQ0NzA2LDYuOTk5NDQ3MDYgQzIuOTk5NDQ3MDYsNy43NTQwMzA3MSAzLjIwODQyMDI3LDguNDU5ODA2MDUgMy41NzE2NTEwMiw5LjA2MjA1NzQxIEw1LjA3ODE2NjQ1LDcuNTU1NTQxOTggQzUuMDI3MjcxMzksNy4zNzkxNjI3MSA1LDcuMTkyNzY2MTQgNSw3IEM1LDUuODk1NDMwNSA1Ljg5NTQzMDUsNSA3LDUgQzcuMTkyNzY2MTQsNSA3LjM3OTE2MjcxLDUuMDI3MjcxMzkgNy41NTU1NDE5OCw1LjA3ODE2NjQ1IEw5LjA2MTUwNDQ3LDMuNTcyMjAzOTYgWiBNMy42ODc1NzI0NCwxMS43MDAzNDk1IEw0Ljk1MTg3NjAxLDEwLjQzNjA0NTkgQzUuNTUwNzAyNDEsMTAuNzkzNTA2OSA2LjI1MDgxMjg5LDEwLjk5ODg5NDEgNi45OTg4OTQxMiwxMC45OTg4OTQxIEM5LjIwNzcyNzcsMTAuOTk4ODk0MSAxMC45OTgzNDEyLDkuMjA4MjgwNjggMTAuOTk4MzQxMiw2Ljk5OTQ0NzA2IEMxMC45OTgzNDEyLDYuMjUxMzY1ODMgMTAuNzkyOTU0LDUuNTUxMjU1MzUgMTAuNDM1NDkzLDQuOTUyNDI4OTUgTDExLjk0NDU4OTcsMy40NDMzMzIyMSBDMTMuMDA0MzAyOCw0LjQwNTgzNjc2IDEzLjUwOTEyOTUsNS4zNjQ3MDk4NyAxMy41MDkxMjk1LDUuMzY0NzA5ODcgQzE0LjE1MDUxOTUsNi4yNjc4NTU2NiAxNC4xNzY1OTc2LDcuNzUzMjE5MjUgMTMuNTA5MTI5NSw4LjYzNTI5MDA5IEMxMy41MDkxMjk1LDguNjM1MjkwMDkgMTEuNDc0NDQwMSwxMi41IDYuOTk5OTk5OTksMTIuNSBDNS42OTAxNzIzMiwxMi41IDQuNTg5NDE2ODgsMTIuMTY4ODE3MiAzLjY4NzU3MjQ0LDExLjcwMDM0OTUgWiBNNi40NjEzMDY5Niw4LjkyNjYxNDk0IEw4LjkyNjYxNDk0LDYuNDYxMzA2OTYgQzguOTc0NDM0Nyw2LjYzMjY5Mjk5IDksNi44MTMzNjA5NSA5LDcgQzksOC4xMDQ1Njk1IDguMTA0NTY5NSw5IDcsOSBDNi44MTMzNjA5NSw5IDYuNjMyNjkyOTksOC45NzQ0MzQ3IDYuNDYxMzA2OTYsOC45MjY2MTQ5NCBaIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=";

function makeRect(x, y, width, height, color){
  let rect = document.createElementNS(ns, "g");
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("transform", `translate(${x}, ${y})`);
;
  rect.setAttribute("fill", color);
  return rect;
}

export function createFolderSVG(Blockly, XMLitem, workspace, vm){
  let elt = document.createElementNS(ns, "g");
  let text = document.createElementNS(ns, "text");
  let thisPath = XMLitem.getAttribute("folder-path");

  text.innerHTML = XMLitem.getAttribute("folder-name");
  text.setAttribute("transform", "translate(30, 10)");
  text.setAttribute("font-weight", "bold");
  elt.appendChild(text);
  let collapseButton = makeRect(-5,-5, 20, 20, "transparent");
  let hideButton = makeRect(100,-5, 20, 20, "#ff8400ff");
  collapseButton.innerHTML = '<path fill="#9e5ec4ff" stroke="#9e5ec4ff" stroke-linejoin="round" stroke-width="4" d="M 10 2 L 18 10 L 10 18 Z"></path>';
  collapseButton.classList.add("folder-dropdown");


  collapseButton.addEventListener("click", (e) => {
    collapseButton.classList.toggle("closed");
    let newName = toggleHidden(thisPath);
    console.log(`renaming ${thisPath} to ${newName}`)

    renameFolder(Blockly, workspace, vm, thisPath,newName);
  })

  hideButton.innerHTML = `<image x="0" y="0" width="20" height="20" xlink:href=${SHOWN_ICON_IMAGE_DATA}></image>`

  elt.append(collapseButton, hideButton);

  console.log(collapseButton);

  let cursorY = 30;
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
      let subFolder = createFolderSVG(Blockly, xml, workspace);
      createdSVG = subFolder.element;
      height = subFolder.height;
      cursorY += 10;
    }

    createdSVG.setAttribute("transform", `translate(12, ${cursorY})`);
    elt.appendChild(createdSVG);
    cursorY += height;
  }
  let line = document.createElementNS(ns, "line");
  line.setAttribute("x1", 0);
  line.setAttribute("y1", 20);
  line.setAttribute("x2", 0);
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
    if(isInFolder(name)){
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
      subFolder.setAttribute("folder-name", f);
      subFolder.setAttribute("folder-path", pathName + "/" + f);
      subFolder.append(...folderTreeToXML(tree.folders[f], pathName + "/" + f));
      xmlList.push(subFolder);
    }
    return xmlList;
  }

  console.log(folderTree);
  xmlList.push(...folderTreeToXML(folderTree, ""));

  Blockly.Procedures.addCreateButton_(workspace, xmlList);
  return xmlList;

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
  if(isInFolder(this.procCode_)){
    //append the folder icon to the beginning of the block's SVG representation
    this.appendDummyInput("non-empty-name").appendField(new Blockly.FieldImage(FOLDER_IMAGE_DATA, 20, 20, false));

    //remove the filepath section of the block's name (ex. "/my folder/other folder/block" => "block")
    let shortenedText = getFirstTextContent(this.procCode_);
    console.log(this.procCode_);
    console.log(shortenedText);
    console.log(procComponents);
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
  //get all custom block names in the current sprite
  let mutations = Blockly.Procedures.allProcedureMutations(workspace.targetWorkspace);
  let procedures = mutations.map((m) => m.getAttribute('proccode'));


  let basePath = getFolderPath(pathToFolder, false);
  basePath.pop();
  basePath = createPathString(basePath);
  console.log(basePath);

  if(procedures.some((p) => p.startsWith(newName))){
    //Folder already exists
    alert(`A folder named "${newName}" already exists in ${basePath}`);
    return;
  }
  let blocksToRename = procedures.filter((p) => p.startsWith(pathToFolder));
  console.log(blocksToRename);

  let newNames = blocksToRename.map((p) => newName + p.substring(pathToFolder.length));
  console.log(newNames);


  let blocks = workspace.targetWorkspace.getAllBlocks().filter((b) => b.type == 'procedures_prototype' || b.type == 'procedures_call');
  let flyoutBlocks = workspace.getAllBlocks().filter((b) => b.type == 'procedures_call');
  blocks.push(...flyoutBlocks);


  console.log(blocks.filter((b) => b.procCode_.startsWith(newName)));
  for(let i = 0; i < blocks.length; i++){
    let indexToReplace = blocksToRename.indexOf(blocks[i].procCode_);
    if(indexToReplace >= 0){

      blocks[i].procCode_ = newNames[indexToReplace];
      blocks[i].updateDisplay_();
      let vm_block = vm.runtime.flyoutBlocks.getBlock(blocks[i].id) || vm.editingTarget.blocks.getBlock(blocks[i].id);

      vm_block.mutation.proccode = blocks[i].procCode_;
      console.log(vm_block);
    }
  }

}
