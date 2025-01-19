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
import { debounce } from 'lodash';

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
  const [recipientsPagination, setRecipientsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');

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

  const handleSearch = debounce((value) => {
    setSearchText(value);
    fetchAvailableRecipients(1, recipientsPagination.pageSize, value);
  }, 500);

  const fetchAvailableRecipients = async (page = 1, pageSize = 10, search = '') => {
    try {
      setRecipientsLoading(true);
      const response = await recipientAPI.list({
        page,
        limit: pageSize,
        search
      });
      
      if (response?.data) {
        setAvailableRecipients(response.data);
        setRecipientsPagination({
          current: response.pagination.page,
          pageSize,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        });
      } else {
        console.error('Unexpected API response structure:', response);
        message.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Fetch recipients error:', error);
      message.error('Failed to fetch recipients');
    } finally {
      setRecipientsLoading(false);
    }
  };

  // Handle modal visibility
  const showAddRecipientModal = () => {
    setAddRecipientModal(true);
    // Fetch recipients only when modal is opened
    fetchAvailableRecipients(1, recipientsPagination.pageSize);
  };

  const handleModalCancel = () => {
    setAddRecipientModal(false);
    setSelectedRecipientIds([]);
    setSearchText('');
  };

  // Add pagination handler
  const handleRecipientsTableChange = (pagination) => {
    fetchAvailableRecipients(pagination.current, pagination.pageSize, searchText);
  };

  useEffect(() => {
    fetchAvailableRecipients(1, recipientsPagination.pageSize);
  }, []);

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
      render: (text) => text || 'N/A'
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
      render: (text) => text || 'N/A'
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (text) => <Tag color="blue">{text}</Tag>
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
          <pre className="bg-gray-50 p-4 rounded max-h-[300px] overflow-auto whitespace-pre-wrap">
            {JSON.stringify(campaign?.promptTemplate, null, 2)}
          </pre>
        </div>
      </Card>

      {/* Recipients Section */}
      <Card 
        title="Recipients" 
        extra={
          campaign?.status === "Idle" && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={showAddRecipientModal}
            >
              Add Recipients
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

      {/* Add Recipients Modal */}
      <Modal
        title="Add Recipients"
        open={addRecipientModal}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={selectedRecipientIds.length === 0}
            onClick={handleAddSelectedRecipients}
          >
            Add Selected Recipients
          </Button>
        ]}
        width={800}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input.Search
            placeholder="Search recipients..."
            allowClear
            onSearch={handleSearch}
            style={{ marginBottom: 16 }}
          />

          <Table
            rowKey="_id"
            dataSource={availableRecipients}
            columns={availableRecipientColumns}
            rowSelection={{
              selectedRowKeys: selectedRecipientIds,
              onChange: (selectedRowKeys) => setSelectedRecipientIds(selectedRowKeys),
            }}
            pagination={{
              ...recipientsPagination,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
              pageSizeOptions: ['10', '20', '50']
            }}
            onChange={handleRecipientsTableChange}
            loading={recipientsLoading}
          />
        </Space>
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