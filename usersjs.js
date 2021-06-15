$(function() {
    hideUserInfo();
    hideCreditInfo();
    setParamFromURL();
});

function setParamFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const firstname = urlParams.get('firstname');
    const surname = urlParams.get('surname');
    const patronymic = urlParams.get('patronymic');
    const documentType = urlParams.get('documentType');
    const secureValue = urlParams.get('secureValue');
    const documentValue = urlParams.get('documentValue');
    const isStart = urlParams.get('start');
    if (firstname != null) {
        $('#name').val(firstname);
    }
    if (surname != null) {
        $('#surname').val(surname);
    }
    if (patronymic != null) {
        $('#patronymic').val(patronymic);
    }
    if (documentType === '1' || documentType === '2' || documentType === '3') {
        $("#documentType").val(documentType).change();
    }
    if (documentValue != null) {
        $('#document').val(documentValue);
    }
    if (secureValue != null) {
        $('#secureValue').val(secureValue);
    }
    if (isStart != null && isStart === '1') {
        getInfo();
    }
}

function getInfo() {
    hideUserInfo();
    hideCreditInfo();
    let user = {
        firstname: $('#name').val(),
        surname: $('#surname').val(),
        patronymic: $('#patronymic').val(),
        document: $('#document').val(),
        controlValue: $('#secureValue').val(),
    }
    if (user.firstname === '' || user.surname === '' || user.patronymic === '' || user.document === '' || user.controlValue === '') {
        sendError('Укажите все значения!');
        return;
    }
    let documentType = $("#documentType option:selected").val();
    let url = "http://178.63.41.216:8011/main?controlValue=" + user.controlValue +
        "&firstname=" + user.firstname + "&surname=" + user.surname +
        "&patronymic=" + user.patronymic;
    switch (documentType) {
        case '1': url+='&passportNumber='+user.document; break;
        case '2': url+='&taxID='+user.document; break;
        case '3': url+='&driverID='+user.document; break;
    }
    requestData(url);
}

function requestData(url) {
    jQuery.ajax({
        url: url,
        crossDomain: true,
        data: null,
        dataType: 'json',
        type: "GET",
        success: function(data){
            displayUserInfo(data.userAndRelatives.user);
            displayUserChild(data.userAndRelatives.children);
            displayUserParent(data.userAndRelatives.parents);
            displayUserSiblings(data.userAndRelatives.siblings);
            displayCreditInfo(data.credits);
        },
        error: function(data){
            sendError(data.responseJSON.message);
        }
    });
}

function displayUserInfo(data) {
    $('#uId').val(data.id);
    $('#uIdCredit').val(data.creditServiceId);
    $('#uName').val(data.firstname);
    $('#uSurname').val(data.surname);
    $('#uPatronymic').val(data.patronymic);
    $('#uPassport').val(data.passportNumber);
    $('#uINN').val(data.taxPayerID);
    $('#uDriverID').val(data.driverLicenceId);
    $('#uBirthDate').val(data.birthDate.day + '/' + data.birthDate.month + '/' + data.birthDate.year);
    $('#uSex').val(data.sex.name);
    showUserInfo();
}

function generateUserLink(firstname, surname, patronymic, passport, driverId, taxPayerID) {
    var documentType = 1;
    var documentValue = passport;
    if (passport != null || passport != '') {
        documentType = 1;
        documentValue = passport;
    } else if (taxPayerID != null || taxPayerID != '') {
        documentType = 2;
        documentValue = taxPayerID;
    } else if (driverId != null || driverId != '') {
        documentType = 3;
        documentValue = driverId;
    }
    var link = 'http://cma.hillmine.ru/?firstname=' + firstname + '&surname=' + surname + '&patronymic=' + patronymic + '&documentType=' + documentType + '&documentValue=' + documentValue + '&secureValue=' + $('#secureValue').val() + '&start=1';
    return link;
}

