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

misTET.XML = (function() {

    function check (xml, path) {
        var result = false;
        if (!xml) {
            result = "parsing error";
        }
                        
        if (Object.isset(xml.documentElement.nodeName)) {
            if (xml.documentElement.nodeName == "parsererror") {
                result = xml.documentElement.textContent;
            }
        }
                        
        if (result && file) {
            misTET.error.handle(new misTET.exception({
                description: "#{error}\n".interpolate({error: result}),
                file: file
            }));
            return result;
        }
        return result;
            
    }

    return {
        check: check
    }
})();
