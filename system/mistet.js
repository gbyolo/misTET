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

var misTET = {
    
    version: ["0", "7", "2"].join("."),
    
    modFolder: "/modules",
    modules: { },
    extern: "/stat",
    root: location.href.match(/^(.*?)\/[^\/]*?(#|$)/)[1],
    loc: "system/mistet.js",
    
    /* start misTET */
    initialize: function () {
        
        if (misTET.initialized) {
                
            var error = new Error;
            error.name = "misTET.init";
            error.message = "misTET has been already initialized.";
            error.filename = "#{root}/#{loc}".interpolate(misTET);
                
            misTET.errors.create(error);
            return false;
        }
        
        misTET.location = location.hash;
        misTET.initialized = false;
    
        eval("misTET.init.load()");
        
        if (!Object.isset(misTET.config["home"])) {
            misTET.config["home"] = "home";
        }
        
        if (!Object.isset(misTET.config["title"])) {
            misTET.config["title"] = "misTET #{version}".interpolate(misTET);
        }
        
        if (!Object.isset(misTET.config["loading"])) {
            misTET.config["loading"] = "Loading...";
        }
        
        if (misTET.config["home"].charAt(0) == "#") {
            misTET.config["home"].slice(1, misTET.config["home"].length);
        }
        
        if (!document.title) {
            document.title = "#{config.title}".interpolate(misTET);
        }
                
        $("title").innerHTML = "<a href='#{root}'>#{config.title}</a>".interpolate(misTET);
        
        var ops = $("page");
        var args = misTET.utils.getQueries(location.hash);
        var menuOk = true, pagesOk = true;
        ops.innerHTML = misTET.config["loading"];
        
        try {
            misTET.menu.load();
        } catch (e) {
            misTET.errors.create(e);
            menuOk = false;
        }
        
        if (menuOk) {
            try {
                misTET.pages.load();
            } catch (e) {
                misTET.errors.create(e);
                pagesOk = false;
            }
        } 
        
        if (menuOk && pagesOk) {
            
            var divMenu = $("menu");
            divMenu.innerHTML = misTET.menu.parse();
                        
            misTET.modules.load();
            $("page").update("Checking dependencies");
            try {
                misTET.modules.checkDependencies();
            } catch (e) {
                misTET.errors.create(e);
                return false;
            }
            
            misTET.go(misTET.location);
            
        }
        
        /* This is just cooler than the code I've written before */
        /* Unfortunately IE sucks very much, I'm using this cause it */
        unFocus.History.addEventListener("historyChange", function ($hash) {
            if ($hash) {
                misTET.go("#" + $hash);
            } else {
                misTET.pages.set(misTET.config["home"]);
            }
         });
                
        /* new PeriodicalExecuter(misTET.refresh, 0,4); */
        
        Event.fire(document, ":initialized");
        misTET.initialized = true;
    },
    
    /* refresh 
    refresh: function () {

        if (misTET.location !== location.hash) {
            misTET.location = location.hash;
            misTET.go(location.hash);
        } 

    }, */
    
    check: {
        
        /* html 4.01 */
        html: function (url) {
            location.href = "http://validator.w3.org/check?uri=#{uri}".interpolate({uri: url});
        },
        /* css */
        css: function (url) {
            location.href = "http://jigsaw.w3.org/css-validator/validator?uri=#{uri}".interpolate({uri: url});
        }
    },
    /* Main files */
    config: {
        menu: { },
        pages: { },
        init: { },
        modules: { },
        loading: { },
        home: { },
        title: { }
    },
    
    go: function (query) {
            
        var queries = misTET.utils.getQueries(query);
        if (query.isEmpty()) {
            misTET.pages.set(misTET["config"]["home"]);
                
        } else {
            if (queries.page) {    
                var page = queries.page;
                var inner = misTET.pages.loadGET(page, queries);
                if (!inner.isEmpty()) {
                    $("page").innerHTML = inner;  
                }
                     
            } else if (queries.module) { 
                try {
                    misTET.modules.run(queries.module, queries);
                } catch (e) {
                    misTET.errors.create(e);
                }         
                    
            } else {
                var ref = query.match(/#\w+/);
                misTET.pages.set(ref[0].replace("#","")); 
            }
            
        }
        Event.fire(document, ":change", { name: query });
    },
     
    init: {
        /* init args */
        load: function () {
            var path = "/resources/init.xml";
            var test = false;
            var error = false;
            
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    if (misTET.utils.xml_not_valid(http.responseXML)) {
                        misTET.errors.create({
                            name: "misTET.init.load",
                            message: "error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["init"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error             = new Error("Error while loading init.xml");
                    error.name         = "initEttor";
                    error.fileName        = path;
                }
            });
                
            /* Error... */
            if (error) {
                misTET.errors.create(error);
            }
                
            var init = misTET.config.init.documentElement;
            misTET["config"]["home"] = init.getElementsByTagName("homePage")[0].firstChild.nodeValue;
            misTET["config"]["loading"] = init.getElementsByTagName("loadMessage")[0].firstChild.nodeValue;
            misTET["config"]["title"] = init.getElementsByTagName("title")[0].firstChild.nodeValue;
                
        }
    },
        
    menu: {
            
        load: function () {
            
            var path = "/resources/menu.xml";
            var test = false;
            var error = false;
                
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    if (misTET.utils.xml_not_valid(http.responseXML)) {
                        misTET.errors.create({
                            name: "misTET.menu.load",
                            message: "error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["menu"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error             = new Error("Error while loading menu.xml");
                    error.name         = "menuError";
                    error.fileName        = path;
                }
            });
            /* Error... */
            if (error) {
                misTET.errors.create(error);
            }
        },
            
        /* parse misTET.config.menu, and create a menu string */
        parse: function (id) {
    
            var Menu = misTET["config"]["menu"].documentElement;
            var len = Menu.getElementsByTagName("menu");
            var output = "";
                
            for (var i = 0; i < len.length; i++) {
                /* The first text node is the main menu */
                var menuValue = len[i].getElementsByTagName("text");
                /* Only a text node */
                if (menuValue.length == 1) {
                    var id = menuValue[0].getAttribute("id");
                    var inner = menuValue[0].firstChild.nodeValue;
                    output +=  "\n\t\t<div class = \"menu\">\n\t\t\t" +
                                    "<a href = \'#"+id+"\'>"+inner+
                                    "</a>\n\t\t</div>";

                } else {
                    var sub = ""
                    var idPrincipale = menuValue[0].getAttribute("id");
                    var ciao = menuValue[0].firstChild.nodeValue;
                    output +=        "\n\t\t<div class = \"menu\">\n\t\t\t" + 
                                          "<a href = \'#"+idPrincipale+"\'>"+ciao+"</a>" +
                                          "\n\t\t\t<div id = 'drop' class = \"menu\"><div>\n\t\t\t\t";

                    /* Scan all the sub menus */
                    for (var j = 1; j < menuValue.length; j++) {
                        var idSub = menuValue[j].getAttribute("id");
                        var inner2 = menuValue[j].firstChild.nodeValue;
                        output +=  "<a class = \'menu_element\' href" +
                                        " = \'#"+idSub+"\'><div class = \"\">" +
                                        inner2 + "</div></a>\n\t\t\t";

                    }
                    output += "</div></div>\n\t\t</div>";
                }
            }
            output += "";
                
            return output;
        }
            
    },
        
    pages: {
            
        load: function () {
            
            var path = "/resources/pages.xml";
            var test = false;
            var error = false;
                
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                    
                onSuccess: function (http) {
                    if (misTET.utils.xml_not_valid(http.responseXML)) {
                        misTET.errors.create({
                            name: "misTET.pages.load",
                            message: "error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["pages"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error             = new Error("Error while loading pages.xml");
                    error.name         = "pagesEttor";
                    error.fileName        = path;
                }
            });
            /* Error... */
            if (error) {
                misTET.errors.create(error);
            }
        },
            
        /* Find the page node with the specified id */
        parse: function (id) {

            var pagesXML = misTET["config"]["pages"].documentElement;
            var output = "";
            var pages = pagesXML.getElementsByTagName("page");
            var code = "";
                
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].getAttribute("id") == id) {
                    var list = pages[i].childNodes;
                    /* Easy parsing */
                    if (list.length == 1) {
                        output = pages[i].firstChild.nodeValue;
                    } else {
                        /* CData section */
                        for (var j = 0; j < list.length; j++) {
                            
                            if (list[j].nodeName == "#cdata-section") {
                                code = list[j].nodeValue;
                                output += code;
                            } else if (list[j].nodeName == "go") {
                                var href = list[j].getAttribute("href");
                                var args = list[j].getAttribute("args") || "";
                                if (!args.isEmpty()) {
                                    args = "&" + args;
                                }
                                var after = list[j].getAttribute("after");
                                    
                                output += "<a href = \'#page="+href+args+"\' " +
                                               ">" + list[j].getAttribute("text")+"</a>"+after+"<br>";

                            } else if (list[j].nodeName == "text") { 
                                var href = list[j].getAttribute("href");
                                var args = list[j].getAttribute("args") || "";
                                if (misTET.utils.isFile(misTET.extern+href)) {
                                    var inner = misTET.utils.encorp(misTET.extern+href);
                                    output += "<pre id = \'"+args+"\'>" + inner + "</pre>";
                                } else {
                                    misTET.errors.create({name: "404 - Not found", message: "couldn't find "+misTET.extern+href});
                                }
                            } else {
                                output += list[j].nodeValue;    
                            }
                        }
                    }
                }
            }
            return output;
        },
            
        set: function (id) {
                    
            if (!Object.isset(id) || !Object.isString(id)) {
                            
                var e = new Error("couldn't set a page if you don't give a real id");
                e.name = "misTET.pages.set";
                misTET.errors.create(e);
                return false;
                            
            }
                    
            var divpage = $("page");
            var inner = misTET.pages.parse(id);
                
            if (inner == "") {
                misTET.errors.create({name: "404 - Not found", message: "couldn't find #"+id});
                    
            } else {
                        
                try {
                    window.eval(inner);
                        
                } catch (e) {
                    divpage.innerHTML = inner;
                }
                    
            }
            Event.fire(document, ":change", { name: id });
            Event.fire(document, ":page.set", { name: id });
        },
            
        /* load an extern page(/stat) */
        loadGET: function (res, args) {

            if (args.page) {
                delete args.page;
            }
                    
            var result = "";
            if (!Object.isString(args)) {
                for (var arg in args) {
                    result += arg+"="+args[arg].toString().escapeHTML()+"&";
                }
                result = result.slice(0, result.length - 1);
            } else {
                result = args;
            }
                                        

            var output = "";
            
            if (misTET.utils.isFile(misTET.extern + res)) {
                var inner = misTET.utils.encorp(misTET.extern + res);
                output += "<pre id=\'" + result + "\'>#{code}</pre>".interpolate({code: inner});
            } else {
                misTET.errors.create({name: "404 - Not found", message: "couldn't find "+misTET.extern+res});
            }
                    
            Event.fire(document, ":page.set", { name: misTET.extern + res, args: args });
            return output;
        }
            
    },
        
    modules: {
            
        /* load modules.xml */
        load: function() {
            var path = "/resources/modules.xml";
            var test = false;
            var error = false;
                
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    if (misTET.utils.xml_not_valid(http.responseXML)) {
                        misTET.errors.create({
                            name: "misTET.modules.load",
                            message: "error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["modules"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error             = new Error("Error while loading modules.xml");
                    error.name         = "modulesError";
                    error.fileName        = path;
                }
            });
            /* Error... */
            if (error) {
                misTET.errors.create(error);
            }
            
            /* Parsing and loading */
            var file = misTET["config"]["modules"].documentElement;
            var modules = file.getElementsByTagName("module");
            
            for (var i = 0; i < modules.length; i++) {
                        
                var moduleName = modules[i].getAttribute("name");
                    
                if (!moduleName) {
                    misTET.errors.create({
                        name: "misTET.modules.load",
                        message: "Error while parsing modules.xml"
                    });
                    return;
                }
                    
                $("page").innerHTML = "Loading [`#{module}`] [#{n}/#{tot}]".interpolate({
                    module: moduleName,
                    n: i +1,
                    tot: modules.length
                });
                    
                try {
                            
                    misTET.utils.include("#{modules}/#{name}/#{name2}.js".interpolate({
                        modules: misTET.modFolder,
                        name: moduleName,
                        name2: moduleName
                    }));
                                        
                    Event.fire(document, ":modules.load", { name: moduleName });
                                                
                } catch (e) {
                                                
                    var error = new Error;
                    error.message = "Error while loading `#{name}`".interpolate({name: moduleName});
                    error.name = "misTET.modules.load";
                    error.line = e.lineNumber;
                    error.filename = e.fileName;
                                                
                    misTET.errors.create(error);
                                                
                }
            }
        },
            
        checkDependencies: function () {
                                
            for (var module in misTET.modules) {
                var needs = misTET.modules[module].needs;
                                        
                if (needs) {
                    for (var i = 0; i < needs.length; i++) {
                        if (!misTET.modules.exists(needs[i])) {
                            var e = new Error();
                            e.message = "`#{module}` requires `#{needs}`".interpolate({module: module, needs: needs[i]});
                            e.name = "misTET.modules.checkDependencies";
                            e.file = misTET.modules[module].root;
                                                        
                            throw e;
                        }
                    }
                }
            }
                                
            return true;
                    
        },
                
        get: function (name) {
                
            if (!Object.isset(name)) {
                misTET.errors.create({
                    name: "misTET.modules.get",
                    message: "0 of 1 arguments"
                });
                return false;
            }
                        
            if (!Object.isString(name)) {
                misTET.errors.create({
                    name: "misTET.modules.get",
                    message: "wrong type of argument"
                });
                return false;
            }
                        
            if (misTET.modules.exists(name)) {
                return misTET.modules[name];
            } else {
                return false;
            }
                        
        },
            
        exists: function (name) {
            if (!name) {
                misTET.errors.create({
                    name: "misTET.modules.exists",
                    message: "0 of 1 parameters sent to misTET.modules.exists"
                });
                 return false;
            }
            return Boolean(misTET.modules[name]);
        },
                        
        create: function (name, object) {
                                
            if (!object) {
                var error = new Error;
                
                e.name = "misTET.modules.create";
                error.message = "what should `#{name}` do?".interpolate({name: name});
                error.file = "#{root}/#{name}/#{name2}.js".interpolate({
                    root: misTET.modFolder,
                    name: name,
                    name2: name
                });
                                        
                misTET.errors.create(error);
                return false;
            }
                
            if (!name || !Object.isString(name)) {
                        
                var e = new Error("the first parameter must be a string");
                e.name = "misTET.modules.create";
                e.file = "#{root}/#{name}/#{file}.js".interpolate({
                        root: misTET.modFolder,
                        name: name,
                        file: name
                });
                misTET.errors.create(e);
                return false;
                        
            }
                                
            /* load all functions */
            for (var func in object) {
                if (Object.isFunction(object[func])) {
                    object[func] = object[func].bind(object);
                }
            }
                                
            /* load name and root folder */
            object.name = name;
            object.root = "#{path}/#{module}".interpolate({
                path: misTET.modFolder,
                module: name
            });
                                
            if (object.initialize) {
                try {
                    object.initialize();
                } catch (e) {
                    e.name = "misTET.modules.create";
                    e.filename = "#{root}/#{name}.js".interpolate({
                        root: object.root,
                        name: name
                    });
                    e.message = "Error while executing #{name}.initialize()".interpolate({name: object.name});
                    misTET.errors.create(e);
                }
            }
            else {
                object.initialize = new Function()
            }
            misTET.modules[name] = object;
            Event.fire(document, ":modules.create", {obj: object});
        },
        
        /* misTET.modules[name].execute(args) */
        run: function (name, args) {
                
            var result;
                
            if (!Object.isset(name) || !Object.isset(args)) {
                misTET.errors.create({
                    name: "misTET.modules.run",
                    message: "Running `#{0}`: wrong number of arguments".interpolate(name)
                    });
                return false;
            }
                
            if (!misTET.modules.exists(name)) {
                misTET.errors.create({
                    name: "misTET.modules.run",
                    message: "[`#{0}`] doesn't exist".interpolate(name)
                });
                return false;
            }
                        
            if (!Object.isArray(args)) {
                args = [args];
            }
                        
            try {
                /* 
                * Mozilla Javascript Core Reference:
                * apply is very similar to call, except for the 
                * type of arguments it supports. You can use an 
                * arguments array instead of a named set of parameters.
                * So, if we call apply with [{post: 1, ciao: 1], 
                * {post: 1, ciao: 1} will be the parameter sent to 
                * the module.
                * */
                /* Does the module return some shit? */
                result = misTET.modules[name].execute.apply(misTET.modules[name], args);    
                                
            } catch (exception) {
                        
                misTET.errors.create({
                    name: "misTET.modules.run", 
                        message: exception.message.toString(),
                        line: exception.lineNumber,
                        file: "#{modFolder}/#{name}/#{module}.js".interpolate({
                            modFolder: misTET.modFolder,
                            name: name,
                            module: name
                        })
                });
                                return false;
                   
            }
            
            if (!Object.isset(result)) {
                result = true;
            }
                        
            return result;
        }
                
    },
    
    res: {
            
        create: function (name, obj) {   
            try {
                misTET.res[name] = new misTET.Resource(name, obj);
            } catch (e) {
                misTET.errors.create(e);
            }

            if (misTET.res.exists(name)) {
                Event.fire(document, ":res.create", {obj: obj});
            }
        },
                
        get: function (name) {
                
            if (!name || !Object.isString(name)) {
                misTET.errors.create(["misTET.res.get", "wrong argument", "", ""]);
                return false;
            }
                        
            if (misTET.res.exists(name)) {
                return misTET.res[name];
            } else {
                misTET.errors.create(["misTET.res.get", "#{0} doesn't exist".interpolate(name), "", ""]);
                return false;
            }
                
        },
                
        del: function (name) {
                        
            if (!name || !Object.isString(name)) {
                var e = new Error("couldn't delete a resource if you don't give a real name");
                e.name = "misTET.res.del";
                misTET.errors.create(e);
                return false;
            }
                        
            if (misTET.res.exists(name)) {
                for (var key in misTET.res[name]) {
                    delete misTET.res[name][key];
                }
                                
                delete misTET.res[name];
            } else {
                                
                var e = new Error("misTET.res[\'#{name}\'] is not defined".interpolate({name: name}));
                e.name = "misTET.res.del";
                misTET.errors.create(e);
                return false;
                                
            }
                        
            return Boolean(!Object.isset(misTET.res[name]));
                        
        },
                
        exists: function (name) {
                        
            if (!name) {
                var e = new Error("what resource?");
                e.name = "misTET.res.exists";
                misTET.errors.create(e);
                return false;
            }
                        
            return Boolean(misTET.res[name]);
                        
        }
            
    },
    
    errors: {
            
        create: function (e) {
            var div = $("page");
                        
            /* You can pass an array */
            /* [name, message, file, line] */
            /* If something like `line` or `file` is undefined, use an empty string in the array */
            if (Object.isArray(e)) {
                        
                var tmp = $A(e);
                if (tmp.length == 4) {
                    
                    e = { };
                    e.name = tmp[0].toString().escapeHTML();
                    e.message = tmp[1].toString().escapeHTML();
                    e.file = tmp[2].toString().escapeHTML();
                    e.line = tmp[3].toString().escapeHTML();
                }
                        
            }
                        
            var error = misTET.errors.fix(e);
                        
            var string = "<br>#{name}:<br>#{message}<br>File: #{filename} @#{line}<br>".interpolate({
                name: error.name || error,
                message: error.message,
                filename: error.filename,
                line: error.line
            });
            misTET._error = true;
                        
            Event.fire(document, ":error", {obj: error});
                        
            div.update(string);    
        },
        
        fix: function (error)  {
            if (Object.isString(error)) {
                return error.name = error.escapeHTML();
            }
            error.name = (error.name || "Error").toString().escapeHTML();
            error.message = (error.message || "undefined message").toString().escapeHTML();
            error.filename = (error.filename || error.fileName || error.file || "undefined file").toString().escapeHTML();
            error.line = (error.line || error.lineNumber || "undefined line").toString().escapeHTML();
            return error;
        }
  
    },
    
    utils: {
        
        /* True: you're using IE, False: you're not using IE :) */
        isIE: function () {
                
            if (Prototype.Browser.IE) {
                return true;
            } else {
                return false;
            }
            
        },
        
        isFile: function (path) {
            var result = false;
 
             try {
                     
                new Ajax.Request(path, {
                        /* The HTTP head method is identical to GET, except
                         * that the server must not return a message-body in
                         * the response.
                         */
                    method: "head",
                    asynchronous: false,
 
                    onSuccess: function () {
                        result = true;
                    }
                });
                
            } catch (exception) { }
 
            return result;
        },
        
        /* Require a file */
        encorp: function (path) {
        
            var result;
            var error = false;
            
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    try {
                        result = http.responseText.toString().escapeHTML();
                    }
                    catch (e) {
                         error             = e;
                         error.fileName    = path;
                      }
                },
                
                onFailure: function (http) {
                    error            = new Error("Error while loading file (#{status} - #{statusText}).".interpolate(http));
                    error.fileName   = path;
                }
            });

            if (error) {
                misTET.errors.create(error);
            }
            
            return result;
        },
        
        xml_not_valid: function (xml) {

            var result = false;
            if (!Object.isset(xml)) {
                result = true;
            }
                        
            if (Object.isset(xml.documentElement.nodeName)) {
                if (xml.documentElement.nodeName == "parsererror") {
                    result = true;
                }
            }
                        
            if (Object.isBoolean(result)) {
                return result;
            }
            
        },

        /* include a js file */
        include: function (path) {
        
            var result = false;
            
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    try {
                        if (window.execScript) {
                            window.execScript(http.responseText);
                        } else {
                            window.eval(http.responseText);
                        }
                        result = true;
                    } catch (error) { 
                        misTET.errors.create(error);
                        return false;
                    }
                }
            });
                        
            return result;
       
        },
        
        execute: function (path) {
                
            var result;
            var error = false;
                
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                        
                onSuccess: function (http) {
                    try {
                        if (window.execScript) {
                            result = window.execScript(http.responseText);
                        } else {
                            result = window.eval(http.responseText);
                        }
                    } catch (exception) {
                        error = exception;
                    }
                },
                        
                onFailure: function (http) {
                    error = "(#{status} - #{statusText}) - #{path}".interpolate({
                            status: http.status,
                            statusText: http.statusText,
                            path: path
                        });
                }
            });
                
            if (error) {
                error = misTET.errors.fix(error);
                        
                misTET.errors.create({ 
                    name: error.name,
                    message: error.message,
                    filename: error.filename,
                    line: error.line
                });
                        
                return false;
            }
                
            return result;
        },
        
        /* Insert a CSS Link in the head section */
        insertCSS: function (path) {
            
            var result = false;
 
            if (misTET.utils.isFile(path)) {
                var style = new Element("link", {
                    rel: "stylesheet",
                    href: path,
                    type: "text/css"
                });
 
                $$("head")[0].insert(style);
                result = true;
            }
 
            return result;
        },
        
        getQueries: function (url) {
                
            var result = {};
                
            if (!Object.isset(url) || !Object.isString(url)) {
                        
                var e = new Error("what url should the function parse?");
                e.name = "parsing error";
                e.file = "#{root}/#{loc}".interpolate(misTET);
                misTET.errors.create(e);
      
                 return false;
            }
                
            var matches = url.match(/[?#](.*)$/);
        
            if (!matches) {
                return result;
            }
        
            var splitted = matches[1].split(/&/);
            for (var i = 0; i < splitted.length; i++) {
                var parts = splitted[i].split(/=/);
                var name = parts[0].decodeURI();
                    
                if (parts[1]) {
                    result[name] = parts[1].decodeURI();
                } else {
                    result[name] = true
                }
                    
            }
        
            return result;
        }

    }
};

misTET.utils.include("system/framework.js");
misTET.utils.include("system/Resource.js");
