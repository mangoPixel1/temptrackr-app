import React, { useState, useEffect } from "react";
import classes from "./Weather.module.css";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Icons
import ClearDay from "../Icons/Current/clear-day.svg?react";
import ClearNight from "../Icons/Current/clear-night.svg?react";
import Cloudy from "../Icons/Current/cloudy.svg?react";
import Drizzle from "../Icons/Current/drizzle.svg?react";
import FogDay from "../Icons/Current/fog-day.svg?react";
import FogNight from "../Icons/Current/fog-night.svg?react";
import Hail from "../Icons/Current/hail.svg?react";
import OvercastDay from "../Icons/Current/overcast-day.svg?react";
import OvercastNight from "../Icons/Current/overcast-night.svg?react";
import PartlyCloudyDay from "../Icons/Current/partly-cloudy-day.svg?react";
import PartlyCloudyNight from "../Icons/Current/partly-cloudy-night.svg?react";
import Rain from "../Icons/Current/rain.svg?react";
import Sleet from "../Icons/Current/sleet.svg?react";
import Snow from "../Icons/Current/snow.svg?react";
import ThunderstormsDay from "../Icons/Current/thunderstorms-day.svg?react";
import ThunderstormsNight from "../Icons/Current/thunderstorms-night.svg?react";
import PrecipChance from "../Icons/PrecipChance.svg?react";
import Humidity from "../Icons/Humidity.svg?react";
import Wind from "../Icons/Wind.svg?react";

// Contexts
import { useTheme } from "../../context/ThemeContext";
import { useUnit } from "../../context/UnitContext";
import { useLocation } from "../../context/LocationContext";

