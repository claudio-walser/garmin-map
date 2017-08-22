<?php

function getDates() {
	$files = scandir("./out/");
	$return = array();
	foreach ($files as $file) {
		if ($file == '.' || $file == '..') {
			continue;
		}

		if (is_dir("./out/" . $file)) {
			$activities = scandir("./out/" . $file);
			$activityNames = array();
			if (is_array($activities)) {
				foreach ($activities as $activity) {
					if ($activity == '.' || $activity == '..') {
						continue;
					}
					$activityParts = explode('-', $activity);
					$activityName = $activityParts[0];
					array_push($activityNames, $activityName);

				}
			}
			$return[$file]['count'] = count(getJsonFiles($file));
			$return[$file]['activities'] = $activityNames;
		}
	}
	return $return;
}

function getJsonFiles($date) {
	$files = scandir("./out/" . $date);
	$return = array();
	foreach ($files as $file) {
		if (strpos($file, '.json')) {
			array_push($return, $file);
		}
	}
	return $return;
}


if (isset($_GET['dates'])) {
	$dates = getDates();
	echo json_encode($dates);
} else if (isset($_GET['file']) && isset($_GET['file_date'])) {
	$file = basename($_GET['file']);
	$fileDate = basename($_GET['file_date']);
	if (!is_file("./out/$fileDate/$file")) {
		echo json_encode([]);
	} else {
		echo file_get_contents("./out/$fileDate/$file");
	}
} else if (isset($_GET['date'])) {
	$date = basename($_GET['date']);
	$files = scandir("./out/" . $date);
	$return = array();
	foreach ($files as $file) {
		if (strpos($file, '.json')) {
			array_push($return, $file);
		}
	}
	echo json_encode($return);
}