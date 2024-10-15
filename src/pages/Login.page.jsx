import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthInterceptor from '../services/auth/AuthInterceptor';
import { setAuthData } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const { Title, Text } = Typography;

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const api = AuthInterceptor.getInstance();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage(''); // Reset error message on new attempt
    try {
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });
      const token = response.access_token;
      const id = response.id;

      if (token && id) {
        dispatch(setAuthData({ token, id }));
        const from = location.state?.from?.pathname || '/candidates';
        navigate(from);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      setErrorMessage('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-black p-8 rounded-lg shadow-lg">
        <div className="flex justify-center ">
          <img
            src="/assets/Logo1.jpg"
            alt="BeModel Logo"
            className="w-80 h-auto"
          />
        </div>

        <Title level={3} className="text-center text-white " >
          Welcome Back
        </Title>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className="mb-4"
            style={{
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              borderColor: '#FCA5A5',
            }}
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
              className="rounded-none shadow-none bg-transparent border-b-2 border-gray-600 text-black focus:border-yellow-400 focus:ring-0"
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
              className="rounded-none shadow-none bg-transparent border-b-2 border-gray-600 text-black focus:border-yellow-400 focus:ring-0"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-none border-none"
              style={{
                backgroundColor: '#FFD700',
                borderColor: '#FFD700',
              }}
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>

        {/* <div className="flex items-center justify-between mt-4 text-white">
          <Text>Or</Text>
        </div>

        <Button
          type="default"
          block
          size="large"
          className="mt-4 border-none text-black"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
          }}
        >
          <img
            src="/path/to/google-icon.png"
            alt="Google Icon"
            className="inline-block w-5 h-5 mr-2"
          />
          Login with Google
        </Button>

        <div className="text-center text-white mt-4">
          <a href="#" className="text-white underline">
            Forgot your password?
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default LoginModal;
