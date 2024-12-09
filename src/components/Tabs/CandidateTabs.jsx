import React from 'react';
import { Tabs } from 'antd';
import CandidateDetailsForm from '../Forms/CandidateDetailsForm';
import CandidateFilesAndSocialMedia from '../../Modules/CandidatesModules/CandidateFileAndSocialMedia';

const { TabPane } = Tabs;

const CandidateTabs = ({ candidate, isEditing, form, bmi }) => {
  return (
    <Tabs defaultActiveKey="1">
      {/* Details & Interests Tab */}
      <TabPane tab="Details & Interests" key="1">
        <CandidateDetailsForm
          candidate={candidate}
          isEditing={isEditing}
          form={form} // Pass form to CandidateDetailsForm
          bmi={bmi}
        />
      </TabPane>

      {/* Files & Social Media Tab */}
      <TabPane tab="Files & Social Media" key="2">
        <CandidateFilesAndSocialMedia candidate={candidate} />
      </TabPane>
    </Tabs>
  );
};

export default CandidateTabs;
