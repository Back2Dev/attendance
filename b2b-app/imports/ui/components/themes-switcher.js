import React, { useContext } from "react";

import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { MyThemeContext } from "/imports/ui/contexts/theme-context.js";

export default function ThemeSwitcher() {
  const names = ["default", "dark"];

  const { theme, setTheme } = useContext(MyThemeContext);

  const toggleTheme = () => {
    setTheme(theme === "default" ? "dark" : "default");
  };

  const isDark = theme === "dark";

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton color="inherit" size="large" onClick={toggleTheme} aria-label="toggle theme">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
