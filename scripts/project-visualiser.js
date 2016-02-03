//Define parameters
var xSize = paper.view.bounds.width;
var ySize = paper.view.bounds.height-20;
var centre = new Point(xSize/2, ySize);
var totalRadius = (ySize/1.2);
var totalProjectAngle = 110;
var projectArcLineFactor = 1.03;

//States
var states = Object.freeze({Backlog: 0, Prioritised: 1, Working: 2, Testing: 3, Complete: 4, Released: 5});
var stateLines =
[
  {State: states["Backlog"], Lines: 1},
  {State: states["Prioritised"], Lines: 1},
  {State: states["Working"], Lines: 10},
  {State: states["Testing"], Lines: 1},
  {State: states["Complete"], Lines: 1},
  {State: states["Released"], Lines: 1},
];

//Project list
var projects =
[
  {Name: "Project A", StartDate: new Date(2016,1-1,24), TestDays: 5, EndDate: new Date(2016,4-1,24), Effort: 1.0, StateProgress: 0.5, State: states["Backlog"], Archive: false, Details: ""},
  {Name: "Project B", StartDate: new Date(2016,1-1,24), TestDays: 5, EndDate: new Date(2016,4-1,24), Effort: 0.4, StateProgress: 0.5, State: states["Prioritised"], Archive: false, Details: ""},
  {Name: "Project C", StartDate: new Date(2016,1-1,01), TestDays: 5, EndDate: new Date(2016,2-1,28), Effort: 0.1, StateProgress: 0.7, State: states["Working"], Archive: false, Details: ""},
  {Name: "Project D", StartDate: new Date(2016,1-1,24), TestDays: 25, EndDate: new Date(2016,2-1,24), Effort: 0.8, StateProgress: 0.5, State: states["Testing"], Archive: false, Details: ""},
  {Name: "Project E", StartDate: new Date(2016,1-1,24), TestDays: 5, EndDate: new Date(2016,1-1,24), Effort: 0.2, StateProgress: 0.5, State: states["Complete"], Archive: false, Details: ""},
  {Name: "Project F", StartDate: new Date(2016,1-1,24), TestDays: 5, EndDate: new Date(2016,2-1,24), Effort: 0.5, StateProgress: 0.5, State: states["Released"], Archive: true, Details: ""},
];


//Calculate number of lines required and line spacing
var innerSegmentLines = 5;
var totalLines = 0;
for(var i=0; i<stateLines.length; i++ ) {
  totalLines += stateLines[i]["Lines"]+1;
}
totalLines += innerSegmentLines;
var lineSpacing = totalRadius/totalLines;

//Outside arcline
ArcLine(centre, totalRadius, (totalProjectAngle/2)+100, false, [new Color(56/255, 11/255, 26/255, 1.0)], totalProjectAngle, 10);

//States
var remainingLines = totalLines;
for(var i=stateLines.length-1; i >= 0; i-- ) {
  var index = stateLines.length-1-i;
  var lineCount = stateLines[index]["Lines"];
  var state = Object.keys(states)[stateLines[index]["State"]];
  State(centre, remainingLines*lineSpacing, (remainingLines-lineCount-1)*lineSpacing, totalProjectAngle + 7.5+((i-1)*5), [new Color(186/255, 178/255, 177/255, 0.70-(i*0.12))], i*2.5, lineCount, state, totalProjectAngle);
  remainingLines -= lineCount+1;
}

//Projects
var projectCount = 0;
for(var i=0; i < projects.length; i++ ) {
  if (!projects[i]["Archive"]) {
    projectCount++;
  }
}
var projectSeparationAngle = totalProjectAngle / projectCount;
var projectOffsetAngle = projectSeparationAngle / 2;
var projectColour = [new Color(32/255, 0/255, 0/255, 1.0)];

//Project arcline
ArcLine(centre, totalRadius*projectArcLineFactor, (totalProjectAngle/2) + 90 - projectOffsetAngle, false, [new Color(87/255, 55/255, 105/255, 1.0)], totalProjectAngle, 90-(totalProjectAngle/2));
var circle = new Path.Circle(new Point(centre.x + totalRadius*projectArcLineFactor, centre.y), 4);
circle.fillColor = 'white';
circle.strokeColor = [new Color(87/255, 55/255, 105/255, 1.0)];

