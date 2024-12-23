import React, { useState } from 'react';
import { Form, Input, Button,  Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthInterceptor from '../../services/auth/AuthInterceptor';
import { setAuthData } from '../../store/authSlice';
import { useDispatch } from 'react-redux';

//const { Title } = Typography;

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
        dispatch(setAuthData({ token: response.access_token, id: response.id,role:response.role }));

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
    <div className="p-8 rounded-lg shadow-2xl w-[90%]  md:max-w-lg lg:max-w-lg mx-auto relative bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 ">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
        aria-label="Close"
      >
        ✕
      </button>
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <img
          src="/assets/BeModel1.png"
          alt="BeModel Logo"
          className="w-36 "
        />
      </div>
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Welcome Back
      </h2>
      {/* Error Message */}
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      {/* Form */}
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="space-y-6"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="text-yellow-500" />}
            placeholder="Email"
            className="rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-yellow-500" />}
            placeholder="Password"
            className="rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="button"
            htmlType="submit"
            loading={loading}
            block
            className="bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg py-2 px-4 font-medium shadow-md"
          >
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginModal;
