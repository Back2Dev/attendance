import React, { useContext } from "react";

import { Button } from "@material-ui/core";

import { MyThemeContext } from "/imports/ui/contexts/theme-context.js";

export default function ThemeSwitcher() {
  const names = ["default", "dark"];

  const { theme, setTheme } = useContext(MyThemeContext);

  const toggleTheme = () => {
    setTheme(theme === "default" ? "dark" : "default");
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={toggleTheme}
    >
      {theme}
    </Button>
  );
}