//Background project lines and stuff
for(var i=0; i < projects.length; i++ ) {
  var project = projects[i];
  if (!project["Archive"]) {
    //Line
    var line = new Path.Line(centre, new Point(centre.x, centre.y-totalRadius+1));
    line.strokeColor = new Color(255/255, 255/255, 255/255, 0.4);

    //Project circle
    var circle = new Path.Circle(new Point(centre.x, centre.y - (totalRadius*projectArcLineFactor)), 4);
    circle.fillColor = projectColour;

    //Rotation
    var group = new Group(line, circle);
    group.rotate(-(totalProjectAngle/2)+projectOffsetAngle+(projectSeparationAngle*i), centre);       
  }
}

//Project details
var projectColours = ["#FA37A8","#23b3e8","#d5547f","#9260a7"];
for(var i=0; i < projects.length; i++ ) {
  var project = projects[i];
  if (!project["Archive"]) {
    var project = new Project(centre, totalRadius, project, stateLines, lineSpacing, projectCount, new Color(projectColours[i % projectColours.length ]), totalProjectAngle, projectOffsetAngle, projectSeparationAngle);
  }
}

//Inner doughnuts
var innerSegmentWidth = lineSpacing * innerSegmentLines;
Doughnut(centre, innerSegmentWidth*0.9, innerSegmentWidth*0.53, [new Color(112/255, 129/255, 151/255, 1.0)]);
Doughnut(centre, innerSegmentWidth*0.43, innerSegmentWidth*0.39, [new Color(185/255, 224/255, 247/255, 1.0)]);
Doughnut(centre, innerSegmentWidth*0.37, innerSegmentWidth*0.11, [new Color(185/255, 224/255, 247/255, 1.0)]);
Doughnut(centre, innerSegmentWidth*0.12, innerSegmentWidth*0.02, [new Color(0/255, 89/255, 132/255, 1.0)]);

//TODO: Show project details in side bar when clicked on
//TODO: Archived items

//Objects
function State(centre, radius, innerRadius, angle, colour, angleOffset, lineCount, state, totalProjectAngle){
  //Create objects used to construct segment
  var doughnut = new Doughnut(centre, radius, innerRadius);
  var arc = new Arc(centre, radius, angle)
  arc.add(centre);

  //Calculate the rotation
  var rotation = (totalProjectAngle/2) - angle;
  if (angleOffset) {
    rotation = rotation + angleOffset
  }

  //Create segment object
  var segment = new Group(arc, doughnut);
  segment.clipped = true;
  segment.rotate(rotation, centre);
  segment.fillColor = colour;

  //Inner line
  var innerLine = ArcLine(centre, innerRadius, angle-angleOffset, true, [new Color(56/255, 11/255, 26/255, 1.0)], totalProjectAngle);
  
  //Group
  var group = new Group(segment, innerLine);

  //Internal lines
  for (var i = 1; i <= lineCount; i++)
  {
    var lineRadius = innerRadius + (i*(radius - innerRadius)/(lineCount+1));
    var arcLine = ArcLine(centre, lineRadius, totalProjectAngle, true, [new Color(145/255, 29/255, 68/255, 1.0)], totalProjectAngle);
    group.addChild(arcLine);
  }

  //State name
  var text = new PointText(new Point(centre.x-8, centre.y+3-radius+((radius-innerRadius)/2)));
  text.justification = 'right';
  text.fillColor = new Color(32/255, 0/255, 0/255, 1.0);
  text.content = state;
  var background = new Path.Rectangle(text.bounds);
  text.insertBelow(background);
  background.fillColor = new Color(255/255, 255/255, 255/255, 0.9);
  background.scale(1.1);
  var textGroup = new Group(background, text);
  textGroup.rotate(rotation, centre);
  textGroup.rotate(-(totalProjectAngle/2)-rotation-5.0, text.point);

  return group.addChild(textGroup);
}

