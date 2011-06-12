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
    
    version: ["0", "8", "0"].join("."),
    
    /* start misTET */
    initialize: function () {        
        if (misTET.initialized) {           
            var error = new misTET.exception({
                name: "misTET init",
                message: "misTET has been already initialized.",
                file: location.href.match(/^(.*?)\/[^\/]*?(#|$)/)[1] + "/system/mistet.js"
            });
                
            error.handle();
            return false;
        }

        misTET.location = location.hash;
        misTET.initialized = false;

        [function () {
            misTET.root = location.href.match(/^(.*?)\/[^\/]*?(#|$)/)[1];
            misTET.modFolder = "#{root}/modules".interpolate(misTET);
            misTET.extern = "#{root}/stat".interpolate(misTET);
            misTET.config = new Object();
        },
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
        ].each( function (initialization) {
            try { 
                initialization();
            } catch (e) {
                e.fix();
                new misTET.exception(e).handle();
                return false;
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
    
    go: function (query) {            
        var queries = query.parseQuery();

        if (query.isEmpty()) {
            misTET.pages.set(misTET["config"]["home"]);                
        } 
        else {
            if (queries.page) {    
                var page = queries.page;
                var inner = misTET.pages.loadGET(page, queries);

                if (!inner) {
                    return false;
                }
                if (!inner.isEmpty()) {
                    $("page").innerHTML = inner;  
                }
                     
            } else if (queries.module) { 
                try {
                    misTET.module.run(queries.module, queries);
                } catch (e) {
                    e.fix();
                    new misTET.exception(e).handle();
                    return false;
                }         
                    
            } else {
                var ref = query.match(/#\w+/);
                misTET.pages.set(ref[0].replace("#","")); 
            }
            
        }
        Event.fire(document, ":change", { name: query });
    },
     
    init: {

        load: function () {
            var path = "#{root}/resources/init.xml".interpolate(misTET);
            var test = false;
            var error = false;
            
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    if (misTET.XML.not_valid(http.responseXML, path)) {
                        return false;
                    }
                    misTET["config"]["init"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        name: "initError",
                        message: "Error while loading init.xml",
                        file: path
                    });
                }
            });
                
            /* Error... */
            if (error) {
                error.handle();
                return false;
            }
                
            var init = misTET.config.init.documentElement;

            $A(init.childNodes).each(function (node) {
                if (node.nodeType != Node.ELEMENT_NODE) { /* Node.ELEMENT_NODE == 1 */
                    return;
                }
                var name = node.nodeName;
                misTET["config"][name] = (node.firstChild.data || node.firstChild.nodeValue);
            });
                
        }
    },
        
    menu: {
            
        load: function () {
            var path = "#{root}/resources/menu.xml".interpolate(misTET);
            var test = false;
            var error = false;
                
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    if (misTET.XML.not_valid(http.responseXML, path)) {
                        return false;
                    }
                    misTET["config"]["menu"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        name: "menuError",
                        message: "Error while loading menu.xml",
                        file: path
                    });
                }
            });
            /* Error... */
            if (error) {
                error.handle();
                return false;
            }
        },
                  
        parse: function (id) {
            var menu = misTET.XML.getNodes(misTET["config"]["menu"].documentElement, "menu");
            var output = "";
            
            for (var i = 0; i < menu.length; i++) {
                var first = true;
                var startSub = false;

                $A(menu[i].childNodes).each(function (node) {
                    if (node.nodeType == Node.ELEMENT_NODE &&
                        node.nodeName == "text") {
 
                        var e = node.cloneNode(true);
                        if (first) {
                            var id = e.getAttribute('id'); e.removeAttribute('id');
                            var inner = e.firstChild.nodeValue;

                            output += ("\n\t\t<div class='menu'>\n\t\t\t" + 
                                       "<a href='##{id}'>#{inner}</a>\n\t\t" + 
                                       "</div>").interpolate({
                                           id: id,
                                           inner: inner
                                       });
                            first = false;
                        } else {
                            if (!startSub) {
                                var id = e.getAttribute('id'); e.removeAttribute('id');
                                var inner = e.firstChild.nodeValue;
                                
                                output = output.slice(0, output.length - 6);
                                output += ("\n\t\t\t<div id='drop' class='menu'>" +
                                           "<div>\n\t\t\t\t<a class='menu_element'" +
                                           "href='##{id}'><div class=''>#{inner}</div></a>\n").interpolate({
                                    id: id,
                                    inner: inner
                                });
                                startSub = true;
                            } else {
                                var id = e.getAttribute('id'); e.removeAttribute('id');
                                var inner = e.firstChild.nodeValue;

                                output += ("\t\t\t\t<a class='menu_element' href='##{id}'>" +
                                           "<div class=''>#{inner}</div></a>\n").interpolate({
                                    id: id,
                                    inner: inner
                                });
                            }
                        }
                    } 
                });
                if (startSub) {
                    output += "\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t";
                }
            }
            return output;
        }
            
    },
        
    pages: {
            
        load: function () {
            var path = "#{root}/resources/pages.xml".interpolate(misTET);
            var test = false;
            var error = false;
                
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                    
                onSuccess: function (http) {
                    if (misTET.XML.not_valid(http.responseXML, path)) {
                        return false;
                    }
                    misTET["config"]["pages"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        name: "pagesError",
                        message: "(#{status} - #{statusText}".interpolate(http),
                        file: path
                    });
                }
            });
            /* Error... */
            if (error) {
                error.handle();
                return false;
            }
        },
            
        /* Find the page node with id=id and parse it */
        parse: function (id) {
            if (!Object.isset(id)) {
                return "";
            }

            var output = "";
            var page = Object.getID.call(misTET.config.pages.documentElement, String(id));

            $A(page.childNodes).each(function (node) {
                switch (node.nodeType) {

                    case Node.ELEMENT_NODE:
                        var e = node.cloneNode(true);
                        switch (e.nodeName) {

                            case "go":
                                var href = e.getAttribute("href"); e.removeAttribute("href");
                                var args = e.getAttribute("args") || "";
                                var after = e.getAttribute("after"); e.removeAttribute("after");
                                var text = e.getAttribute("text"); e.removeAttribute("text");

                                if (Object.isset(args) && !args.isEmpty()) {
                                    args = "&" + args; 
                                }

                                output += "<a href='#page=#{href}#{args}'>#{text}</a>#{after}<br>".interpolate({
                                    href: href,
                                    args: args,
                                    text: text,
                                    after: after
                                });
                            break
    
                            case "text":
                                var href = e.getAttribute("href"); e.removeAttribute("href");
                                var args = e.getAttribute("args") || "";

                                if (misTET.File.exists(misTET.extern + href)) {
                                    var inner = misTET.File.get_contents(misTET.extern + href);
                                    output += "<pre id='#{args}'>#{inner}</pre>".interpolate({
                                        args: args,
                                        href: href,
                                        inner: inner.strip()
                                    });

                                } else {
                                    new misTET.exception({
                                        name: "Error 404",
                                        message: "couldn't find " + misTET.extern + href
                                    }).handle();
                                    return false;
                                }
                            break;
                        }

                    break;

                    case Node.CDATA_SECTION_NODE:
                    case Node.TEXT_NODE:
                        output += node.nodeValue;
                    break;

                }
            });
                
            return output;
        },
            
        set: function (id) {
            if (!Object.isset(id) || !Object.isString(id)) {                            
                new misTET.exception({
                    name: "misTET.pages.set",
                    message: "couldn't set a page if you don't give a real id"
                }).handle();
                return false;                          
            }
                    
            var divpage = $("page");
            var inner = misTET.pages.parse(id);
                
            if (inner == "") {
                new misTET.exception({
                    name: "Error 404",
                    message: "couldn't find " + id
                }).handle();
                return false;

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
            
            if (misTET.File.exists(misTET.extern + res)) {
                var inner = misTET.File.get_contents(misTET.extern + res);

                output += "<pre id=\'#{result}\'>#{code}</pre>".interpolate({
                    result: result,
                    code: inner
                });
            } else {

                new misTET.exception({
                    name: "Error 404",
                    message: "couldn't find " + misTET.extern + res
                }).handle();

                return false;

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
                    if (misTET.XML.not_valid(http.responseXML, path)) {
                        return false;
                    }
                    misTET["config"]["modules"] = http.responseXML;
                },
                
                onFailure: function (http) {
                    error = new misTET.exception({
                        name: "modulesError",
                        message: "Error while loading modules.xml"
                    });
                }
            });
            /* Error... */
            if (error) {
                error.handle()
                return false;
            }
            
            /* Parsing and loading */
            var file = misTET["config"]["modules"].documentElement;
            var modules = file.getElementsByTagName("module");
            
            for (var i = 0; i < modules.length; i++) {
                        
                var moduleName = modules[i].getAttribute("name");
                    
                if (!moduleName) {
                    new misTET.exception({
                        name: "misTET.modules.load",
                        description: "Error while parsing modules.xml"
                    }).handle();
                    return;
                }
                    
                $("page").innerHTML = "Loading [`#{module}`] [#{n}/#{tot}]".interpolate({
                    module: moduleName,
                    n: i +1,
                    tot: modules.length
                });
                    
                try {
                            
                    misTET.File.include("#{modules}/#{name}/#{name2}.js".interpolate({
                        modules: misTET.modFolder,
                        name: moduleName,
                        name2: moduleName
                    }));
                                        
                    Event.fire(document, ":modules.load", { name: moduleName });
                                                
                } catch (e) {
                                                
                    new misTET.exception({
                        name: "misTET.modules.load",
                        message: "Error while loading `#{name}`".interpolate({
                            name: moduleName }),
                        file: e.fileName,
                        line: e.line
                    }).handle();
                    return false;
                                                
                }
            }
        },
            
        checkDependencies: function () {

            for (var module in misTET.module) {
                var needs = misTET.module[module].needs;      
                                 
                if (needs) {
                    for (var i = 0; i < needs.length; i++) {
                        if (!misTET.module.exists(needs[i])) {

                            var e = new Error({
                                message: "`#{module}` requires `#{needs}`".interpolate({module: module, needs: needs[i]}),
                                name: "misTET.modules.checkDependencies",
                                fileName: "#{root}/#{name}.js".interpolate({
                                    root: misTET.module[module].root,
                                    name: module
                                }),
                                lineNumber: ""
                            });

                            e.fix();                           
                            new misTET.exception(e).handle();

                            return false;
                        }
                    }
                }
            }
                                
            return true;
                    
        },
                
        get: function (name) {
            if (!Object.isset(name)) {
                new misTET.exception({
                    name: "misTET.modules.get",
                    message: "0 of 1 arguments"
                }).handle();
                return false;
            }
                        
            if (!Object.isString(name)) {
                new misTET.exception({
                    name: "misTET.modules.get",
                    description: "wrong type of argument"
                }).handle();
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
                new misTET.exception({
                    name: "misTET.module.exists",
                    message: "wrong argument"
                }).handle();
                return false;
            }

            return Boolean(misTET.module[name]);
        },
                        
        create: function (name, object) {
            if (!object) {     

                new misTET.exception({
                    name: "misTET.module.create",
                    message: "no object given".interpolate({name: name}),
                    file: "#{root}/#{name}/#{name2}.js".interpolate({
                        root: misTET.modFolder,
                        name: name,
                        name2: name 
                    })
                }).handle();

                return false;
            }
                
            if (!Object.isset(name) || !Object.isString(name)) {
                        
                new misTET.exception({
                    name: "misTEt.module.create",
                    message: "the first argument must be a string",
                    file: "#{root}/#{name}/#{file}.js".interpolate({
                        root: misTET.modFolder,
                        name: name,
                        file: name 
                    })
                }).handle();

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
                    e.fix();
                    new misTET.exception({
                        name: "misTET.module.create",
                        message: "Error while executing #{name}.initialize()".interpolate({name: object.name}),
                        file: e.file,
                        line: e.line
                    }).handle();
                    return false;
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
                new misTET.exception({
                    name: "misTET.module.run",
                    message: "wrong number of arguments"
                }).handle();
                return false;
            }
                
            if (!misTET.module.exists(name)) {
                new misTET.exception({
                    name: "misTET.module.run",
                    message: "module['#{what}'] doesn't exist".interpolate({what: name})
                }).handle();
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

                new misTET.exception({
                    name: "misTET.module.run",
                    message: exception.message.toString(), 
                    line: exception.line,
                    file: "#{modFolder}/#{name}/#{module}.js".interpolate({
                        modFolder: misTET.modFolder,
                        name: name,
                        module: name
                        })
                }).handle();

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
                e.fix();
                new misTET.exception({
                    name: "misTET.res.create",
                    message: e.message.toString(),
                    file: e.file,
                    line: e.line 
                }).handle();
                return false;
            }

            if (misTET.res.exists(name)) {
                Event.fire(document, ":res.create", {obj: obj});
            }
        },
                
        get: function (name) {
            if (!name || !Object.isString(name)) {
                new misTET.exception({
                    name: "misTET.res.get",
                    message: "wrong argument"
                }).handle();
                return false;
            }
                        
            if (misTET.res.exists(name)) {
                return misTET.res[name];
            } else {
                new misTET.exception({
                    name: "misTET.res.get",
                    message: "#{what} doesn't exist".interpolate({what: name})
                }).handle();
                return false;
            }
                
        },
                
        del: function (name) {
            if (!name || !Object.isString(name)) {
                new misTET.exception({
                    name: "misTET.res.del",
                    message: "wrong argument"
                }).handle();
                return false;
            }
                        
            if (misTET.res.exists(name)) {
                for (var key in misTET.res[name]) {
                    delete misTET.res[name][key];
                }
                                
                delete misTET.res[name];
            } else {
                new misTET.exception({
                    name: "misTET.res.del",
                    message: "misTET.res[\'#{name}\'] is not defined".interpolate({name: name})
                }).handle();
                return false;
                                
            }
                        
            return Boolean(!Object.isset(misTET.res[name]));
                        
        },
                
        exists: function (name) {
            if (!name) {
                new misTET.exception({
                    name: "misTET.res.exists",
                    message: "what res?"
                }).handle();
                return false;
            }
                        
            return Boolean(misTET.res[name]);
                        
        }
            
    }
};
