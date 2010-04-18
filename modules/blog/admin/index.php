<?
	session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content = "text/html; charset=iso-8859-1">
		<link rel = "stylesheet" href = "/res/styles/style.css" type = "text/css">
		<link rel = "stylesheet" href = "/res/styles/menu.css" type = "text/css">

		<title>misTET - Power on earth</title>
	</head>
<body>
	<div id="content">
			<div id = 'preheader'></div>
			<div id = "header">
				<div id = "title">misTET - Power on earth</div>
				<div id = "slogan">Your best cms.</div>
			</div>
			<div id = "menu">
			</div>
			<div id = "main_content">
				<div id = "sd_right">
					<div id = "text_padding">
						<h2>Blog/Admin</h2>
						<a href = "/modules/blog/admin">Main page</a><br>
						<a href = "/">HomePage</a>
						<h2>Info</h2>
						e-mail: <a href = "mailto:gdb.lost@gmail.com">gdb.lost[at]gmail[dot]com</a>
						<a href = "http://github.com/lostpassword/misTET" target = "_blank">Github</a>
					</div>
				</div>
				<div id = "sd_left">
					<?php
						require('blog.php');
					?>
				</div>
				<div id = "footer">
					<div id = "padding">
                    &copy; 2010 <a href = ""><strong>misTET</strong></a>.

| <a href = "rss/">RSS Feed</a> | <a href = "javascript:misTET.check.css(window.location.href);">CSS</a> and <a href = "javascript:misTET.check.html(window.location.href);">HTML</a>  |
					</div>
				</div>
			</div>
	</div>
	
</body>
</html>
