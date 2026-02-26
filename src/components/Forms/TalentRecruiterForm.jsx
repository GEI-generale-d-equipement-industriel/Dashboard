import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Spin, message } from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomModal from "../Modal/Custom.Modal";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const TalentRecruiterForm = ({ onSubmit }) => {
  const navigate = useNavigate();
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
const url =process.env.REACT_APP_API_BASE_URL||"api";


const handleLogoUpload = async ({ file }) => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("voiceUrl", file);

    try {
      const response = await axios.post(`${url}/migration/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [(data) => data],
      });

      if (response.data && response.data.url) {
        setLogoUrl(response.data.url);
        message.success("Logo uploaded successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      message.error(error.response?.data?.message || "Failed to upload logo.");
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
        
        // Send email notification
        const emailData = {
          from: "content@be-model.tn",
          to: "content@be-model.tn",
          subject: "New Talent Recruiter Registration",
          html: `
            <h2>New Talent Recruiter Registration</h2>
            <p>A new company has registered as a talent recruiter:</p>
            <ul>
              <li><strong>Company Name:</strong> ${values.companyName}</li>
              <li><strong>Fiscal ID:</strong> ${values.fiscalId}</li>
              <li><strong>Sector:</strong> ${values.sector}</li>
              <li><strong>Email:</strong> ${values.email}</li>
              <li><strong>Username:</strong> ${values.username}</li>
              <li><strong>Phone:</strong> ${values.phone}</li>
              <li><strong>Website:</strong> ${values.website || 'Not provided'}</li>
            </ul>
          `
        };

        await axios.post(`${url}/email/send`, emailData);
        
        message.success("Company registered successfully!");
  
        // If your parent wants the new user data
        // onSubmit(response.data);
  
        // Show the success modal
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ sector: "" }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Please enter your company name" }]}
          >
            <Input placeholder="Enter your company name" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Fiscal ID"
            name="fiscalId"
            rules={[{ required: true, message: "Please enter your fiscal ID" }]}
          >
            <Input placeholder="Enter your fiscal ID" className="rounded-lg" />
          </Form.Item>
        </div>

        <Form.Item
          label="Sector"
          name="sector"
          rules={[{ required: true, message: "Please select a sector" }]}
        >
          <Select placeholder="Select a sector" className="rounded-lg">
            {sectors.map((sector) => (
              <Option key={sector} value={sector}>
                {sector}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter your email address" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="username"
            rules={[
              { required: true, message: "Please enter your username" },
              { type: "username", message: "Please enter a valid username address" },
            ]}
          >
            <Input placeholder="Enter your username address" className="rounded-lg" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter your phone number" }]}
          >
            <Input placeholder="Enter your phone number" className="rounded-lg" />
          </Form.Item>
        </div>

        <Form.Item label="Website" name="website">
          <Input placeholder="Enter your website URL" className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label="Company Logo"
          name="logo"
          valuePropName="file"
          className="flex flex-col item-centre justify-centre border-2  border-dashed border-gray-300 rounded-lg p-6"
        >
          
          <Upload
            accept="image/*"
            customRequest={handleLogoUpload}
            showUploadList={false}
            className="w-full h-32 flex flex-col items-center justify-center "
          >
            <Button 
              // icon={<UploadOutlined />} 
              disabled={isUploading}
              className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
            >
              {isUploading ? (
                <Spin size="large" />
              ) : (
                <>
                  <UploadOutlined className="text-2xl mb-2" />
                  <span>Click to Upload Logo</span>
                </>
              )}
            </Button>
          </Upload>
          {logoUrl && (
            <div className="mt-4 flex justify-center">
              <img
                src={logoUrl}
                alt="Logo Preview"
                className="w-32 h-32 object-cover border rounded-lg shadow-md"
              />
            </div>
          )}
        </Form.Item>

        <div className="flex space-x-4 mt-8">
          <Button
            type="primary"
            htmlType="submit"
            disabled={isUploading || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>

      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Félicitations"
      >
        <p className="text-center text-gray-700">
          Votre formulaire a été soumis avec succès ! Merci de votre
          participation.<br /><br />
          Un membre de notre équipe examinera votre
          profil et vous contactera dans les plus brefs délais.
        </p>
      </CustomModal>
    </div>
  );
};

export default TalentRecruiterForm;
