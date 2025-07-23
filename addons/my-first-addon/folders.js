const ns = "http://www.w3.org/2000/svg";

export function createFolderSVG(Blockly, XMLitem, workspace){
  let elt = document.createElementNS(ns, "g");
  let text = document.createElementNS(ns, "text");
  text.innerHTML = XMLitem.getAttribute("text");
  elt.appendChild(text);
  for(let i = 0; i < XMLitem.childNodes.length; i++){
    let xml = XMLitem.childNodes[i];
    if(xml.tagName == 'BLOCK'){
      let blockSVG = Blockly.Xml.domToBlock(xml, workspace);
      workspace.removeTopBlock(blockSVG);
      elt.appendChild(blockSVG.svgGroup_);

    }
  }
  return elt;
}
