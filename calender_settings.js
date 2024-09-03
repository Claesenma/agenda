// Get params
const queryString = window.location.search;
console.log(queryString);

//window.ingelogd = false;

const urlParams = new URLSearchParams(queryString);
var wachtwoord = urlParams.get('wachtwoord')
var gebruikersnaam = urlParams.get('gebruikersnaam')
var agenda = urlParams.get('agenda')

if (gebruikersnaam == null) {
  window.location.replace("start.html");
}
if (wachtwoord == null) {
  wachtwoord = ''
}
if (agenda == null) {
  window.location.replace("home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord);
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

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=getAgendaSettings&agenda="+agenda+"&gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
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
    window.loading = false;
    window.data1= data["data"];

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
          window.agenda_color = "#267aed"
          window.edit = false;
          window.add_member = false;
          load_page3(gebruikersnaam, wachtwoord);
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

function load_page3(gebruikersnaam, wachtwoord) {
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

  document.getElementById("page-title").innerHTML = "Agenda - "+agenda+" - Instellingen"
  home_div.innerHTML = ''
  title_text = document.createElement("p");
  title_text.innerHTML = agenda
  title_text.id = "home-title"
  title_text.setAttribute("style", "text-decoration: underline;");
  home_div.appendChild(title_text)

  home_div.appendChild(document.createElement("br"));
  p2 = document.createElement("h2")
  p2.innerHTML = "Leden:"
  home_div.appendChild(p2);

  if (window.edit == false) {
    window.beheerder_lijst = [...window.data1[agenda]["beheerders"]]
    window.leden_lijst = []
    var leden_lijst2 = [...window.data1[agenda]["leden"]]
    for (var element in window.data1[agenda]["leden"]) {
      var lid = window.data1[agenda]["leden"][element];
      if (window.data1[agenda]["beheerders"].includes(lid)) {
        leden_lijst2.splice(Number(element-window.leden_lijst.length), 1)
        window.leden_lijst.push(lid)
      }
    }
    for (var element2 in leden_lijst2) {
      var lid = leden_lijst2[element2]
      window.leden_lijst.push(lid)
    }
    window.leden_lijst2 = [...window.leden_lijst]
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
    if (window.data1[agenda]["beheerders"].includes(gebruikersnaam) && window.beheerder_lijst.includes(lid)==false &&window.edit==true) {
      delete_btn = document.createElement("a");
      delete_btn.classList.add("delete-btn", "clearfix");
      delete_btn.innerHTML = "."
      delete_btn.setAttribute("style", "margin: 5px 20px;")
      delete_btn.value = element
      delete_btn.title = "Lid verwijderen"
      delete_btn.addEventListener('click', function () {
        if (window.loading == false) {
          window.leden_lijst.splice(this.value, 1)
          load_page3(gebruikersnaam, wachtwoord);}});
      div1.appendChild(delete_btn);

      make_admin_btn = document.createElement("a");
      make_admin_btn.classList.add("make-admin-btn", "clearfix");
      make_admin_btn.innerHTML = "+"
      make_admin_btn.setAttribute("style", "margin: 5px 20px;color:"+window.color)
      make_admin_btn.value = lid
      make_admin_btn.title = "Benoemen als beheerder"
      make_admin_btn.addEventListener('click', function () {
        if (window.loading == false) {
          window.beheerder_lijst.push(this.value)
          load_page3(gebruikersnaam, wachtwoord);}});
      div1.appendChild(make_admin_btn);
    }
    n++
  }

  if (window.edit == false) {
    var div2 = document.getElementById("btn-div");
    var div3= document.getElementById("btn2-div");
    div2.innerHTML = ''
    div3.innerHTML = ''
    div2.appendChild(document.createElement("br"));
    cancel_btn = document.createElement("a");
    cancel_btn.classList.add("edit-settings-btn");
    cancel_btn.innerHTML = "<< Terug"
    cancel_btn.href = "home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
    cancel_btn.setAttribute("style", "background-color: #f44336;")
    div2.appendChild(cancel_btn);

    edit_btn = document.createElement("a");
    edit_btn.classList.add("edit-settings-btn");
    edit_btn.innerHTML = "Instellingen aanpassen"
    if (!window.data1[agenda]["beheerders"].includes(gebruikersnaam)) {
      edit_btn.innerHTML = "Kleur wijzigen"
    }
    edit_btn.href = "#"
    div2.appendChild(edit_btn);
    edit_btn.addEventListener('click', function () {
      window.edit = true;
      load_page3(gebruikersnaam, wachtwoord);});
    if (window.leden_lijst2.length > 1) {
      leave_agenda_btn = document.createElement("a");
      leave_agenda_btn.classList.add("edit-settings-btn");
      leave_agenda_btn.innerHTML = "Lidmaatschap beëindigen"
      leave_agenda_btn.setAttribute("style", "background-color: #f44336;")
      leave_agenda_btn.href = "#"
      leave_agenda_btn.addEventListener('click', function () {
        create_modal2("agenda_verlaten", agenda+" beëindigen", "Weet je zeker dat je je lidmaatschap voor deze agenda wilt beëndigen?", "Beëindigen");});
      div3.appendChild(leave_agenda_btn);
    }
    if (window.beheerder_lijst.includes(gebruikersnaam)) {
      del_agenda_btn = document.createElement("a");
      del_agenda_btn.classList.add("edit-settings-btn");
      del_agenda_btn.innerHTML = "Agenda verwijderen"
      //del_agenda_btn.setAttribute("style", "background-color: #f44336;")
      del_agenda_btn.setAttribute("style", "background-color: #f44336; background-position: 95% 50%; background-repeat: no-repeat; background-image: url('images/bin.png'); background-size: auto 60%;")
      if (mobileCheck()) {
        del_agenda_btn.setAttribute("style", "background-color: #f44336;")
      }
      del_agenda_btn.href = "#"
      del_agenda_btn.addEventListener('click', function () {
        create_modal2("agenda_verwijderen", agenda+" verwijderen", "Weet je zeker dat je deze agenda wilt verwijderen?", "Verwijderen");});
      div3.appendChild(del_agenda_btn);
    }
    div3.appendChild(document.createElement("br"));
    div3.appendChild(document.createElement("br"));
    div3.appendChild(document.createElement("br"));

  }
  else {
    if (window.data1[agenda]["beheerders"].includes(gebruikersnaam)) {
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
            load_page3(gebruikersnaam, wachtwoord);}});
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

        add_btn1 = document.createElement("a")
        add_btn1.classList.add("accept_button")
        add_btn1.title = "lid toevoegen"
        add_btn1.innerHTML = "."
        new_member_div.appendChild(add_btn1)
        add_btn1.addEventListener('click', function () {
          if (text_input.value.includes("@")== false || text_input.value.includes(",")== true || text_input.value.includes(":")== true || text_input.value.includes(" ") == true || text_input.value.includes("&") == true || text_input.value.includes("=") == true || text_input.value.includes("%") == true) {
            error_message = "Het e-mailadres moet een @-teken bevatten en er mogen geen spaties, komma's, :-tekens, %-tekens, &-tekens of =-tekens in staan!";
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
              load_page3(gebruikersnaam, wachtwoord);
          }}});

        add_btn2 = document.createElement("a")
        add_btn2.classList.add("decline_button")
        add_btn2.title = "annuleren"
        add_btn2.innerHTML = "."
        new_member_div.appendChild(add_btn2)
        add_btn2.addEventListener('click', function () {
          window.add_member = false;
          load_page3(gebruikersnaam, wachtwoord);});
        home_div.appendChild(document.createElement("br"));

      }
    }
    var div2 = document.getElementById("btn-div");
    div2.innerHTML = ''
    div2.appendChild(document.createElement("br"));

    cancel_btn = document.createElement("a");
    cancel_btn.classList.add("edit-settings-btn");
    cancel_btn.innerHTML = "Annuleren"
    cancel_btn.href = "#"
    cancel_btn.setAttribute("style", "background-color: #f44336;")
    div2.appendChild(cancel_btn);

    cancel_btn.addEventListener('click', function () {
      if (window.loading == false) {
        window.edit = false;
        window.add_member = false;
        load_page3(gebruikersnaam, wachtwoord);}});

    save_btn = document.createElement("a");
    save_btn.classList.add("edit-settings-btn");
    save_btn.innerHTML = "Instellingen opslaan"
    save_btn.href = "#"
    div2.appendChild(save_btn);
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));

    save_btn.addEventListener('click', function () {
      if (window.loading == false && window.add_member == false) {
        var kleur = document.getElementById("kleur-input").value
        var leden = window.leden_lijst
        var beheerders = window.beheerder_lijst
        save_settings(leden, beheerders, kleur);}});
  }

  p3 = document.createElement("h2")
  p3.innerHTML = "Kleur:"
  p3.setAttribute("style", "display: inline-block")
  home_div.appendChild(p3);
  if (window.edit == false) {
    kleur_div = document.createElement("div")
    kleur_div.innerHTML = window.data1[agenda]["kleur"]
    kleur_div.setAttribute("style", "font-weight: bold; margin-left: 20px; padding: 15px ; border-radius: 15px; display: inline-block; background-color:"+window.data1[agenda]["kleur"])
    home_div.appendChild(kleur_div)
  }
  else {
    kleur_input = document.createElement("input")
    kleur_input.id = "kleur-input"
    kleur_input.type = "color"
    kleur_input.value = window.data1[agenda]["kleur"]
    kleur_input.setAttribute("style", "margin-left: 20px; padding: 0 0px ; border-radius: 5px; display: inline-block; width: 100px;")
    home_div.appendChild(kleur_input)
  }
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function agenda_verwijderen() {
  document.getElementById('modal').style.display='none'
  window.loading = true;
  var container = document.getElementById("btn-div")
  var loader = document.createElement("div")
  loader.classList.add("loader")
  loader.setAttribute("style", "display: block; margin: 30px 0; transform: translate(-50%, -50%);")
  loader.setAttribute("align", "center");
  container.appendChild(loader)
  loading2("wait")

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=deleteAgenda&gebruikersnaam="+gebruikersnaam+"&agenda="+agenda;//?action=agendaSignIn&gebruikersnaam="+gebruikersnaam//+"&wachtwoord="+wachtwoord;
  if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}
  console.log(url)
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
      window.edit = false;
      window.location.replace("home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord)
    }
  })
  .catch(error => console.log(error))
}

