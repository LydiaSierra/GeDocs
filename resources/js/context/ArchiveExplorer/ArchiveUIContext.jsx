
import { createContext, useEffect, useState, useCallback } from "react";

export const ArchiveUIContext = createContext();

export function ArchiveUIProvider({ children }) {

  // States for the UI management like the grid view and modal details 
  const [gridView, setGridView] = useState(false);
  const [showDropFolders, setShowDropFolders] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);


  // Load the grid view prefeence from the local store ge on initial rendering

  useEffect(() => {
    const savedView = localStorage.getItem("gridView");
    if (savedView) setGridView(savedView === "true");
  }, []);
  // Toggle between grid and list view and save the preference to local storage
  const toggleGridView = useCallback(() => {
    setGridView((prev) => {
      const newValue = !prev;
      localStorage.setItem("gridView", newValue);
      return newValue;
    });
  }, []);
  // Format file sizes into human-readable strings
  const formatSize = useCallback((size) => {
    if (!size) return "0 KB";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  }, []);
  // Handle the opening and closing of the modal details, setting the selected item accordingly
  const showDetails = (item) => {
    setSelectedItem(item);
    console.log(item);
    
  };

  const toggleDropFolders = useCallback(() => {
    setShowDropFolders(!showDropFolders);
  }, [showDropFolders]);





  // Provide the context values to the children components
  return (
    <ArchiveUIContext.Provider
      value={{
        gridView,
        selectedItem,
        toggleGridView,
        showDetails,
        formatSize,
        setSelectedItem,
        toggleDropFolders, 
        showDropFolders,
      }}
    >
      {children}
    </ArchiveUIContext.Provider>
  );
}

