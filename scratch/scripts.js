//scripts.js

function csvToJson(csv) {
  //Converts csv string to Json (ARRAY) string; accepts quoted values  
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].replace(/(\r\n|\n|\r)/gm, "").split(",");

  for(var i=1; i<lines.length; i++) {
    var obj = {};
    var row = lines[i],
      queryIdx = 0,
      startValueIdx = 0,
      idx = 0;

    if (row.trim() === '') { continue; }

    while (idx < row.length) {
      /* if we meet a double quote we skip until the next one */
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

async function getSites(){
  let response = await fetch('./sites.csv');
  let data = await response.text();
  let jdata = csvToJson(data);
  console.log(jdata)
  return jdata
}
getSites()
  .then(Sites => JSON.parse(Sites))
  //.then(aSites => jsonToTable(aSites,"data1"))
  .then(aSites => makeSelectFromJson(aSites,"ChooseSites"))
  .catch(error => console.error(error));

function jsonToTable(jsonArray, divtag="data")   {
    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0 in jsonArray) {
        for (var key in jsonArray[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = table.insertRow(-1);                   // TABLE ROW.
    for (var i = 0 in col) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0 in jsonArray) {
        tr = table.insertRow(-1);
        for (var j in col) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = jsonArray[i][col[j]];
        }
    }
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById(divtag);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  }

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
  var divContainer = document.getElementById("Select1");
  //divContainer.innerHTML = "";
  divContainer.appendChild(dropdown);
  dropdown.onchange = displayValue();
  }

  function displayValue(){
    document.getElementById("chosen").innerText = document.getElementById("ChooseSites").value;
  }
