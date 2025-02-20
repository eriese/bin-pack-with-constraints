# Bin Pack With Constraints

A packing algorithm for 2D bin packing. Largely based on [code][code] and a
[blog post][post] by Jake Gordon, and forked from [bryanburgers/bin-pack][upstream]
to add `maxWidth` and `maxHeight` functionality.

This library packs objects that have a width and a height into as small of a
square as possible, using a binary tree bin packing algorithm. After packing,
each object is given an (x, y) coordinate of where it would be optimally
packed.

The algorithm may not find the *optimal* bin packing, but it should do pretty
will for things like sprite maps.

The default behavior during packing is that the container attempts to maintain a
roughly square ratio by making 'smart' choices about whether to grow right or down.

If either a maxWidth or a maxHeight is set, it will try not to grow beyond that
limit, and choose instead to grow in the other direction. However, if a
block is larger than the given limit, that block's dimension will replace the
limit to avoid failure.


## Installation

```
npm install bin-pack-with-constraints
```

## Use

```
var pack = require('bin-pack');
var bins = [
	{ width: 10,  height: 20 },
	{ width: 100, height: 100 },
	{ width: 50,  height: 19 },
	...
	];

var result = pack(bins);

// result.width: width of the containing box
// result.height: height of the containing box
// result.items: packed items
// result.items[0].x: x coordinate of the packed box
// result.items[0].y: y coordinate of the packed box
// result.items[0].width: width of the packed box
// result.items[0].height: height of the packed box
// result.items[0].item: original object that was passed in
```

If you want to constrain the `width` or `height` of the containing box, you can use the `maxWidth` or `maxHeight` option when packing. The maximum doesn't have to be greater than the size of the largest box, but if it isn't you may run into unexpected behavior.
```
var pack = require('bin-pack');
var bins = [
	{ width: 100, height: 100 },
	{ width: 10,  height: 20 },
	{ width: 50,  height: 19 },
	...
	];

var result = pack(bins, {maxWidth: 105});

// result.width: width of the containing box
// result.height: height of the containing box
// result.items: packed items
// result.items[0].x: x coordinate of the packed box
// result.items[0].y: y coordinate of the packed box
// result.items[0].width: width of the packed box
// result.items[0].height: height of the packed box
// result.items[0].item: original object that was passed in
```


If your object doesn't have `x` and `y` properties, and you don't mind a
library writing to your objects, then specify `inPlace: true` and your objects
will have a `x` and `y` properties added to them.

```
var pack = require('bin-pack');
var bins = [
	{ width: 100, height: 100 },
	{ width: 10,  height: 20 },
	{ width: 50,  height: 19 },
	...
	];

var result = pack(bins, { inPlace: true });
// result.width: width of the containing box
// result.height: height of the containing box
// bins[0].x: x coordinate of the packed box
// bins[0].y: y coordinate of the packed box
```

## Contributing

Contributing tests, documentation, or code is all appreciated. All code should
be accompanied by valid tests.

[code]: https://github.com/jakesgordon/bin-packing
[post]: http://codeincomplete.com/posts/2011/5/7/bin_packing/
[upstream]: https://github.com/bryanburgers/bin-pack
