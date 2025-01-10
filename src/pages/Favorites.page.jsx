import React from 'react'
import { Tabs } from 'antd';
import FavoriteCandidates from '../Modules/FavoritesCandidates/FavoritesCandidates.module';
import CampaignList from '../Modules/CampaignList/CampaignList.module';

const { TabPane } = Tabs;
const Favorites = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Tabs defaultActiveKey="favorites">
          <TabPane tab="Favorites" key="favorites">
            <FavoriteCandidates />
          </TabPane>

          <TabPane tab="Campaigns" key="campaigns">
            <CampaignList />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Favorites