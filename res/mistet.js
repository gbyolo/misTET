/****************************************************************************
 * Copyleft lostpassword                                                    *
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

var misTET = {
    
    version: ["0", "5", "5"].join("."),
    
    modFolder: "/modules",
    modules: { },
    extern: "/res/files/stat",
    root: location.href.match(/^(.*?)\/[^\/]*?(#|$)/)[1],
    loc: "res/mistet.js",
    
    /* start misTET */
    init: function () {
        
        if (misTET.initialized) {
                
            var error = new Error;
            error.name = "initializing error";
            error.message = "misTET has been already initialized.";
            error.filename = "#{root}/#{loc}".interpolate(misTET);
                
            misTET.error(error);
            return false;
        }
        
        misTET.location = location.hash;
        misTET.initialized = false;
    
        eval('misTET.resources.init.load()');
        
        if (!Object.isset(misTET.config['home'])) {
                misTET.config['home'] = 'home';
        }
        
        if (!Object.isset(misTET.config['title'])) {
                misTET.config['title'] = "misTET #{version}".interpolate(misTET);
        }
        
        if (!Object.isset(misTET.config['loading'])) {
                misTET.config['loading'] = "Loading...";
        }
        
        if (misTET.config['home'].charAt(0) == '#') {
                misTET.config['home'].slice(1, misTET.config['home'].length);
        }
        
        if (!document.title) {
                document.title = misTET.config['title'];
        }
                
                $('title').innerHTML = misTET.config['title'];
        
        var ops = $('page');
        var args = misTET.utils.getQueries(location.hash);
        var menuOk = true, pagesOk = true;
        ops.innerHTML = misTET.config['loading'];
        
        try {
            misTET.resources.menu.load();
        } catch (e) {
                misTET.error(e);
            menuOk = false;
        }
        
        if (menuOk) {
            try {
                misTET.resources.pages.load();
            } catch (e) {
                misTET.error(e);
                pagesOk = false;
            }
        } 
        
        if (menuOk && pagesOk) {
            
            var divMenu = $('menu');
            divMenu.innerHTML = misTET.resources.menu.parse();
                        
            misTET.resources.modules.load();
            $('page').update("Checking dipendencies");
            try {
                misTET.resources.modules.checkDependencies();
            } catch (e) {
                misTET.error({ message: "`#{module}` needs `#{needs}`".interpolate(e) });
                return false;
            }
            
            misTET.go(misTET.location);
            
        }
        
        new PeriodicalExecuter(misTET.refresh, 0,4);
        
        misTET.initialized = true;
    },
    
    /* refresh */
    refresh: function () {

        if (misTET.location !== location.hash) {
            misTET.location = location.hash;
            misTET.go(location.hash);
        } 

    },
    
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
        title: { },
    },
    
    go: function (query) {
            
            var queries = misTET.utils.getQueries(query);
            if (query.isEmpty()) {
                misTET.resources.pages.set(misTET['config']['home']);
                
            } else {
                if (queries.page) {    
                    var page = queries.page;
                     var inner = misTET.resources.pages.loadGET(page, queries);
                     $('page').innerHTML = inner;  
                     
                } else if (queries.module) { 
                    try {
                        misTET.modules[queries.module].execute(queries);
                    } catch (e) {
                        misTET.error(e);
                    }         
                    
                } else {
                    var ref = query.match(/#\w+/);
                    misTET.resources.pages.set(ref[0].replace('#','')); 
                        }
            
        }
        Event.fire(document, ":change", query);
    },
    
    resources: {
        
        init: {
            /* init args */
            load: function () {
                var path = '/res/files/init.xml';
                var test = false;
                var error = false;
            
                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,
                          evalJS: false,
                
                    onSuccess: function (http) {
                        if (test = misTET.utils.XMLtest(http.responseXML)) {
                                misTET['config']['init'] = http.responseXML;
                            } else {
                                misTET.error(test)
                           }
                   },
                
                    onFailure: function (http) {
                        error             = new Error("Error while loading init.xml");
                        error.name         = "initEttor";
                        error.fileName        = path;
                    }
                });
                
                /* Error... */
                if (error) {
                    misTET.error(error);
                }
                
                var init = misTET.config.init.documentElement;
                misTET['config']['home'] = init.getElementsByTagName('homePage')[0].firstChild.nodeValue;
                misTET['config']['loading'] = init.getElementsByTagName('loadMessage')[0].firstChild.nodeValue;
                misTET['config']['title'] = init.getElementsByTagName('title')[0].firstChild.nodeValue;
                
            }
        },
        
        menu: {
            
            load: function () {
            
                var path = '/res/files/menu.xml';
                var test = false;
                var error = false;
                
                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,
                          evalJS: false,
                
                        onSuccess: function (http) {
                            if (test = misTET.utils.XMLtest(http.responseXML)) {
                                misTET['config']['menu'] = http.responseXML;
                            } else {
                                misTET.error(test)
                        }
                   },
                
                    onFailure: function (http) {
                        error             = new Error("Error while loading menu.xml");
                        error.name         = "menuError";
                        error.fileName        = path;
                    }
                });
                /* Error... */
                if (error) {
                    misTET.error(error);
                }
            },
            
            /* parse misTET.config.menu, and creates a menu string */
            parse: function (id) {
    
                var Menu = misTET['config']['menu'].documentElement;
                var len = Menu.getElementsByTagName('menu');
                var output = "";
                
                for (var i = 0; i < len.length; i++) {
                    /* The first text node is the main menu */
                    var menuValue = len[i].getElementsByTagName('text');
                    /* Only a text node */
                    if (menuValue.length == 1) {
                        var id = menuValue[0].getAttribute('id');
                        var inner = menuValue[0].firstChild.nodeValue;
                        output +=   "\n\t\t<div class = \"menu\">\n\t\t\t" +
                                                "<a href = \'#"+id+"\'>"+inner+
                                                "</a>\n\t\t</div>";

                    } else {
                        var sub = ""
                        var idPrincipale = menuValue[0].getAttribute('id');
                        var ciao = menuValue[0].firstChild.nodeValue;
                        output +=         "\n\t\t<div class = \"menu\">\n\t\t\t" + 
                                                "<a href = \'#"+idPrincipale+"\'>"+ciao+"</a>" +
                                                "\n\t\t\t<div class = \"menu\">\n\t\t\t\t";

                        /* Scan all the sub menus */
                        for (var j = 1; j < menuValue.length; j++) {
                            var idSub = menuValue[j].getAttribute('id');
                            var inner2 = menuValue[j].firstChild.nodeValue;
                            output +=         "<a class = \'menu_element\' href" +
                                                    " = \'#"+idSub+"\'><div class = \"\">" +
                                                    inner2 + "</div></a>\n\t\t\t";

                        }
                        output += "</div>\n\t\t</div>";
                    }
                }
                output += "";
                
                return output;
            }
            
        },
        
        pages: {
            
            load: function () {
            
                var path = '/res/files/pages.xml';
                var test = false;
                var error = false;
                
                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,
                          evalJS: false,
                    
                        onSuccess: function (http) {
                            if (test = misTET.utils.XMLtest(http.responseXML)) {
                                misTET['config']['pages'] = http.responseXML;
                            } else {
                                misTET.error(test)
                        }
                    },
                
                    onFailure: function (http) {
                        error             = new Error("Error while loading pages.xml");
                        error.name         = "pagesEttor";
                        error.fileName        = path;
                    }
                });
                /* Error... */
                if (error) {
                    misTET.error(error);
                }
            },
            
            /* Find the page node with the specified id */
            parse: function (id) {

                var pagesXML = misTET['config']['pages'].documentElement;
                var output = "";
                var pages = pagesXML.getElementsByTagName('page');
                var code = "";
                
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].getAttribute('id') == id) {
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
                                    var href = list[j].getAttribute('href');
                                    var args = list[j].getAttribute('args') || "";
                                    if (!args.isEmpty()) {
                                            args = "&" + args;
                                    }
                                    var after = list[j].getAttribute('after');
                                    
                                    output +=                 "<a href = \'#page="+href+args+"\' " +
                                                                        ">" + list[j].getAttribute('text')+"</a>"+after+"<br>";

                                } else if (list[j].nodeName == "text") { 
                                    var href = list[j].getAttribute('href');
                                    var args = list[j].getAttribute('args') || "";
                                    if (misTET.utils.isFile(misTET.extern+href)) {
                                        var inner = misTET.utils.encorp(misTET.extern+href);
                                        output += "<pre id = \'"+args+"\'>" + inner + "</pre";
                                    } else {
                                        misTET.error("404 - Not found");
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
                    e.name = "page error";
                        misTET.error(e);
                        return false;
                            
                }
                    
                var divpage = $('page');
                var inner = misTET.resources.pages.parse(id);
                
                if (inner == "") {
                    divpage.innerHTML = "404 - Not found";
                    
                } else {
                        
                    try {
                        window.eval(inner);
                        
                    } catch (e) {
                        divpage.innerHTML = inner;
                    }
                    
                }
                Event.fire(document, ":change", id);
            },
            
            /* load an extern page(/res/files/stat) */
            loadGET: function (res, args) {
                    
                delete args.page;
                    
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
                    misTET.error("404 - Not found");
                }
                    
                return output;
            }
            
        },
        
        modules: {
            
            /* load modules.xml */
            load: function() {
                var path = '/res/files/modules.xml';
                var test = false;
                var error = false;
                
                new Ajax.Request(path, {
                    method: "get",
                    asynchronous: false,
                          evalJS: false,
                
                        onSuccess: function (http) {
                            if (test = misTET.utils.XMLtest(http.responseXML)) {
                                misTET['config']['modules'] = http.responseXML;
                            } else {
                                misTET.error(test)
                        }
                   },
                
                    onFailure: function (http) {
                        error             = new Error("Error while loading modules.xml");
                        error.name         = "modulesError";
                        error.fileName        = path;
                    }
                });
                /* Error... */
                if (error) {
                        misTET.error(error);
                }
            
                /* Parsing and loading */
                var file = misTET['config']['modules'].documentElement;
                var modules = file.getElementsByTagName('module');
            
                for (var i = 0; i < modules.length; i++) {
                        
                    var moduleName = modules[i].getAttribute('name');
                    
                    if (!moduleName) {
                        misTET.error('Error while parsing modules.xml');
                        return;
                    }
                    
                    $('page').innerHTML = "Loading [`#{module}`] [#{n}/#{tot}]".interpolate({
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
                                                
                    } catch (e) {
                                                
                        var error = new Error;
                        error.message = "Error while loading `#{name}`".interpolate({name: moduleName});
                         error.name = "Module loading error";
                         error.line = e.lineNumber;
                         error.filename = e.fileName;
                                                
                          misTET.error(error);
                                                
                    }
                }
            },
            
            checkDependencies: function () {
                                
                for (var module in misTET.modules) {
                    var needs = misTET.modules[module].needs;
                                        
                    if (needs) {
                        for (var i = 0; i < needs.length; i++) {
                            if (!misTET.resources.modules.exists(needs[i])) {
                                throw { module: module, needs: needs[i] };
                            }
                        }
                    }
                }
                                
                return true;
                    
            },
            
            exists: function (name) {
                return Boolean(misTET.modules[name]);
            },
                        
            create: function (name, object) {
                                
                if (!object) {
                    var error = new Error;
                                        
                    error.message = "what should `#{name}` do?".interpolate({name: name});
                    error.file = "#{root}/#{name}/#{name2}.js".interpolate({
                                        root: misTET.modFolder,
                                        name: name,
                                        name2: name
                                     });
                                        
                    misTET.error(error);
                    return false;
                }
                
                if (!name || !Object.isString(name)) {
                        
                    var e = new Error("not a string");
                    e.name = "module error";
                    e.file = "#{root}/#{name}/#{file}.js".interpolate({
                            root: misTET.modFolder,
                            name: name,
                            file: name
                    });
                    misTET.error(e);
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
                                
                /* uat? */
                if (!object.initialize) {
                    object.initialize = new Function();
                }
                                
                if (object.initialize) {
                    try {
                        object.initialize();
                    } catch (e) {
                        e.filename = "#{root}/#{name}.js".interpolate({
                                            root: object.root,
                                            name: name
                                            });
                        e.message = "Error while executing #{name}.initialize()".interpolate({name: object.name});
                        misTET.error(e);
                    }
                }
                misTET.modules[name] = object;
            }
                
        }
    },
    
    res: {
            
        create: function (name, obj) {
                    
            if (!obj) {
                var e = new Error("couldn't create misTET.res[#{name}] if you don't give an object".interpolate({name: name}));
                e.name = "resource error";
                misTET.error(e);
                return false;
            }
                    
            if (misTET.res.exists(name)) {
                    var e = new Error("misTET.res[\'#{name}\'] already exists".interpolate({name: name}));
                    e.name = "resource error";
                    misTET.error(e);
                    return false;
            }
                    
            for (var sel in obj) {
                if (Object.isFunction(obj[sel])) {
                    obj[name] = obj[name].bind(obj);
                } 
            }
                        
            obj.name = name;
                        
            misTET.res[name] = obj;
                    
        },
                
        del: function (name) {
                        
                if (!name || !Object.isString(name)) {
                        var e = new Error("couldn't delete a resource if you don't give a real name");
                        e.name = "resource error";
                        misTET.error(e);
                        return false;
                }
                        
                if (misTET.res.exists(name)) {
                    for (var key in misTET.res[name]) {
                    delete misTET.res[name][key];
                    }
                                
                    delete misTET.res[name];
                } else {
                                
                    var e = new Error("misTET.res[\'#{name}\'] is not defined".interpolate({name: name}));
                    e.name = "resource error";
                    misTET.error(e);
                    return false;
                                
                }
                        
                return Boolean(!Object.isset(misTET.res[name]));
                        
        },
                
        exists: function (name) {
                        
            if (!name) {
                var e = new Error("what resource?");
                e.name = "resource error";
                misTET.error(e);
                return false;
            }
                        
            return Boolean(misTET.res[name]);
                        
        }
            
    },
    
    /* Show a detailed output for errors */
    error: function (e) {
        var div = $('page');
        
        var string = "<br>#{name}:<br>#{message}<br>FILE: #{filename} @#{line}<br>".interpolate({
                name: e.name || "ERROR",
                message: e.message || "undefined message",
                filename: e.filename || e.fileName || e.file || "undefined file",
                line: e.line || e.lineNumber || "undefined line"
        });
        
        misTET._error = true;
        div.update(string);
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
                    method: "GET",
                    asynchronous: false,
 
                    onSuccess: function () {
                        result = true;
                    },
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
                        result = http.responseText;
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
                misTET.error(error);
               }
            
               return result;
        },
        
        XMLtest: function (xml) {
        
            var error = false;
            if (!xml) {
                error.message = "Sintax Error";
            }
            if (xml.documentElement.nodename = "parsererror") {
                error.message = xml.documentElement.textContent;
            }
            if (error) {
                return error;
            } else {
                return true;
            }
            
        },

        /* include a js file */
        include: function (path) {
        
            var result = null;
            
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    try {
                           window.eval(http.responseText);
                    } catch (error) { 
                        misTET.error(error);
                    }
                }
            });
       
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
                        misTET.error(e);
      
                        return false;
                }
                
                var matches = url.match(/[?#](.*)$/);
        
                if (!matches) {
                    return result;
                }
        
                var splitted = matches[1].split(/&/);
                for (var i = 0; i < splitted.length; i++) {
                           var parts = splitted[i].split(/=/);
                    var name = decodeURIComponent(parts[0]);
                    
                    if (parts[1]) {
                            result[name] = decodeURIComponent(parts[1]);
                    } else {
                            result[name] = true
                    }
                    
                }
        
                return result;
            }

    }
};

misTET.utils.include('res/utils.js');
