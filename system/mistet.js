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
    
    version: ["0", "7", "5"].join("."),
    
    modFolder: "/modules",
    module: { },
    extern: "/stat",
    root: location.href.match(/^(.*?)\/[^\/]*?(#|$)/)[1],
    loc: "system/mistet.js",
    
    /* start misTET */
    initialize: function () {
        
        if (misTET.initialized) {           
            var error = new misTET.exception({
                description: "misTET.init: misTET has been already initialized.",
                file: "#{root}/#{loc}".interpolate(misTET)
            });
                
            misTET.error.handle(error);
            return false;
        }

        /* Event.observe(window, "error", misTET.error.handle) sucks pretty much */
        window.onerror = misTET.error.handle;

        misTET.location = location.hash;
        misTET.initialized = false;

        [
        /* init.xml stuff */
        function () {
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
            $("page").innerHTML = misTET.config["loading"];
        },

        /* menu */
        function () {
            misTET.menu.load();
            $("menu").innerHTML = misTET.menu.parse();
        },

        /* pages */
        function () {
            misTET.pages.load();
        },

        /* modules */
        function () {
            misTET.modules.load();
            $("page").update("Checking dependencies");
            misTET.modules.checkDependencies();
        }
        ].each(

        function (initialization) {
            try { 
                initialization();
            } catch (e) {
                throw (e);
            }

        });
            
        misTET.go(misTET.location);
            
        
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
                    misTET.module.run(queries.module, queries);
                } catch (e) {
                    misTET.error.handle(new misTET.exception(e));
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
                        error = new misTET.exception({
                            description: "misTET.init.load: error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                        error.description = "misTET.init.load: error while parsing #{file}".interpolate({
                                file: path
                            })
                    }
                    misTET["config"]["init"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        description: "initError: Error while loading init.xml",
                        file: path
                    });
                }
            });
                
            /* Error... */
            if (error) {
                misTET.error.handle(error);
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
                        error = new misTET.exception({
                            description: "misTET.menu.load: error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["menu"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        description: "menuError: Error while loading menu.xml",
                        file: path
                    });
                }
            });
            /* Error... */
            if (error) {
                misTET.error.handle(error);
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
                        error = new misTET.exception({
                            description: "misTET.pages.load: error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["pages"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        description: "pagesError: (#{status} - #{statusText}".interpolate(http),
                        file: path
                    });
                }
            });
            /* Error... */
            if (error) {
                misTET.error.handle(error);
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
                                    misTET.error.handle(new misTET.exception({
                                        description: "404 - couldn't find " + misTET.extern + href
                                    }));
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
                            
                var e = new misTET.exception({
                    description: "misTET.pages.set: couldn't set a page if you don't give a real id"
                });
                misTET.error.handle(e);
                return false;
                            
            }
                    
            var divpage = $("page");
            var inner = misTET.pages.parse(id);
                
            if (inner == "") {
                misTET.error.handle(new misTET.exception({
                    description: "404 - couldn't find " + id
                }));
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
                misTET.error.handle(new misTET.exception({
                    description: "404 - couldn't find " + misTET.extern + res
                }));
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
                        error = new misTET.exception({
                            description: "misTET.modules.load: error while parsing #{file}".interpolate({
                                file: path
                            })
                        });
                    }
                    misTET["config"]["modules"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        description: "modulesError: Error while loading modules.xml"
                    });
                }
            });
            /* Error... */
            if (error) {
                misTET.error.handle(error);
            }
            
            /* Parsing and loading */
            var file = misTET["config"]["modules"].documentElement;
            var modules = file.getElementsByTagName("module");
            
            for (var i = 0; i < modules.length; i++) {
                        
                var moduleName = modules[i].getAttribute("name");
                    
                if (!moduleName) {
                    misTET.error.handle(new misTET.exception({
                        description: "misTET.modules.load: Error while parsing modules.xml"
                    }));
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
                                                
                    misTET.error.handle(new misTET.exception({
                        description: "misTET.modules.load: Error while loading `#{name}`".interpolate({
                            name: moduleName }),
                        file: e.fileName,
                        line: (e.lineNumber || e.line)
                    }));
                                                
                }
            }
        },
            
        checkDependencies: function () {
                                
            for (var module in misTET.module) {
                var needs = misTET.module[module].needs;
                                        
                if (needs) {
                    for (var i = 0; i < needs.length; i++) {
                        if (!misTET.module.exists(needs[i])) {
                            var e = new Error();
                            e.message = "`#{module}` requires `#{needs}`".interpolate({module: module, needs: needs[i]});
                            e.name = "misTET.modules.checkDependencies";
                            e.file = misTET.module[module].root;
                                                        
                            throw e;
                        }
                    }
                }
            }
                                
            return true;
                    
        },
                
        get: function (name) {
                
            if (!Object.isset(name)) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.modules.get: 0 of 1 arguments"
                }));
                return false;
            }
                        
            if (!Object.isString(name)) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.modules.get: wrong type of argument"
                }));
                return false;
            }
                        
            if (misTET.module.exists(name)) {
                return misTET.module[name];
            } else {
                return false;
            }
                        
        }       
    },

    module: {

        exists: function (name) {
            if (!name) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.module.exists: 0 of 1 parameters sent to misTET.module.exists"
                }));
                 return false;
            }
            return Boolean(misTET.module[name]);
        },
                        
        create: function (name, object) {
                                
            if (!object) {
                  
                misTET.error.handle(new misTET.exception({
                    description: "misTET.module.create: what should `#{name}` do?".interpolate({name: name}),
                    file: "#{root}/#{name}/#{name2}.js".interpolate({
                        root: misTET.modFolder,
                        name: name,
                        name2: name })
                }));
                return false;
            }
                
            if (!name || !Object.isString(name)) {
                        
                misTET.error.handle(new misTET.exception({
                    description: "misTET.module.create: the first parameter must be a string",
                    file: "#{root}/#{name}/#{file}.js".interpolate({
                        root: misTET.modFolder,
                        name: name,
                        file: name })
                }));
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

                    misTET.error.handle(new misTET.exception({
                        description: "misTET.module.create: Error while executing #{name}.initialize()".interpolate({name: object.name}),
                        file: "#{root}/#{name}.js".interpolate({
                            root: object.root,
                            name: name })
                    }));
                }
            }
            else {
                object.initialize = new Function()
            }
            misTET.module[name] = object;
            Event.fire(document, ":module.create", {obj: object});
        },
        
        /* misTET.module[name].execute(args) */
        run: function (name, args) {
                
            var result;
                
            if (!Object.isset(name) || !Object.isset(args)) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.module.run: wrong number of arguments".interpolate(name),
                }));
                return false;
            }
                
            if (!misTET.module.exists(name)) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.module.run: [`#{0}`] doesn't exist".interpolate(name)
                }));
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
                * So, if we call apply with [{post: 1, ciao: 1}], 
                * {post: 1, ciao: 1} will be the parameter sent to 
                * the module.
                * */
                /* Does the module return some shit? */
                result = misTET.module[name].execute.apply(misTET.module[name], args);    
                                
            } catch (exception) {

                misTET.error.handle(new misTET.exception({
                    description: "misTET.module.run: " + exception.message.toString(), 
                    line: (exception.lineNumber || exception.lineNumber),
                    file: "#{modFolder}/#{name}/#{module}.js".interpolate({
                        modFolder: misTET.modFolder,
                        name: name,
                        module: name
                        })
                }));

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
                misTET.error.handle(new misTET.exception({
                    description: "misTET.res.create: " + e.message.toString(),
                    file: e.fileName,
                    line: (e.lineNumber || e.line) 
                }));
            }

            if (misTET.res.exists(name)) {
                Event.fire(document, ":res.create", {obj: obj});
            }
        },
                
        get: function (name) {
                
            if (!name || !Object.isString(name)) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.res.get: wrong argument"
                }));
                return false;
            }
                        
            if (misTET.res.exists(name)) {
                return misTET.res[name];
            } else {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.res.get: #{0} doesn't exist".interpolate(name)
                }));
                return false;
            }
                
        },
                
        del: function (name) {
                        
            if (!name || !Object.isString(name)) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.res.del: wrong argument"
                }));
                return false;
            }
                        
            if (misTET.res.exists(name)) {
                for (var key in misTET.res[name]) {
                    delete misTET.res[name][key];
                }
                                
                delete misTET.res[name];
            } else {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.res.del: misTET.res[\'#{name}\'] is not defined".interpolate({name: name}),
                }));
                return false;
                                
            }
                        
            return Boolean(!Object.isset(misTET.res[name]));
                        
        },
                
        exists: function (name) {
                        
            if (!name) {
                misTET.error.handle(new misTET.exception({
                    description: "misTET.res.exists: what res?"
                }));
                return false;
            }
                        
            return Boolean(misTET.res[name]);
                        
        }
            
    },
    
    error: {
            
        handle: function ()  {
            var result = ""

            if (arguments.length == 1) {
                if (_isException(arguments[0])) {
                    result = "misTET $error!\n" + 
                             "\nDescription: \n\t\t" + arguments[0].description +
                             "\nPage:        \t" + arguments[0].page +
                             "\nLine:      \t\t" + arguments[0].line;
                    misTET.$error = true;
                    Event.fire(document, ":error", arguments[0]);
                    window.alert(result);
                    return true;  

                } else {
                    if (Object.isString(arguments[0])) {
                        Event.fire(document, ":error", _fixException({
                            description: arguments[0]
                        }));

                        misTET.$error = true;
                        window.alert("misTET $error!\n\n" + 
                                      arguments[0].escapeHTML());
                        return misTET.$error;

                    } else {
                        misTET.error.handle(new misTET.exception({
                            description: "misTET.error.handle: arguments[0] is not exception"
                        }));
                        return (misTET.$error = true);
                    }
                }
            }

            Event.fire(document, ":error", {
                description: arguments[0],
                file: arguments[1],
                line: arguments[2]
            });
            window.alert( "misTET $error! \n"
                   +"\nError description: \t"+arguments[0]
                   +"\nPage address:      \t"+arguments[1]
                   +"\nLine number:       \t"+arguments[2]
            )
            misTET.$error = true;
            return true;
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
        
            var result = false;
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
                         error = new misTET.exception({
                             description: e.toString(),
                             file: path
                         });
                      }
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        description: "Error while loading file (#{status} - #{statusText}).".interpolate(http),
                        file: path
                    });
                }
            });

            if (error) {
                misTET.error.handle(error);
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
                        misTET.error.handle(new misTET.exception({
                            description: e.message.toString(),
                            file: e.fileName,
                            line: (e.lineNumber || e.line)
                        }));
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
                        error = new misTET.exception({
                            description: exception.message.toString(),
                            file: exception.fileName,
                            line: (exception.lineNumber || exception.line)
                        });
                    }
                },
                        
                onFailure: function (http) {
                    error = new misTET.exception({
                        description: "(#{status} - #{statusText})".interpolate(http),
                        file: path
                    });
                }
            });
                
            if (error) {
                misTET.error.handle(error);
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
                        
                misTET.error.handle(new misTET.exception({
                    description: "parsing error: what url should getQueries parse?",
                    file: "#{root}/#{loc}".interpolate(misTET)
                }));
      
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

misTET.utils.include("system/utils.js");
misTET.utils.include("system/Resource.js");
misTET.utils.include("system/Exception.js");
