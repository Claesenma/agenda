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
  loading2("wait")

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=userSignIn2&gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
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
    window.user_data = data["data"]["user"];

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
          window.location.replace("start.html");
          //load_page2();
        }
        if (window.ingelogd == true) {
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
  //}
  // button links
  var btn1 = document.getElementById("account_button");
  btn1.href = "account.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var btn2 = document.getElementById("settings_button");
  btn2.href = "settings.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;

  var btn3 = document.getElementById("new-calender-btn");
  btn3.href = "new_calender.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var div = document.getElementById("home-div");

  var n = 1
  for (element in window.user_data["kalenders"]) {
    var kalender = window.user_data["kalenders"][element];
    div1 = document.createElement("div");
    div1.classList.add("kalender-div");
    div1.setAttribute("style", "border-color:"+kalender["kleur"]+" ;")
    p1 = document.createElement("p");
    p1.innerHTML = element
    p1.value = element

    bekijk_btn = document.createElement("a");
    bekijk_btn.classList.add("bekijk-btn");
    bekijk_btn.innerHTML = "Bekijk Agenda"
    bekijk_btn.href = "#"
    //bekijk_btn.id = "bekijk-btn"+n.toString()
    bekijk_btn.value = element;
    bekijk_btn.addEventListener('click', function() {
      document.getElementById('modal').style.display='block';
      create_modal([this.value]);
    }, false);

    setting_btn = document.createElement("a");
    setting_btn.classList.add("setting-btn");
    setting_btn.innerHTML = "."
    setting_btn.href = "calender_settings.html?agenda="+element+"&gebruikersnaam="+gebruikersnaam
    if (wachtwoord != '') {setting_btn.href+="&wachtwoord="+wachtwoord}
    setting_btn.title = element+" instellingen"

    div1.appendChild(p1);
    div1.appendChild(bekijk_btn);
    div1.appendChild(setting_btn);
    home_div.appendChild(div1);
    n++
  }


  if (Object.keys(window.user_data["kalenders"]).length == 0) {
    p1 = document.createElement("p");
    p1.innerHTML = "Je bent nog geen lid van een kalender"
    home_div.appendChild(p1);
  }

  if (Object.keys(window.user_data["kalenders"]).length > 1) {
    kalender_lijst = []
    for (element in window.user_data["kalenders"]) {
      kalender_lijst.push(element)
    }
    var div2 = document.getElementById("new-calender-div");
    bekijk_btn2 = document.createElement("a");
    bekijk_btn2.classList.add("bekijk-btn2");
    bekijk_btn2.innerHTML = "Bekijk al je agenda's tegelijk >>"
    if (mobileCheck()) {
      bekijk_btn2.innerHTML = "Bekijk al je agenda's tegelijk"
      bekijk_btn2.setAttribute("style", "font-size:1.2rem;")
    }
    bekijk_btn2.href = "#"
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
    div2.appendChild(bekijk_btn2);

    bekijk_btn2.addEventListener('click', function () {
      document.getElementById('modal').style.display='block';
      create_modal(kalender_lijst)});
  }
  resize()
}

