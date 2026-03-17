import { createContext, useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios.js";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";

export const MailContext = createContext(null);

export function MailProvider({ children }) {
    const { auth } = usePage().props;
    const [mailCards, setMailCards] = useState([]);
    const [selectedMail, setSelectedMail] = useState("");
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeScopeFilter, setActiveScopeFilter] = useState(null);

    const loadMailCards = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/pqrs");
            setMailCards(res.data.data);
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err.message ||
                "Error al hacer la peticion"
            );
            throw new Error("Error al hacer la peticion");
        } finally {
            setLoading(false);
        }
    };

    const toggleFilter = (type) => {
        setFilters((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
    };

    const filteredMailCards = mailCards.filter((card) => {
        const matchesFilter =
            filters.length === 0 || filters.includes(card.request_type);
        const matchesSearch =
            searchTerm === "" ||
            card.affair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.id?.toString().includes(searchTerm);

        let matchesScope = true;
        if (activeScopeFilter) {
            if (activeScopeFilter.type === 'sheet') {
                matchesScope = card.sheet_number_id === activeScopeFilter.id;
            } else if (activeScopeFilter.type === 'dependency') {
                matchesScope = card.dependency_id === activeScopeFilter.id;
            }
        }

        return matchesFilter && matchesSearch && matchesScope;
    });

    useEffect(() => {
        if (auth?.user?.id) {
            loadMailCards();
        }
    }, [auth?.user?.id]);

    return (
        <MailContext.Provider
            value={{
                mailCards,
                filteredMailCards,
                setMailCards,
                selectedMail,
                setSelectedMail,
                loading,
                filters,
                toggleFilter,
                searchTerm,
                setSearchTerm,
                activeScopeFilter,
                setActiveScopeFilter,
                reloadMailCards: loadMailCards,
            }}
        >
            {children}
        </MailContext.Provider>
    );
}
