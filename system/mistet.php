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
    
    private $config = array(
				"initialized" => false,
				"home" => false,
				"title" => false /* , */
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
		
		$this->config['home'] = $init['home'];
		$this->config['title'] = $init['title'];

    }
}

?>
