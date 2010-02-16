<?php

	define("VERSION", "0.1");
	define("__NAME__", "AdminPanel");
	
	$newFile = $_POST['newMenu'];
	
	if (!isset( $_POST['newMenu'] )) {
		echo $_SERVER['HTTP_HOST'];
	} else {
		$handle = fopen("http://"+$_SERVER['HTTP_HOST']+"/res/files/menu.xml", "w");
		if ($handle) {
			fwrite($handle, $newFile);
		} else {
			echo $_SERVER['HTTP_HOST'];
		}
	}
	fclose($handle);
	
	
?>
