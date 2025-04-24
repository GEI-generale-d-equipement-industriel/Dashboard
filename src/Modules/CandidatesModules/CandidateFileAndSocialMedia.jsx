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
    <div className="w-full">
      {/* Files Section */}
      <div className="mb-8">
        <Title level={4} className="mb-4">
          Files
        </Title>

        {/* Video Slider */}
        {videoFiles && videoFiles.length > 0 && (
          <div className="relative mb-6">
            <Carousel
              ref={carouselRef}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            >
              {videoFiles.map((file, index) => (
                <div key={index} className="text-center">
                  <video
                    controls
                    tabIndex="-1"
                    className="w-full max-h-[260px] object-contain rounded-lg"
                  >
                    <source src={file.filename} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              ))}
            </Carousel>

            {/* Navigation Buttons */}
            <Button
              icon={<LeftOutlined />}
              onClick={() => carouselRef.current.prev()}
              className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            />
            <Button
              icon={<RightOutlined />}
              onClick={() => carouselRef.current.next()}
              className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            />
          </div>
        )}

        {/* Audio Files */}
        {combinedAudioFiles && combinedAudioFiles.length > 0 && (
          <div>
            <Row gutter={[16, 16]}>
              {combinedAudioFiles.map((file, index) => (
                <Col key={index} xs={24} sm={12}>
                  <div className="mb-4">
                    <div className="font-bold mb-2">
                      <a
                        href={file.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Audio File
                      </a>
                    </div>
                    <audio controls className="w-full">
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
          <p className="text-gray-500 text-center py-4">
            No audio or video files available for this candidate.
          </p>
        )}
      </div>

      <Divider />

      {/* Social Media Section */}
      <div className="mt-8">
        <Title level={4} className="mb-4">
          Social Media
        </Title>
        <Row
          justify="center"
          gutter={[16, 16]}
          className="flex-wrap text-center"
        >
          {socialMediaLinks.length > 0 ? (
            socialMediaLinks.map((link, index) => {
              const socialMediaIcons = {
                facebook: (
                  <FacebookOutlined className="text-3xl text-[#3b5998] hover:opacity-80 transition-opacity" />
                ),
                twitter: (
                  <TwitterOutlined className="text-3xl text-[#1DA1F2] hover:opacity-80 transition-opacity" />
                ),
                instagram: (
                  <InstagramOutlined className="text-3xl text-[#C13584] hover:opacity-80 transition-opacity" />
                ),
                linkedin: (
                  <LinkedinOutlined className="text-3xl text-[#0077B5] hover:opacity-80 transition-opacity" />
                ),
                tiktok: (
                  <TikTokOutlined className="text-3xl text-black hover:opacity-80 transition-opacity" />
                ),
              };

              const icon = socialMediaIcons[link?.type?.toLowerCase()];
              return (
                <Col key={index} xs={6} sm={4}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {icon || null}
                  </a>
                </Col>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">
              No social media links available.
            </p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default CandidateFilesAndSocialMedia;
