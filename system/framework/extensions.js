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

/* nodeType constants if the Node object is not defined */
(function () {
    if (!window.Node){
        var Node = {
            ELEMENT_NODE                :  1,
            ATTRIBUTE_NODE              :  2,
            TEXT_NODE                   :  3,
            CDATA_SECTION_NODE          :  4,
            ENTITY_REFERENCE_NODE       :  5,
            ENTITY_NODE                 :  6,
            PROCESSING_INSTRUCTION_NODE :  7,
            COMMENT_NODE                :  8,
            DOCUMENT_NODE               :  9,
            DOCUMENT_TYPE_NODE          : 10,
            DOCUMENT_FRAGMENT_NODE      : 11,
            NOTATION_NODE               : 12
        };
    }
})();

Object.extend(Object, {

        /* true if obj is defined, false otherwise */
        isset: function (obj) {
                return typeof(obj) !== "undefined";
        },
        
        /* true if `o` is boolean, false otherwise */
        isBoolean: function (o) {
                return ((typeof o === "boolean") && (o.constructor === Boolean));
        },        
        
        /* Usage: 
        Object.getID = Object.getID.bind(element);
        examples:
        Object.getID = Object.getID.bind(document); -> search in document
        Object.getID = Object.getID.bind(misTET.config.menu); -> search through the xml file
        Object.getID = Object.getID.bind(object) -> search through a general object
                
        Or you can use the following syntax:
        Object.getID.call(document, id); -> search in document
        Object.getID.call(misTET.config.menu, id); -> search through the xml document
        */
        getID: function (id) {
                
            var array = $A(this.getElementsByTagName('*'));
            for (var i = 0; i < array.length; i++) {
                if (array[i].getAttribute('id') == id) {
                    return array[i];
                    break;;
                }
            }
            return false;
        },
                
        /* Use it as it's written above about Object.getID */
        /* Returns an array containing all the elements with the specifiec id */
        getsID: function (id) {
                
            var array = $A(this.getElementsByTagName('*'));
             var result = new Array();
                        
            for (var i = 0; i < array.length; i++) {
                if (array[i].getAttribute('id') == id) {
                    result.push(array[i]);
                }
            }
                        
            if (result.length != 0) {
                return result;
            } else {
                return false;
            }
                
        }
        
});

/* extension to the built-in string class */
Object.extend(String.prototype, {

        /* string#parseQuery() -> object
         *
         * #home?id=45&ff=1&ff=2&ops=5 ->
         * { home: true, id: 45, ff: [1, 2], ops: 5 }
        **/

        parseQuery: function () {
            var result = {};
                
            if (!Object.isString(this)) {                    
                misTET.error.handle(new misTET.exception({
                    description: "parsing error: what url should parseQuery parse?"
                }));      
                return false;
            }
                
            var matches = this.match(/[?#](.*)$/);       
            if (!matches) {
                return result;
            }
        
            var splitted = matches[1].split(/&/);
            for (var i = 0; i < splitted.length; i++) {
                var parts = splitted[i].split(/=/);
                var name = parts[0].decodeURI();
                var value = parts[1];

                if (value) {
                    if (Object.isset(result[name])) {
                        if (!Object.isArray(result[name])) {
                            result[name] = Array(result[name], value);
                        } else {
                            result[name].push(value);
                        }
                    } else {
                        result[name] = value.decodeURI();
                    }
                } else {
                    result[name] = true;
                }
                    
            }
        
            return result;
        },
        
        /* string#isEmpty() return true if the string is "", false otherwise */
        isEmpty: function () {
                return this == "";
        },
        
        /* return encoded string */
        encodeURI: function () {
                return encodeURIComponent(this);
        },
        
        /* return decoded string */
        decodeURI: function () {
                return decodeURIComponent(this);
        },
        
        /* srip slashes */
        stripslashes: function () {
                return this.replace(/\\/g, '');
        },
        
        /* string#reverse -> string
         * example -> elpmaxe
        **/
        reverse: function () {
            return this.toArray().reverse().join("");
        }
});
