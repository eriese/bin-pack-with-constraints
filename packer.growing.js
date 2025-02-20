/******************************************************************************

This is a binary tree based bin packing algorithm that is more complex than
the simple Packer (packer.js). Instead of starting off with a fixed width and
height, it starts with the width and height of the first block passed and then
grows as necessary to accomodate each subsequent block.

The default behavior as it grows is that it attempts
to maintain a roughly square ratio by making 'smart' choices about whether to
grow right or down.

If either a maxWidth or a maxHeight is set, it will try not to grow beyond that
limit, and choose instead to grow in the other direction. If the first block is
larger than the given limit, however, that block's dimension will replace the
limit.

When growing, the algorithm can only grow to the right OR down. Therefore, if
the new block is BOTH wider and taller than the current target then it will be
rejected. This makes it very important to initialize with a sensible starting
width and height. If you are providing sorted input (largest first) then this
will not be an issue.

A potential way to solve this limitation would be to allow growth in BOTH
directions at once, but this requires maintaining a more complex tree
with 3 children (down, right and center) and that complexity can be avoided
by simply chosing a sensible starting block.

Best results occur when the input blocks are sorted by height, or even better
when sorted by max(width,height).

Construction:
------------
	{
		maxWidth = Infinity: set a max width to constrain the growth in that direction
		maxHeight = Infinity: set a max height to constrain the growth in that direction
		TODO strictMax = false: reject blocks that are larger than the max
	}

Inputs:
------

	blocks: array of any objects that have .w and .h attributes


Outputs:
-------

	marks each block that fits with a .fit attribute pointing to a
	node with .x and .y coordinates

Example:
-------

	var blocks = [
		{ w: 100, h: 100 },
		{ w: 100, h: 100 },
		{ w:  80, h:  80 },
		{ w:  80, h:  80 },
		etc
		etc
	];

	var packer = new GrowingPacker();
	packer.fit(blocks);

	for(var n = 0 ; n < blocks.length ; n++) {
		var block = blocks[n];
		if (block.fit) {
			Draw(block.fit.x, block.fit.y, block.w, block.h);
		}
	}


******************************************************************************/

var GrowingPacker = function({maxWidth = Infinity, maxHeight = Infinity, strictMax = false}) {
	this.maxWidth = maxWidth
	this.maxHeight = maxHeight
	// this.strictMax = strictMax
	this.ensureSquare = maxWidth === Infinity && maxHeight === Infinity
};

GrowingPacker.prototype = {

	fit: function(blocks) {
		var len = blocks.length
		if (len === 0) { return }

		var n, node, block, fit;
		var width  = this.strictMax && (this.maxWidth < Infinity) ? this.maxWidth : blocks[0].width;
		var height  = this.strictMax && (this.maxHeight < Infinity) ? this.maxHeight : blocks[0].height;
		this.root = { x: 0, y: 0, width, height };
		for (n = 0; n < len ; n++) {
			block = blocks[n];
			if (node = this.findNode(this.root, block.width, block.height)) {
				fit = this.splitNode(node, block.width, block.height);
				block.x = fit.x;
				block.y = fit.y;
			}
			else {
				fit = this.growNode(block.width, block.height);
				block.x = fit.x;
				block.y = fit.y;
			}
		}
	},

	findNode: function(root, width, height) {
		if (root.used)
			return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
		else if (width <= root.width && height <= root.height)
			return root;
		else
			return null;
	},

	splitNode: function(node, width, height) {
		node.used = true;
		const downY = node.y + height
		node.down  = {
			x: node.x,
			y: downY,
			width: node.width,
			height: Math.min(node.height - height, this.maxHeight - downY)
		};

		const rightX = node.x + width
		node.right = {
			x: rightX,
			y: node.y,
			width: Math.min(node.width - width, this.maxWidth - rightX),
			height: height
		};
		return node;
	},

	growNode: function(width, height) {
		var canGrowDown  = width  <= this.root.width;
		var canGrowRight = height <= this.root.height;

		const proposedNewWidth = this.root.width + width
		var shouldGrowRight = canGrowRight && (this.ensureSquare ? this.root.height : this.maxWidth) >= proposedNewWidth; // attempt to keep square-ish by growing right when height is much greater than width
		const proposedNewHeight = this.root.height + height
		var shouldGrowDown  = canGrowDown  && (this.ensureSquare ? this.root.width : this.maxHeight) >= proposedNewHeight; // attempt to keep square-ish by growing down  when width  is much greater than height

		if (shouldGrowRight)
			return this.growRight(width, height);
		else if (shouldGrowDown)
			return this.growDown(width, height);
		else if (canGrowRight)
			return this.growRight(width, height);
		else if (canGrowDown)
			return this.growDown(width, height);
		else
			return null; // need to ensure sensible root starting size to avoid this happening
	},

	growRight: function(width, height) {
		this.root = {
			used: true,
			x: 0,
			y: 0,
			width: this.root.width + width,
			height: this.root.height,
			down: this.root,
			right: { x: this.root.width, y: 0, width: width, height: this.root.height }
		};
		var node;
		if (node = this.findNode(this.root, width, height))
			return this.splitNode(node, width, height);
		else
			return null;
	},

	growDown: function(width, height) {
		this.root = {
			used: true,
			x: 0,
			y: 0,
			width: this.root.width,
			height: this.root.height + height,
			down:  { x: 0, y: this.root.height, width: this.root.width, height: height },
			right: this.root
		};
		var node;
		if (node = this.findNode(this.root, width, height))
			return this.splitNode(node, width, height);
		else
			return null;
	}

};

module.exports = GrowingPacker;

