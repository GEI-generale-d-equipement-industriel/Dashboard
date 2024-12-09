import React from 'react';
import { Row, Col, Form, Select, Input, Checkbox, Tag, Collapse } from 'antd';
import {
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  ScissorOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import {
  eyeColors,
  hairColors,
  towns,
  interests,
  sexes,
  facialHairOptions,
} from '../../Modules/CandidatesModules/options';
import BmiIndicator from '../BmiIndicateur';

const { Panel } = Collapse;

const CandidateDetailsForm = ({ candidate, isEditing, form, bmi }) => {
  // Get gender value from form
  const gender = form.getFieldValue('gender');

  return (
    <Form form={form} initialValues={candidate} layout="vertical">
      <Collapse defaultActiveKey={['1']} accordion>
        {/* Basic Information Section */}
        <Panel header="Basic Information" key="1">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Gender" name="gender">
                {isEditing ? (
                  <Select>
                    {sexes.map((genderOption) => (
                      <Select.Option key={genderOption} value={genderOption}>
                        {genderOption}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <div className="flex items-center">
                    {candidate.gender?.toLowerCase() === 'femme' ? (
                      <WomanOutlined className="text-pink-500 mr-2 text-lg" />
                    ) : (
                      <ManOutlined className="text-blue-500 mr-2 text-lg" />
                    )}
                    <span style={{ marginLeft: '8px' }}>{candidate.gender}</span>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Birth Year" name="birthYear">
                {isEditing ? (
                  <Input />
                ) : (
                  <div className="flex items-center">
                    <CalendarOutlined className="text-yellow-500 mr-2 text-lg" />
                    <span>{candidate.birthYear}</span>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* Physical Attributes Section */}
        <Panel header="Physical Attributes" key="2">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Height" name="height">
                {isEditing ? (
                  <Input />
                ) : (
                  <div className="flex items-center">
                    <UserOutlined className="text-green-500 mr-2 text-lg" />
                    <span>{candidate.height} m</span>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Weight" name="weight">
                {isEditing ? (
                  <Input />
                ) : (
                  <div className="flex items-center">
                    <UserOutlined className="text-purple-500 mr-2 text-lg" />
                    <span>{candidate.weight} kg</span>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Eye Color" name="eyeColor">
                {isEditing ? (
                  <Select>
                    {eyeColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <div className="flex items-center">
                    <EyeOutlined className="text-teal-500 mr-2 text-lg" />
                    <span>{candidate.eyeColor}</span>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Hair Color" name="hairColor">
                {isEditing ? (
                  <Select>
                    {hairColors.map((color) => (
                      <Select.Option key={color} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <div className="flex items-center">
                    <ScissorOutlined className="text-pink-500 mr-2 text-lg" />
                    <span>{candidate.hairColor}</span>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="BMI">
                <div className="flex items-center">
                  <DashboardOutlined className="text-yellow-500 mr-2 text-lg" />
                  <BmiIndicator bmi={bmi} display={true} />
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {/* Additional Details Section */}
        <Panel header="Additional Details" key="3">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Interests" name="interest">
                {isEditing ? (
                  <Select mode="multiple">
                    {interests.map((interest) => (
                      <Select.Option key={interest} value={interest}>
                        {interest}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidate.interest &&
                      candidate.interest
                        .flatMap((interest) => interest.split(','))
                        .map((interest, index) => (
                          <Tag key={index} color="blue">
                            {interest.trim()}
                          </Tag>
                        ))}
                  </div>
                )}
              </Form.Item>
            </Col>
            {gender === 'Homme' && (
              <Col xs={24} sm={12}>
                <Form.Item label="Facial Hair" name="facialHair">
                  {isEditing ? (
                    <Select>
                      {facialHairOptions.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <span>{candidate.facialHair}</span>
                  )}
                </Form.Item>
              </Col>
            )}
            {gender === 'Femme' && (
              <>
                <Col xs={24} sm={12}>
                  <Form.Item label="Veiled" name="veiled" valuePropName="checked">
                    {isEditing ? (
                      <Checkbox>Yes</Checkbox>
                    ) : (
                      <span>{candidate.veiled ? 'Yes' : 'No'}</span>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Pregnant" name="pregnant" valuePropName="checked">
                    {isEditing ? (
                      <Checkbox>Yes</Checkbox>
                    ) : (
                      <span>{candidate.pregnant ? 'Yes' : 'No'}</span>
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col xs={24} sm={12}>
              <Form.Item label="Town" name="town">
                {isEditing ? (
                  <Select>
                    {towns.map((town) => (
                      <Select.Option key={town} value={town}>
                        {town}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <span>{candidate.town}</span>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Form>
  );
};

export default CandidateDetailsForm;
