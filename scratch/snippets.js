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