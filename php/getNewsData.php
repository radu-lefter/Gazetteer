<?php 

$executionStartTime = microtime(true) / 1000;
$country = preg_replace('/\s+/', '-', $_REQUEST['country']);
$date = date("Y-m-d", strtotime("-1 months"));

$url = "https://newsapi.org/v2/everything?q={$country}&sources=reuters,bbc&from={$date}&sortBy=popularity&apiKey=130f57bb770e4126ab3b0d2e2ec5e2a8";


$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

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