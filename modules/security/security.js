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

/** security module **/

misTET.res.create("security", { connected: false });

misTET.module.create("security", {

    version: "0.2.6",
        
    initialize: function () {
                
        new Ajax.Request(this.root + "/security.php?initialize", {
            method: "get",
            asynchronous: false,
                        
            onFailure: function (http) {
                misTET.error.handle(new misTET.exception({
                    description: "Unable to initialize the security module (#{status} - #{statusText})".interpolate(http),
                    file: this.root + "/security.js"
                }));
                        
            }
        });
    },
        
    execute: function (args) {
        
        if (!Object.isset(args)) {
            return false;
        }
                
        if (Object.isset(args["login"])) {
                        
            if (Object.isset(args["action"])) {
                                
                if (!Object.isset(args["password"])) {
                    misTET.error.handle("Security error: The password is missing");
                    return false;
                }
                        
                new Ajax.Request(this.root + "/security.php?login&password=#{password}".interpolate({password: encodeURIComponent(args["password"])}), {
                    method: "get",
                                
                    onSuccess: function (http) {
                        $("page").innerHTML = http.responseText;
                    },
                                
                    onFailure: function (http) {
                        misTET.error.handle("Security error: something went wrong while login");
                    }
                });
            } else {
                        
                new Ajax.Request(this.root + "/security.php?login", {
                    method: "get",
                                
                    onSuccess: function (http) {
                        $("page").innerHTML = http.responseText;
                    },
                                
                    onFailure: function (http) {
                        misTET.error.handle("Security error: something went wrong while login");
                    }
                });
                        
            }
                
        } else if (Object.isset(args["logout"])) {
                
            new Ajax.Request(this.root + "/security.php?logout", {
                method: "get",
                                
                onSuccess: function (http) {
                    $("page").innerHTML = http.responseText;
                },
                                
                onFailure: function () {
                    misTET.error.handle("Security error: something went wrong during logout");
                }
            });
                
        } else if (Object.isset(args["changePassword"])) {
                        
            if (Object.isset(args["action"])) {
                                
                if (!Object.isset(args["password"])) {
                    misTET.error.handle("Security changePassword: password is missing");
                    return false;
                }
                
                var data = { password: args["password"].encodeURI(), token: args["token"] };
                new Ajax.Request(this.root + "/security.php?change&", {
                    method: "post",
                    parameters: data,
                                
                    onSuccess: function (http) {
                        $("page").innerHTML = http.responseText;
                    },
                                        
                    onFailure: function () {
                        misTET.error.handle("Security changePassword: someting went wrong");
                        
                        }
                    });
                } else {
                        
                    new Ajax.Request(this.root + "/security.php?change", {
                        method: "get",
                                
                        onSuccess: function (http) {
                            $("page").innerHTML = http.responseText;
                        },
                                        
                        onFailure: function () {
                            misTET.error.handle("Security changePassword: someting went wrong");
                        
                        }
                        
                    });
                
                } 
            } else if (Object.isset(args["connected"])) {
                
                var result = false;
                new Ajax.Request(this.root + "/security.php?connected",{
                    method: "get",
                                
                    onSuccess: function (http) {
                        misTET.res.get("security").connected = Boolean(http.responseText == "true");
                    }

                });
                return misTET.res.get("security").connected;

            } else {
                misTET.error.handle("Security execute: args not valid");
            }
    }
});
