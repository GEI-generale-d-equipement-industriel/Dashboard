import React from 'react';
import { Row, Col, Form, Select, Input,  Typography } from 'antd';
import {
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  UserOutlined,
  
  PhoneOutlined,
  EnvironmentOutlined,
  BgColorsOutlined,
  SkinOutlined,
} from '@ant-design/icons';


const { Title } = Typography;

const CandidateDetailsForm = ({ candidate, isEditing, form, bmi, role }) => {
 


  // Allow editing only if the role is 'admin'
  const canEdit = role === 'admin' && isEditing;
  const formattedHeight = parseFloat(candidate.height).toFixed(2); // Two decimal places
  const formattedWeight = parseFloat(candidate.weight).toFixed(); // One decimal place

  
  return (
    <div style={{ padding: '12px' }}>
      <Form
        form={form}
        initialValues={candidate}
        layout="vertical"
        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ marginBottom: '2px', color: '#5A6650' }}>
            {candidate.firstName} {candidate.name}
          </Title>
        </div>

        {/* Basic Information Section */}
        <div>
          <Title level={4}>Basic Information</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Gender:</strong>{' '}
                  {canEdit ? (
                    <Select>
                      <Select.Option value="Homme">Homme</Select.Option>
                      <Select.Option value="Femme">Femme</Select.Option>
                    </Select>
                  ) : (
                    <>
                      {candidate.gender?.toLowerCase() === 'femme' ? (
                        <WomanOutlined style={{ color: '#ff85c0', marginRight: '8px' }} />
                      ) : (
                        <ManOutlined style={{ color: '#69c0ff', marginRight: '8px' }} />
                      )}
                      {candidate.gender}
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Birth Year:</strong>{' '}
                  {canEdit ? (
                    <Input />
                  ) : (
                    <>
                      <CalendarOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                      {candidate.birthYear}
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Phone:</strong>{' '}
                  {canEdit ? (
                    <Input />
                  ) : (
                    <>
                      <PhoneOutlined style={{ color: '#13c2c2', marginRight: '8px' }} />
                      {candidate.phone}
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Town:</strong>{' '}
                  {canEdit ? (
                    <Input />
                  ) : (
                    <>
                      <EnvironmentOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      {candidate.town}
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Physical Attributes Section */}
        <div>
          <Title level={4}>Physical Attributes</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Height:</strong>{' '}
                  {canEdit ? (
                    <Input />
                  ) : (
                    <>
                      <UserOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      {formattedHeight} m
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Weight:</strong>{' '}
                  {canEdit ? (
                    <Input />
                  ) : (
                    <>
                      <UserOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                      {formattedWeight} kg
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Skin Color:</strong>{' '}
                  {canEdit ? (
                    <Select>
                      <Select.Option value="fair">Fair</Select.Option>
                      <Select.Option value="medium">Medium</Select.Option>
                    </Select>
                  ) : (
                    <>
                      <SkinOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                      {candidate.skinColor?.[0]}
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <span>
                  <strong>Hair Type:</strong>{' '}
                  {canEdit ? (
                    <Select>
                      <Select.Option value="straight">Straight</Select.Option>
                      <Select.Option value="curly">Curly</Select.Option>
                    </Select>
                  ) : (
                    <>
                      <BgColorsOutlined style={{ color: '#ff7a45', marginRight: '8px' }} />
                      {candidate.hairType?.[0]}
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default CandidateDetailsForm;
