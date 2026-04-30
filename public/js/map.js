
      let mapToken = maptoken;
      
      console.log(mapToken)
      maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
        
        container: "map",
        style: maptilersdk.MapStyle.STREETS,
        center: center, // Bangalore
        zoom: 9
  });
new maptilersdk.Marker()
  .setLngLat(center) // [longitude, latitude]
  .addTo(map);
