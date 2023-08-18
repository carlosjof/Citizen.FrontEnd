import { Button } from "@mui/material"

import useFetch from "../../utils/hooks/useFetch"
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import CitizenEditModal from "./CitizenEditModal";
import CitizenAddModal from "./CitizenAddModal";
import CitizenTable from "./CitizenTable";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
    const URL = import.meta.env.VITE_HOST;

    const [currentPage, setCurrentPage] = useState(1);
    const { data, hasNext, hasPrevious, error, loading } = useFetch(`${URL}/api/Citizen?page=${currentPage}&pageSize=10`)
    const [dataCitizen, setDataCitizen] = useState<any[]>([]);
    const [searchResult, setSearchResult] = useState<any>(null);
    const [isNewCitizenModalOpen, setIsNewCitizenModalOpen] = useState(false);
    const [newCitizenFields, setNewCitizenFields] = useState({
        cin: '',
        name: '',
        lastName: '',
        age: 0,
        gender: '',
    });
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editedFields, setEditedFields] = useState({
        name: '',
        lastName: '',
        age: 0,
        gender: ''
    });


    useEffect(() => {
        setDataCitizen(data);
    }, [data]);

    console.log(dataCitizen)


    const handleNewCitizenModalOpen = () => {
        setIsNewCitizenModalOpen(true);
    };

    const handleNewCitizenModalClose = () => {
        setIsNewCitizenModalOpen(false);
        setNewCitizenFields({
            cin: '',
            name: '',
            lastName: '',
            age: 0,
            gender: '',
        });
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setEditedFields({
            name: item.name,
            lastName: item.lastName,
            age: item.age,
            gender: item.gender
        });
    };

    const handleEditFieldChange = (fieldName: string, value: any) => {
        setEditedFields(prevFields => ({
            ...prevFields,
            [fieldName]: value
        }));
    };

    const handleShowAll = () => {
        setSearchResult(null);
        setCurrentPage(1)
    };

    const handlePreviousPage = () => {
        if (hasPrevious) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNext) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <h2 style={{ color: "#19647e" }}>Dashboard</h2>

            <div style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center"
            }}>
                <SearchBar
                    onSearchResult={setSearchResult}
                    onShowAll={handleShowAll}
                />

                <Button variant="contained" color="primary" onClick={handleNewCitizenModalOpen}>
                    New Citizen
                </Button>
            </div>

            <CitizenTable
                searchResult={searchResult}
                dataCitizen={dataCitizen}
                loading={loading}
                handleEdit={handleEdit}
                hasPrevious={hasPrevious}
                handlePreviousPage={handlePreviousPage}
                hasNext={hasNext}
                handleNextPage={handleNextPage}
                setDataCitizen={setDataCitizen}
            />

            <CitizenEditModal
                isOpen={editingItem !== null}
                onClose={() => setEditingItem(null)}
                editedFields={editedFields}
                handleEditFieldChange={handleEditFieldChange}
                dataCitizen={dataCitizen}
                editingItem={editingItem}
                setDataCitizen={setDataCitizen}
                searchResult={searchResult}
                setSearchResult={setSearchResult}
            />

            <CitizenAddModal
                isOpen={isNewCitizenModalOpen}
                onClose={handleNewCitizenModalClose}
            />

        </div>
    )
}