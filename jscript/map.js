
//populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);


$.ajax({
        type: 'GET',
        url: "php/getCountriesData.php",
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

function selectCountry(country, country_iso) {


    console.log(country);
    console.log(country_iso);
    $.ajax({
        url: "php/getCountriesBorders.php",
        success: function (response) {

            var output = $.parseJSON(response);
            //console.log(output);

            var result = output.filter(obj => {
                       return obj.properties.iso_a2 === country_iso;
                  });

            var myStyle = {
                "color": "#224de6",
                "weight": 5,
                "opacity": 0.9
            };


            if(geoson){geoson.clearLayers();}
            geoson = L.geoJSON(result, {style: myStyle}).addTo(mymap);
            mymap.fitBounds(geoson.getBounds());


    
             
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
        
                    if (result.status.name == "ok") {

                        let rand_photo = Math.floor(Math.random() * 10);
                        let rand_news1 = Math.floor(Math.random() * 20);
                        let rand_news2 = Math.floor(Math.random() * 20);
                        let rand_news3 = Math.floor(Math.random() * 20);
        
                        $('#countryName').html(result['data']['country']["name"]);
                        $('#capital').html("Capital: " + result['data']['country']["capital"]);
                        $('#continent').html("Continent: " + result['data']['country']["subregion"]);
                        $('#population').html("Population: " + result['data']['country']["population"]);
                        $('#language').html("Language: " + result['data']['country']["languages"][0]["name"]);
                        $('#area').html("Area: " + result['data']['country']["area"] + " km<sup>2</sup>")
                        $('#currency').html("Currency: " + result['data']['country']["currencies"][0]["name"]);
                        $('#flagImg').attr({src: result['data']['country']['flag'], style: "width:30px"});
                        $('#weather').html("Temperature: " + result['data']['weather']['main']['temp'] + "&#8451; " + result['data']['weather']['weather'][0]['description']);
                        $('#wiki').html(result['data']['wiki']['extract']);
                        $('#photoImg').attr({src: result['data']['photo']['results'][rand_photo]['urls']['small']});
                        
                        if(result['data']['youtube']['items']){
                            $('#iframe').attr({src: 'https://www.youtube.com/embed/'+ result['data']['youtube']['items'][0]['id']['videoId']});
                        } else {
                            $('#video').html("Video not found");
                        }

                        if(result['data']['covid']["cases"]){
                        $('#cases').html("Total cases: " + result['data']['covid']["cases"]);
                        $('#recovered').html("Total recovered: " + result['data']['covid']["recovered"]);
                        $('#deaths').html("Total deaths: " + result['data']['covid']["deaths"]);
                        $('#deathsToday').html("Deaths today: " + result['data']['covid']["todayDeaths"]);
                        }else{
                            $('#cases').html("Sorry, no data found");
                            $('#recovered').html("Sorry, no data found"); 
                            $('#deaths').html("Sorry, no data found");
                            $('#deathsToday').html("Sorry, no data found");
                        }

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
                        
                    }
  
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("An error has occured!");
                }
            }); 
        
            $('#myModal').modal('show');
            
        },
    }).fail(function () {});
};

