import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthInterceptor from "../../services/auth/AuthInterceptor";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/authSlice";

const SignupModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = AuthInterceptor.getInstance();

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessage("");
    try {
      // Send signup request
      const response = await api.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (response.access_token && response.id) {
        AuthInterceptor.updateToken(response.access_token);
        dispatch(setAuthData({ token: response.access_token, id: response.id, role: response.role }));

        // Redirect user after successful signup
        navigate("/candidates", { replace: true });
        onClose(); // Close modal after success
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      setErrorMessage("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-2xl w-[90%] md:max-w-lg lg:max-w-lg mx-auto relative bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
        aria-label="Close signup modal"
      >
        ✕
      </button>
      
      {/* Logo Section */}
      <div className="flex justify-center mb-6">
        <img
          src="https://res.cloudinary.com/dqtwi6rca/image/upload/v1736505510/assets/loiqsnuqfzvz8xr8udvr.png"
          alt="BeModel Logo"
          className="w-36"
        />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Create an Account
      </h2>

      {/* Error Message */}
      {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

      {/* Signup Form */}
      <Form name="signup" onFinish={onFinish} layout="vertical" className="space-y-4">
        {/* Name Field */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="text-yellow-500" />}
            placeholder="Full Name"
            className="rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }, { type: "email", message: "Invalid email format!" }]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="text-yellow-500" />}
            placeholder="Email"
            className="rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }, { min: 6, message: "Password must be at least 6 characters long!" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-yellow-500" />}
            placeholder="Password"
            className="rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="button"
            htmlType="submit"
            loading={loading}
            block
            className="bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg py-2 px-4 font-medium shadow-md"
            aria-label="Sign Up"
          >
            SIGN UP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupModal;
