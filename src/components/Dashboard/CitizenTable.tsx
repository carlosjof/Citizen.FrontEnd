import { 
    Button, 
    CircularProgress, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow } from "@mui/material";
    import Swal from "sweetalert2";
    
import useAuthStore from "../../utils/store/authStore";
import { toast } from "react-hot-toast";

interface CitizenTableProps {
    searchResult: any;
    dataCitizen: any[];
    loading: boolean;
    handleEdit: (item: any) => void;
    hasPrevious: boolean;
    handlePreviousPage: () => void;
    hasNext: boolean;
    handleNextPage: () => void;
    setDataCitizen: (data: any[]) => void;
}

export default function CitizenTable({
    searchResult,
    dataCitizen,
    loading,
    handleEdit,
    hasPrevious,
    handlePreviousPage,
    hasNext,
    handleNextPage,
    setDataCitizen
}: CitizenTableProps) {

    const TOKEN = useAuthStore((state) => state.token);
    const URL = import.meta.env.VITE_HOST;

    const handleDelete = async (item: any) => {
        const result = await Swal.fire({
            title: 'Enter CIN',
            input: 'text',
            inputLabel: 'Enter CIN of Citizen',
            inputPlaceholder: 'CIN',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            preConfirm: (cin) => {
                if (!cin) {
                    Swal.showValidationMessage('CIN is required');
                }

                return cin;
            }
        });

        if (result.isConfirmed) {
            const cinToDelete = result.value;
            if (cinToDelete === item.cin) {
                try {
                    const response = await deleteCitizen(cinToDelete);
                    const responseData = await response.json();

                    if (responseData.isSuccess) {
                        const updatedData = dataCitizen.filter((citizen: any) => citizen.cin !== cinToDelete);
                        setDataCitizen(updatedData);

                        Swal.fire('Success', 'Citizen Deleted', 'success')
                        return searchResult.status = false;
                    } else {
                        searchResult.status = false;
                        toast.error("Error trying to delete citizen")
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Error trying to delete citizen")
                }
            } else {
                Swal.fire('Error', 'CIN does not match. Please enter the correct CIN.', 'error');
            }
        }
    };

    const deleteCitizen = async (cinToDelete: string) => {
        return fetch(`${URL}/api/Citizen/${cinToDelete}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
    };
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>CIN</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {searchResult ? (
                        <TableRow key={searchResult.cin}>
                            <TableCell>{searchResult.cin}</TableCell>
                            <TableCell>{searchResult.name}</TableCell>
                            <TableCell>{searchResult.lastName}</TableCell>
                            <TableCell>{searchResult.age}</TableCell>
                            <TableCell>{searchResult.gender}</TableCell>
                            <TableCell>{searchResult.status ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleEdit(searchResult)} variant="outlined" color="primary" style={{ marginRight: '10px' }}>
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(searchResult)} variant="outlined" color="secondary">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ) : (

                        dataCitizen?.map((item: any) => (
                            item.status && (
                                <TableRow key={item.cin}>
                                    <TableCell>{item.cin}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.lastName}</TableCell>
                                    <TableCell>{item.age}</TableCell>
                                    <TableCell>{item.gender}</TableCell>
                                    <TableCell>{item.status ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(item)} variant="outlined" color="primary" style={{ marginRight: '10px' }}>
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(item)} variant="outlined" color="secondary">
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        ))

                    )}
                </TableBody>

                
                {loading && <CircularProgress />}
            </Table>
            <Button onClick={handlePreviousPage} disabled={!hasPrevious}>
                Previous
            </Button>
            <Button onClick={handleNextPage} disabled={!hasNext}>
                Next
            </Button>
        </TableContainer>

        
    );
};