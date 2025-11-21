
import { createContext, useEffect, useState, useCallback } from "react";

export const ArchiveUIContext = createContext();

export function ArchiveUIProvider({ children }) {

  // States for the UI management like the grid view and modal details 
  const [gridView, setGridView] = useState(false);
  const [showDropFolders, setShowDropFolders] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputNameFolder, setinputNameFolder] = useState("Caperta sin titulo");

  const [onContextMenu, setOnContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });

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
  const handleModalDetails = (type, item) => {
    setSelectedItem(item ? { type: type.toLowerCase(), data: item } : null);
    setShowModal(!showModal);
  };


  const handleModalFolder = (idModal) => {
    const modal = document.getElementById(idModal);
    if (modal) {
      if (modal.open) {
        modal.close();
        setinputNameFolder("Caperta sin titulo");
      } else {
        modal.showModal();
      }
    }
  };


  const toggleDropFolders = useCallback(() => {
    setShowDropFolders((prev) => {
      const newValue = !prev;
      localStorage.setItem("ShowdropFolders", newValue);
      return newValue;
    })
  })




  // Provide the context values to the children components
  return (
    <ArchiveUIContext.Provider
      value={{
        gridView,
        showModal,
        selectedItem,
        toggleGridView,
        handleModalDetails,
        formatSize,
        onContextMenu,
        setOnContextMenu,
        handleModalFolder,
        inputNameFolder,
        setinputNameFolder,
        toggleDropFolders, 
        showDropFolders,
      }}
    >
      {children}
    </ArchiveUIContext.Provider>
  );
}

