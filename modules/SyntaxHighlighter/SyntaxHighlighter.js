/****************************************************************************
 * Copyleft lostpassword                                                    *
 * [gdb.lost@gmail.com]                                                                                                *
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

misTET.res.create("SyntaxHighlighter", { brush: { } });

misTET.resources.modules.create("SyntaxHighlighter", {
        
    version: "0.1.1",
        
    initialize: function () {
                
        misTET.utils.include(this.root + "/scripts/shCore.js");
        misTET.utils.insertCSS(this.root + "/styles/shCore.css");
        misTET.utils.insertCSS(this.root + "/styles/shThemeEclipse.css");
                
        Event.observe(document, ":change", function () {
            misTET.modules.SyntaxHighlighter.execute();
        });
    },
        
    loadBrush: function (name) {
    	if (misTET.res.SyntaxHighlighter.brush[name]) {
    		return true;
    	}
        if (misTET.utils.include(this.root+"/scripts/shBrush"+name+".js")) {

            SyntaxHighlighter.vars.discoveredBrushes = {};

            for (var brush in SyntaxHighlighter.brushes) {
                var aliases = SyntaxHighlighter.brushes[brush].aliases;
                    
                    if (!aliases) {
                        continue;
                    }
                    
                    aliases.each(function (alias) {
                        SyntaxHighlighter.vars.discoveredBrushes[alias] = brush;
                    });
            }
            misTET.res.SyntaxHighlighter.brush[name] = true;
        }

    },
        
    execute: function(args) {
                
        var langs = {
                            'bash' : 'Bash',
                            'cpp' : 'Cpp',
                            'c' : 'Cpp',
                            'c#' : 'CSharp',
                            'css' : 'Css',
                            'delphi' : 'Delphi',
                            'java' : 'Java',
                            'js' : 'JScript',
                            'jscript' : 'JScript',
                            'javascript' : 'JSCript',
                            'php' : 'Php',
                            'python' : 'Python',
                            'py' : 'Python',
                            'ruby' : 'Ruby',
                            'rb' : 'Ruby',
                            'sql' : 'Sql',
                            'vb' : 'Vb',
                            'xml' : 'Xml'
            };
                
            if (!Object.isset(args)) {
                
                var re = new RegExp(/lan=(\w+)/)
                
                var pre = document.getElementsByTagName('pre');
                for (var i = 0; i < pre.length; i++) {
                    var current = pre[i].id;
                    var matches = current.match(re);
                    if (matches) {
                        var lan = matches[1];
                        pre[i].setAttribute("class", "brush: "+lan);
                        pre[i].innerHTML = this.textFilter(pre[i]);
                        this.loadBrush(langs[lan]);
                        SyntaxHighlighter.highlight();
                    }
                }
                } else {
                    if (Object.isset(args['lan'])) {
                        SyntaxHighlighter.defaults["brush"] = args["lang"];
                        this.loadBrush(args['lan']);
                    }
                }
                
    },
        
    textFilter: function (element) {
        var text = element.innerHTML;
        text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return text;
    }
        
});
