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
	
	version: "0.2.4",
	name: "admin",
	dir: "/modules/admin/",
	
	initialize: function () {
		
		if (/#admin/.match(document.location.href)) {
			location.href = misTET.modules.admin.dir;
		}
		
		misTET.modules.admin.intval = new PeriodicalExecuter(misTET.modules.admin.refresh, 1);
		
	},
	
	refresh: function () {
		
		if (/#admin/.match(document.location.hash)) {
			location.href = "/modules/admin/";
		}
	}
}
