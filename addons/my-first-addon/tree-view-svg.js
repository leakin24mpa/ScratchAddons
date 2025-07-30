import { getFolderName, isModified, setCollapsed, setHidden, isHidden, isBlockHidden, isBlockInFolder, getFolderPath, createPathString } from "./folder-path-util.js";

const ns = "http://www.w3.org/2000/svg";
const FOLDER_IMAGE_DATA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gNTUgNDAgTCA2MCAzMCBMIDkwIDMwIEwgOTUgNDAgTCA5NSA5NSBMIDUgOTUgTCA1IDQwIFoiPjwvcGF0aD4KPC9zdmc+';
const SHOWN_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4yICgzOTA2OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+c2hvdy1pY29uLWFjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzaG93LWljb24tYWN0aXZlIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9IiM4NTVDRDYiPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMCwgMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41MDkxMjk1LDQuMzY0NzA5ODcgQzE0LjE1MDUxOTUsNS4yNjc4NTU2NiAxNC4xNzY1OTc2LDYuNzUzMjE5MjUgMTMuNTA5MTI5NSw3LjYzNTI5MDA5IEMxMy41MDkxMjk1LDcuNjM1MjkwMDkgMTEuNDc0NDQwMSwxMS41IDYuOTk5OTk5OTksMTEuNSBDMi41MjU1NTk4NiwxMS41IDAuNDkwODcwNDQsNy42MzUyOTAwOSAwLjQ5MDg3MDQ0LDcuNjM1MjkwMDkgQy0wLjE1MDUxOTUxOCw2LjczMjE0NDMgLTAuMTc2NTk3NTcxLDUuMjQ2NzgwNzEgMC40OTA4NzA0NCw0LjM2NDcwOTg3IEMwLjQ5MDg3MDQ0LDQuMzY0NzA5ODcgMi41MjU1NTk4NiwwLjUgNi45OTk5OTk5OSwwLjUgQzExLjQ3NDQ0MDEsMC41IDEzLjUwOTEyOTUsNC4zNjQ3MDk4NyAxMy41MDkxMjk1LDQuMzY0NzA5ODcgWiBNNi45OTg4OTQxMiw5Ljk5ODg5NDEyIEM5LjIwNzcyNzcsOS45OTg4OTQxMiAxMC45OTgzNDEyLDguMjA4MjgwNjggMTAuOTk4MzQxMiw1Ljk5OTQ0NzA2IEMxMC45OTgzNDEyLDMuNzkwNjEzNDQgOS4yMDc3Mjc3LDIgNi45OTg4OTQxMiwyIEM0Ljc5MDA2MDUsMiAyLjk5OTQ0NzA2LDMuNzkwNjEzNDQgMi45OTk0NDcwNiw1Ljk5OTQ0NzA2IEMyLjk5OTQ0NzA2LDguMjA4MjgwNjggNC43OTAwNjA1LDkuOTk4ODk0MTIgNi45OTg4OTQxMiw5Ljk5ODg5NDEyIFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjciIGN5PSI2IiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==";
const HIDDEN_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4yICgzOTA2OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aGlkZS1pY29uLWFjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJoaWRlLWljb24tYWN0aXZlIiBmaWxsPSIjODU1Q0Q2Ij4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSIgaWQ9IkNvbWJpbmVkLVNoYXBlIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLjA2Njc1NTM3LDEwLjU2Njk1MzEgQzAuOTk5Mjk5OTQ3LDkuNjAxMDA2MyAwLjQ5MDg3MDQ0LDguNjM1MjkwMDkgMC40OTA4NzA0NCw4LjYzNTI5MDA5IEMtMC4xNTA1MTk1MTgsNy43MzIxNDQzIC0wLjE3NjU5NzU3MSw2LjI0Njc4MDcxIDAuNDkwODcwNDQsNS4zNjQ3MDk4NyBDMC40OTA4NzA0NCw1LjM2NDcwOTg3IDIuNTI1NTU5ODYsMS41IDYuOTk5OTk5OTksMS41IEM4LjMxNjcyMTE4LDEuNSA5LjQyMjE2MzY4LDEuODM0Njc3OTggMTAuMzI2NjUsMi4zMDcwNTg0MiBMMTEuOTczNzA4NSwwLjY1OTk5OTk2NyBMMTIuNjgwODE1MiwxLjM2NzEwNjc1IEwxLjM2NzEwNjc1LDEyLjY4MDgxNTIgTDAuNjU5OTk5OTY3LDExLjk3MzcwODUgTDIuMDY2NzU1MzcsMTAuNTY2OTUzMSBaIE05LjA2MTUwNDQ3LDMuNTcyMjAzOTYgQzguNDU5MjUzMSwzLjIwODk3MzIxIDcuNzUzNDc3NzYsMyA2Ljk5ODg5NDEyLDMgQzQuNzkwMDYwNSwzIDIuOTk5NDQ3MDYsNC43OTA2MTM0NCAyLjk5OTQ0NzA2LDYuOTk5NDQ3MDYgQzIuOTk5NDQ3MDYsNy43NTQwMzA3MSAzLjIwODQyMDI3LDguNDU5ODA2MDUgMy41NzE2NTEwMiw5LjA2MjA1NzQxIEw1LjA3ODE2NjQ1LDcuNTU1NTQxOTggQzUuMDI3MjcxMzksNy4zNzkxNjI3MSA1LDcuMTkyNzY2MTQgNSw3IEM1LDUuODk1NDMwNSA1Ljg5NTQzMDUsNSA3LDUgQzcuMTkyNzY2MTQsNSA3LjM3OTE2MjcxLDUuMDI3MjcxMzkgNy41NTU1NDE5OCw1LjA3ODE2NjQ1IEw5LjA2MTUwNDQ3LDMuNTcyMjAzOTYgWiBNMy42ODc1NzI0NCwxMS43MDAzNDk1IEw0Ljk1MTg3NjAxLDEwLjQzNjA0NTkgQzUuNTUwNzAyNDEsMTAuNzkzNTA2OSA2LjI1MDgxMjg5LDEwLjk5ODg5NDEgNi45OTg4OTQxMiwxMC45OTg4OTQxIEM5LjIwNzcyNzcsMTAuOTk4ODk0MSAxMC45OTgzNDEyLDkuMjA4MjgwNjggMTAuOTk4MzQxMiw2Ljk5OTQ0NzA2IEMxMC45OTgzNDEyLDYuMjUxMzY1ODMgMTAuNzkyOTU0LDUuNTUxMjU1MzUgMTAuNDM1NDkzLDQuOTUyNDI4OTUgTDExLjk0NDU4OTcsMy40NDMzMzIyMSBDMTMuMDA0MzAyOCw0LjQwNTgzNjc2IDEzLjUwOTEyOTUsNS4zNjQ3MDk4NyAxMy41MDkxMjk1LDUuMzY0NzA5ODcgQzE0LjE1MDUxOTUsNi4yNjc4NTU2NiAxNC4xNzY1OTc2LDcuNzUzMjE5MjUgMTMuNTA5MTI5NSw4LjYzNTI5MDA5IEMxMy41MDkxMjk1LDguNjM1MjkwMDkgMTEuNDc0NDQwMSwxMi41IDYuOTk5OTk5OTksMTIuNSBDNS42OTAxNzIzMiwxMi41IDQuNTg5NDE2ODgsMTIuMTY4ODE3MiAzLjY4NzU3MjQ0LDExLjcwMDM0OTUgWiBNNi40NjEzMDY5Niw4LjkyNjYxNDk0IEw4LjkyNjYxNDk0LDYuNDYxMzA2OTYgQzguOTc0NDM0Nyw2LjYzMjY5Mjk5IDksNi44MTMzNjA5NSA5LDcgQzksOC4xMDQ1Njk1IDguMTA0NTY5NSw5IDcsOSBDNi44MTMzNjA5NSw5IDYuNjMyNjkyOTksOC45NzQ0MzQ3IDYuNDYxMzA2OTYsOC45MjY2MTQ5NCBaIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=";
const DRAG_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOC41IDEwYTIgMiAwIDEgMCAyIDJhMiAyIDAgMCAwLTItMm0wIDdhMiAyIDAgMSAwIDIgMmEyIDIgMCAwIDAtMi0ybTctMTBhMiAyIDAgMSAwLTItMmEyIDIgMCAwIDAgMiAybS03LTRhMiAyIDAgMSAwIDIgMmEyIDIgMCAwIDAtMi0ybTcgMTRhMiAyIDAgMSAwIDIgMmEyIDIgMCAwIDAtMi0ybTAtN2EyIDIgMCAxIDAgMiAyYTIgMiAwIDAgMC0yLTIiLz48L3N2Zz4";

