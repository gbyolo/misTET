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

misTET.res.create("hl", { });

misTET.module.create("SyntaxHighlighter", {

	initialize: function () {
		misTET.res.get("hl").loadXML(this.root + "/resources/config.xml");

		misTET.utils.insertCSS(this.root + "/styles/#{style}.css".interpolate({
			style : misTET.res.get("hl").config["style"]
		}));
		misTET.utils.include(this.root + "/system/highlight.pack.js");

		Event.observe(document, ":change", function () {
			misTET.module.run("SyntaxHighlighter", []);
		});

	},

	execute: function () {

		var tag = misTET.res.get("hl").config["tag"]
  		var pres = document.getElementsByTagName(tag);

		for (var i = 0; i < pres.length; i++) {
			hljs.highlightBlock(pres[i], hljs.tabReplace);
		}

	}

});
