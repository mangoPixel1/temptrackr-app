import React, { useRef, useState, useContext, useEffect } from "react";
import classes from "./Header.module.css";

// Icons
import SettingsIcon from "../Icons/Settings.svg?react";
import GetLocationIcon from "../Icons/GetLocation.svg?react";

// Components
import SettingsModal from "../Settings/SettingsModal";

// Contexts
import { useTheme } from "../../context/ThemeContext";
import { useUnit } from "../../context/UnitContext";
import { useLocation } from "../../context/LocationContext";

function Header() {
	// Context
	const { theme, toggleTheme } = useTheme();
	const { unit, changeUnit } = useUnit();
	const { setCoordinates } = useLocation();

	// State variables
	const [searchValue, setSearchValue] = useState(""); // current input text value in search bar
	const [searchSuggestions, setSearchSuggestions] = useState([]); // API location search results
	const [selectedSearchResult, setSelectedSearchResult] = useState(null); // selected search result
	const [locationErrorMsg, setLocationErrorMsg] = useState(""); // No error present when string is empty

	const dialogRef = useRef(null);

	function toggleDialog() {
		if (!dialogRef.current) {
			return;
		}

		dialogRef.current.hasAttribute("open") ? dialogRef.current.close() : dialogRef.current.showModal();
	}

	function handleSearchInputChange(e) {
		setSearchValue(e.target.value);
		handleLocationSearch();
	}

	function handleLocationSearch() {
		if (searchValue) {
			fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchValue}&count=5&language=en&format=json`)
				.then(response => {
					if (!response.ok) {
						throw new Error("Error with search. Try another query.");
					}
					return response.json();
				})
				.then(data => {
					//console.log(data.results);
					setSearchSuggestions(data.results);
				})
				.catch(error => console.error(error));
		}
	}

	function handleResultSelection(suggestion) {
		setSelectedSearchResult(suggestion); // set to object from search result
		setSearchValue(""); // reset search value to clear input field
		setSearchSuggestions([]); // reset suggestions to hide results dropdown

		// Set location to new coordinates from selected result
		setCoordinates(suggestion.latitude, suggestion.longitude);

		console.log(suggestion.latitude, suggestion.longitude);
	}

	function handleGetLocationClick() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				//console.log(position.coords.latitude, position.coords.longitude);
				setCoordinates(position.coords.latitude, position.coords.longitude); // set latitude & latitude values in location context
			});
			setLocationErrorMsg(""); // set to empty string to indicate no error present
		} else {
			setLocationErrorMsg("Geolocation not supported by this browser");
		}
	}

	return (
		<>
			<header className={`${classes.headerStyle} ${theme === "dark" ? classes.dark : ""}`}>
				<button className={`${classes.getLocButton} ${theme === "dark" ? classes.dark : ""}`} onClick={handleGetLocationClick}>
					<GetLocationIcon className={classes.getLocIcon} />
				</button>
				<div className={classes.searchWrapper}>
					<input className={classes.searchInput} type="text" placeholder="Search City Name" id="location-search-input" value={searchValue} onChange={handleSearchInputChange} />
					<button className={classes.searchButton} onClick={handleLocationSearch}>
						Search
					</button>
					{searchSuggestions && (
						<ul className={classes.searchSuggestionsList}>
							{searchSuggestions.map(suggestion => {
								return <li key={suggestion.id} onClick={() => handleResultSelection(suggestion)}>{`${suggestion.name ? `${suggestion.name},` : ""} ${suggestion.admin2 ? `${suggestion.admin2},` : ""} ${suggestion.admin1 ? `${suggestion.admin1},` : ""} ${suggestion.country ? `${suggestion.country}` : ""}`}</li>;
							})}
						</ul>
					)}
				</div>

				<div className={classes.settingsButton}>
					<button onClick={toggleDialog}>
						<SettingsIcon className={classes.settingsIcon} />
					</button>
				</div>
			</header>
			<dialog
				ref={dialogRef}
				onClick={e => {
					if (e.currentTarget === e.target) {
						toggleDialog();
					}
				}}
				className={`${classes.settingsDialog} ${theme == "dark" ? classes.dark : ""}`}
			>
				<SettingsModal toggle={toggleDialog} />
			</dialog>
		</>
	);
}

export default Header;

// <SettingsModal isOpen={modalOpen} onClose={handleClose} />
