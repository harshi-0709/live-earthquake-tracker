var map = L.map('map').setView([51.505, -0.09], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var earthquakes = L.layerGroup().addTo(map);
function getEarthquakes(){
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(response => response.json()).then(data=>{
    console.log(data.features);
    for (let i=0;i<data.features.length;i++){
        let mag = data.features[i].properties.mag;
        console.log(data.features[i].properties.mag);
        console.log(data.features[i].properties.place);
        console.log(data.features[i].properties.time);
        console.log(data.features[i].geometry.coordinates[2]);
        let longitude=data.features[i].geometry.coordinates[0];
        let latitude=data.features[i].geometry.coordinates[1];
        L.marker([latitude, longitude]).addTo(earthquakes) .bindPopup(` Location:${data.features[i].properties.place} Magnitude: ${data.features[i].properties.mag}`);;
        var circle = L.circle([latitude, longitude], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: mag* 10000
            }).addTo(earthquakes);
        
            }
}).catch(error => {
    console.error("Error fetching earthquakes:", error);
});
}
getEarthquakes();
setInterval(() =>{
    earthquakes.clearLayers();
    getEarthquakes();
    

},60000)

