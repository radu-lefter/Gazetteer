<?php 
$countryIso =  $_REQUEST['country_iso'];
$country =  $_REQUEST['country'];

$dataBorders = file_get_contents('../countryBorders.geo.json');


$dataBorders = json_decode($dataBorders, true); 



$countryBorders = array_filter(
    $dataBorders['features'],
    function ($e) use ($countryIso) {
        return $e['properties']['iso_a2'] == $countryIso;
    }
);

$countryBorders = array_values($countryBorders);





echo json_encode($countryBorders);



?>