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

        if (!is_readable($file)) {
            die (new Error("ERROR_XML", "{$file} has no +r perms"));
        }
		
        $xml = DOMDocument::load($file)->documentElement;
        
        /* ugly shittly way */
        $home = $xml->getElementsByTagName("homePage")->item(0)->nodeValue;
        $title = $xml->getElementsByTagName("title")->item(0)->nodeValue;
		
        if (!$home || !$title) {
            die (new Error("ERROR_XML_INIT", "homePage or title is missing"));
        }

	return array(
	    "home" => (string) $home,
	    "title" => (string) $title
	);
		
    }

    public function menu ($file) {

        $arr = array ();

        if (!file_exists($file) || !is_readable($file)) {
            die (new Error("ERROR_XML_MENU", "{$file} is missing or has wrong perms"));
        }

        $xml = DOMDocument::load($file)->documentElement;

        foreach ($xml->childNodes as $node) {
            if ($node->nodeName == 'menu') {
		$href = preg_replace('/#/', '?', $node->getAttribute('href'));

		preg_match('/?/', $href, $matches);
		if ($matches) {
                    $arr[$href] = $node->nodeValue;
		} else {
		    $arr["?".$href] = $node->nodeValue;
		}
            }
        }
        
        return $arr;
    }
	 
}
 
?>
