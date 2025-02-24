// src/components/CandidateMedia.jsx
import React from "react";
import { Card, Tabs } from "antd";

const { TabPane } = Tabs;

export default function CandidateMedia({ videos, audioFiles }) {
  return (
    <Card title="Media" className="mb-6">
      <Tabs defaultActiveKey="videos">
        {videos.length>0 &&
        (<TabPane tab="Videos" key="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {videos.map((video, index) => (
              <div key={index} className="aspect-video">
                <video
                  controls
                  poster={video.thumbnail}
                  className="w-full h-full object-cover rounded-md"
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </TabPane>)}
        {audioFiles.length>0 &&
        (<TabPane tab="Audio" key="audio">
          <div className="space-y-4 mt-4">
            {audioFiles.map((audio, index) => (
              <div key={index}>
                <p className="font-medium mb-2">{audio.title}</p>
                <audio controls className="w-full">
                  <source src={audio.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </TabPane>)}
      </Tabs>
    </Card>
  );
}
