import React, { useState } from "react";
import { Input, Button, Form, Avatar, Typography } from "antd";
import { EditOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const [profileData, setProfileData] = useState({
    name: "Aziz Menzli",
    email: "aziz.menzli@example.com",
    phone: "123-456-7890",
    bio: "Full Stack Developer | React and Node.js Enthusiast",
  });

  const handleEditClick = () => {
    form.setFieldsValue(profileData);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    form.validateFields().then((values) => {
      setProfileData(values);
      setIsEditing(false);
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <Avatar size={100} icon={<UserOutlined />} className="bg-gray-300" />
        <Title level={3} className="text-center">
          {isEditing ? (
            <Form.Item name="name" noStyle>
              <Input placeholder="Name" className="text-center" />
            </Form.Item>
          ) : (
            profileData.name
          )}
        </Title>
      </div>

      <Form
        form={form}
        initialValues={profileData}
        layout="vertical"
        className={isEditing ? "block mt-6" : "hidden"}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input type="email" className="w-full border border-gray-300 rounded-md p-2" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <Input className="w-full border border-gray-300 rounded-md p-2" />
        </Form.Item>

        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} className="w-full border border-gray-300 rounded-md p-2" />
        </Form.Item>
      </Form>

      {!isEditing && (
        <div className="mt-4 space-y-2">
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Bio:</strong> {profileData.bio}</p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Button
          type="primary"
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={isEditing ? handleSaveClick : handleEditClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {isEditing ? "Save" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
