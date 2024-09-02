// Get params
const queryString = window.location.search;
console.log(queryString);

//window.ingelogd = false;

const urlParams = new URLSearchParams(queryString);
var wachtwoord = urlParams.get('wachtwoord')
var gebruikersnaam = urlParams.get('gebruikersnaam')

if (gebruikersnaam == null) {
  window.location.replace("start.html");
}
if (wachtwoord == null) {
  wachtwoord = ''
}

if (gebruikersnaam != null && wachtwoord != null) {
  check_login(gebruikersnaam, wachtwoord);
  window.loading = true;
}

load_page(gebruikersnaam, wachtwoord);
menu_hover2()
menu_hover1()
window.onresize = resize;
window.background_color = "white"
window.color = "black"
resize()


// delay time
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function loading2(cursor) {
  var css = '* {cursor: '+cursor+';}'
  var style = document.createElement('style');
  if (style.styleSheet) {style.styleSheet.cssText = css;}
  else {style.appendChild(document.createTextNode(css));}
  document.getElementsByTagName('head')[0].appendChild(style);
}


// Get users
function check_login(gebruikersnaam, wachtwoord) {
  var home_div = document.getElementById("home-div1")
  var loader = document.createElement("div")
  loader.classList.add("loader")
  home_div.appendChild(loader)
  w = 100*(window.innerWidth-loader.clientWidth)/(2*window.innerWidth)
  loader.setAttribute("style", "position:absolute; left:"+w+"%");
  loading2("wait")

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=userSignIn3&gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  fetch(url)
  .then(response => {
  if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
    return response.json()
    document.write("error")
  })
  .then(data => {
    //console.log(data["data"])
    window.ingelogd = false;
    if (data["data"]["message"] == "oke") {
      window.ingelogd = true;
    }
    home_div.removeChild(loader);
    loading2("default")
    window.gegevens = data["data"]
    window.loading = false;

  })
  .catch(error => console.log(error))
}


