/****************************************************************************
 * Copyright (C) <2010>  <lostpassword>                                     *
 * [http://lostpassword.hellospace.net | gdb.lost@gmail.com]                *
 *                                                                          *
 *                                                                          *
 * misTET is free software: you can redistribute it and/or modify           *
 * it under the terms of the GNU General Public License as published by     *
 * the Free Software Foundation, either version 3 of the License, or        *
 * (at your option) any later version.                                      *
 *                                                                          *
 * misTET is distributed in the hope that it will be useful,                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU General Public License for more details.                             *
 *                                                                          *
 * You should have received a copy of the GNU General Public License        *
 * along with misTET.  If not, see <http://www.gnu.org/licenses/>.          *
 ****************************************************************************/

/** Admin panel script **/

misTET.modules.admin = {
	
	version: "0.0.2",
	name: "admin",
	dir: "/modules/admin",
	
	initialize: function () {
		misTET.modules.admin.location = document.location.hash;
		
		if (/#admin/.match(misTET.modules.admin.location)) {
			var divPagina = $('sd_left');
			if (misTET.modules.admin.logged()) {
				divPagina.innerHTML = 	"Admin Control Panel<br><a href = '#admin' onClick = 'misTET.modules.admin.editMenu();'>Edit menu.xml</a><br>"+
										"<a href = '#admin' onClick = 'misTET.modules.admin.editPagine();'>Edit pages.xml</a><br>";
                divPagina.innerHTML += 	"<a href = '#' onClick = 'misTET.modules.admin.logout();'>Logout</a>";
			} else {
				divPagina.innerHTML =	"Login: <br><form action = '"+misTET.modules.admin.dir+"/admin.php?login' method = 'POST'>" +
										"<Password: <input name = 'password' type = 'text'><br>" +	
										"<input type = 'submit' value = 'submit'></form>";
			}
		}
		
		if (isset(misTET.intva)) {
			clearInterval(misTET.intval);
		}
		misTET.modules.admin.intVal = window.setInterval(misTET.modules.admin.refresh, 100);
		
	},
	
	refresh: function () {
		if (misTET.modules.admin.location != document.location.hash) {
			misTET.modules.admin.location = document.location.hash;
			
			if (/#admin/.match(misTET.modules.admin.location)) {
				var divPagina = $('sd_left');
				if (misTET.modules.admin.logged()) {
					divPagina.innerHTML = 	"Admin Control Panel<br><a href = '#admin' onClick = 'misTET.modules.admin.editMenu();'>Edit menu.xml</a><br>"+
											"<a href = '#admin' onClick = 'misTET.modules.admin.editPagine();'>Edit pages.xml</a><br>";
                	divPagina.innerHTML += 	"<a href = '#' onClick = 'misTET.modules.admin.logout();'>Logout</a>";
				} else {
					divPagina.innerHTML =	"Login: <br><form action = '"+misTET.modules.admin.dir+"/admin.php?login' method = 'POST'>" +
											"<Password: <input name = 'password' type = 'text'><br>" +	
											"<input type = 'submit' value = 'submit'></form>";
				}
			} else {
				misTET.refresh();
			}
		}
	},
	
	checkPHP: function (path) {
		var error = false;
		var result = "";
		
		new Ajax.Request(path, {
			method: "get",
			asynchronous: false,
			evalJS: false,
			
			onSuccess: function (http) {
				result = http.responseText;
				if ( /true/.match(result) ) {
					result = true;
				} else {
					result = false;
				}
			},
			
			onFailure: function (http) {
				error 			= new Error("Error while receiving file. #{status}".interpolate(http));
				error.name 		= "receiveError";
				error.fileName  = path;
			}
		});
		
		if (error) {
			return error;
		} else {
			return result;
		}
	},
	
	logged: function () {
		if ( misTET.modules.admin.checkPHP(misTET.modules.admin.dir+"/admin.php?connected") ) {
			return true;
		} else {
			return false;
		}
	},
		
	logout: function () {
		if ( misTET.modules.admin.checkPHP(misTET.modules.admin.dir+"/admin.php?logout") )  {
			location.href = "#";
		} else {
			return false;
		}
	},
	editMenu: function () {
		divPagina = $('sd_left');
		divPagina.innerHTML = "Login...";
		if ( misTET.modules.admin.logged() ) {
			var file = misTET.other.encorp('/res/files/menu.xml');
			divPagina.innerHTML = 	"<form action = '"+misTET.modules.admin.dir+"/edit.php?menu&file=/res/files/menu.xml' method = 'POST'>" +
                                  		"<textarea name = 'newMenu' rows = '20' cols = '65'>"+file+"</textarea>" +
                                  		"<input type = 'submit' value = 'submit'></input>";
            	} else {
            		divPagina.innerHTML = "Loading...";
            		misTET.modules.admin.initialize();
           	 }
	},
	editPagine: function () {		
		divPagina = $('sd_left');
		divPagina.innerHTML = "Login...";
		if ( misTET.modules.admin.logged() ) {
			var file = misTET.other.encorp('/res/files/pagine.xml');
			divPagina.innerHTML = 	"<form action = '"+misTET.modules.admin.dir+"/edit.php?pages&file=/res/files/pagine.xml' method = 'POST'>" +
                                  		"<textarea name = 'newPage' rows = '20' cols = '65'>"+file+"</textarea>" +
                                  		"<input type = 'submit' value = 'submit'></input>";
        	} else {
        		divPagina.innerHTML = "Loading...";
            		misTET.modules.admin.initialize();
        	}
	}
}
