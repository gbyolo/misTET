<?php

if (isset($_REQUEST['login'])) {
    echo "<center>
			<div class=\"login\">
    			<div>Password</div>

    			<form onsubmit=\"misTET.modules.security.execute({ login: 1, action: 1, password: $('passwd').value });\">
        		<input id=\"passwd\" type=\"password\"/><input type=\"submit\" value=\"login\"/>
    			</form>

			</div>
		</center>";

} else if (isset($_REQUEST['change'])) {
    $hashing = '';

    $hashing .= '<option value="plain">Plain</option>';
    foreach (hash_algos() as $hash) {
        $hashing .= '<option value="' . $hash . '">' . $hash . '</option>';
    }

    echo "<center>
			<div class=\"change\">
    			<div>Write the new password and choose the hashing algorithm</div>

    			<form onsubmit=\"misTET.modules.security.execute({ changePassword: 1, action: 1, password: $('passwd').value, hash: $('hash').getElementsByTagName('option')[$('hash').selectedIndex].value});\">
        		<input id=\"passwd\" type=\"password\"/><select id=\"hash\">{$hashing}</select><br/><input type=\"submit\" value=\"change\"/>
   	 			</form>

			</div>
		</center>";
}

?>
