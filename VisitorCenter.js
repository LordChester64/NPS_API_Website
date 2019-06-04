//var config = JSON.parse(env);

function getVisitorCenterDescription(){
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    for (let p of searchParams){
        console.log(p);
    }
    var parkCode = searchParams.get("parkCode");
    var visitorCenterID = searchParams.get("visitorCenterID");
    getVisitorCenterInfo(parkCode).then(visitorCenterInfo => {
        buildVisitorCenterDetails(visitorCenterInfo, visitorCenterID);
    });
}


async function getVisitorCenterInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildVisitorCenterDetails(visitorCenterInfo, visitorCenterID){
    console.log(visitorCenterInfo);
    visitorCenterList = "";
    countOfVisitorCenters = visitorCenterInfo.length;
    for (i = 0; i < countOfVisitorCenters; i++){
        if (visitorCenterID === visitorCenterInfo[i].id){
            thisVisitorCenter = visitorCenterInfo[i];
            break;
        }
    }
    document.getElementById("visitorCenterName").innerText = `${thisVisitorCenter.name}`;
    document.getElementById("visitorCenterNameHeading").innerText = `About ${thisVisitorCenter.name}:`;
    document.getElementById("visitorCenterDescription").innerText = `${thisVisitorCenter.description}`;
    document.getElementById("visitorCenterURL").innerHTML = `<a href="${thisVisitorCenter.url}">Learn More Here!</a>`;
}
