<?php 
$data = file_get_contents('../countryBorders.geo.json');

$data = json_decode($data, true); 
$allCountries = $data['features'];

$countryIso =  $_REQUEST['country_iso'];


$country = array_filter(
    $allCountries,
    function ($e) use ($countryIso) {
        return $e['properties']['iso_a2'] == $countryIso;
    }
);

$country = array_values($country);


echo json_encode($country);


?>