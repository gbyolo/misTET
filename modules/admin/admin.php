<?php
/****************************************************************************
 * Copyright (C) <2010>  <lostpassword>                                     *
 * [http://lostpassword.hellospace.net | gdb.lost@gmail.com]                *
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
/** Admin panel script **/

	/* Test if there isn't any $_GET parameter */
	function nothing () {
		$result = false;
		$array = array('editMenu', 'editPages', 'login', 'connected', 'logout', 'file', 'menu', 'pages');
		foreach ($array as $i => $value) {
			if (isset($_GET[$value])) {
				$result = false;
				break;
			}
		}
		return $result;
	};
	
	define("VERSION", "0.2.3");
	define("__NAME__", "AdminPanel");
	
	/* Here your password */
	define("PASSWORD", "meg");
	
	/* Here admin root dir*/
	define("ROOT", "/modules/admin");
		
	$passHash = md5(PASSWORD);
	$menuFile = "../../res/files/menu.xml";
	$pagesFile = "../../res/files/pages.xml";
	
	if (isset($_GET['editMenu'])) {
		
		$content = "";
		$file = @@fopen($menuFile, "r");
		if ($file) {
			while (!@@feof($file)) {
				$content .= @@fread($file, 1024);
			}
		}
		@@fclose($file);
		echo "<form action = '?menu&file={$menuFile}' method = 'POST'>".
             "<textarea name = 'newMenu' rows = '20' cols = '65'>{$content}</textarea>".
             "<input type = 'submit' value = 'submit'></input>";
             
	} else if (isset($_GET['editPages'])) {
		
		$content = "";
		$file = @@fopen($pagesFile, "r");
		if ($file) {
			while (!@@feof($file)) {
				$content .= @@fread($file, 1024);
			}
		}
		@@fclose($file);
		echo "<form action = '?pages&file={$pagesFile}' method = 'POST'>".
             "<textarea name = 'newPage' rows = '20' cols = '65'>{$content}</textarea>".
             "<input type = 'submit' value = 'submit'></input>";
             
	} else if (isset($_GET['login'])) {
		
		if (isset($_POST['password'])) {
			$password = htmlentities($_POST['password']);	
			if ($password == PASSWORD) {
				$_SESSION['mistet']['logged'] = true;
				echo "<p id = 'success'>You have been logged in :P</p>";
			} else {
				echo "<p id = 'error'>Failed to login</p>";
			}
		} else {
			echo "<p id = 'error'>Unable to login: password is undefined</p>";
		}
		
	} else if (isset($_GET['connected'])) {
     	if ($_SESSION['mistet']['logged']) {
        	echo "<p id = 'success'>You have been logged in :P</p>";
     	}
     	else {
         	echo "<p id = 'error'>You haven't been logged in</p>";
     	}
	} else if (isset($_GET['logout'])) {
		
		unset($_SESSION['mistet']);
		echo "<p id = 'success'>Logout successful! :P</p>";
		
	} else if (isset($_SESSION['mistet']['logged']) ) {
		
		echo "<h2>Admin Control Panel</h2><br>".
			  "<a href = '?editMenu'>Edit menu.xml</a><br>".
			  "<a href = '?editPages' >Edit pages.xml</a><br>".
              "<a href = '?logout'>Logout</a>";
              
	} else if (!isset($_SESSION['mistet']['logged'])) { 
		
		echo "Login: <br><form action = '?login' method = 'POST'>".
			 "<Password: <input name = 'password' type = 'text'><br>".
			 "<input type = 'submit' value = 'submit'></form>";

	} else 

?>
