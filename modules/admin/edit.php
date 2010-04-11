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

	define("VERSION", "0.2.3");
	define("__NAME__", "AdminPanel");
	
	/* Here admin root dir*/
	define("ROOT", "/modules/admin");
	
	/* Ettipitipitero */
	if (isset($_GET['menu'])) {
		$newFile = stripslashes($_POST['newMenu']);
		$file = $_GET['file'];
	
		if (file_exists($file) && isset($_SESSION['mistet']['logged'])) {
			if ($handle = @@fopen($file, 'w')) {
				if (@@fwrite($handle, $newFile)) {
					echo "<p id = 'success'>{$menuFile} has been succesful edited</p>";
				} else {
					echo "<p id = 'error'>fwrite: unable to write {$file}.</p>";
				}
			} else {
				echo "<p id = 'error'>fopen: unable to open {$file}.</p>";
			}
		} else {
			echo "<p id = 'error'>Unable to edit menu.xml: {$file} doesn't exists or you're not logged in.</p>";
		}
	} else if (isset($_GET['pages'])) {
		
		$newFile = stripslashes($_POST['newPage']);
		$file = $_GET['file'];
		
		if (file_exists($file) && isset($_SESSION['mistet']['logged'])) {
			if ($handle = @@fopen($file, 'w')) {
				if (@@fwrite($handle, $newFile)) {
					echo "<p id = 'success'>{$pagesFile} has been succesful edited</p>";
				} else {
					echo "<p id = 'error'>fwrite: unable to write {$file}.</p>";
				}
			}
			else {
				echo "<p id = 'error'>fopen: unable to open {$file}.</p>";
			}
		} else {
			echo "<p id = 'error'>Unable to edit pages.xml: {$file} doesn't exists or you're not logged in.</p>";
		}
	}
?>
