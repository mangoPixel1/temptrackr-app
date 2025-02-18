import React, { useState, useEffect } from "react";
import classes from "./Weather.module.css";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Icons
import ClearDayStatic from "../Icons/Hourly/clear-day-static.svg?react";
import ClearNightStatic from "../Icons/Hourly/clear-night-static.svg?react";
import CloudyDayStatic from "../Icons/Hourly/cloudy-day-static.svg?react";
import DrizzleStatic from "../Icons/Hourly/drizzle-static.svg?react";
import FogDayStatic from "../Icons/Hourly/fog-day-static.svg?react";
import FogNightStatic from "../Icons/Hourly/fog-night-static.svg?react";
import HailStatic from "../Icons/Hourly/hail-static.svg?react";
import OvercastDayStatic from "../Icons/Hourly/overcast-day-static.svg?react";
import OvercastNightStatic from "../Icons/Hourly/overcast-night-static.svg?react";
import PartlyCloudyDayStatic from "../Icons/Hourly/partly-cloudy-day-static.svg?react";
import PartlyCloudyNightStatic from "../Icons/Hourly/partly-cloudy-night-static.svg?react";
import RainStatic from "../Icons/Hourly/rain-static.svg?react";
import SleetStatic from "../Icons/Hourly/sleet-static.svg?react";
import SnowStatic from "../Icons/Hourly/snow-static.svg?react";
import ThunderstormsDayStatic from "../Icons/Hourly/thunderstorms-day-static.svg?react";
import ThunderstormsNightStatic from "../Icons/Hourly/thunderstorms-night-static.svg?react";
import SunriseStatic from "../Icons/Hourly/sunset-static.svg?react";
import SunsetStatic from "../Icons/Hourly/sunrise-static.svg?react";

// Contexts
import { useTheme } from "../../context/ThemeContext";
import { useUnit } from "../../context/UnitContext";
import { useLocation } from "../../context/LocationContext";