function agenda_verlaten() {
  var leden3 = [...window.leden_lijst2]
  leden3.splice(window.leden_lijst2.indexOf(gebruikersnaam),1)
  var beheerders3 = [...window.beheerder_lijst]
  if (beheerders3.includes(gebruikersnaam)) {
    beheerders3.splice(beheerders3.indexOf(gebruikersnaam),1)
  }
  document.getElementById('modal').style.display='none'
  save_settings(leden3, beheerders3, "geen");
}

function save_settings(leden, beheerders, kleur) {
  //console.log(leden, beheerders, kleur,window.data1[agenda]["kleur"])
  window.loading = true;
  var container = document.getElementById("btn-div")
  var loader = document.createElement("div")
  loader.classList.add("loader")
  loader.setAttribute("style", "display: block; margin: 30px 0; transform: translate(-50%, -50%);")
  loader.setAttribute("align", "center");
  container.appendChild(loader)
  loading2("wait")

  if (arrayEquals(beheerders, window.data1[agenda]["beheerders"]) && arrayEquals(leden, window.leden_lijst2)) {
    if  (kleur.toLowerCase() == window.data1[agenda]["kleur"].toLowerCase()) {
      window.edit = false;
      window.loading = false;
      container.removeChild(loader)
      loading2("default")
      load_page3(gebruikersnaam, wachtwoord);
    }
    else {
      var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=changeAgendaColor&gebruikersnaam="+gebruikersnaam+"&agenda="+agenda+"&kleur="+kleur.substr(1);
      if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}
      console.log(kleur, url)

      fetch(url)
      .then(response => {
      if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
        return response.json()
        document.write("error")
      })
      .then(data => {
        console.log(data["data"])
        window.data2 = data["data"];
        window.loading = false;
        loading2("default")
        container.removeChild(loader)
        if (window.data2.message != "oke") {
          alert(window.data.message)
        }
        else {
          window.edit = false;
          window.data1[agenda]["kleur"] = kleur
          load_page3(gebruikersnaam, wachtwoord);
        }
      })
      .catch(error => console.log(error))
    }
  }
  else {
    if (leden.length == 0) {
      alert("Je agenda heeft geen leden meer!")
    }
    else {
      leden2 = leden.join(",,")
      if (beheerders.length == 0) {
        beheerders.push(leden[0])
      }
      beheerders2 = beheerders.join(",,")

      var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?leden="+leden2+"&beheerders="+beheerders2+'&action=changeAgendaSettings&gebruikersnaam='+gebruikersnaam+'&agenda='+agenda+'&kleur='+ kleur.substr(1)+'&kleur2='+ window.agenda_color.substr(1);//?action=agendaSignIn&gebruikersnaam="+gebruikersnaam//+"&wachtwoord="+wachtwoord;
      if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}
      console.log(url)
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
        loading2("default");
        container.removeChild(loader)
        if (window.data.message != "oke") {
          alert(window.data.message)
        }
        else {
          window.edit = false;
          window.data1[agenda]["kleur"] = kleur
          window.data1[agenda]["leden"] = leden
          window.data1[agenda]["beheerders"] = beheerders
          load_page3(gebruikersnaam, wachtwoord);
          if (leden.includes(gebruikersnaam)) {
            load_page3(gebruikersnaam, wachtwoord);
          }
          else {window.location.replace("home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord)}
        }
      })
      .catch(error => console.log(error))
    }}
}

