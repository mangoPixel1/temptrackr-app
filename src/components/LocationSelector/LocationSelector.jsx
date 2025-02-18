import React, { useState, useEffect } from "react";
import classes from "./LocationSelector.module.css";

// Contexts
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "../../context/LocationContext";

function LocationSelector() {
	const { theme } = useTheme();
	const { setCoordinates } = useLocation();
	const [locationErrorMsg, setLocationErrorMsg] = useState(""); // No error present when string is empty

	function handleGetLocationClick() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				setCoordinates(position.coords.latitude, position.coords.longitude); // set latitude & latitude values in location context
			});
			setLocationErrorMsg(""); // set to empty string to indicate no error present
		} else {
			setLocationErrorMsg("Geolocation not supported by this browser");
		}
	}

	return (
		<div className={classes.locationSelector}>
			<p>Enter location above</p>
			<p>or</p>
			<button className={`${classes.getLocationButton} ${theme === "dark" ? classes.dark : ""}`} onClick={handleGetLocationClick}>
				Get Device Location
			</button>
			{locationErrorMsg && <p>{`${locationErrorMsg}`}</p>}
		</div>
	);
}

export default LocationSelector;
