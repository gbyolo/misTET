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
	
	versione: "0.3.5", /* Fixed bugs, modificate funzioni di parsing, include e importa */
	
	modules: "/modules",
	
	/* Inizializza misTET */
	init: function () {
	
		misTET.risorse.carica.init();
		var ops = $j('#sd_left')[0];
		var args = misTET.altro.parseGET();
		var menuOk = true, pagineOk = true;
		$j(ops).html(misTET['files']['caricamento']);
		
		try {
			misTET.risorse.carica.menu();
		} catch (e) {
			$j(ops).html(e);
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
			var divMenu = $j('#nav')[0];
			$j(divMenu).html(misTET.risorse.parsa.menu());
			
			/* MenuMatic */
			window.addEvent('domready', function () {			
				var myMenu = new MenuMatic ();
			});	

			var divPagina = $j('#sd_left')[0];
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
		imported: { },
	},
	risorse: {
		carica: {
			
			/* Carica gli argomenti di inizio */
			init: function () {
				var path = '/res/files/init.xml';
				var test = false;
				var error = false;
				var ok = false;
				
				if ($j.browser['msie']) {
					misTET.error('Only Mozilla');
				} else {
					
					$j.ajax({
						type: 'GET',
						url: path,
						dataType: 'xml',
						success: misTET.risorse.init
					});
					
				}
			},
			
			/* Carica il file del menu, e lo salva in misTET.files.menu */
			menu: function () {
			
				var path = '/res/files/menu.xml';
				var test = false;
				var error = false;
				
				
				if ($j.browser['msie']) {
					misTET.error('Only Mozilla');
				} else {
					$j.ajax({
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
								
				if ($j.browser['msie']) {
					misTET.error('Only Mozilla');
				} else {
					$j.ajax({
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
			var test = false;
			if (test = misTET.altro.XMLtest(xml)) {
				misTET.files.home = $j(xml).find('home').text();
				misTET.files.caricamento = $j(xml).find('caricamento').text();
				misTET.files.title = $j(xml).find('title').text();
				$j($$('title')[0]).html(misTET['files']['title']);
			} else {
				misTET.error(test);
			}
		},
		
		initMenu: function (xml) {
			var test = false;
			if (test = misTET.altro.XMLtest(xml)) {
				misTET['files']['menu'] = xml;
			} else {
				misTET.error(test);
			}
		},
		
		initPagine: function (xml) {
			var test = false;
			if (test = misTET.altro.XMLtest(xml)) {
				misTET['files']['pagine'] = xml;
			} else {
				misTET.error(test);
			}
		},
		
		parsa: {
			
			/* parsa menu.xml */
			menu: function () {
				var output = "";
				
				var array = $j(misTET['files']['menu']).find('menu');
				
				array.each( function () {
					var voci = $j(this).find('text');
					if (voci.length == 1) {
						var id = $j(voci[0]).attr('id');
						var inner = $j(voci[0]).text();
						output += 	"\n<li><a href = \'#" +
                                    id + "\' onClick = \'misTET.risorse.set.pagina(\"" +
                                    id + "\");\'>" + inner +
                                    "</a></li>\n";

					} else {
						var idPrincipale = $j(voci[0]).attr('id');
						var innerP = $j(voci[0]).text();
						output += 	"\n<li><a href = \'#" + idPrincipale +
                                    "\' onClick = \'misTET.risorse.set.pagina(\"" +
                                    idPrincipale + "\");\'>" + innerP +
                                    "</a>\n<ul>\n";

						for (var j = 1; j < voci.length; j++) {
							var idSub = $j(voci[j]).attr('id');
							var innerS = $j(voci[j]).text();
							output += 	"<li><a href = \'#" + idSub +
                                        "\' onClick = \'misTET.risorse.set.pagina(\"" +
                                        idSub + "\");\'>" + innerS + "</a></li>\n";

						}
						output += "</ul></li>";
					}
				});
				
				return output;
			},
			
			/* Parsa pagine.xml */
			pagina: function (id) {
				var output = "";
				
				var array = $j(misTET['files']['pagine']).find('page');
				
				array.each( function() {
					if ($j(this).attr('id') == id) {
						if ($j(this).find('go').length != 0) {
							var text = $j(this).text();
							output += text;
							$j(this).find('go').each( function () {
								var href = $j(this).attr('href');
								var lan = $j(this).attr('lan') || "";
								var dopo = $j(this).attr('dopo');
								var testo = $j(this).attr('testo');
								if (lan != "") {
										output += 	"<a href = \'#" + id + "&page=" + href +
                                                    "&lan=" + lan + "\' " + "onClick = \'" +
                                                    "misTET.risorse.loadPageGET(\"" + href +
                                                    "\", \"" + lan + "\");\'>" +
                                                    testo + "</a>" + dopo +"<br>";
									
								} else if (lan == "") {
									output += 	"<a href = \'#" + id + "&page="+href +
                                                "\' onClick = \'misTET.risorse.loadPageGET(\"" +
                                                href+"\");\'>" + testo + "</a>"+dopo+"<br>";
								}		
							});
						} else {
							output += $j(this).text();
						}
					}
				});	
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
					var divPagina = $j('#sd_left')[0];
					$j(divPagina).html(inner);
				}
			}
		},
		
		/* Carica una pagina con gli argomenti inviati tramite GET */
		loadPageGET: function (res, lan) {
		
			var linguaggio = lan || "";
			var div = $j('#sd_left')[0];
			$j(div).html(misTET['files']['caricamento']);
			
			if (linguaggio == "") {
				var inner = misTET.altro.importa(res);
				try {
					window.eval(inner);
				} catch (e) {
					$j(div).html("<pre>"+inner+"</pre>");
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
					misTET.altro.importa(res);
					var file = misTET['files']['imported'];
					var inner = "<pre class = 'brush: "+lan+";'>"+file+"</pre>";
					$j(div).html(inner);
					
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
					$j(div).html('Errore nel caricamento source. Specificare un linguaggio corretto<br>Linguaggi disponibili:<br><br>');
					
					for (l in langs) {
							div.innerHTML += "&nbsp;"+l+"<br>";
					}
				}
			}
		}
	},
	error: function (message) {
		/* Inseriamo l'errore in $('pagina') */
		$j('#sd_left')[0].innerHTML += '<br>'+message+'<br><br';
	},
	altro: {
		
		/* Importa un file */
		importa: function (path) {
			if ($j.browser['msie']) {
				misTET.error('Only Mozilla');
			} else {
				$j.ajax({
					type: 'GET',
					url: path,
					dataType: 'text',
					success: function (file) {
						misTET.altro.exec(file, false);
					},
					error: misTET.error
				});
			}
		},
		
		exec: function (file, ex) {
				try {
					misTET['files']['imported'] = file;
				} catch (e) {
					misTET.error(e);
				}
				if (ex == true) {
					try {
						window.eval(misTET['files']['imported']);
					} catch (e) {
						misTET.error(e);
					}
				}
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
			if ($j.browser['msie']) {
				misTET.error('Only Mozilla');
			} else {
				$j.ajax({
					type: 'GET',
					url: path,
					dataType: 'text',
					success: function(file){
						misTET.altro.exec (file,true)
					},
					error: misTET.error
				});
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
