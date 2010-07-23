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

misTET.res.create("blog", {
			file: { },
			total: ""
		});

misTET.resources.modules.create("blog", {

	version: ["0", "2", "0"].join("."),
	
	initialize: function () {

		/* loading js and css files */
		misTET.utils.insertCSS(this.root + "/resources/blog.css");
		var path = this.root + "/resources/blog.xml";
		var test = false;
		var error = false;
				
		new Ajax.Request(path, {
			method: "get",
			asynchronous: false,
       	   	evalJS: false,
                
            onSuccess: function (http) {
				misTET.res['blog'].file = http.responseXML;
				misTET.res['blog'].total = parseInt(misTET.res.blog.file.documentElement.getAttribute('n'));
            },
                
           	 onFailure: function (http) {
            	misTET.error({
            		message: "Error while loading blog.xml (#{error})".interpolate({ error: http.status }), 
            		name: "blog error"
            	});
            }
		});
		
	},
	
	execute: function () {
		
		var queries = misTET.utils.getQueries(location.hash);
		
		if (/admin/.match(location.hash)) {
			location.href = this.root + "/admin";
		}
		
		if (Object.isset(queries.id)) {
			this.display(queries.id);
		} else {
			this.display();
		}

	},

		
	getPost: function (id) {
		
		var XML = misTET.res['blog'].file.documentElement;
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
			
	checkPost: function (map) {
		var result = true;
		['title', 'text', 'author', 'date'].each(function(obj) {
			if (typeof(map[obj]) == "undefined") {
				result = false;
			}
		});
		return result;
	},
	
	display: function (id) {
		if (id) {
			var post = this.getPost(id);
			if (this.checkPost(post)) {
				var output = "<div class = 'post'><div class = 'title'>"+ post.title + "</div>" + post.text + "<div class = 'foot'>"+
			 				"Posted by <span class = 'author'>" + post.author + "</span> on <span class = 'date'>" + post.date + "</span></div>";
				$('sd_left').innerHTML = output;
			} else {
				$('sd_left').innerHTML = "<p id = 'error'>The selected post doesn\'t exist</p>";
			}
		} else {
			$('sd_left').innerHTML = "";
			for (var j = misTET.res['blog'].total; j > 0; j--) {
				var currentPost = this.getPost(""+j+"");
				if (this.checkPost(currentPost)) {
					var output = "<div class = 'post'><div class = 'title'>"+ currentPost.title + "</div>" + currentPost.text + "<div class = 'foot'>"+
				 	 			"Posted by <span class = 'author'>" + currentPost.author + "</span> on <span class = 'date'>" + currentPost.date + "</span></div>";
					$('sd_left').innerHTML += output;
				}
			}
		}
	}
	
});
