COMP4462 Project 2020 Spring
Accelerate

Dynamic Designs

Please open dynamic_designs.html for bubble, stream and bump;
and open map.html for uber map.
We recommend using local host.

-------------------------------------

dynamic_designs.html:	uber bubble, stream and bump. Controlled
			by the control panel on the left.
			Please refer to "Control Panel" section below.
map.html:		uber map, press buttons below to change
			the "red and gray" filter
rideshare_kaggle-final:	dataset from Kaggle, columns are modified.

**JavaScript

	js/all.js:		generate all graphs
	js/bubble.js:		js for bubble chart
	js/bump.js:		js for bump chart
	js/map.js:		js for uber map
	js/stream.js:		js for stream graph
	other js are libraries with used for our graphs

image/boston_map2.jpg:	used as background photo of uber map canvas

**Control Panel

	Choose relevant paramenters, and then press "generate" to 
	generate all three graphs. Please wait for about 10 seconds
	for the codes to load. Please refer to the Special Notes
	below for particular outputs.

Special Notes:
(1) 	For bubble: to show the Financial District price result,
	please tick all cab types, time range from 0 to 24,
	weekdays range 1 to 7, price range 40 to 89.5
(2)	For bump: to show locations popularity, please set:
		x-axis to: week
		y-axis to: pick-up / destination / pick-up & destination
	as there are missing data, we do not recommend using the
	"date" choice for x-axis.
(3)	For stream: to aviod any missing data, we recommend choosing
	more locations (tick more)
(4)	For stream: you can click on the stream to look at the data by
	cab-types. To do the reverse, please untick and tick the uber and/or
	lyft option(s), then press "generate".
(5)	You can hover on all graphs to show more details.
	for bubble: 	showing location name, price, etc.
	for stream: 	showing date, etc (on the bottom, and effect on graph)
	for bump:	hover on names (left/right): show particular bump
			hover on bumps:	show data of each column
