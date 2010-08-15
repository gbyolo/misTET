/****************************************************************************
 * Copyleft lostpassword                                                    *
 * [gdb.lost@gmail.com]                                                     *
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

/**
 * This module provides BBCODE and emoticons support
 * 
 * BBCODES:
 * [img]url[/img]
 * [url=url]url_name[/url]
 * [url]url[/url]
 * [b]text[/b]
 * [i]text[/i]
 * [u]text[/u]
 * [code=language]code[/code]
 * [code]code[/code]
 * 
 * Emoticons:
 * :)
 * :(
 * ;)
 * :P
 * :O
 * :S
 * :D
 * :lol:
 * :asd:
 * */

misTET.res.create("cooler", {
        
    search: new Array(  /\[img\](.+?)\[\/img]/gi,
                        /\[url=([\w]+?:\/\/[^ \\"\n\r\t<]*?)\](.*?)\[\/url\]/gi,
                        /\[url\]((www|ftp|)\.[^ \\"\n\r\t<]*?)\[\/url\]/gi,
                        /\[url=((www|ftp|)\.[^ \\"\n\r\t<]*?)\](.*?)\[\/url\]/gi,
                        /\[email\](([a-z0-9&\-_.]+?)@([\w\-]+\.([\w\-\.]+\.)?[\w]+))\[\/email\]/gi,
                        /\[b\](.*?)\[\/b\]/gi,
                        /\[i\](.*?)\[\/i\]/gi,
                        /\[u\](.*?)\[\/u\]/gi,
                        /\[url\](http:\/\/[^ \\"\n\r\t<]*?)\[\/url\]/gi,
                        /\[code=(.*)\](.*)\[\/code\]/gi,
                        /\[code\](.*)\[\/code\]/gi ),
    
    replace: new Array( "<img src='$1'></img>",
                        "<a href=\"$1\" target=\"blank\">$2</a>",
                        "<a href=\"http://$1\" target=\"blank\">$1</a>",
                        "<a href=\"$1\" target=\"blank\">$1</a>",
                        "<a href=\"mailto:$1\">$1</a>",
                        "<b>$1</b>",
                        "<i>$1</i>",
                        "<u>$1</u>",
                        "<a href=\"$1\" target=\"blank\">$1</a>",
                        "<pre id='lan=$1'>$2</pre>",
                        "<pre id='code'>$1</pre>" )
});
                                          

misTET.modules.create("cooler", {
        
    version: "0.0.1",
        
    initialize: function () {
                
        Event.observe(document, ":change", function () {
            $('page').update(misTET.modules.run("cooler", $('page').innerHTML));
        }.bind(this));
                
    },
        
    execute: function (str) {
            
        /** apply bbcode **/
        str = misTET.modules.cooler.bbcode(str);
        /** apply emoticons **/
        str = misTET.modules.cooler.emoticons(str);
            
        return str;
    },
    
    bbcode: function (str) {
            
        /** BBCODE replacing **/
        var search = misTET.res.cooler.search;
        var replace = misTET.res.cooler.replace;
        
        for (var i = 0; i < search.length; i++) {
            str = str.replace(search[i], replace[i]);
        }
        
        return str;
                
    },
    
    emoticons: function (str) {
        
        /** emoticon replacing **/
        str = str.replace(/:\)/g, "<img src=" + this.root + "/images/normal.gif");
        str = str.replace(/:\(/g, "<img src=" + this.root + "/images/sad.gif");
        str = str.replace(/;\(/g, "<img src=" + this.root + "/images/wink.gif");
        str = str.replace(/:D/gi, "<img src=" + this.root + "/images/biggrin.gif");
        str = str.replace(/:P/gi, "<img src=" + this.root + "/images/tongue.gif");
        str = str.replace(/:O/gi, "<img src=" + this.root + "/images/ohmy.gif");
        str = str.replace(/:S/gi, "<img src=" + this.root + "/images/wacko.gif");
        str = str.replace(/:lol:/gi, "<img src=" + this.root + "/images/lol.gif");
        str = str.replace(/:asd:/gi, "<img src=" + this.root + "/images/asd.gif");
        
        return str;
        }
        
});
