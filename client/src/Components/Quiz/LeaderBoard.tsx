import React, { useEffect, useState } from "react";
import axios from "axios";
import { LeaderBoardUserDetail } from "../../global/types";
import {
    Container,
    Button,
    Typography,
    Box,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Paper,
    Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userState } from "../../store/userAtom";

const styles = {
    tableContainer: {
        marginTop: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9',
        },
        '&:hover': {
            backgroundColor: '#f1f1f1',
        },
        cursor: 'pointer',

    },
    tableCell: {
        fontWeight: '500',
        color: '#333',
    },
    paginationControls: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    button: {
        minWidth: '100px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
};

const LeaderBoard: React.FC = () => {
    const navigate = useNavigate()
    const [leaderBoardList, setLeaderBoardList] = useState<LeaderBoardUserDetail[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
   
    useEffect(() => {
        const fetchLeaderBoardList = async () => {
            setLoading(true);
            try {
                const result = await axios.get(`http://localhost:3000/game/leaderBoard/${page}`);
                const { message, list } = result.data;

                if (message === "No more Users") {
                    setIsLastPage(true);
                } else if (message === "List Fetched Successfully" && list) {
                    setLeaderBoardList(prevList => [...prevList, ...list]);
                    setIsLastPage(list.length < 10);
                }
            } catch (err) {
                console.error("Something went wrong:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderBoardList();
    }, [page]);

    const handleNextPage = () => {
        if (!isLastPage) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
            setIsLastPage(false);
        }
    };

    return (
        <Container maxWidth="xl">
            {loading ? (
                <Typography variant="h6" align="center">
                    Loading...
                </Typography>
            ) : (
                <div>
                    <TableContainer component={Paper} style={styles.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Current Rank</TableCell>
                                    <TableCell align="center">Username</TableCell>
                                    <TableCell align="center">Profile Picture</TableCell>
                                    <TableCell align="center">Total Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderBoardList.map((user, index) => (
                                    <TableRow
                                        key={index}
                                        sx={styles.tableRow}
                                        onClick={() => {
                                            navigate(`/profile/${user.username}`)
                                        }}
                                    >
                                        <TableCell align="center" sx={styles.tableCell}>
                                            {user.currentRank}
                                        </TableCell>
                                        <TableCell align="center" sx={styles.tableCell}>
                                            {user.username}
                                        </TableCell>
                                        <TableCell align="center" sx={{ ...styles.tableCell, display: 'flex', justifyContent: 'center' }}>
                                            <Avatar src={user.profilepic} alt={user.username} />
                                        </TableCell>
                                        <TableCell align="center" sx={styles.tableCell}>
                                            {user.totalScore}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box style={styles.paginationControls}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            style={styles.button}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextPage}
                            disabled={isLastPage}
                            style={styles.button}
                        >
                            Next
                        </Button>
                    </Box>
                </div>
            )}

        </Container>
    );
};

export default LeaderBoard;
