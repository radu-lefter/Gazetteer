<?php 

$executionStartTime = microtime(true) / 1000;

$country_cities;
if($_REQUEST['country'] == "United States"){
	$country_cities = 'United States of America';
}else if($_REQUEST['country'] == "United Kingdom"){
	$country_cities = 'United Kingdom of Great Britain and Northern Ireland';
}else{
	$country_cities = $_REQUEST['country'];
}

$url = "https://countriesnow.space/api/v0.1/countries/population/cities/filter";


$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');

    $data = array(
		
		"order" => "asc",
		"orderBy" => "name",
		"country" => $country_cities,
		);

    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>