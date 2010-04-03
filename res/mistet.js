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
	
	versione: "0.3.8",
	
	modules: "/modules",
	
	extern: "/res/files/stat/",
	
	/* Inizializza misTET */
	init: function () {
		
		if (misTET.initialized) {
			throw new Error("misTET è stato già caricato");
		}
		
		misTET.location = window.location.hash;
		misTET.initialized = false;
	
		eval('misTET.risorse.carica.init()');
		var ops = $('sd_left');
		var args = misTET.altro.parseGET();
		var menuOk = true, pagineOk = true;
		ops.innerHTML = misTET['config']['caricamento'];
		
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
			var divMenu = $('menu');
			divMenu.innerHTML = misTET.risorse.parsa.menu();

			var divPagina = $('sd_left');
			
			if (misTET.location == "") {
				misTET['risorse'].set.pagina(misTET['config']['home']);
			} else {
				/* Non c'e' nessuna pagina da includere */
				if (args['page'] == null) {
					/* Elimina caratteri superflui */
					var href = misTET.location.match(/#\w+/);
					/* Carica la pagina */
					misTET.risorse.set.pagina(href[0].replace('#', ''));
				} else {
					misTET.risorse.loadPageGET(args['page'], args['lan']);
				}
			}
			
		}
		
		/* Yeah! */
		window.setInterval(misTET.refresh, 100);
		/* Inizializzato */
        	misTET.initialized = true;
	},
	
	refresh: function () {
		if (misTET.location != window.location.hash) {
			misTET.location = window.location.hash;
			var args = misTET.altro.parseGET();
			if (args['page'] == null) {
				var href = misTET.location.match(/#\w+/);
				misTET.risorse.set.pagina(href[0].replace('#', ''));
			} else {
				misTET.risorse.loadPageGET(args['page'], args['lan']);
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
	/* Files principali */
	config: {
		menu: { },
		pagine: { },
		inizio: { },
		caricamento: { },
		home: { },
		title: { },
	},
	risorse: {
		carica: {
			
			/* Carica gli argomenti di inizio */
			init: function () {
				var path = '/res/files/init.xml';
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
						misTET['config']['menu'] = xmlDoc;
					}
					
				} else {
					new Ajax.Request(path, {
						method: "get",
						asynchronous: false,
             	   				evalJS: false,
                
             	   				onSuccess: function (http) {
              	      					if (test = misTET.altro.XMLtest(http.responseXML)) {
              	      						misTET['config']['inizio'] = http.responseXML;
              	      					} else {
              	      						misTET.error(test)
                                    			}
               	   				},
                
                				onFailure: function (http) {
                    					error			 = new Error("Impossibile ricevere il file di inizio");
                                   			error.name		 = "initEttor";
                    					error.fileName   	 = path;
                				}
            				});
            				/* c'e' un errore nella ricezione del file di inizio */
            				if (error) {
						$('sd_left').innerHTML += error;
					}
				}
				var inizio = misTET.config.inizio.documentElement;
				misTET['config']['home'] = inizio.getElementsByTagName('homePage')[0].firstChild.nodeValue;
				misTET['config']['caricamento'] = inizio.getElementsByTagName('caricamento')[0].firstChild.nodeValue;
				misTET['config']['title'] = inizio.getElementsByTagName('title')[0].firstChild.nodeValue;
				if (!document.title) {
					document.title = misTET['config']['title'];
				}
			},
			
			/* carica il file del menu, e lo salva in misTET.config.menu */
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
						misTET['config']['title'] = xmlDoc;
					}
					
				} else {
					new Ajax.Request(path, {
						method: "get",
						asynchronous: false,
             	   				evalJS: false,
                
             	   				onSuccess: function (http) {
              	      					if (test = misTET.altro.XMLtest(http.responseXML)) {
              	      						misTET['config']['menu'] = http.responseXML;
              	      					} else {
              	      						misTET.error(test)
                                    			}
               	   				},
                
                				onFailure: function (http) {
                    					error			 = new Error("Impossibile ricevere il file dei menu");
                                    			error.name		 = "MenuError";
                    					error.fileName   	 = path;
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
			
			/* Carica il file delle pagine, e lo salva in misTET.config.pagine */
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
						misTET['config']['pagine'] = xmlDoc;
					}
					
				} else {
					new Ajax.Request(path, {
						method: "get",
						asynchronous: false,
						evalJS: false,
					
						onSuccess: function (http) {
							if (test = misTET.altro.XMLtest(http.responseXML)) {
								misTET['config']['pagine'] = http.responseXML;
							} else {
								misTET.error(test);
							}
						},
					
						onFailure: function (http) {
							error				= new Error("Impossibile ricevere il file delle pagine");
							error.name			= "PagineError";
							error.fileName 			= path;
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
	
				var Menu = misTET['config']['menu'].documentElement;
				var len = Menu.getElementsByTagName('menu');
				var output = "";
				
				for (var i = 0; i < len.length; i++) {
					/* Il primo nodo text e' la voce menu, i seguenti sono i submenu */
					var menuValue = len[i].getElementsByTagName('text');
					/* Abbiamo solo un nodo text, menu semplice */
					if (menuValue.length == 1) {
						var id = menuValue[0].getAttribute('id');
						var inner = menuValue[0].firstChild.nodeValue;
						output += "\n\t\t<div class = \"menu\">\n\t\t\t<a href = \'#" + id + "\'>" + inner + "</a>\n\t\t</div>\n";

					} else {
						var sub = ""
						var idPrincipale = menuValue[0].getAttribute('id');
						var ciao = menuValue[0].firstChild.nodeValue;
						output += "\n\t\t<div class = \"menu\">\n\t\t\t<a href = \'#" + idPrincipale+"\'>" + ciao + "</a>\n\t\t\t<div class = \"menu\">\n\t\t\t\t";

						/* Scorre i sub menu */
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
			},
			
			/* Parsa il file XML delle pagine per trovare il contenuto della pagina con id specificato */
			pagina: function (id) {

				var pagineXML = misTET['config']['pagine'].documentElement;
				var output = "";
				var pagine = pagineXML.getElementsByTagName('page');
				var code = "";
				
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
									code = list[j].nodeValue;
									output += code;
								} else if (list[j].nodeName == "go") {
									var href = list[j].getAttribute('href');
									var lan = list[j].getAttribute('lan') || "";
									var dopo = list[j].getAttribute('dopo');
								
									if (lan != "") {
										output += 	"<a href = \'#"+id+"&page="+href+"&lan="+lan+"\' " +
												    ">" + list[j].getAttribute('testo')+"</a>"+dopo+"<br>";
									
									} else if (lan == "") {
										output += 	"<a href = \'#"+id+"&page="+href+"\' >" +
													list[j].getAttribute('testo')+"</a>"+dopo+"<br>";
										}	
								} else if (list[j].nodeName == "text") { 
									var href = list[j].getAttribute('href');
									var lan = list[j].getAttribute('lan') || "";
									if (misTET.altro.isFile(misTET.extern+href)) {
										var inner = misTET.altro.importa(misTET.extern+href);
										if (lan == "") {
											output += "<pre>" + inner + "</pre>";
										} else {
											
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
			}
		},
		set: {
			
			/* Inserisce il contenuto della pagina in index.html */
			pagina: function (id) {
				var divPagina = $('sd_left');
				var inner = misTET.risorse.parsa.pagina(id);
				if (inner == "") {
					divPagina.innerHTML = "404 - Not found";
				} else {
					try {
						window.eval(inner);
					} catch (e) {
						divPagina.innerHTML = inner;
					}
				}
			}
		},
		
		/* Carica una pagina con gli argomenti inviati tramite GET */
		loadPageGET: function (res, lan) {
		
			var linguaggio = lan || "";
			var div = $('sd_left');
			div.innerHTML = misTET['config']['caricamento'];
			
			if (linguaggio == "") {
				if (misTET.altro.isFile(res)) {
					var inner = misTET.altro.importa(res);
					if (eval(inner)) { } else {
						div.innerHTML = "<pre>"+inner+"</pre>";
					}
				} else {
					misTET.error("404 - Not found");
				}
				
			} else {
				
				/* Alias dei vari linguaggi */
				var langs = {	
						'bash'		: 'Bash', 
						'cpp' 		: 'Cpp', 
						'c'		: 'Cpp',
						'c#' 		: 'CSharp', 
						'css' 		: 'Css', 
						'delphi' 	: 'Delphi', 
						'java' 		: 'Java',
						'js' 		: 'JScript', 
						'jscript' 	: 'JScript',
						'javascript'	: 'JSCript',
						'php' 		: 'Php', 
						'python' 	: 'Python', 
						'py'		: 'Python',
						'ruby' 		: 'Ruby', 
						'rb'		: 'Ruby',
						'sql' 		: 'Sql', 
						'vb' 		: 'Vb', 
						'xml' 		: 'Xml' 
						};
				if (misTET.altro.isFile(res)) {			
					if (linguaggio in langs) {
					
						/* Include il file js che occorre */
						misTET.altro.include(misTET['modules']+'/sintax/scripts/shBrush'+langs[lan]+".js");
					
						/* Importa il file da mostrare e lo inserisce */
					
						var file = misTET.altro.importa(res);	
						var inner = "<pre class = 'brush: "+lan+";'>"+file+"</pre>";
						div.innerHTML = inner;
					
						/* Devo solo dire FANCULO a questo spezzone di codice, mi ha torturato di brutto! */
						SyntaxHighlighter.vars.discoveredBrushes = {};
					
						var brush = "";
						/* Cicla i brushes rispetto al file .js incluso */
                    				for (brush in SyntaxHighlighter.brushes) {
                    					/* Crea una copia degli alias */                        				
                    					var alias = SyntaxHighlighter.brushes[brush].aliases;

                        				/* Scorre gli alias, e dice al core del sh di aggiungere i determinati alias */
                        				for (var cicla = 0; cicla < alias.length; cicla++) {
                            					SyntaxHighlighter.vars.discoveredBrushes[alias[cicla]] = brush;
                        				}
                   				}
                    				/* Fine spezzone FANCULO */
               	 	
                    				/* Setta il brush(dopo aver settato l'alias in discoveredBrushes */
						SyntaxHighlighter.defaults["brush"] = langs[lan];
						/* Esegue il Sintax Highlighting */
						SyntaxHighlighter.highlight();
					
					/* Sei gay, non usare il Sintax Highlighting */
					} else {
						div.innerHTML = 'Errore nel caricamento source. Specificare un linguaggio corretto<br>Linguaggi disponibili:<br><br>';
					
						for (l in langs) {
							div.innerHTML += "&nbsp;"+l+"<br>";
						}
					}
				} else {
					misTET.error("404 - Not found");
				}	
			}
		}
	},
	error: function (message) {
		/* Inseriamo l'errore in $('sd_left') */
		$('sd_left').innerHTML = message+'<br><br';
	},
	altro: {
		
		/* Ritorna true se il browser e' IE, false se non e' IE */
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
		XMLtest: function (xml) {
		
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
                    			} catch (error) { 
                    				misTET.error(error);
                    			}
                		}
            		});
       
        	},
        
       	/* parsa gli argomenti inviati tramite GET */
		parseGET: function () {
		
			var args = new Array();
			var query = misTET.location;
			
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