function createDropdownArrow(){
  const arrow = document.createElementNS(ns,"path");
  arrow.setAttribute("fill", "#9e5ec4ff");
  arrow.setAttribute("stroke", "#9e5ec4ff");
  arrow.setAttribute("stroke-linejoin", "round");
  arrow.setAttribute("stroke-width", 4);
  arrow.setAttribute("d", "M 10 2 L 18 10 L 10 18 Z");
  return arrow;
}
function createSVGImage(x,y,width,height, src){
  const img = document.createElementNS(ns, "image");
  img.setAttribute("width", width);
  img.setAttribute("height", height);
  img.setAttribute("x", x);
  img.setAttribute("y", y);
  img.setAttribute("href", src);
  return img;
}
function createSVGLine(x1, y1, x2, y2, strokeWidth, color){
  const line = document.createElementNS(ns, "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke", color);
  return line;
}
function createSVGGroup(...children){
  const group = document.createElementNS(ns, "g");
  group.append(...children);
  return group;
}

function createSVGRect(x, y, width, height, color){
  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("fill", color);
  return rect;
}
function createSVGText(text, weight){
  const textElement = document.createElementNS(ns, "text");
  textElement.innerHTML = text;
  textElement.setAttribute("font-weight", weight);
  return textElement;
}
function setTransform(element, x,y){
  element.setAttribute("transform", `translate(${x},${y})`);
}

