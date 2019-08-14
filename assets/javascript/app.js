document.getElementById("submit-button").addEventListener("click", function(event){
    event.preventDefault();
    submitForum();
})


function submitForum(){
    const trainData = {
        trainName: document.getElementById("train-name").value,
        destination: document.getElementById("destination").value,
        trainTime: document.getElementById("first-train-time").value,
        frequency: document.getElementById("frequency").value
    }
    forageGetData(function(data){
        if(data === "err"){
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
    }).catch(err => {
        cb("err")
    })
}


function forageSetData(localArr){
    localforage.setItem("dataArr", localArr).then(data => {
        return data;
    })
}