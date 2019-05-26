var config = JSON.parse(env);
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
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${code}&api_key=${config.API_Key}`);

    const responseData = await response.json();

    return await responseData.data[0];
}

function getParkDescription(code) {
    getParkInfo(code).then(parkInfo => {
        console.log(`${parkInfo}`); 
        document.getElementById('parkFullName').innerText = parkInfo.fullName;
        document.getElementById('parkStates').innerText = parkInfo.states;
        });
}







