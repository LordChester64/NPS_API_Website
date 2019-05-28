//var config = JSON.parse(env);
function getCode(string) {
    var searchString = string;
    var parkCode = "";
    searchString = searchString.toLowerCase();
    searchString = searchString.replace("national", "");
    searchString = searchString.replace("park", "");
    searchString = searchString.replace(" of ", "");
    searchString = searchString.replace(" the ", "");
    searchString = searchString.replace(" and ", "");
    searchString = searchString.trim();
    var codeArray = searchString.split(" ");
    console.log(codeArray)
    if (codeArray.length === 1){
        parkCode = codeArray[0].substring(0, 4);
    }
    else{
        parkCode = codeArray[0].substring(0,2);
        parkCode += codeArray[1].substring(0,2);
    }
    console.log(parkCode);
    return parkCode;
}

async function getParkInfo(code) {
    console.log(config.API_Key);
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${code}&fields=images&api_key=${config.API_Key}`);

    const responseData = await response.json();

    return await responseData.data[0];
}

function getParkDescription(code) {
    getParkInfo(code).then(parkInfo => {
        console.log(`${parkInfo}`); 
        document.getElementById('parkFullName').innerText = decodeURIComponent(escape(parkInfo.fullName));
        document.getElementById('parkStates').innerText = "States: " + parkInfo.states;
        document.getElementById('parkName').innerText = "About the  " + parkInfo.designation;
        document.getElementById('parkDescription').innerText = parkInfo.description;
        document.getElementById("parkCode").innerText = "Park Code: " + parkInfo.parkCode;
        document.getElementById("parkID").innerText = "Park ID: " + parkInfo.id;
        image(parkInfo.images[0].url)
        });
    getCampgroundsInfo(code).then(campgroundsInfo => {
        buildCampgroundList(campgroundsInfo);
    });
    getVisitorCenterInfo(code).then(visitorCenterInfo => {
        buildVisitorCenterList(visitorCenterInfo);
    });
    getAlertInfo(code).then(alertInfo => {
        buildAlertList(alertInfo);
    });
}

function image(imgURL) {
    // var img = document.createElement("IMG");
    // img.src = imgURL;
    // img.style.height = "auto";
    // img.style.width = "100%";
    document.getElementById("parkPicture").src = imgURL;
}


//Campgrounds call

async function getCampgroundsInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/campgrounds?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildCampgroundList(campgroundInfo){
    campgroundList = "<h4>Campgrounds:</h4><hr/>";
    countOfCampgrounds = campgroundInfo.length;
    for (i = 0; i < countOfCampgrounds; i++){
        campgroundList += `<li class="campgroundItem"><a href="CampCard.html?parkCode=${campgroundInfo[i].parkCode}&campgroundID=${campgroundInfo[i].id}">${campgroundInfo[i].name}</a></li><hr />`;
    }
    document.getElementById("parkCampgrounds").innerHTML = campgroundList;
}


//Visitor Center call

async function getVisitorCenterInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildVisitorCenterList(visitorCenterInfo){
    visitorCenterList = "<h4>Visitor Centers:</h4><hr/>";
    countOfCenters = visitorCenterInfo.length;
    for (i = 0; i < countOfCenters; i++){
        visitorCenterList += `<li class="Visitor Center Item"><a href="VCCard.html?parkCode=${visitorCenterInfo[i].parkCode}&visitorCenterID=${visitorCenterInfo[i].id}"">${visitorCenterInfo[i].name}</a></li><hr />`;
    }
    document.getElementById("parkCenters").innerHTML = visitorCenterList;
}


//Alert call

async function getAlertInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/alerts?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildAlertList(alertInfo){
    alertList = ``;
    countOfAlerts = alertInfo.length;
    for (i = 0; i < countOfAlerts; i++){
        alertList += `<li class="alertItem"><h4>${alertInfo[i].title}</h4><p>${alertInfo[i].category}</p><p>${alertInfo[i].description}</p></li><hr />`;
    }
    document.getElementById("alertBox").innerHTML = alertList;
}




