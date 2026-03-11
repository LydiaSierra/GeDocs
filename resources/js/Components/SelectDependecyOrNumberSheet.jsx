import { usePage } from '@inertiajs/react';
import React, { useContext } from 'react';
import { Menu, MenuItem, MenuButton, SubMenu, MenuDivider } from '@szhsin/react-menu';
import { MailContext } from '@/context/MailContext/MailContext.jsx';


const SelectDependecyOrNumberSheet = () => {
    const { sheets } = usePage().props;
    const mailContext = useContext(MailContext);

    const handleSelect = (type, id, name) => {
        if (mailContext) {
            mailContext.setActiveScopeFilter({ type, id, name });
        }
    };

    const handleClear = (e) => {
        if (mailContext) {
            e.stopPropagation();
            mailContext.setActiveScopeFilter(null);
        }
    };

    const getButtonText = () => {
        if (mailContext && mailContext.activeScopeFilter) {
            return `Filtrando: ${mailContext.activeScopeFilter.name}`;
        }
        return "Selecciona una ficha y/o dependencia";
    };

    return (
        <div>
            <Menu
                menuButton={
                    <MenuButton className="cursor-pointer p-2 border border-gray-200 rounded-md flex items-center gap-2">
                        {getButtonText()}
                        {mailContext?.activeScopeFilter && (
                            <button
                                onClick={handleClear}
                                className="text-gray-400 hover:text-red-500 rounded-full bg-gray-100 p-0.5 ml-2 leading-none"
                                title="Limpiar filtro"
                            >
                                &times;
                            </button>
                        )}
                    </MenuButton>
                }
                transition
                position="right"
            >
                {sheets.map((sheet) => (
                    sheet.dependencies?.length > 0 ? (
                        <SubMenu
                            key={sheet.id}
                            label={sheet.number}
                            className="p-0"
                            openTrigger="clickOnly"
                        >
                            <MenuItem onClick={() => handleSelect('sheet', sheet.id, `Ficha ${sheet.number}`)}>
                                <span className="font-bold">Todas (Ficha {sheet.number})</span>
                            </MenuItem>
                            <MenuDivider />
                            {sheet.dependencies.map((dependency) => (
                                <MenuItem
                                    key={dependency.id}
                                    onClick={() => handleSelect('dependency', dependency.id, dependency.name)}
                                >
                                    {dependency.name}
                                </MenuItem>
                            ))}
                        </SubMenu>
                    ) : (
                        <MenuItem
                            key={sheet.id}
                            onClick={() => handleSelect('sheet', sheet.id, `Ficha ${sheet.number}`)}
                        >
                            {sheet.number}
                        </MenuItem>
                    )
                ))}
            </Menu>
        </div>
    )
}

export default SelectDependecyOrNumberSheet