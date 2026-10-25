var map = L.map('map').setView([51.505, -0.09], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
var earthquakes = L.layerGroup().addTo(map);
function getEarthquakes(){
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(response => response.json()).then(data=>{
        data.features.sort((a, b) => {
        return b.properties.time - a.properties.time;
    });
    console.log(data.features);
    const list = document.getElementById("earthquake-list");
    list.innerHTML = "";
    for (let i=0;i<data.features.length;i++){
        let mag = data.features[i].properties.mag;
        console.log(data.features[i].properties.mag);
        console.log(data.features[i].properties.place);
        let loc = data.features[i].properties.place
        let timestamp = data.features[i].properties.time;
        let time = new Date(timestamp).toLocaleString();
        console.log(data.features[i].geometry.coordinates[2]);
        const item = document.createElement("div");

        item.innerHTML = `
            <h3>${data.features[i].properties.place}</h3>
            <p>Magnitude: ${mag}</p>
            <p>Time: ${time}</p>
        `;

        list.appendChild(item);
        let longitude=data.features[i].geometry.coordinates[0];
        let latitude=data.features[i].geometry.coordinates[1];
        L.marker([latitude, longitude]).addTo(earthquakes) .bindPopup(` Location:${loc} Magnitude: ${mag} Time:${time}`);
        let color = 'red'
        let fill = '#f03'
        if (mag < 3.0){
             color = 'orange';
             fill='rgba(254, 52, 34, 1)'

        }
        else if (mag>=3.0 && mag < 6.0){
            color = 'red'
            fill = '#f03'
        }
        else{
            color='magenta';
            fill='rgba(68, 1, 14, 1)'
        }
        var circle = L.circle([latitude, longitude], {
                color: color,
                fillColor: fill,
                fillOpacity: 0.5,
                radius: mag* 100000
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

