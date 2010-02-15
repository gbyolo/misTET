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
		
		load: function () {
			divPagina = $('pagina');
			divPagina.innerHTML = "Admin Control Panel<br><a href = '#admin' onClick = 'misTET.Admin.editMenu();'>Edita Menu</a><br>"+
                                  "<a href = '#admin' onClick = 'misTET.Admin.editPagina();'>Edita pagina</a><br>";
		},
		editMenu: function () {
			divPagina = $('pagina');
			var file = misTET.altro.importa('/res/files/menu.xml');
			if (!document.vocenuova) {
				divPagina.innerHTML = "<form name = 'vocenuova' method = 'POST'>" +
                                      "<textarea name = 'newMenu' rows = '20' cols = '75'>"+file+"</textarea>" +
                                      "<input type = 'button' value = 'Submit' onClick = 'misTET.Admin.editMenu();'>";
			} else {
				newFile = document.vocenuova.newMenu;
				divPagina.innerHTML = "Editing...";
				/* Here something go change menu.xml content */
                // misTET.init();
			}
		}
			
}
