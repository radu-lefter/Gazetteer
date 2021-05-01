<?php 

$executionStartTime = microtime(true) / 1000;
$country_wiki = preg_replace('/\s+/', '_', $_REQUEST['country']);

if($_REQUEST['country'] == "Democratic Republic of the Congo"){
	$country_wiki = "Democratic_Republic_of_the_Congo";
}else if($_REQUEST['country'] == "Congo"){
	$country_wiki = "Republic_of_the_Congo";
}else if($_REQUEST['country'] == "Georgia"){
	$country_wiki = "Georgia_(country)";
}else if($_REQUEST['country'] == "Palestine"){
	$country_wiki = "State_of_Palestine";
}

$url = "https://en.wikipedia.org/api/rest_v1/page/summary/{$country_wiki}";


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