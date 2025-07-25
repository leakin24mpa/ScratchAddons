const ns = "http://www.w3.org/2000/svg";
const IMAGE_DATA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gNTUgNDAgTCA2MCAzMCBMIDkwIDMwIEwgOTUgNDAgTCA5NSA5NSBMIDUgOTUgTCA1IDQwIFoiPjwvcGF0aD4KPC9zdmc+';

function makeRect(x, y, width, height, color){
  let rect = document.createElementNS(ns, "rect");
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("fill", color);
  return rect;
}

export function createFolderSVG(Blockly, XMLitem, workspace){

  let elt = document.createElementNS(ns, "g");
  let text = document.createElementNS(ns, "text");
  text.innerHTML = XMLitem.getAttribute("folder-name");
  text.setAttribute("transform", "translate(70, 10)");
  text.setAttribute("font-weight", "bold");
  elt.appendChild(text);
  let addButton = makeRect(-5,-5, 20, 20, "#ff0000");
  let hideButton = makeRect(20,-5, 20, 20, "#ff8400ff");
  let openButton = makeRect(45,-5, 20, 20, "#ffff00ff");
  addButton.addEventListener("click", (e) => {console.log("add")});
  elt.append(addButton, hideButton, openButton);

  let cursorY = 30;
  for(let i = 0; i < XMLitem.childNodes.length; i++){
    let xml = XMLitem.childNodes[i];
    let createdSVG;
    let height;
    if(xml.tagName == 'BLOCK'){
      let blockSVG = Blockly.Xml.domToBlock(xml, workspace);
      let displayCode = xml.getAttribute("name");
      let proccode = blockSVG.procCode_;

      blockSVG.updateDisplay_();
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
    if(name[0] == "/"){
      path = name.split("/");
      path.splice(0, 1);
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

  function folderTreeToXML(tree){
    let xmlList = [];
    for(let i = 0; i < tree.blocks.length; i++){
      let block = document.createElement('block');
      block.setAttribute('type', 'procedures_call');
      block.setAttribute("name", tree.blocks[i].name);
      block.setAttribute('gap', 16);
      block.appendChild(tree.blocks[i].mutation);
      xmlList.push(block);
      //tree.blocks[i].mutation.setAttribute("proccode",tree.blocks[i].name);
    }
    for(var f in tree.folders){
      let subFolder = document.createElement('folder');
      subFolder.setAttribute("folder-name", f);
      subFolder.append(...folderTreeToXML(tree.folders[f]));
      xmlList.push(subFolder);
    }
    return xmlList;
  }

  console.log(folderTree);
  xmlList.push(...folderTreeToXML(folderTree));
  console.log(new XMLSerializer().serializeToString(xmlList[1]));

  Blockly.Procedures.addCreateButton_(workspace, xmlList);
  return xmlList;

}

export function getCreateAllInputs(Blockly){
return function(connectionMap) {
  console.log("creating inputs");
  // Split the proc into components, by %n, %b, and %s (ignoring escaped).
  var procComponents = this.procCode_.split(/(?=[^\\]%[nbs])/);
  procComponents = procComponents.map(function(c) {
    return c.trim(); // Strip whitespace.
  });

  if(procComponents[0][0] == "/"){
    this.appendDummyInput("non-empty-name").appendField(new Blockly.FieldImage(IMAGE_DATA, 20, 20, false));
    procComponents[0] = (procComponents[0].split("/")).pop();
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
