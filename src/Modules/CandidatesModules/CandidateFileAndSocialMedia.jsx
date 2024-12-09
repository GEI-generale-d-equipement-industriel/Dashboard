import React from 'react';
import { List, Divider, Typography } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined,TikTokOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CandidateFilesAndSocialMedia = ({ candidate }) => {
  // Extract files and social media links
  const mediaFiles = candidate?.files?.filter(
    (file) =>
      file.contentType?.startsWith('audio/') ||
      file.contentType?.startsWith('video/')
  );

  const socialMediaLinks =
    candidate?.socialMedia?.map((link) => JSON.parse(link)) || [];
  return (
    <>
      <div className="mt-2">
        <Title level={4}>Files</Title>
        {mediaFiles && mediaFiles.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={mediaFiles}
            renderItem={(file) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div>
                      <span style={{ fontWeight: 'bold' }}>
                        <a
                          href={file.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {file.contentType.startsWith('audio/')
                            ? 'Audio File'
                            : 'Video File'}
                        </a>
                      </span>
                      <span
                        style={{
                          marginLeft: '10px',
                          fontStyle: 'italic',
                          color: '#555',
                        }}
                      >
                        ({file.contentType})
                      </span>
                    </div>
                  }
                />
                {file.contentType.startsWith('audio/') && (
                  <audio controls style={{ width: '100%' }}>
                    <source src={file.filename} type={file.contentType} />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {file.contentType.startsWith('video/') && (
                  <video
                    controls
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      height: '280px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <source src={file.filename} type={file.contentType} />
                    Your browser does not support the video element.
                  </video>
                )}
              </List.Item>
            )}
          />
        ) : (
          <p>No audio or video files available for this candidate.</p>
        )}
      </div>
      <Divider />
      <div className="mt-2">
        <Title level={4}>Social Media</Title>
        <div className="mt-2 flex space-x-4">
          {socialMediaLinks.map((link, index) => {
            switch (link.type.toLowerCase()) {
              case 'facebook':
                return (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookOutlined
                      style={{ fontSize: '24px', color: '#3b5998' }}
                    />
                  </a>
                );
              case 'twitter':
                return (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterOutlined
                      style={{ fontSize: '24px', color: '#1DA1F2' }}
                    />
                  </a>
                );
              case 'instagram':
                return (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramOutlined
                      style={{ fontSize: '24px', color: '#C13584' }}
                    />
                  </a>
                );
              case 'linkedin':
                return (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinOutlined
                      style={{ fontSize: '24px', color: '#0077B5' }}
                    />
                  </a>
                );
              case 'tiktok':
                return (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TikTokOutlined
                      style={{ fontSize: '24px', color: '#000000' }}
                    />
                  </a>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
};

export default CandidateFilesAndSocialMedia;
