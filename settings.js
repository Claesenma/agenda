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
  //document.body.style.cursor='wait'
  loading2("wait")
  loader.setAttribute("style", "position:absolute; left:"+w+"%");

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

    var css = '* {cursor: '+"auto"+';}'
    var style = document.createElement('style');
    if (style.styleSheet) {style.styleSheet.cssText = css;}
    else {style.appendChild(document.createTextNode(css));}
    document.getElementsByTagName('head')[0].appendChild(style);

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
  title_text.innerHTML = "Mijn Instellingen"
  title_text.id = "home-title"
  title_text.setAttribute("style", "text-decoration: underline;");
  home_div.appendChild(title_text)

  home_div.appendChild(document.createElement("br"));
  p2 = document.createElement("h2")
  p2.innerHTML = "Meldingen beheren:"
  home_div.appendChild(p2);

  //home_div.appendChild(document.createElement("br"));
  p3 = document.createElement("p")
  p3.innerHTML = "Meldingen (e-mails) ontvangen wanneer ... :"
  if (mobileCheck()) {p3.innerHTML = "Meldingen ontvangen wanneer ... :"};
  home_div.appendChild(p3);
  checkbox_lijst = [false, false, true]

  div1 = document.createElement("div");
  div1.classList.add("div");
  home_div.appendChild(div1);
  checkbox1 = document.createElement("input");
  checkbox1.type = "checkbox"
  checkbox1.id = "checkbox1"
  checkbox1.checked = checkbox_lijst[window.data1.user.mode.toString()[0]];
  checkbox1.disabled = !window.edit
  checkbox1.classList.add("checkbox");
  div1.appendChild(checkbox1);
  var text1 = document.createElement("span");
  text1.innerHTML = "...er iets gewijzigd is in één van je agenda's"
  div1.appendChild(text1);
  home_div.appendChild(document.createElement("br"));

  div2 = document.createElement("div");
  div2.classList.add("div");
  home_div.appendChild(div2);
  checkbox2 = document.createElement("input");
  checkbox2.type = "checkbox"
  checkbox2.id = "checkbox2"
  checkbox2.disabled = !window.edit
  checkbox2.checked = checkbox_lijst[window.data1.user.mode.toString()[1]];
  checkbox2.classList.add("checkbox");
  div2.appendChild(checkbox2);
  var text2 = document.createElement("span");
  text2.innerHTML = "...er de volgende dag een activiteit gepland staat"
  div2.appendChild(text2);
  home_div.appendChild(document.createElement("br"));

  div3 = document.createElement("div");
  div3.classList.add("div");
  home_div.appendChild(div3);
  checkbox3 = document.createElement("input");
  checkbox3.type = "checkbox"
  checkbox3.id = "checkbox3"
  checkbox3.disabled = !window.edit
  checkbox3.checked = checkbox_lijst[window.data1.user.mode.toString()[2]];
  checkbox3.classList.add("checkbox");
  div3.appendChild(checkbox3);
  var text3 = document.createElement("span");
  text3.innerHTML = "...er de diezelfde dag nog een activiteit gepland staat"
  div3.appendChild(text3);
  home_div.appendChild(document.createElement("br"));
  if (mobileCheck()) {
    div1.appendChild(document.createElement("br"));
    div1.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
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
    div2.appendChild(edit_btn);
    edit_btn.addEventListener('click', function () {
      window.edit = true;
      load_page3(gebruikersnaam, wachtwoord);});

    div3.appendChild(document.createElement("br"));
    div3.appendChild(document.createElement("br"));
    div3.appendChild(document.createElement("br"));

  }
  else {
    var div2 = document.getElementById("btn-div");
    div2.innerHTML = ''
    div2.appendChild(document.createElement("br"));

    cancel_btn = document.createElement("a");
    cancel_btn.classList.add("edit-settings-btn");
    cancel_btn.innerHTML = "Annuleren"
    cancel_btn.setAttribute("style", "background-color: #f44336;")
    div2.appendChild(cancel_btn);

    cancel_btn.addEventListener('click', function () {
      if (window.loading == false) {
        window.edit = false;
        load_page3(gebruikersnaam, wachtwoord);}});

    save_btn = document.createElement("a");
    save_btn.classList.add("edit-settings-btn");
    save_btn.innerHTML = "Instellingen opslaan"
    div2.appendChild(save_btn);
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));
    div2.appendChild(document.createElement("br"));

    save_btn.addEventListener('click', function () {
      if (window.loading == false) {
        var string = "111"
        if (document.getElementById("checkbox1").checked) {string = "211"}
        if (document.getElementById("checkbox2").checked) {string = string[0]+"21"}
        if (document.getElementById("checkbox3").checked) {string = string.substr(0,2)+"2"}

        if (string != window.data1.user.mode.toString()) {save_settings(string)}
        else {
          window.edit = false;
          load_page3(gebruikersnaam, wachtwoord)
        }
      }});
  }
}

function save_settings(new_string) {
  console.log(new_string)
  window.loading = true;
  var container = document.getElementById("btn-div")
  var loader = document.createElement("div")
  loader.classList.add("loader")
  loader.setAttribute("style", "display: block; margin: 30px 0; transform: translate(-50%, -50%);")
  loader.setAttribute("align", "center");
  container.appendChild(loader)

  var css = '* {cursor: wait;}'
  var style = document.createElement('style');
  if (style.styleSheet) {style.styleSheet.cssText = css;}
  else {style.appendChild(document.createTextNode(css));}
  document.getElementsByTagName('head')[0].appendChild(style);


  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=changeUserSettings&gebruikersnaam="+gebruikersnaam+"&new_mode="+new_string;
  if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}

  fetch(url)
  .then(response => {
  if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
    return response.json()
    document.write("error")
  })
  .then(data => {
    console.log(data["data"])
    window.data2 = data["data"];

    var css = '* {cursor: auto;}'
    var style = document.createElement('style');
    if (style.styleSheet) {style.styleSheet.cssText = css;}
    else {style.appendChild(document.createTextNode(css));}
    document.getElementsByTagName('head')[0].appendChild(style);

    window.loading = false;
    container.removeChild(loader)
    if (window.data2.message != "oke") {
      alert(window.data.message)
    }
    else {
      window.edit = false;
      window.data1.user.mode = new_string
      load_page3(gebruikersnaam, wachtwoord);
    }
  })
  .catch(error => console.log(error))
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
