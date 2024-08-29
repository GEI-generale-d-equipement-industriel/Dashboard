import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, Row, Col,Tag,Divider } from 'antd';
// import { LikeOutlined, DislikeOutlined,UserAddOutlined } from '@ant-design/icons';
import { IoIosAddCircleOutline,IoIosRemoveCircleOutline } from "react-icons/io";
import { toggleFavorite, fetchCandidates } from '../store/movieSlice';
import Pagination from './Pagination';

const { Meta } = Card;
const { Title } = Typography; 

function CandidateList() {
  // const candidates = useSelector((state) => state.candidates.candidates);
  // const selectedInterest = useSelector((state) => state.candidates.selectedInterest);
  // const searchFilter = useSelector((state) => state.candidates.searchFilter);
  const favorites = useSelector((state) => state.candidates.favorites);
  const filteredCandidates = useSelector(state => state.candidates.filteredCandidates);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleLikeToggle = (candidateId) => {
    dispatch(toggleFavorite(candidateId));
  };

  const pageSize = useSelector((state) => state.candidates.pageSize);
  const currentPage = useSelector((state) => state.candidates.currentPage);

  const candidatesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage, pageSize]);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-8">Related Candidates</Title>

        <Row gutter={[16, 24]}>
          {candidatesForCurrentPage.map((candidate) => (
            <Col span={12} md={8} lg={6} key={candidate._id}>
              <Card
                cover={
                  <Link to={`/candidate/${candidate._id}`}>
                    <img
                      alt={`${candidate.name}`}
                      src={`http://192.168.1.114:5000/api/files/${candidate.files.find(file => file.contentType.startsWith('image/'))._id}`}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                }
                actions={[
                  <Button
                    key="toggle-favorite"
                    type="text"
                    icon={favorites.includes(candidate._id) ? <IoIosRemoveCircleOutline /> : <IoIosAddCircleOutline />}
                    onClick={() => handleLikeToggle(candidate._id)}
                  >
                    {favorites.includes(candidate._id) ? 'Remove From Favorites' : 'Add To Favorites'}
                  </Button>
                ]}
                className="shadow-lg rounded-lg"
              >
                <Meta
                  title={<Link to={`/candidate/${candidate._id}`}>{candidate.firstName+" " +candidate.name}</Link>}

                  description={
                  <div>
                    <Divider orientation='left'>
                    
                    </Divider>
                    {candidate.interest.split(',').map((interest,index)=>(
                      <Tag color='gold' key={index}>
                        {interest.trim()}
                      </Tag>
                    ))}
                  </div>
                  }
                />
                <div className="mt-2 flex justify-between">
                  <p className="text-sm font-medium text-gray-700 capitalize">{candidate.gender}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Pagination totalItems={filteredCandidates.length} />
    </div>
  );
}

export default CandidateList;
