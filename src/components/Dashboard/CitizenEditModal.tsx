import {
    Button,
    Modal,
    TextField,
    Select,
    MenuItem,
} from '@mui/material';
import Swal from 'sweetalert2';
import useAuthStore from '../../utils/store/authStore';
import { toast } from 'react-hot-toast';
import { EditedFields } from '../../interfaces/EditedFields';

interface CitizenModalProps {
    isOpen: boolean;
    onClose: () => void;
    editedFields: EditedFields;
    handleEditFieldChange: (fieldName: keyof EditedFields, value: any) => void;
    dataCitizen: any[];
    searchResult: any[];
    editingItem: any;
    setDataCitizen: (data: any[]) => void;
    setSearchResult: (data: any[]) => void;
}

export default function CitizenEditModal({
    isOpen,
    onClose,
    editedFields,
    handleEditFieldChange,
    dataCitizen,
    searchResult,
    editingItem,
    setDataCitizen,
    setSearchResult,
}: CitizenModalProps) {

    const TOKEN = useAuthStore((state) => state.token);
    const URL = import.meta.env.VITE_HOST;

    const GENDERS = ['M', 'F'];

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`${URL}/api/Citizen/${editingItem?.cin}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TOKEN}`
                },
                body: JSON.stringify(editedFields)
            });

            const responseData = await response.json();

            if (response.ok) {
                if (responseData.isSuccess) {
                    Swal.fire('Success', 'Citizen details updated successfully.', 'success');
                    // Update the data in the table
                    const updatedData: any = dataCitizen.map((item: any) => item.cin === editingItem.cin ? responseData.data : item);
                    if(searchResult === null){
                        setDataCitizen(updatedData);
                    }else{
                        setSearchResult(responseData.data);
                    }

                } else {
                    toast.error("An error occurred while updating citizen details.");
                }
            } else if (response.status === 400) {
                // Handle validation errors
                const errorMessages = Object.values(responseData.errors).flat();
                Swal.fire('Error', errorMessages.join('\n'), 'error');
            } else {
                Swal.fire('Error', 'An error occurred while updating citizen details.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred while updating citizen details.', 'error');
        }
        // Close the modal
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '20px 8%',
                    borderRadius: '4px',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingBottom: '10px',
                }}
            >
                <h2>Edit Citizen</h2>
                <TextField
                    label="Name"
                    value={editedFields.name}
                    onChange={(e) => handleEditFieldChange('name', e.target.value)}
                    style={{ marginBottom: '18px' }}
                />
                <TextField
                    label="Last Name"
                    value={editedFields.lastName}
                    onChange={(e) =>
                        handleEditFieldChange('lastName', e.target.value)
                    }
                    style={{ marginBottom: '18px' }}
                />
                <TextField
                    label="Age"
                    value={editedFields.age}
                    onChange={(e) =>
                        handleEditFieldChange('age', parseInt(e.target.value))
                    }
                    style={{ marginBottom: '18px' }}
                />
                <Select
                    label="Gender"
                    value={editedFields.gender}
                    onChange={(e) =>
                        handleEditFieldChange('gender', e.target.value as string)
                    }
                    style={{ marginBottom: '18px' }}
                >
                    {GENDERS.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                            {gender}
                        </MenuItem>
                    ))}
                </Select>
                <div style={{ paddingTop: '2em' }}>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};