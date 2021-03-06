
//var data = require('countryBorders.geo.json');

//import * as data from 'countryBorders.geo.json';



var mymap = L.map('mapId').setView([51.505, -0.09], 3);

L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(mymap);



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
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
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
            console.log(e.target.feature.properties.name);

            $.ajax({
                url: "scripts/api.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: e.target.feature.properties.name
                },
                success: function(result) {
    
                    console.log(result);
    
                    if (result.status.name == "ok") {
    
                        $('#countryName').html(result['data'][0]["name"]);
                        $('#population').html("Population: " + result['data'][0]["population"]);
                        
                        
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