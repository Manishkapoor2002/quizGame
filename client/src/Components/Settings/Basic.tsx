import { Box, Button, Container, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";


interface MyBasicSetting {
    Username: string;
    Gender: "Male" | "Female";
    Location: string;
    Birthday: Date | null;
}

type editMode = {
    Gender: boolean;
    Location: boolean;
    Birthday: boolean;
}

const Basic: React.FC<MyBasicSetting> = ({ Username, Gender, Location, Birthday }) => {
    const [currentBasicSetting, setCurrentBasicSetting] = useState<MyBasicSetting>({
        Username,
        Gender,
        Location,
        Birthday
    });

    const [editMode, setEditMode] = useState<editMode>({
        Gender: false,
        Location: false,
        Birthday: false,
    });

    const handleEditMode = (field: "Gender" | "Location" | "Birthday") => {
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    }

    const [value, setValue] = useState<Dayjs | null>(Birthday ? dayjs(Birthday) : null);


    const onhandleEditDetail = (value: string) => {
        setCurrentBasicSetting((prev) => ({
            ...prev,
            "Location": value
        }));
    }

    const onhandleEditDOB = (value : Dayjs | null) => {
        if (value) {
            const newDate = value.toDate()
            setCurrentBasicSetting((prev) => ({
                ...prev,
                "Birthday": newDate
            }))
        }
        console.log("new date : ", currentBasicSetting.Birthday)
    }

    const onGenderChange = (value: "Male" | "Female") => {
        setCurrentBasicSetting((prev) => ({
            ...prev,
            "Gender": value
        }))
    }
    const onClickSave = async (field: "Gender" | "Location" | "Birthday") => {
        try {
            const updatedValue = currentBasicSetting[field];
            const map = {
                "Gender": "Gender",
                "Birthday": "DOB",
                "Location": "location"
            };


            const result = await axios.post(`http://localhost:3000/setting/${map[field]}`,
                { [map[field]]: updatedValue },
                {
                    headers: { authentication: localStorage.getItem('token') || '' },
                }
            );
            console.log(result)

            if (result.data.message === "Updated successfully") {
                handleEditMode(field)
            } else {
                alert(result.data.message)
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
        finally {

        }
    };


    return (
        <Container
            maxWidth="lg"
            sx={{
                marginTop: "100px",
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#f9f9f9',
                padding: '30px',
            }}
        >
            <Typography
                variant="h5"
                component="h5"
                gutterBottom
                sx={{
                    fontWeight: '600',
                    color: '#444',
                    marginBottom: '30px',
                    textAlign: 'left',
                }}
            >
                Basic Info
            </Typography>

            <Box>
                {/* Username */}
                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Username
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
                            {currentBasicSetting.Username}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditMode("Location")}
                            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                            disabled
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>

                {/* Gender */}
                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Gender
                    </Typography>
                    {editMode.Gender ? (
                        <Box>
                            <InputLabel id="gender-select-label" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                                Select Gender
                            </InputLabel>
                            <Select
                                labelId="gender-select-label"
                                id="gender-select"
                                value={currentBasicSetting.Gender}
                                onChange={(e) => onGenderChange(e.target.value as "Male" | "Female")}
                                fullWidth
                                variant="outlined"
                                sx={{ marginBottom: "20px" }}
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                            <Box sx={{ display: 'flex', gap: '10px' }}>


                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                    onClick={() => {
                                        onClickSave("Gender")
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        handleEditMode("Gender");
                                        setCurrentBasicSetting((prev) => ({
                                            ...prev,
                                            Gender
                                        }));
                                    }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ color: '#555', fontWeight: '500' }}>
                                {currentBasicSetting.Gender}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditMode("Gender")}
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                            >
                                Edit
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Location */}
                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Location
                    </Typography>
                    {editMode.Location ? (
                        <Box>
                            <TextField
                                id="outlined-basic"
                                label="Location"
                                variant="outlined"
                                value={currentBasicSetting.Location}
                                onChange={(e) => onhandleEditDetail(e.target.value)}
                                sx={{
                                    width: '100%',
                                    marginBottom: '10px',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                    onClick={() => {
                                        onClickSave("Location")
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        handleEditMode("Location");
                                        setCurrentBasicSetting((prev) => ({
                                            ...prev,
                                            Location
                                        }));
                                    }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ color: '#555', fontWeight: '500' }}>
                                {currentBasicSetting.Location}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditMode("Location")}
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                            >
                                Edit
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Birthday
                    </Typography>
                    {
                        editMode.Birthday ? (
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Controlled picker"
                                        value={value}
                                        onChange={(newValue) => {
                                            setValue(newValue)
                                            onhandleEditDOB(newValue)
                                        }}
                                    />

                                </LocalizationProvider>

                                <Box sx={{ display: 'flex', gap: '10px' }}>


                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                        onClick={() => {
                                            // bug(not saving correct birthday date )
                                            onhandleEditDOB(value)
                                            // onClickSave("Birthday")
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            handleEditMode("Birthday");
                                            setCurrentBasicSetting((prev) => ({
                                                ...prev,
                                                Birthday
                                            }));
                                        }}
                                        sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body1" sx={{ color: '#555', fontWeight: '500' }}>
                                    {currentBasicSetting.Birthday ? currentBasicSetting.Birthday?.toString() : "NA"}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleEditMode("Birthday")
                                    }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                >
                                    Edit
                                </Button>
                            </Box>

                        )
                    }
                </Box>
            </Box>
        </Container >
    );
}

export default Basic;
