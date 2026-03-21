import { usePage } from '@inertiajs/react';
import React, { useContext, useEffect, useMemo } from 'react';
import { Menu, MenuItem, MenuButton, SubMenu, MenuDivider } from '@szhsin/react-menu';
import { MailContext } from '@/context/MailContext/MailContext.jsx';


const SelectDependecyOrNumberSheet = ({
    activeScopeFilter = null,
    setActiveScopeFilter = null,
    showOnRoutes = ['inbox', 'archive', 'outbox'],
}) => {
    const { sheets = [], auth } = usePage().props;
    const mailContext = useContext(MailContext);
    const user = auth?.user;
    const role = user?.roles?.[0]?.name;
    const isArchiveRoute = route().current() === 'archive';

    const currentScopeFilter = activeScopeFilter ?? mailContext?.activeScopeFilter ?? null;
    const setScopeFilter = setActiveScopeFilter ?? mailContext?.setActiveScopeFilter ?? null;

    const scopedSheets = useMemo(() => {
        if (role !== 'Aprendiz' || !isArchiveRoute) return sheets;

        const dependencyId = user?.dependency_id;
        if (!dependencyId) return [];

        return sheets
            .map((sheet) => ({
                ...sheet,
                dependencies: (sheet.dependencies || []).filter((dep) => dep.id === dependencyId),
            }))
            .filter((sheet) => sheet.dependencies.length > 0);
    }, [role, sheets, user?.dependency_id, isArchiveRoute]);

    const availableDependencies = useMemo(() => {
        const deps = [];
        scopedSheets.forEach((sheet) => {
            (sheet.dependencies || []).forEach((dependency) => {
                deps.push({
                    ...dependency,
                    sheetNumber: sheet.number,
                });
            });
        });
        return deps;
    }, [scopedSheets]);

    useEffect(() => {
        if (role !== 'Aprendiz' || !isArchiveRoute || !setScopeFilter) return;

        const apprenticeDependency = availableDependencies[0];
        if (!apprenticeDependency) {
            setScopeFilter(null);
            return;
        }

        const mustResetFilter =
            !currentScopeFilter ||
            currentScopeFilter.type !== 'dependency' ||
            currentScopeFilter.id !== apprenticeDependency.id;

        if (mustResetFilter) {
            setScopeFilter({
                type: 'dependency',
                id: apprenticeDependency.id,
                name: apprenticeDependency.name,
            });
        }
    }, [role, availableDependencies, setScopeFilter, currentScopeFilter, isArchiveRoute]);

    const showSheetSelection = role !== 'Aprendiz' || !isArchiveRoute;

    const handleSelect = (type, id, name) => {
        if (setScopeFilter) {
            setScopeFilter({ type, id, name });
        }
    };

    const handleClear = (e) => {
        if (setScopeFilter) {
            e.stopPropagation();
            setScopeFilter(null);
        }
    };

    const getButtonText = () => {
        if (currentScopeFilter) {
            return `${currentScopeFilter.name}`;
        }
        return showSheetSelection ? "Ficha y/o dependencia" : "Dependencia";
    };

    if (!showOnRoutes.includes(route().current())) {
        return null;
    }

    if (!scopedSheets.length) {
        return null;
    }

    return (
        <Menu
            menuButton={
                <MenuButton className="cursor-pointer w-max p-2 border border-gray-200 rounded-md flex items-center gap-2 text-md font-medium">
                    {getButtonText()}
                    {showSheetSelection && currentScopeFilter && (
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
            {showSheetSelection ? (
                scopedSheets.map((sheet) => (
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
                ))
            ) : (
                availableDependencies.map((dependency) => (
                    <MenuItem
                        key={dependency.id}
                        onClick={() => handleSelect('dependency', dependency.id, dependency.name)}
                    >
                        {dependency.name}
                    </MenuItem>
                ))
            )}
        </Menu>
    )
}

export default SelectDependecyOrNumberSheet;
