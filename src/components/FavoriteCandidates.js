import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, Row, Col } from 'antd';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { toggleFavorite } from '../store/candidatesSlice'; // Update import if needed
import * as XLSX from 'xlsx';

const { Meta } = Card;
const { Title } = Typography;
const url = "http://localhost:5000";

const FavoriteCandidates = () => {
    const favoriteCandidateIds = useSelector((state) => state.candidates.favorites);
    const candidates = useSelector((state) => state.candidates.candidates);
    const dispatch = useDispatch();

    const favoriteCandidates = candidates.filter((candidate) =>
        favoriteCandidateIds.includes(candidate._id)
    );

    const handleLikeToggle = (candidateId) => {
        dispatch(toggleFavorite(candidateId));
    };

    const downloadXLSX = () => {
        const worksheetData = [
            ["Name", "Gender", "Birth Year", "Interest", "Phone Number", "Files"], // Header row
            ...favoriteCandidates.map(candidate => [
                `${candidate.name} ${candidate.firstName}`,
                candidate.gender,
                candidate.birthYear,
                candidate.interest,
                candidate.phone,
                candidate.files.map((file,id) => `${file.filename}`).join(', ') // Convert the array of files to a comma-separated string
            ])
        ];
    
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
        // Style the header row
        const headerCellStyle = {
            font: { bold: true },
            fill: { fgColor: { rgb: "FFAA00" } }, // Orange background color
            alignment: { horizontal: "center" }
        };
    
        // Apply the style to each header cell
        ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].forEach(cell => {
            worksheet[cell].s = headerCellStyle;
        });
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Favorites");
    
        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'favorite_candidates.xlsx');
    };
    

    return (
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="container mx-auto px-4">
                <Title level={2} className="text-center mb-8">Favorite Candidates</Title>

                <div className="flex justify-end mb-4">
            <Button 
                type="primary" 
                onClick={downloadXLSX} 
                className="bg-blue-500 border-blue-500 text-white font-bold text-lg py-2 px-4 hover:bg-blue-600 hover:border-blue-600"
            >
                Download as Excel
            </Button>
        </div>

                <Row gutter={[16, 24]}>
                    {favoriteCandidates.map((candidate) => (
                        <Col span={12} md={8} lg={6} key={candidate._id}>
                            <Card
                                cover={
                                    <Link to={`/candidate/${candidate._id}`}>
                                        <img
                                            alt={`${candidate.name} ${candidate.firstName}`}
                                            src={`${url}/api/files/${candidate.files[0]._id}`}
                                            className="w-full h-48 object-cover"
                                        />
                                    </Link>
                                }
                                actions={[
                                    <Button
                                        key="toggle-favorite"
                                        type="text"
                                        icon={<IoIosRemoveCircleOutline />}
                                        onClick={() => handleLikeToggle(candidate._id)}
                                    >
                                        {favoriteCandidateIds.includes(candidate._id) ? 'Remove' : 'Add'}
                                    </Button>
                                ]}
                                className="shadow-lg rounded-lg"
                            >
                                <Meta
                                    title={<Link to={`/candidate/${candidate._id}`}>{candidate.name} {candidate.firstName}</Link>}
                                    description={<p className="text-gray-500">{candidate.gender}</p>}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default FavoriteCandidates;
