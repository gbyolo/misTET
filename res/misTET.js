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
	
	versione: "0.1.9",
	
	/* Inizializza misTET */
	init: function () {
	
		var ops = document.getElementById('pagina');
		var args = misTET.altro.parseGET();
		var menuOk = true, pagineOk = true;
		ops.innerHTML = 'Caricamento';
		
		try {
			misTET.risorse.carica.menu();
		} catch (e) {
			ops.innerHTML = e;
			menuOk = false;
		}
		
		if (menuOk) {
			try {
				misTET.risorse.carica.pagine();
			} catch (e) {
				ops.innerHTML += e;
				pagineOk = false;
			}
		} 
		
		if (menuOk && pagineOk) {
			/* Nessun errore nel caricamento di menu e pagine, procedo al caricamento nella pagina */
			var divMenu = document.getElementById('menu');
			divMenu.innerHTML = misTET.risorse.parsa.menu();
			var divPagina = document.getElementById('pagina');
			var hash = window.location.hash;
			
			if (hash == "") {
				divPagina.innerHTML = misTET.risorse.parsa.pagina('home');
			} else {
				if (args['page'] == null) {
					var href = hash.match(/#\w+/);
					divPagina.innerHTML = misTET.risorse.parsa.pagina(href[0].replace('#', ''));
				} else {
					misTET.risorse.loadPageGET(args['page'], args['lan']);
				}
			}
			
		}
	},
	
	check: {
		
		/* Validita' html 4.01 */
		html: function (url) {
			location.href = "http://validator.w3.org/check?uri=" + url;
		},
		/* Validita' css */
		css: function (url) {
			location.href = "http://jigsaw.w3.org/css-validator/validator?uri=" + url;
		}
	},
	/* Files del menu e delle pagine */
	files: {
		menu: { },
		pagine: { }
	},
	risorse: {
		carica: {
			
			/* carica il file del menu, e lo salva in misTET.files.menu */
			menu: function () {
			
				var path = '/res/files/menu.xml';
				var test = false;
				var error = false;
				
				if (misTET.altro.isIE()) {
					var XmlDoc = new XMLHttpRequest();
					
					if (!XmlDoc) {
						return false;
					}	
					
					XmlDoc.open("GET", path, false);
					XmlDoc.send(null);
					
					if (XmlDoc.readyState == 4) {
						var xmlDoc = XmlDoc.responseXML;
						misTET.files.menu = xmlDoc;
					}
					
				} else {
				new Ajax.Request(path, {
					method: "get",
					asynchronous: false,
             	   			evalJS: false,
                
             	   			onSuccess: function (http) {
              	      				if (test = misTET.altro.XMLtest(http.responseXML, path)) {
              	      					misTET.files.menu = http.responseXML;
              	      				} else {
						}
               	   			},
                
                			onFailure: function (http) {
                    				error			 = new Error("Impossibile ricevere il file dei menu");
						error.name		 = "MenuError";
                    				error.fileName   = path;
                			}
            			});
            			/* c'e' un errore nella ricezione del file menu */
            			if (error) {
            				/* genero un eccezione di tipo error */
					throw error;
				}
				return true;
				}
			},
			
			/* Carica il file delle pagine, e lo salva in misTET.files.pagine */
			pagine: function() {
			
				var path = '/res/files/pagine.xml';
				var test = false;
				var error = false;
				
				if (misTET.altro.isIE()) {
				
					var XmlDoc = new XMLHttpRequest();
					
					if (!XmlDoc) {
						return false;
					}	
					
					XmlDoc.open("GET", path, false);
					XmlDoc.send(null);
					
					if (XmlDoc.readyState == 4) {
						var xmlDoc = XmlDoc.responseXML;
						misTET.files.pagine = xmlDoc;
					}
					
				} else {
					new Ajax.Request(path, {
						method: "get",
						asynchronous: false,
						evalJS: false,
					
						onSuccess: function (http) {
							if (test = misTET.altro.XMLtest(http.responseXML, path)) {
								misTET.files.pagine = http.responseXML;
							} else {
							}
						},
					
						onFailure: function (http) {
							error				= new Error("Impossibile ricevere il file delle pagine");
							error.name			= "PagineError";
							error.fileName 		= path;
						}
					});
					/* c'e' un errore nella ricezione del file pagine */
					if (error) {
						/* genero un eccezione di tipo error */
						throw error;
					}
					return true;
				}
			}
		},
		parsa: {
			
			/* Parsa il file dei menu creando una stringa menu */
			menu: function (id) {
			
				var Menu = misTET.files.menu.documentElement;
				var len = Menu.getElementsByTagName('text');
				var output = "";
				
				for (var i = 0; i < len.length; i++) {
					var inner = len[i].firstChild.nodeValue;
					var id = len[i].getAttribute('id');
					output += "\t<a class = \'elemento\' href = \'#"+id+"\' onClick = \'misTET.risorse.set.pagina(\""+id+"\");\'>"+inner+"</a>\n\t\t";
				}
				
				return output;
			},
			
			/* Parsa il file XML delle pagine per trovare il contenuto della pagina con id specificato */
			pagina: function (id) {
			
				var pagineXML = misTET.files.pagine.documentElement;
				var output = "";
				var pagine = pagineXML.getElementsByTagName('page');
				
				for (var i = 0; i < pagine.length; i++) {
					if (pagine[i].getAttribute('id') == id) {
						var list = pagine[i].childNodes;
						/* Si tratta di testo normale */
						if (list.length == 1) {
							output = pagine[i].firstChild.nodeValue;
						} else {
						/* Sezione cdata */
							for (var j = 0; j < list.length; j++) {
							
								if (list[j].nodeName == "#cdata-section") {
									output = list[j].nodeValue;
									
								} else if (list[j].nodeName == "go") {
									var href = list[j].getAttribute('href');
									var lan = list[j].getAttribute('lan') || "";
									var file = misTET.altro.importa(href);
									
									if (lan != "") {
										output = "<a href = \'#"+id+"&page="+href+"&lan="+lan+"\' onClick = \'misTET.risorse.loadPageGET(\""+href+"\", \""+lan+"\");\'>"+list[j].getAttribute('testo')+"</a>";
									
									} else if (lan == "") {
										output = "<a href = \'#"+id+"&page="+href+"\' onClick = \'misTET.risorse.set.pagina(\""+href+"\");\'>"+list[j].getAttribute('testo')+"</a>";
									}	
								}
							}
						}
					}
				}
			return output;
			}
		},
		set: {
			
			/* Inserisce il contenuto della pagina in index.html */
			pagina: function (id) {
			
				var inner = misTET.risorse.parsa.pagina(id);
				var divPagina = document.getElementById('pagina');
				divPagina.innerHTML = inner;
				
			}
		},
		
		/* Carica una pagina con gli argomenti inviati tramite GET */
		loadPageGET: function (res, lan) {
		
			var linguaggio = lan || "";
			var div = document.getElementById('pagina');
			div.innerHTML = "Caricamento pagina...";
			
			if (linguaggio == "") {
				var inner = misTET.altro.importa(res);
				div.innerHTML = "<pre>"+inner+"</pre>";
				
			} else {
				var langs = {	'bash' : 'Bash', 
								'cpp' : 'Cpp', 
								'c#' : 'CSharp', 
								'css' : 'Css', 
								'delphi' : 'Delphi', 
								'java' : 'Java',
								'js' : 'JScript', 
								'php' : 'Php', 
								'python' : 'Python', 
								'ruby' : 'Ruby', 
								'sql' : 'Sql', 
								'vb' : 'Vb', 
								'xml' : 'Xml' };
								
				if (linguaggio in langs) {
					var file = misTET.altro.importa(res);
					
					misTET.altro.include('/Sintax/scripts/shBrush'+langs[lan]+".js");
					
					var inner = "<pre class = 'brush: "+linguaggio+";'>"+file+"</pre>";
					div.innerHTML = inner;
					SyntaxHighlighter.defaults["brush"] = langs[lan];
					SyntaxHighlighter.highlight();
					
				} else {
					div.innerHTML = 'Errore nel caricamento source. Specificare un linguaggio corretto<br>Linguaggi disponibili:<br><br>';
					
					for (l in langs) {
						div.innerHTML += "&nbsp;"+langs[l]+"<br>";
					}
				}
			}
		}
	},
	altro: {
		isIE: function () {
			if (Prototype.Browser.IE) {
				return true;
			} else {
				return false;
			}
		},
		/* richiama un file */
		importa: function (path) {
		
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
                        error.lineNumber -= 5;
                    }
                },
                
                onFailure: function (http) {
                    error            = new Error("Impossibile ricevere il file (#{status} - #{statusText}).".interpolate(http));
                    error.fileName   = path;
                    error.lineNumber = 0;
                }
            });

            if (error) {
                throw error;
            }
            
            return result;
		},
		
		/* effettua un test di validita' del file xml */
		XMLtest: function (xml, path) {
		
			var error = false;
			if (!xml) {
				error.message = "C'e' un errore di sintassi";
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

		/* include un file .js */
		include: function (path) {
		
			var result = null;
            
            new Ajax.Request(path, {
                method: "get",
                asynchronous: false,
                evalJS: false,
                
                onSuccess: function (http) {
                    try {
                        window.eval(http.responseText);
                    } catch (error) { }
                }
            });
       
        },
        
        /* parsa gli argomenti inviati tramite GET */
		parseGET: function () {
		
			var args = new Array();
			var query = window.location.hash;
			
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
}