async function load_page(gebruikersnaam, wachtwoord) {
  if (gebruikersnaam != null && wachtwoord != null) {
    var loading = true;
    while (loading==true) {
      await delay(1);
      if (window.loading==false) {
        if (window.ingelogd == false) {
          //console.log("error");
          window.location.replace("home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord);
          //load_page2();
        }
        if (window.ingelogd == true) {
          window.edit = true;
          window.agenda_color = "#267aed"
          window.add_member = false;
          window.leden_lijst = [gebruikersnaam];
          window.beheerder_lijst = [gebruikersnaam];
          window.add_member = false;
          load_page3(gebruikersnaam, wachtwoord, "", "");
        }
        loading = false;
      }
    }
  }

  else {
    window.ingelogd = false;
    //console.log("error");
    window.location.replace("start.html");
  }
}

function load_page3(gebruikersnaam, wachtwoord, value1, value2) {
  var body = document.getElementById("body");
  home_div = document.getElementById("home-div1");
  //if (window.users["data"][gebruikersnaam]["Licht"]==0) {
  //  body.style = "background-color: #262421; color: white;";
  //  window.background_color = "#262421"
  //  window.color = "white"
  //}
  // button links
  var btn1 = document.getElementById("account_button");
  btn1.href = "account.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var btn2 = document.getElementById("settings_button");
  btn2.href = "settings.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var btn3 = document.getElementById("title");
  btn3.href = "home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var div = document.getElementById("home-div");

  home_div.innerHTML = ''
  title_text = document.createElement("p");
  title_text.innerHTML = "Nieuwe kalender aanmaken"
  title_text.id = "home-title"
  home_div.appendChild(title_text)

  home_div.appendChild(document.createElement("br"));
  p1 = document.createElement("h2")
  p1.innerHTML = "Naam:"
  home_div.appendChild(p1);
  text_input1 = document.createElement("input")
  text_input1.id = "naam-input"
  text_input1.type = "text"
  text_input1.value = value1
  text_input1.placeholder = "Naam van je agenda"
  text_input1.setAttribute("style", "margin: 10px 20px;padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
  home_div.appendChild(text_input1)

  input1_text = document.createElement("p")
  input1_text.id ="input1-text"
  input1_text.setAttribute("style", "color:red;")
  home_div.appendChild(input1_text);
  text_input1.oninput = function() {
    if (window.gegevens.kalenders.includes(text_input1.value)== false && ["Gebruikers", "Agenda's"].includes(text_input1.value)==false) {input1_text.innerHTML=""}
    else {input1_text.innerHTML="Deze naam is al in gebruik."}};

  home_div.appendChild(document.createElement("br"));
  p1 = document.createElement("h2")
  p1.innerHTML = "Wachtwoord:"
  home_div.appendChild(p1);
  text_input2 = document.createElement("input")
  text_input2.id = "wachtwoord-input"
  text_input2.type = "text"
  text_input2.value = value2
  text_input2.placeholder = "Wachtwoord van je agenda"
  text_input2.setAttribute("style", "margin: 10px 20px;padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
  home_div.appendChild(text_input2)

  input2_text = document.createElement("p")
  input2_text.id ="input2-text"
  input2_text.setAttribute("style", "color:red;")
  home_div.appendChild(input2_text);
  text_input2.oninput = function() {
    if (text_input2.value == "" || text_input2.value.length > 5) {input2_text.innerHTML=""}
    else {input2_text.innerHTML="Dit is een zeer kort wachtwoord."}};

  home_div.appendChild(document.createElement("br"));
  p2 = document.createElement("h2")
  p2.innerHTML = "Leden:"
  home_div.appendChild(p2);

  if (mobileCheck()) {
    text_input1.setAttribute("style","width: 70%;margin: 10px 20px;padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
    text_input2.setAttribute("style","width: 70%;margin: 10px 20px;padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
  }

  var n = 1
  for (var element in window.leden_lijst) {
    var lid = window.leden_lijst[element];
    div1 = document.createElement("div");
    div1.classList.add("leden-div");
    div1.setAttribute("style", "background-color: "+window.background_color+";border-color:"+window.color+";")
    if (mobileCheck()) {
      div1.setAttribute("style", "font-size: 1.2rem; background-color: "+window.background_color+";border-color:"+window.color+";")
    }
    home_div.appendChild(div1);

    var p1 = document.createElement("p");
    p1.innerHTML = lid
    p1.value = lid
    div1.appendChild(p1);

    if (window.beheerder_lijst.includes(lid)) {
      beheerder_label = document.createElement("span")
      beheerder_label.innerHTML = "Beheerder"
      beheerder_label.setAttribute("style", "margin: 5px 20px;background-color: #43B534; padding: 5px 15px; border-radius: 10px;");
      div1.appendChild(beheerder_label)
    }
    if (lid != gebruikersnaam) {
      delete_btn = document.createElement("a");
      delete_btn.classList.add("delete-btn", "clearfix");
      delete_btn.innerHTML = "."
      delete_btn.setAttribute("style", "margin: 5px 20px;")
      delete_btn.value = element
      delete_btn.title = "Lid verwijderen"
      delete_btn.addEventListener('click', function () {
        if (window.loading == false) {
          if (window.beheerder_lijst.includes(window.leden_lijst[this.value])) {
            var index = window.beheerder_lijst.indexOf(window.leden_lijst[this.value])
            window.beheerder_lijst.splice(index, 1)
          }
          window.leden_lijst.splice(this.value, 1)
          var naam = document.getElementById("naam-input").value;
          var pass = document.getElementById("wachtwoord-input").value;
          load_page3(gebruikersnaam, wachtwoord, naam, pass);}});

      if (window.beheerder_lijst.includes(lid)) {
        del_admin_btn = document.createElement("a");
        del_admin_btn.classList.add("make-admin-btn", "clearfix");
        del_admin_btn.innerHTML = "-"
        del_admin_btn.setAttribute("style", "margin: 5px 20px;color:"+window.color)
        del_admin_btn.value = lid
        del_admin_btn.title = "Verwijderen als beheerder"
        del_admin_btn.addEventListener('click', function () {
          if (window.loading == false) {
            window.beheerder_lijst.splice(element, 1)
            var naam = document.getElementById("naam-input").value;
            var pass = document.getElementById("wachtwoord-input").value;
            load_page3(gebruikersnaam, wachtwoord, naam, pass);}});
        div1.appendChild(del_admin_btn);}

      if (window.beheerder_lijst.includes(lid)==false) {
        make_admin_btn = document.createElement("a");
        make_admin_btn.classList.add("make-admin-btn", "clearfix");
        make_admin_btn.innerHTML = "+"
        make_admin_btn.setAttribute("style", "margin: 5px 20px;color:"+window.color)
        make_admin_btn.value = lid
        make_admin_btn.title = "Benoemen als beheerder"
        make_admin_btn.addEventListener('click', function () {
          if (window.loading == false) {
            window.beheerder_lijst.push(this.value)
            var naam = document.getElementById("naam-input").value;
            var pass = document.getElementById("wachtwoord-input").value;
            load_page3(gebruikersnaam, wachtwoord, naam, pass);}});
        div1.appendChild(make_admin_btn);}

      div1.appendChild(delete_btn);
    }
    n++
  }
  if (window.add_member == false) {
    new_member_div = document.createElement("div")
    new_member_div.setAttribute("style", "text-align:center;")
    home_div.appendChild(new_member_div)

    new_member_btn = document.createElement("a")
    new_member_btn.id = "new-member-btn"
    new_member_btn.innerHTML = "+"
    new_member_btn.title = "Lid toevoegen"
    new_member_div.appendChild(new_member_btn)
    new_member_btn.addEventListener('click', function () {
      if (window.loading == false) {
        window.edit = true;
        window.add_member = true;
        var naam = document.getElementById("naam-input").value;
        var pass = document.getElementById("wachtwoord-input").value;
        load_page3(gebruikersnaam, wachtwoord, naam, pass);}});
    home_div.appendChild(document.createElement("br"));
  }
  else {
    new_member_div = document.createElement("div")
    new_member_div.setAttribute("style", "margin-left: 20px;")
    home_div.appendChild(new_member_div)

    text_input = document.createElement("input")
    text_input.id = "email-input"
    text_input.type = "email"
    text_input.placeholder = "e-mailadres"
    text_input.setAttribute("style", "padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
    new_member_div.appendChild(text_input)
    if (mobileCheck()) {
      text_input.setAttribute("style","width: 80%;padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
    }

    add_btn1 = document.createElement("a")
    add_btn1.classList.add("accept_button")
    add_btn1.title = "lid toevoegen"
    add_btn1.innerHTML = "."
    new_member_div.appendChild(add_btn1)
    add_btn1.addEventListener('click', function () {
      if (text_input.value.includes("@")== false || text_input.value.includes(",")== true || text_input.value.includes(":")== true || text_input.value.includes(" ") == true || text_input.value.includes("&") == true || text_input.value.includes("=") == true || text_input.value.includes("%") == true || text_input.value.includes("+") == true || text_input.value.includes("-") == true) {
        error_message = "Het e-mailadres moet een @-teken bevatten en er mogen geen spaties, komma's, +-tekens, :-tekens, --tekens, %-tekens, &-tekens of =-tekens in staan!";
        alert(error_message)
      }
      else {
        if (window.leden_lijst.includes(text_input.value)) {
          error_message = "Dit e-mailadres is al lid van deze agenda";
          alert(error_message)
        }
        else {
          window.leden_lijst.push(text_input.value)
          window.add_member = false;
          var naam = document.getElementById("naam-input").value;
          var pass = document.getElementById("wachtwoord-input").value;
          load_page3(gebruikersnaam, wachtwoord, naam, pass);
      }}});

    add_btn2 = document.createElement("a")
    add_btn2.classList.add("decline_button")
    add_btn2.title = "annuleren"
    add_btn2.innerHTML = "."
    new_member_div.appendChild(add_btn2)
    add_btn2.addEventListener('click', function () {
      window.add_member = false;
      var naam = document.getElementById("naam-input").value;
      var pass = document.getElementById("wachtwoord-input").value;
      load_page3(gebruikersnaam, wachtwoord, naam, pass);});
    home_div.appendChild(document.createElement("br"));
  }

  var div2 = document.getElementById("btn-div");
  div2.innerHTML = ''
  div2.appendChild(document.createElement("br"));

  cancel_btn = document.createElement("a");
  cancel_btn.classList.add("edit-settings-btn");
  cancel_btn.innerHTML = "Annuleren"
  cancel_btn.href = "home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  cancel_btn.setAttribute("style", "background-color: #f44336;")
  div2.appendChild(cancel_btn);

  div2.appendChild(document.createElement("br"));
  save_btn = document.createElement("a");
  save_btn.classList.add("edit-settings-btn");
  save_btn.innerHTML = "Agenda aanmaken"
  save_btn.href = "#"
  div2.appendChild(save_btn);
  div2.appendChild(document.createElement("br"));
  div2.appendChild(document.createElement("br"));
  div2.appendChild(document.createElement("br"));

  save_btn.addEventListener('click', function () {
    if (window.loading == false && window.add_member == false) {
      var naam = document.getElementById("naam-input").value;
      var pass = document.getElementById("wachtwoord-input").value;
      var kleur = document.getElementById("kleur-input").value;
      var leden = window.leden_lijst;
      var beheerders = window.beheerder_lijst;
      save_agenda(gebruikersnaam, wachtwoord, naam, pass, leden, beheerders, kleur);}});

  p3 = document.createElement("h2")
  p3.innerHTML = "Kleur:"
  p3.setAttribute("style", "display: inline-block")
  home_div.appendChild(p3);

  kleur_input = document.createElement("input")
  kleur_input.id = "kleur-input"
  kleur_input.type = "color"
  kleur_input.value = window.agenda_color
  kleur_input.setAttribute("style", "margin-left: 20px; padding: 0 0px ; border-radius: 5px; display: inline-block; width: 100px;")
  home_div.appendChild(kleur_input)
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function save_agenda(gebruikersnaam, wachtwoord, naam, password,leden, beheerders, kleur) {
  //console.log(leden, beheerders, kleur)
  window.loading = true;
  var container = document.getElementById("btn-div")
  var loader = document.createElement("div")
  loader.classList.add("loader")
  loader.setAttribute("style", "display: block; margin: 30px 0; transform: translate(-50%, -50%);")
  loader.setAttribute("align", "center");
  container.appendChild(loader)
  loading2("wait")


  var error = false;
  var error_message = "";

  if (naam == "" || naam == undefined || naam == null) {
    error = true;
    error_message = "Je hebt geen naam voor deze agenda opgegeven.";
  }
  if (naam.includes(" ") == true || naam.includes(":") == true || naam.includes("&") == true || naam.includes("=") == true || naam.includes("%") == true || naam.includes("+") == true || naam.includes(",") == true) {
    error = true;
    error_message = "Er mogen geen spaties, komma's, +-tekens, :-tekens, %-tekens, &-tekens of =-tekens in de naam van de agenda staan!";
  }
  if (password == "" || password == undefined || password == null) {
    error = true;
    error_message = "Je hebt geen wachtwoord voor deze agenda opgegeven.";
  }
  if (password.includes(" ") == true || password.includes(":") == true || password.includes("&") == true || password.includes("=") == true || password.includes("%") == true || password.includes("+") == true || password.includes("-") == true || password.includes(",") == true) {
    error = true;
    error_message = "Er mogen geen spaties, komma's, +-tekens, :-tekens, min-tekens, %-tekens, &-tekens of =-tekens in het wachtwoord van de agenda staan!";
  }
  if (window.gegevens.kalenders.includes(naam) || ["Gebruikers", "Agenda's"].includes(naam)) {
    error = true;
    error_message = "De naam van deze agenda is al in gebruik voor een andere agenda.";
  }

  if (error == true) {
    container.removeChild(loader)
    window.loading = false;
    alert(error_message);
  }
  else {
    leden2 = leden.join(",,")
    beheerders2 = beheerders.join(",,")
    var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?leden="+leden2+"&beheerders="+beheerders2+'&action=createAgenda&gebruikersnaam='+gebruikersnaam+'&agenda='+naam+'&kleur='+ kleur.substr(1)+'&kleur2='+ window.agenda_color.substr(1)+'&agenda_pass='+ password;
    if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}

    fetch(url)
    .then(response => {
    if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
      return response.json()
      document.write("error")
    })
    .then(data => {
      //console.log(data["data"])
      window.data = data["data"];
      window.loading = false;
      container.removeChild(loader)
      loading2("default")
      if (window.data.message != "oke") {
        alert(window.data.message)
      }
      else {
        window.location.replace("calender_settings.html?agenda="+naam+"&gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord)
      }
    })
    .catch(error => console.log(error))
  }
}

function menu_hover1() {
  var x =90
  // if (mobileCheck()) {
  //  x = 55
  // }
  menu = document.getElementById("menu")
  menu.setAttribute("style", "width: 50px;")
  document.getElementById("account_button").innerHTML = ""
  document.getElementById("settings_button").innerHTML = ""
  document.getElementById("log_out_button").innerHTML = ""
  document.getElementById("title").innerHTML = ""
  if (mobileCheck()) {
    a=document.getElementById("close_btn");
    menu.removeChild(a);
  }

  document.getElementById("title").setAttribute("style", "height: 30px; background-position: 50% 50%; padding-left: 0px;");
  document.getElementById("account_button").setAttribute("style", "height: 20px; background-position: 50% 50%; padding-left: 0px;");
  document.getElementById("settings_button").setAttribute("style", "height: 20px; background-position: 50% 50%; padding-left: 0px;");
  document.getElementById("log_out_button").setAttribute("style", "height: 20px; background-position: 50% 50%; padding-left: 0px;");
  document.getElementById("home-div").setAttribute("style", "margin-left: 50px;");
  h = Math.trunc(Number(((window.innerWidth - 50)/ window.innerWidth)*x))
  //console.log(h)
  document.getElementById("home-div").setAttribute("style", "display: inline-block; margin-left: 50px;width: "+h+"%;");


}
function menu_hover2() {
  var x =90
  // if (mobileCheck()) {
  //  x = 55
  // }
  menu = document.getElementById("menu")
  menu.setAttribute("style", "width: 200px;")
  document.getElementById("account_button").innerHTML = "Mijn Account"
  document.getElementById("settings_button").innerHTML = "Instellingen"
  document.getElementById("log_out_button").innerHTML = "Afmelden"
  document.getElementById("title").innerHTML = "Agenda"
  h = Math.trunc(Number(((window.innerWidth - 200)/ window.innerWidth)*x))
  //console.log(h)
  document.getElementById("home-div").setAttribute("style", "display: inline-block; margin-left: 200px;width: "+h+"%;");

  if (mobileCheck()) {
    a = document.createElement("a")
    a.id = "close_btn"
    a.addEventListener("click", function() {menu_hover1()});
    a.setAttribute("style", "position: absolute; right: 0%; top: 5px; background-repeat: no-repeat; background-size: 50%; display: inline-block; width: 30px; height: 30px;background-image: url('images/close.png');")
    menu.appendChild(a)
  }

  document.getElementById("title").setAttribute("style", "height: 30px; background-position: 5% 50%; padding-left: 22.5%;");
  document.getElementById("account_button").setAttribute("style", "height: auto; background-position: 5% 50%; padding-left: 22.5%;");
  document.getElementById("settings_button").setAttribute("style", "height: auto; background-position: 5% 50%; padding-left: 22.5%;");
  document.getElementById("log_out_button").setAttribute("style", "height: auto; background-position: 5% 50%; padding-left: 22.5%;");
}
function resize() {
  h = window.innerHeight
  h2 = document.getElementById("home-div").scrollHeight;//.offsetHeight;//.clientHeight;
  //console.log(h,h2)
  if (h2 < h) {
    document.getElementById("bottom-div").setAttribute("style", "position: fixed;");
  }
  else {
    document.getElementById("bottom-div").setAttribute("style","position: relative;");
  }
  if (window.innerWidth < 350) {
    document.getElementById("bottom-title").setAttribute("style", "font-size: 0.9rem;")
  }
  if (window.innerWidth > 350) {
    document.getElementById("bottom-title").setAttribute("style", "font-size: 1rem;")
  }
}

function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
