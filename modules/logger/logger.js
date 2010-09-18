/**************************************************************************** 
 * Copyleft lostpassword                                                    * 
 * [gdb.lost@gmail.com]                                                     *
 *                                                                          *
 * This file is part of misTET.                                             *
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

misTET.res.create("logger", {
        config: { }
});

misTET.modules.create("logger", {

    version: "0.2",

    needs: ["security"],

    initialize: function () {
                
        try {
            misTET.res.loadXML("logger", this.root + "/resources/config.xml");
        } catch (e) {
            misTET.errors.create(e);
        }
                
        Event.observe(document, ":change", function (event) {
            misTET.modules.run("logger", ["page", "view", event.memo]);
        });
                
        Event.observe(document, ":error", function (error) {
            misTET.modules.run("logger", ["error", error.memo]);
        });
                        

    },

    execute: function () {
    
        var argv = "";
                
        for (var i = 0; i < $A(arguments).length; i++) {
            argv += i + "=" + (Object.toJSON($A(arguments)[i])).encodeURI() + "&";
        }
        argv = argv.slice(0, argv.length -1);
    
        var date = (new Date().toString()).encodeURI();
    
        new Ajax.Request(this.root+"/logger.php?data&" + argv + "&date=" + date, {
            method: "get"
        });
    }
});
