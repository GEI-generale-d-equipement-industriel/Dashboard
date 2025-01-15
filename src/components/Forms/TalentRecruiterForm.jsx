import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomModal from "../Modal/Custom.Modal";

const { Option } = Select;

const TalentRecruiterForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [percent, setPercent] = useState(0);


  const sectors = [
    "Alimentation et boissons",
    "Arts, spectacles et divertissement",
    "Beauté, santé et bien-être",
    "Bijoux et accessoires",
    "Café, hôtel, restaurant, traiteur",
    "Commerce en ligne ou Magasin",
    "Électroménager",
    "Informatique et technologie",
    "Maison et décoration",
    "Mode et habillement",
    "Photographie et vidéo",
    "Média ou Agence de communication/production",
    "Sport et fitness",
    "Voyages et tourisme",
    "Art et design",
    "Automobile et transport",
    "Environnement et durabilité",
    "Service en ligne",
    "Autres (à préciser)",
  ];
const url =process.env.REACT_APP_API_BASE_URL;


const handleLogoUpload = async ({ file }) => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${url}/migration/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLogoUrl(response.data.url); // Update logo URL
      message.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      message.error("Failed to upload logo.");
    } finally {
      setIsUploading(false);
    }
  }

  const handleSubmit = async (values) => {
    if (!logoUrl) {
      message.error("Please upload a logo before submitting.");
      return;
    }

    const formData = { ...values, logo: logoUrl, role: "company" };

    setIsSubmitting(true);

    try {
        const response = await axios.post(`${url}/user`, formData);
        message.success("Company registered successfully!");
  
        // If your parent wants the new user data
        onSubmit(response.data);
  
        // **Show the success modal** immediately
       
        setIsModalOpen(true);
      } catch (error) {
      console.error("Error registering company:", error);
      message.error("Failed to register company.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setLogoUrl("");
    
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">
        Join as a Talent Recruiter
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ sector: "" }}
      >
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[{ required: true, message: "Please enter your company name" }]}
        >
          <Input placeholder="Enter your company name" />
        </Form.Item>

        <Form.Item
          label="Fiscal ID"
          name="fiscalId"
          rules={[{ required: true, message: "Please enter your fiscal ID" }]}
        >
          <Input placeholder="Enter your fiscal ID" />
        </Form.Item>

        <Form.Item
          label="Sector"
          name="sector"
          rules={[{ required: true, message: "Please select a sector" }]}
        >
          <Select placeholder="Select a sector">
            {sectors.map((sector) => (
              <Option key={sector} value={sector}>
                {sector}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>
        <Form.Item
          label="User Name"
          name="username"
          rules={[
            { required: true, message: "Please enter your username" },
            { type: "username", message: "Please enter a valid username address" },
          ]}
        >
          <Input placeholder="Enter your username address" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item label="Website" name="website">
          <Input placeholder="Enter your website URL" />
        </Form.Item>

        <Form.Item
          label="Company Logo"
          name="logo"
          valuePropName="file"
        >
        <Upload
            accept="image/*"
            customRequest={handleLogoUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} disabled={isUploading}>
              {isUploading ? (
                <Spin size="small" className="mr-2" />
              ) : (
                <span>Upload Logo</span>
              )}
            </Button>
          </Upload>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo Preview"
              className="mt-4 w-32 h-32 object-cover border rounded"
            />
          )}
        </Form.Item>

        <Form.Item className="mt-8">
        <Button
            type="primary"
            htmlType="submit"
            block
            disabled={isUploading || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
      {/* <CustomSpinner spinning={spinning} percent={percent}/> */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Félicitations"
      >
        <p>
          Votre formulaire a été soumis avec succès ! Merci de votre
          participation.<br></br>Un membre de notre équipe examinera votre
          profil et vous contactera dans les plus brefs délais.
        </p>
      </CustomModal>
    </div>
  );
};

export default TalentRecruiterForm;