function CurrentWeather() {
	const { theme } = useTheme();
	const { unit } = useUnit();
	const { latitude, longitude, cityName } = useLocation();

	const [currentTemp, setCurrentTemp] = useState(0);
	const [currentMin, setCurrentMin] = useState(0);
	const [currentMax, setCurrentMax] = useState(0);
	const [precipChance, setPrecipChance] = useState(0);
	const [humidity, setHumidity] = useState(0);
	const [wind, setWind] = useState(0);
	const [weatherCode, setWeatherCode] = useState(-1);
	const [apparentTemp, setApparentTemp] = useState(0);
	const [isDay, setIsDay] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=${unit}&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=3&daily=sunrise,sunset`)
			.then(response => {
				if (!response.ok) {
					throw new Error("Error fetching current weather data");
				}
				return response.json();
			})
			.then(data => {
				//console.log(data);

				setIsDay(data.current.is_day);
				setCurrentTemp(Math.floor(data.current.temperature_2m));
				setCurrentMin(Math.floor(data.daily.temperature_2m_min[0]));
				setCurrentMax(Math.floor(data.daily.temperature_2m_max[0]));
				setPrecipChance(Math.floor(data.current.precipitation));
				setHumidity(Math.floor(data.current.relative_humidity_2m));
				setWind(Math.floor(data.current.wind_speed_10m));
				setWeatherCode(data.current.weather_code);
				setApparentTemp(Math.floor(data.current.apparent_temperature));

				setIsLoading(false);
			})
			.catch(error => {
				console.error(error);
				setIsLoading(false);
			});
	}, [latitude, longitude, cityName, unit]);

	const weatherCodeMap = {
		0: "Clear", // Clear
		1: "Mainly Clear", // Clear
		2: "Partly Cloudy", // PartlyCloudDay
		3: "Overcast", // Overcast
		45: "Fog", // Fog
		48: "Fog", // Fog
		51: "Light Drizzle", // Drizzle
		53: "Drizzle", // Drizzle
		55: "Heavy Drizzle", // Drizzle
		61: "Light Rain", // Rain
		63: "Rain", // Rain
		65: "Heavy Rain", // Rain
		66: "Freezing Rain: Light", // FreezingRain
		67: "Freezing Rain: Heavy", // FreezingRain
		71: "Snow Fall: Light", // Snow
		73: "Snow Fall: Moderate", // Snow
		75: "Snow Fall: Heavy", // Snow
		77: "Snow Grains", // Hail
		80: "Showers: Light", // Rain
		81: "Showers: Moderate", // Rain
		82: "Showers: Violent", // Rain
		85: "Snow Showers: Light", // Snow
		86: "Snow Showers: Heavy", // Snow
		95: "Thunderstorm", // Thunderstorm
		96: "Thunderstorm", // Thunderstorm
		99: "Thunderstorm" // Thunderstorm
	};

	function getConditionIcon(weatherCode, time) {
		switch (weatherCode) {
			case 0:
			case 1:
				return isDay ? <ClearDay className={classes.currentIcon} /> : <ClearNight className={classes.currentIcon} />;
				break;
			case 2:
				return isDay ? <PartlyCloudyDay className={classes.currentIcon} /> : <PartlyCloudyNight className={classes.currentIcon} />;
				break;
			case 3:
				return isDay ? <OvercastDay className={classes.currentIcon} /> : <OvercastNight className={classes.currentIcon} />;
				break;
			case 45:
			case 48:
				return isDay ? <FogDay className={classes.currentIcon} /> : <FogNight className={classes.currentIcon} />;
				break;
			case 51:
			case 53:
			case 55:
				return <Drizzle className={classes.currentIcon} />;
				break;
			case 61:
			case 63:
			case 65:
			case 80:
			case 81:
			case 82:
				return <Rain className={classes.currentIcon} />;
				break;
			case 66:
			case 67:
				return <FreezingRain className={classes.currentIcon} />;
				break;
			case 71:
			case 73:
			case 75:
			case 85:
			case 86:
				return <Snow className={classes.currentIcon} />;
				break;
			case 77:
				return <Hail className={classes.currentIcon} />;
				break;
			case 95:
			case 96:
			case 99:
				return isDay ? <ThunderstormsDay className={classes.currentIcon} /> : <ThunderstormsNight className={classes.currentIcon} />;
				break;
		}
	}

	return (
		<SkeletonTheme baseColor={theme === "light" ? "#e8e8e8" : "#4a4a4a"} highlightColor={theme === "light" ? "#f4f4f4" : "#7d7c7c"}>
			<div className={classes.currentWeatherContainer}>
				<div className={classes.currentWeather}>
					<div className={classes.condition}>
						{isLoading ? <Skeleton width={80} height={80} /> : getConditionIcon(weatherCode)}
						{isLoading ? <Skeleton width={80} height={20} /> : weatherCodeMap[weatherCode]}
					</div>
					<div className={classes.temperature}>
						<h2 className={classes.realTemperature}>{isLoading ? <Skeleton width={80} height={40} /> : `${currentTemp} °${unit === "fahrenheit" ? "F" : "C"}`}</h2>
						{isLoading ? (
							<Skeleton width={80} height={20} count={2} />
						) : (
							<div>
								<p className={classes.maxMinTemperature}>
									{currentMax}°/{currentMin}°
								</p>
								<p className={classes.apparentTemperature}>Feels like {apparentTemp} °</p>
							</div>
						)}
					</div>
				</div>
				<div className={classes.weatherMetrics}>
					{isLoading ? (
						<Skeleton width={60} height={20} />
					) : (
						<div className="precipChance">
							<PrecipChance className={`${classes.currentConditionIcon} ${classes.precipChanceIcon}`} />
							<p>{precipChance}%</p>
						</div>
					)}

					{isLoading ? (
						<Skeleton width={60} height={20} />
					) : (
						<div className="humidity">
							<Humidity className={classes.currentConditionIcon} />
							<p>{humidity}%</p>
						</div>
					)}

					{isLoading ? (
						<Skeleton width={60} height={20} />
					) : (
						<div className="windSpeed">
							<Wind className={classes.currentConditionIcon} />
							<p>{wind} mph</p>
						</div>
					)}
				</div>
			</div>
		</SkeletonTheme>
	);
}

export default CurrentWeather;
