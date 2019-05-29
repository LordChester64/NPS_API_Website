function getLearningMaterials(){
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    for (let p of searchParams){
        console.log(p);
    }
    var parkCode = searchParams.get("parkCode");
    getLessonInfo(parkCode).then(lessonInfo => {
        buildLessonDetails(lessonInfo);
    });
}


async function getLessonInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/lessonplans?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildLessonDetails(lessonInfo){
    console.log(lessonInfo);
    lessonList = "";
    countOfLessons = lessonInfo.length;
    for (i = 0; i < countOfLessons; i++){
        lessonList += `<h3 id="lessonTitle">${lessonInfo[i].title}</h3><h5 id="lessonSubject">${lessonInfo[i].subject}</h5><h6 id="lessonGradeLevel">Grade level: ${lessonInfo[i].gradelevel}</h6>`;
        lessonList += `<p>${lessonInfo[i].questionobjective}</p><hr />`;
    }
    document.getElementById("lessonScroll").innerHTML = lessonList;
    // document.getElementById("campgroundNameHeading").innerText = `About ${thisCampground.name}:`;
    // document.getElementById("campgroundDescription").innerText = `${thisCampground.description}\n`;
    // document.getElementById("campgroundDirectionsHeading").innerText = `Directions:\n`;
    // document.getElementById("campgroundDirections").innerText = `${thisCampground.directionsoverview}`;
    // document.getElementById("campgroundReservationLink").innerHTML = `<a href="${thisCampground.regulationsurl}">Regulations for the campsite</a>`;
    // displayMap(thisCampground);
    
}