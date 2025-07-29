import { getFolderName, isModified } from "./folder-path-util.js";

const ns = "http://www.w3.org/2000/svg";
const FOLDER_IMAGE_DATA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHBhdGggc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gNTUgNDAgTCA2MCAzMCBMIDkwIDMwIEwgOTUgNDAgTCA5NSA5NSBMIDUgOTUgTCA1IDQwIFoiPjwvcGF0aD4KPC9zdmc+';
const SHOWN_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4yICgzOTA2OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+c2hvdy1pY29uLWFjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzaG93LWljb24tYWN0aXZlIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9IiM4NTVDRDYiPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAwMDAwMCwgMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41MDkxMjk1LDQuMzY0NzA5ODcgQzE0LjE1MDUxOTUsNS4yNjc4NTU2NiAxNC4xNzY1OTc2LDYuNzUzMjE5MjUgMTMuNTA5MTI5NSw3LjYzNTI5MDA5IEMxMy41MDkxMjk1LDcuNjM1MjkwMDkgMTEuNDc0NDQwMSwxMS41IDYuOTk5OTk5OTksMTEuNSBDMi41MjU1NTk4NiwxMS41IDAuNDkwODcwNDQsNy42MzUyOTAwOSAwLjQ5MDg3MDQ0LDcuNjM1MjkwMDkgQy0wLjE1MDUxOTUxOCw2LjczMjE0NDMgLTAuMTc2NTk3NTcxLDUuMjQ2NzgwNzEgMC40OTA4NzA0NCw0LjM2NDcwOTg3IEMwLjQ5MDg3MDQ0LDQuMzY0NzA5ODcgMi41MjU1NTk4NiwwLjUgNi45OTk5OTk5OSwwLjUgQzExLjQ3NDQ0MDEsMC41IDEzLjUwOTEyOTUsNC4zNjQ3MDk4NyAxMy41MDkxMjk1LDQuMzY0NzA5ODcgWiBNNi45OTg4OTQxMiw5Ljk5ODg5NDEyIEM5LjIwNzcyNzcsOS45OTg4OTQxMiAxMC45OTgzNDEyLDguMjA4MjgwNjggMTAuOTk4MzQxMiw1Ljk5OTQ0NzA2IEMxMC45OTgzNDEyLDMuNzkwNjEzNDQgOS4yMDc3Mjc3LDIgNi45OTg4OTQxMiwyIEM0Ljc5MDA2MDUsMiAyLjk5OTQ0NzA2LDMuNzkwNjEzNDQgMi45OTk0NDcwNiw1Ljk5OTQ0NzA2IEMyLjk5OTQ0NzA2LDguMjA4MjgwNjggNC43OTAwNjA1LDkuOTk4ODk0MTIgNi45OTg4OTQxMiw5Ljk5ODg5NDEyIFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjciIGN5PSI2IiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==";
const HIDDEN_ICON_IMAGE_DATA = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0My4yICgzOTA2OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aGlkZS1pY29uLWFjdGl2ZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJoaWRlLWljb24tYWN0aXZlIiBmaWxsPSIjODU1Q0Q2Ij4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSIgaWQ9IkNvbWJpbmVkLVNoYXBlIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLjA2Njc1NTM3LDEwLjU2Njk1MzEgQzAuOTk5Mjk5OTQ3LDkuNjAxMDA2MyAwLjQ5MDg3MDQ0LDguNjM1MjkwMDkgMC40OTA4NzA0NCw4LjYzNTI5MDA5IEMtMC4xNTA1MTk1MTgsNy43MzIxNDQzIC0wLjE3NjU5NzU3MSw2LjI0Njc4MDcxIDAuNDkwODcwNDQsNS4zNjQ3MDk4NyBDMC40OTA4NzA0NCw1LjM2NDcwOTg3IDIuNTI1NTU5ODYsMS41IDYuOTk5OTk5OTksMS41IEM4LjMxNjcyMTE4LDEuNSA5LjQyMjE2MzY4LDEuODM0Njc3OTggMTAuMzI2NjUsMi4zMDcwNTg0MiBMMTEuOTczNzA4NSwwLjY1OTk5OTk2NyBMMTIuNjgwODE1MiwxLjM2NzEwNjc1IEwxLjM2NzEwNjc1LDEyLjY4MDgxNTIgTDAuNjU5OTk5OTY3LDExLjk3MzcwODUgTDIuMDY2NzU1MzcsMTAuNTY2OTUzMSBaIE05LjA2MTUwNDQ3LDMuNTcyMjAzOTYgQzguNDU5MjUzMSwzLjIwODk3MzIxIDcuNzUzNDc3NzYsMyA2Ljk5ODg5NDEyLDMgQzQuNzkwMDYwNSwzIDIuOTk5NDQ3MDYsNC43OTA2MTM0NCAyLjk5OTQ0NzA2LDYuOTk5NDQ3MDYgQzIuOTk5NDQ3MDYsNy43NTQwMzA3MSAzLjIwODQyMDI3LDguNDU5ODA2MDUgMy41NzE2NTEwMiw5LjA2MjA1NzQxIEw1LjA3ODE2NjQ1LDcuNTU1NTQxOTggQzUuMDI3MjcxMzksNy4zNzkxNjI3MSA1LDcuMTkyNzY2MTQgNSw3IEM1LDUuODk1NDMwNSA1Ljg5NTQzMDUsNSA3LDUgQzcuMTkyNzY2MTQsNSA3LjM3OTE2MjcxLDUuMDI3MjcxMzkgNy41NTU1NDE5OCw1LjA3ODE2NjQ1IEw5LjA2MTUwNDQ3LDMuNTcyMjAzOTYgWiBNMy42ODc1NzI0NCwxMS43MDAzNDk1IEw0Ljk1MTg3NjAxLDEwLjQzNjA0NTkgQzUuNTUwNzAyNDEsMTAuNzkzNTA2OSA2LjI1MDgxMjg5LDEwLjk5ODg5NDEgNi45OTg4OTQxMiwxMC45OTg4OTQxIEM5LjIwNzcyNzcsMTAuOTk4ODk0MSAxMC45OTgzNDEyLDkuMjA4MjgwNjggMTAuOTk4MzQxMiw2Ljk5OTQ0NzA2IEMxMC45OTgzNDEyLDYuMjUxMzY1ODMgMTAuNzkyOTU0LDUuNTUxMjU1MzUgMTAuNDM1NDkzLDQuOTUyNDI4OTUgTDExLjk0NDU4OTcsMy40NDMzMzIyMSBDMTMuMDA0MzAyOCw0LjQwNTgzNjc2IDEzLjUwOTEyOTUsNS4zNjQ3MDk4NyAxMy41MDkxMjk1LDUuMzY0NzA5ODcgQzE0LjE1MDUxOTUsNi4yNjc4NTU2NiAxNC4xNzY1OTc2LDcuNzUzMjE5MjUgMTMuNTA5MTI5NSw4LjYzNTI5MDA5IEMxMy41MDkxMjk1LDguNjM1MjkwMDkgMTEuNDc0NDQwMSwxMi41IDYuOTk5OTk5OTksMTIuNSBDNS42OTAxNzIzMiwxMi41IDQuNTg5NDE2ODgsMTIuMTY4ODE3MiAzLjY4NzU3MjQ0LDExLjcwMDM0OTUgWiBNNi40NjEzMDY5Niw4LjkyNjYxNDk0IEw4LjkyNjYxNDk0LDYuNDYxMzA2OTYgQzguOTc0NDM0Nyw2LjYzMjY5Mjk5IDksNi44MTMzNjA5NSA5LDcgQzksOC4xMDQ1Njk1IDguMTA0NTY5NSw5IDcsOSBDNi44MTMzNjA5NSw5IDYuNjMyNjkyOTksOC45NzQ0MzQ3IDYuNDYxMzA2OTYsOC45MjY2MTQ5NCBaIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=";


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

