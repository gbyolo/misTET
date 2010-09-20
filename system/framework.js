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

/* Faggot things */

Object.extend(Object, {

        /* return true if obj is defined, false otherwise */
        isset: function (obj) {
                return typeof(obj) !== "undefined";
        },
        
        /* isBoolean: return true if `o` is boolean, false otherwise */
        isBoolean: function (o) {
                return ((typeof o === "boolean") && (o.constructor === Boolean));
        },        
        
        /* Usage: 
        Object.getID = Object.getID.bind(element);
        examples:
        Object.getID = Object.getID.bind(document); -> now the function searchs in the document
        Object.getID = Object.getID.bind(misTET.config.menu); -> now the function searchs through the xml file
        Object.getID = Object.getID.bind(object) -> now the function searchs through a general object
                
        Or you can use the following syntax:
        Object.getID.call(document, id); -> search in the document
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
        /* Return an array containing all the elements with the specifiec id */
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

Object.extend(String.prototype, {
        
        /* string.isEmpty() return true if the string is "", false otherwise */
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
        }
});