function create_modal2(action, titel, tekst, actie_tekst) {
  //console.log(action, titel, tekst, actie_tekst)
  var modal = document.getElementById('modal');
  modal.innerHTML = ""
  modal.style.display = "block"
  close_btn = document.createElement("span")
  close_btn.classList.add("close")
  close_btn.onclick="document.getElementById('modal').style.display='none'"
  close_btn.innerHTML = "×"
  close_btn.addEventListener('click', function() {if (window.loading == false) {document.getElementById('modal').style.display='none';}});
  modal.appendChild(close_btn)


  form = document.createElement("form")
  form.classList.add("modal-content")
  modal.appendChild(form)
  container_div = document.createElement("div")
  container_div.classList.add("container")
  container_div.id ="container"
  form.appendChild(container_div)
  title = document.createElement("h1")
  title.innerHTML = titel
  container_div.appendChild(title)
  text = document.createElement("p")
  text.innerHTML = tekst
  container_div.appendChild(text)
  container_div.appendChild(document.createElement("br"));


  clearfix_div = document.createElement("div")
  clearfix_div.classList.add("clearfix")
  container_div.appendChild(clearfix_div)

  cancel_btn = document.createElement("button")
  cancel_btn.classList.add("cancelbtn")
  cancel_btn.type = "button"
  cancel_btn.innerHTML = "Annuleren"
  clearfix_div.appendChild(cancel_btn)
  cancel_btn.addEventListener('click', function (e) {if (window.loading == false) {document.getElementById('modal').style.display='none'}});

  action_btn = document.createElement("button")
  action_btn.classList.add("deletebtn")
  action_btn.type = "button"
  action_btn.innerHTML = actie_tekst
  clearfix_div.appendChild(action_btn)
  action_btn.addEventListener('click', function (e) {
    eval(action + "()");});
}

function menu_hover1() {
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
  h = Math.trunc(Number(((window.innerWidth - 50)/ window.innerWidth)*90))
  //console.log(h)
  document.getElementById("home-div").setAttribute("style", "display: inline-block; margin-left: 50px;width: "+h+"%;");


}
function menu_hover2() {
  menu = document.getElementById("menu")
  menu.setAttribute("style", "width: 200px;")
  document.getElementById("account_button").innerHTML = "Mijn Account"
  document.getElementById("settings_button").innerHTML = "Instellingen"
  document.getElementById("log_out_button").innerHTML = "Afmelden"
  document.getElementById("title").innerHTML = "Agenda"
  h = Math.trunc(Number(((window.innerWidth - 200)/ window.innerWidth)*90))
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
