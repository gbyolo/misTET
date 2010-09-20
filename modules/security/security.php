<?php
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
 
session_start();
 
define("VERSION", "0.2.5");
define("__NAME__", "Security");
define("ROOT", realpath(dirname(__FILE__)));

function getData () {
	$xml = file(ROOT.'/system/config.php');
	array_shift($xml);
    array_shift($xml);
    array_pop($xml);
    array_pop($xml);
    return join("\n", $xml);
}

function saveData($config, $file)
{
	file_put_contents($file, "<?php die('You are doing it wrong baby.'); /*\n" . $config . "\n*/?>");
}

/* CSRF fix */
$token = sha1(uniqid(rand(),TRUE));
$_SESSION['token'] = $token;

if (isset($_REQUEST['initialize'])) {

	$_SESSION['misTET']['admin'] = simplexml_load_string(getData());
	exit;
	
} else if (isset($_REQUEST['connected'])) {

	if ($_SESSION['misTET']['logged'] == true) {
		echo "true";
	} else {
		echo "false";
	}
	exit;
	
} else if (isset($_REQUEST['login'])) {
	
	if (!isset($_REQUEST['password'])) {
	
		echo "<center>
			<div class=\"login\">
    			<div>Password</div>

    			<form onsubmit=\"misTET.modules.run('security', { login: 1, action: 1, password: $('passwd').value });\">
        		<input id=\"passwd\" type=\"password\"></input><input type=\"submit\" value=\"login\"></input>
    			</form>

			</div>
		</center>";
	} else {
	
		$_SESSION['misTET']['admin'] = simplexml_load_string(getData());
		$password = stripslashes($_REQUEST['password']);
	
		if ($password == $_SESSION['misTET']['admin']->password) {
			$_SESSION['misTET']['logged'] = true;
			echo "Logged in";
		} else {
			echo "wrong password";
		}
	}
	
	exit;
	
} else if (isset($_REQUEST['logout'])) {

	unset($_SESSION['misTET']['logged']);
	echo "Logged out successful";
	exit;
	
} else if (isset($_REQUEST['change'])) {

	if (!$_SESSION['misTET']['logged']) {
		die("go away");
		exit;
	}
	
	if (!isset($_REQUEST['password'])) {
	
		echo "<center>
			<div class=\"change\">
    			<div>Write the new password</div>

    			<form onsubmit=\"misTET.modules.run('security',{ changePassword: 1, action: 1, password: $('passwd').value, token: $('token').value});\">
        		<input id=\"passwd\" type=\"password\"></input><br>
        		<input id =\"token\" value=\"".$_SESSION['token']."\" type=\"hidden\"></input>
        		<input type=\"submit\" value=\"change\"></input>
   	 			</form>

			</div>
		</center>";
	} else {
		
		/* CSRF Fix */
		if (!$_POST['token'] == $_SESSION['token']) {
			die("you're doing it wrong");
			exit;
		}
	
		$config = simplexml_load_string(getData());
		$config->password = stripslashes($_REQUEST['password']);
	
		saveData("\n".$config->asXML(), ROOT.'/system/config.php');
		echo "password changed";
	}
	exit;
}
 
 ?>
