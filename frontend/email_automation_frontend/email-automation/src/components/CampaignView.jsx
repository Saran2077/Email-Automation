import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Card, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  message,
  Popconfirm,
  Drawer
} from 'antd';
import { 
  UserAddOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  SendOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI, promptAPI, recipientAPI } from '../utils/apiLayer';
import { IconButton } from '@mui/material';
import { EyeIcon } from 'lucide-react';

const CampaignView = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [addRecipientModal, setAddRecipientModal] = useState(false);
  const [emailPreviewDrawer, setEmailPreviewDrawer] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [form] = Form.useForm();

  // Fetch campaign details
  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await campaignAPI.get(campaignId);
      setCampaign(response?.data);
      setRecipients(response?.data?.recipientsList || []);
      setGeneratedEmails(response?.data?.generatedEmails || []);
    } catch (error) {
      message.error('Failed to fetch campaign details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRecipients = async () => {
    try {
      setRecipientsLoading(true);
      const response = await recipientAPI.list();
      setAvailableRecipients(response.recipients);
    } catch (error) {
      message.error('Failed to fetch recipients');
    } finally {
      setRecipientsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRecipients()
  }, [])

  const handleAddSelectedRecipients = async () => {
    try {
      await campaignAPI.add(campaignId, { recipientIds: selectedRecipientIds });
      message.success('Recipients added successfully');
      fetchCampaign();
      setAddRecipientModal(false);
      setSelectedRecipientIds([]);
    } catch (error) {
      message.error('Failed to add recipients');
    }
  };

  const availableRecipientColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedRecipientIds,
    onChange: (selectedRowKeys) => {
      setSelectedRecipientIds(selectedRowKeys);
    },
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  // Handle recipient management
  const handleAddRecipient = async (values) => {
    try {
      await campaignAPI.addRecipient(campaignId, values);
      message.success('Recipient added successfully');
      fetchCampaign();
      setAddRecipientModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add recipient');
    }
  };

  const handleRemoveRecipient = async (recipientId) => {
    try {
      await campaignAPI.removeRecipient(campaignId, { recipientIds: [recipientId] });
      message.success('Recipient removed successfully');
      fetchCampaign();
    } catch (error) {
        console.error(error)
      message.error('Failed to remove recipient');
    }
  };

  // Handle email generation
  const handleGenerateEmails = async () => {
    try {
      setLoading(true);
      const response = await campaignAPI.generateEmails(campaignId);
      setCampaign(prev => ({ ...prev, status: 'Running' }));
      message.success('Emails generated successfully');
    } catch (error) {
      message.error('Failed to generate emails');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateEmail = async (recipientEmail) => {
    try {
      const response = await campaignAPI.regenerate(campaignId, recipientEmail);
      setGeneratedEmails(prev => prev.map(email => 
        email.email === recipientEmail ? {...email, ...response.data} : email
      ));
      message.success('Email Generation started');
    } catch (error) {
      message.error('Failed to regenerate email');
    }
  };

  const handleSendAllEmails = async () => {
    try {
      await campaignAPI.sendEmails(campaignId);
      setCampaign(prev => ({ ...prev, status: 'Sending' }));
      message.success('Started sending emails');
    } catch (error) {
      message.error('Failed to send emails');
    }
  };

  // Table columns for recipients
  const recipientColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>

            {campaign?.status === "Idle" && <Popconfirm
              title="Remove recipient?"
              onConfirm={() => handleRemoveRecipient(record._id)}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>}

            <IconButton
                onClick={() => navigate(`/contactView/${record.recipientId}`)}
              ><EyeIcon size={20} /></IconButton>

        </Space>
      ),
    },
  ];

  const emailColumns = [
    {
      title: 'Recipient',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: 'Generated At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            onClick={() => {
              setSelectedEmail(record);
              setEmailPreviewDrawer(true);
            }}
          >
            Preview
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => handleRegenerateEmail(record?.email)}
          >
            Regenerate
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/campaign')}
          >
            Back to Campaigns
          </Button>
          <h1 className="text-2xl font-bold m-0">
            {campaign?.name}
          </h1>
          <Tag color={
            campaign?.status === 'Ready' ? 'green' : 
            campaign?.status === 'Sending' ? 'blue' :
            'default'
          }>
            {campaign?.status}
          </Tag>
        </Space>

        {campaign?.status === 'Idle' && (
          <Button
            type="primary"
            onClick={handleGenerateEmails}
          >
            Generate Emails
          </Button>
        )}
        
        {campaign?.status === 'Ready' && (
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendAllEmails}
          >
            Send All Emails
          </Button>
        )}
      </div>

      {/* Campaign Details */}
      <Card className="mb-6">
        <p className="text-gray-600">{campaign?.description}</p>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Template Information</h3>
          <pre className="bg-gray-50 p-4 rounded">
            {JSON.stringify(campaign?.promptTemplate, null, 2)}
          </pre>
        </div>
      </Card>

      {/* Recipients Section */}
      <Card 
        title="Recipients" 
        extra={
          campaign?.status === 'Idle' && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAddRecipientModal(true)}
            >
              Add Recipient
            </Button>
          )
        }
        className="mb-6"
      >
        <Table
          columns={recipientColumns}
          dataSource={recipients}
          rowKey="_id"
          loading={loading}
        />
      </Card>

      {/* Generated Emails Section */}
      {campaign?.status !== 'Idle' && (
        <Card 
          title="Generated Emails"
        >
          <Table
            columns={emailColumns}
            dataSource={generatedEmails}
            rowKey="recipientId"
            loading={loading}
          />
        </Card>
      )}

      {/* Add Recipient Modal */}
      {/* <Modal
        title="Add Recipient"
        open={addRecipientModal}
        onOk={form.submit}
        onCancel={() => {
          setAddRecipientModal(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddRecipient}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal> */}

<Modal
        title="Add Recipients"
        open={addRecipientModal}
        onOk={handleAddSelectedRecipients}
        onCancel={() => {
          setAddRecipientModal(false);
          setSelectedRecipientIds([]);
        }}
        width={800}
        okText="Add Selected Recipients"
        okButtonProps={{ disabled: selectedRecipientIds.length === 0 }}
      >
        <div className="mb-4">
          <Button 
            type="primary" 
            onClick={fetchAvailableRecipients}
            loading={recipientsLoading}
          >
            Refresh Recipients List
          </Button>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={availableRecipientColumns}
          dataSource={availableRecipients}
          rowKey="_id"
          loading={recipientsLoading}
          scroll={{ y: 400 }}
        />
      </Modal>

      {/* Email Preview Drawer */}
      <Drawer
        title="Email Preview"
        placement="right"
        width={600}
        open={emailPreviewDrawer}
        onClose={() => {
          setEmailPreviewDrawer(false);
          setSelectedEmail(null);
        }}
      >
        {selectedEmail && (
          <div>
            <div className="mb-4">
              <h3 className="font-medium">To: {selectedEmail?.name}</h3>
              <p className="text-gray-600">{selectedEmail?.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Subject</h3>
              <p>{selectedEmail?.subject}</p>
            </div>
            <div>
              <h3 className="font-medium">Body</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedEmail?.body }}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CampaignView;