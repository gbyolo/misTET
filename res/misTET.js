/****************************************************************************
 * Copyright (C) <2010>  <lostpassword>                                     *
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
	
	versione: "0.3.2",
	
	modules: "/modules",
	
	/* Inizializza misTET */
	init: function () {
	
		eval('misTET.risorse.carica.init()');
		var ops = $('sd_left');
		var args = misTET.altro.parseGET();
		var menuOk = true, pagineOk = true;
		ops.innerHTML = misTET['files']['caricamento'];
		
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
			var divMenu = $('nav');
			divMenu.innerHTML = misTET.risorse.parsa.menu();
			
			/* MenuMatic */
			window.addEvent('domready', function() {			
				var myMenu = new MenuMatic();
			});	

			var divPagina = $('sd_left');
			/* Oh my god! */
			var hash = window.location.hash;
			
			if (hash == "") {
				misTET.risorse.set.pagina(misTET['files']['home']);
			} else {
				/* Non c'e' nessuna pagina da includere */
				if (args['page'] == null) {
					/* Elimina caratteri superflui */
					var href = hash.match(/#\w+/);
					/* Carica la pagina */
					misTET.risorse.set.pagina(href[0].replace('#', ''));
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
	/* Files principali */
	files: {
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
				var ok = false;
				
				if (jQuery.browser['msie']) {
					misTET.error('Only Mozilla');
				} else {
					
					jQuery.ajax({
						type: 'GET',
						url: path,
						dataType: 'xml',
						success: misTET.risorse.init
					});
					
				}
			},
			
			/* carica il file del menu, e lo salva in misTET.files.menu */
			menu: function () {
			
				var path = '/res/files/menu.xml';
				var test = false;
				var error = false;
				
				
				if (jQuery.browser['msie']) {
					misTET.error('Only Mozilla');
				} else {
					jQuery.ajax({
						type: 'GET',
						url: path,
						dataType: 'xml',
						success: misTET.risorse.initMenu
					});
	
				} 
			},
			
			/* Carica il file delle pagine, e lo salva in misTET.files.pagine */
			pagine: function() {
			
				var path = '/res/files/pagine.xml';
				var test = false;
				var error = false;
								
				if (jQuery.browser['msie']) {
					misTET.error('Only Mozilla');
				} else {
					jQuery.ajax({
						type: 'GET',
						url: path,
						dataType: 'xml',
						success: misTET.risorse.initPagine
					});
				}

			}
		},
		
		/* Funzioni di loading dei file XML */		
		init: function (xml) {
			misTET.files.home = jQuery(xml).find('home').text();
			misTET.files.caricamento = jQuery(xml).find('caricamento').text();
			misTET.files.title = jQuery(xml).find('title').text();
			$$('title')[0].innerHTML = misTET['files']['title'];
		},
		
		initMenu: function (xml) {
			misTET['files']['menu'] = xml;
		},
		
		initPagine: function (xml) {
			misTET['files']['pagine'] = xml;
		},
		
		parsa: {
			
			/* Parsa il file dei menu creando una stringa menu */
			menu: function () {
	
				var Menu = misTET['files']['menu'].documentElement;
				var len = Menu.getElementsByTagName('menu');
				var output = "";
				
				for (var i = 0; i < len.length; i++) {
					/* Il primo nodo text e' la voce menu, i seguenti sono i submenu */
					var menuValue = len[i].getElementsByTagName('text');
					/* Abbiamo solo un nodo text, menu semplice */
					if (menuValue.length == 1) {
						var id = menuValue[0].getAttribute('id');
						var inner = menuValue[0].firstChild.nodeValue;
						output += 	"\n<li><a href = \'#" +
								id+"\' onClick = \'misTET.risorse.set.pagina(\""+id+"\");\'>"+inner +
								"</a></li>\n";
					} else {
						var sub = ""
						var idPrincipale = menuValue[0].getAttribute('id');
						var ciao = menuValue[0].firstChild.nodeValue;
						output += 	"\n<li><a href = \'#"+idPrincipale +
								"\' onClick = \'misTET.risorse.set.pagina(\""+idPrincipale+"\");\'>"+ciao +
								"</a>\n<ul>\n";
						/* Scorre i sub menu */
						for (var j = 1; j < menuValue.length; j++) {
							var idSub = menuValue[j].getAttribute('id');
							var inner2 = menuValue[j].firstChild.nodeValue;
							output += 	"<li><a href = \'#"+idSub +
									"\' onClick = \'misTET.risorse.set.pagina(\"" +
									idSub+"\");\'>"+inner2+"</a></li>\n";
						}
						output += "</ul></li>";
					}
				}
				output += "";
				
				return output;
			},

			
			/* Parsa il file XML delle pagine per trovare il contenuto della pagina con id specificato */
			pagina: function (id) {

				var pagineXML = misTET.files.pagine.documentElement;
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
												"onClick = \'misTET.risorse.loadPageGET(\""+href+"\", \""+lan+"\");\'>" +
												list[j].getAttribute('testo')+"</a>"+dopo+"<br>";
									
									} else if (lan == "") {
										output += 	"<a href = \'#"+id+"&page="+href+"\' onClick = \'misTET.risorse.loadPageGET(\"" +
												href+"\");\'>"+list[j].getAttribute('testo')+"</a>"+dopo+"<br>";
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
				var inner = misTET.risorse.parsa.pagina(id);
				try {
					window.eval(inner);
				} catch (e) {
					var divPagina = $('sd_left');
					divPagina.innerHTML = inner;
				}
			}
		},
		
		/* Carica una pagina con gli argomenti inviati tramite GET */
		loadPageGET: function (res, lan) {
		
			var linguaggio = lan || "";
			var div = $('sd_left');
			div.innerHTML = misTET['files']['caricamento'];
			
			if (linguaggio == "") {
				var inner = misTET.altro.importa(res);
				try {
					window.eval(inner);
				} catch (e) {
					div.innerHTML = "<pre>"+inner+"</pre>";
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
			}
		}
	},
	error: function (message) {
		/* Inseriamo l'errore in $('pagina') */
		$('sd_left').innerHTML += '<br>'+message+'<br><br';
	},
	altro: {
		
		/* quando non si sa a cosa appoggiarsi, uff */
		getXMLHttpObj: function(){
			if(typeof(XMLHttpRequest)!='undefined')
				return new XMLHttpRequest();

			var axO = [	'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.4.0',
						'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'], i;
			for(i=0;i<axO.length;i++)
				try {
					return new ActiveXObject(axO[i]);
				} catch(e) { }
				return false;
		},
		
		importa: function (path) {
			var result;
			
			var o = misTET.altro.getXMLHttpObj();
			o.open('GET', path, false);
			o.send(null)
			return o;
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
				var o = misTET.altro.getXMLHttpObj();
				o.open('GET', path, false);
				o.send(null);
				try {
					window.eval(o.responseText);	
				} catch (e) {
					misTET.error(e);
				}
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
};
