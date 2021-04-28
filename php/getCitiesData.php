<?php 

$executionStartTime = microtime(true) / 1000;

$country_cities;
if($_REQUEST['country'] == "United States"){
	$country_cities = 'United States of America';
}else if($_REQUEST['country'] == "United Kingdom"){
	$country_cities = 'United Kingdom of Great Britain and Northern Ireland';
}else if($_REQUEST['country'] == "Iran"){
	$country_cities = 'Iran (Islamic Republic of)';
}else if($_REQUEST['country'] == "North Korea"){
	$country_cities = "Democratic People's Republic of Korea";
}else if($_REQUEST['country'] == "Eswatini"){
	$country_cities = "Swaziland";
}else if($_REQUEST['country'] == "Falkland Islands"){
	$country_cities = "Falkland Islands (Malvinas)";
}else if($_REQUEST['country'] == "Korea"){
	$country_cities = "Republic of Korea";
}else if($_REQUEST['country'] == "Palestine"){
	$country_cities = "State of Palestine";
}else if($_REQUEST['country'] == "Moldova"){
	$country_cities = "Republic of Moldova";
}else if($_REQUEST['country'] == "South Sudan"){
	$country_cities = "Republic of South Sudan";
}else if($_REQUEST['country'] == "Russia"){
	$country_cities = "Russian Federation";
}else if($_REQUEST['country'] == "Macedonia"){
	$country_cities = "TFYR of Macedonia";
}else if($_REQUEST['country'] == "East Timor"){
	$country_cities = "Timor-Leste";
}else if($_REQUEST['country'] == "Tanzania"){
	$country_cities = "United Republic of Tanzania";
}else if($_REQUEST['country'] == "Venezuela"){
	$country_cities = "Venezuela (Bolivarian Republic of)";
}
else{
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



