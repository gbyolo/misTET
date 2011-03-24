<?php
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

ob_start();
session_start();

/* version */
define('__VERSION__', '0.1');
/* root path */
define('_ROOT_', dirname(__FILE__));
/* core */
define('CORE', _ROOT_.'/system');

require(CORE.'/mistet.php');
require(CORE.'/error.php');
require(CORE.'/xml.php');

/* initialize misTET */
$misTET = new misTET ();

/* print standard HTML page */
echo <<<HTML
<html>
    <head>
        <link rel="stylesheet" href="{$_ROOT_}/styles/light.css" type="text/css">
        <link rel="stylesheet" href="{$_ROOT_}/styles/menu.css" type="text/css">
    </head>
    <body>
        <div id="title">{$misTET->config['title']}
        </div>

        <div id="menu"> {$misTET->_parseMenu ()}
        </div>

        <div id="page">
        </div>
    </body>
</html>
HTML;

?>
