import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthInterceptor from '../services/auth/AuthInterceptor';
import { setAuthData } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const { Title } = Typography;

const LoginModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const api = AuthInterceptor.getInstance();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      if (response.access_token && response.id) {
        AuthInterceptor.updateToken(response.access_token);
        dispatch(setAuthData({ token: response.access_token, id: response.id }));

        const from = location.state?.from?.pathname || '/candidates';
        navigate(from, { replace: true });
        onClose(); // Close the modal after successful login
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <img
          src="/assets/Logo1.jpg"
          alt="BeModel Logo"
          className="w-40 h-auto mb-4"
        />
      </div>
      <Title level={3} className="text-center">
        Welcome Back
      </Title>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: '#FFD700' }} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: '#FFD700' }} />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-yellow-500 text-black hover:bg-yellow-600"
          >
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginModal;
