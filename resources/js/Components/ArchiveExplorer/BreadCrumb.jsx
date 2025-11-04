
import { ArchiveDataContext } from "@/context/ArchiveDataContext";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import {router} from "@inertiajs/react";

export const BreadCrumb = () => {
  const {
    stack,
    navigateToFolder,
    navigateBack,
    handleSearch,
    searchTerm,
  } = useContext(ArchiveDataContext);

  return (
    <div className="flex mt-7 mb-2 ml-3 gap-1 items-center">
      {/* Home button */}
      <button
        className="text-gray-600 font-bold cursor-pointer px-3 py-2 rounded-md hover:text-gray-400"
        onClick={() => {
          router.get('explorer');
          navigateToFolder(null, "")
        }}
      >
        Home
      </button>

      {/* Navigation  */}
      {stack.map((item, idx) => (
        <span key={item.id ?? idx} className="flex items-center">
          <ChevronRightIcon className="size-5 text-gray-500" />
          <button
            className="text-gray-600 font-semibold cursor-pointer px-3 py-2 rounded-md hover:text-gray-400"
            onClick={() => navigateToFolder(item.id, item.name)}
          >
            {item.name?.length > 15 ? `${item.name.slice(0, 15)}...` : item.name}
          </button>
        </span>
      ))}

      {/* Show the info if there is an active search */}
      {searchTerm && (
        <span className="flex items-center">
          <ChevronRightIcon className="size-5 text-gray-400" />
          <span className="text-lg text-senaDarkGreen font-semibold px-3 py-2 rounded-md">
            Resultados: “{searchTerm}”
          </span>
        </span>
      )}

      {/* Backwards button  */}
      <div className="ml-auto flex gap-2">
        {stack.length > 0 && (
          <button
            onClick={navigateBack}
            className="text-sm text-gray-600 px-3 py-2 rounded-md hover:text-gray-400"
          >
            Atrás
          </button>
        )}
      </div>
    </div>
  );
};
