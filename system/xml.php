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
 
class XMLparser
{
	
    public function init ($file) {

        if (!file_exists($file)) {
            die (new Error("ERROR_XML", "{$file} doesn't exist"));
        }

        if (!is_writable($file)) {
            die (new Error("ERROR_XML", "{$file} has no +r perms"));
        }
		
        $xml = simplexml_load_file($file);
		
        if (!$xml->homePage || !$xml->title) {
            die (new Error("ERROR_XML_INIT", "homePage or title is missing"));
        }

	return array(
	    "home" => (string) $xml->homePage,
	    "title" => (string) $xml->title
	);
		
    } 
	 
}
 
?>
