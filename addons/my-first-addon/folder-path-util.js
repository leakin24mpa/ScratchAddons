const COLLAPSED = "▸";
const HIDDEN = "◻";
const BOTH = "▹"
export function isInAnyFolder(proccode){
  //blocks in folders must begin with a /, and have at least one folder name between slashes
  return /^\/[^\/%]+\//.test(proccode);
}

//get the folder path for a block as a list of folder names (ex. "/folder/other folder/block" => ["folder", "other folder", "block"])
export function getFolderPath(proccode, fullPath){
  if(!isInAnyFolder(proccode) && fullPath){
    return [proccode];
  }
  let slices = proccode.split("/");
  let path = [];
  let endOfPath = false;
  for(let i = 1; i < slices.length; i++){

    if(endOfPath){
      path[path.length - 1] += "/" + slices[i];
    }
    else{
      path.push(slices[i]);
    }
    if(/%/.test(slices[i])){
      endOfPath = true;
    }
  }
  return path;
}
export function getFirstTextContent(proccode){
  let name = getFolderPath(proccode, true).pop();
  let firstEntry = name.split(/(?=[^\\]%[nbs])/)[0];
  return firstEntry.trim();
}
export function createPathString(pathList){
  return pathList.reduce((a,b) => a + "/" + b, "");
}
export function isCollapsed(folderText){
  return folderText.endsWith(COLLAPSED) || folderText.endsWith(BOTH);
}
export function isHidden(folderText){
  return folderText.endsWith(HIDDEN) || folderText.endsWith(BOTH);
}
export function isModified(folderText){
  return isCollapsed(folderText) || isHidden(folderText);
}
export function getFolderName(folderText){
  return isModified(folderText)? folderText.substring(0, folderText.length - 1) : folderText;
}

export function isBlockInFolder(proccode, folderPathString){
  if(!isInAnyFolder(proccode)){
    return false;
  }
  let blockPath = getFolderPath(proccode, true);
  let folderPath = getFolderPath(folderPathString, false);
  for(let i = 0; i < folderPath.length; i++){
    if(!(blockPath[i] === folderPath[i])){
      return false;
    }
  }
  return true;
}
export function isBlockHidden(proccode){
  let path = getFolderPath(proccode, true);
  path.pop();
  return path.some((folder) => isHidden(folder));
}
function setFolderState(folderText, isCollapsed, isHidden){
  return getFolderName(folderText) + (isCollapsed ? (isHidden ? BOTH : COLLAPSED) : (isHidden ? HIDDEN : ""));
}

export function setCollapsed(proccode, value){
  return setFolderState(proccode, value, isHidden(proccode));
}

export function setHidden(proccode, value){
  return setFolderState(proccode, isCollapsed(proccode), value);
}
