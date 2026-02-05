import { createContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { router, usePage } from "@inertiajs/react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [idSelected, setidSelected] = useState(null);
    const [content, setContent] = useState(null);

    // search State

    const [isSearching, setIsSearching] = useState(false);
    const [filteredUser, setFilteredUser] = useState([]);
    const [inputSearch, setInputSearch] = useState("");
    const [filterSelected, setFilterSelected] = useState("");

    const [edit, setEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    //functions
    const fetchUser = useCallback(async () => {
        const res = await api.get("/api/users");
        if (res.data.success === false) {
            console.log("ERRROR AL OBTENER USUARIOS!");
            return;
        }
        setUser(res.data.data);
        setLoading(false);
        return res.data.data;
    }, []);



    const ShowInformation = async (id) => {
        const newArray = user.find((item) => item.id === id);
        setidSelected(newArray);
    };

    const DeleteInfo = async (id) => {
        const res = await api.delete(`/api/users/${id}`);

        if (res.data.success === false) {
            console.log("ERROR AL ELIMINAR USUARIO");
            return;
        }

        await fetchUser();
        setidSelected(null);
    };

    const UpdateInfo = async (
        nombre,
        tipo_documento,
        documento_number,
        email,
        estado,
        id
    ) => {
        try {
            setLoadingEdit(true);
            const res = await api.put(`/api/users/${id}`, {
                type_document: tipo_documento,
                document_number: documento_number.toString(),
                name: nombre,
                email: email,
                status: estado,     
            });

            if (res.data.success === false) {
                console.log("ERROR AL ACTUALIZAR USUARIO");
                return;
            }
            const newList = await fetchUser();
            const updateUser = newList.find((u) => u.id === id);
            setEdit(false);
            setidSelected(updateUser);
            setLoadingEdit(false);
        } catch (error) {
            throw new Error(
                "Error al hacer la peticion" + error.response.data.message
            );
        }
    };

    const searchUser = async (searcher, filter) => {
        if (searcher === "" && isSearching) {
            setFilteredUser([]); // ← no hay resultados
            return;
        }

        if (!searcher || !filter) {
            return;
        }

            setIsSearching(true);
            setLoadingSearch(true);

            const res = await api.get(
                `/api/users/search/filter?${filter}=${searcher}`
            );

            if (res.data.success === false) {
                console.log("ERROR AL FILTRAR");
                return;
            }
            setFilteredUser(res.data.data);
            setLoadingSearch(false);
    };

    const resetSearch = async () => {
        setInputSearch("");
        setIsSearching(false);
        setFilteredUser([]);
        setFilterSelected("");

        await fetchUser();
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                // props
                user,
                content,
                setContent,
                loading,
                ShowInformation,
                idSelected,
                setidSelected,
                edit,
                setEdit,
                isDelete,
                loadingEdit,
                setIsDelete,
                UpdateInfo,
                DeleteInfo,
                inputSearch,
                setInputSearch,
                searchUser,
                setIsSearching,
                isSearching,
                resetSearch,
                filteredUser,
                loadingSearch,
                filterSelected,
                setFilterSelected,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
