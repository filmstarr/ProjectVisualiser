//Data
var date = new Date();
var states = Object.freeze({Backlog: 0, Prioritised: 1, Working: 2, Testing: 3, Complete: 4, Released: 5});
var projects = [
  {Name: "Project A", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper ornare semper. Donec accumsan libero.", StartDate: new Date(2016,6-1,1), TestDays: 28, EndDate: new Date(2016,12-1,1), Effort: 1.0, StateProgress: 1.0, State: states.Prioritised},
  {Name: "Project B", Description: "Curabitur ullamcorper ornare semper.", StartDate: new Date(2016,1-1,1), TestDays: 1, EndDate: new Date(2016,2-1,1), Effort: 0.4, StateProgress: 1.0, State: states.Released},
  {Name: "Project C", Description: "Curabitur ullamcorper ornare semper.", StartDate: new Date(2016,6-1,1), TestDays: 21, EndDate: new Date(2016,8-1,1), Effort: 0.8, StateProgress: 0.9, State: states.Working},
  {Name: "Project D", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", StartDate: new Date(2015,12-1,1), TestDays: 7, EndDate: new Date(2016,2-1,29), Effort: 0.7, StateProgress: 0.3, State: states.Working},
  {Name: "Project E", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", StartDate: new Date(2016,9-1,1), TestDays: 14, EndDate: new Date(2016,11-1,1), Effort: 0.3, StateProgress: 1.0, State: states.Prioritised},
  {Name: "Project F", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper ornare semper.", StartDate: new Date(2016,1-1,1), TestDays: 14, EndDate: new Date(2016,4-1,15), Effort: 1.0, StateProgress: 0.4, State: states.Working},
  {Name: "Project G", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", StartDate: new Date(2016,9-1,1), TestDays: 7, EndDate: new Date(2016,12-1,1), Effort: 0.6, StateProgress: 1.0, State: states.Prioritised},
  {Name: "Project H", Description: "Donec accumsan libero.", StartDate: new Date(2016,2-1,1), TestDays: 7, EndDate: new Date(2016,2-1,1), Effort: 0.3, StateProgress: 0.3, State: states.Working},
  {Name: "Project I", Description: "Donec accumsan libero.", StartDate: new Date(2016,12-1,1), TestDays: 21, EndDate: new Date(2017,02-1,1), Effort: 0.4, StateProgress: 1.0, State: states.Prioritised},
  {Name: "Project J", Description: "Curabitur ullamcorper ornare semper.", StartDate: new Date(2016,2-1,1), TestDays: 7, EndDate: new Date(2016,4-1,29), Effort: 0.3, StateProgress: 0.2, State: states.Working},
  {Name: "Project K", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper ornare semper.", StartDate: new Date(2016,4-1,1), TestDays: 14, EndDate: new Date(2016,6-1,1), Effort: 0.5, StateProgress: 1.0, State: states.Prioritised},
  {Name: "Project L", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", StartDate: new Date(2016,1-1,21), TestDays: 14, EndDate: new Date(2016,4-1,1), Effort: 0.7, StateProgress: 0.5, State: states.Working},
  {Name: "Project M", Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper ornare semper.", StartDate: new Date(2016,1-14,1), TestDays: 2, EndDate: new Date(2016,3-1,1), Effort: 0.2, StateProgress: 1.0, State: states.Testing},
];

projects = projects.sort(function(a, b) {
  if (a.Name < b.Name)
    return -1;
  else if (a.Name > b.Name)
    return 1;
  else 
    return 0;
});

//Define parameters
var xSize = paper.view.bounds.width;
var ySize = paper.view.bounds.height-20;
var centre = new Point(xSize/2, ySize);
var totalRadius = Math.min((ySize/1.2),(xSize/2))-1;
var totalProjectAngle = 110;
var projectArcLineFactor = 1.03;
var stateLines =
[
  {State: states.Backlog, Lines: 1},
  {State: states.Prioritised, Lines: 1},
  {State: states.Working, Lines: 10},
  {State: states.Testing, Lines: 1},
  {State: states.Complete, Lines: 1},
  {State: states.Released, Lines: 1},
];


//Date
var textSize = 35;
var dateText = new PointText(new Point(xSize,12+(textSize/2)));
dateText.justification = "right";
dateText.fillColor = new Color(32/255, 0/255, 0/255, 1.0);
dateText.fontSize = textSize;
dateText.content = "Status as at: " + GetDateString(date);

//Calculate number of lines required and line spacing
var innerSegmentLines = 5;
var totalLines = 0;
for(var i=0; i<stateLines.length; i++ ) {
  totalLines += stateLines[i].Lines+1;
}
totalLines += innerSegmentLines;
var lineSpacing = totalRadius/totalLines;

//Outside arcline
ArcLine(centre, totalRadius, (totalProjectAngle/2)+100, false, [new Color(56/255, 11/255, 26/255, 1.0)], totalProjectAngle, 10);

//States
var remainingLines = totalLines;
for(var i=stateLines.length-1; i >= 0; i-- ) {
  var index = stateLines.length-1-i;
  var lineCount = stateLines[index].Lines;
  var state = Object.keys(states)[stateLines[index].State];
  State(centre, remainingLines*lineSpacing, (remainingLines-lineCount-1)*lineSpacing, totalProjectAngle + 7.5+((i-1)*5), [new Color(186/255, 178/255, 177/255, 0.70-(i*0.12))], i*2.5, lineCount, state, totalProjectAngle);
  remainingLines -= lineCount+1;
}

//Projects
var projectCount = 0;
for(var i=0; i < projects.length; i++ ) {
  if (!projects[i].Archive) {
    projectCount++;
  }
}
var projectSeparationAngle = totalProjectAngle / projectCount;
var projectOffsetAngle = projectSeparationAngle / 2;
var projectColour = [new Color(32/255, 0/255, 0/255, 1.0)];

//Project arcline
ArcLine(centre, totalRadius*projectArcLineFactor, (totalProjectAngle/2) + 90 - projectOffsetAngle, false, [new Color(87/255, 55/255, 105/255, 1.0)], totalProjectAngle, 90-(totalProjectAngle/2));
var circle = new Path.Circle(new Point(centre.x + totalRadius*projectArcLineFactor, centre.y), 4);
circle.fillColor = "white";
circle.strokeColor = [new Color(87/255, 55/255, 105/255, 1.0)];

//Background project lines
for(var i=0; i < projects.length; i++ ) {
  var project = projects[i];
  //Line
  var line = new Path.Line(centre, new Point(centre.x, centre.y-totalRadius+1));
  line.strokeColor = new Color(255/255, 255/255, 255/255, 0.4);
  line.rotate(-(totalProjectAngle/2)+projectOffsetAngle+(projectSeparationAngle*i), centre);       
}

//Inner doughnuts
var innerSegmentWidth = lineSpacing * innerSegmentLines;
Doughnut(centre, innerSegmentWidth*0.9, innerSegmentWidth*0.53, [new Color(112/255, 129/255, 151/255, 1.0)]);
Doughnut(centre, innerSegmentWidth*0.43, innerSegmentWidth*0.39, [new Color(185/255, 224/255, 247/255, 1.0)]);
Doughnut(centre, innerSegmentWidth*0.37, innerSegmentWidth*0.11, [new Color(185/255, 224/255, 247/255, 1.0)]);
Doughnut(centre, innerSegmentWidth*0.12, innerSegmentWidth*0.02, [new Color(0/255, 89/255, 132/255, 1.0)]);

//Project details
var projectColours = ["#FA37A8","#23B3E8","#D5547F","#00E957","#9260A7"];
for(var i=0; i < projects.length; i++ ) {
  var project = projects[i];
  Project(centre, totalRadius, project, stateLines, lineSpacing, projectCount, new Color(projectColours[i % projectColours.length ]), totalProjectAngle, projectOffsetAngle, projectSeparationAngle, states, date);
}



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
  text.justification = "right";
  text.fillColor = new Color(32/255, 0/255, 0/255, 1.0);
  text.content = state;
  var background = new Path.Rectangle(text.bounds);
  background.fillColor = new Color(255/255, 255/255, 255/255, 0.9);
  background.scale(1.1);
  var textGroup = new Group(background, text);
  textGroup.rotate(rotation, centre);
  textGroup.rotate(-(totalProjectAngle/2)-rotation-5.0, text.point);

  return group.addChild(textGroup);
}

function Project(centre, totalRadius, project, stateLines, lineSpacing, projectCount, projectColour, totalProjectAngle, projectOffsetAngle, projectSeparationAngle, states, date){
    //Project title
    var text = new PointText(new Point(centre.x, centre.y - (totalRadius*1.06)));
    text.justification = "center";
    text.fillColor = projectColour;
    text.content = project.Name;

    //State
    var projectState = project.State;
    var projectLines = -1;
    for(var j=0; j<stateLines.length; j++ ) {
      var stateLine = stateLines[j];
      if (projectState == stateLine.State)
      {
        projectLines += Math.round(((stateLine.Lines-1)*project.StateProgress)+2);
        break;
      }
      projectLines += stateLine.Lines+1;
    }

    //Project circle
    var circle = new Path.Circle(new Point(centre.x, centre.y - (totalRadius*projectArcLineFactor)), 4);
    circle.fillColor = projectColour;

    //Project bubble
    var outerRadius = 1.5*(totalRadius/projectCount)*project.Effort;
    var bubblePoint = new Point(centre.x, centre.y - totalRadius + (lineSpacing*projectLines));
    var eventBubble = new Doughnut(bubblePoint, outerRadius, 0, new Color(1.0,1.0,1.0,0.0));
    var bubble = new Doughnut(bubblePoint, outerRadius, 2, projectColour);
    bubble.fillColor.alpha = 0.8;

    //Project status
    UpdateStatus(project, date)
    var statusBubble = new Doughnut(bubblePoint, outerRadius+4, outerRadius+2, [new Color(72/255, 186/255, 60/255, 0.8)]);
    if (project.Status != "On schedule") {
      statusBubble.fillColor = [new Color(238/255, 28/255, 36/255, 0.8)];
    }

    //Rotation
    var group = new Group(circle, text, eventBubble, bubble, statusBubble);
    group.rotate(-(totalProjectAngle/2)+projectOffsetAngle+(projectSeparationAngle*i), centre);
  
    //Events
    var scalingFactor = 1.3;

    group.onMouseEnter = function(event) {
      bubble.scale(scalingFactor);
      statusBubble.scale(scalingFactor);
      UpdateProjectDetails(project, states);
    }

    group.onMouseLeave = function(event) {
      bubble.scale(1.0/scalingFactor);
      statusBubble.scale(1.0/scalingFactor);
      if (projectDetails) {
        projectDetails.removeChildren();
      }
    }

    function UpdateStatus(project, date) {
      project.Status = "On schedule";
      var projectState = project.State;
      var testingStartDate = project.EndDate.getTime()-(project.TestDays * 86400000);
      var workingTime = testingStartDate - project.StartDate.getTime();
      var elapsedTime = date - project.StartDate.getTime();
      if (projectState < states.Working && project.StartDate < date) {
        project.Status = "Behind schedule - should be working";
      }
      if (project.StateProgress < elapsedTime/workingTime && projectState == states.Working) {
        project.Status = "Behind schedule - should be further progressed";
      }
      if (testingStartDate < date && projectState < states.Testing) {
        project.Status = "Behind schedule - should be in testing";
      }
      if (project.EndDate < date && projectState < states.Complete) {
        project.Status = "Behind schedule - should be complete";
      }
    }
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

function PaddedRoundRectangle(template, xPaddingLeft, yPaddingLeft, xPaddingRight, yPaddingRight) {
  var cornerSize = new Size(3, 3);
  var bounds = template.bounds;
  var point1 = new Point(bounds.x-xPaddingLeft, bounds.y-yPaddingLeft);
  var point2 = new Point(bounds.x+bounds.width+xPaddingRight, bounds.y+bounds.height+yPaddingRight);
  return new Path.RoundRectangle(new Rectangle(point1, point2), cornerSize);
}

var projectDetails;
function UpdateProjectDetails(project, states) {
  if (projectDetails) {
    projectDetails.removeChildren();
  }
  
  var padding = 3;
  var textSize = 15;
  var xOffset = 106;
  var properties = new PointText(new Point(xOffset,textSize+(2*padding)));
  properties.justification = "right";
  properties.fillColor = new Color(32/255, 0/255, 0/255, 1.0);
  properties.fontSize = textSize;
  var values = new PointText(new Point(xOffset+(2*padding),textSize+(2*padding)));
  values.justification = "left";
  values.fillColor = new Color(32/255, 0/255, 0/255, 1.0);
  values.fontSize = textSize;

  //Write out details
  for (var key in project) {
    if (project.hasOwnProperty(key)) {
      if (properties.content != "") {
        properties.content += "\n";
        values.content += "\n";
      }

      properties.content += key + ":";
      var value = project[key];
      switch(key) {
        case "Effort":
          values.content += (100*value) + "%";
          break;
        case "StateProgress":
          values.content += (100*value) + "%";
          break;
        case "StartDate":
          values.content += GetDateString(value);
          break;
        case "EndDate":
          values.content += GetDateString(value);
          break;
        case "State":
          values.content += Object.keys(states)[value];
          break;
        default:
          values.content += value;
      }
    }
  }

  //Background
  var propertiesBackground = new PaddedRoundRectangle(properties, padding, padding, padding, padding);
  propertiesBackground.fillColor = new Color(219/255, 215/255, 215/255, 0.5);
  var valuesBackground = new PaddedRoundRectangle(new Group(propertiesBackground, values), 0, 0, padding, 0);
  valuesBackground.fillColor = new Color(243/255, 242/255, 242/255, 0.9);
  var outline = new PaddedRoundRectangle(valuesBackground, padding-1, padding-1, padding-1, padding-1);
  outline.strokeColor = new Color(219/255, 215/255, 215/255, 1.0);
  projectDetails = new Group(valuesBackground, propertiesBackground, outline, properties, values);
}

function GetDateString(date) {
  var day = date.getDate().toString();
  day = day.length == 1 ? "0" + day : day;
  var month = (date.getMonth() + 1).toString();
  month = month.length == 1 ? "0" + month : month;  
  var year = date.getFullYear();
  return  year + "-" + month + "-" + day;
}