<?php 
$countryIso =  $_REQUEST['country_iso'];
$country =  $_REQUEST['country'];

$dataBorders = file_get_contents('../countryBorders.geo.json');
$dataCities = file_get_contents('../worldcities.json');
$dataUnesco = file_get_contents('../world-heritage-unesco-list.json');

$dataBorders = json_decode($dataBorders, true); 
$dataCities = json_decode($dataCities, true); 
$dataUnesco = json_decode($dataUnesco, true); 

//filtering for country geoson array

$allCountries = $dataBorders['features'];


$countryBorders = array_filter(
    $allCountries,
    function ($e) use ($countryIso) {
        return $e['properties']['iso_a2'] == $countryIso;
    }
);

$countryBorders = array_values($countryBorders);

//filtering for country citites array

$cities = array_filter(
    $dataCities,
    function ($e) use ($countryIso) {
        return $e['iso2'] == $countryIso;
    }
);

$cities = array_values($cities);

if(count($cities)>=9){
    $cities = array_slice($cities, 0, 15);
}

//filtering for country unesco sites array

$unescoCountries = $dataUnesco['features'];

$unesco = array_filter(
    $unescoCountries,
    function ($e) use ($country) {
        return $e['properties']['country_en'] == $country;
    }
);

$unesco = array_values($unesco);



echo json_encode([$countryBorders, $cities, $unesco]);
//echo json_encode();


?>