//scripts.js

function csvToJson(csv) {
  //Converts csv string to Json string; accepts quoted values  
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");

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
  return result;
  
  /* return result; //JavaScript object */
  /* return JSON.stringify(result); //JSON */
}

/* async function fetchLocal(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest
    xhr.onload = function() {
      resolve(new Response(xhr.responseText, {status: xhr.status}))
    }
    xhr.onerror = function() {
      reject(new TypeError('Local request failed'))
    }
    xhr.open('GET', url)
    xhr.send(null)
  })
} */
/* csvstring = fetchLocal('./sites.csv')
console.log(csvstring) */
async function getSites(){
  let response = await fetch('./sites.csv');
  let data = await response.text();
  //catch(error => console.error(error));
  console.log(data)
  return data
}
let Sites = getSites();
document.getElementById("data1").innerText = Sites;