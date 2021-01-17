var dbTrainSheludeRef = firebase.database().ref().child('trainSchedule');
var addTrainForm = document.querySelector('form');
var trainScheduleTable = document.querySelector('table');

addTrainForm.addEventListener('submit', function(e)
{
    e.preventDefault();
    var trainName = document.querySelector('#trainName').value;    
    var destination = document.querySelector('#destination').value;
    var trainTime = document.querySelector('#trainTime').value;   
    var frequency = document.querySelector('#frequency').value;   

    var newTrainSheludeRef = dbTrainSheludeRef.push();
    newTrainSheludeRef.set({
        'trainName' : trainName,
        'destination' : destination,
        'trainTime' : trainTime,
        'frequency' : frequency
    });
    addTrainForm.reset();
});

dbTrainSheludeRef.on('value', snap => 
{
    var trainRows = document.querySelectorAll('table tr:not(:first-child)');
    console.log(trainRows);
    for (var i = 0; i < trainRows.length; i++)
    {
        trainRows[i].remove();
    }
    
    var trainSchedule = snap.val();
    Object.keys(trainSchedule).forEach(function(key)
    {
        
        var minutesAway = getMinutesToNextArrival(trainSchedule[key].trainTime, trainSchedule[key].frequency);
        var nextArrivalTime = getNextArrivalTime(minutesAway);
        var trainRow = document.createElement('tr');
        
        trainRow.id = key;
        trainRow.innerHTML = `
        <td>${trainSchedule[key].trainName}</td>
        <td>${trainSchedule[key].destination}</td>
        <td>${trainSchedule[key].frequency}</td>
        <td>${nextArrivalTime}</td>
        <td>${minutesAway}</td>
        `;
        trainScheduleTable.appendChild(trainRow);
    });
});

function getMinutesToNextArrival(time, freq)
{
    var startHours = Number(time.split(':')[0]);
    var startMinutes = Number(time.split(':')[1]);
    var currHours = new Date().getHours();
    currHours = currHours % 12;
    currHours = currHours ? currHours : 12;
    
    var frequency = Number(freq);
    var startDayMinutes = startHours * 60 + startMinutes;
    var currDayMinutes = currHours * 60 + currMinutes;
    var nextArrival = startDayMinutes - currDayMinutes;
    if (nextArrival < 0)
    {
        while (nextArrival < 0)
            nextArrival +=frequency;
    }
    while (nextArrival > frequency)
    {
        nextArrival -= frequency;
    }

    return nextArrival;
}

function getNextArrivalTime(minutesAway)
{
    var nextArrivalTime = new Date();
    nextArrivalTime.setTime(nextArrivalTime.getTime() + minutesAway * 60000);

    return nextArrivalTime;
}

function formatAMPM(date) 
{
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
