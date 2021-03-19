<?php 

$data = file_get_contents('../countryBorders.geo.json');

$data = json_decode($data, true); 


$countries=[];
foreach ($data['features'] as $country){
    array_push($countries, $country['properties']);
}

usort($countries, function($a, $b) {return strcmp($a['name'], $b['name']);});

echo json_encode($countries);


?>