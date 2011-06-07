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

misTET.Resource = Class.create({

    initialize: function (name, obj) {
        if (!name) {
            var error = new misTET.exception({
                description: "misTET.Resource.new: no name passed"
            });
            misTET.error.handle(error);
            return false;
        }

        if (!obj) {
            var error = new misTET.exception({
                description: "misTET.Resource.new: no obj passed"
            });
            misTET.error.handle(error);
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
                throw (e);
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
                if (misTET.XML.check(http.responseXML, file)) {
                    return false;
                }
                this.config = http.responseXML;
            },
                                
            onFailure: function (http) {
                misTET.error.handle(new misTET.exception({
                    description: "Resource#loadXML: failed to retrieve (#{status} - #{statusText})".interpolate(http),
                    file: file
                }));
            }
        });
                        
        var configuration = config.documentElement;
        var list = configuration.childNodes;

        var confs = new Array();
                        
        for (var j = 1; j < list.length; j = j+2) {
            if (j == (list.length -1)) {
                break;
            }
            var node = list[j].nodeName;
            var value = list[j].childNodes[0].nodeValue;
            confs[node] = value;
        }
        this.config = { };
        Object.extend(this.config, confs);
    }
});
