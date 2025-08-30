import * as piexif from "piexifjs";

function convertDMSToDD(dms: number[][], direction: string): number {
  if (!dms || dms.length < 3) return 0;

  const[deg, min, sec] = dms.map(([num, den]) => num / den);

  let dd = deg + min / 60 + sec / 3600;

  if (direction === 'S' || direction === 'W') {
    dd = dd * -1;
  }
  return dd;
}

export function getGeolocationFromImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    // FileReader is a standard browser API for reading file contents
    const reader = new FileReader();

    reader.onload = function(e) {
      if (!e.target?.result) {
        return resolve('N/A');
      }

      try {
        // piexifjs needs the image data as a binary string
        const exifData = piexif.load(e.target.result as string);

        if (exifData.GPS) {
          const gps = exifData.GPS;
          
          const latDMS = gps[piexif.GPSIFD.GPSLatitude];
          const latRef = gps[piexif.GPSIFD.GPSLatitudeRef];
          const lonDMS = gps[piexif.GPSIFD.GPSLongitude];
          const lonRef = gps[piexif.GPSIFD.GPSLongitudeRef];

          if (latDMS && latRef && lonDMS && lonRef) {
            const latitude = convertDMSToDD(latDMS as number[], latRef as string);
            const longitude = convertDMSToDD(lonDMS as number[], lonRef as string);
            
            const geolocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            return resolve(geolocation);
          }
        }
        
      } catch (error) {
        console.error("Error with piexifjs:", error);
      }
      
      resolve('N/A');
    };

    reader.onerror = () => {
      resolve('N/A');
    };

    // This is the key part: read the file as a binary string
    reader.readAsBinaryString(file);
  });
}