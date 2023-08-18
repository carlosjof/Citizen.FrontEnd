import { useState } from 'react';
import {
    Button,
    Modal,
    TextField,
    Select,
    MenuItem,
} from '@mui/material';
import Swal from 'sweetalert2';
import useAuthStore from '../../utils/store/authStore';

interface NewCitizenFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewCitizenForm({
    isOpen,
    onClose,
}: NewCitizenFormProps) {
    const TOKEN = useAuthStore((state) => state.token);
    const URL = import.meta.env.VITE_HOST;
    
    const genders = ['M', 'F'];


    const [newCitizenFields, setNewCitizenFields] = useState({
        cin: '',
        name: '',
        lastName: '',
        age: 0,
        gender: '',
    });

    const handleNewCitizenFieldChange = (fieldName: string, value: any) => {
        setNewCitizenFields((prevFields) => ({
            ...prevFields,
            [fieldName]: value,
        }));
    };

    const handleCreateNewCitizen = async () => {
        try {
            const response = await fetch(`${URL}/api/Citizen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: JSON.stringify(newCitizenFields),
            });

            const responseData = await response.json();

            if (response.ok) {
                if (responseData.isSuccess) {
                    Swal.fire('Success', 'New citizen created successfully.', 'success');
                    onClose();
                } else {
                    Swal.fire('Error', 'An error occurred while creating a new citizen.', 'error');
                }
            } else if (response.status === 400) {
                // Handling validation errors
                const errorMessages = Object.values(responseData.errors).flat();
                Swal.fire('Error', errorMessages.join('\n'), 'error');
                onClose()
            } else {
                Swal.fire('Error', 'An error occurred while creating a new citizen.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred while creating a new citizen.', 'error');
        }
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
                    padding: '20px 10%',
                    borderRadius: '4px',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h2>New Citizen</h2>
                <TextField
                    label="CIN"
                    value={newCitizenFields.cin}
                    onChange={(e) => handleNewCitizenFieldChange('cin', e.target.value)}
                    style={{ marginBottom: "18px" }}
                />
                <TextField
                    label="Name"
                    value={newCitizenFields.name}
                    onChange={(e) => handleNewCitizenFieldChange('name', e.target.value)}
                    style={{ marginBottom: "18px" }}
                />
                <TextField
                    label="Last Name"
                    value={newCitizenFields.lastName}
                    onChange={(e) => handleNewCitizenFieldChange('lastName', e.target.value)}
                    style={{ marginBottom: "18px" }}
                />
                <TextField
                    label="Age"
                    value={newCitizenFields.age}
                    onChange={(e) => handleNewCitizenFieldChange('age', parseInt(e.target.value))}
                    style={{ marginBottom: "18px" }}
                />
                <Select
                    label="Gender"
                    value={newCitizenFields.gender}
                    onChange={(e) => handleNewCitizenFieldChange('gender', e.target.value)}
                    style={{ marginBottom: "18px" }}
                >
                    {genders.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                            {gender}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    onClick={handleCreateNewCitizen}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '16px', width: '100%', padding: '8px 16px' }}
                >
                    Create Citizen
                </Button>
                <Button
                    onClick={onClose}
                    variant="contained"
                    style={{ marginTop: '8px', width: '100%', padding: '8px 16px' }}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
}
