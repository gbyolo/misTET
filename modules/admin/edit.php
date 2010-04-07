<?php

	define("VERSION", "0.1");
	define("__NAME__", "AdminPanel");
	
	/* Oh fuck */
	if (isset($_GET['menu'])) {
		$newFile = stripslashes($_POST['newMenu']);
		$file = '..'.$_GET['file'];
	
		if (file_exists($file) && isset($_SESSION['mistet']['logged'])) {
			if ($handle = @@fopen($file, 'w')) {
				if (@@fwrite($handle, $newFile)) {
					header("Location: http://".$_SERVER['HTTP_HOST']);
				} else {
					echo "false";
				}
			} else {
				echo "false";
			}
		} else {
			echo "false";
		}
	} else if (isset($_GET['pages'])) {
		
		$newFile = stripslashes($_POST['newPage']);
		$file = '..'.$_GET['file'];
		
		if (file_exists($file) && isset($_SESSION['mistet']['logged'])) {
			if ($handle = @@fopen($file, 'w')) {
				if (@@fwrite($handle, $newFile)) {
					header("Location: http://".$_SERVER['HTTP_HOST']);
				} else {
					echo "false";
				}
			}
			else {
				echo "false";
			}
		} else {
			echo "false";
		}
	}
?>
