/**************************************************************************** 
 * Copyleft lostpassword                                                    * 
 * [gdb.lost@gmail.com]                                                     *
 *                                                                          *
 * This file is part of misTET.                                             *
 *                                                                          *
 * misTET is free software: you can redistribute it and/or modify           *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * misTET is distributed in the hope that it will be useful,                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with misTET.  If not, see <http://www.gnu.org/licenses/>.          *
 ****************************************************************************/

misTET.res.create("markdown", {});

misTET.module.create("markdown", {

	initialize: function () {

		misTET.File.include(this.root + "/system/showdown.js");
		misTET.res.get("markdown").loadXML(this.root + "/resources/config.xml");

		if (!Object.isset(misTET.res["markdown"].config["class"])) {
			misTET.res.get("markdown").config["class"] = "markdown"
		}

		misTET.res["markdown"].converter = new Showdown.converter;

		Event.observe(document, ":change", function () {
			misTET.module.run("markdown", []);
		});

	},

	execute: function () {

		tags = $$(".#{what}".interpolate({what: misTET.res.get("markdown")["config"]["class"]}));
		tags.each(function (tag) {
			var what = tag.innerHTML.strip();
			var text = misTET.res.get("markdown").converter.makeHtml(what);
			tag.update(text);
		});
	}

});
