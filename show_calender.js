// Get params
var queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
var wachtwoord = urlParams.get('wachtwoord')
var gebruikersnaam = urlParams.get('gebruikersnaam')
var aantal = urlParams.get('aantal')

var agenda_lijst = {};
for (n=0;n<aantal;n++) {
  k = Number(n)+1
  var agenda = urlParams.get('agenda'+k)
  var agenda_pass = urlParams.get('agenda_pass'+k)
  if (agenda == null || agenda_pass == null || agenda == "" || agenda_pass == "") {
    window.location.replace("home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord)
  }
  else {agenda_lijst[agenda] = agenda_pass}
}

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
const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
const weekdays = ["Ma", "Di", "Wo", "Do","Vr", "Za", "Zo"]
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

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=agendaSignIn2&"+queryString.substr(1);
  //alert(url)

  fetch(url)
  .then(response => {
  if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
    return response.json()
    document.write("error")
  })
  .then(data => {
    console.log(data["data"])
    window.ingelogd = false;
    if (data["data"]["message"] == "oke") {
      window.ingelogd = true;
    }
    home_div.removeChild(loader);
    loading2("default")
    window.data1 = data["data"]
    //console.log(window.gegevens)
    window.agenda_lijst2 = [...Object.keys(window.data1["kalenders"])]
    window.loading = false;

  })
  .catch(error => console.log(error))
}