function Project(centre, totalRadius, project, stateLines, lineSpacing, projectCount, projectColour, totalProjectAngle, projectOffsetAngle, projectSeparationAngle){
    //Project title
    var text = new PointText(new Point(centre.x, centre.y - (totalRadius*1.06)));
    text.justification = 'center';
    text.fillColor = projectColour;
    text.content = project["Name"];

    //State
    var projectState = project["State"];
    var projectLines = -1;
    for(var j=0; j<stateLines.length; j++ ) {
      var stateLine = stateLines[j];
      if (projectState == stateLine["State"])
      {
        projectLines += Math.round(((stateLine["Lines"]-1)*project["StateProgress"])+2);
        break;
      }
      projectLines += stateLine["Lines"]+1;
    }

    //Project bubble
    var outerRadius = 25*projectCount*project["Effort"];
    var bubble = new Doughnut(new Point(centre.x, centre.y - totalRadius + (lineSpacing*projectLines)), outerRadius, 2, projectColour);
    bubble.fillColor.alpha = 0.8;

    //Project status
    var now = new Date().getTime();
    var testingStartDate = project["EndDate"].getTime()-(project["TestDays"] * 86400000);
    var workingTime = testingStartDate - project["StartDate"].getTime();
    var elapsedTime = now - project["StartDate"].getTime();
    if (projectState < states["Working"] && project["StartDate"] < now) {
      project["Details"] = "Behind schedule - Not working";
    }
    if (project["StateProgress"] < elapsedTime/workingTime && projectState == states["Working"]) {
      project["Details"] = "Behind schedule - Not progressed enough";
    }
    if (testingStartDate < now && projectState < states["Testing"]) {
      project["Details"] = "Behind schedule - Not testing yet";
    }
    if (project["EndDate"] < now && projectState < states["Complete"]) {
      project["Details"] = "Behind schedule - Not complete yet";
    }

    var statusBubble = new Doughnut(new Point(centre.x, centre.y - totalRadius + (lineSpacing*projectLines)), outerRadius+4, outerRadius+2, [new Color(72/255, 186/255, 60/255, 0.8)]);
    if (project["Details"] != "") {
      statusBubble.fillColor = [new Color(238/255, 28/255, 36/255, 0.8)];
    }


    //Rotation
    var group = new Group(circle, text, bubble, statusBubble);
    group.rotate(-(totalProjectAngle/2)+projectOffsetAngle+(projectSeparationAngle*i), centre);
}

function ArcLine(centre, radius, angle, beginningCircle, colour, totalProjectAngle, angleOffset){
  var rotation = (totalProjectAngle/2)-angle;
  if (angleOffset) {
    rotation = rotation + angleOffset
  }
  var arc = new Arc(centre, radius, angle)
  arc.rotate(rotation, centre);
  arc.strokeColor = colour;        

  if (beginningCircle) {
    var circle = new Path.Circle(arc.segments[0].point.x, arc.segments[0].point.y, 3);
    circle.fillColor = colour;
    return new Group(arc, circle);
  }

  return new Group(arc);
}

function Arc(centre, radius, angle){
  var start = new Point(centre.x, centre.y-radius);
  var throughX = centre.x + (radius * Math.cos((((angle/2)-90)/180)*Math.PI));
  var throughY = centre.y + (radius * Math.sin((((angle/2)-90)/180)*Math.PI));
  var through = new Point(throughX, throughY);
  var toX = centre.x + (radius * Math.cos(((angle-90)/180)*Math.PI));
  var toY = centre.y + (radius * Math.sin(((angle-90)/180)*Math.PI));
  var to = new Point(toX, toY);
  return new Path.Arc(start, through, to);
}

function Doughnut(centre, radius, innerRadius, colour){
  var circle = new Path.Circle(centre, radius);
  var innerCircle = new Path.Circle(centre, innerRadius);
  var doughnut = circle.subtract(innerCircle);
  if (colour) {
    doughnut.fillColor = colour;
  }
  return doughnut;
}  

//Events
function onFrame(event) {
}