function addRow() {
    let bodyObj = document.getElementById("tbody");
    if (!bodyObj) {
        alert("Body of Table not Exist!");
        return;
    }
//below this all have bug
//    let courseName = document.getElementById("Course Name").value;
//    let courseCode = document.getElementByName("Course Code").value;
//    let language = document.getElementByName("meta").value;
//    let teacher = document.getElementByName("teacher").value;
//    let date = document.getElementByName("date").value;
//    let time = document.getElementByName("time").value;
//    let position = document.getElementByName("skills").value;
//    let duration = document.getElementByName("duration").value;
    let rowCount = bodyObj.rows.length;
    let cellCount = bodyObj.rows[0].cells.length;
    bodyObj.style.display = ""; // display the tbody
    let newRow = bodyObj.insertRow(rowCount++);
    bodyObj.rows[0].style.display = "none"; // hide first row
    newRow.insertCell(0).innerHTML = document.forms[0]["Course Name"].value;
    newRow.insertCell(1).innerHTML = document.forms[0]["Course Code"].value;
    newRow.insertCell(2).innerHTML = document.forms[0]["meta"].value;
    newRow.insertCell(3).innerHTML = document.forms[0]["teacher"].value;
    newRow.insertCell(4).innerHTML = document.forms[0]["date"].value.replaceAll("-", "/");
    newRow.insertCell(5).innerHTML = document.forms[0]["time"].value;
//    newRow.insertCell(6).innerHTML = document.forms[0]["skills"].value;//this three have bugs
//    newRow.insertCell(7).innerHTML = document.forms[0]["duration"].value;
    newRow.insertCell(8).innerHTML = bodyObj.rows[0].cells[cellCount - 1].innerHTML; // copy the "delete" button
}

function onClickAdd() {
    let courseName = document.querySelector('form input[name="Course Name"]').value;
    let courseCode = document.querySelector('form input[name="Course Code"]').value;
    let teacher = document.querySelector('form input[name="teacher"]').value;
    let date = document.querySelector('form input[name="date"]').value;
    let time = document.querySelector('form input[name="time"]').value;
//    let duration = document.querySelector('.duration').value;// this have bug
    if (validateInput(courseName, courseCode, teacher, date, time)) {
        addRow();
    }
}



function validateInput(courseName, courseCode, teacher, date, time) {
    let teacher_and_course = new RegExp(/[A-z]+/);
    let coursecode = new RegExp(/[A-z0-9]+/);
    if (!teacher_and_course.test(teacher) && !teacher_and_course.test(courseName)){
        alert("Course code and teacher should be English")
        return false;
    }
    if (!coursecode.test(courseCode)){
        alert("Invalid course code")
        return false;
    }

    var dateNow = new Date();
    var year = dateNow.getYear()
    var month = dateNow.getMonth()
    var day = dateNow.getDate()
//    if (date.getYear() < year){//this have bug
//        alert("Invalid date input")
//        return false;
//    } else if (date.getYear() == year && date.getMonth() < month){
//        alert("Invalid date input")
//        return false;
//    } else if (date.getYear() == year && date.getMonth() == month && date.getDate() < day) {
//        alert("Invalid date input")
//        return false;
//    }
    return true;
}

function removeRow(inputobj) {
    if (!inputobj) return;
    let parentTD = inputobj.parentNode;
    let parentTR = parentTD.parentNode;
    let parentTBODY = parentTR.parentNode;
    parentTBODY.removeChild(parentTR);
}

function cancelOp(){
    window.opener=null;
    window.open('','_self');
    window.close();
}



