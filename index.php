<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="resources/calendar-heatmap/calendar-heatmap.css">
    <link rel="stylesheet" type="text/css" href="resources/main.css">    
    <link rel="stylesheet" href="resources/radialprogress/vizuly_radial_progress.css">


    <title>Garmin Speed Map</title>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  </head>
  <body>
    <div id="body">
      <div id="info-overlay">
        <div class="calendar"></div>
        <div class="activity"></div>
        <div class="info"></div>
        <div class="timeline"></div>
      </div>
      <div id="map"></div>
      <svg id="visualisation" width="1000" height="100"></svg>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js" charset="utf-8"></script>
      <script src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
      <script src="resources/calendar-heatmap/calendar-heatmap.js"></script>
      <script src="resources/radialprogress/vizuly_core.min.js"></script>
      <script src="resources/radialprogress/vizuly_radialprogress.min.js"></script>
      <script src="resources/errorHandler.js"></script>
      <script src="resources/map.js"></script>
      <script src="resources/chart.js"></script>
      <script src="resources/calendar.js"></script>
      <script src="resources/activityChooser.js"></script>
      <script src="resources/activityInfo.js"></script>
      <script src="resources/timeline.js"></script>
      <script src="resources/main.js"></script>
      <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=<?php echo file_get_contents('.google-maps-key');?>&callback=init">
      </script>
    </div>
  </body>
</html>