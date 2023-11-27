"use client";

import React, { useState, createContext, useContext, useEffect } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<string>("light");

  //   const handleChange = () => {
  //     if (mode === "dark") {
  //       setMode("light");
  //       document.documentElement.classList.add("light");
  //     } else {
  //       setMode("dark");
  //       document.documentElement.classList.add("dark");
  //     }
  //   };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  });

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { useTheme };
