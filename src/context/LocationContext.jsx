import React, { useEffect, useState, createContext, useContext } from "react";

const LocationContext = createContext();

function LocationProvider({ children }) {
	const [latitude, setLatitude] = useState(() => {
		const storedCoordinates = JSON.parse(localStorage.getItem("coordinates"));
		return storedCoordinates ? storedCoordinates.latitude : 0;
	});

	const [longitude, setLongitude] = useState(() => {
		const storedCoordinates = JSON.parse(localStorage.getItem("coordinates"));
		return storedCoordinates ? storedCoordinates.longitude : 0;
	});

	const [cityName, setCityName] = useState(() => {
		const storedCoordinates = JSON.parse(localStorage.getItem("coordinates"));
		return storedCoordinates ? storedCoordinates.cityName : "";
	});

	function setCoordinates(latitude, longitude) {
		setLatitude(latitude);
		setLongitude(longitude);

		if (!latitude && !longitude) {
			setCityName("");
		} else {
			fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
				.then(response => {
					if (!response.ok) {
						throw new Error("Could not fetch city name.");
					}
					return response.json();
				})
				.then(data => {
					//console.log(data);
					const county = data.address.county ? data.address.county : null;
					const city = data.address.city ? data.address.city : null;
					const town = data.address.town ? data.address.town : null;
					const village = data.address.village ? data.address.village : null;
					const hamlet = data.address.hamlet ? data.address.hamlet : null;

					if (city) {
						setCityName(data.address.city);
					} else if (town) {
						setCityName(data.address.town);
					} else if (village) {
						setCityName(data.address.village);
					} else if (hamlet) {
						setCityName(data.address.hamlet);
					} else {
						setCityName(county);
					}
				})
				.catch(error => {
					setCityName("error");
					console.error(error);
				});
		}
	}

	useEffect(() => {
		localStorage.setItem("coordinates", JSON.stringify({ latitude, longitude, cityName }));
	}, [latitude, longitude, cityName]);

	return <LocationContext.Provider value={{ latitude, longitude, cityName, setCoordinates }}>{children}</LocationContext.Provider>;
}

function useLocation() {
	return useContext(LocationContext);
}

export { LocationProvider, useLocation };
