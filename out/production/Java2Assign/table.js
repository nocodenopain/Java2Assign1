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
    newRow.insertCell(6).innerHTML = document.forms[0]["skills"].value;
    newRow.insertCell(7).innerHTML = document.forms[0]["duration"].value + "h";
    newRow.insertCell(8).innerHTML = bodyObj.rows[0].cells[cellCount - 1].innerHTML; // copy the "delete" button
}

function onClickAdd() {
    let courseName = document.querySelector('form input[name="Course Name"]').value;
    let courseCode = document.querySelector('form input[name="Course Code"]').value;
    let teacher = document.querySelector('form input[name="teacher"]').value;
    let date = document.querySelector('form input[name="date"]').value;
    let time = document.querySelector('form input[name="time"]').value;
    let language = document.querySelector('form input[name="meta"]').value;
    let location = document.forms[0]["skills"].value;
    let duration = document.querySelector('form input[name="duration"]').value;
    if (validateInput(courseName, courseCode, teacher, date, time, duration, language, location)) {
        addRow();
        document.getElementsByClassName('dialog')[0].close();
    }
}



function validateInput(courseName, courseCode, teacher, date, time, duration, language, location) {
    let teacher_and_course = new RegExp(/[A-z]+/);
    let coursecode = new RegExp(/([A-z]+[0-9]+)|([0-9]+[A-z]+)/);
    let durationRegex = new RegExp(/^[0-9]+/);
    let form = document.getElementById('tbody');
    if (!teacher_and_course.test(teacher) && !teacher_and_course.test(courseName)){
        alert("Course name and teacher should be English")
        return false;
    }
    if (!coursecode.test(courseCode)){
        alert("Invalid course code")
        return false;
    }
    if (language === "") {
        alert("Invalid language");
    }
//    var dateNow = new Date();
//    var year = dateNow.getYear();
//    var month = dateNow.getMonth();
//    var day = dateNow.getDate();

    let cdate = new Date().toLocaleDateString();
    let ctime = new Date().toLocaleTimeString();

    cdate = cdate.replaceAll('/', '-');

    let fir = date.concat(time);
    let sec = cdate.concat(ctime);

    if(fir < sec){
        alert("Invalid date");
        return false;
    }

    if (time === ""){
        alert("Invalid time");
        return false;
    }
    if (!durationRegex.test(duration)){
        alert("Invalid duration");
        return false;
    }

    let tmp;
    for (let i = 1; i < form.rows.length; i++) {
            tmp = date.toString().replaceAll("-", "/")
            if (courseName === form.rows[i].cells[0].innerHTML && tmp === form.rows[i].cells[4].innerHTML) {
                alert("One course is scheduled at most once a day")
                return false;
            }
            if (courseCode === form.rows[i].cells[1].innerHTML) {
                alert("Different courses should have different course codes");
                return false;
            }
            if (teacher === form.rows[i].cells[3].innerHTML && tmp === form.rows[i].cells[4].innerHTML) {
                alert("Each teacher can take no more than one lecture per day");
                return false;
            }
            let timeToday = form.rows[i].cells[5].innerHTML.toString();
            if (timeToday === time && tmp === form.rows[i].cells[4].innerHTML && location === form.rows[i].cells[6].innerHTML) {
                alert("Any two different courses cannot share one room at the same time")
                return false;
            }
        }
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
    document.getElementsByClassName('dialog')[0].close();
}

function showDialog() {
    // 展示
    document.getElementsByClassName('dialog')[0].showModal();
}

let rowEdit;

function showEdit(inputobj) {
    // 展示
    document.getElementsByClassName('edit')[0].showModal();
    rowEdit = inputobj.parentNode.parentNode;
}

function cancelEdit(){
    document.getElementsByClassName('edit')[0].close();
}

function onClickEdit(){
//    let new_Date = new Date().replaceAll("-", "/");
    let new_Date = new Date();
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.deleteCell(0);
    rowEdit.insertCell(0).innerHTML = document.forms[1]["Course Name"].value;
    rowEdit.insertCell(1).innerHTML = document.forms[1]["Course Code"].value;
    rowEdit.insertCell(2).innerHTML = document.forms[1]["meta"].value;
    rowEdit.insertCell(3).innerHTML = document.forms[1]["teacher"].value;
    rowEdit.insertCell(4).innerHTML = document.forms[1]["date"].value.replaceAll("-", "/");
    rowEdit.insertCell(5).innerHTML = document.forms[1]["time"].value;
    rowEdit.insertCell(6).innerHTML = document.forms[1]["skills"].value;
    rowEdit.insertCell(7).innerHTML = document.forms[1]["duration"].value + "h";
    document.getElementById("tbody").rows[0].style.display = "none";
    cancelEdit();
}



