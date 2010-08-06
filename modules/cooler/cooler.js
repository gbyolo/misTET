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
 * [b]text[/b]
 * [i]text[/i]
 * [u]text[/u]
 * [code=language]code[/code]
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

misTET.modules.create("cooler", {
        
    version: "0.0.1",
        
    initialize: function () {
                
        Event.observe(document, ":change", function () {
            $('page').innerHTML = misTET.modules.cooler.execute($('page').innerHTML);
        });
                
    },
        
    execute: function (str) {
                
        /** BBCODE replacing **/
        str = str.replace(/\[b\](.+?)\[\/b]/gi, "<b>$1</b>");
        str = str.replace(/\[url=(.*)\](.*)\[\/url\]/gi, "<a href='$1'>$2</a>");
        str = str.replace(/\[code=(.*)\](.*)\[\/code\]/gi, "<pre id='lan=$1'>$2</pre>");
        str = str.replace(/\[img\](.+?)\[\/img]/gi, "<img src='$1'></img>");
        str = str.replace(/\[i\](.+?)\[\/i]/gi, "<i>$1</i>");
        str = str.replace(/\[u\](.+?)\[\/u]/gi, "<u>$1</u>");
                
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
