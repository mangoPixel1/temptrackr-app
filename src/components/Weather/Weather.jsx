import React, { useState, useEffect } from "react";
import classes from "./Weather.module.css";

// Contexts
import { useTheme } from "../../context/ThemeContext";
import { useUnit } from "../../context/UnitContext";
import { useLocation } from "../../context/LocationContext";

// Components
import CurrentWeather from "./CurrentWeather";
import HourlyWeather from "./HourlyWeather";
import DailyWeather from "./DailyWeather";

function Weather() {
	const { unit } = useUnit();
	const { latitude, longitude, cityName } = useLocation();

	return (
		<>
			<div className="main">
				<h2 className="cityName">{cityName}</h2>
				<CurrentWeather />
				<HourlyWeather />
				<DailyWeather />
			</div>
		</>
	);
}

export default Weather;