function structure_data(data, agenda_lijst2) {
  if (Object.keys(data).length == 1) {
    if (agenda_lijst2.includes(Object.keys(data)[0])) {
      return data[Object.keys(data)[0]]
    }
    return {}
  }
  else {
    var kalender = {}//data[Object.keys(data)[0]]
    for (var n = 0; n<Number(Object.keys(data).length);n++) {
      if (agenda_lijst2.includes(Object.keys(data)[n])) {
        element = data[Object.keys(data)[n]]
        for (datum in element) {
          if (datum != "kleur") {
            if (Object.keys(kalender).includes(datum)) {
              for (activity in element[datum]["activiteiten"]) {
                kalender[datum]["activiteiten"].push(element[datum]["activiteiten"][activity])
              }
            }
            else {
              kalender[datum] = {"activiteiten":[...element[datum]["activiteiten"]]}
            }
          }
        }
      }
    }
    return kalender
  }
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
            show1();
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

async function display_calendar(year, scroll) {
  if (scroll == false) {
    await delay(400);
  }
  window.gegevens = structure_data(window.data1["kalenders"],window.agenda_lijst2);
  console.log(year)
  var body = document.getElementById("body");
  home_div = document.getElementById("home-div1");

  var x = 10
  if (mobileCheck()) {
    x = 9
  }
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
  title_text.innerHTML = "Bekijk je agenda's"
  title_text.id = "home-title"
  home_div.appendChild(title_text)
  document.getElementById("page-title").innerHTML = "Agenda - Bekijk je agenda's"
  if (aantal == 1) {
    document.getElementById("page-title").innerHTML = "Agenda - "+Object.keys(agenda_lijst)[0]
    title_text.innerHTML = Object.keys(agenda_lijst)[0]
  }

  var year_input = document.createElement("input");
  year_input.setAttribute("type", "number");
  year_input.id = "jaar_input";
  year_input.value = year;
  year_input.placeholder = "Type een jaar...";
  home_div.appendChild(year_input);

  var year_btn = document.createElement("a");
  year_btn.setAttribute("id", "btn2");
  year_btn.classList.toggle("btn2");
  year_btn.setAttribute("style", "width: "+x+"%;")
  year_btn.addEventListener('click', function() {
      search_year(year_input.value);
  }, false);
  home_div.appendChild(year_btn);
  home_div.appendChild(document.createElement("br"));
  home_div.appendChild(document.createElement("br"));

  if (aantal > 1) {
    for (var k=1;k<(Number(aantal)+1);k++) {
      var div = document.createElement('div');
      div.classList.toggle('label-div');
      div.setAttribute("style", "background-color:"+window.data1.kalenders[Object.keys(window.data1.kalenders)[k-1]].kleur);
      home_div.appendChild(div);
      text = document.createElement("p")
      text.innerHTML = Object.keys(window.data1.kalenders)[k-1]
      div.appendChild(text);

      switch1 = document.createElement("label")
      switch1.classList.add("switch")
      div.appendChild(switch1)

      switch2 = document.createElement("input")
      switch2.type = "checkbox"
      switch2.classList.add()
      switch2.checked = window.agenda_lijst2.includes(Object.keys(window.data1.kalenders)[k-1])
      switch1.appendChild(switch2)

      switch3 = document.createElement("span")
      switch3.classList.add("slider", "round")
      switch3.id = "switch"+k
      switch3.value = Object.keys(window.data1.kalenders)[k-1]
      switch1.appendChild(switch3)
      switch3.addEventListener('click', function () {
        if (window.agenda_lijst2.includes(this.value)==false) {window.agenda_lijst2.push(this.value)}
        else {window.agenda_lijst2.splice(window.agenda_lijst2.indexOf(this.value),1)}
        display_calendar(year, false)
      });

      //var css = 'input:checked + #switch'+k+' { background-color:' +window.data1.kalenders[Object.keys(window.data1.kalenders)[n-1]].kleur + '}'+'input:checked + #switch'+k+':before {-webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px);}'
      //var style = document.createElement('style');
      //if (style.styleSheet) {style.styleSheet.cssText = css;}
      //else {style.appendChild(document.createTextNode(css));}
      //document.getElementsByTagName('head')[0].appendChild(style);
    }
  }

  var today = new Date();
  var year_text = document.createElement("h2");
  year_text.innerHTML = year;
  year_text.setAttribute("style", "font-size: 1.8rem;")
  home_div.appendChild(year_text);
  home_div.appendChild(document.createElement("br"));
  var date = new Date(year + "-01-01");


  for (i = 0; i < 12; i++) {
    var title = document.createElement("h2");
    title.innerHTML = months[i];
    home_div.appendChild(title);
    var div = document.createElement('div');
    div.classList.toggle('month');
    home_div.appendChild(div);

    if (date.getFullYear()==today.getFullYear()) {
      if (date.getMonth()==today.getMonth()) {
        title.id = "today"
      }
    }

    for (l = 0; l < 7; l++) {
      var weekday_btn = document.createElement("a");
      weekday_btn.innerHTML = weekdays[l];
      weekday_btn.classList.toggle('btn2');
      weekday_btn.setAttribute("style", "width: "+x+"%;")
      weekday_btn.classList.toggle('weekday-btn');
      div.appendChild(weekday_btn);
    }

    var space = document.createElement("br");
    div.appendChild(space);

    hidden_btn_num = [6, 0, 1, 2, 3, 4, 5]
    for (k = 0; k < hidden_btn_num[date.getDay()]; k++) {
      var hidden_btn = document.createElement("a");
      hidden_btn.style.visibility = "hidden";
      hidden_btn.classList.toggle('btn2');
      hidden_btn.setAttribute("style", "width: "+x+"%;")
      div.appendChild(hidden_btn);
    }

    for (j = 0; j < 31; j++) {
      if (date.getMonth()==i) {
        var btn = document.createElement("a");
        btn.innerHTML = date.getDate();
        var date_in_format = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
        var date_in_format2 = date.getDate()+"."+(date.getMonth()+1);
        btn.href = "agenda_details.html?date="+ date_in_format+"&"+queryString.substr(1);
        home_div.appendChild(btn);
        btn.setAttribute("style", "width: "+x+"%;")
        btn.classList.toggle('btn2');
        btn.classList.toggle('normal-btn');
        div.appendChild(btn);

        if (date.getDay()==0) {
          home_div.appendChild(document.createElement("br"));
        }

        if (date.getFullYear()==today.getFullYear()) {
          if (date.getMonth()==today.getMonth()) {
            if (date.getDate()==today.getDate()) {
              btn.classList.toggle('normal-btn');
              btn.classList.toggle('today-btn');
            }
          }
        }

        if (window.gegevens != null) {
          if ((date_in_format in window.gegevens)==true) {
            if (window.gegevens[date_in_format].activiteiten.length > 0) {
              if (!btn.classList.contains('today-btn')) {
                var kleur = window.data1.kalenders[window.gegevens[date_in_format].activiteiten[0].agenda].kleur
                btn.setAttribute("style", "width: "+x+"%;background-color:"+kleur)
              }
              btn.innerHTML = date.getDate()+"*"//"\n"+window.gegevens[date_in_format].activiteiten
            }
          }
          else {
            if ((date_in_format2 in window.gegevens)==true) {
              if (window.gegevens[date_in_format2].activiteiten.length > 0) {
                if (!btn.classList.contains('today-btn')) {
                  var kleur = window.data1.kalenders[window.gegevens[date_in_format2].activiteiten[0].agenda].kleur
                  btn.setAttribute("style", "width: "+x+"%;background-color:"+kleur)
                }
                btn.innerHTML = date.getDate()+"*"//"\n"+window.gegevens[date_in_format].activiteiten
              }
            }
          }
        }
        var date = new Date(date)
        date.setDate(date.getDate() + 1)

        if (date.getDate()==1) {
          if (date.getMonth()==i) {
            var enter = document.createElement("br");
            //div.appendChild(enter);
          }
        }
      }
    }
    //console.log(7-hidden_btn_num[date.getDay()], date.getDay())
    if (hidden_btn_num[date.getDay()] != 0) {
      for (a=0; a<(7-hidden_btn_num[date.getDay()]);a++) {
        var hidden_btn = document.createElement("a");
        hidden_btn.style.visibility = "hidden";
        hidden_btn.classList.toggle('btn2');
        hidden_btn.setAttribute("style", "width: "+x+"%;")
        div.appendChild(hidden_btn);
      }
    }
  }

  if (year==today.getFullYear() &&scroll) {
    await delay(500);
    document.querySelector('#today').scrollIntoView({behavior: 'smooth'});
  }
}

async function show1() {
  var jaar = urlParams.get('jaar')
  if (queryString.includes('&jaar')) {
    queryString = queryString.replace("&jaar="+jaar ,"")
  }
  else {if (queryString.includes('jaar')) {
    queryString = queryString.replace("jaar="+jaar+"&" ,"")
  }}
  if (check_year(jaar)==false&&jaar!=null) {
    display_calendar(jaar, true);
  }
  else {
    var today = new Date();
    var current_year = today.getFullYear();
    display_calendar(current_year, true);
  }
}

function check_year(jaar) {
  letters = ["a", "b", "c", "d","e","f","g", "h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
  if (jaar == "" || jaar == null || jaar == undefined) {return false}
  var error = false;
  for (i= 0; i<jaar.length; i++) {
    if ((jaar[i] in letters)==false) {
      error = true;}}
  return error
}

function search_year(jaar) {
  console.log(jaar)
  if (jaar=="") {alert("Je hebt geen jaar ingevuld!");}
  else {
    var error = check_year(jaar)
    if (error==true) {alert("Je hebt een ongeldig jaartal ingevuld!");}
    else {display_calendar(jaar, true);}
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
  h = Math.trunc(Number(((window.innerWidth - 70)/ window.innerWidth)*100))
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
  h = Math.trunc(Number(((window.innerWidth - 250)/ window.innerWidth)*99))
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
