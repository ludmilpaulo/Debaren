export async function geocodeAddress(address: string): Promise<{ lat: string, lng: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const resp = await fetch(url, { headers: { 'Accept-Language': 'en' } }); // you can tweak the locale
    if (!resp.ok) {
      console.error("[geocodeAddress] Bad response for:", address, resp.status);
      return null;
    }
    const data = await resp.json();
    if (data && data.length > 0) {
      // Round to 6 decimals, ensure as string
      const rawLat = Number(data[0].lat);
      const rawLng = Number(data[0].lon);
      const lat = rawLat.toFixed(6);
      const lng = rawLng.toFixed(6);
      console.log(`[geocodeAddress] Address: "${address}" → lat: ${lat}, lng: ${lng}`);
      return { lat, lng };
    } else {
      console.warn(`[geocodeAddress] No results for: "${address}"`);
    }
  } catch (err) {
    console.error("[geocodeAddress] Error geocoding:", address, err);
  }
  return null;
}
