"use strict";

var GrowingPacker = require('./packer.growing.js');

module.exports = function(items, options) {
	options = options || {};
	var packer = new GrowingPacker({maxWidth: options.maxWidth, maxHeight: options.maxHeight, strictMax: options.strictMax});
	var inPlace = options.inPlace || false;

	// Clone the items.
	var newItems = items.map(function(item) { return inPlace ? item : { width: item.width, height: item.height, item: item }; });

	// We need to know whether the widest item exceeds the maximum width.
	// The optimal sorting strategy changes depending on this.
	const widestWidth =
		newItems.sort(function(a, b) { return b.width - a.width})[0].width
	const widerThanMax = options.maxWidth && (widestWidth > options.maxWidth)

	newItems = newItems.sort(function(a, b) {
		if (options.maxWidth && !options.maxHeight && widerThanMax) return b.width - a.width
		if (options.maxWidth && !options.maxHeight) return b.height - a.height
		if (options.maxHeight) return b.height - a.height
		// TODO: check that each actually HAS a width and a height.
		// Sort based on the size (area) of each block.
		return (b.width * b.height) - (a.width * a.height);
	});

	packer.fit(newItems);

	var w = newItems.reduce(function(curr, item) { return Math.max(curr, item.x + item.width); }, 0);
	var h = newItems.reduce(function(curr, item) { return Math.max(curr, item.y + item.height); }, 0);

	var ret = {
		width: w,
		height: h
	};

	if (!inPlace) {
		ret.items = newItems;
	}

	return ret;
};