function displayUserChild(data) {
    var html = '';
    for (let child in data) {
        html+='<tr>';
        html+='<td><a href=' + generateUserLink(data[child].firstname, data[child].surname, data[child].patronymic, data[child].passportNumber, data[child].driverLicenceId, data[child].taxPayerID) + '>' + data[child].id + '</a></td>';
        html+='<td>' + data[child].creditServiceId + '</td>';
        html+='<td>' + data[child].firstname + '</td>';
        html+='<td>' + data[child].surname + '</td>';
        html+='<td>' + data[child].patronymic + '</td>';
        html+='<td>' + data[child].passportNumber + '</td>';
        html+='<td>' + data[child].taxPayerID + '</td>';
        html+='<td>' + data[child].driverLicenceId + '</td>';
        html+='<td>' + data[child].birthDate.day + '/' + data[child].birthDate.month + '/' + data[child].birthDate.year + '</td>';
        html+='<td>' + data[child].sex.name + '</td>';
        html+='</tr>';
    }
    $('#child').html(html);
}
function displayUserParent(data) {
    var html = '';
    for (let parent in data) {
        html+='<tr>';
        html+='<td><a href=' + generateUserLink(data[parent].firstname, data[parent].surname, data[parent].patronymic, data[parent].passportNumber, data[parent].driverLicenceId, data[parent].taxPayerID) + '>' + data[parent].id + '</a></td>';
        html+='<td>' + data[parent].creditServiceId + '</td>';
        html+='<td>' + data[parent].firstname + '</td>';
        html+='<td>' + data[parent].surname + '</td>';
        html+='<td>' + data[parent].patronymic + '</td>';
        html+='<td>' + data[parent].passportNumber + '</td>';
        html+='<td>' + data[parent].taxPayerID + '</td>';
        html+='<td>' + data[parent].driverLicenceId + '</td>';
        html+='<td>' + data[parent].birthDate.day + '/' + data[parent].birthDate.month + '/' + data[parent].birthDate.year + '</td>';
        html+='<td>' + data[parent].sex.name + '</td>';
        html+='</tr>';
    }
    $('#parent').html(html);
}
function displayUserSiblings(data) {
    var html = '';
    for (let child in data) {
        html+='<tr>';
        html+='<td><a href=' + generateUserLink(data[child].firstname, data[child].surname, data[child].patronymic, data[child].passportNumber, data[child].driverLicenceId, data[child].taxPayerID) + '>' + data[child].id + '</a></td>';
        html+='<td>' + data[child].creditServiceId + '</td>';
        html+='<td>' + data[child].firstname + '</td>';
        html+='<td>' + data[child].surname + '</td>';
        html+='<td>' + data[child].patronymic + '</td>';
        html+='<td>' + data[child].passportNumber + '</td>';
        html+='<td>' + data[child].taxPayerID + '</td>';
        html+='<td>' + data[child].driverLicenceId + '</td>';
        html+='<td>' + data[child].birthDate.day + '/' + data[child].birthDate.month + '/' + data[child].birthDate.year + '</td>';
        html+='<td>' + data[child].sex.name + '</td>';
        html+='</tr>';
    }
    $('#siblings').html(html);
}

function displayCreditInfo(data) {
    var html = '';
    for (let credit in data) {
        html+='<tr>';
        html+='<td>' + data[credit].credit.id + '</td>';
        html+='<td>' + data[credit].credit.totalSum + '</td>';
        html+='<td>' + data[credit].credit.branch.name + '</td>';
        html+='<td>' + data[credit].credit.startPaymentDate.day + '/' + data[credit].credit.startPaymentDate.month + '/' + data[credit].credit.startPaymentDate.year + '</td>';
        html+='<td>' + data[credit].credit.endPaymentDate.day + '/' + data[credit].credit.endPaymentDate.month + '/' + data[credit].credit.endPaymentDate.year + '</td>';

        html+='<td><table>';
        var payments = data[credit].payments;
        for (let payment in payments) {
            html+='<tr>'
            html+='<td>' + payments[payment].id + '<b>|</b></td>';
            html+='<td>' + payments[payment].sum + '<b>|</b></td>';
            html+='<td>' + payments[payment].date.day + '/' + payments[payment].date.month + '/' + payments[payment].date.year + '</td>';
            html+='</tr>'
        }
        html+='</table></td>';



        html+='</tr>';
    }
    $('#credits').html(html);
    showCreditInfo();
}

function sendError(text) {
    let html = '<div class="alert alert-danger alert-dismissible show fade">\n' +
        '                                        ' + text + '\n' +
        '                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n' +
        '                                    </div>'
    $('#error').html(html);
}

function hideCreditInfo() {
    $('#creditInfoDiv').hide();
}


function showCreditInfo() {
    $('#creditInfoDiv').show();
}

function hideUserInfo() {
    $('#userInfoDiv').hide();
}


function showUserInfo() {
    $('#userInfoDiv').show();
}
