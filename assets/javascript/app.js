document.getElementById("submit-button").addEventListener("click", function(event){
    event.preventDefault();
    submitForum();
})

updateTable();

setInterval(function(){
    updateTable();
},60000)

function submitForum(){
    const trainData = {
        trainName: document.getElementById("train-name").value,
        destination: document.getElementById("destination").value,
        trainTime: document.getElementById("first-train-time").value,
        frequency: document.getElementById("frequency").value
    }
    forageGetData(function(data){
        if(data === null){
            forageSetData([trainData]);
        } else {
            data.push(trainData);
            forageSetData(data);
        }
        document.getElementById("train-name").value = "";
        document.getElementById("destination").value = "";
        document.getElementById("first-train-time").value = "";
        document.getElementById("frequency").value = "";
    })
}


function forageGetData(cb){
    localforage.getItem("dataArr").then(data => {
        cb(data);
    })
}


function forageSetData(localArr){
    localforage.setItem("dataArr", localArr).then(data => {
        return data;
    })
}

function updateTable(){
    forageGetData(function(data){
        if (data === null) return;
        const table = document.getElementById("data-table");
        table.innerHTML = `
        <tr>
            <th>Train Name</th>
            <th>Destination</th>
            <th>Frequency (min)</th>
            <th>Next Arrival</th>
            <th>Minutes Away</th>
        </tr>`;

        for(let i = 0; i<data.length; i++){
            const times = doTrainMath(data[i].trainTime, data[i].frequency);
            let newTr = document.createElement("tr");
            const finalDataArr = [data[i].trainName, data[i].destination, data[i].frequency, times.arriveTime, times.minTillTrain];
            for(let j = 0; j<finalDataArr.length; j++){
                let newTh = newth(newTr, finalDataArr[j], finalDataArr[0]);
                newTr.appendChild(newTh);
            }

            // newTr.innerHTML = `
            // <th>${data[i].trainName}</th>
            // <th>${data[i].destination}</th>
            // <th>${data[i].frequency}</th>
            // <th>${times.arriveTime}</th>
            // <th>${times.minTillTrain}</th>`;
            table.appendChild(newTr);
        }
    })
}

function newth (newTr, content, identifier){
    const th = document.createElement("th");
    th.textContent = content;
    th.addEventListener("click", function(){
        const newInput = document.createElement("input");
        newInput.value = this.textContent;
        this.innerHTML = `<input type="text" value="${this.textContent}">`;
    })
    return th
}

//do math on the train times to get how long it wll be until the next train will arrive 
function doTrainMath(trainTime, frequency){

    //take the first time of the train arriving at the station and set it to exactly 1 year ago to be positive that it is in the past
    const trainTimeOneYear = moment(trainTime, "HH:mm").subtract(1, "years");

    // get the difference between now and the 1 year old time in minutes to modulus against the frequency (amount of minutes it takes the train to arrive after leaving)
    const timeDifference = moment().diff(moment(trainTimeOneYear), "minutes");

    //now we take the time difference (essentially a year in minutes give or take a couple of hours) and divide it by the argument frequency that is passed in to the function
    const timeRemainder = timeDifference % frequency;

    //now we take the timeRemainder and subtract it from the time frequency to get how long we have until the next train arrives as the timeRemainder is how long (in minutes) it has been since the train last left
    minTillTrain = frequency - timeRemainder;


    //return an object with the calculated times
    return {
        minTillTrain: minTillTrain,
        arriveTime: moment(moment().add(minTillTrain, "minutes")).format("hh:mm")
    }
}