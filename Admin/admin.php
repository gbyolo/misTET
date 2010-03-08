<?php
	session_start();
	
	define("VERSION", "0.1");
	define("__NAME__", "AdminPanel");
	
	/* Inserisci qui la tua password */
	define("PASSWORD", "meg");
	
	$passHash = md5(PASSWORD);
	
	if (isset($_GET['login']) && isset($_GET['password'])) {
		/* Prova a loggarsi */
		$password = htmlentities($_GET['password']);	
		if ($password == $passHash) {
			echo 'true';
			$_SESSION['mistet']['logged'] = true;
		} else {
			echo 'false';
		}
		exit;
	}
	if (isset($_GET['crypt']) && isset($_GET['string'])) {
		echo md5(htmlentities($_GET['string']));
	}
	if (isset($_GET['connected'])) {
    	if ($_SESSION['mistet']['logged']) {
        	echo 'true';
    	}
    	else {
        	echo 'false';
    	}
 
   		exit;
	}
	if (isset($_GET['logout'])) {
		unset($_SESSION['mistet']);
		echo "true";
		exit;
	}
