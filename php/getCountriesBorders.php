<?php 
$countryIso =  $_REQUEST['country_iso'];

$dataBorders = file_get_contents('../countryBorders.geo.json');
$dataCities = file_get_contents('../worldcities.json');

$dataBorders = json_decode($dataBorders, true); 
$dataCities = json_decode($dataCities, true); 

//filtering for country geoson array
$allCountries = $dataBorders['features'];

$country = array_filter(
    $allCountries,
    function ($e) use ($countryIso) {
        return $e['properties']['iso_a2'] == $countryIso;
    }
);

$country = array_values($country);

//filtering for country citites array

$cities = array_filter(
    $dataCities,
    function ($e) use ($countryIso) {
        return $e['iso2'] == $countryIso;
    }
);

$cities = array_values($cities);

echo json_encode([$country, $cities]);
//echo json_encode();


?>