import React from "react";
import { Carousel, Row, Col, Divider, Typography, Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const CandidateFilesAndSocialMedia = ({ candidate }) => {
  const mediaFiles = candidate?.files?.filter(
    (file) =>
      file.contentType?.startsWith("audio/") &&
      file.contentType?.startsWith("video/")
  );

  const videoFiles = candidate?.files?.filter(
    (file) => file.filename.toLowerCase().includes("video")
  );

  const audioFiles = mediaFiles?.filter((file) =>
    file.contentType.startsWith("audio/")
  );

  const socialMediaLinks = candidate?.socialMedia?.map((link) =>
    typeof link === "string" ? JSON.parse(link) : link
  ) || [];
    const combinedAudioFiles = [
      ...(audioFiles || []),
      candidate?.voiceUrl
        ? {
            filename: candidate.voiceUrl,
            
          }
        : null,
    ].filter(Boolean); 

   
    
  const carouselRef = React.useRef();


  return (
    <div
      style={{
        padding: "24px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Files Section */}
      <div style={{ marginBottom: "32px" }}>
        <Title level={4} style={{ marginBottom: "16px" }}>
          Files
        </Title>

        {/* Video Slider */}
        {videoFiles && videoFiles.length > 0 && (
  <div style={{ position: 'relative', marginBottom: '24px' }}>
    <Carousel
      ref={carouselRef}
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {videoFiles.map((file, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <video
            controls
            tabIndex="-1"
            style={{
              width: '100%',
              maxHeight: '260px',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          >
            <source src={file.filename} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>
      ))}
    </Carousel>

    {/* Next/Prev Buttons */}
    <Button
      icon={<LeftOutlined />}
      onClick={() => carouselRef.current.prev()}
      style={{
        position: 'absolute',
        top: '50%',
        left: '-10px',
        transform: 'translateY(-50%)',
        background: '#fff',
        border: '1px solid #d9d9d9',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    />
    <Button
      icon={<RightOutlined />}
      onClick={() => carouselRef.current.next()}
      style={{
        position: 'absolute',
        top: '50%',
        right: '-10px',
        transform: 'translateY(-50%)',
        background: '#fff',
        border: '1px solid #d9d9d9',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    />
  </div>
)}

        {/* Audio Files */}
        {combinedAudioFiles && combinedAudioFiles.length > 0 && (
          <div>
            <Row gutter={[16, 16]}>
              {combinedAudioFiles.map((file, index) => (
                <Col key={index} xs={24} sm={12}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                      <a
                        href={file.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1890ff", textDecoration: "none" }}
                      >
                        Audio File
                      </a>
                    </div>
                    <audio controls style={{ width: "100%" }}>
                      <source src={file.filename} type={file.contentType} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {!videoFiles?.length && !audioFiles?.length && (
          <p>No audio or video files available for this candidate.</p>
        )}
      </div>

      <Divider />

      {/* Social Media Section */}
      <div style={{ marginTop: "32px" }}>
        <Title level={4} style={{ marginBottom: "16px" }}>
          Social Media
        </Title>
        <Row
          justify="center"
          gutter={[16, 16]}
          style={{ flexWrap: "wrap", textAlign: "center" }}
        >
          {socialMediaLinks.length > 0 ? (
            socialMediaLinks.map((link, index) => {
              const socialMediaIcons = {
                facebook: (
                  <FacebookOutlined
                    style={{ fontSize: "32px", color: "#3b5998" }}
                  />
                ),
                twitter: (
                  <TwitterOutlined
                    style={{ fontSize: "32px", color: "#1DA1F2" }}
                  />
                ),
                instagram: (
                  <InstagramOutlined
                    style={{ fontSize: "32px", color: "#C13584" }}
                  />
                ),
                linkedin: (
                  <LinkedinOutlined
                    style={{ fontSize: "32px", color: "#0077B5" }}
                  />
                ),
                tiktok: (
                  <TikTokOutlined
                    style={{ fontSize: "32px", color: "#000000" }}
                  />
                ),
              };

              const icon = socialMediaIcons[link?.type?.toLowerCase()];
              return (
                <Col key={index} xs={6} sm={4}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon || null}
                  </a>
                </Col>
              );
            })
          ) : (
            <p>No social media links available.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default CandidateFilesAndSocialMedia;
