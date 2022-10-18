let goal;

function onClickAddCourse() {
    let obj = document.forms[0].elements;
    for (let i = 0; i < obj.length - 1; i++) {
        if (obj[i].type === "text")
            obj[i].value = "";
        else if (obj[i].type === "radio")
            obj[i].checked = false;
    }
    Show();
}

function Show() {
    document.getElementById('shadow').classList.remove('hide');
    document.getElementById('window').classList.remove('hide');
}

function Hide() {
    document.getElementById('shadow').classList.add('hide');
    document.getElementById('window').classList.add('hide');
}

let goal;
\\





function onClickEdit(obj) {
    Show1();
    goal = obj.parentNode.parentNode
}

function Show1() {
    document.getElementById('shadow1').classList.remove('hide');
    document.getElementById('window1').classList.remove('hide');
}

function Hide1() {
    document.getElementById('shadow1').classList.add('hide');
    document.getElementById('window1').classList.add('hide');
}

function onClickSubmit1() {
    let Date = document.getElementById("edit").querySelector('form input[name="Date"]').value;
    window.alert("Edit Success!");
    editRow(Date);
    Hide1();
}

function onClickSubmit() {
    let CourseName = document.querySelector('form input[name="Course Name"]').value;
    let CourseCode = document.querySelector('form input[name="Course Code"]').value;
    let Language = document.querySelector('form input[name="Language"]').value;
    let Teacher = document.querySelector('form input[name="Teacher"]').value;
    let Date = document.querySelector('form input[name="Date"]').value;
    let Time = document.querySelector('form input[name="Time"]').value;
    let Location = document.querySelector('form select[name="Location"]').value;
    let Duration = document.querySelector('form input[name="Duration"]').value;

    if (validateInput(CourseName, CourseCode, Teacher, Date, Time, Duration, Language, Location)) {
        window.alert("Success!");
        addRow(Date);
        Hide();
    }
}

function validateInput(CourseName, CourseCode, Teacher, Date, Time, Duration, Language, Location) {
    let date = nowTime();
    let nameRegex = new RegExp(/^[A-z]+$/);
    let codeRegex = new RegExp(/([A-Z]+[0-9]+)|([0-9]+[A-Z]+)/);
    let teacherRegex = new RegExp(/^[A-z]+$/);
    let durationRegex = new RegExp(/^[0-9]+/);
    let form = document.getElementById('tbody');

    if (!nameRegex.test(CourseName) || CourseName === "") {
        alert("Invalid Course Name.");
        return false;
    }
    if (!codeRegex.test(CourseCode) || CourseCode === "") {
        alert("Invalid Course Code.");
        return false;
    }
    if (Language.checked === false) {
        alert("Invalid Language.");
        return false;
    }
    if (!teacherRegex.test(Teacher) || Teacher === "") {
        alert("Invalid Teacher.");
        return false;
    }
    if (Date < date || Date === "") {
        alert("Invalid Date.");
        return false;
    }
    if (Time === "") {
        alert("Invalid Time.");
        return false;
    }
    if (!durationRegex.test(Duration) || Duration === "") {
        alert("Invalid Duration.");
        return false;
    }

    let temp;
    for (let i = 1; i < form.rows.length; i++) {
        temp = Date.toString().replaceAll("-", "/")
        if (CourseName === form.rows[i].cells[0].innerHTML && temp === form.rows[i].cells[4].innerHTML) {
            alert("Invalid Same Course")
            return false;
        }
        if (CourseCode === form.rows[i].cells[1].innerHTML) {
            alert("Invalid Same Code");
            return false;
        }
        if (Teacher === form.rows[i].cells[3].innerHTML && temp === form.rows[i].cells[4].innerHTML) {
            alert("Invalid Same Teacher");
            return false;
        }
        if (Time === form.rows[i].cells[5].innerHTML && temp === form.rows[i].cells[4].innerHTML && Location === form.rows[i].cells[6].innerHTML) {
            alert("Invalid Conflict Time")
            return false
        }
    }
    return true
}

function editRow(Date) {
    let new_Date = Date.replaceAll("-", "/");
    goal.cells[0].innerHTML = document.getElementById("edit")["Course Name"].value;
    goal.cells[1].innerHTML = document.getElementById("edit")["Course Code"].value;
    goal.cells[2].innerHTML = document.getElementById("edit")["Language"].value;
    goal.cells[3].innerHTML = document.getElementById("edit")["Teacher"].value;
    goal.cells[4].innerHTML = new_Date;
    goal.cells[5].innerHTML = document.getElementById("edit")["Time"].value;
    goal.cells[6].innerHTML = document.getElementById("edit")["Location"].value;
    goal.cells[7].innerHTML = document.getElementById("edit")["Duration"].value + "h";
    document.getElementById("tbody").rows[0].style.display = "none";
}

function addRow(Date) {
    let bodyObj = document.getElementById("tbody");
    if (!bodyObj) {
        alert("Body of Table not Exist!");
        return;
    }

    let rowCount = bodyObj.rows.length;
    let cellCount = bodyObj.rows[0].cells.length;
    bodyObj.style.display = "";
    let newRow = bodyObj.insertRow(rowCount++);
    let new_Date = Date.replaceAll("-", "/");

    newRow.insertCell(0).innerHTML = document.forms[0]["Course Name"].value;
    newRow.insertCell(1).innerHTML = document.forms[0]["Course Code"].value;
    newRow.insertCell(2).innerHTML = document.forms[0]["Language"].value;
    newRow.insertCell(3).innerHTML = document.forms[0]["Teacher"].value;
    newRow.insertCell(4).innerHTML = new_Date;
    newRow.insertCell(5).innerHTML = document.forms[0]["Time"].value;
    newRow.insertCell(8).innerHTML = bodyObj.rows[0].cells[cellCount - 1].innerHTML;
    newRow.insertCell(6).innerHTML = document.forms[0]["Location"].value;
    newRow.insertCell(7).innerHTML = document.forms[0]["Duration"].value + "h";
//    newRow.insertCell(8).innerHTML = bodyObj.rows[0].cells[cellCount - 1].innerHTML;
    bodyObj.rows[0].style.display = "none";
}

function removeRow(input) {
    if (!input) return;
    let parentTD = input.parentNode;
    let parentTR = parentTD.parentNode;
    let parentTBODY = parentTR.parentNode;
    parentTBODY.removeChild(parentTR);
}

function nowTime() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
}

