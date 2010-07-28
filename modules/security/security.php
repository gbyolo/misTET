<?php
/****************************************************************************
 * Copyleft lostpassword                                                    *
 * [gdb.lost@gmail.com]                                                     *
 *                                                                          *
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

/* Thanks to meh for this function */
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
	
} else if (isset($_REQUEST['login']) && isset($_REQUEST['password'])) {

	$_SESSION['misTET']['admin'] = simplexml_load_string(getData());
	$password = stripslashes($_REQUEST['password']);
	
	if ($_SESSION['misTET']['admin']->hash != "plain") {
		$password = @hash(strtolower($_SESSION['misTET']['admin']->hash, $password));
		
		if (!password) {
			echo "unexisting hashing algorithm";
			exit;
		}
	}
	
	if ($password == $_SESSION['misTET']['admin']->password) {
		$_SESSION['misTET']['logged'] = true;
		echo "Logged in";
	} else {
		echo "wrong password";
	}
	
	exit;
	
} else if (isset($_REQUEST['logout'])) {

	unset($_SESSION['misTET']['logged']);
	echo "Logged out successful";
	exit;
	
} else if (isset($_REQUEST['change']) && isset($_REQUEST['password']) && isset($_REQUEST['hash'])) {

	if (!$_SESSION['misTET']['logged']) {
		die("go away");
		exit;
	}
	
	$hash = stripslashes($_REQUEST['hash']);
	$config = simplexml_load_string(getData());
	$config->hash = $hash;
	$config->password = ($hash == 'plain') ? stripslashes($_REQUEST['password']) : @hash(strtolower($hash),stripslashes($_REQUEST['password']));
	
	if (!$config->password) {
		echo "unexisting hashing algorithm";
	}
	
	saveData("\n".$config->asXML(), ROOT.'/system/config.php');
	echo "password changed";
	exit;
}
 
 ?>