//hacky way to measure the size of an svg element
function getElementDimensions(element){
  //add the element to a new <svg> element and append that svg to the DOM
  let svg = document.createElementNS(ns, "svg");
  svg.appendChild(element);
  document.body.appendChild(svg);

  //get the dimensions
  let bbox = element.getBBox();

  //remove the svg from the DOM
  document.body.removeChild(svg);

  //Profit.
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
export function createTreeViewSVG(Blockly, workspace, text, isCollapsed, isHidden, collapseButtonCallback, hideButtonCallback, renameCallback){


  //createSVGText(text, "bold");
  let dropdownArrow = createDropdownArrow();
  dropdownArrow.classList.add("sa-folder-dropdown");
  if(isCollapsed){
    dropdownArrow.classList.add("sa-folder-closed");
  }
  let eyeIcon = createSVGImage(0,0,20,20, isHidden? HIDDEN_ICON_IMAGE_DATA : SHOWN_ICON_IMAGE_DATA);
  let collapseButton = createSVGGroup(createSVGRect(-10, -10, 40, 40, "transparent"), dropdownArrow);
  let hideButton = createSVGGroup(createSVGRect(-10, -10, 40, 40, "transparent"), eyeIcon);

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
  let textElement = createScratchBlockInput(Blockly, workspace, text, (width) => {
    setTransform(hideButton, width + 45, 5);
  }, renameCallback);

  let bgrect = createSVGRect(-5, -5, 400, 40, "#00000020");
  bgrect.setAttribute("rx", 4);
  setTransform(textElement, 30, -1);
  setTransform(collapseButton, -5, 5);
  setTransform(hideButton, textElement.getWidth() + 45, 5);
  return createSVGGroup(bgrect, textElement, collapseButton, hideButton);

}
