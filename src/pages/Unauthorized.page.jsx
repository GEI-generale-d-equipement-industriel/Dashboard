import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography,Result } from 'antd';

const { Title } = Typography;

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Title level={2} className='!text-red-500'>Access Denied</Title>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => navigate('/', { replace: true })}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;  
