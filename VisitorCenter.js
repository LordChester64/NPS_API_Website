function getVisitorCenterDescription(){
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    var parkCode = searchParams.get("parkCode");
    var visitorCenterID = searchParams.get("visitorCenterID");
    getVisitorCenterInfo(parkCode).then(visitorCenterInfo => {
        buildVisitorCenterDetails(visitorCenterInfo, visitorCenterID);
    });
}

async function getVisitorCenterInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function getToken(token, prefix) {
    var encoded = "";
    token = decodeURI(token);
    for (i=0; i<token.length;i++) {
      var a = token.charCodeAt(i);
      var b = a ^ 51;    // bitwise XOR with any number, e.g. 123
      encoded = encoded+String.fromCharCode(b);
    }
    var slicedStr = encoded.slice(19, encoded.length);
    return slicedStr;
  }


function buildVisitorCenterDetails(visitorCenterInfo, visitorCenterID){
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