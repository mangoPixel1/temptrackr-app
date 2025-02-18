import { useEffect, useState, createContext, useContext } from "react";

const ThemeContext = createContext();

// Custom hook to detect system theme
function useThemeDetector() {
	function getMatchMedia() {
		return window.matchMedia("(prefers-color-scheme: dark)");
	}

	const [isDarkTheme, setIsDarkTheme] = useState(getMatchMedia().matches);

	useEffect(() => {
		const mq = getMatchMedia();
		const mqListener = event => setIsDarkTheme(event.matches);
		mq.addEventListener("change", mqListener);
		return () => mq.removeEventListener("change", mqListener);
	}, []);

	return isDarkTheme;
}

function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
	const [themeOption, setThemeOption] = useState(() => localStorage.getItem("themeOption") || "light");
	const isDarkMode = useThemeDetector(); // Move hook call to top-level

	// Effect to update theme when themeOption is set to "auto"
	useEffect(() => {
		if (themeOption === "auto") {
			setTheme(isDarkMode ? "dark" : "light");
		}
	}, [themeOption, isDarkMode]);

	function changeThemeOption(option) {
		setThemeOption(option);
		if (option !== "auto") {
			setTheme(option);
		}
	}

	useEffect(() => {
		// Update local storage
		localStorage.setItem("theme", theme);
		localStorage.setItem("themeOption", themeOption);

		// Apply theme class
		document.body.classList.toggle("darkBody", theme === "dark");
	}, [theme, themeOption]);

	return <ThemeContext.Provider value={{ theme, themeOption, changeThemeOption }}>{children}</ThemeContext.Provider>;
}

function useTheme() {
	return useContext(ThemeContext);
}

export { ThemeProvider, useTheme };
