/**************************************************************************** 
 * Copyleft gbyolo                                                    * 
 * [gb.yolo@gmail.com]                                                     *
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

misTET.XML = (function() {

    function not_valid (xml, path) {
        var result = false;
        if (!xml) {
            result = "parsing error";
        }
                        
        if (Object.isset(xml.documentElement.nodeName)) {
            if (xml.documentElement.nodeName == "parsererror") {
                result = xml.documentElement.textContent;
            }
        }
                        
        if (result && path) {
            new misTET.exception({
                name: "misTET.XML.not_valid",
                message: "#{error}\n".interpolate({error: result}),
                file: path
            }).handle();
            return result;
        }
        return result;
            
    }

    function getNodes (xml, nodeName) {
        result = new Array();

        $A(xml.childNodes).each(function (node) { 
            if (node.nodeType == Node.ELEMENT_NODE && 
                node.nodeName == String(nodeName)) { 
                var e = node.cloneNode(true);
                result.push(e);
            } 
        });

        return result;
    }

    return {
        not_valid: not_valid,
        getNodes: getNodes
    }
})();
