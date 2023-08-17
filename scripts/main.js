class Building
{
	constructor(imageurl)
	{
		this.imageurl = imageurl;
	}
}


class Ground
{
	constructor(imageurl)
	{
		this.imageurl = imageurl;
	}
}


class Plot
{
	constructor(q, x, y, ground = groundTests[0], building = buildingTests[Math.floor(Math.random() * buildingTests.length)])
	{
		this.q = q;
		this.x = x;
		this.y = y;
		this.ground = ground;
		this.building = building;
	}

	get html_element()
	{
		return document.getElementById("plot_q" + this.q +"_x" + this.x + "_y" + this.y);
	}
}


// run when html is loaded
document.addEventListener("DOMContentLoaded", function()
{
	plotSize = CalculatePlotSize();
	worldView = document.getElementById('world');
	worldCenter = document.getElementById('world-center-anchor');
	generatingMap = false;

	groundTests = [
		new Ground(''),
		new Ground('images/world_tiles/tile_grass.jpg')
	];

	buildingTests = [
		new Building(''),
		new Building('images/world_buildings/building_smalltest.png'),
		new Building(''),
		new Building('images/world_buildings/building_midtest.png'),
		new Building(''),
		new Building('images/world_buildings/building_talltest.png')
	];

	worldPlots = [
		// Q1
		[],

		// Q2
		[],

		// Q3
		[],

		// Q4
		[]
	];



	scale = 1.0;

	mouseDown = false;

	startingMousePos = 
	{
		x: 0,
		y: 0
	};

	scrollPos = 
	{
		x: 0,
		y: 0
	};

	worldView.addEventListener('wheel', (e) => 
	{
		if (e.wheelDelta > 0)
			scale *= 1.05;
		else
			scale /= 1.05;

		worldCenter.style.transform = "scale(" + scale + ") translate(" + scrollPos.x + "px," + scrollPos.y + "px)";
		GenerateMap();
	});

	worldView.addEventListener('mousedown', (e) => 
	{
		mouseDown = true;
		startingMousePos = {
			x: e.clientX,
			y: e.clientY
		};
	});

	worldView.addEventListener('mouseleave', () => 
	{
		mouseDown = false;
	});

	worldView.addEventListener('mouseup', () => 
	{
		if (mouseDown)
			GenerateMap();

		mouseDown = false;
	});

	worldView.addEventListener('mousemove', (e) => 
	{
		if (mouseDown)
		{
			scrollPos.x += ((e.clientX - startingMousePos.x) / scale);
			scrollPos.y += ((e.clientY - startingMousePos.y) / scale);

			worldCenter.style.transform = "scale(" + scale + ") translate(" + scrollPos.x + "px," + scrollPos.y + "px)";

			startingMousePos = {
				x: e.clientX,
				y: e.clientY
			};
		}
	});
});


// run when all content is loaded
window.addEventListener("load", function()
{
	plotSize = CalculatePlotSize();
	GenerateMap();
});


window.addEventListener('resize', function(){
	plotSize = CalculatePlotSize();
	GenerateMap();
});


function PlotDataExistanceState(q, x, y)
{
	if (x > worldPlots[q].length - 1)
		return -1 // x not created

	if (y > worldPlots[q][x].length - 1)
		return -2 // y not created

	if (worldPlots[q][x][y] == null)
		return -3 // x,y created, but no plot;

	return 0; // already created
}


