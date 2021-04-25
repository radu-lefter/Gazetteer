<?php 

$executionStartTime = microtime(true) / 1000;
$country_triposo = strtolower($_REQUEST['country_iso']);

$url1;
$url2;
$url3;
$url4;
    if($country_triposo == 'gb'){
		$url1 ="https://www.triposo.com/api/20210317/poi.json?countrycode=uk&tag_labels=topattractions&count=20&fields=name,intro,snippet,images,coordinates&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
    	$url2 ="https://www.triposo.com/api/20210317/location.json?countrycode=uk&tag_labels=city&count=20&fields=name,intro,snippet,images,coordinates&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
		$url3 ="https://www.triposo.com/api/20210317/location.json?countrycode=uk&tag_labels=region&count=20&fields=name,intro,snippet,images,coordinates&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
		$url4 ="https://www.triposo.com/api/20210317/location.json?countrycode=uk&tag_labels=island&count=20&fields=name,intro,snippet,images,coordinates&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
	}else{
		$url1 ="https://www.triposo.com/api/20210317/poi.json?countrycode={$country_triposo}&tag_labels=topattractions&count=20&fields=name,intro,snippet,images,coordinates&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
    	$url2 ="https://www.triposo.com/api/20210317/location.json?countrycode={$country_triposo}&tag_labels=city&count=20&fields=name,intro,snippet,images,coordinates&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
		$url3 ="https://www.triposo.com/api/20210317/location.json?countrycode={$country_triposo}&tag_labels=region&count=20&fields=name,intro,snippet,images,coordinates&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
    	$url4 ="https://www.triposo.com/api/20210317/location.json?countrycode={$country_triposo}&tag_labels=island&count=20&fields=name,intro,snippet,images,coordinates&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
	}

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
    $output['data']['attractions'] = $decode1;
	$output['data']['popularCities'] = $decode2;
	$output['data']['regions'] = $decode3;
	$output['data']['islands'] = $decode4;

    header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>

