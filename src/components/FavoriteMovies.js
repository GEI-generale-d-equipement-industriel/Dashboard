import { Link } from 'react-router-dom';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, Row, Col } from 'antd';
// import {  IoIosRemoveCircleOutline } from '@ant-design/icons';
import { toggleFavorite } from '../store/movieSlice'; // Update import if needed
import { IoIosAddCircleOutline,IoIosRemoveCircleOutline } from "react-icons/io";
const { Meta } = Card;
const { Title } = Typography;

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

    return (
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="container mx-auto px-4">
                <Title level={2} className="text-center mb-8">Favorite Candidates</Title>

                <Row gutter={[16, 24]}>
                    {favoriteCandidates.map((candidate) => (
                        <Col span={12} md={8} lg={6} key={candidate._id}>
                            <Card
                                cover={
                                    <Link to={`/candidate/${candidate._id}`}>
                                        <img
                                            alt={`${candidate.name} ${candidate.firstName}`}
                                            src={`http://192.168.1.114:5000/api/files/${candidate.files[0]._id}`}
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
