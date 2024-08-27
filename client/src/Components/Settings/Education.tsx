import { Box, Button, Container, InputLabel, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react'

interface MyEducationInterface {
    schoolName: string;
    course: string;
    startYear: Dayjs | null;
    finishYear: Dayjs | null;
}

type editMode = {
    schoolName: boolean,
    course: boolean,
    startYear: boolean,
    finishYear: boolean,
}

const Education: React.FC<MyEducationInterface> = ({
    schoolName,
    course,
    startYear,
    finishYear
}) => {

    const [currentEducation, setCurrentEducation] = useState<MyEducationInterface>({
        schoolName,
        course,
        startYear: startYear ? dayjs(startYear) : dayjs(new Date()),
        finishYear: finishYear ? dayjs(finishYear) : dayjs(new Date()),
    })

    const [editMode, setEditMode] = useState<editMode>({
        schoolName: false,
        course: false,
        startYear: false,
        finishYear: false,
    })


    const handleEditMode = (field: keyof MyEducationInterface) => {
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const onhandleSave = async (field: keyof MyEducationInterface) => {
        let updatedValue;
        if ((field === "startYear" || field === "finishYear") && currentEducation[field]) {
            updatedValue = currentEducation[field].format('YYYY-MM-DD')
        } else {
            updatedValue = currentEducation[field];
        }
        console.log(updatedValue)
        try {
            const result = await axios.post(`http://localhost:3000/setting/education`, {
                key: [field].toString(),
                value: updatedValue
            }, {
                headers: { authentication: localStorage.getItem('token') || '' },
            })
            alert(result.data.message)
        } catch (err) {
            if (err instanceof Error) {
                alert(`Error , ${err.message as string}`)
            }
        } finally {
            handleEditMode(field)
        }
    }


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
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: '600',
                    color: '#444',
                    marginBottom: '30px',
                    textAlign: 'left',
                }}
            >
                Education
            </Typography>
            <Box>
                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        School Name
                    </Typography>
                    {editMode.schoolName ? (
                        <Box>
                            <InputLabel id="gender-select-label" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                                School Name
                            </InputLabel>
                            <TextField
                                id="outlined-basic"
                                label="Location"
                                variant="outlined"
                                value={currentEducation.schoolName}
                                onChange={(e) => setCurrentEducation((prev) => ({
                                    ...prev,
                                    "schoolName": e.target.value
                                }))}
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
                                        onhandleSave("schoolName")
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ color: '#555', fontWeight: '500' }}>
                                {currentEducation.schoolName}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditMode("schoolName")}
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                            >
                                Edit
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Course Name
                    </Typography>
                    {editMode.course ? (
                        <Box>
                            <InputLabel id="gender-select-label" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                                Course
                            </InputLabel>
                            <TextField
                                id="outlined-basic"
                                label="Location"
                                variant="outlined"
                                value={currentEducation.course}
                                onChange={(e) => setCurrentEducation((prev) => ({
                                    ...prev,
                                    "course": e.target.value
                                }))}
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
                                        onhandleSave("course")
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"

                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ color: '#555', fontWeight: '500' }}>
                                {currentEducation.course}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEditMode("course")}
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                            >
                                Edit
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Start Year
                    </Typography>
                    {
                        editMode.startYear ? (
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Controlled picker"
                                        value={currentEducation.startYear}
                                        onChange={(newValue) => {
                                            setCurrentEducation((prev) => ({
                                                ...prev,
                                                "startYear": newValue
                                            }))
                                        }}
                                    />

                                </LocalizationProvider>

                                <Box sx={{ display: 'flex', gap: '10px' }}>


                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                        onClick={() => {
                                            onhandleSave("startYear")
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            handleEditMode("startYear");
                                            setCurrentEducation((prev) => ({
                                                ...prev,
                                                startYear: startYear ? dayjs(startYear) : dayjs(new Date()),
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
                                    {currentEducation.startYear ? currentEducation.startYear?.toString().substring(0, 11) : "NA"}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleEditMode("startYear")
                                    }}
                                    sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                >
                                    Edit
                                </Button>
                            </Box>

                        )
                    }
                </Box>
                <Box mb={3}>
                    <Typography variant="h6" color="secondary" sx={{ marginBottom: '10px' }}>
                        Finish Year
                    </Typography>
                    {
                        editMode.finishYear ? (
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Controlled picker"
                                        value={currentEducation.finishYear}
                                        onChange={(newValue) => {
                                            setCurrentEducation((prev) => ({
                                                ...prev,
                                                "finishYear": newValue
                                            }))
                                            // handleDate("finishYear", newValue)
                                        }}
                                    />

                                </LocalizationProvider>

                                <Box sx={{ display: 'flex', gap: '10px' }}>


                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
                                        onClick={() => {
                                            // bug(not saving correct  date )
                                            // handleDate("finishYear", value.finishYear)
                                            onhandleSave("finishYear")
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            handleEditMode("finishYear");
                                            setCurrentEducation((prev) => ({
                                                ...prev,
                                                finishYear: finishYear ? dayjs(finishYear) : dayjs(new Date()),
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
                                    {currentEducation.finishYear ? currentEducation.finishYear?.toString().substring(0, 11) : "NA"}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleEditMode("finishYear")
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
        </Container>
    )
}

export default Education
