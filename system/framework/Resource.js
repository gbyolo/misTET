/**************************************************************************** 
 * Copyleft lostpassword                                                    * 
 * [gdb.lost@gmail.com]                                                     *
 *                                                                          *
 * This file is part of misTET.                                             *
 *                                                                          *
 * misTET is free software: you can redistribute it and/or modify           *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * misTET is distributed in the hope that it will be useful,                *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with misTET.  If not, see <http://www.gnu.org/licenses/>.          *
 ****************************************************************************/

(function () {
    if (!Object.isset(misTET)) {
        misTET = new Object();
    }
    if (!Object.isset(misTET.exception)) {
        throw new Error("misTET.exception is undefined");
    }
})();
            
misTET.Resource = Class.create({

    initialize: function (name, obj) {
        if (!name) {
            var error = new misTET.exception({
                name: "misTET.Resource.new",
                message: "no name passed"
            });
            error.handle();
            return false;
        }

        if (!obj) {
            var error = new misTET.exception({
                name: "misTET.Resource.new",
                message: "no obj passed"
            });
            error.handle();
            return false;
        }

        this.name = String(name);
        this.obj = obj;

        for (var func in obj) {
            if (Object.isFunction(this.obj[func])) {
                this.obj[func] = this.obj[func].bind(this.obj);
            }
        }

        if (Object.isset(this.obj.initialize)) {
            try {
                this.obj.initialize();
            } catch (e) {
                e.fix();
                new misTET.exception(e).handle();
                return false;
            }
        }
		
        Object.extend(this, this.obj);
        /* shitty way */
        delete this.obj
    },

    loadXML: function (file) {

        this.config = { };
                        
        new Ajax.Request(file, {
            method: "get",
            asynchronous: false,
            evalJS: false,
                                
            onSuccess: function (http) {
                if (misTET.XML.not_valid(http.responseXML, file)) {
                    return false;
                }
                this.config = http.responseXML;
            },
                                
            onFailure: function (http) {
                new misTET.exception({
                    name: "#{name}.loadXML".interpolate(this),
                    message: "failed to retrieve (#{status} - #{statusText})".interpolate(http),
                    file: file
                }).handle();
                return false;
            }
        });

        var configuration = config.documentElement;
        var confs = new Array ();

        $A(configuration.childNodes).each(function (node) {
            if (node.nodeType != Node.ELEMENT_NODE) { /* Node.ELEMENT_NODE == 1 */
                return;
            }
            var name = node.nodeName;
            confs[name] = (node.firstChild.data || node.firstChild.nodeValue);
        });

        this.config = { };
        Object.extend(this.config, confs);
    }
});
