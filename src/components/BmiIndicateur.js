// BmiIndicateur.js

import React from 'react';
import { Tag, Progress, Tooltip } from 'antd';
import { SmileOutlined, FrownOutlined, MehOutlined } from '@ant-design/icons';

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return { category: 'Maigreur', color: 'blue', icon: <FrownOutlined /> };
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return { category: 'Normal', color: 'green', icon: <SmileOutlined /> };
  } else if (bmi >= 25 && bmi <= 29.9) {
    return { category: 'Surpoids', color: 'orange', icon: <MehOutlined /> };
  } else if (bmi >= 30 && bmi <= 39.9) {
    return { category: 'Obésité', color: 'red', icon: <FrownOutlined /> };
  } else {
    return { category: 'Obésité massive', color: 'magenta', icon: <FrownOutlined /> };
  }
}

export default function BmiIndicateur({ bmi,display }) {

  
  const { category, color, icon } = getBMICategory(bmi);

  const getProgressStatus = () => {
    if (bmi < 18.5) {
      return 'normal';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'success';
    } else if (bmi >= 25 && bmi <= 29.9) {
      return 'exception';
    } else {
      return 'exception';
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Tooltip title={`IMC: ${bmi.toFixed(1)}`}>
        <Tag color={color} style={{ fontSize: '14px', padding: '5px 5px' }}>
          {icon} {category}
        </Tag>
      </Tooltip>
      {display &&<Progress
        percent={Math.min((bmi / 40) * 100, 100)}
        status={getProgressStatus()}
        showInfo={false}
        strokeColor={color}
        style={{ marginTop: '10px' }}
      />}
    </div>
  );
}
