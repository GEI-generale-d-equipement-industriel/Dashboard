import React from "react";
import { Card, Divider, Tag, Row, Col, Typography } from "antd";
import InfoItem from "./InfoItems";

const { Title } = Typography;



const DisplayMode = ({ candidate }) => {
  return (
    <div className="space-y-8">
      <Card className="shadow-sm" bordered>
        {/* Personal Information */}
        <div className="mb-6">
          <Title level={4} className="flex items-center mb-6">
            <span className="inline-block w-1 h-6 bg-blue-500 mr-3 rounded"></span>
            Informations Personnelles
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Prénom" value={candidate.firstName} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Nom" value={candidate.name} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Genre" value={candidate.gender} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem 
                label="Année de naissance" 
                value={candidate.birthDate ? candidate.birthDate.substring(0, 10) : candidate.birthYear}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Téléphone" value={candidate.phone} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Ville" value={candidate.town} />
            </Col>
          </Row>
        </div>

        <Divider className="my-6" />

        {/* Physical Attributes */}
        <div className="mb-6">
          <Title level={4} className="flex items-center mb-6">
            <span className="inline-block w-1 h-6 bg-blue-500 mr-3 rounded"></span>
            Caractéristiques Physiques
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Taille" value={`${candidate.height} m`} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Poids" value={`${candidate.weight} kg`} />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem 
                label="Couleur des yeux" 
                value={candidate.eyeColor && candidate.eyeColor.length ? (
                  <div className="flex flex-wrap gap-1">
                    {candidate.eyeColor.map((color, i) => (
                      <Tag key={i} color="blue">{color}</Tag>
                    ))}
                  </div>
                ) : "-"} 
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem 
                label="Couleur des cheveux" 
                value={candidate.hairColor && candidate.hairColor.length ? (
                  <div className="flex flex-wrap gap-1">
                    {candidate.hairColor.map((color, i) => (
                      <Tag key={i} color="blue">{color}</Tag>
                    ))}
                  </div>
                ) : "-"} 
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem 
                label="Type de cheveux" 
                value={candidate.hairType && candidate.hairType.length ? (
                  <div className="flex flex-wrap gap-1">
                    {candidate.hairType.map((type, i) => (
                      <Tag key={i} color="blue">{type}</Tag>
                    ))}
                  </div>
                ) : "-"} 
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem 
                label="Couleur de peau" 
                value={candidate.skinColor && candidate.skinColor.length ? (
                  <div className="flex flex-wrap gap-1">
                    {candidate.skinColor.map((color, i) => (
                      <Tag key={i} color="blue">{color}</Tag>
                    ))}
                  </div>
                ) : "-"} 
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <InfoItem label="Pilosité faciale" value={candidate.facialHair || "-"} />
            </Col>

            {/* Conditionally Render Based on Gender */}
            {candidate.gender === "Femme" && (
              <>
                <Col xs={24} md={12} lg={8}>
                  <InfoItem 
                    label="Voilée" 
                    value={candidate.veiled ? 
                      <Tag color="blue">Oui</Tag> : 
                      <Tag>Non</Tag>} 
                  />
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <InfoItem 
                    label="Enceinte" 
                    value={candidate.pregnant ? 
                      <Tag color="blue">Oui</Tag> : 
                      <Tag>Non</Tag>} 
                  />
                </Col>
              </>
            )}
          </Row>
        </div>

        <Divider className="my-6" />

        {/* Interests & Signs */}
        <div>
          <Title level={4} className="flex items-center mb-6">
            <span className="inline-block w-1 h-6 bg-blue-500 mr-3 rounded"></span>
            Intérêts et Signes Particuliers
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <InfoItem 
                label="Intérêts" 
                value={candidate.interest && candidate.interest.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.interest.map((item, index) => (
                      <Tag key={index} color="blue">{item}</Tag>
                    ))}
                  </div>
                ) : "-"}
              />
            </Col>
            
            <Col xs={24}>
              <InfoItem 
                label="Signes particuliers" 
                value={candidate.sign && candidate.sign.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.sign.map((sign, index) => (
                      <Tag key={index}>{sign}</Tag>
                    ))}
                  </div>
                ) : "-"}
              />
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default DisplayMode;