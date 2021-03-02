//scripts.js
//Modulo (remainder) division, accommodating negative numbers
function modulo(n, m) {
  return ((n % m) + m) % m;
} 

function csvToJsonArray(csv) {
  //Converts csv string to Json (ARRAY) string; accepts quoted values  
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].trim().split(",");

  for(var i=1 in lines) {
    var obj = {};
    var row = lines[i],
      queryIdx = 0,
      startValueIdx = 0,
      idx = 0;
    if (row.trim() === '') { continue; }
    /* Step through characters in the row, segmenting by delimiter */
    while (idx < row.length) {
      /* If a double quote encountered, skip until the next one */
      var c = row[idx];
      if (c === '"') {
        do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
      }

      if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
        /* Capture value */
        var value = row.substr(startValueIdx, idx - startValueIdx).trim();
        /* Skip first double quote */
        if (value[0] === '"') { value = value.substr(1); }
        /* Skip last comma */
        if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
        /* Skip last double quote */
        if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }
        /* Assign value to key*/
        var key = headers[queryIdx++];
        obj[key] = value;
        startValueIdx = idx + 1;
      }
      ++idx;
    }
    result.push(obj);
  }
  return JSON.stringify(result);
}
//Retrieves the location info stored in sites.csv and returns as a JSON array
/*Future: Could generalize, if other files are needed (e.g., user customer sites)*/
async function getSites(fileURL){
  let response = await fetch(fileURL);
  let data = await response.text();
  let jdata = csvToJsonArray(data);
  console.log(jdata)
  return jdata
}

//Populate the dropdown selector from a helper CSV file
const fileSites = new File('sites.csv')
const sitesURL = URL.createObjectURL(fileSites)
//Now fetch that file
getSites(sitesURL)
  .then(Sites => JSON.parse(Sites))
  .then(aSites => makeSelectFromJson(aSites,"ChooseSites"))
  .catch(error => console.error(error));

//Populate the SELECT dropdown from a JSON array
function makeSelectFromJson(jsonArray, selectId){
  var dropdown = document.createElement("select");
  dropdown.id = selectId
  jsonArray.forEach(elem => {
    console.log(elem)
    var opt = document.createElement("option");
    opt.textContent = elem.Site + " - " + elem.Pad;
    opt.value = JSON.stringify({lat: elem.Latitude, lng: elem.Longitude})
    dropdown.appendChild(opt);
  });
  var divContainer = document.getElementById("SiteSelector2");
  //divContainer.innerHTML = "";
  divContainer.appendChild(dropdown);
  dropdown.onchange = SiteToForm(this);
}

function displayValue(){
  document.getElementById("LatLng2").innerText = document.getElementById("ChooseSites").value;
}
