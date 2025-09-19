let mapToken =  mapboxToken;
 // Ensure mapboxToken is defined in your HTML or environment
console.log("Map Token:", mapToken);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
    center: listing.geometry.coordinates // center the map on this longitude and latitude
 });
      
map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<p>${listing.location}</p>`);

const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 })
.setLngLat(listing.geometry.coordinates )
.setPopup(popup)
.addTo(map);

