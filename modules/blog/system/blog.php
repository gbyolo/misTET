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

define("VERSION", "0.3.0");
define("__NAME__", "blog");

session_start();

/* That is the bad way, you have to be logged before */
if (!$_SESSION['misTET']['logged']) {
	die("go away");
	exit;
} else {
	
	/* Check if there are not enough parameters */
	function no_parameters() {
		$result = true;
		$array = array('title', 'author', 'text');
		foreach ($array as $i => $value) {
			if (isset($_POST[$value])) {
				$result = false;
				break;
			}
		}
		return $result;
	};

	/* Remember to give the permissions to this file in order not to receive any error */
	$file = DOMDocument::load('../resources/blog.xml');

	if (isset($_GET['new'])) {
		if (no_parameters()) {
			echo "<form onsubmit=\"misTET.modules.blog.execute({post: 1, action: 1, title: $('titl').value, author: $('author').value, text: $('text').value});\">".
				 "Title: <input type = 'text' id = 'titl'></input>".
				 "<br>Author: <input type = 'text' id = 'author'></input>".
				 "<br><textarea rows = '15' cols = '60' id = 'text'></textarea>".
				 "<br><input type = 'submit' value = 'submit'></input>".
				 "</form>";
		} else {
			$newPost = $file->createElement('post');
	
			/* The only way to do this, thanks ikos */
			$id = $file->documentElement->getAttribute('n') + 1;
			$newPost->setAttribute('id', $id);
			$newPost->setAttribute('title', htmlentities(urldecode($_POST['title']), ENT_QUOTES, "UTF-8"));
			$newPost->setAttribute('author', htmlentities(urldecode($_POST['author']), ENT_QUOTES, "UTF-8"));
			$newPost->setAttribute('date', htmlentities(date("d-m-Y H:i:s"), ENT_QUOTES, "UTF-8"));
	
			/* Are you going to put a fucking text? */
			$text = $file->createCDataSection(str_replace(']]>', ']&#93;>', urldecode($_POST['text'])));
    			$newPost->appendChild($text);
    			$file->documentElement->appendChild($newPost);

			$file->documentElement->setAttribute('n', $id);
    			$file->save('../resources/blog.xml');
    			echo "<p id = 'success'>{$_POST['title']} has 
been created!</p>";
		}
	} else if (isset($_GET['show'])) {
		$posts = $file->documentElement->getElementsByTagName('post');
		$len = $posts->length;
		for ($i = 0; $i < $len; $i++) {
			$title = $posts->item($i)->getAttribute('title');
			$author = $posts->item($i)->getAttribute('author');
			$id = $i + 1;
			echo "<br>".$id." ".$title." -> <a href = '#module=blog&id={$id}&del'>Delete post</a> -> <a href = '#module=blog&id=${id}&edit'>Edit post</a>";
		}
	} else if (isset($_GET['id'])) {
		$post = $file->getElementById($_REQUEST['id']);
		
		/* You're so stupid... */
		if (!$post) {
			echo "<p id = 'error'>{$_REQUEST['id']} doesn't exist</p>";
		} else {

			if (isset($_REQUEST['edit'])) {
	
				if (no_parameters()) {
					$title = $post->getAttribute('title');
					$author = $post->getAttribute('author');
					echo "<form onsubmit=\"misTET.modules.blog.execute({id: {$_REQUEST['id']}, edit: 1, action: 1, title: $('titl').value, author: $('author').value, text: $('text').value});\">".
				 		 "Title: <input type = 'text' id = 'titl' value = '{$title}'></input>".
				 		 "<br>Author: <input type = 'text' id = 'author' value = '${author}'></input>".
				 		 "<br><textarea id = 'text' rows = '15' cols = '60'>{$post->nodeValue}</textarea>".
				 		 "<br><input type = 'submit' value = 'submit'></input>".
				 		 "</form>";
				} else {
					$post = $file->getElementById($_REQUEST['id']);
					$post->setAttribute('title', htmlentities(urldecode($_POST['title']), ENT_QUOTES, 'UTF-8'));
					$post->setAttribute('author', htmlentities(urldecode($_POST['author']), ENT_QUOTES, 'UTF-8'));
					$post->setAttribute('date', htmlentities(date("d-m-Y H:i:s"), ENT_QUOTES, 'UTF-8'));

					$post->removeChild($post->firstChild);
					$text = $file->createCDataSection(str_replace(']]>', ']&#93;>', urldecode($_POST['text'])));
					$post->appendChild($text);

					$file->save('../resources/blog.xml');
					echo "<p id = 'success'>{$_POST['title']} has been edited!</p>";
				}
	
			} else if (isset($_REQUEST['del'])) {
				$file->documentElement->removeChild($post);
				$file->save('../resources/blog.xml');
				echo "<p id = 'success'>{$_REQUEST['id']} has been deleted!</p>";
			}
		}	
	} else {
		echo "<h2>Blog/Admin</h2>";
		echo "<br><a href = '?new'>New Post</a><br>".
			 "<a href = '?show'>View all posts</a>";
	}
}
?>
