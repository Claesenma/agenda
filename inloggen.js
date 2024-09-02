const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password_input');

  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

btn = document.getElementById("btn");
btn.addEventListener('click', function(){
  inloggen();
});

function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if (mobileCheck()) {
  span1 = document.getElementById("mail-span")
  span1.innerHTML = "(Het mailadres waarop je meldingen wilt ontvangen)"
  span2 = document.getElementById("password-span")
  span2.innerHTML = "(als je een wachtwoord hebt)"
}


function loading2(cursor) {
  var css = '* {cursor: '+cursor+';}'
  var style = document.createElement('style');
  if (style.styleSheet) {style.styleSheet.cssText = css;}
  else {style.appendChild(document.createTextNode(css));}
  document.getElementsByTagName('head')[0].appendChild(style);
}



function inloggen() {
  gebruikersnaam = document.getElementById("username_input").value;
  //console.log(gebruikersnaam);
  wachtwoord = document.getElementById("password_input").value;
  //console.log(wachtwoord);

  var error = false;
  var error_message = "";

  if (wachtwoord.includes(" ") == true || wachtwoord.includes("&") == true || wachtwoord.includes("=") == true || wachtwoord.includes("%") == true || wachtwoord.includes("+") == true || wachtwoord.includes("-") == true) {
    error = true;
    error_message = "Er mogen geen spaties, +-tekens, --tekens, %-tekens, &-tekens of =-tekens in je wachtwoord staan!";
  }

  if (gebruikersnaam == "" || gebruikersnaam == undefined || gebruikersnaam == null) {
    error = true;
    error_message = "Je hebt geen gebruikersnaam ingegeven.";
  }
  if (gebruikersnaam.includes(" ") == true || gebruikersnaam.includes("&") == true || gebruikersnaam.includes("=") == true || gebruikersnaam.includes("%") == true || gebruikersnaam.includes("+") == true || gebruikersnaam.includes("-") == true) {
    error = true;
    error_message = "Er mogen geen spaties, +-tekens, --tekens, %-tekens, &-tekens of =-tekens in je gebruikersnaam staan!";
  }

  if (error == true) {
    alert(error_message);
  }
  else {
    inloggen2(gebruikersnaam, wachtwoord);
  }
}

function inloggen2(gebruikersnaam, wachtwoord) {
  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=userSignIn&gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var juist = false;
  loading2("wait")

  fetch(url)
    .then(response => {
  if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
    return response.json()
    document.write("error")
  })
  .then(data => {
    console.log(data["data"]["message"])
    loading2("default")
    if (data["data"]["message"] == "oke") {
      window.location.replace("home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord);
    }
    else {
      alert("Foutief wachtwoord");
    }

  })
  .catch(error => console.log(error))
}
