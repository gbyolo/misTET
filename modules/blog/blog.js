/****************************************************************************
 * Copyleft lostpassword                                                    *
 * [gdb.lost@gmail.com]                                                     *
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

misTET.modules.create("blog", {

    version: ["0", "3", "0"].join("."),
    
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
                misTET.res['blog'].file = http.responseXML;
                misTET.res['blog'].total = parseInt(misTET.res.blog.file.documentElement.getAttribute('n'));
            },
                
            onFailure: function (http) {
                misTET.errors.create({
                    message: "Error while loading blog.xml (#{error})".interpolate({ error: http.status }), 
                    name: "blog error"
                });
            }
        });
                
    },
        
    execute: function (args) {
            
        if (!Object.isset(args)) {
            return false;
        }
                
        if (Object.isset(args['id'])) {
            if (args['del']) {
                                
                new Ajax.Request(this.root + "/system/blog.php?id=#{id}&del".interpolate({id: args['id']}), {
                    method: "get",
                                        
                    onSuccess: function (http) {
                        $('page').update(http.responseText);
                    },
                                        
                    onFailure: function (http) {
                        misTET.errors.create({message: http.responseText})
                    }
                });
                                
            } else if (args['edit']) {
                        
                if (args['action']) {
                    var data = { title: args['title'], author: args['author'], text: args['text'] };
                    new Ajax.Request(this.root + "/system/blog.php?id=#{id}&edit&".interpolate({id: args['id']}), {
                                                
                        method: "post",                        
                        parameters: data,
                                                
                        onSuccess: function (http) {
                            $('page').update(http.responseText);
                        },
                                                
                        onFailure: function (http) {
                            misTET.errors.create({message: http.responseText})
                        }
                                                
                    });
                } else {
                    new Ajax.Request(this.root + "/system/blog.php?id=#{id}&edit".interpolate({id: args['id']}), {                                        
                        method: "get",
                                                
                        onSuccess: function (http) {
                            $('page').update(http.responseText);
                        },
                                                
                        onFailure: function (http) {
                            misTET.errors.create({message: http.responseText})
                        }
                    });
                }
                                 
            } else {
                this.display(args['id']);
            }
        }
        else if (Object.isset(args['post'])) {
            var result = misTET.modules.security.execute({connected: 1});
            if (!result) {
                misTET.errors.create({ message: "you're doing it wrong baby" });
                return false;
            }
            else {
                if (args['action']) {
                    var data = { title: args['title'], author: args['author'], text: args['text'] };
                    new Ajax.Request(this.root + "/system/blog.php?new&", {
                        method: "post",
                        parameters: data,
                                                
                        onSuccess: function (http) {
                            $('page').update(http.responseText);
                        },
                                                
                        onFailure: function (http) {
                            misTET.errors.create({message: http.responseText})
                        }
                    });
                } else {
                    new Ajax.Request(this.root + "/system/blog.php?new", {
                        method: "get",
                                        
                        onSuccess: function (http) {
                            $('page').update(http.responseText);
                        },
                                                
                        onFailure: function (http) {
                            misTET.errors.create({message: http.responseText})
                        }
                    });
                }
            }
        } 
        else if (args['show']) {
                
            new Ajax.Request(this.root + "/system/blog.php?show", {
                method: "get",
                                
                onSuccess: function (http) {
                    $('page').update(http.responseText);
                },
                                
                onFailure: function (http) {
                    misTET.errors.create({message: http.responseText})
                }
            });
                
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
                var output =    "<div class = 'post'><div class = 'title'>"+ post.title + "</div>" + post.text + "<div class = 'foot'>"+
                                     "Posted by <span class = 'author'>" + post.author + "</span> on <span class = 'date'>" + post.date + "</span></div>";
                $('page').innerHTML = output;
            } else {
                $('page').innerHTML = "<p id = 'error'>The selected post doesn\'t exist</p>";
            }
        } else {
            $('page').innerHTML = "";
            for (var j = misTET.res['blog'].total; j > 0; j--) {
                var currentPost = this.getPost(""+j+"");
                if (this.checkPost(currentPost)) {
                    var output = "<div class = 'post'><div class = 'title'>"+ currentPost.title + "</div>" + currentPost.text + "<div class = 'foot'>"+
                                        "Posted by <span class = 'author'>" + currentPost.author + "</span> on <span class = 'date'>" + currentPost.date + "</span></div>";
                    $('page').innerHTML += output;
                }
            }
        }
    }
        
});
