// Get params
var queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
var wachtwoord = urlParams.get('wachtwoord')
var gebruikersnaam = urlParams.get('gebruikersnaam')
var aantal = urlParams.get('aantal')
var date2 = urlParams.get('date')
var jaar = urlParams.get('jaar')
if (queryString.includes('&jaar')) {
  queryString = queryString.replace("&jaar="+jaar ,"")
}
else {if (queryString.includes('jaar')) {
  queryString = queryString.replace("jaar="+jaar+"&" ,"")
}}

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
window.agenda_lijst3 = agenda_lijst;

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
const weekdays = ["Zondag","Maandag", "Dinsdag", "Woensdag", "Donderdag","Vrijdag", "Zaterdag"]
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
  var home_div = document.getElementById("home-div")
  var loader = document.createElement("div")
  loader.classList.add("loader")
  home_div.appendChild(loader)
  w = 100*(window.innerWidth-loader.clientWidth)/(2*window.innerWidth)
  loader.setAttribute("style", "position:absolute; left:"+w+"%");
  loading2("wait")

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=agendaSignIn3&"+queryString.substr(1);
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
  //console.log(data)
  if (Object.keys(data).length == 1) {
    if (agenda_lijst2.includes(Object.keys(data)[0])) {
      return data[Object.keys(data)[0]]
    }
    return {}
  }
  else {
    var kalender5 = {}//data[Object.keys(data)[0]]
    for (var n = 0; n<Number(Object.keys(data).length);n++) {
      if (agenda_lijst2.includes(Object.keys(data)[n])) {
        var element = data[Object.keys(data)[n]]
        for (var datum in element) {
          if (datum != "kleur") {
            //if (Object.keys(kalender5).includes(datum)) {
            //  for (var activity in element[datum]["activiteiten"]) {
            //    kalender5[datum]["activiteiten"].push(element[datum]["activiteiten"][activity])
            //  }
            //}
            //else {kalender5[datum] = {"activiteiten":[...element[datum]["activiteiten"]]}}
            if (Object.keys(kalender5).includes(datum)==false) {
              kalender5[datum] = {"activiteiten": []}
            }
            for (var activity in element[datum]["activiteiten"]) {
              element[datum]["activiteiten"][activity]["index"] = activity
              kalender5[datum]["activiteiten"].push(element[datum]["activiteiten"][activity])
              //kalender5[datum]["activiteiten"][activity]["index"] = activity
            }
          }
        }
      }
    }
    return kalender5
  }
}

function format(date) {
  var date2 = date.split(".");
  var day = new Date(date2[2]+"-"+date2[1]+"-"+date2[0]);
  date3 = weekdays[day.getDay()]+" "+date2[0]+" "+months[day.getMonth()]+" "+date2[2]
  return date3
}

function removeDuplicates(data3) {
  return data3.filter((value,index) => data3.indexOf(value)===index);
  return [... new Set(data3)]
}


async function load_page(gebruikersnaam, wachtwoord) {
  if (gebruikersnaam != null && wachtwoord != null) {
    var loading = true;
    while (loading==true) {
      await delay(1);
      if (window.loading==false) {
        if (window.ingelogd == false) {
          //console.log("error");
          window.location.replace("show_calender.html"+queryString);
        }
        if (window.ingelogd == true) {
          window.edit = false;//load_page2();
          window.edit_num = -1
          load_page4();
        }
        loading = false;
      }
    }
  }

  else {
    window.ingelogd = false;
    window.location.replace("start.html");
  }
}

function load_page4() {
  home_div = document.getElementById("home-div");
  // button links
  var btn1 = document.getElementById("account_button");
  btn1.href = "account.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var btn2 = document.getElementById("settings_button");
  btn2.href = "settings.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var btn3 = document.getElementById("title");
  btn3.href = "home.html?gebruikersnaam="+gebruikersnaam+"&wachtwoord="+wachtwoord;
  var div = document.getElementById("home-div");

  title_text = document.createElement("p");
  title_text.innerHTML = "Bekijk je agenda's"
  title_text.id = "home-title"
  home_div.appendChild(title_text)
  document.getElementById("page-title").innerHTML = "Agenda - "+format(date2)
  if (aantal == 1) {
    document.getElementById("page-title").innerHTML = Object.keys(agenda_lijst)[0]+" - "+format(date2)
    title_text.innerHTML = Object.keys(agenda_lijst)[0]
  }
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
        load_page3()
      });
    }
  }
  var year_text = document.createElement("h2");
  year_text.innerHTML = format(date2);
  year_text.setAttribute("style", "font-size: 1.8rem;")
  home_div.appendChild(year_text);
  home_div.appendChild(document.createElement("br"));

  home_div2 = document.createElement("div");
  home_div2.id = "home-div1"
  home_div.appendChild(home_div2)
  load_page3()
}

