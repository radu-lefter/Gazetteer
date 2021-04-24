
<?php


//$country_wiki = preg_replace('/\s+/', '_', $_REQUEST['country']);
$country = preg_replace('/\s+/', '-', $_REQUEST['country']);
//$country_nobel = preg_replace('/\s+/', '_', $_REQUEST['country']);
//$date = date("Y-m-d", strtotime("-1 months"));
$country_triposo = strtolower($_REQUEST['country_iso']);

$country_cities;
if($_REQUEST['country'] == "United States"){
	$country_cities = 'United States of America';
}else if($_REQUEST['country'] == "United Kingdom"){
	$country_cities = 'United Kingdom of Great Britain and Northern Ireland';
}else{
	$country_cities = $_REQUEST['country'];
}



$dataCountries = file_get_contents("https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}");
$dataCountries = json_decode($dataCountries, true);
$capital = $dataCountries['capital'];

$executionStartTime = microtime(true) / 1000;

	
	$url1 = "https://restcountries.eu/rest/v2/alpha/{$_REQUEST['country_iso']}";

    //$url2 = "https://en.wikipedia.org/api/rest_v1/page/summary/{$country_wiki}";

    //$url3 = "https://api.unsplash.com/search/photos?query={$country}&client_id=4BysAZ8jjWLhxY7QeQW2Yk7bhXnnlf99uTY0s0ttQTU";

	//$url4 = "https://newsapi.org/v2/everything?q={$country}&from={$date}&sortBy=popularity&apiKey=130f57bb770e4126ab3b0d2e2ec5e2a8";

	$url5 = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCmmPgObSUPw1HL2lq6H4ffA&q={$country}&key=AIzaSyCvsp8SVAs7-J9mONpzI9cnqvhn-1s8GB4";

	//$url6 = "https://corona.lmao.ninja/v2/countries/{$_REQUEST['country']}?yesterday&strict&query";

	$url7 = "https://api.openweathermap.org/data/2.5/weather?q=$capital,{$_REQUEST['country_iso']}&units=metric&APPID=cf68da85a38201a07b3983c702e86457";

    $url8 = "https://openexchangerates.org/api/latest.json?app_id=8ac98ac2eff345c38601e892f6a1b191";

    $url9 = "https://api.opencagedata.com/geocode/v1/json?q=$capital&key=68d11922aad3402caf0baf9b8377a56b";


    // $url10;
	// if($country == "United-States"){
	// 	$url10 = "https://api.nobelprize.org/2.0/laureates?residence=usa";
	// }else{
	// 	$url10 = "https://api.nobelprize.org/2.0/laureates?residence={$country_nobel}";
	// }

	$url11 ="https://api.windy.com/api/webcams/v2/list/country={$_REQUEST['country_iso']}/?show=webcams:player,location&key=tTmu5wsss0RgBLG0bb218sYWqon0CSpb";

	$url12 ="https://countriesnow.space/api/v0.1/countries/population/cities/filter";

	$url13;
	$url14;
    if($country_triposo == 'gb'){
		$url13 ="https://www.triposo.com/api/20210317/poi.json?countrycode=uk&tag_labels=topattractions&count=20&fields=id,name,tag_labels,coordinates,snippet&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
    	$url14 ="https://www.triposo.com/api/20210317/location.json?countrycode=uk&tag_labels=city&count=20&fields=id,coordinates,name,score,snippet&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
	}else{
		$url13 ="https://www.triposo.com/api/20210317/poi.json?countrycode={$country_triposo}&tag_labels=topattractions&count=20&fields=id,name,tag_labels,coordinates,snippet&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
    	$url14 ="https://www.triposo.com/api/20210317/location.json?countrycode={$country_triposo}&tag_labels=city&count=20&fields=id,coordinates,name,score,snippet&order_by=-score&account=XT9E9UKC&token=kr7m6d774lgujgu60tekqdk08qzwfs1j";
	}

	$ch1 = curl_init();
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$url1);

    // $ch2 = curl_init();
	// curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	// curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	// curl_setopt($ch2, CURLOPT_URL,$url2);

    // $ch3 = curl_init();
	// curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, false);
	// curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
	// curl_setopt($ch3, CURLOPT_URL,$url3);

	// $ch4 = curl_init();
	// curl_setopt($ch4, CURLOPT_SSL_VERIFYPEER, false);
	// curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
	// curl_setopt($ch4, CURLOPT_URL,$url4);

	$ch5 = curl_init();
	curl_setopt($ch5, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch5, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch5, CURLOPT_URL,$url5);

	// $ch6 = curl_init();
	// curl_setopt($ch6, CURLOPT_SSL_VERIFYPEER, false);
	// curl_setopt($ch6, CURLOPT_RETURNTRANSFER, true);
	// curl_setopt($ch6, CURLOPT_URL,$url6);

	$ch7 = curl_init();
	curl_setopt($ch7, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch7, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch7, CURLOPT_URL,$url7);

	$ch8 = curl_init();
	curl_setopt($ch8, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch8, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch8, CURLOPT_URL,$url8);

	$ch9 = curl_init();
	curl_setopt($ch9, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch9, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch9, CURLOPT_URL,$url9);

	// $ch10 = curl_init();
	// curl_setopt($ch10, CURLOPT_SSL_VERIFYPEER, false);
	// curl_setopt($ch10, CURLOPT_RETURNTRANSFER, true);
	// curl_setopt($ch10, CURLOPT_URL,$url10);

	$ch11 = curl_init();
	curl_setopt($ch11, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch11, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch11, CURLOPT_URL,$url11);

	$ch12 = curl_init();
	curl_setopt($ch12, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch12, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch12, CURLOPT_URL,$url12);
	curl_setopt($ch12, CURLOPT_CUSTOMREQUEST, 'POST');

	$data = array(
		
		"order" => "asc",
		"orderBy" => "name",
		"country" => $country_cities,
		);
	
	
	curl_setopt($ch12, CURLOPT_POSTFIELDS, http_build_query($data));
	
	

	$ch13 = curl_init();
	curl_setopt($ch13, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch13, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch13, CURLOPT_URL,$url13);

	$ch14 = curl_init();
	curl_setopt($ch14, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch14, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch14, CURLOPT_URL,$url14);



	$result1=curl_exec($ch1);
    //$result2=curl_exec($ch2);
    //$result3=curl_exec($ch3);
    //$result4=curl_exec($ch4);
	$result5=curl_exec($ch5);
	//$result6=curl_exec($ch6);
	$result7=curl_exec($ch7);
	$result8=curl_exec($ch8);
	$result9=curl_exec($ch9);
	//$result10=curl_exec($ch10);
	$result11=curl_exec($ch11);
	$result12=curl_exec($ch12);
	$result13=curl_exec($ch13);
	$result14=curl_exec($ch14);

	curl_close($ch1);
    //curl_close($ch2);
    //curl_close($ch3);
    //curl_close($ch4);
	curl_close($ch5);
	//curl_close($ch6);
	curl_close($ch7);
	curl_close($ch8);
	curl_close($ch9);
	//curl_close($ch10);
	curl_close($ch11);
	curl_close($ch12);
	curl_close($ch13);
	curl_close($ch14);

	$decode1 = json_decode($result1,true);	
    //$decode2 = json_decode($result2,true);
    //$decode3 = json_decode($result3,true);
	//$decode4 = json_decode($result4,true);
	$decode5 = json_decode($result5,true);
	//$decode6 = json_decode($result6,true);
	$decode7 = json_decode($result7,true);
	$decode8 = json_decode($result8,true);
	$decode9 = json_decode($result9,true);
	//$decode10 = json_decode($result10,true);
	$decode11 = json_decode($result11,true);
	$decode12 = json_decode($result12,true);
	$decode13 = json_decode($result13,true);
	$decode14 = json_decode($result14,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['country'] = $decode1;
    //$output['data']['wiki'] = $decode2;
    //$output['data']['photo'] = $decode3;
	//$output['data']['news'] = $decode4;
	$output['data']['youtube'] = $decode5;
	//$output['data']['covid'] = $decode6;
	$output['data']['weather'] = $decode7;
	$output['data']['exchange'] = $decode8;
	$output['data']['opencage'] = $decode9;
	//$output['data']['nobel'] = $decode10;
	$output['data']['camera'] = $decode11;
	$output['data']['cities'] = $decode12;
	$output['data']['attractions'] = $decode13;
	$output['data']['popularCities'] = $decode14;
    
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>
