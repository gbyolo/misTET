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

define("VERSION", "0.0.1");
define("__NAME__", "blog");

session_start();

/* That is the bad way, you have to be logged before */
if (!isset($_SESSION['mistet']['logged'])) {
	header("Location: http://".$_SERVER['HTTP_HOST']."/#admin");
}

$file = DOMDocument::load('resources/blog.xml');

if (isset($_GET['new'])) {
	$newPost = $file->createElement('post');
	
	/* The only way to do this, thanks ikos */
	$id = $file->documentElement->getAttribute('n') + 1;
	$newPost->setAttribute('id', $id);
	$newPost->setAttribute('title', htmlentities(urldecode($_POST['title']), ENT_QUOTES, "UTF-8"));
	$newPost->setAttribute('author', htmlentities(urldecode($_POST['author']), ENT_QUOTES, "UTF-8"));
	$newPost->setAttribute('date', htmlentities(date("d-m-Y H:i:s"), ENT_QUOTES, "UTF-8"));
	
	$text = $file->createCDataSection(str_replace(']]>', ']&#93;>', urldecode($_POST['text'])));
    $newPost->appendChild($text);
    $file->documentElement->appendChild($newPost);

	$file->documentElement->setAttribute('n', $id);
    $file->save('resources/blog.xml');
    header("Location: http://".$_SERVER['HTTP_HOST']."/#blog");
    exit;

}

if (isset($_GET['id'])) {
	$post = $file->getElementById($_REQUEST['id']);

	if (!$post) {
	
		echo "false";
		exit;
	
	}

	if (isset($_REQUEST['edit'])) {
	
		$post->setAttribute('title', htmlentities(urldecode($_POST['title']), ENT_QUOTES, 'UTF-8'));
		$post->setAttribute('author', htmlentities(urldecode($_POST['author']), ENT_QUOTES, 'UTF-8'));
		$post->setAttribute('date', htmlentities(date("d-m-Y H:i:s"), ENT_QUOTES, 'UTF-8'));

		$post->removeChild($post->firstChild);
		$text = $data->createCDataSection(str_replace(']]>', ']&#93;>', urldecode($_POST['text'])));
		$post->appendChild($text);

		$file->save('resources/blog.xml');
		header("Location: http://".$_SERVER['HTTP_HOST']."/#blog");
	
	} else if (isset($_REQUEST['del'])) {
	
		$file->documentElement->removeChild($post);
		$file->save('resources/blog.xml');
		header("Location: http://".$_SERVER['HTTP_HOST']."/#blog");
    
	}
}
?>
