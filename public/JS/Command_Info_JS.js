if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
console.log("Hello COMMAND  info js")
function ready() {
    var valider_command_btn = document.getElementById("Valider-Btn");

    valider_command_btn.addEventListener('click', valider)


    function valider() {
        var UserName = document.getElementById('UserName').value;
        var Email = document.getElementById('Email').value;
        var Phone = document.getElementById('Phone').value;
        var Adresse = document.getElementById('Adresse').value;

        if (UserName != "" && Phone != "" && Adresse != "") {
            const email_validator = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (email_validator.test(Email)  || Email=="") {
                var latitude;
                var longitude;

                navigator.geolocation.getCurrentPosition(function showLocation(position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    continueExc();
                }, continueExc());
                function continueExc() {
                    var Pos = { lat: latitude, lng: longitude }

                    var JSONCommand = { UserName: UserName, Email: Email, Phone: Phone, Location: Pos, Adresse: Adresse }
                    var xhttp = new XMLHttpRequest()
                    xhttp.open('POST', '/Commander', true);
                    console.log(JSONCommand)
                    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
                    xhttp.send(JSON.stringify(JSONCommand))
                    window.location.reload();
                }
            }
            else {
                alert('Wrong Email Format !')
            }
        } else {
            alert("must enter all the informations !")
        }
    }
}
