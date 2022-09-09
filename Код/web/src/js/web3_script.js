let adrressContractMain = newFunction();
const newLocal = "0x467FBcfA73D5A920D428716D2435fC30D172401f";
var adrressContractRopsten = newLocal;
var addressContractIOTA = "0xAfC8Bc679f8e8c34643b8C9786dE3A8d001E7eaC";

var contractController;
var day=["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
var room = ["Отель *","Отель**","Отель ***","Отель ****","Отель *****"];
var contract_allroom;
var wallet, signer, current_network;

function newFunction() {
    return "0x467FBcfA73D5A920D428716D2435fC30D172401f";
}

function save() {
    var readWallet = $('#readWallet').val();
    if (readWallet == "") readWallet=wallet;
    if(!ethers.utils.isAddress(readWallet)) {
       return alert("invalid address");
    }
    var addDay = $('#addDay').val();
    var addRoom = $('#addRoom').val();
    console.log("addDay", addDay);
    console.log("addRoom", addRoom);
    contractController.addReservation(addDay, addRoom,wallet, { value: ethers.utils.parseEther("0.0001") }).then((err, data) => {
        console.log("data", data);
    }).catch(function (error) {
        alert(error.message);
    });
}

function readUser() {
    var readWallet = $('#readWallet').val();
    if (readWallet == "") readWallet=wallet;
    if(!ethers.utils.isAddress(readWallet)) {
       return alert("invalid address");
    }
    $('#showResult').hide();
    contractController.getClientReservations(readWallet).then((data) => {
        console.log("data", data);
        var contract_day = Number(data._day)
        var contract_room = Number(data._room)
        contract_allroom = data._allroom;
        console.log("data._day", contract_day);
        console.log("data._room", contract_room);
        console.log("data._allroom", contract_allroom);
        $('#showResult').show();
        $('#showDay').html(contract_day);
        $('#showRoom').html(contract_room);
        $('#targetDay').html(day[contract_day]);
        $('#targetRoom').html(room[contract_room]);
        generate_table();
    }).catch(function (error) {
        alert(error.message);
    });
}

function startApp() {
    $('#showResult').hide();
    console.log("wallet", wallet);
    $('#wallet').html(wallet);
}

function clearusertable(){
    var readWallet = $('#readWallet').val();
    if (readWallet == "") readWallet=wallet;
    if(!ethers.utils.isAddress(readWallet)) {
       return alert("invalid address");
    }
    contractController.resetClientInfo(readWallet).then((data) => {
        console.log("data", data);
    }).catch(function (error) {
        alert(error.message);
    });
}

function clearalltable(){
    contractController.resetAll().then((data) => {
        console.log("data", data);
    }).catch(function (error) {
        alert(error.message);
    });
}

function getalltable(){
    contractController.getAllTable().then((data) => {
        console.log("data", data);
        contract_allroom = data;
        console.log("room", contract_allroom);
        generate_table();
    }).catch(function (error) {
        alert(error.message);
    });
}

function withdraw(){
    contractController.withdraw().then((data) => {
        console.log("data",data);
    }).catch(function (error) {
        alert(error.message);
    });
}
function getbalance(){
    contractController.getBalance().then((data) => {
        console.log("data",data);
        balance=data.toNumber();
        $('#balance').html(balance);
        console.log("balance",balance);
    }).catch(function (error) {
        alert(error.message);
    });
}
  

window.addEventListener('load', async function () {
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    signer = provider.getSigner();
    current_network = ethereum.networkVersion;
    console.log("current_network", current_network);

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    wallet = accounts[0];

    initContracts();
})

function initContracts() {
    var addressContractController = {
        "1": adrressContractMain,
        "3": adrressContractRopsten,
        "1074": addressContractIOTA
    }
    $.ajax({
        url: 'abi.json',
        dataType: 'json',
        success: function (data) {
            var abiContract = data;
            var contractAddress = addressContractController[current_network];
            contractController = new ethers.Contract(contractAddress, abiContract, signer);
            startApp();
        }
    });
}

////////////////TABLE////////////////
function generate_table() {
    let day=["Таблица","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
    // get the reference for the body
    var body = document.getElementById("tablearr");
    // creates a <table> element and a <tbody> element
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
    console.log(body.childNodes);
    if(body.hasChildNodes()==true){
        body.removeChild( body.childNodes[0] );
    }
  
    // creating all cells
      // creates a table row
      var row = document.createElement("tr");
  
      for (var j = 0; j < 8; j++) {
        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        var cell = document.createElement("td");
        var cellText = document.createTextNode(day[j]);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
  
      // add the row to the end of the table body
      tblBody.appendChild(row);

    for (var i = 0; i < 5; i++) {
        // creates a table row
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cellText = document.createTextNode(room[i]);
        cell.appendChild(cellText);
        row.appendChild(cell);
        for (var j = 0; j < 7; j++) {
          // Create a <td> element and a text node, make the text
          // node the contents of the <td>, and put the <td> at
          // the end of the table row
          var cell = document.createElement("td");
          var cellText = document.createTextNode(contract_allroom[i][j]);
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
    
        // add the row to the end of the table body
        tblBody.appendChild(row);
      }
  
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    body.append(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "2");
  }
