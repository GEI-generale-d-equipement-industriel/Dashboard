// src/components/LoginModal.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Typography, notification, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthInterceptor from '../services/auth/AuthInterceptor';
const { Title } = Typography;

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate();
  const api = AuthInterceptor.getInstance();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });
      console.log(response);

      localStorage.setItem('access_token', response.access_token);
      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
      });

      // Close modal
      setIsModalVisible(false);

      // Navigate to a new route after login
      navigate('/dashboard');
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