function GenerateMap()
{
	if (generatingMap)
		return;

	generatingMap = true;

	screenCenterWorldPlot = GetScreenCenterWorldPlot();
	plotsOnScreenFromCenter = GetPlotsOnScreenFromCenter();

	let mapEdges = 
	{
		top: screenCenterWorldPlot.y + plotsOnScreenFromCenter.y,
		bottom: screenCenterWorldPlot.y - plotsOnScreenFromCenter.y,
		left: screenCenterWorldPlot.x - plotsOnScreenFromCenter.x,
		right: screenCenterWorldPlot.x + plotsOnScreenFromCenter.x,
	}

	// top left (quadrant 1)
	for (var x = mapEdges.left; x <= 0 ; x++)
	{
		for (var y = mapEdges.top; y >= 0 ; y--)
		{
			let plotcoordinate = 
			{
				x: Math.abs(x),
				y: Math.abs(y)
			};

			switch (PlotDataExistanceState(0, plotcoordinate.x, plotcoordinate.y))
			{
				case 0:
					continue;
				case -1:
				case -2:
					ExpandPlotData(0, plotcoordinate.x, plotcoordinate.y);
				case -3:
					CreatePlot("right", "bottom", 0, plotcoordinate.x, plotcoordinate.y, x - y);
					break;
				default:
					console.log("something went wrong");
			}
		}
	}


	// top right (quadrant 2)
	for (var x = mapEdges.right; x >= 0 ; x--)
	{
		for (var y = mapEdges.top; y >= 0 ; y--)
		{
			let plotcoordinate = 
			{
				x: Math.abs(x),
				y: Math.abs(y)
			};

			switch (PlotDataExistanceState(1, plotcoordinate.x, plotcoordinate.y))
			{
				case 0:
					continue;
				case -1:
				case -2:
					ExpandPlotData(1, plotcoordinate.x, plotcoordinate.y);
				case -3:
					CreatePlot("left", "bottom", 1, plotcoordinate.x, plotcoordinate.y, x - y);
					break;
				default:
					console.log("something went wrong");

			}
		}
	}

	// bottom left (quadrant 3)
	for (var x = mapEdges.left; x <= 0 ; x++)
	{
		for (var y = mapEdges.bottom; y <= 0 ; y++)
		{
			let plotcoordinate = 
			{
				x: Math.abs(x),
				y: Math.abs(y)
			};

			switch (PlotDataExistanceState(2, plotcoordinate.x, plotcoordinate.y))
			{
				case 0:
					continue;
				case -1:
				case -2:
					ExpandPlotData(2, plotcoordinate.x, plotcoordinate.y);
				case -3:
					CreatePlot("right", "top", 2, plotcoordinate.x, plotcoordinate.y, x - y);
					break;
				default:
					console.log("something went wrong");

			}
		}
	}

	// bottom right (quadrant 4)
	for (var x = mapEdges.right; x >= 0 ; x--)
	{
		for (var y = mapEdges.bottom; y <= 0 ; y++)
		{
			let plotcoordinate = 
			{
				x: Math.abs(x),
				y: Math.abs(y)
			};

			switch (PlotDataExistanceState(3, plotcoordinate.x, plotcoordinate.y))
			{
				case 0:
					continue;
				case -1:
				case -2:
					ExpandPlotData(3, plotcoordinate.x, plotcoordinate.y);
				case -3:
					CreatePlot("left", "top", 3, plotcoordinate.x, plotcoordinate.y, x - y);
					break;
				default:
					console.log("something went wrong");

			}	
		}
	}

	generatingMap = false;
}


function ExpandPlotData(q, x, y)
{
	let expanded = false

	if (worldPlots[q][x] == undefined)
	{
		expanded = true;

		for (var newx = worldPlots[q].length - 1; newx < x; newx++)
		{
			worldPlots[q].push([]);
		}
	}


	if (worldPlots[q][x][y] == undefined)
	{
		expanded = true;

		for (var newy = worldPlots[q][x].length - 1; newy < y; newy++)
		{
			worldPlots[q][x].push(null);
		}
	}

	return expanded;
}


function CreatePlot(x_orientation, y_orientation, q, x, y, z_index, callback)
{
	worldPlots[q][x][y] = new Plot(q, x, y);
	let plot_id = "plot_q" + q +"_x" + x + "_y" + y;

	worldCenter.innerHTML += "\
	<div id=\"" + plot_id + "\" class=\"world-plot-anchor\" style=\"z-index: " + z_index + "; " + x_orientation + ": calc(var(--worldPlotSize) * " + x + "); " + y_orientation + ": calc(var(--worldPlotSize) * " + y + ");\">\
		<div class=\"world-plot\">\
			<img class=\"plot-building\" src=\"" + worldPlots[q][x][y].building.imageurl + "\" />\
		</div>\
	</div>\
	";
}


function CalculatePlotSize(basePlotPixelWidth = 64) // plot size should always be a multiple of 8 for best look
{
	let windowHypotenuse = CalculateHypotenuse(window.innerHeight, window.innerWidth);

	let basePlotPixelHypotenuse = CalculateHypotenuse(basePlotPixelWidth, basePlotPixelWidth);
	let maxSmallestPlotAmount = Math.floor(windowHypotenuse/basePlotPixelHypotenuse); 

	let bestPlotSize = Math.floor(maxSmallestPlotAmount / 5) * basePlotPixelWidth;
	if (bestPlotSize < basePlotPixelWidth)
		bestPlotSize = basePlotPixelWidth;

	document.documentElement.style.setProperty('--worldPlotSize', bestPlotSize + 'px');
	return bestPlotSize;
}


function GetPlotsOnScreenFromCenter()
{
	let screenSize = 
	{
		x: window.innerWidth,
		y: window.innerHeight
	};

	let truePlotSize = plotSize * scale;

	let padding = 1;

	let plotsOnScreen = 
	{
		x: Math.ceil(screenSize.x / truePlotSize / 2) + padding,
		y: Math.ceil(screenSize.y / truePlotSize / 2) + padding
	};

	return plotsOnScreen;
}


function GetScreenCenterWorldPlot()
{
	let truePlotSize = plotSize * scale;

	let trueScrollPos = 
	{
		x: -scrollPos.x * scale,
		y: scrollPos.y * scale
	};

	let screenCenterWorldPlot = 
	{
		x: Math.floor(trueScrollPos.x / truePlotSize),
		y: Math.floor(trueScrollPos.y / truePlotSize)
	};

	return screenCenterWorldPlot;
}


function CalculateHypotenuse(a, b)
{
	let c = Math.pow(a, 2) + Math.pow(b, 2);
	return Math.sqrt(c);
}



