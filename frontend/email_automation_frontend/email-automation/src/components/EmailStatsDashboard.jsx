// import { Card, Row, Col } from "antd";
// import { CheckCircleOutlined, MailOutlined, EyeOutlined, LinkOutlined, CloseCircleOutlined, LogoutOutlined, WarningOutlined, DatabaseOutlined } from "@ant-design/icons";

// const { Meta } = Card;

// function EmailStatsDashboard({ stats }) {
//   const cardData = [
//     { title: "Accepted", value: stats.accepted, icon: <CheckCircleOutlined />, color: "#28a745" },
//     { title: "Delivered", value: stats.delivered, icon: <MailOutlined />, color: "#17a2b8" },
//     { title: "Opened", value: stats.opened, icon: <EyeOutlined />, color: "#ffc107" },
//     { title: "Clicked", value: stats.clicked, icon: <LinkOutlined />, color: "#ff5722" },
//     { title: "Failed", value: stats.failed, icon: <CloseCircleOutlined />, color: "#dc3545" },
//     { title: "Unsubscribed", value: stats.unsubscribed, icon: <LogoutOutlined />, color: "#6c757d" },
//     { title: "Complained", value: stats.complained, icon: <WarningOutlined />, color: "#6f42c1" },
//     { title: "Stored", value: stats.stored, icon: <DatabaseOutlined />, color: "#007bff" },
//   ];

//   return (
//     <Row gutter={[16, 16]}>
//       {cardData.map(({ title, value, icon, color }) => (
//         <Col xs={24} sm={12} lg={6} key={title}>
//           <Card
//             style={{
//               border: `1px solid ${color}`,
//               borderRadius: "8px",
//               backgroundColor: "#f9f9f9",
//             }}
//             bodyStyle={{
//               padding: "20px",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <div style={{ fontSize: "32px", color, marginRight: "16px" }}>{icon}</div>
//             <Meta
//               title={<div style={{ fontSize: "16px", color: "#333", fontWeight: "600" }}>{title}</div>}
//               description={
//                 <div style={{ fontSize: "24px", fontWeight: "700", color: "#555" }}>{value}</div>
//               }
//             />
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// }

// export default EmailStatsDashboard;


'use client'

import { Card, Row, Col } from "antd";
import { 
  CheckCircleOutlined, 
  MailOutlined, 
  EyeOutlined, 
  LinkOutlined, 
  CloseCircleOutlined, 
  LogoutOutlined, 
  WarningOutlined, 
  DatabaseOutlined 
} from "@ant-design/icons";

const { Meta } = Card;


export default function EmailStatsDashboard({ stats }) {
  const cardData = [
    { title: "Accepted", value: stats.accepted, icon: <CheckCircleOutlined />, color: "text-green-500", bgColor: "bg-green-50" },
    { title: "Delivered", value: stats.delivered, icon: <MailOutlined />, color: "text-blue-500", bgColor: "bg-blue-50" },
    { title: "Opened", value: stats.opened, icon: <EyeOutlined />, color: "text-yellow-500", bgColor: "bg-yellow-50" },
    { title: "Clicked", value: stats.clicked, icon: <LinkOutlined />, color: "text-orange-500", bgColor: "bg-orange-50" },
    { title: "Failed", value: stats.failed, icon: <CloseCircleOutlined />, color: "text-red-500", bgColor: "bg-red-50" },
    { title: "Unsubscribed", value: stats.unsubscribed, icon: <LogoutOutlined />, color: "text-gray-500", bgColor: "bg-gray-50" },
    { title: "Complained", value: stats.complained, icon: <WarningOutlined />, color: "text-purple-500", bgColor: "bg-purple-50" },
    { title: "Stored", value: stats.stored, icon: <DatabaseOutlined />, color: "text-indigo-500", bgColor: "bg-indigo-50" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Email Statistics</h2>
      <Row gutter={[16, 16]}>
        {cardData.map(({ title, value, icon, color, bgColor }) => (
          <Col xs={24} sm={12} lg={6} key={title}>
            <Card
              className={`rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${bgColor}`}
              bodyStyle={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="flex items-center">
                <div className={`text-3xl ${color} mr-4`}>{icon}</div>
                <div>
                  <div className="text-sm font-medium text-gray-500">{title}</div>
                  <div className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

