var so_url_template = "https://stackoverflow.com/search?q=";

function getData(url, callback) {
  // to overcome CORS, third party website is used to scrape raw document
// use jquery to fetch the document
  $.get(url, function(data) {
      // data is the raw html dump
      callback(data);
  });
}

// this function retrieves elements using CSS selectors from the dom and returns an array
function css_selector(CSS_selector_string1, CSS_selector_string2, dom) {
  var data = [];
  var nodeList = dom.querySelectorAll(CSS_selector_string1);
  for(var i = 0; i<nodeList.length; i++){
    var element = nodeList[i].querySelector(CSS_selector_string2);
    if(element) data.push(element);
  }
  return data;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div;
}

function filterSO(data, node) {
  var dom = createElementFromHTML(data);
  var data = css_selector(".question-summary", ".question-hyperlink", dom);
  display(data, node);
}

function searchStackOverflow(search_text, node) {
  var so_url = so_url_template + search_text;

  getData(so_url, function(data) {
      // Again, asynchronous call as given above.
      filterSO(data, node);
  });
}

function getAnswer(evt){
    url = evt.currentTarget.url_link;
    node = evt.currentTarget;
	getData(url, function(data){
    var dom = createElementFromHTML(data);
		node.appendChild(dom.getElementsByClassName("post-text")[1]);
	});
}

function display(data, node) {
    var container = document.createElement('div');
    var heading = document.createElement('p');
    var table = document.createElement('table');
    table.className = "table table-bordered";
    table.style.width= "400px";
    var tableBody = document.createElement('tbody');
    var tableHead = document.createElement('thead');
    tableHead.innerHTML = "<tr> <th scope='col'>#</th> <th scope='col'>Title</th> </tr>";
    tableHead.className = "thead-dark";
    table.appendChild(tableHead);

    for (let i = 0; i < data.length; i++) {
      var row = document.createElement("tr");
      var cellId = document.createElement('td');
      cellId.innerText = i+1;
      var cell = document.createElement('td');
      var example = document.createElement('a');
      example.style.backgroundColor = "white";
      example.href = "https://stackoverflow.com"+data[i].getAttribute("href");
      example.textContent = data[i].innerText
      var dropButton = document.createElement('button')
      dropButton.type = "button";
      dropButton.id = i;
      dropButton.appendChild(example);
      dropButton.url_link = example.href;
      dropButton.addEventListener("click", getAnswer, false);
      cell.appendChild(dropButton);
      row.appendChild(cellId);
      row.appendChild(cell);
      tableBody.appendChild(row);
    }
    heading.innerHTML = "<strong>Code Examples</strong>: (" + data.length.toString() + " found)";
    table.appendChild(tableBody);
    container.appendChild(heading);
    container.appendChild(table);
    container.style.border = '2px solid #dedede';
    container.style.margin = '2px';
    container.style.padding = '5px';
    container.style.color = '#333';
    table.width = 400;
    node.innerHTML="";
    node.appendChild(container, node.nextSibling);
}

function setInputText(info){
	var divEle = document.getElementById("data");
	searchStackOverflow(info, divEle);
}

window.addEventListener('DOMContentLoaded', function(){
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs){
		chrome.tabs.sendMessage(
			tabs[0].id,
			{from: 'popup'},
			setInputText);
	});
});
