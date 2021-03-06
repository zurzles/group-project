var pageURL = window.location.href;
var flipNumber = pageURL[pageURL.indexOf("flip") + 4];
var shortURL = pageURL.substring(pageURL.indexOf(".edu") + 5);
var portNumber = shortURL.substring(0, shortURL.indexOf("\/"));

//var url = location.href;
var idTransform = pageURL.substring(pageURL.lastIndexOf('=') + 1);
var ID = parseInt(idTransform);

var gameReq = new XMLHttpRequest();
var gameItem;

gameReq.addEventListener("load", function(data){
	gameItem = JSON.parse(this.responseText)[0];
	//document.getElementById('gameId').value = gameItem.game_id;
	if(gameItem.sport_type == "Football"){
		document.getElementById("sport_image").src = "images/football.jpg";
	}
	else if(gameItem.sport_type == "Soccer"){
		document.getElementById("sport_image").src = "images/soccer.jpg";
	}
	else{
		document.getElementById("sport_image").src = "images/placeholder.jpg";
	}

	document.getElementById("start_date").value = gameItem.start_date.toString().substring(0, 10);
	document.getElementById("start_time").value = gameItem.start_time;

	document.getElementById("host_user").innerHTML = gameItem.host_user;

	document.getElementById("game_location").innerHTML = gameItem.location_name;

	var userReq = new XMLHttpRequest();
	userReq.addEventListener("load", function(data){
		userItem = JSON.parse(this.responseText)[0];
		document.getElementById("host_user").innerHTML = userItem.user_name;
	});


	userReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/user_by_id/" + gameItem.host_user, true);
	userReq.send();

	
	var usersGameReq = new XMLHttpRequest();
	usersGameReq.addEventListener("load", function(data){
		usersGameItem = JSON.parse(this.responseText);
		for(var i = 0; i < usersGameItem.length; i++){
			var userList = document.getElementById("users_list"); //usersGameItem[i].Names;
			var userListItem = document.createElement("li");
			userListItem.appendChild(document.createTextNode(usersGameItem[i].Names));
			userList.appendChild(userListItem);
			
		}
		console.log(usersGameItem);
	});


	usersGameReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/users_in_game/" + gameItem.game_id, true);
	usersGameReq.send();

});

gameReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/game_by_id/" + ID, true);
gameReq.send();


/*var userReq = new XMLHttpRequest();
userReq.addEventListener("load", function(data){
	userItem = JSON.parse(this.responseText)[0];
	document.getElementById("host_user").innerHTML = userItem.user_id;
});


userReq.open('GET', "http://flip" + flipNumber + ".engr.oregonstate.edu:" + portNumber +"/user_by_id/" + gameItem.host_user, true);
userReq.send();*/



