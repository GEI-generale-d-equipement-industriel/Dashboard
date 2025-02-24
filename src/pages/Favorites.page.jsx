import React from 'react'
import { Tabs } from 'antd';
import FavoriteCandidates from '../Modules/FavoritesCandidates/FavoritesCandidates.module';
import CampaignList from '../Modules/CampaignList/CampaignList.module';

const { TabPane } = Tabs;
const Favorites = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Tabs defaultActiveKey="collections">
        <TabPane tab="Collections" key="collections">
            <CampaignList />
          </TabPane>
          <TabPane tab="Favorites" key="favorites">
            <FavoriteCandidates />
          </TabPane>

          
        </Tabs>
      </div>
    </div>
  )
}

export default Favorites