/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Define your database connection and credentials here
var baseUrl = "http://api.login2explore.com:5577";
var irl = "/api/irl";
var iml = "/api/iml";
var studentDBName = "Student-DB";
var studentRelationName = "StudentData";
var token = "YOUR_TOKEN";

// Function to enable/disable form fields
function setFormState(enable, fields) {
    fields.forEach(field => {
        document.getElementById(field).disabled = !enable;
    });
}

// Function to reset the form
function resetForm() {
    document.getElementById("studentform").reset();
    setFormState(false, ['name', 'class', 'birthdate', 'address', 'enroldate', 'save', 'update']);
    document.getElementById('reset').disabled = true;
    document.getElementById('rollno').disabled = false;
}

// Function to handle the Roll-No change event
function getRollno() {
    const rollNo = document.getElementById('rollno').value;
    if (rollNo) {
        // Check if roll number exists in the database
        const getRequest = createGET_BY_KEYRequest(token, studentDBName, studentRelationName, JSON.stringify({ rollno: rollNo }));
        jQuery.ajaxSetup({ async: false });
        const response = executeCommandAtGivenBaseUrl(getRequest, baseUrl + irl);
        jQuery.ajaxSetup({ async: true });

        if (response.status === 200) {
            // Roll number exists, populate form with data and enable Update and Reset buttons
            const record = JSON.parse(response.data).record;
            document.getElementById('name').value = record.name;
            document.getElementById('class').value = record.class;
            document.getElementById('birthdate').value = record.birthdate;
            document.getElementById('address').value = record.address;
            document.getElementById('enroldate').value = record.enroldate;
            setFormState(true, ['name', 'class', 'birthdate', 'address', 'enroldate', 'update', 'reset']);
            document.getElementById('save').disabled = true;
            document.getElementById('rollno').disabled = true;
        } else {
            // Roll number does not exist, enable Save and Reset buttons and rest of the form fields
            setFormState(true, ['name', 'class', 'birthdate', 'address', 'enroldate', 'save', 'reset']);
            document.getElementById('update').disabled = true;
        }
    }
}

// Function to save data to the database
function saveData() {
    const record = {
        rollno: document.getElementById('rollno').value,
        name: document.getElementById('name').value,
        class: document.getElementById('class').value,
        birthdate: document.getElementById('birthdate').value,
        address: document.getElementById('address').value,
        enroldate: document.getElementById('enroldate').value
    };

    const putRequest = createPUTRequest(token, JSON.stringify(record), studentDBName, studentRelationName);
    jQuery.ajaxSetup({ async: false });
    const response = executeCommandAtGivenBaseUrl(putRequest, baseUrl + iml);
    jQuery.ajaxSetup({ async: true });

    if (response.status === 200) {
        alert("Data saved successfully!");
        resetForm();
    } else {
        alert("Error saving data: " + response.message);
    }
}

// Function to update data in the database
function updateData() {
    const record = {
        rollno: document.getElementById('rollno').value,
        name: document.getElementById('name').value,
        class: document.getElementById('class').value,
        birthdate: document.getElementById('birthdate').value,
        address: document.getElementById('address').value,
        enroldate: document.getElementById('enroldate').value
    };

    const updateRequest = createUPDATERecordRequest(token, JSON.stringify(record), studentDBName, studentRelationName);
    jQuery.ajaxSetup({ async: false });
    const response = executeCommandAtGivenBaseUrl(updateRequest, baseUrl + iml);
    jQuery.ajaxSetup({ async: true });

    if (response.status === 200) {
        alert("Data updated successfully!");
        resetForm();
    } else {
        alert("Error updating data: " + response.message);
    }
}

// Initialize the form on page load
window.onload = function () {
    resetForm();
};




