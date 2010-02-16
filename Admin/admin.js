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
/* TODO lots of things */

misTET.Admin = {
		versione: "0.0.1",
		
		/* md5 della password, usa: Admin/admin.php?crypt&string=password */
		passHash: "35623e2fb12281ddb6d7d5f63c5a29e3",
		
		login: function() {
			if ( /true/.match(misTET.altro.importa("/Admin/admin.php?login&password=" +encodeURIComponent(misTET.Admin.passHash))) ) {
				return true;
			} else {
				return false;
			}
		},
		
		logged: function () {
			if ( /true/.match(misTET.altro.importa("/Admin/admin.php?connected")) ) {
				return true;
			} else {
				return false;
			}
		},
		
		logout: function () {
			if ( /true/.match(misTET.altro.importa("/Admin/admin.php?logout")) ) {
				return true;
			} else {
				return false;
			}
		},
		
		load: function () {
			divPagina = $('pagina');
			var content = "";
			
			/* Login */
			if ( misTET.Admin.login() ) {
				divPagina.innerHTML = "Admin Control Panel<br><a href = '#admin' onClick = 'misTET.Admin.editMenu();'>Edita Menu</a><br>"+
                                                      "<a href = '#admin' onClick = 'misTET.Admin.editPagina();'>Edita pagina</a><br>";
                		divPagina.innerHTML += "<br><br><a href = '#' onClick = 'misTET.Admin.logout();'>Logout</a>";
            		} else {
            			divPagina.innerHTML = "Login failed, control your password";
            		}
				
		},
		editMenu: function () {
			divPagina = $('pagina');
			divPagina.innerHTML = "Login...";
			if ( misTET.Admin.logged() ) {
				var file = misTET.altro.importa('/res/files/menu.xml');
				divPagina.innerHTML = "<form name = 'vocenuova' method = 'POST' action = '/Admin/main.php'>" +
                                  	  "<textarea name = 'newMenu' rows = '20' cols = '75'>"+file+"</textarea>" +
                                  	  "<input type = 'submit' value = 'submit'></input>";
            		} else {
            			divPagina.innerHTML = "Connessione...";
            			if ( misTET.Admin.login() ) {
            			misTET.Admin.editMenu();
            			} else {
            				divPagina.innerHTML = "Impossibile effettuare il login, controlla i dati";
            			}
            		}
		}
			
}
