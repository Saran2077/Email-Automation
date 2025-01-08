import { Card, Row, Col } from "antd";

const { Meta } = Card;

function EmailStatsDashboard({ stats }) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Accepted" description={<div className="text-2xl font-bold">{stats.accepted}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Delivered" description={<div className="text-2xl font-bold">{stats.delivered}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Opened" description={<div className="text-2xl font-bold">{stats.opened}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Clicked" description={<div className="text-2xl font-bold">{stats.clicked}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Failed" description={<div className="text-2xl font-bold">{stats.failed}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Unsubscribed" description={<div className="text-2xl font-bold">{stats.unsubscribed}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Complained" description={<div className="text-2xl font-bold">{stats.complained}</div>} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Meta title="Stored" description={<div className="text-2xl font-bold">{stats.stored}</div>} />
        </Card>
      </Col>
    </Row>
  );
}

export default EmailStatsDashboard;
