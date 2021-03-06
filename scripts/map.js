
//populate the select list

let dropdown = $('#countryDropdown');

dropdown.empty();

dropdown.append('<option selected="true" value="dummy" disabled>Choose country</option>');
dropdown.prop('selectedIndex', 0);

const url = 'countryBorders.geo.json';


$.getJSON(url, function (data) {
  $.each(data.features, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.properties.iso_a3).text(entry.properties.name));
  })
});


//create the map
var mymap = L.map('mapId').setView([51.505, -0.09], 4);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);



//submit button
//var selected = $('#countryDropdown option:selected').val();
var selected = $('select option:selected').val();

console.log(selected);

var aBtn = document.getElementById("selectButton");
aBtn.onclick=function(){
    selected = $('select option:selected').val();
    selectCountry(selected);
};


//get polyline
//let coordinates;

function selectCountry(selected) {
    $.ajax({
        dataType: "json",
        url: "countriesLatLong.json",
        success: function (data) {
            //console.log(data);
           

            var result = data.ref_country_codes.filter(obj => {
                return obj.alpha3 === selected;
              });
            

            console.log(result);

            coordinates = [result[0].latitude, result[0].longitude];


            console.log(coordinates);

             
            $.ajax({
                url: "scripts/api.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: selected
                },
                success: function(result) {
        
                    //console.log(result);
        
                    if (result.status.name == "ok") {
        
                        $('#countryName').html(result['data']["name"]);
                        $('#capital').html("Capital: " + result['data']["capital"]);
                        $('#continent').html("Continent: " + result['data']["subregion"]);
                        $('#population').html("Population: " + result['data']["population"]);
                        $('#language').html("Language: " + result['data']["languages"][0]["name"]);
                        $('#currency').html("Currency: " + result['data']["currencies"][0]["name"]);
                        $('#flagImg').attr({src: result['data']['flag'], style: "width:30px"});
        
                        
                        
                        //mymap.setView([81, -0.09], 4);
                       mymap.setView(coordinates, 7); 
                    }
        
                    
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                    console.log("An error has occured!");
                }
            }); 
        
            $('#myModal').modal('show');
        },
    }).fail(function () {});
};

//getLatLong('HRV');
//let coord = getLatLong(selected);
//let lat, long;
//[lat, long] = getLatLong(selected);


//select
// function selectCountry(selected){
//     $.ajax({
//         url: "scripts/api.php",
//         type: 'POST',
//         dataType: 'json',
//         data: {
//             country: selected
//         },
//         success: function(result) {

//             //console.log(result);

//             if (result.status.name == "ok") {

//                 $('#countryName').html(result['data']["name"]);
//                 $('#capital').html("Capital: " + result['data']["capital"]);
//                 $('#continent').html("Continent: " + result['data']["subregion"]);
//                 $('#population').html("Population: " + result['data']["population"]);
//                 $('#language').html("Language: " + result['data']["languages"][0]["name"]);
//                 $('#currency').html("Currency: " + result['data']["currencies"][0]["name"]);
//                 $('#flagImg').attr({src: result['data']['flag'], style: "width:30px"});

                
                
//                 //mymap.setView([81, -0.09], 4);
//                mymap.setView(getLatLong(selected), 7);
//             }

            
        
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             // your error code
//             console.log("An error has occured!");
//         }
//     }); 

//     $('#myModal').modal('show');

// }





//populate map with countries
$.ajax({
    dataType: "json",
    url: "countryBorders.geo.json",
    success: function (data) {
        //console.log(data);
        L.geoJson(data).addTo(mymap);


        var geojson;
        
        function highlightFeature(e) {
            var layer = e.target;
        
            layer.setStyle({
                weight: 5,
                color: '#f4c324',
                dashArray: '',
                fillOpacity: 0.1
            });
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }
        
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }
        
        function getCountryInfo(e) {
            mymap.fitBounds(e.target.getBounds()); // zoom to feature
            console.log(e.target);
           

            //populate modal with country info
            $.ajax({
                url: "scripts/api.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: e.target.feature.properties.iso_a3
                },
                success: function(result) {
    
                    //console.log(result);
    
                    if (result.status.name == "ok") {
    
                        $('#countryName').html(result['data']["name"]);
                        $('#capital').html("Capital: " + result['data']["capital"]);
                        $('#continent').html("Continent: " + result['data']["subregion"]);
                        $('#population').html("Population: " + result['data']["population"]);
                        $('#language').html("Language: " + result['data']["languages"][0]["name"]);
                        $('#currency').html("Currency: " + result['data']["currencies"][0]["name"]);
                        $('#flagImg').attr({src: result['data']['flag'], style: "width:30px"});
                        
                        
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                    console.log("An error has occured!");
                }
            }); 

        

            $('#myModal').modal('show');

        }

        

        
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: getCountryInfo
                
            });
        }
        
        geojson = L.geoJson(data, {
            onEachFeature: onEachFeature
        }).addTo(mymap);
    },
  }).fail(function () {});