function HourlyWeather() {
	const { theme } = useTheme();
	const { unit } = useUnit();
	const { latitude, longitude, cityName, setCoordinates } = useLocation();

	const [isLoading, setIsLoading] = useState(true);

	const [dailyData, setDailyData] = useState([]); // Fetched API data: sunrise/sunset times for yesterday, today, today + 2
	const [hourlyData, setHourlyData] = useState({}); // Fetched API data: hourly temp/weather codes for yesterday, today, today + 2

	const [sunriseTime, setSunriseTime] = useState(""); // Next sunrise time
	const [sunsetTime, setSunsetTime] = useState(""); // Next sunset time

	const [hours, setHours] = useState([]); // Final times to be rendered in UI
	const [finalTemps, setFinalTemps] = useState([]); // Final temps to be rendered in UI
	const [finalWeather, setFinalWeather] = useState([]); // Final weather conditions to be rendered in UI

	// Gets condition icon based on the weather code and time
	function getConditionIcon(weatherCode, time) {
		const currentTime = new Date(time);

		const nextSunriseTime = new Date(sunriseTime);
		const nextSunsetTime = new Date(sunsetTime);

		let isDay;

		// Check if both sunrise/sunset are on the same calendar day
		if (nextSunriseTime.getDay() === nextSunsetTime.getDay()) {
			isDay = currentTime >= nextSunriseTime && currentTime <= nextSunsetTime;
		} else {
			isDay = currentTime <= nextSunsetTime || currentTime >= nextSunriseTime;
		}

		switch (weatherCode) {
			case 0:
			case 1:
				return isDay ? <ClearDayStatic className={classes.hourlyIcon} /> : <ClearNightStatic className={classes.hourlyIcon} />;
				break;
			case 2:
				return isDay ? <PartlyCloudyDayStatic className={classes.hourlyIcon} /> : <PartlyCloudyNightStatic className={classes.hourlyIcon} />;
				break;
			case 3:
				return isDay ? <OvercastDayStatic className={classes.hourlyIcon} /> : <OvercastNightStatic className={classes.hourlyIcon} />;
				break;
			case 45:
			case 48:
				return isDay ? <FogDayStatic className={classes.hourlyIcon} /> : <FogNightStatic className={classes.hourlyIcon} />;
				break;
			case 51:
			case 53:
			case 55:
				return <DrizzleStatic className={classes.hourlyIcon} />;
				break;
			case 61:
			case 63:
			case 65:
			case 80:
			case 81:
			case 82:
				return <RainStatic className={classes.hourlyIcon} />;
				break;
			case 66:
			case 67:
				return <FreezingRainStatic className={classes.hourlyIcon} />;
				break;
			case 71:
			case 73:
			case 75:
			case 85:
			case 86:
				return <SnowStatic className={classes.hourlyIcon} />;
				break;
			case 77:
				return <HailStatic className={classes.hourlyIcon} />;
				break;
			case 95:
			case 96:
			case 99:
				return isDay ? <ThunderstormsDayStatic className={classes.hourlyIcon} /> : <ThunderstormsNightStatic className={classes.hourlyIcon} />;
				break;
			case 100:
				return <SunriseStatic className={classes.hourlyIcon} />;
				break;
			case 101:
				return <SunsetStatic className={classes.hourlyIcon} />;
				break;
		}
	}

	// Fetches API data
	useEffect(() => {
		setIsLoading(true);
		fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&temperature_unit=${unit}&wind_speed_unit=mph&precipitation_unit=inch&past_days=1&timezone=auto&forecast_days=3&daily=sunrise,sunset`)
			.then(response => {
				if (!response.ok) {
					throw new Error("Error fetching hourly weather data");
				}
				return response.json();
			})
			.then(data => {
				//console.log(data);
				setDailyData(data.daily);
				setHourlyData(data.hourly);

				setIsLoading(false);
			})
			.catch(error => console.error(error));
	}, [latitude, longitude, cityName, unit]);

	useEffect(() => {
		const currentDate = new Date(); // get the current date and time
		const currentDay = currentDate.getDay(); // gets current day of the week 0-6

		// Get next sunset/sunrise times
		if (dailyData.sunrise && dailyData.sunset) {
			for (let i = 0; i < dailyData.sunrise.length; i++) {
				const dayIter = new Date(dailyData.sunrise[i]);
				if (dayIter.getDay() === currentDay) {
					// Set next sunrise/sunset to either today's sunrise/sunset time or tomorrow's
					const currentSunrise = new Date(dailyData.sunrise[i]);
					const currentSunset = new Date(dailyData.sunset[i]);

					const nextSunrise = currentDate < currentSunrise ? dailyData.sunrise[i] : dailyData.sunrise[i + 1];
					const nextSunset = currentDate < currentSunset ? dailyData.sunset[i] : dailyData.sunset[i + 1];

					setSunriseTime(nextSunrise);
					setSunsetTime(nextSunset);
				}
			}
		}

		// Calculate the time 24 hours from now
		const latestDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

		// Filter times, temperatures, weatherCodes arrays to be in the range of current time to 24 hours later
		if (hourlyData.time && hourlyData.temperature_2m && hourlyData.weather_code) {
			let newTimeArr = [];
			let newTempArr = [];
			let newWeatherArr = [];

			// Sync the indices of the three arrays to be within the specified range
			for (let i = 0; i < hourlyData.time.length; i++) {
				const time = new Date(hourlyData.time[i]);
				if (time >= currentDate && time <= latestDate) {
					newTimeArr.push(hourlyData.time[i]);
					newTempArr.push(hourlyData.temperature_2m[i]);
					newWeatherArr.push(hourlyData.weather_code[i]);
				}
			}

			// Call formatHours with the new arrays
			formatHours(newTimeArr, newTempArr, newWeatherArr);
		}
	}, [hourlyData, dailyData, unit]);

	// Formats time (5 PM)
	function formatTimeHour(timeString) {
		const time = new Date(timeString); // Create a Date object from the string
		const meridiem = time.getHours() < 12 ? "AM" : "PM"; // Get AM or PM

		let hour = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12; // Replace 0 with 12

		return `${hour} ${meridiem}`;
	}

	// Formats time (5:00 PM) used for displaying sunrise/sunset times
	function formatTimeHourMinutes(timeString) {
		const time = new Date(timeString); // Create a Date object from the string
		const meridiem = time.getHours() < 12 ? "AM" : "PM"; // Get AM or PM

		let hour = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12; // Replace 0 with 12

		return `${hour}:${time.getMinutes().toString().padStart(2, "0")} ${meridiem}`;
	}

	// Format final hourly data to render in UI
	function formatHours(newTimes, newTemps, newWeather) {
		// newTimes - length 24
		// formattedTimes - length 26 (includes sunrise & sunset)
		let formattedTimes = [...newTimes];
		let formattedTemps = [...newTemps];
		let formattedWeather = [...newWeather];

		let sunriseIndex; // Index at hour of sunrise
		let sunsetIndex; // Index at hour of sunset

		const nextSunriseTime = new Date(sunriseTime); // Temporary Date object for sunrise
		const nextSunsetTime = new Date(sunsetTime); // Temporary Date object for sunset

		// Find index to insert sunrise and sunset times into newTimes
		for (let i = 0; i < newTimes.length; i++) {
			const currentTime = new Date(newTimes[i]);

			if (currentTime.getHours() === nextSunriseTime.getHours()) {
				sunriseIndex = i;
			} else if (currentTime.getHours() === nextSunsetTime.getHours()) {
				sunsetIndex = i;
			}
		}

		if (sunsetIndex > sunriseIndex) {
			// Sunrise comes first
			formattedTimes.splice(sunriseIndex + 1, 0, sunriseTime); // Insert sunrise time into arrays
			formattedTemps.splice(sunriseIndex + 1, 0, 200);
			formattedWeather.splice(sunriseIndex + 1, 0, 100);

			formattedTimes.splice(sunsetIndex + 2, 0, sunsetTime); // Insert sunset time into arrays
			formattedTemps.splice(sunsetIndex + 2, 0, 200);
			formattedWeather.splice(sunsetIndex + 2, 0, 101);
		} else {
			// Sunset comes first
			formattedTimes.splice(sunsetIndex + 1, 0, sunsetTime); // Insert sunset time into arrays
			formattedTemps.splice(sunsetIndex + 1, 0, 200);
			formattedWeather.splice(sunsetIndex + 1, 0, 101);

			formattedTimes.splice(sunriseIndex + 2, 0, sunriseTime); // Insert sunrise time into arrays
			formattedTemps.splice(sunriseIndex + 2, 0, 200);
			formattedWeather.splice(sunriseIndex + 2, 0, 100);
		}

		setHours(formattedTimes);
		setFinalTemps(formattedTemps);
		setFinalWeather(formattedWeather);
	}

	return (
		<SkeletonTheme baseColor={theme === "light" ? "#e8e8e8" : "#4a4a4a"} highlightColor={theme === "light" ? "#f4f4f4" : "#7d7c7c"}>
			<div className={classes.hourlyWeatherContainer}>
				{isLoading ? (
					<Skeleton width={400} height={80} />
				) : (
					<ul className={classes.hourlyForecast}>
						{hours &&
							hours.map((hour, index, hours) => {
								const currentHour = new Date(hour);
								const pastHour = new Date(hours[index - 1]);

								if (currentHour.getHours() === pastHour.getHours()) {
									// Render sunrise/sunset
									return (
										<li key={index}>
											<div>{`${formatTimeHourMinutes(hour)}`}</div>
											{getConditionIcon(finalWeather[index], hour)}
											<div>{finalWeather[index] === 100 ? "Sunrise" : "Sunset"}</div>
										</li>
									);
								} else {
									// Render hourly weather
									return (
										<li key={index}>
											<div>{`${formatTimeHour(hour)}`}</div>
											{getConditionIcon(finalWeather[index], hour)}
											<div>{`${Math.round(finalTemps[index])}°`}</div>
										</li>
									);
								}
							})}
					</ul>
				)}
			</div>
		</SkeletonTheme>
	);
}

export default HourlyWeather;
