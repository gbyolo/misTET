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
	
	versione: "0.2.0",
	
	/* Inizializza misTET */
	init: function () {
	
		eval('misTET.risorse.carica.init()');
		var ops = $('pagina');
		var args = misTET.altro.parseGET();
		var menuOk = true, pagineOk = true;
		ops.innerHTML = misTET.files.caricamento;
		
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
			var divPagina = $('pagina');
			var hash = window.location.hash;
			
			if (hash == "") {
				divPagina.innerHTML = misTET.risorse.parsa.pagina(misTET.files.home);
			} else {
				/* Non c'e' nessuna pagina da includere */
				if (args['page'] == null) {
					/* Elimina caratteri superflui */
					var href = hash.match(/#\w+/);
					/* Carica la pagina */
					divPagina.innerHTML = misTET.risorse.parsa.pagina(href[0].replace('#', ''));
				} else {
					/* Ti piace usare i sources eh? */
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
		pagine: { },
		inizio: { },
		caricamento: { },
		home: { },
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
						misTET.files.menu = xmlDoc;
					}
					
				} else {
				new Ajax.Request(path, {
					method: "get",
					asynchronous: false,
             	   			evalJS: false,
                
             	   			onSuccess: function (http) {
              	      				if (test = misTET.altro.XMLtest(http.responseXML)) {
              	      					misTET.files.inizio = http.responseXML;
              	      				} else {
                                    }
               	   			},
                
                			onFailure: function (http) {
                    				error			 = new Error("Impossibile ricevere il file di inizio");
                                    error.name		 = "initEttor";
                    				error.fileName   = path;
                			}
            			});
            			/* c'e' un errore nella ricezione del file di inizio */
            			if (error) {
							$('pagina').innerHTML += error;
						}
				}
				var inizio = misTET.files.inizio.documentElement;
				misTET.files.home = inizio.getElementsByTagName('homePage')[0].firstChild.nodeValue;
				misTET.files.caricamento = inizio.getElementsByTagName('caricamento')[0].firstChild.nodeValue;
			},
			
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
              	      				if (test = misTET.altro.XMLtest(http.responseXML)) {
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
							if (test = misTET.altro.XMLtest(http.responseXML)) {
								misTET.files.pagine = http.responseXML;
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
				var len = Menu.getElementsByTagName('menu');
				var output = "";
				
				for (var i = 0; i < len.length; i++) {
					/* Il primo nodo text e' la voce menu, i seguenti sono i submenu */
					var menuValue = len[i].getElementsByTagName('text');
					/* Abbiamo solo un nodo text, menu semplice */
					if (menuValue.length == 1) {
						var id = menuValue[0].getAttribute('id');
						var inner = menuValue[0].firstChild.nodeValue;
						output += "\n\t\t<div class = \"menu\">\n\t\t\t<a class = \"link\" href = \'#"+id+"\' onClick = \'misTET.risorse.set.pagina(\""+id+"\");\'>"+inner+"</a>\n\t\t</div>\n";
					} else {
						var sub = ""
						var idPrincipale = menuValue[0].getAttribute('id');
						var ciao = menuValue[0].firstChild.nodeValue;
						output += "\n\t\t<div class = \"menu\">\n\t\t\t<a class = \"link\" href = \'#"+idPrincipale+"\' onClick = \'misTET.risorse.set.pagina(\""+idPrincipale+"\");\'>"+ciao+"</a>\n\t\t\t<div class = \"menu\">\n\t\t\t\t";
						/* Scorre i sub menu */
						for (var j = 1; j < menuValue.length; j++) {
							var idSub = menuValue[j].getAttribute('id');
							var inner2 = menuValue[j].firstChild.nodeValue;
							output += "<a class = \'element\' href = \'#"+idSub+"\' onClick = \'misTET.risorse.set.pagina(\""+idSub+"\");\'><div class = \"\">"+inner2+"</div></a>\n\t\t\t\t";
						}
						output += "</div>\n\t\t</div>";
					}
				}
				output += "\t";
				
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
									output += list[j].nodeValue;
									
								} else if (list[j].nodeName == "go") {
									var href = list[j].getAttribute('href');
									var lan = list[j].getAttribute('lan') || "";
									
									if (lan != "") {
										output += "<a href = \'#"+id+"&page="+href+"&lan="+lan+"\' onClick = \'misTET.risorse.loadPageGET(\""+href+"\", \""+lan+"\");\'>"+list[j].getAttribute('testo')+"</a><br>";
									
									} else if (lan == "") {
										output += "<a href = \'#"+id+"&page="+href+"\' onClick = \'misTET.risorse.set.pagina(\""+href+"\");\'>"+list[j].getAttribute('testo')+"</a><br>";
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
				var divPagina = $('pagina');
				divPagina.innerHTML = inner;
				
			}
		},
		
		/* Carica una pagina con gli argomenti inviati tramite GET */
		loadPageGET: function (res, lan) {
		
			var linguaggio = lan || "";
			var div = $('pagina');
			div.innerHTML = misTET.files.caricamento;
			
			if (linguaggio == "") {
				var inner = misTET.altro.importa(res);
				div.innerHTML = "<pre>"+inner+"</pre>";
				
			} else {
				
				/* Alias dei vari linguaggi */
				var langs = {	
								'bash'		: 'Bash', 
								'cpp' 		: 'Cpp', 
								'c'			: 'Cpp',
								'c#' 		: 'CSharp', 
								'css' 		: 'Css', 
								'delphi' 	: 'Delphi', 
								'java' 		: 'Java',
								'js' 		: 'JScript', 
								'jscript' 	: 'JScript',
								'javascript': 'JSCript',
								'php' 		: 'Php', 
								'python' 	: 'Python', 
								'py'		: 'Python',
								'ruby' 		: 'Ruby', 
								'rb'		: 'Ruby',
								'sql' 		: 'Sql', 
								'vb' 		: 'Vb', 
								'xml' 		: 'Xml' 
							};
								
				if (linguaggio in langs) {
					
					/* Include il file js che occorre */
					misTET.altro.include('/Sintax/scripts/shBrush'+langs[lan]+".js");
					
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
			}
		}
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
		
		/* richiama un file */
		/* Copyright meh, meh.ffff@gmail.com */
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
		/* Copyright meh, meh.ffff@gmail.com */
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
