<?php 

$dataCountries = file_get_contents("https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}");
$dataCountries = json_decode($dataCountries, true);
$capital = $dataCountries['capital'];
$capital_cage = preg_replace('/\s+/', '_', $dataCountries['capital']);


$executionStartTime = microtime(true) / 1000;

$url1 = "https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}";

$url2 = "https://api.openweathermap.org/data/2.5/weather?q=$capital,{$_REQUEST['country_iso']}&units=metric&APPID=cf68da85a38201a07b3983c702e86457";

$url3 = "https://openexchangerates.org/api/latest.json?app_id=8ac98ac2eff345c38601e892f6a1b191";

$url4 = "https://api.opencagedata.com/geocode/v1/json?q=$capital_cage&key=68d11922aad3402caf0baf9b8377a56b";

$ch1 = curl_init();
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$url1);

    $ch2 = curl_init();
	curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$url2);

    $ch3 = curl_init();
	curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch3, CURLOPT_URL,$url3);

	$ch4 = curl_init();
	curl_setopt($ch4, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch4, CURLOPT_URL,$url4);

    $result1=curl_exec($ch1);
    $result2=curl_exec($ch2);
    $result3=curl_exec($ch3);
    $result4=curl_exec($ch4);

    curl_close($ch1);
    curl_close($ch2);
    curl_close($ch3);
    curl_close($ch4);

    $decode1 = json_decode($result1,true);	
    $decode2 = json_decode($result2,true);
    $decode3 = json_decode($result3,true);
	$decode4 = json_decode($result4,true);

    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['country'] = $decode1;
    $output['data']['weather'] = $decode2;
	$output['data']['exchange'] = $decode3;
	$output['data']['opencage'] = $decode4;

    header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);


?>