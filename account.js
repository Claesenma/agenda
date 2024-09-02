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
    window.gegevens = data["data"]
    loading2("default")
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
          window.edit = false;
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
  title_text.innerHTML = "Mijn account"
  title_text.id = "home-title"
  home_div.appendChild(title_text)

  home_div.appendChild(document.createElement("br"));
  p1 = document.createElement("h2")
  p1.classList.add("email");
  p1.innerHTML = "E-mailadres:"
  home_div.appendChild(p1);
  p1 = document.createElement("span")
  p1.innerHTML = gebruikersnaam
  home_div.appendChild(p1);
  home_div.appendChild(document.createElement("br"));
  home_div.appendChild(document.createElement("br"));

  p2 = document.createElement("h2")
  p2.innerHTML = "Wachtwoord:"
  home_div.appendChild(p2);

  text_input1 = document.createElement("input")
  text_input1.id = "wachtwoord-input"
  text_input1.type = "text"
  text_input1.value = wachtwoord
  text_input1.disabled = !window.edit
  text_input1.placeholder = "Wachtwoord"
  text_input1.setAttribute("style", "margin: 10px 20px;padding: 5px 10px; border-radius: 12px; font-size: 1.3rem; background-color: "+window.background_color+";border-color:"+window.color+";")
  home_div.appendChild(text_input1)


  input1_text = document.createElement("p")
  input1_text.id ="input1-text"
  input1_text.setAttribute("style", "color:red;")
  home_div.appendChild(input1_text);
  text_input1.oninput = function() {
    if (text_input1.value == "" || text_input1.value.length > 5) {input1_text.innerHTML=""}
    else {input1_text.innerHTML="Dit is een zeer kort wachtwoord."}};

  var div2 = document.getElementById("btn-div");
  div2.innerHTML = ''
  div2.appendChild(document.createElement("br"));

  if (window.edit) {
    cancel_btn = document.createElement("a");
    cancel_btn.classList.add("edit-settings-btn");
    cancel_btn.innerHTML = "Annuleren"
    cancel_btn.setAttribute("style", "background-color: #f44336;")
    div2.appendChild(cancel_btn);
    cancel_btn.addEventListener('click', function () {
      if (window.loading == false) {
        window.edit = false;
        load_page3(gebruikersnaam, wachtwoord)}});

    div2.appendChild(document.createElement("br"));
    save_btn = document.createElement("a");
    save_btn.classList.add("edit-settings-btn");
    save_btn.innerHTML = "Opslaan"
    div2.appendChild(save_btn);
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));

    save_btn.addEventListener('click', function () {
      if (window.loading == false) {
        var nieuw_wachtwoord = document.getElementById("wachtwoord-input").value;
        if (nieuw_wachtwoord == wachtwoord) {
          window.edit = false;
          load_page3(gebruikersnaam, wachtwoord)
        }
        else {save_settings(nieuw_wachtwoord);}
      }});
  }
  else {
    terug_btn = document.createElement("a");
    terug_btn.classList.add("edit-settings-btn");
    terug_btn.innerHTML = "Terug"
    terug_btn.href = "home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
    terug_btn.setAttribute("style", "background-color: #f44336;")
    div2.appendChild(terug_btn);

    div2.appendChild(document.createElement("br"));
    save_btn = document.createElement("a");
    save_btn.classList.add("edit-settings-btn");
    save_btn.innerHTML = "Wachtwoord wijzigen"
    div2.appendChild(save_btn);
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));

    save_btn.addEventListener('click', function () {
      if (window.loading == false) {
        window.edit = true;
        load_page3(gebruikersnaam, wachtwoord);
      }});
  }
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function save_settings(nieuw_wachtwoord) {
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
  if (nieuw_wachtwoord.includes(" ") == true || nieuw_wachtwoord.includes("&") == true || nieuw_wachtwoord.includes("=") == true || nieuw_wachtwoord.includes("%") == true || nieuw_wachtwoord.includes("+") == true) {
    error = true;
    error_message = "Er mogen geen spaties, +-tekens, %-tekens, &-tekens of =-tekens in je wachtwoord staan!";
  }
  if (error == true) {
    container.removeChild(loader)
    window.loading = false;
    alert(error_message);
  }

  else {
    var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?&action=changeUserPassword&gebruikersnaam="+gebruikersnaam+"&nieuw_wachtwoord="+nieuw_wachtwoord;
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
      loading2("default")
      window.loading = false;
      container.removeChild(loader)
      if (window.data.message != "oke") {
        alert(window.data.message)
      }
      else {
        window.edit =  false;
        wachtwoord = nieuw_wachtwoord;
        load_page3(gebruikersnaam, nieuw_wachtwoord)
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
