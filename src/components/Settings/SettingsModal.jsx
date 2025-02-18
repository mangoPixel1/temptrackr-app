import React, { useEffect, useState } from "react";
import classes from "./SettingsModal.module.css";

// Icons
import CloseButtonLight from "../Icons/CloseButtonLight.svg?react";
import CloseButtonDark from "../Icons/CloseButtonDark.svg?react";

// Contexts
import { useUnit } from "../../context/UnitContext";
import { useTheme } from "../../context/ThemeContext";

function SettingsModal({ toggle }) {
	const { unit, changeUnit } = useUnit();
	const { theme, themeOption, changeTheme, changeThemeOption } = useTheme();

	return (
		<>
			<div className={classes.buttonRow}>
				<button onClick={toggle} className={`${theme === "dark" ? classes.dark : ""}`}>
					{theme === "light" ? <CloseButtonLight className={classes.closeModalIcon} /> : <CloseButtonDark className={classes.closeModalIcon} />}
				</button>
			</div>
			<div className={`${classes.settingsContainer} ${theme === "dark" ? classes.dark : ""} `}>
				<div className={classes.settingsWrapper}>
					<div className={classes.settingsHeader}>
						<h3>Settings</h3>
					</div>
					<h5>🌡 Unit</h5>
					<div className={classes.settingsOptions}>
						<input type="radio" name="unit" id="fahrenheit" value="fahrenheit" checked={unit === "fahrenheit"} onChange={e => changeUnit(e.target.value)} /> <label htmlFor="fahrenheit">Fahrenheit</label>
						<input type="radio" name="unit" id="celsius" value="celsius" checked={unit === "celsius"} onChange={e => changeUnit(e.target.value)} /> <label htmlFor="celsius">Celsius</label>
					</div>
					<h5>💡 Theme</h5>
					<div className={classes.settingsOptions}>
						<input type="radio" name="theme" id="auto" value="auto" checked={themeOption === "auto"} onChange={e => changeThemeOption(e.target.value)} /> <label htmlFor="auto">System</label>
						<input type="radio" name="theme" id="light" value="light" checked={themeOption === "light"} onChange={e => changeThemeOption(e.target.value)} /> <label htmlFor="light">Light</label>
						<input type="radio" name="theme" id="dark" value="dark" checked={themeOption === "dark"} onChange={e => changeThemeOption(e.target.value)} /> <label htmlFor="dark">Dark</label>
					</div>
				</div>
			</div>
		</>
	);
}
// USE RADIO BUTTONS
export default SettingsModal;
