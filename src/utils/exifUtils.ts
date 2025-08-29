import * as EXIF from "exif-js";

function convertDMSToDD(dms: number[], direction: string): number {
    const degrees = dms[0];
    const minutes = dms[1] / 60;
    const seconds = dms[2] / 3600;

    let dd = degrees + minutes + seconds;

    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    }
    return dd;
}

export function getGeolocationFromImage(file: File): Promise<string> {
    console.log("Getting Geolocation from file");
    return new Promise((resolve) => {
        EXIF.getData(file as never, function(this: never) {
            const allTags = EXIF.getAllTags(this);

            if (allTags.GPSLatitude && allTags.GPSLongitude) {
                try {
                    const latDMS = allTags.GPSLatitude;
                    const latRef = allTags.GPSLatitudeRef;
                    const lonDMS = allTags.GPSLongitude;
                    const lonRef = allTags.GPSLongitudeRef;

                    const latitude = convertDMSToDD(latDMS, latRef);
                    const longitude = convertDMSToDD(lonDMS, lonRef);

                    const geolocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    resolve(geolocation);
                } catch (error) {
                    console.error("Error processing GPS data: ", error);
                    resolve('N/A');
                }
            } else {
                resolve('N/A');
            }
        });
    });
}