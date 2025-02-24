import React from 'react';
import { Tooltip, Tag } from 'antd';
import { SmileOutlined, FrownOutlined, MehOutlined } from '@ant-design/icons';

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      category: 'Maigreur',
      color: 'bg-blue-500',
      icon: <FrownOutlined className="text-white text-lg font-extrabold w-4 h-4" />,
    };
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return {
      category: 'Normal',
      color: 'bg-green-500',
      icon: <SmileOutlined className="text-white text-lg font-extrabold w-4 h-4" />,
    };
  } else if (bmi >= 25 && bmi <= 29.9) {
    return {
      category: 'Surpoids',
      color: 'bg-yellow-500',
      icon: <MehOutlined className="text-white text-lg font-extrabold w-4 h-4" />,
    };
  } else if (bmi >= 30 && bmi <= 39.9) {
    return {
      category: 'Obésité',
      color: 'bg-orange-500',
      icon: <FrownOutlined className="text-white text-lg font-extrabold w-4 h-4" />,
    };
  } else {
    return {
      category: 'Obésité massive',
      color: 'bg-red-700 ',
      icon: <FrownOutlined className="text-white text-lg font-extrabold w-4 h-4 " />,
    };
  }
}

export default function BmiIndicateur({ bmi }) {
  const { category, color, icon } = getBMICategory(bmi);

  return (
    <div className="flex flex-col items-center">
      <Tooltip title={`IMC: ${bmi.toFixed(1)}`}>
        <Tag
          className={`flex items-center gap-2 px-3 py-1 rounded-2xl font-semibold text-white ${color} cursor-pointer hover:opacity-90`}
        >
          {icon}
          <span>{category}</span>
        </Tag>
      </Tooltip>
    </div>
  );
}
