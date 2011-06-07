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

misTET.File = (function () {
	
    /* File#exists -> Boolean
     * 
     * Return true if path exists, false otherwise
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
     * Get the content of path and return it
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
                    error = new misTET.exception({
                        description: e.toString(),
                        file: path
                    });
                }
            },
                
            onFailure: function (http) {
                error = new misTET.exception({
                    description: "Error while loading file (#{status} - #{statusText}).".interpolate(http),
                    file: path
                });
            }
        });

        if (error) {
            misTET.error.handle(error);
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
                    misTET.error.handle(new misTET.exception({
                        description: e.message.toString(),
                        file: e.fileName,
                        line: (e.lineNumber || e.line)
                    }));
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
                    error = new misTET.exception({
                        description: exception.message.toString(),
                        file: exception.fileName,
                        line: (exception.lineNumber || exception.line)
                    });
                }
            },
                        
            onFailure: function (http) {
                error = new misTET.exception({
                    description: "(#{status} - #{statusText})".interpolate(http),
                    file: path
                });
            }
        });
                
        if (error) {
            misTET.error.handle(error);
            return false;
        }
                
        return result;
    }

    return {
        exists: exists,
        get_contents: get_contents,
        include: include
    }

})();
