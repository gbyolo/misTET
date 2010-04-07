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

/** Blog **/

misTET.modules.blog = {

	version: "0.0.1",
	name: "blog",
	root: "/modules/blog/",
	file: { },
	total: "",
	
	initialize: function () {
		
		misTET.modules.blog.location = document.location.hash;		
		misTET.modules.blog.initXML();
		var args = misTET.other.parseGET();
		
		if (isset(misTET.intval)) {
			clearInterval(misTET.intval);
		}
		
		if (/#blog/.match(misTET.modules.blog.location)) {
			if (isset(args['id'])) {
				misTET.modules.blog.display(args['id']);
			} else {
				misTET.modules.blog.display();
			}
		}
		
		misTET.other.insertCSS(misTET.modules.blog.root + "resources/blog.css");
		misTET.modules.blog.intval = window.setInterval(misTET.modules.blog.refresh, 100);
	},
	
	refresh: function () {
		
		if (misTET.modules.blog.location != document.location.hash) {
		
			misTET.modules.blog.location = document.location.hash;
			var loc = misTET.modules.blog.location;
			var args = misTET.other.parseGET();
			
			if (/#blog/i.match(loc)) {
				if (/admin/.match(loc)) {
					misTET.modules.blog.admin();
				}
				if (!isset(args['id'])) {
					misTET.modules.blog.display();
				} else if (isset(args['id']) ) {
					misTET.modules.blog.display(args['id']);
				} else {
					misTET.refresh();
				}
			}
		}
	},
	
	initXML: function () {
		var path = misTET.modules.blog.root + "resources/blog.xml";
		var test = false;
		var error = false;
				
		new Ajax.Request(path, {
			method: "get",
			asynchronous: false,
       	   	evalJS: false,
                
            onSuccess: function (http) {
				if (test = misTET.other.XMLtest(http.responseXML)) {
					misTET.modules.blog.file = http.responseXML;
					misTET.modules.blog.total = parseInt(misTET.modules.blog.file.documentElement.getAttribute('n'));
				} else {
					misTET.error(test);
				}
            },
                
            onFailure: function (http) {
            	misTET.error("Error while loading blog.xml (#{error})".interpolate({ error: http.status }));
            }
		});
        if (error) {
			$('sd_left').innerHTML += error;
		}
	},
	
	getPost: function (id) {
		
		var XML = misTET.modules.blog.file.documentElement;
		var posts = XML.getElementsByTagName('post');
		var output = { };
		
		if (posts.length == 0) {
			output = null;
		} else {
			for (var i = 0; i < posts.length; i++) {
				if (posts[i].getAttribute('id') == id) {
					var list = posts[i].childNodes;
					output.author = posts[i].getAttribute('author');
					output.title = posts[i].getAttribute('title');
					output.date = posts[i].getAttribute('date');
					for (var j = 0; j < list.length; j++) {
						if (list[j].nodeName == "#cdata-section") {
							output.text = list[j].nodeValue;
						}
					}
				}
			}
		}
		return output;
	},
	
	display: function (id) {
		if (id) {
			var post = misTET.modules.blog.getPost(id);
			var output = "<div class = 'post'><div class = 'title'>"+ post.title + "</div>" + post.text + "<div class = 'foot'>"+
					 	"Posted by <span class = 'author'>" + post.author + "</span> on <span class = 'date'>" + post.date + "</span></div>";
			$('sd_left').innerHTML = output;
		} else {
			for (var j = misTET.modules.blog.total; j > 0; j--) {
				$('sd_left').innerHTML = "";
				var currentPost = misTET.modules.blog.getPost(j);
				var output = "<div class = 'post'><div class = 'title'>"+ currentPost.title + "</div>" + currentPost.text + "<div class = 'foot'>"+
					 		 "Posted by <span class = 'author'>" + currentPost.author + "</span> on <span class = 'date'>" + currentPost.date + "</span></div>";
				$('sd_left').innerHTML += output;
			}
		}
	},
	
	admin: function () {
		/** This has to be implemented */
	}
	
}
