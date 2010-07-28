<?php
	$ip = $_SERVER['REMOTE_ADDR'];
	$req = $_SERVER['REQUEST_URI'];
	$user = $_SERVER['HTTP_USER_AGENT'];
	$conn = $_SERVER['HTTP_CONNECTION'];
	$referer = $_SERVER['HTTP_REFERER'];
	$date = date("d-m-Y H:i:s");
	$string = "|-----------------------------------------------------|\n".
			  "IP: {$ip}\tREQ_URI: {$req}\nUSER_AGENT: {$user}\n".
			  "CONNECTION: {$conn}\n".
			  "REFERER: {$referer}\nTIME: {$date}".
			  "\n|-----------------------------------------------------|";
	$ops = "log";
	if (@@file_exists($ops) ) {
			if ($handle = @@fopen($ops, 'a')) {
				if (@@fwrite($handle, $string)) {
				}
			} 
		}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv = "Content-Type" content = "text/html; charset=iso-8859-1">

			<!-- Prototype core -->
		<script type = "text/javascript" src = "/res/prototype.js" charset = "utf-8"></script>
		<!-- misTET core -->
		<script type = "text/javascript" src = "/res/mistet.js" charset = "utf-8"></script>

		<link rel = "stylesheet" href = "/res/styles/light.css" type = "text/css">
		<link rel = "stylesheet" href = "/res/styles/menu.css" type = "text/css">

		<title></title>
	</head>
<body onLoad = "misTET.init();">

	<div id = "title"></div>
			
	<div id = "menu">
	</div>
			
	<div id = "page">
	</div>
			
	<div class = "footer">
		<div id = "padding">
            &copy; 2010 <a href = ""><strong>misTET</strong></a>.
			| <a href = "rss/">RSS Feed</a> | <a href = "javascript:misTET.check.css(window.location.href);">CSS</a> and <a href = "javascript:misTET.check.html(window.location.href);">HTML</a>  |
		</div>
	</div>
	
</body>
</html>
