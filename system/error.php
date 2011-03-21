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

class Error 
{
    private $ERROR = array(
		"ERROR_CLASS" => false,
        "ERROR_INIT" => false,
        "ERROR_RESOURCES" => false,
        "ERROR_MODULES" => false /* , */
        /* other errors */
        );
    private $error;
    private $what;
    
    public function __construct ($type, $msg) {
		
        if (!isset($this->ERROR[$type])) {
            return false;
        }
		
        $this->error = $type;
        $this->what = $msg;
    }

    /* (string) Error */
    public function __toString () {
        $string = '[@]#'.$this->error.': '.$this->what;
        return $string;
    }
    
}

?>
