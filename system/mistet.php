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
 
class misTET
{
    public $version = '0.1';
    
    public $config = array(
		"initialized" => false,
		"home" => false,
		"title" => false,
		"keywords" => false,
		"description" => false,
		"menu" => false /* , */
		/* other properties */
	    );
    
    public function __toString() {
        return 'misTET v'.$this->version;
    }

    public function __construct () {

        if ($this->config['initialized']) {
            $error = new Error ("ERROR_INIT", "misTET has been already initialized");
            die($error);
        }
        
        $this->config['initialized'] = false;
		
	$construct = new XMLparser ();
	$init = $construct->init(_ROOT_.'/resources/init.xml');
		
	$this->config = array_merge($this->config, $init);
	
	$menu = $construct->menu(_ROOT_.'/resources/menu.xml');
	$this->config['menu'] = $menu;
	
	$this->config['initialized'] = true;

    }
    
    public function _parseMenu () {
		
        if (!$this->config['menu']) {
	    die (new Error("ERROR_MENU", "mistet#config#menu is null"));
	}
		
	$output = '';
		
	foreach ($this->config['menu'] as $key => $child) {
	    $output .= "<div class=\"menu\"><a href=\"{$key}\">{$child}</a></div>";
	}

	return $output;
		
    }
    
    public function _parsePage ($xmlNode) {
		
	$result = '';
		
	foreach ($xmlNode->childNodes as $node) {
		
	    if ($node->nodeType == XML_CDATA_SECTION_NODE) {
		$text .= $node->nodeValue;
	    }
	    else if ($node->nodeType == XML_TEXT_NODE) {
		$text .= $node->nodeValue;
	    }
		else {
		$text = $node->nodeValue;
	    }
		
	}

	if ($text = preg_replace('/^\s{1,}$/m', '', $text)) {
            $result .= preg_replace('/href=(["\'])#/', 'href=$1?', $text);
        }

	return $result;
		
    }
    
    public function go ($query) {
		
	if ($query) {
	    preg_match('/^([^=]+)(&|$)/', $query, $match);
			
	    if ($match) {
		$page = $match[1];
				
	    } else
	    {
		preg_match('/^page=(.+?)(&|$)/', $query, $match);
				
		if ($match) {
		    $page = $match[1];
		    /* external page */
		    $res = true;
		}
	    }
	}
	/* no page -> load homepage */	
	if (!$page) {
	    $page = $this->config['home'];
	}
		
	/* load an external page */
	if ($res) {
	    $content = @file_get_contents($page);
	    
	    if (!$content) {
		$content = "404 - Not found";
	    }
	    /* get page from pages.xml */
	    } else {
		/* TO DO */
		$node = XMLParser::pages(_ROOT_.'/resources/pages.xml', $page);
		$content = $this->_parsePage($node);
	    }
		
	return $content;
		
    }
}

?>
