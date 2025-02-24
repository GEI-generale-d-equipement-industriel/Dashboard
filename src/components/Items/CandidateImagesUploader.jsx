import React, { useState } from "react";
import { Button, Upload, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function CandidateImageUploader({ candidateId }) {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

const url=process.env.REACT_APP_API_BASE_URL||"/api"


  // Handle file selection
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Upload selected images
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Veuillez sélectionner un fichier à télécharger.");
      return;
    }

    setLoading(true); // Show spinner

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await axios.patch(
        `${url}/candidates/${candidateId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      
      if (response.status === 200 || response.status === 201) {
        const uploadedFiles = response.data?.files || [];

        message.success("Fichiers téléchargés avec succès !");
        setFileList([]);
        setUploadModalVisible(false);

        // ✅ Directly update cache to show new images immediately
        queryClient.setQueryData(["candidate", candidateId], (oldData) => {
          if (!oldData) return oldData; // If there's no existing data, return as is
          return {
            ...oldData,
            files: [...(oldData.files || []), ...uploadedFiles], // Merge new files
          };
        });

        // ✅ Re-fetch data to ensure the latest state
        queryClient.invalidateQueries(["candidate", candidateId]);
      } else {
        throw new Error("Échec du téléchargement.");
      }
    } catch (error) {
      
      message.error(error.response?.data?.message || "Erreur lors du téléchargement.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <>
      {/* Upload Button */}
      <div className="mt-4 text-center">
        <Button
          icon={<UploadOutlined />}
          onClick={() => setUploadModalVisible(true)}
        >
          Ajouter une image
        </Button>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Télécharger de nouvelles images"
        open={uploadModalVisible} // Updated "visible" to "open" for latest Ant Design versions
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadModalVisible(false)}>
            Annuler
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            loading={loading}
          >
            Télécharger
          </Button>,
        ]}
      >
        <Upload
          multiple
          beforeUpload={() => false} // Prevent automatic upload
          fileList={fileList}
          onChange={handleFileChange}
          accept="image/*"
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Sélectionner des images</Button>
        </Upload>
      </Modal>
    </>
  );
}
