<?php

$files = array_slice(scandir("./out/"), 2);

if (isset($_GET['file'])) {
	$file = basename($_GET['file']);
	if (!is_file("./out/$file")) {
		$file = $files[0];
	}
	echo file_get_contents("./out/$file");} else {	$files = array_slice(scandir("./out/"), 2);	echo json_encode($files);}