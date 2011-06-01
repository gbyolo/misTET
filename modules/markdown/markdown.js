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

misTET.modules.create("markdown", {

	initialize: function () {

		misTET.utils.include(this.root + "/system/showdown.js");
		misTET.res.loadXML("markdown", this.root + "/resources/config.xml");

		misTET.utils.insertCSS(this.root + "/system/styles/#{style}.css".interpolate({
			style : misTET.res["markdown"].config["highlighter"]
		}));

		if (!Object.isset(misTET.res["markdown"].config["class"])) {
			misTET.res["markdown"].config["class"] = "markdown"
		}

		misTET.res["markdown"].converter = new Showdown.converter;
		misTET.utils.include(this.root + "/system/highlight.pack.js");

		Event.observe(document, ":change", function () {
			misTET.modules.run("markdown", []);
		});

	},

	execute: function () {

		tags = $$(".#{what}".interpolate({what: misTET.res["markdown"]["config"]["class"]}));
		tags.each(function (tag) {
			var what = tag.innerHTML.strip();
			var text = misTET.res.markdown.converter.makeHtml(what);
			tag.update(text);
		});
		
		hljs.tabReplace = '    ';
  		var pres = document.getElementsByTagName("pre");
		for (var i = 0; i < pres.length; i++) {
			hljs.highlightBlock(pres[i], hljs.tabReplace);
		}
	}

});
