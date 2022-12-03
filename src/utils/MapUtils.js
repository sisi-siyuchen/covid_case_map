export const MapUtils = {
    // based on county level raw data to calculate states and nations levels
    convertCovidPoints: function(countyLevelPoints) {
        if (!countyLevelPoints) { // sanity check
            return {};
        }

        let result = {
            'county': countyLevelPoints,
            'state': {},
            'nation': {}
        };

        let stateData = {};
        // calculate state data
        for (const point of countyLevelPoints) {
            // sanity check
            if (Number.isNaN(point.stats.confirmed) || Number.isNaN(point.stats.deaths)) {
                console.error('Got dirty data', point);
                continue;
            }
            // Initialize the new province
            if (!stateData[point.province]) {
                stateData[point.province] = {
                    confirmed: 0,
                    deaths: 0,
                };
            }

            // aggregate
            stateData[point.province].confirmed += point.stats.confirmed;
            stateData[point.province].deaths += point.stats.deaths;

            // initialize coordinates and country
            if (!stateData[point.province].coordinates) {
                stateData[point.province].coordinates = point.coordinates;
            }
            if (!stateData[point.province].country) {
                stateData[point.province].country = point.country;
            }
        }
        result['state'] = stateData;

        
        let nationData = {};
        // calculate data at national level
        for (const point of countyLevelPoints) {
            // sanity check
            if (Number.isNaN(point.stats.confirmed) || Number.isNaN(point.stats.deaths)) {
                console.error('Got dirty data', point);
                continue;
            }
            // Initialize the new nation
            if (!nationData[point.country]) {
                nationData[point.country] = {
                    confirmed: 0,
                    deaths: 0,
                };
            }

            // aggregate
            nationData[point.country].confirmed += point.stats.confirmed;
            nationData[point.country].deaths += point.stats.deaths;

            // initialize coordinates
            if (!nationData[point.country].coordinates) {
                nationData[point.country].coordinates = point.coordinates;
            }
        }
        result['nation'] = nationData;
        return result;
    },

    isInBoundary: function (bounds, coordinates) {
        return coordinates && bounds && bounds.nw && bounds.se && ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
            && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
    }
};