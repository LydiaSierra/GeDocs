// SelectionActionBar displays a toolbar when items are selected, providing batch actions like delete, download, and toggling multi-selection mode.

import MenuOptions from './MenuOptions';
import { useExplorerData } from '@/Hooks/useExplorer';
import { DeleteButtonOption, DownloadButtonOption } from './OptionsButtons';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SelectionActionBar = () => {
    const { selectedItems, deleteSelection, setIsMultipleSelection, isMultipleSelection, folders, files } = useExplorerData();
    return (
        <div className="bg-primary/10 w-full rounded-full p-2 flex justify-between items-center mb-3">
            <div className='flex items-center gap-3'>
                {/* Close folder selections or a single folder */}
                <button className="inline-block cursor-pointer p-1 transition-colors duration-300 rounded-full hover:bg-base-300" onClick={deleteSelection}>
                    <XMarkIcon className="size-5" />
                </button>

                <span className="inline-block">{selectedItems?.length} {selectedItems?.length > 1 ? "selecionados" : "selecionado"}
                </span>
                {/* Button move to the trash */}
                <div className=' items-center gap-3 hidden md:flex'>
                    <DeleteButtonOption showText={false} />
                    <DownloadButtonOption showText={false} />
                </div>
                {/* Dropdown menu */}
                <MenuOptions />
            </div>

            {(folders.length > 1 || files.length > 1) &&
                <div className='flex items-center gap-2 tooltip tooltip-bottom' data-tip="(Shift + Click)">
                    <input type="checkbox" name="selection" id="selection" checked={isMultipleSelection} className='checkbox' onChange={(e) => {
                        setIsMultipleSelection(e.target.checked);
                    }} />
                    <label htmlFor='selection' className='cursor-pointer'>Seleción multiple</label>
                </div>
            }

        </div>
    )
}

export default SelectionActionBar