function create_modal(agendas) {
  var modal = document.getElementById('modal');
  modal.innerHTML = ""
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
  container_div.appendChild(title)
  text = document.createElement("p")
  container_div.appendChild(text)

  if (agendas.length == 1) {
    text.innerHTML = "Om in te loggen in de "+agendas[0]+ ", moet je eerst het wachtwoord voor die agenda geven:"
    title.innerHTML = "Inloggen bij "+agendas[0]
  }
  else {
    text.innerHTML = "Om in te loggen in al je agenda's, moet je eerst voor elke agenda het wachtwoord geven:"
    title.innerHTML = "Inloggen bij al je agenda's"
  }

  for (element in agendas) {
    agenda = agendas[element]
    container_div.appendChild(document.createElement("br"));
    text2 = document.createElement("h4")
    container_div.appendChild(text2)

    if (agendas.length == 1) {text2.innerHTML = "Wachtwoord:"}
    else {text2.innerHTML = agenda+":"}

    input = document.createElement("input")
    input.type = "password"
    input.setAttribute("style", "width: 60%; display:inline-block;")
    input.placeholder = "Wachtwoord"
    input.id = "pass_input"+(Number(element)+1).toString()
    container_div.appendChild(input)

    eye = document.createElement("a")
    eye.classList.add("far", "fa-eye")
    eye.value = "pass_input"+(Number(element)+1).toString()
    container_div.appendChild(eye)
    eye.addEventListener('click', function (e) {
      //console.log(this.value)
      const type = document.getElementById(this.value).getAttribute('type') === 'password' ? 'text' : 'password';
      document.getElementById(this.value).setAttribute('type', type);
      this.classList.toggle('fa-eye-slash');
    });
    container_div.appendChild(document.createElement("br"));
    container_div.appendChild(document.createElement("br"));
  }

  clearfix_div = document.createElement("div")
  clearfix_div.classList.add("clearfix")
  container_div.appendChild(clearfix_div)

  cancel_btn = document.createElement("button")
  cancel_btn.classList.add("cancelbtn")
  cancel_btn.type = "button"
  cancel_btn.innerHTML = "Annuleren"
  clearfix_div.appendChild(cancel_btn)
  cancel_btn.addEventListener('click', function (e) {if (window.loading == false) {document.getElementById('modal').style.display='none'}});

  log_in_btn = document.createElement("button")
  log_in_btn.classList.add("loginbtn")
  log_in_btn.type = "button"
  log_in_btn.innerHTML = "Log in"
  clearfix_div.appendChild(log_in_btn)
  log_in_btn.addEventListener('click', function (e) {
    var wachtwoorden_dict = {}
    for (element in agendas) {
      agenda = agendas[element];
      var wachtwoord = document.getElementById("pass_input"+(Number(element)+1).toString()).value;
      //console.log(agenda,wachtwoord)
      wachtwoorden_dict[agenda] = wachtwoord
    }
    agenda_login(wachtwoorden_dict)
  });
}

function agenda_login(wachtwoorden_dict) {
  window.loading = true;
  //console.log(wachtwoorden_dict)

  var error = false;
  var error_message = "";
  for (element in wachtwoorden_dict) {
    var wachtwoord2 = wachtwoorden_dict[element]
    if (wachtwoord2 == "" || wachtwoord2 == undefined || wachtwoord2 == null) {
      error = true;
      error_message = "Je hebt geen wachtwoord ingegeven.";
    }
    if (wachtwoord2.includes(" ") == true || wachtwoord2.includes("&") == true || wachtwoord2.includes("=") == true || wachtwoord2.includes("%") == true || wachtwoord2.includes("+") == true || wachtwoord2.includes("-") == true || wachtwoord2.includes(",") == true) {
      error = true;
      error_message = "Er mogen geen spaties, komma's, +-tekens, --tekens, %-tekens, &-tekens of =-tekens in je wachtwoord staan!";
    }
  }

  if (error == true) {
    alert(error_message);
  }
  else {
    var container = document.getElementById("container")
    var loader = document.createElement("div")
    loader.classList.add("loader")
    loader.setAttribute("style", "margin-top: 30px; position: absolute; left: 48%; transform: translate(-50%, -50%);")
    loader.setAttribute("align", "center");
    container.appendChild(loader)
    loading2("wait")


    var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=agendaSignIn&gebruikersnaam="+gebruikersnaam//+"&wachtwoord="+wachtwoord;
    var aantal = (Object.keys(wachtwoorden_dict).length).toString()
    if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}

    param_text = ""
    var n = 1
    for (element in wachtwoorden_dict) {
      param_text += "&agenda"+ n+"="+element+"&agenda_pass"+n+"="+wachtwoorden_dict[element]
      n++
    }
    url += "&aantal="+aantal+param_text
    console.log(wachtwoorden_dict, param_text,url)

    fetch(url)
    .then(response => {
    if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
      return response.json()
      document.write("error")
    })
    .then(data => {
      //console.log(data["data"])
      window.data = data["data"];
      loading2("default")
      container.removeChild(loader)
      window.loading = false;
      if (window.data.message != "oke") {
        alert(window.data.message)
      }
      else {
        new_url = "show_calender.html?gebruikersnaam="+gebruikersnaam
        new_url += "&aantal="+aantal+param_text
        if (wachtwoord != '') {new_url+="&wachtwoord="+wachtwoord}
        //alert(new_url)
        window.location.replace(new_url);
      }
    })
    .catch(error => console.log(error))
  }
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
