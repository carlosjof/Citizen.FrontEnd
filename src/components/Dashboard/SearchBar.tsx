import { Button, TextField } from "@mui/material";
import { useState } from "react";
import useAuthStore from "../../utils/store/authStore";
import { toast } from "react-hot-toast";


interface SearchProps {
    onSearchResult: any
    onShowAll: () => void;
}

export default function SearchBar({ onSearchResult, onShowAll }: SearchProps) {

    const TOKEN = useAuthStore((state) => state.token);
    const URL = import.meta.env.VITE_HOST;

    const [searchCIN, setSearchCIN] = useState('');

    const handleSearch = async (searchCIN: string) => {
        try {
            const response = await fetch(`${URL}/api/Citizen/${searchCIN}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TOKEN}`
                }
            });

            const responseData = await response.json();
 
            if (response.ok) {
                if(!responseData.data.status){ // Validating that the CIN does not exist
                    toast.error("No content")
                    return onSearchResult(null)
                }
                onSearchResult(responseData.data);
            } else if (response.status === 400) {
                if(responseData.errors !== null){
                    const errorMessages = responseData.errors[""][0]; // Get error message
                    toast.error(errorMessages)
                }else{
                    toast.error(responseData.error)
                }
                onSearchResult(null);
            } else {
                toast.error('An error occurred while searching for the citizen.')
            }
        } catch (error: any) {
            toast.error('An error occurred while searching for the citizen.')
        }
    };

    const handleShowAll = () => {
        setSearchCIN('');
        onShowAll();
    };

    return (
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '10px' }}>
            <TextField
                label="Search CIN"
                value={searchCIN}
                onChange={(e) => setSearchCIN(e.target.value)}
                style={{ marginRight: '10px', width: '200px' }}
            />
            <Button onClick={() => handleSearch(searchCIN)} variant="contained" color="primary">
                Search
            </Button>
            <Button onClick={handleShowAll} variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
                Clear
            </Button>
        </div>
    )
}