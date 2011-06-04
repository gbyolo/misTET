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

/** Blog **/

misTET.res.create("blog", {
    file: {},
    total: ""
});

misTET.module.create("blog", {

    version: ["0", "4", "0"].join("."),
    
    needs: ["security"],
        
    initialize: function () {

        misTET.utils.insertCSS(this.root + "/resources/blog.css");
        var path = this.root + "/resources/blog.xml";
        var test = false;
        var error = false;
                                
        new Ajax.Request(path, {
            method: "get",
            asynchronous: false,
            evalJS: false,
                
            onSuccess: function (http) {
                misTET.res.get("blog").file = http.responseXML;
                misTET.res.get("blog").total = parseInt(misTET.res.get("blog").file.documentElement.getAttribute("n"));
                misTET.res.get("blog").author = misTET.res.get("blog").file.documentElement.getAttribute("author") || "";
            },
                
            onFailure: function (http) {
                misTET.errors.create({
                    message: "Error while loading blog.xml (#{error})".interpolate({ error: http.status }), 
                    name: "blog error"
                });
            }
        });
        /* this is useless 
        this.updateRss();
        */
    },
        
    execute: function (args) {
            
        if (!Object.isset(args)) {
            return false;
        }
                
        if (Object.isset(args["id"])) {
            if (args["del"]) {
                    
                if (args["action"]) {
                               
                    var data = { token: args["token"] };
                        new Ajax.Request(this.root + "/system/blog.php?id=#{id}&del".interpolate({id: args["id"]}), {
                            method: "post",
                            parameters: data,
                                        
                            onSuccess: function (http) {
                                $("page").update(http.responseText);
                            },
                                        
                            onFailure: function (http) {
                                misTET.errors.create({message: http.responseText});
                            }
                        });
                        
                    this.updateRss();
                        
                } else {
                        
                    new Ajax.Request(this.root + "/system/blog.php?id=#{id}&del".interpolate({id: args["id"]}), {
                        method: "get",
                                
                        onSuccess: function (http) {
                            $("page").update(http.responseText);
                        },
                                
                        onFailure: function (http) {
                            misTET.errors.create(http.responseText);
                        }
                                
                    });
                        
                }
                                
            } else if (args["edit"]) {
                        
                if (args["action"]) {
                    var data = { title: args["title"], author: args["author"], text: args["text"], token: args["token"] };

                    new Ajax.Request(this.root + "/system/blog.php?id=#{id}&edit&".interpolate({id: args["id"]}), {                  
                        method: "post",                        
                        parameters: data,
                                                
                        onSuccess: function (http) {
                            $("page").update(http.responseText);
                        },
                                                
                        onFailure: function (http) {
                            misTET.errors.create({message: http.responseText});
                        }
                                                
                    });
                    
                    this.updateRss();
                    
                } else {
                    new Ajax.Request(this.root + "/system/blog.php?id=#{id}&edit".interpolate({id: args["id"]}), {                                        
                        method: "get",
                                                
                        onSuccess: function (http) {
                            $("page").update(http.responseText);
                        },
                                                
                        onFailure: function (http) {
                            misTET.errors.create({message: http.responseText});
                        }
                    });
                }
                                 
            } else {
                this.display(args["id"]);
            }
        }
        else if (Object.isset(args["post"])) {
            if (args["action"]) {
				
                if (!args["author"]) {
                    Object.extend(args["author"], misTET.res.get("blog").author);
                }
					
                var data = { title: args["title"], author: args["author"], text: args["text"], token: args["token"] };
                new Ajax.Request(this.root + "/system/blog.php?new&", {
                    method: "post",
                    parameters: data,
                                                
                    onSuccess: function (http) {
                        $("page").update(http.responseText);
                    },
                                                
                    onFailure: function (http) {
                        misTET.errors.create({message: http.responseText});
                    }
                });
                this.updateRss();
                    
            } else {
                new Ajax.Request(this.root + "/system/blog.php?new", {
                    method: "get",
                                        
                    onSuccess: function (http) {
                        $("page").update(http.responseText);
                    },
                                                
                    onFailure: function (http) {
                        misTET.errors.create({message: http.responseText});
                    }
                });
            }
        } 
        else if (args["show"]) {
                
            new Ajax.Request(this.root + "/system/blog.php?show", {
                method: "get",
                                
                onSuccess: function (http) {
                    $("page").update(http.responseText);
                },
                                
                onFailure: function (http) {
                    misTET.errors.create({message: http.responseText});
                }
            });
                
        } else {
            this.display();
        }
    },

                
    getPost: function (id) {
                
        var XML = misTET.res.get("blog").file.documentElement;
        var posts = XML.getElementsByTagName("post");
        var output = { };
                
        if (posts.length == 0) {
            output = null;

        } else {
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].getAttribute("id") == id) {

                    var list = posts[i].childNodes;
                    output.author = posts[i].getAttribute("author");
                    output.id = posts[i].getAttribute("id");
                    output.title = posts[i].getAttribute("title");
                    output.date = posts[i].getAttribute("date");

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

        ["title", "text", "author", "date"].each(function(obj) {
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
                var output = ("<div class = 'post'><div class = 'title'><a href='#module=#{blog}&id=#{id}'>#{title}</a></div>" +
                             "#{text}<div class = 'foot'>Posted by <span class = 'author'>#{author}</span> on <span class = 'date'>" +
                             "#{date}</span></div>").interpolate({
                                 blog: this.name,
                                 id: post.id,
                                 title: post.title,
                                 text: post.text,
                                 author: post.author,
                                 date: post.date });
                                 
                $("page").innerHTML = output;

            } else {
                $("page").innerHTML = "<p id = 'error'>The selected post doesn\'t exist</p>";
            }
        } else {

            $("page").innerHTML = "";
            for (var j = misTET.res.get("blog").total; j > 0; j--) {

                var currentPost = this.getPost(String(j));
                if (this.checkPost(currentPost)) {

                    var output = ("<div class = 'post'><div class = 'title'><a href='#module=#{blog}&id=#{id}'>#{title}</a></div>" +
                                  "#{text}<div class = 'foot'>Posted by <span class = 'author'>#{author}</span> on <span class = 'date'>" +
                                  "#{date}</span></div>").interpolate({
                                      blog: this.name,
                                      id: currentPost.id,
                                      title: currentPost.title,
                                      text: currentPost.text,
                                      author: currentPost.author,
                                      date: currentPost.date });

                    $("page").innerHTML += output;
                }
            }
        }
    },
    
    updateRss: function () {
        var feed = misTET.utils.execute(this.root + "/feed.js");
        var f = new feed({root: this.root});
        f.update(misTET.res.get("blog").file);
    }
        
});
