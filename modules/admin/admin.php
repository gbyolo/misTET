<?php

	session_start();
	
	define("VERSION", "0.1");
	define("__NAME__", "AdminPanel");
	
	/* Inserisci qui la tua password */
	define("PASSWORD", "meg");
	
	$passHash = md5(PASSWORD);
	
	if (isset($_GET['login'])) {
		/* Prova a loggarsi */
		if (isset($_POST['password'])) {
			$password = htmlentities($_POST['password']);	
				if ($password == PASSWORD) {
					$_SESSION['mistet']['logged'] = true;
					header("Location: http://".$_SERVER['HTTP_HOST']."/#admin");
				} else {
					echo 'false';
				}
		} else {
			echo 'false';
		}
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