//hacky way to measure the size of an svg element (you can't measure svg elements that have not been rendered yet)
function getElementDimensions(element){
  //1. add the element to a new <svg> element and append that svg to the DOM
  let svg = document.createElementNS(ns, "svg");
  svg.appendChild(element);
  document.body.appendChild(svg);

  //2. get the dimensions of the added element
  let bbox = element.getBBox();

  //3. remove the svg from the DOM
  document.body.removeChild(svg);

  //4. Profit.
  return bbox;
}

function createScratchBlockInput(Blockly, workspace, text, renderCallback, renameCallback){
  let textElement = createSVGGroup();
  let field = new Blockly.FieldTextInput(text);
  let mockSourceBlock = {
    isShadow: () => false,
    isEditable: () => true,
    getSvgRoot: () => textElement,
    inputList: [],
    getColourTertiary: () => "#00000020",
    workspace: workspace,
    getOutputShape: () => Blockly.OUTPUT_SHAPE_SQUARE,
    rendered: true,
    render: () => field.render_(),
    bumpNeighbours_: () => renderCallback(field.size_.width)
  }
  field.arrowWidth_ = 0;
  field.updateWidth = () => {
    let bbwidth = field.textElement_.getBBox().width;
    let width;
    if(field.textElement_.textContent.length == 0){
      width = 0;
    }
    else if(bbwidth > 0){
      width = bbwidth;
    }
    else{
      width = getElementDimensions(createSVGText(field.textElement_.textContent, "regular")).width;
    }
    field.size_.width = width + Blockly.BlockSvg.EDITABLE_FIELD_PADDING + 2 * Blockly.BlockSvg.BOX_FIELD_PADDING;
  }

  let textInput = new Blockly.Input(Blockly.DUMMY_INPUT, "non-empty-name", mockSourceBlock).appendField(field);
  field.visible_ = true;
  textInput.init();
  textElement.getWidth = () => field.size_.width;
  field.setValidator((text) => {
    if(text.length < 1 ){
      return null;
    }
    if(isModified(text)){
      if(text.length < 2){
        return null;
      }
      return getFolderName(text);
    }
    if(/[\/%]/.test(text)){
      return null;
    }
    return text;
  });
  field.onFinishEditing_ = renameCallback;
  return textElement;
}

