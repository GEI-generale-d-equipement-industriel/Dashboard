// src/components/LoginModal.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthInterceptor from '../services/auth/AuthInterceptor';
import { setAuthData } from '../store/authSlice';
import { useDispatch } from 'react-redux';
const { Title } = Typography;

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const api = AuthInterceptor.getInstance();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });
      const token = response?.access_token;
    const id = response?.id;

    if (token && id) {
      // Dispatch both the token and id to the Redux store
      dispatch(setAuthData({ token, id }));
      
      // Navigate to the candidates page
      navigate('/candidates');
      
      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
      });

      // Close the modal
      setIsModalVisible(false);
    } else {
      // Handle missing token or ID
      throw new Error("Invalid response data");
    }
      
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Login Failed',
        description: 'Invalid username or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add a wrapper for the content behind the modal */}
      <div className={isModalVisible ? 'blur-background' : ''}>
        {/* Your background content or a placeholder */}
        
      </div>

      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        closable={false}
        centered
        maskClosable={false}
      >
        <div className="w-full max-w-md p-8">
          <Title level={2} className="text-center mb-6">Login</Title>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Log In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;
