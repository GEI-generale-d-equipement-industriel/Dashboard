import React from 'react';
import { Modal } from 'antd';
import { createStyles, useTheme } from 'antd-style';

const useStyle = createStyles(({ token }) => ({
  'my-modal-body': {
    background: token.blue1,
    padding: token.paddingSM,
  },
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-header': {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  'my-modal-footer': {
    color: token.colorPrimary,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const CustomModal = ({ isOpen, onClose, title, children }) => {
  const { styles } = useStyle();
  const token = useTheme();

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null} // No footer
      className={`rounded-lg shadow-lg bg-white p-5 mx-auto ${styles['my-modal-content']}`}
      maskStyle={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      
      style={{
        width: '90vw', // Adjusts width to 90% of viewport width
        maxWidth: '90%', // Restricts maximum width to 90% of the parent container
        borderRadius: '0.5rem',
        overflow: 'hidden',
        margin: '0 auto', // Centers the modal horizontally
      }}
      title={
        <div className="border-l-4 border-green-600 pl-2 text-xl font-semibold">
          {title}
        </div>
      }
      headerStyle={{
        borderBottom: `1px dotted ${token.colorPrimary}`,
      }}
      footerStyle={{
        borderTop: '1px solid #333',
      }}
    >
      <div className="text-gray-700 text-lg">
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
