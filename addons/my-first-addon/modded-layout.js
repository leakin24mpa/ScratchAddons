export function moddedShow(xmlList, Blockly){
  this.workspace_.setResizesEnabled(false);
  this.hide();
  this.clearOldBlocks_();

  this.setVisible(true);
  // Create the blocks to be shown in this flyout.
  var contents = [];
  var gaps = [];
  this.permanentlyDisabled_.length = 0;
  for (var i = 0, xml; xml = xmlList[i]; i++) {
    // Handle dynamic categories, represented by a name instead of a list of XML.
    // Look up the correct category generation function and call that to get a
    // valid XML list.
    if (typeof xml === 'string') {
      var fnToApply = this.workspace_.targetWorkspace.getToolboxCategoryCallback(
          xmlList[i]);
      var newList = fnToApply(this.workspace_.targetWorkspace);
      // Insert the new list of blocks in the middle of the list.
      // We use splice to insert at index i, and remove a single element
      // (the placeholder string). Because the spread operator (...) is not
      // available, use apply and concat the array.
      xmlList.splice.apply(xmlList, [i, 1].concat(newList));
      xml = xmlList[i];
    }
    if (xml.tagName) {
      var tagName = xml.tagName.toUpperCase();
      var default_gap = this.horizontalLayout_ ? this.GAP_X : this.GAP_Y;
      if (tagName == 'BLOCK') {

        // We assume that in a flyout, the same block id (or type if missing id) means
        // the same output BlockSVG.

        // Look for a block that matches the id or type, our createBlock will assign
        // id = type if none existed.
        var id = xml.getAttribute('id') || xml.getAttribute('type');
        var recycled = this.recycleBlocks_.findIndex(function(block) {
          return block.id === id;
        });


        // If we found a recycled item, reuse the BlockSVG from last time.
        // Otherwise, convert the XML block to a BlockSVG.
        var curBlock;
        if (recycled > -1) {
          curBlock = this.recycleBlocks_.splice(recycled, 1)[0];
        } else {
          curBlock = Blockly.Xml.domToBlock(xml, this.workspace_);
        }

        if (curBlock.disabled) {
          // Record blocks that were initially disabled.
          // Do not enable these blocks as a result of capacity filtering.
          this.permanentlyDisabled_.push(curBlock);
        }
        contents.push({type: 'block', block: curBlock});
        var gap = parseInt(xml.getAttribute('gap'), 10);
        gaps.push(isNaN(gap) ? default_gap : gap);
      } else if (xml.tagName.toUpperCase() == 'SEP') {
        // Change the gap between two blocks.
        // <sep gap="36"></sep>
        // The default gap is 24, can be set larger or smaller.
        // This overwrites the gap attribute on the previous block.
        // Note that a deprecated method is to add a gap to a block.
        // <block type="math_arithmetic" gap="8"></block>
        var newGap = parseInt(xml.getAttribute('gap'), 10);
        // Ignore gaps before the first block.
        if (!isNaN(newGap) && gaps.length > 0) {
          gaps[gaps.length - 1] = newGap;
        } else {
          gaps.push(default_gap);
        }
      } else if ((tagName == 'LABEL') && (xml.getAttribute('showStatusButton') == 'true')) {
        var curButton = new Blockly.FlyoutExtensionCategoryHeader(this.workspace_,
            this.targetWorkspace_, xml);
        contents.push({type: 'button', button: curButton});
        gaps.push(default_gap);
      } else if (tagName == 'BUTTON' || tagName == 'LABEL') {
        // Labels behave the same as buttons, but are styled differently.
        var isLabel = tagName == 'LABEL';
        var curButton = new Blockly.FlyoutButton(this.workspace_,
            this.targetWorkspace_, xml, isLabel);
        contents.push({type: 'button', button: curButton});
        gaps.push(default_gap);
      }
      else if (tagName == 'TEST'){
        console.log("new XML Element found!");
      }
    }
  }

  this.emptyRecycleBlocks_();

  this.layout_(contents, gaps);

  // IE 11 is an incompetent browser that fails to fire mouseout events.
  // When the mouse is over the background, deselect all blocks.
  var deselectAll = function() {
    var topBlocks = this.workspace_.getTopBlocks(false);
    for (var i = 0, block; block = topBlocks[i]; i++) {
      block.removeSelect();
    }
  };

  this.listeners_.push(Blockly.bindEvent_(this.svgBackground_, 'mouseover',
      this, deselectAll));

  this.workspace_.setResizesEnabled(true);
  this.reflow();

  // Correctly position the flyout's scrollbar when it opens.
  this.position();

  this.reflowWrapper_ = this.reflow.bind(this);
  this.workspace_.addChangeListener(this.reflowWrapper_);

  this.recordCategoryScrollPositions_();
}

export function moddedLayout(contents, gaps, Blockly) {
  var margin = this.MARGIN;
  var flyoutWidth = this.getWidth() / this.workspace_.scale;
  var cursorX = margin;
  var cursorY = margin;

  for (var i = 0, item; item = contents[i]; i++) {
    if (item.type == 'block') {
      var block = item.block;
      var allBlocks = block.getDescendants(false);
      for (var j = 0, child; child = allBlocks[j]; j++) {
        // Mark blocks as being inside a flyout.  This is used to detect and
        // prevent the closure of the flyout if the user right-clicks on such a
        // block.
        child.isInFlyout = true;
      }
      var root = block.getSvgRoot();
      var blockHW = block.getHeightWidth();

      // Figure out where the block goes, taking into account its size, whether
      // we're in RTL mode, and whether it has a checkbox.
      var oldX = block.getRelativeToSurfaceXY().x;
      var newX = flyoutWidth - this.MARGIN;

      var moveX = this.RTL ? newX - oldX : margin;
      if (block.hasCheckboxInFlyout()) {
        this.createCheckbox_(block, cursorX, cursorY, blockHW);
        if (this.RTL) {
          moveX -= (this.CHECKBOX_SIZE + this.CHECKBOX_MARGIN);
        } else {
          moveX += this.CHECKBOX_SIZE + this.CHECKBOX_MARGIN;
        }
      }

      // The block moves a bit extra for the hat, but the block's rectangle
      // doesn't.  That's because the hat actually extends up from 0.
      block.moveBy(moveX,
          cursorY + (block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0));

      var rect = this.createRect_(block, this.RTL ? moveX - blockHW.width : moveX, cursorY, blockHW, i);

      this.addBlockListeners_(root, block, rect);

      cursorY += blockHW.height + gaps[i] + (block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
    } else if (item.type == 'button') {
      var button = item.button;
      var buttonSvg = button.createDom();
      if (this.RTL) {
        button.moveTo(flyoutWidth - this.MARGIN - button.width, cursorY);
      } else {
        button.moveTo(cursorX, cursorY);
      }
      button.show();
      // Clicking on a flyout button or label is a lot like clicking on the
      // flyout background.
      this.listeners_.push(Blockly.bindEventWithChecks_(
          buttonSvg, 'mousedown', this, this.onMouseDown_));

      this.buttons_.push(button);
      cursorY += button.height + gaps[i];
    }
  }
};
