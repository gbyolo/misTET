/****************************************************************************
 * Copyleft lostpassword                                                    *
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

/* Admin panel script */

var admin = Class.create();

admin.prototype = {
	
	versione: "0.0.2",
	
	dir: "/modules/admin",
	
	initialize: function () {
		divPagina = $('pagina');
		if (this.logged()) {
			divPagina.innerHTML = 	"Admin Control Panel<br><a href = '#admin' onClick = 'misTET.Admin.editMenu();'>Edita Menu</a><br>"+
						"<a href = '#admin' onClick = 'misTET.Admin.editPagine();'>Edita Pagine</a><br>";
                	divPagina.innerHTML += 	"<a href = '#' onClick = 'misTET.Admin.logout();'>Logout</a>";
		} else {
			divPagina.innerHTML =	"Login: <br><form action = '"+this.dir+"/admin.php?login' method = 'POST'>" +
						"<Password: <input name = 'password' type = 'text'><br>" +	
						"<input type = 'submit' value = 'submit'></form>";
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
				error 			= new Error("Impossibile ricevere il file #{status}".interpolate(http));
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
		if ( this.checkPHP(this.dir+"/admin.php?connected") ) {
			return true;
		} else {
			return false;
		}
		},
		
	logout: function () {
		if ( this.checkPHP(this.dir+"/admin.php?logout") )  {
			location.reload();
		} else {
			return false;
		}
	},
	editMenu: function () {
		divPagina = $('pagina');
		divPagina.innerHTML = "Login...";
		if ( misTET.Admin.logged() ) {
			var file = misTET.altro.importa('/res/files/menu.xml');
			divPagina.innerHTML = 	"<form action = '"+this.dir+"/edit.php?menu&file=/res/files/menu.xml' method = 'POST'>" +
                                  		"<textarea name = 'newMenu' rows = '20' cols = '75'>"+file+"</textarea>" +
                                  		"<input type = 'submit' value = 'submit'></input>";
            	} else {
            		divPagina.innerHTML = "Connessione...";
            		this.initialize();
           	 }
	},
	editPagine: function () {		
		divPagina = $('pagina');
		divPagina.innerHTML = "Login...";
		if ( misTET.Admin.logged() ) {
			var file = misTET.altro.importa('/res/files/pagine.xml');
			divPagina.innerHTML = 	"<form action = '"+this.dir+"/edit.php?pagine&file=/res/files/pagine.xml' method = 'POST'>" +
                                  		"<textarea name = 'newPage' rows = '20' cols = '75'>"+file+"</textarea>" +
                                  		"<input type = 'submit' value = 'submit'></input>";
        	} else {
        		divPagina.innerHTML = "Connessione...";
            		this.initialize();
        	}
	}
};

misTET.Admin = new admin();
