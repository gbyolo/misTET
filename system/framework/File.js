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
    
misTET.File = (function () {
	
    /* File#exists -> Boolean
     * 
     * Returns true if path exists, false otherwise
    */

    function exists (path) {
        var result = false;

        try {        
            new Ajax.Request(path, {
                /* The HTTP head method is identical to GET, except
                * that the server must not return a message-body in
                * the response */
                method: "head",
                asynchronous: false,
 
                onSuccess: function () {
                    result = true;
                }
            });
                
        } catch (exception) { }
 
        return result;
    }
    
    /* File#get_contents -> String
     * 
     * Gets the content of path and returns it
     */

    function get_contents (path) {
        var result = false;
        var error = false;
            
        new Ajax.Request(path, {
            method: "get",
            asynchronous: false,
            evalJS: false,
                
            onSuccess: function (http) {
                try {
                    result = http.responseText.toString().escapeHTML();
                }
                catch (e) { 
                    e.fix();
                    error = new misTET.exception(e);
                }
            },
                
            onFailure: function (http) {
                error = new misTET.exception({
                    message: "Error while loading file (#{status} - #{statusText}).".interpolate(http),
                    file: path
                });
            }
        });

        if (error) {
            error.handle();
            return false;
        }
            
        return result;
    }

    function include (path) {
        var result = false;
            
        new Ajax.Request(path, {
            method: "get",
            asynchronous: false,
            evalJS: false,
                
            onSuccess: function (http) {
                try {
                    if (window.execScript) {
                        window.execScript(http.responseText);
                    } else {
                        window.eval(http.responseText);
                    }
                    result = true;
                } catch (error) { 
                    error.fix();
                    new misTET.exception(error).handle();
                    return false;
                }
            }
        });
                        
        return result;
       
    }

    function execute (path) {
        var result;
        var error = false;
                
        new Ajax.Request(path, {
            method: "get",
            asynchronous: false,
            evalJS: false,
                        
            onSuccess: function (http) {
                try {
                    if (window.execScript) {
                        result = window.execScript(http.responseText);
                    } else {
                        result = window.eval(http.responseText);
                    }
                } catch (exception) {
                    exception.fix();
                    error = new misTET.exception(exception);
                }
            },
                        
            onFailure: function (http) {
                error = new misTET.exception({
                    message: "(#{status} - #{statusText})".interpolate(http),
                    file: path
                });
            }
        });
                
        if (error) {
            error.handle();
            return false;
        }
                
        return result;
    }

    return {
        exists: exists,
        get_contents: get_contents,
        include: include,
        execute: execute
    }

})();
