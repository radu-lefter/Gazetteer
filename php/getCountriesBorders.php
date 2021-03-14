<?php 
$data = file_get_contents('../countryBorders.geo.json');

$data = json_decode($data, true); 


$borders=[];
foreach ($data['features'] as $country){
    array_push($borders, $country);
}


echo json_encode($borders);

?>