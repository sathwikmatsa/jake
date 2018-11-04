var inputText = window.getSelection().toString();
var url = window.location.href;
var element = window.getSelection().anchorNode.parentNode;


var so_url_template = "https://stackoverflow.com/search?q=";

function getData(url, callback) {
  // to overcome CORS, third party website is used to scrape raw document
// use jquery to fetch the document
  $.get('https://allorigins.me/get?method=raw&url=' + encodeURIComponent(url) + '&callback=?', function(data) {
      // data is the raw html dump
      callback(data);
  });
}

// this function converts the Xpath object into a list and returns it
function xpath(xpath_string, dom) {
  var result = [];
  var nodes_snapshot = document.evaluate(xpath_string, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  // document.evaluate is used to select the elements based on xpath
  // note that the second argument to evaluate is <dom>, which essentially indicates that xpath selection is to be performed within <dom> and not the current document.
  for (var i = 0; i < nodes_snapshot.snapshotLength; i++) {
      result.push(nodes_snapshot.snapshotItem(i));
  }
  return result;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function filterSO(data, node) {
  var dom = createElementFromHTML(data);

  var data = xpath("//div[contains(@class,'summary')]/div/h3", dom);
  display(data, node);
}

function searchStackOverflow(search_text, node) {

  var so_url = so_url_template + search_text;

  getData(so_url, function(data) {
      // Again, asynchronous call as given above.
      filterSO(data, node);
  });
}

function display(data, node) {
    var container = document.createElement('div');
    var heading = document.createElement('p');
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    for (var i = 0; i < data.slice(0,10).length; i++) {
      var row = document.createElement("tr");
      var cell = document.createElement('td');
      var example = document.createElement('a');
      example.href = "https://stackoverflow.com"+data[i].getElementsByClassName("question-hyperlink")[0].getAttribute("href");
      example.textContent = data[i].innerText
      cell.appendChild(example);
      row.appendChild(cell);
      tableBody.appendChild(row);
    }
    heading.innerHTML = "<strong>Code Examples</strong>: (" + data.slice(1,10).length.toString() + " found)";
    table.appendChild(tableBody);
    container.appendChild(heading);
    container.appendChild(table);
    container.style.border = '2px solid #dedede';
    container.style.margin = '2px';
    container.style.padding = '5px';
    container.style.color = '#333';
    node.parentNode.insertBefore(container, node.nextSibling);
}

searchStackOverflow(inputText, element);
alert("Success!");