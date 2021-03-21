

//Set button for showing modal
$("#button_show").click(function() {
    $('#myModal').modal('show');
  });


//populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);


$.ajax({
        type: 'GET',
        url: "php/getCountriesNames.php",
        success: function (response) {

            var output = $.parseJSON(response);
            //console.log(output);

            if(response){
                for (let item of output) {
                    dropdown.append($('<option></option>').attr('value', item.iso_a2).text(item.name));
             }
            }
           
           
        },
    }).fail(function () {
        console.log("Error encountered!")
    });



    



//Create the map
var mymap = L.map('mapId').fitWorld();

//Set map to users current location
mymap.locate({setView: true, maxZoom: 5});


//Add the map layer
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);



//Add interactivity on select
$('#countryDropdown').change(function(){
    let country = $('select option:selected').text();
    let country_iso = $('select option:selected').val();
    selectCountry(country, country_iso)
    
});


//Adding border around each country and fetching data

var geoson;
var markers = L.layerGroup().addTo(mymap);
var nf = Intl.NumberFormat();



function selectCountry(country, country_iso) {

    //show loading gif
    $('#loading').show();
    $('#content').hide();

    console.log(country);
    console.log(country_iso);

    $.ajax({
        url: "php/getCountriesData.php",
        type: 'POST',
        data: {
            country_iso: country_iso,
            country: country
        },
        success: function (response) {

            
            var result = $.parseJSON(response);
           
            console.log(result);

            var myStyle = {
                "color": "#224de6",
                "weight": 5,
                "opacity": 0.9
            };

            
            markers.clearLayers();
           

            if(geoson){geoson.clearLayers();}
            geoson = L.geoJSON(result[0], {style: myStyle}).addTo(mymap);
            mymap.fitBounds(geoson.getBounds());

            var greenIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [35, 51],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });

            var redIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [20, 33],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });
            
            var goldIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [20, 33],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });

              

            var marker;

            //populate the markers on the map
            function populate(){
                for (let item of result[1]) {
                    if(item['capital']=="primary"){
                        marker = L.marker([item['lat'], item['lng']], {icon: greenIcon}).bindPopup(`This is a capital city! <br> Name: ${item['city']} <br> Population: ${nf.format(item['population'])}`);
                        markers.addLayer(marker);
                    }else{
                        marker = L.marker([item['lat'], item['lng']], {icon: redIcon}).bindPopup(`Name: ${item['city']} <br> Population: ${nf.format(item['population'])}`);
                        markers.addLayer(marker);
                    }
                    
                } 
                for (let item of result[2]) {
                    marker = L.marker([item['properties']['latitude'], item['properties']['longitude']], {icon: goldIcon}).bindPopup(`Name: ${item['properties']['name_en']} <br> Description: ${item['properties']['short_description_en']}`);
                    markers.addLayer(marker);
                }
            }

            populate();

            //creating a list of the major cities in modal
            var list =  document.getElementById('cities');
            list.innerHTML = "";
            for (var i = 0; i < result[1].length; i++) {
                li = document.createElement('li');
                li.innerHTML = result[1][i]['city'];
                list.appendChild(li);
            }

            //list of the unesco sites
            if(result[2].length == 0){
                $('#usites').html("No unesco heritage sites present.")
            }else{
            var list2 =  document.getElementById('usites');
            list2.innerHTML = "";
            for (var i = 0; i < result[2].length; i++) {
                li = document.createElement('li');
                li.innerHTML = result[2][i]['properties']['name_en'];
                list2.appendChild(li);
            }
        }

             //gettind data from the apis
            $.ajax({
                url: "php/getAPIData.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country_iso: country_iso, 
                    country: country
                },
                success: function(result) {
        
                    console.log(result);
                    

                    if(result.status.name == "ok"){
                        
                    

                        let rand_photo = Math.floor(Math.random() * 10);
                        let rand_news1 = Math.floor(Math.random() * 20);
                        let rand_news2 = Math.floor(Math.random() * 20);
                        let rand_news3 = Math.floor(Math.random() * 20);
        
                        //Restcountries
                        $('#countryName').html(result['data']['country']["name"]);
                        $('#capital').html("Capital: " + result['data']['country']["capital"]);
                        $('#continent').html("Continent: " + result['data']['country']["subregion"]);
                        $('#population').html("Population: " + nf.format(result['data']['country']["population"]));

                        var para =  document.getElementById('language');
                        para.innerHTML = "";
                        para.innerHTML = "Languages: ";
                        for (var i = 0; i < result['data']['country']['languages'].length; i++) {
                            span = document.createElement('span');
                            span.innerText = `| ${result['data']['country']['languages'][i]['name']} | `;
                            para.appendChild(span);
                        }

                        $('#area').html("Area: " + nf.format(result['data']['country']["area"]) + " km<sup>2</sup>");
                        $('#currency').html("Currency: " + result['data']['country']["currencies"][0]["name"]);
                        $('#exchange').html("One USD is worth "+ result['data']['exchange']['rates'][result['data']['country']["currencies"][0]["code"]] +" "+ result['data']['country']["currencies"][0]["code"]);
                        $('#flagImg').attr({src: result['data']['country']['flag'], style: "width:30px"});
                        $('#weather').html("Temperature: " + result['data']['weather']['main']['temp'] + "&#8451; " + result['data']['weather']['weather'][0]['description']);
                        $('#phone').html("Phone prefix: " + result['data']['country']["callingCodes"][0]);
                        $('#gini').html("Gini coefficient: " + result['data']['country']["gini"]);

                        //Opencage
                        if(result['data']['opencage']){
                            var sunrise = new Date((result['data']['opencage']['results'][0]['annotations']['sun']['rise']['apparent'] + result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec'])*1000);
                            var sunset = new Date((result['data']['opencage']['results'][0]['annotations']['sun']['set']['apparent']+ result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec'])*1000);
                        $('#driving').html("Driving on the "+ result['data']['opencage']['results'][0]['annotations']['roadinfo']['drive_on']+" side");
                        $('#localTime').html("Local date and time is "+ new Date(new Date().getTime() + result['data']['opencage']['results'][0]['annotations']['timezone']['offset_sec']*1000).toString().substr(0,25));
                        $('#sunrise').html("Sun rises at "+ sunrise.toString().substr(16,8));
                        $('#sunset').html("Sun sets at "+ sunset.toString().substr(16,8));
                        }else{
                            $('#driving').html("");
                            $('#localTime').html("");
                            $('#sunrise').html("");
                            $('#sunset').html(""); 
                        }

                        //Nobel
                        if(result['data']['nobel']['laureates'].length == 0){
                            $('#nobel').html("No nobel prize winners.")
                        }else{
                        var list3 =  document.getElementById('nobel');
                            list3.innerHTML = "";
                            for (var i = 0; i < result['data']['nobel']['laureates'].length; i++) {
                                li = document.createElement('li');
                                li.innerHTML = `${result['data']['nobel']['laureates'][i]['fullName']['en']} in ${result['data']['nobel']['laureates'][i]['nobelPrizes'][0]['awardYear']} for ${result['data']['nobel']['laureates'][i]['nobelPrizes'][0]['category']['en']}`;
                                list3.appendChild(li);
                            }
                        }


                        $('#wiki').html(result['data']['wiki']['extract']);

                        //Unsplash
                        if(!result['data']['photo']['results'][rand_photo]){
                            $('#photoImg').attr({src: result['data']['photo']['results'][rand_photo]['urls']['small']});
                        }else{
                            $('#photoImg').attr({src: result['data']['photo']['results'][0]['urls']['small']});
                        }

                        //Youtube
                        if(result['data']['youtube']['items']){
                            $('#iframe_1').attr({src: 'https://www.youtube.com/embed/'+ result['data']['youtube']['items'][0]['id']['videoId']});
                        } else {
                            $('#video').html("Video not found");
                        }

                        //Camera
                        if(result['data']['camera']['result']['webcams'][0]){
                            $('#camLoc').html(result['data']['camera']['result']['webcams'][0]['location']['region']+" - "+result['data']['camera']['result']['webcams'][0]['location']['city'])
                            $('#iframe_2').attr({src: result['data']['camera']['result']['webcams'][0]['player']['year']['embed']});
                        } else {
                            $('#camera').html("Camera not found");
                        }

                        //Coovid
                        if(result['data']['covid']["cases"]){
                        $('#cases').html("Total cases: " + nf.format(result['data']['covid']["cases"]));
                        $('#recovered').html("Total recovered: " + nf.format(result['data']['covid']["recovered"]));
                        $('#deaths').html("Total deaths: " + nf.format(result['data']['covid']["deaths"]));
                        $('#deathsToday').html("Deaths today: " + nf.format(result['data']['covid']["todayDeaths"]));
                        }else{
                            $('#cases').html("Sorry, no data found");
                            $('#recovered').html("Sorry, no data found"); 
                            $('#deaths').html("Sorry, no data found");
                            $('#deathsToday').html("Sorry, no data found");
                        }

                        //News
                        if(result['data']['news']['articles']){
                            $('#news1').attr({href: result['data']['news']['articles'][rand_news1]['url']});
                            $('#news1').html(result['data']['news']['articles'][rand_news1]['title']);
                            $('#news2').attr({href: result['data']['news']['articles'][rand_news2]['url']});
                            $('#news2').html(result['data']['news']['articles'][rand_news2]['title']);
                            $('#news3').attr({href: result['data']['news']['articles'][rand_news3]['url']});
                            $('#news3').html(result['data']['news']['articles'][rand_news3]['title']);
                        }else{
                            $('#news').html("Sorry, news service not available at the moment.")
                        }
                        
                        //hide loading gif
                        $('#loading').hide();
                        $('#content').show();
                        
                        
                    }
  
                },
                error: function() {
                    console.log("An error has occured!");
                }
            }); 
        
            $('#myModal').modal('show');
            setTimeout(function (){document.getElementById("button_show").style.display = "block"}, 2000);
            
            

        },
    }).fail(function () {});
};

