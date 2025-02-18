import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";

// Components
import Header from "./components/Header/Header";
import LocationSelector from "./components/LocationSelector/LocationSelector";
import Weather from "./components/Weather/Weather";
import SettingsModal from "./components/Settings/SettingsModal";

// Contexts
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { UnitProvider, useUnit } from "./context/UnitContext";
import { LocationProvider, useLocation } from "./context/LocationContext";

function App() {
	return (
		<>
			<ThemeProvider>
				<LocationProvider>
					<UnitProvider>
						<Header />
						<MainComponent />
					</UnitProvider>
				</LocationProvider>
			</ThemeProvider>
		</>
	);
}

export default App;

function MainComponent() {
	const { theme } = useTheme();
	const { unit } = useUnit();
	const { latitude, longitude, cityName, setCoordinates } = useLocation();

	function handleLocationReset() {
		setCoordinates(0, 0); // maybe also reset the city name?
	}

	return (
		<div className="mainComponent">
			<div className="mainTitle">
				{latitude && longitude && cityName ? (
					<>
						<Weather />
						<button className={`resetLocationButton ${theme === "dark" ? "dark" : ""}`} onClick={handleLocationReset}>
							Reset Location
						</button>
					</>
				) : (
					<>
						<h1>TempTrackr</h1>
						<h3>Just another weather app</h3>
						<LocationSelector />
					</>
				)}
			</div>
		</div>
	);
}