export function createMyBlocksSVG(Blockly, XMLitem, workspace, vm){
  let group;
  let dragInfo = {isDragging: false};
  function exitDrag(){
    group.element.classList.remove("sa-folder-dragging");
    if(dragInfo.isDragging){
      dragInfo.copyOf.style.visibility = "visible";
      dragInfo.draggingSVG?.remove();
      dragInfo.draggingSVG = null;
      dragInfo.isDragging = false;
    }
    dragInfo.pathTarget = null;
  }
  function beginDrag(mouseevent, path, svg, hideItem){
    mouseevent.stopPropagation();
    exitDrag();
    if(hideItem){
      svg.style.visibility = "hidden";
    }
    group.element.classList.add("sa-folder-dragging");
    dragInfo.startX = mouseevent.clientX;
    dragInfo.startY = mouseevent.clientY;
    dragInfo.isDragging = true;
    dragInfo.draggingPath = path;
    const dragSVG = createSVGGroup();
    dragSVG.innerHTML = svg.innerHTML;
    dragSVG.classList.add("sa-folder-draggable");
    workspace.svgGroup_.appendChild(dragSVG);
    const headerRect = svg.getBoundingClientRect();
    const canvasRect = workspace.cachedParentSvg_.getBoundingClientRect();
    dragInfo.ogTransform = `translate(${headerRect.x - canvasRect.x + 10}, ${headerRect.y - canvasRect.y + 4}) scale(0.675) `;
    dragSVG.setAttribute("transform", dragInfo.ogTransform);
    dragInfo.draggingSVG = dragSVG;
    dragInfo.copyOf = svg;
  }
  document.body.addEventListener("mousemove", (e) => {
    if(dragInfo.isDragging){
      dragInfo.draggingSVG.setAttribute("transform", `translate(0, ${e.clientY - dragInfo.startY})` + dragInfo.ogTransform);
    }
  });
  document.body.addEventListener("mouseup", (e) => {
    if(dragInfo.isDragging){
      const dragPath = getFolderPath(dragInfo.draggingPath, false);
      const targetPath = getFolderPath(dragInfo.pathTarget, false);
      targetPath.push(dragPath.pop())
      console.log(createPathString(targetPath));
      renameFolder(Blockly, workspace, vm, dragInfo.draggingPath, createPathString(targetPath));
      workspace.refreshToolboxSelection_();

    }
    exitDrag();
  });
  function createFolderHeaderSVG(getPath, text, isCollapsed, isHidden, collapseButtonCallback, hideButtonCallback, renameCallback){
    const dropdownArrow = createDropdownArrow();
    dropdownArrow.classList.add("sa-folder-dropdown");
    if(isCollapsed){
      dropdownArrow.classList.add("sa-folder-closed");
    }
    const eyeIcon = createSVGImage(0,0,20,20, isHidden? HIDDEN_ICON_IMAGE_DATA : SHOWN_ICON_IMAGE_DATA);
    const collapseButton = createSVGGroup(createSVGRect(-10, -10, 40, 40, "transparent"), dropdownArrow);
    const hideButton = createSVGGroup(createSVGRect(-10, -10, 40, 40, "transparent"), eyeIcon);
    const moveButton = createSVGImage(320, 5, 20, 20, DRAG_ICON_IMAGE_DATA);

    hideButtonCallback(isHidden, true);
    collapseButton.addEventListener("click", (e) => {
      isCollapsed = !isCollapsed;
      dropdownArrow.classList.toggle("sa-folder-closed");
      collapseButtonCallback(isCollapsed);
    });
    hideButton.addEventListener("click", (e) => {
      isHidden = !isHidden;
      eyeIcon.setAttribute("href", isHidden? HIDDEN_ICON_IMAGE_DATA : SHOWN_ICON_IMAGE_DATA);
      hideButtonCallback(isHidden, false);
    });
    const textElement = createScratchBlockInput(Blockly, workspace, text, (width) => {
      setTransform(hideButton, width + 45, 5);
    }, renameCallback);

    const bgrect = createSVGRect(-5, -5, 400, 40, "#00000020");
    bgrect.setAttribute("rx", 4);
    setTransform(textElement, 30, -1);
    setTransform(collapseButton, -5, 5);
    setTransform(hideButton, textElement.getWidth() + 45, 5);
    const group = createSVGGroup(bgrect, textElement, collapseButton, hideButton, moveButton);
    bgrect.addEventListener("mousedown", (e) => beginDrag(e, getPath(), group, false));
    return {element: group, height: 40};

  }
  function createFolderContentSVG(parentXML, getPath){
    let elt = createSVGGroup();
    let cursorY = 10;
    for(let i = 0; i < parentXML.childNodes.length; i++){
      let xml = parentXML.childNodes[i];
      let createdSVG;
      let height;
      if(xml.tagName == 'BLOCK'){
        const blockSVG = Blockly.Xml.domToBlock(xml, workspace);
        const rect = createSVGRect(-20, -5, 600, 65, "transparent");
        createdSVG = createSVGGroup(rect, blockSVG.svgGroup_);
        rect.classList.add("sa-folder-block-move")
        rect.addEventListener("mousedown", (e) => { beginDrag(e, xml.getAttribute("name"), createdSVG, true); });

        height = 65;
      }
      else if(xml.tagName == 'FOLDER'){
        let subFolder = createFolderSVG(xml, getPath);
        createdSVG = subFolder.element;
        height = subFolder.height;
        cursorY += 10;
      }
      else{
        console.error(`expected xml tags "folder" or "block", but found ${xml.tagName}`);
      }

      setTransform(createdSVG, 12, cursorY);
      elt.appendChild(createdSVG);
      cursorY += height;
    }
    return {element: elt, height: cursorY};
  }
  function createFolderSVG(parentXML, getParentPath){
    let thisPath = parentXML.getAttribute("folder-path");
    const folderName = parentXML.getAttribute("folder-name");
    const hidden = parentXML.getAttribute("is-hidden") == "true";
    const collapsed = parentXML.getAttribute("is-collapsed") == "true";
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
    const header = createFolderHeaderSVG(getPath, folderName, collapsed, hidden, collapseCallback, hideCallback, renameCallback);
    let rect;
    let folderSVG;
    let height;
    function highlightRect(e){
      e.stopPropagation();
      if(dragInfo.isDragging){
        rect.classList.add("sa-folder-drag-target");
        dragInfo.pathTarget = getPath();
      }
    }
    function unHighlightRect(e){
      dragInfo.pathTarget = "";
      rect.classList.remove("sa-folder-drag-target");
    }
    if(collapsed){
      rect = createSVGRect(-5, -5, 600, header.height, "#00ffff");
      rect.classList.add("sa-folder-bg");
      folderSVG = createSVGGroup(rect, header.element);
      height = header.height;
    }
    else{
      const content = createFolderContentSVG(parentXML, getPath);
      const line = createSVGLine(0, 0, 0, content.height, 1, "#adadadff");
      setTransform(content.element, 0, header.height);
      setTransform(line, 0, header.height)
      rect = createSVGRect(-5, -5, 600, header.height + content.height, "#00ffff");
      folderSVG = createSVGGroup(rect,header.element, content.element, line);
      height = header.height + content.height;
    }

    rect.classList.add("sa-folder-bg");

    rect.addEventListener("mouseenter", highlightRect);
    rect.addEventListener("mouseleave", unHighlightRect);
    header.element.addEventListener("mouseenter", highlightRect);
    header.element.addEventListener("mouseleave", unHighlightRect);

    return { element: folderSVG, height: height};
  }
  group = createFolderContentSVG(XMLitem, () => "");
  return group;
}
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
