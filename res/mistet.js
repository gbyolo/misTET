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

function isset (obj) {
    return typeof(obj) != 'undefined';
};
function empty (string) {
    return string == "";
};

var misTET = {
    
    version: ["0", "5", "0"].join("."),
    
    modFolder: "/modules",
    modules: { },
    
    extern: "/res/files/stat/",
    
    /* start misTET */
    init: function () {
        
        
        if (misTET.initialized) {
            throw new Error("misTET has been already initialized.");
        }
        
        misTET.location = location.hash;
        misTET.initialized = false;
    
        eval('misTET.resources.init.load()');
        var ops = $('sd_left');
        var args = misTET.other.parseGET();
        var menuOk = true, pagesOk = true;
        ops.innerHTML = misTET['config']['loading'];
        
        try {
            misTET.resources.menu.load();
        } catch (e) {
            ops.innerHTML = e;
            menuOk = false;
        }
        
        if (menuOk) {
            try {
                misTET.resources.pages.load();
            } catch (e) {
                ops.innerHTML += e;
                pagesOk = false;
            }
        } 
        
        if (menuOk && pagesOk) {
            
            var divMenu = $('menu');
            divMenu.innerHTML = misTET.resources.menu.parse();

            misTET.resources.modules.load();
            
            misTET.go(misTET.location, args);
            
        }
        
        new PeriodicalExecuter(misTET.refresh, 0,1);
        
        misTET.initialized = true;
    },
    /* refresh */
    refresh: function () {

        if (misTET.location !== location.hash) {
            misTET.location = location.hash;
            misTET.go(location.hash, misTET.other.parseGET());
        } 

    },
    
    check: {
        
        /* html 4.01 */
        html: function (url) {
            location.href = "http://validator.w3.org/check?uri=" + url;
        },
        /* css */
        css: function (url) {
            location.href = "http://jigsaw.w3.org/css-validator/validator?uri=" + url;
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
    
    go: function (query, args) {
        if (empty(query)) {
            misTET.resources.pages.set(misTET['config']['home']);
        } else {
            
            if (!isset(args['page'])) {
                
                var href = query.match(/#\w+/);
                misTET.resources.pages.set(href[0].replace('#', ''));
                
            } else {
                
                var inner = misTET.resources.pages.loadGET(args['page'], args['lan']);
                $('sd_left').innerHTML = inner;
                
                if (isset(args['lan'])) {
                    
                    /* Sintax Highlighting */
                    SyntaxHighlighter.highlight();
                    
                } 
            }
        }
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
                        if (test = misTET.other.XMLtest(http.responseXML)) {
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
                    $('sd_left').innerHTML += error;
                }
                
                var init = misTET.config.init.documentElement;
                misTET['config']['home'] = init.getElementsByTagName('homePage')[0].firstChild.nodeValue;
                misTET['config']['loading'] = init.getElementsByTagName('loadMessage')[0].firstChild.nodeValue;
                misTET['config']['title'] = init.getElementsByTagName('title')[0].firstChild.nodeValue;
                if (!document.title) {
                    document.title = misTET['config']['title'];
                }
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
                            if (test = misTET.other.XMLtest(http.responseXML)) {
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
                    $('sd_left').innerHTML += error;
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
                        output += "\n\t\t<div class = \"menu\">\n\t\t\t<a href = \'#" + id + "\'>" + inner + "</a>\n\t\t</div>\n";

                    } else {
                        var sub = ""
                        var idPrincipale = menuValue[0].getAttribute('id');
                        var ciao = menuValue[0].firstChild.nodeValue;
                        output += "\n\t\t<div class = \"menu\">\n\t\t\t<a href = \'#" + idPrincipale+"\'>" + ciao + "</a>\n\t\t\t<div class = \"menu\">\n\t\t\t\t";

                        /* Scan all the sub menus */
                        for (var j = 1; j < menuValue.length; j++) {
                            var idSub = menuValue[j].getAttribute('id');
                            var inner2 = menuValue[j].firstChild.nodeValue;
                            output += "<a class = \'menu_element\' href = \'#" + idSub + "\'><div class = \"\">" + inner2 + "</div></a>\n\t\t\t\t";

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
                            if (test = misTET.other.XMLtest(http.responseXML)) {
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
                    $('sd_left').innerHTML += error;
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
                                    var lan = list[j].getAttribute('lan') || "";
                                    var after = list[j].getAttribute('after');
                                
                                    if (lan != "") {
                                        output +=     "<a href = \'#"+id+"&page="+href+"&lan="+lan+"\' " +
                                                    ">" + list[j].getAttribute('text')+"</a>"+after+"<br>";
                                    
                                    } else if (lan == "") {
                                        output +=     "<a href = \'#"+id+"&page="+href+"\' >" +
                                                    list[j].getAttribute('text')+"</a>"+after+"<br>";
                                        }    
                                } else if (list[j].nodeName == "text") { 
                                    var href = list[j].getAttribute('href');
                                    var lan = list[j].getAttribute('lan') || "";
                                    if (misTET.other.isFile(misTET.extern+href)) {
                                        var inner = misTET.other.encorp(misTET.extern+href);
                                        if (lan == "") {
                                            output += "<pre>" + inner + "</pre>";
                                        } else if (lan != ""){
                                            output += misTET.resources.pages.loadGET(misTET.extern+href, lan);
                                            /* Sintax Highlighting */
                                            SyntaxHighlighter.highlight();
                                        }
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
                var divpage = $('sd_left');
                var inner = misTET.resources.pages.parse(id);
                if (inner == "") {
                    divpage.innerHTML = "404 - Not found";
                } else {
                    try {
                        window.eval(inner);
                    } catch (e) {
                        divpage.innerHTML = inner;
                        if (inner.match(/brush: (.+);/i)) {
                            SyntaxHighlighter.highlight();
                        }
                    }
                }
            },
            
            /* load an extern page, specify lan argument if you want to include a source */
            loadGET: function (res, lan) {
        
                var language = lan || "";
                var div = $('sd_left');
                var output = "";
            
                if (language == "") {
                    if (misTET.other.isFile(res)) {
                        var inner = misTET.other.encorp(res);
                        output = "<pre>"+inner+"</pre>";
                    } else {
                        misTET.error("404 - Not found");
                    }
                
                } else {
                
                    /* Languages aliases */
                    var langs = {    
                            'bash'       : 'Bash', 
                            'cpp'         : 'Cpp', 
                            'c'             : 'Cpp',
                            'c#'           : 'CSharp', 
                            'css'         : 'Css', 
                            'delphi'      : 'Delphi', 
                            'java'         : 'Java',
                            'js'            : 'JScript', 
                            'jscript'      : 'JScript',
                            'javascript' : 'JSCript',
                            'php'         : 'Php', 
                            'python'     : 'Python', 
                            'py'           : 'Python',
                            'ruby'        : 'Ruby', 
                            'rb'            : 'Ruby',
                            'sql'           : 'Sql', 
                            'vb'            : 'Vb', 
                            'xml'          : 'Xml' 
                    };
                    if (misTET.other.isFile(res)) {            
                        if (language in langs) {
                    
                            misTET.other.include(misTET['modFolder']+'/sintax/scripts/shBrush'+langs[lan]+".js");
                    
                            var file = misTET.other.encorp(res);    
                            var inner = "<pre class = 'brush: "+lan+";'>"+file+"</pre>";
                            output = inner;
                    
                            /* Well, just fuck that */
                            SyntaxHighlighter.vars.discoveredBrushes = {};
                    
                            var brush = "";
                            /* scan all brushes */
                            for (brush in SyntaxHighlighter.brushes) {
                                /* alias copying */                                        
                                var alias = SyntaxHighlighter.brushes[brush].aliases;

                                    /* scan all aliases */
                                    for (var scan = 0; scan < alias.length; scan++) {
                                        SyntaxHighlighter.vars.discoveredBrushes[alias[scan]] = brush;
                                    }
                            }
                            /* End */
                        
                            /* prepare the specified brush */
                            SyntaxHighlighter.defaults["brush"] = langs[lan];
                    
                        /* mah */
                        } else {
                            div.innerHTML = 'Error while loading source. Please specify one of the following languages:<br><br>';
                    
                            for (l in langs) {
                                div.innerHTML += "&nbsp;"+l+"<br>";
                            }
                        }
                    } else {
                        misTET.error("404 - Not found");
                    }    
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
                            if (test = misTET.other.XMLtest(http.responseXML)) {
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
                    $('sd_left').innerHTML += error;
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
                    $('sd_left').innerHTML = "Loading [`" + moduleName + "`]";
                    include(misTET.modFolder + "/" + moduleName + "/" + moduleName + ".js");
                    misTET.modules[moduleName].initialize();
                }
            }
                
        }
    },
    
    error: function (message) {
        $('sd_left').innerHTML = message+'<br><br';
    },
    
    other: {
        
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
                throw error;
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
 
            if (misTET.other.isFile(path)) {
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
        
           /* parse GET arguments */
        parseGET: function () {
        
            var args = new Array();
            var query = location.hash;
            
            if (query) {
                var strList = query.split('&');
                
                for (var i=0; i<strList.length; i++) {
                    var ok = strList[i];
                    
                    if (ok.match(/#\w+/) == null) { 
                        var parts = ok.split('=');
                        args[unescape(parts[0])] = unescape(parts[1]);
                        
                    } else {
                        continue;
                    }
                }
            }
            return args;
        }

    }
};

var include = misTET.other.include;
