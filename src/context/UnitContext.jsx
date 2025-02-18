import { useEffect, useState, createContext, useContext } from "react";

const UnitContext = createContext();

function UnitProvider({ children }) {
	const [unit, setUnit] = useState(() => localStorage.getItem("unit") || "fahrenheit");
	// imperial/metric units for wind speed, rain, etc.

	function changeUnit(unit) {
		setUnit(unit);
	}

	useEffect(() => {
		// whenever the unit changes, update local storage
		localStorage.setItem("unit", unit);
	}, [unit]);

	return <UnitContext.Provider value={{ unit, changeUnit }}>{children}</UnitContext.Provider>;
}

function useUnit() {
	return useContext(UnitContext);
}

export { UnitProvider, useUnit };