async function load_page3() {
  window.gegevens = structure_data(window.data1["kalenders"],window.agenda_lijst2);
  console.log(window.gegevens)
  var body = document.getElementById("body");
  home_div = document.getElementById("home-div1");
  home_div.innerHTML = ''

  var x = 10
  if (mobileCheck()) {x = 9;}

  var activities = false;
  var activities_num = 0;
  var date4 = date2.split(".")[0]+"."+date2.split(".")[1]

  if (window.gegevens != null) {
    if (Object.keys(window.gegevens).includes(date2)) {
      if (window.gegevens[date2].activiteiten.length > 0) {
        activities = true;
        activities_num += window.gegevens[date2].activiteiten.length;

        for (i=0;i<window.gegevens[date2].activiteiten.length;i++) {
          //if ()
          input_div = document.createElement("div");
          input_div.setAttribute("style", "display: inline-block;width:60%;")
          home_div.appendChild(input_div)

          var input = document.createElement("textarea");
          input.setAttribute("rows", "4");
          input.classList.add("input2");
          input.id = "input"+(i+1);
          input.disabled = true;
          input.setAttribute("style", "border-color:"+window.data1.kalenders[window.gegevens[date2].activiteiten[i]["agenda"]].kleur)
          input.value = window.gegevens[date2].activiteiten[i]["activiteit"];
          input_div.appendChild(input);

          if (window.gegevens[date2].activiteiten[i]["tijdstip"] =="geen" && window.gegevens[date2].activiteiten[i]["tijdstip"] =="geen" && !(window.edit && window.edit_num == i)) {
            input.setAttribute("rows", "6");
          }

          var y = 0
          if (window.gegevens[date2].activiteiten[i]["tijdstip"] !="geen" || (window.edit && window.edit_num == i)) {y=75;}
          if (window.gegevens[date2].activiteiten[i]["locatie"] !="geen" ||(window.edit && window.edit_num == i)) {
            var w = 100
            var locatie = document.createElement("input");
            if (y != 0) {
              w = 95*(input_div.clientWidth-10-y-60)/(input_div.clientWidth)
              if (mobileCheck()) {w=100}
            }
            if (!mobileCheck()) {locatie.setAttribute("style", "width:"+w+"%;padding: 5px 20px 5px 40px;background-image: url('images/pin.png'); background-position: 10px 6px; background-repeat: no-repeat; background-size: 20px;")}
            else {locatie.setAttribute("style", "width:"+w+"%;");}
            locatie.classList.add("input3");
            locatie.id = "locatie-input"+(i+1);
            locatie.disabled = !(window.edit && window.edit_num == i);
            locatie.value = window.gegevens[date2].activiteiten[i]["locatie"];
            input_div.appendChild(locatie);
          }

          if (window.gegevens[date2].activiteiten[i]["tijdstip"] !="geen" || (window.edit && window.edit_num == i)) {
            var tijd = document.createElement("select");
            var w = 95*(y)/(input_div.clientWidth)
            tijd.setAttribute("style", "width:"+w+"%;");
            tijd.id = "tijd-input"+(i+1);
            tijd.disabled = !(window.edit && window.edit_num == i);

            input_div.appendChild(tijd);
            var optie = document.createElement("option");
            optie.value = "geen"
            optie.innerHTML = "Tijdstip"
            tijd.appendChild(optie)
            var optie = document.createElement("option");
            optie.value = "geen"
            optie.innerHTML = "-"
            tijd.appendChild(optie)
            lijst = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23", "24"]
            for (n in lijst) {
              var optie = document.createElement("option");
              optie.value = lijst[n]+":00"
              optie.innerHTML = lijst[n]+":00"
              tijd.appendChild(optie)
              if (n !=24) {
                var optie = document.createElement("option");
                optie.value = lijst[n]+":30"
                optie.innerHTML = lijst[n]+":30"
                tijd.appendChild(optie)
              }
            }
            tijd.value = window.gegevens[date2].activiteiten[i]["tijdstip"]
          }
          input_div.appendChild(document.createElement("br"));
          check_div = document.createElement("div");
          check_div.setAttribute("style", "display: inline-block;width:60%;")
          input_div.appendChild(check_div)

          check_span = document.createElement("span");
          check_span.setAttribute("style", "font-size: 1.3rem;")
          if (mobileCheck()) {
            check_div.setAttribute("style", "display: inline-block;width:100%;")
            check_span.setAttribute("style", "font-size: 1rem;")
          }
          check_span.innerHTML = "Jaarlijks tonen: "
          check_div.appendChild(check_span)

          var checkbox = document.createElement("input");
          checkbox.setAttribute("style", "width:16px;height:16px;");
          checkbox.type = "checkbox"
          checkbox.id = "checkbox-input"+(i+1);
          checkbox.disabled = !(window.edit && window.edit_num == i);
          checkbox.checked = false;
          check_div.appendChild(checkbox);


          if (window.edit && window.edit_num == i) {
            if (window.agenda_lijst2.length > 1) {
              agenda_div = document.createElement("div");
              agenda_div.setAttribute("style", "display: inline-block;width:75%;")
              if (mobileCheck()) {
                agenda_div.setAttribute("style", "display: inline-block;width:100%;")
              }
              input_div.appendChild(agenda_div)

              var agenda_input = document.createElement("select");
              agenda_input.id = "agenda-input"+(i+1);
              agenda_input.multiple = true;
              agenda_div.appendChild(agenda_input);

              //var option = document.createElement("option");
              //option.value = "all"
              //option.innerHTML = "Al mijn agenda's"
              //agenda_input.appendChild(option)
              for (n in window.agenda_lijst2) {
                var option = document.createElement("option");
                option.value = window.agenda_lijst2[n]
                option.innerHTML = window.agenda_lijst2[n]
                agenda_input.appendChild(option)
                if (window.agenda_lijst2[n] == window.gegevens[date2].activiteiten[i]["agenda"]) {
                 option.selected = true;
                }
              }
              new MultiSelectTag("agenda-input"+(i+1), {placeholder: 'Zoeken...'});
            }

            input.disabled = false;
            home_div.appendChild(document.createElement("br"));

            var edit_btn = document.createElement("a");
            edit_btn.innerHTML = "Activiteit opslaan";
            edit_btn.classList.add('btn2', 'small-btn1','normal-btn');
            edit_btn.value = i
            edit_btn.addEventListener('click', function() {
              var same = false;
              if (document.getElementById("input"+(this.value+1)).value == window.gegevens[date2].activiteiten[this.value]["activiteit"]) {
                if (document.getElementById("locatie-input"+(this.value+1)).value == window.gegevens[date2].activiteiten[this.value]["locatie"]) {
                  if (document.getElementById("tijd-input"+(this.value+1)).value == window.gegevens[date2].activiteiten[this.value]["tijdstip"]) {
                    if (document.getElementById("checkbox-input"+(this.value+1)).checked == false) {
                      same = true
                      if (window.agenda_lijst2.length > 1) {
                        var kalender_input = getSelectValues(document.getElementById("agenda-input"+(this.value+1)))
                        //console.log(kalender_input)
                        same = false;
                        if (kalender_input.length == 1) {
                          if (kalender_input[0] == window.gegevens[date2].activiteiten[this.value]["agenda"]) {
                            same = true;
                          }
                        }
                      }
                    }}}}
              if (same) {
                window.edit = false
                window.edit_num = -1
                load_page3()
              }
              else {
                var index = window.gegevens[date2].activiteiten[this.value]["index"];
                var agenda = window.gegevens[date2].activiteiten[this.value]["agenda"];
                var new_date = date2;
                if (document.getElementById("checkbox-input"+(this.value+1)).checked == true) {new_date = date4}
                var new_activity = document.getElementById("input"+(this.value+1)).value
                var new_locatie = document.getElementById("locatie-input"+(this.value+1)).value
                var new_tijd = document.getElementById("tijd-input"+(this.value+1)).value
                if (window.agenda_lijst2.length > 1) {
                  var new_agenda_lijst = getSelectValues(document.getElementById("agenda-input"+(this.value+1)))
                }
                else {var new_agenda_lijst = [...window.agenda_lijst2]}
                edit_activity(date2, new_date, index, agenda, new_activity, new_locatie, new_tijd, new_agenda_lijst)
              }});
            home_div.appendChild(edit_btn);

            var delete_btn = document.createElement("a");
            delete_btn.innerHTML = "Verwijderen";
            delete_btn.classList.add('btn2', 'small-btn2','normal-btn');
            delete_btn.value = i
            delete_btn.addEventListener('click', function() {
              var agenda = window.gegevens[date2].activiteiten[this.value]["agenda"];
              var index = window.gegevens[date2].activiteiten[this.value]["index"];
              create_modal2(date2, agenda, index);
            });
            home_div.appendChild(delete_btn);

            var cancel_btn = document.createElement("a");
            cancel_btn.innerHTML = "Annuleren";
            cancel_btn.classList.add('btn2', 'small-btn2','normal-btn');
            cancel_btn.addEventListener('click', function() {
              window.edit = false;
              window.edit_num = -1;
              load_page3();
            });
            home_div.appendChild(cancel_btn);
          }
          else {
            if (window.edit==false) {
              input_div.setAttribute("style", "display: inline-block;width:50%;")
              var edit_btn = document.createElement("a");
              edit_btn.id = "edit_btn"+(i+1)
              edit_btn.value = i
              edit_btn.classList.add("btn2","btn4");
              edit_btn.addEventListener('click', function () {
               window.edit = true;
               window.edit_num = this.value;
               load_page3();
              });
              home_div.appendChild(edit_btn);


              var delete_btn = document.createElement("a");
              delete_btn.id = "delete_btn"+(i+1)
              delete_btn.value = i
              delete_btn.classList.add("btn2","btn3");
              delete_btn.addEventListener('click', function() {
                var agenda = window.gegevens[date2].activiteiten[this.value]["agenda"];
                var index = window.gegevens[date2].activiteiten[this.value]["index"];
                create_modal2(date2, agenda, index);
              });
              home_div.appendChild(delete_btn);
              if (mobileCheck() && window.gegevens[date2].activiteiten[i]["tijdstip"] !="geen" && window.gegevens[date2].activiteiten[i]["locatie"] !="geen") {
                edit_btn.setAttribute("style", "height:142px;")
                delete_btn.setAttribute("style", "height:142px;")
              }
            }
          }
          home_div.appendChild(document.createElement("br"));
          home_div.appendChild(document.createElement("br"));
        }
      }
    }
    if (Object.keys(window.gegevens).includes(date2.split(".")[0]+"."+date2.split(".")[1])) {
      if (window.gegevens[date2.split(".")[0]+"."+date2.split(".")[1]].activiteiten.length > 0) {
        activities = true;
        for (j=0;j<window.gegevens[date4].activiteiten.length;j++) {
          input_div2 = document.createElement("div");
          input_div2.setAttribute("style", "display: inline-block;width:60%;")
          home_div.appendChild(input_div2)

          var input2 = document.createElement("textarea");
          input2.setAttribute("rows", "4");
          input2.width = 800;
          input2.classList.add("input2");
          input2.id = "input"+(activities_num+j+1);
          input2.disabled = true;
          //console.log(window.gegevens[date4],j)
          input2.setAttribute("style", "border-color:"+window.data1.kalenders[window.gegevens[date4].activiteiten[j]["agenda"]].kleur)
          input2.value = window.gegevens[date4].activiteiten[j]["activiteit"];
          input_div2.appendChild(input2);

          if (window.gegevens[date4].activiteiten[j]["tijdstip"] =="geen" && window.gegevens[date4].activiteiten[j]["tijdstip"] =="geen" && !(window.edit && window.edit_num == Number(activities_num+j))) {
            input2.setAttribute("rows", "6");
          }

          var y = 0
          if (window.gegevens[date4].activiteiten[j]["tijdstip"] !="geen" || (window.edit && window.edit_num == Number(activities_num+j))) {y=75;}
          if (window.gegevens[date4].activiteiten[j]["locatie"] !="geen" ||(window.edit && window.edit_num == Number(activities_num+j))) {
            var w = 100
            var locatie2 = document.createElement("input");
            if (y != 0) {
              w = 95*(input_div2.clientWidth-10-y)/(input_div2.clientWidth)
              if (mobileCheck()) {w=100}
            }
            if (!mobileCheck()) {locatie2.setAttribute("style", "background-image: url('images/pin.png'); background-position: 10px 6px; background-repeat: no-repeat;")}
            if (!mobileCheck()) {locatie2.setAttribute("style", "width:"+w+"%;padding: 5px 20px 5px 40px;background-image: url('images/pin.png'); background-position: 10px 6px; background-repeat: no-repeat; background-size: 20px;")}
            else {locatie2.setAttribute("style", "width:"+w+"%;");}
            locatie2.classList.add("input3");
            locatie2.id = "locatie-input"+(Number(activities_num)+j+1);
            locatie2.disabled = !(window.edit && window.edit_num == Number(activities_num+j));
            locatie2.value = window.gegevens[date4].activiteiten[j]["locatie"];
            input_div2.appendChild(locatie2);
          }

          if (window.gegevens[date4].activiteiten[j]["tijdstip"] !="geen" || (window.edit && window.edit_num == Number(activities_num+j))) {
            var tijd2 = document.createElement("select");
            var w = 95*(y)/(input_div2.clientWidth)
            tijd2.setAttribute("style", "width:"+w+"%;");
            tijd2.id = "tijd-input"+(Number(activities_num)+j+1);
            tijd2.disabled = !(window.edit && window.edit_num == (Number(activities_num)+j));

            input_div2.appendChild(tijd2);
            var optie2 = document.createElement("option");
            optie2.value = "geen"
            optie2.innerHTML = "Tijdstip"
            tijd2.appendChild(optie2)
            var optie2 = document.createElement("option");
            optie2.value = "geen"
            optie2.innerHTML = "-"
            tijd2.appendChild(optie2)
            lijst = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23", "24"]
            for (n in lijst) {
              var optie2 = document.createElement("option");
              optie2.value = lijst[n]+":00"
              optie2.innerHTML = lijst[n]+":00"
              tijd2.appendChild(optie2)
              if (n !=24) {
                var optie2 = document.createElement("option");
                optie2.value = lijst[n]+":30"
                optie2.innerHTML = lijst[n]+":30"
                tijd2.appendChild(optie2)
              }
            }
            tijd2.value = window.gegevens[date4].activiteiten[j]["tijdstip"]
          }
          input_div2.appendChild(document.createElement("br"));
          check_div2 = document.createElement("div");
          check_div2.setAttribute("style", "display: inline-block;width:60%;")
          input_div2.appendChild(check_div2)

          check_span2 = document.createElement("span");
          check_span2.setAttribute("style", "font-size: 1.3rem;")
          if (mobileCheck()) {
            check_div2.setAttribute("style", "display: inline-block;width:100%;")
            check_span2.setAttribute("style", "font-size: 1rem;")
          }
          check_span2.innerHTML = "Jaarlijks tonen: "
          check_div2.appendChild(check_span2)

          var checkbox2 = document.createElement("input");
          checkbox2.setAttribute("style", "width:16px;height:16px;");
          checkbox2.type = "checkbox"
          checkbox2.id = "checkbox-input"+(Number(activities_num)+j+1);
          checkbox2.disabled = !(window.edit && window.edit_num == Number(activities_num+j));
          checkbox2.checked = true;
          check_div2.appendChild(checkbox2);


          if (window.edit && window.edit_num == Number(activities_num+j)) {
            if (window.agenda_lijst2.length > 1) {
              agenda_div2 = document.createElement("div");
              agenda_div2.setAttribute("style", "display: inline-block;width:75%;")
              if (mobileCheck()) {
                agenda_div2.setAttribute("style", "display: inline-block;width:100%;")
              }
              input_div2.appendChild(agenda_div2)
              var agenda_input2 = document.createElement("select");
              agenda_input2.id = "agenda-input"+(Number(activities_num)+j+1);
              agenda_input2.multiple = true;
              agenda_div2.appendChild(agenda_input2);

              for (n in window.agenda_lijst2) {
                var option2 = document.createElement("option");
                option2.value = window.agenda_lijst2[n]
                option2.innerHTML = window.agenda_lijst2[n]
                if (window.agenda_lijst2[n] == window.gegevens[date4].activiteiten[j]["agenda"]) {
                  option2.selected = true;
                }
                agenda_input2.appendChild(option2)
              }
              new MultiSelectTag("agenda-input"+(Number(activities_num)+j+1));
            }

            input2.disabled = false;
            home_div.appendChild(document.createElement("br"));

            var edit_btn2 = document.createElement("a");
            edit_btn2.innerHTML = "Activiteit opslaan";
            edit_btn2.classList.add('btn2', 'small-btn1','normal-btn');
            edit_btn2.value = (Number(activities_num)+j)
            edit_btn2.addEventListener('click', function() {
              var same = false;
              if (document.getElementById("input"+(this.value+1)).value == window.gegevens[date4].activiteiten[this.value-window.gegevens[date2].activiteiten.length]["activiteit"]) {
                if (document.getElementById("locatie-input"+(this.value+1)).value == window.gegevens[date4].activiteiten[this.value-window.gegevens[date2].activiteiten.length]["locatie"]) {
                  if (document.getElementById("tijd-input"+(this.value+1)).value == window.gegevens[date4].activiteiten[this.value-window.gegevens[date2].activiteiten.length]["tijdstip"]) {
                    if (document.getElementById("checkbox-input"+(this.value+1)).checked == true) {
                      same = true
                      if (window.agenda_lijst2.length > 1) {
                        var kalender_input = getSelectValues(document.getElementById("agenda-input"+(this.value+1)))
                        //console.log(kalender_input)
                        same = false;
                        if (kalender_input.length == 1) {
                          if (kalender_input[0] == window.gegevens[date4].activiteiten[this.value-window.gegevens[date2].activiteiten.length]["agenda"]) {
                            same = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (same) {
                window.edit = false
                window.edit_num = -1
                load_page3()
              }
              else {
                //console.log(window.gegevens[date4].activiteiten, this.value,window.gegevens[date2].activiteiten.length)
                var index = window.gegevens[date4].activiteiten[this.value-window.gegevens[date2].activiteiten.length]["index"];
                var agenda = window.gegevens[date4].activiteiten[this.value-window.gegevens[date2].activiteiten.length]["agenda"];
                var new_date = date2;
                if (document.getElementById("checkbox-input"+(this.value+1)).checked == true) {new_date = date4}
                var new_activity = document.getElementById("input"+(this.value+1)).value
                var new_locatie = document.getElementById("locatie-input"+(this.value+1)).value
                var new_tijd = document.getElementById("tijd-input"+(this.value+1)).value
                if (window.agenda_lijst2.length > 1) {
                  var new_agenda_lijst = getSelectValues(document.getElementById("agenda-input"+(this.value+1)))
                }
                else {var new_agenda_lijst = [...window.agenda_lijst2]}
                edit_activity(date4, new_date, index, agenda, new_activity, new_locatie, new_tijd, new_agenda_lijst)
              }});
            home_div.appendChild(edit_btn2);

            var delete_btn2 = document.createElement("a");
            delete_btn2.innerHTML = "Verwijderen";
            delete_btn2.classList.add('btn2', 'small-btn2','normal-btn');
            delete_btn2.value = j
            delete_btn2.addEventListener('click', function() {
              var agenda = window.gegevens[date4].activiteiten[this.value]["agenda"];
              var index = window.gegevens[date4].activiteiten[this.value]["index"];
              create_modal2(date4, agenda, index);
            });
            home_div.appendChild(delete_btn2);

            var cancel_btn2 = document.createElement("a");
            cancel_btn2.innerHTML = "Annuleren";
            cancel_btn2.classList.add('btn2', 'small-btn2','normal-btn');
            cancel_btn2.addEventListener('click', function() {
              window.edit = false;
              window.edit_num = -1;
              load_page3();
            });
            home_div.appendChild(cancel_btn2);
          }
          else {
            if (window.edit==false) {
              input_div2.setAttribute("style", "display: inline-block;width:50%;")
              var edit_btn2 = document.createElement("a");
              edit_btn2.id = "edit_btn"+(Number(activities_num)+j)
              edit_btn2.value = (Number(activities_num)+j)
              edit_btn2.classList.add("btn2","btn4");
              edit_btn2.addEventListener('click', function () {
               window.edit = true;
               window.edit_num = this.value;
               load_page3();
              });
              home_div.appendChild(edit_btn2);


              var delete_btn2 = document.createElement("a");
              delete_btn2.id = "delete_btn"+(Number(activities_num)+j)
              delete_btn2.classList.add("btn2","btn3");
              delete_btn2.value = j
              delete_btn2.addEventListener('click', function() {
                var agenda = window.gegevens[date4].activiteiten[this.value]["agenda"];
                var index = window.gegevens[date4].activiteiten[this.value]["index"];
                create_modal2(date4, agenda, index);
              });
              home_div.appendChild(delete_btn2);
              if (mobileCheck() && window.gegevens[date4].activiteiten[j]["tijdstip"] !="geen" && window.gegevens[date4].activiteiten[j]["locatie"] !="geen") {
                edit_btn2.setAttribute("style", "height:142px;")
                delete_btn2.setAttribute("style", "height:142px;")
              }
            }
          }
          home_div.appendChild(document.createElement("br"));
          home_div.appendChild(document.createElement("br"));
        }
        activities_num += window.gegevens[date4].activiteiten.length;
      }
    }
    if (window.edit == true && window.edit_num == activities_num) {
      input_div1 = document.createElement("div");
      input_div1.setAttribute("style", "display: inline-block;width:60%;")
      home_div.appendChild(input_div1)

      var input1 = document.createElement("textarea");
      input1.setAttribute("rows", "4");
      input1.classList.add("input2");
      input1.id = "input"+(activities_num+1);
      input1.disabled = false;
      input1.placeholder = "Beschrijf een activiteit...";
      input_div1.appendChild(input1);

      var y=75
      var locatie1 = document.createElement("input");
      var w = 95*(input_div1.clientWidth-10-y)/(input_div1.clientWidth)
      if (mobileCheck()) {w=100}
      if (!mobileCheck()) {locatie1.setAttribute("style", "width:"+w+"%;padding: 5px 20px 5px 40px;background-image: url('images/pin.png'); background-position: 10px 6px; background-repeat: no-repeat; background-size: 20px;")}
      else {locatie1.setAttribute("style", "width:"+w+"%;");}
      locatie1.classList.add("input3");
      locatie1.id = "locatie-input"+(activities_num+1);
      locatie1.placeholder = "Locatie...";
      input_div1.appendChild(locatie1);

      var tijd1 = document.createElement("select");
      var w = 95*(y)/(input_div1.clientWidth)
      tijd1.setAttribute("style", "width:"+w+"%;");
      tijd1.id = "tijd-input"+(activities_num+1);
      //tijd1.disabled = true;
      input_div1.appendChild(tijd1);

      var optie1 = document.createElement("option");
      optie1.value = "geen"
      optie1.innerHTML = "Tijdstip"
      tijd1.appendChild(optie1)
      var optie1 = document.createElement("option");
      optie1.value = "geen"
      optie1.innerHTML = "-"
      tijd1.appendChild(optie1)
      lijst = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23", "24"]
      for (n in lijst) {
        var optie1 = document.createElement("option");
        optie1.value = lijst[n]+":00"
        optie1.innerHTML = lijst[n]+":00"
        tijd1.appendChild(optie1)
        if (n !=24) {
          var optie1 = document.createElement("option");
          optie1.value = lijst[n]+":30"
          optie1.innerHTML = lijst[n]+":30"
          tijd1.appendChild(optie1)
        }
      }
      input_div1.appendChild(document.createElement("br"));
      check_div1 = document.createElement("div");
      check_div1.setAttribute("style", "display: inline-block;width:60%;")
      input_div1.appendChild(check_div1)

      check_span1 = document.createElement("span");
      check_span1.setAttribute("style", "font-size: 1.3rem;")
      if (mobileCheck()) {
        check_div1.setAttribute("style", "display: inline-block;width:100%;")
        check_span1.setAttribute("style", "font-size: 1rem;")
      }
      check_span1.innerHTML = "Jaarlijks tonen: "
      check_div1.appendChild(check_span1)

      var checkbox1 = document.createElement("input");
      checkbox1.setAttribute("style", "width:16px;height:16px;");
      checkbox1.type = "checkbox"
      checkbox1.id = "checkbox-input"+(Number(activities_num)+1);
      checkbox1.disabled = !(window.edit && window.edit_num == Number(activities_num));
      checkbox1.checked = false;
      check_div1.appendChild(checkbox1);

      if (window.agenda_lijst2.length > 1) {
        agenda_div1 = document.createElement("div");
        agenda_div1.setAttribute("style", "display: inline-block;width:75%;")
        if (mobileCheck()) {
          agenda_div1.setAttribute("style", "display: inline-block;width:100%;")
        }
        input_div1.appendChild(agenda_div1)
        var agenda_input1 = document.createElement("select");
        agenda_input1.id = "agenda-input"+(Number(activities_num)+1);
        agenda_input1.multiple = true;
        agenda_div1.appendChild(agenda_input1);

        for (n in window.agenda_lijst2) {
          var option1 = document.createElement("option");
          option1.value = window.agenda_lijst2[n]
          option1.innerHTML = window.agenda_lijst2[n]
          agenda_input1.appendChild(option1)
          if (n==0) {
           option1.selected = true;
          }
        }
        new MultiSelectTag("agenda-input"+(Number(activities_num)+1), {placeholder: 'Zoeken...'});
      }

      home_div.appendChild(document.createElement("br"))

      var edit_btn = document.createElement("a");
      edit_btn.innerHTML = "Activiteit opslaan";
      edit_btn.classList.add('btn2', 'small-btn1','normal-btn');
      edit_btn.value = Number(activities_num)
      edit_btn.addEventListener('click', function() {
        var new_date = date2;
        if (document.getElementById("checkbox-input"+(this.value+1)).checked == true) {
          new_date = date4
        }
        var new_activity = document.getElementById("input"+(this.value+1)).value
        var new_locatie = document.getElementById("locatie-input"+(this.value+1)).value
        var new_tijd = document.getElementById("tijd-input"+(this.value+1)).value
        if (window.agenda_lijst2.length > 1) {
          var new_agenda_lijst = getSelectValues(document.getElementById("agenda-input"+(this.value+1)))
        }
        else {var new_agenda_lijst = [...window.agenda_lijst2]}
        create_activity(new_date,new_activity,new_locatie,new_tijd,new_agenda_lijst)
      }, false);
      home_div.appendChild(edit_btn);

      var delete_btn = document.createElement("a");
      delete_btn.innerHTML = "Verwijderen";
      delete_btn.classList.add('btn2', 'small-btn2','normal-btn');
      delete_btn.addEventListener('click', function() {
        window.edit = false;
        window.edit_num = -1
        load_page3()
      }, false)
      home_div.appendChild(delete_btn);
    }

    if (activities == false && window.edit == false) {
      var activity_text = document.createElement("p");
      activity_text.innerHTML = "Op deze dag zijn er geen activiteiten gepland.";
      home_div.appendChild(activity_text);
    }
    home_div.appendChild(document.createElement("br"));
    home_div.appendChild(document.createElement("br"));

    if (window.edit==false) {
      var btn = document.createElement("a");
      btn.innerHTML = "Activiteit toevoegen";
      btn.classList.add('btn2','normal-btn');
      btn.addEventListener('click', function() {
        window.edit = true;
        window.edit_num = activities_num;
        load_page3()
      });
      home_div.appendChild(btn);
      home_div.appendChild(document.createElement("br"));
    }

    var terug_btn = document.createElement("a");
    terug_btn.innerHTML = "Terug";
    terug_btn.classList.add('btn2','terug-btn');
    var date3 = date2.split(".")
    var day = new Date(date3[2]+"-"+date3[1]+"-"+date3[0]);
    //console.log()
    terug_btn.href = "show_calender.html?jaar="+day.getFullYear()+"&"+queryString.substr(1);
    home_div.appendChild(terug_btn);
    home_div.appendChild(document.createElement("br"));
    home_div.appendChild(document.createElement("br"));
  }
  resize()
}

function create_modal2(datum, agenda, index) {
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
  title.innerHTML = "Activiteit verwijderen"
  container_div.appendChild(title)
  text = document.createElement("p")
  text.innerHTML = "Weet je zeker dat je deze activiteit wilt verwijderen?"
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
  action_btn.innerHTML = "Verwijderen"
  clearfix_div.appendChild(action_btn)
  action_btn.addEventListener('click', function (e) {
    //eval(action + "()")
    delete_activity(datum, agenda, index);});
}


function edit_activity(old_date, new_date, index, old_agenda, new_activity, new_locatie, new_tijd, new_agenda_lijst) {
  var error = false;
  if (new_activity == "") {
    error = true;
    error_message = "Je hebt geen activiteit ingegeven!"
  }
  if (new_activity.includes("&") == true || new_activity.includes("=") == true || new_activity.includes("%") == true || new_activity.includes(",,") == true || new_activity.includes("::") == true) {
    error = true;
    error_message = "Er mogen geen spaties, dubbele komma's, dubbele :-tekens, %-tekens, &-tekens of =-tekens in je activiteit staan!";
  }
  if (new_locatie.includes("&") == true || new_locatie.includes("=") == true || new_locatie.includes("%") == true || new_locatie.includes(",,") == true || new_locatie.includes("::") == true) {
    error = true;
    error_message = "Er mogen geen spaties, dubbele komma's, dubbele :-tekens, %-tekens, &-tekens of =-tekens in de locatie staan!";
  }
  if (new_agenda_lijst.length == 0) {
    error = true;
    error_message = "Je hebt geen agenda gekozen voor deze activiteit!"
  }
  if (error == true) {alert(error_message)}

  else {
    var container = document.getElementById("home-div1")
    container.innerHTML = ""
    var loader = document.createElement("div")
    loader.classList.add("loader")
    loader.setAttribute("style", "margin-top: 30px; position: absolute; left: 48%; transform: translate(-50%, -50%);")
    loader.setAttribute("align", "center");
    container.appendChild(loader)
    loading2("wait")
    window.loading = true;
    resize();


    if (new_locatie == "") {new_locatie = "geen"}
    var activiteit = new_activity+"::"+new_locatie+"::"+new_tijd
    var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=editActivity&gebruikersnaam="+gebruikersnaam+"&old_date="+old_date+"&new_date="+new_date+"&old_activity_index="+index+"&new_activity="+activiteit+"&old_agenda="+old_agenda+"&new_agenda_lijst="+new_agenda_lijst.join(",,");//+"&aantal2="+new_agenda_lijst.length;

    var aantal2 = new_agenda_lijst.length
    for (var kalender in new_agenda_lijst) {
      url += "&agenda"+(Number(kalender)+1)+"="+new_agenda_lijst[kalender]
      url += "&agenda_pass"+(Number(kalender)+1)+"="+window.agenda_lijst3[new_agenda_lijst[kalender]]
    }
    if (new_agenda_lijst.includes(old_agenda)==false) {
      aantal2 += 1;
      url += "&agenda"+aantal2+"="+old_agenda;
      url += "&agenda_pass"+aantal2+"="+window.agenda_lijst3[old_agenda]
    }
    url += "&aantal="+aantal2
    if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}

    console.log(url, aantal2)
    fetch(url)
    .then(response => {
    if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
      return response.json()
      document.write("error")
    })
    .then(data => {
      //console.log(data["data"])
      container.removeChild(loader)
      loading2("default")
      window.loading = false;
      if (data["data"]["message"] != "oke") {
        alert(data["data"]["message"])
        load_page3()
      }
      else {
        window.edit = false;
        window.edit_num = -1
        window.data1.kalenders[old_agenda][old_date].activiteiten.splice(index, 1)
        for (k in new_agenda_lijst) {
          //activity_dict = {"activiteit":new_activity, "locatie":new_locatie, "tijd":new_tijd, "agenda":new_agenda_lijst[k]}
          if (Object.keys(window.data1.kalenders[new_agenda_lijst[k]]).includes(new_date)) {
            var index2 = window.data1.kalenders[new_agenda_lijst[k]][new_date].activiteiten.length
            window.data1.kalenders[new_agenda_lijst[k]][new_date].activiteiten.push({"activiteit":new_activity, "locatie":new_locatie, "tijdstip":new_tijd, "agenda":new_agenda_lijst[k], "index":index2})
          }
          else {
            window.data1.kalenders[new_agenda_lijst[k]][new_date] = {"activiteiten": [{"activiteit":new_activity, "locatie":new_locatie, "tijdstip":new_tijd, "agenda":new_agenda_lijst[k], "index": 0}]}
          }
        }
        load_page3()
      }
    })
    .catch(error => console.log(error))
  }
}

function delete_activity(datum, agenda, index) {
  var container = document.getElementById("home-div1")
  container.innerHTML = ""
  var loader = document.createElement("div")
  loader.classList.add("loader")
  loader.setAttribute("style", "margin-top: 30px; position: absolute; left: 48%; transform: translate(-50%, -50%);")
  loader.setAttribute("align", "center");
  container.appendChild(loader)
  loading2("wait")
  window.loading = true;
  resize();

  var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=deleteActivity&aantal=1&gebruikersnaam="+gebruikersnaam+"&date="+datum+"&activiteit_index="+index+"&agenda1="+agenda+"&agenda_pass1="+window.agenda_lijst3[agenda];
  if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}

  fetch(url)
  .then(response => {
  if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
    return response.json()
    document.write("error")
  })
  .then(data => {
    //console.log(data["data"])
    container.removeChild(loader)
    loading2("default")
    window.loading = false;
    if (data["data"]["message"] != "oke") {
      load_page3()
    }
    else {
      window.edit = false;
      window.edit_num = -1
      window.data1.kalenders[agenda][datum].activiteiten.splice(index, 1)
      load_page3()
    }
  })
  .catch(error => console.log(error))
}

function create_activity(new_date,new_activity,new_locatie,new_tijd,new_agenda_lijst) {
  var error = false;
  if (new_activity == "") {
    error = true;
    error_message = "Je hebt geen activiteit ingegeven!"
  }
  if (new_activity.includes("&") == true || new_activity.includes("=") == true || new_activity.includes("%") == true || new_activity.includes(",,") == true || new_activity.includes("::") == true) {
    error = true;
    error_message = "Er mogen geen spaties, dubbele komma's, dubbele :-tekens, %-tekens, &-tekens of =-tekens in je activiteit staan!";
  }
  if (new_locatie.includes("&") == true || new_locatie.includes("=") == true || new_locatie.includes("%") == true || new_locatie.includes(",,") == true || new_locatie.includes("::") == true) {
    error = true;
    error_message = "Er mogen geen spaties, dubbele komma's, dubbele :-tekens, %-tekens, &-tekens of =-tekens in de locatie staan!";
  }
  if (new_agenda_lijst.length == 0) {
    error = true;
    error_message = "Je hebt geen agenda gekozen voor deze nieuwe activiteit!"
  }
  if (error == true) {alert(error_message)}

  else {
    if (new_locatie == "") {new_locatie = "geen"}
    var activiteit = new_activity+"::"+new_locatie+"::"+new_tijd
    var url = "https://script.google.com/macros/s/AKfycbx0WoDj1evcXMEIUNvqtHxOtzDyr2Fnp3oFOwVqBiM7V7j_8fzcB6S6KG6_ny_3-XrJ/exec?action=createActivity&gebruikersnaam="+gebruikersnaam+"&date="+new_date+"&activiteit="+activiteit+"&aantal="+new_agenda_lijst.length

    //var agenda_lijst = new_agenda_lijst.join(",,")
    //var new_pass_lijst = []
    for (var kalender in new_agenda_lijst) {
      url += "&agenda"+(Number(kalender)+1)+"="+new_agenda_lijst[kalender]
      url += "&agenda_pass"+(Number(kalender)+1)+"="+window.agenda_lijst3[new_agenda_lijst[kalender]]
    }
    if (wachtwoord != '') {url += "&wachtwoord="+wachtwoord}

    var container = document.getElementById("home-div1")
    container.innerHTML = ""
    var loader = document.createElement("div")
    loader.classList.add("loader")
    loader.setAttribute("style", "margin-top: 30px; position: absolute; left: 48%; transform: translate(-50%, -50%);")
    loader.setAttribute("align", "center");
    container.appendChild(loader)
    loading2("wait")
    window.loading = true;
    resize();


    fetch(url)
    .then(response => {
    if (!response.ok) {throw new Error(`Request failed with status ${response.status}`)}
      return response.json()
      document.write("error")
    })
    .then(data => {
      //console.log(data["data"])
      container.removeChild(loader)
      loading2("default")
      window.loading = false;
      if (data["data"]["message"] != "oke") {
        load_page3()
      }
      else {
        window.edit = false;
        window.edit_num = -1
        for (k in new_agenda_lijst) {
          //activity_dict = {"activiteit":new_activity, "locatie":new_locatie, "tijd":new_tijd, "agenda":new_agenda_lijst[k]}
          if (Object.keys(window.data1.kalenders[new_agenda_lijst[k]]).includes(new_date)) {
            var index2 = window.data1.kalenders[new_agenda_lijst[k]][new_date].activiteiten.length
            window.data1.kalenders[new_agenda_lijst[k]][new_date].activiteiten.push({"activiteit":new_activity, "locatie":new_locatie, "tijdstip":new_tijd, "agenda":new_agenda_lijst[k], "index":index2})
          }
          else {
            window.data1.kalenders[new_agenda_lijst[k]][new_date] = {"activiteiten": [{"activiteit":new_activity, "locatie":new_locatie, "tijdstip":new_tijd, "agenda":new_agenda_lijst[k], "index": 0}]}
          }
        }
        load_page3()
      }
    })
    .catch(error => console.log(error))
  }
}

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
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
