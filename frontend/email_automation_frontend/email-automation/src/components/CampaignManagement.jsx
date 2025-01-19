import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { campaignAPI } from '../utils/apiLayer';
import { ArrowPathRoundedSquareIcon, EyeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import PromptTemplateEditor from './EmailComposer/PromptTemplateEditor';
import { useNavigate } from 'react-router-dom';

const CampaignManagement = () => {
  // State Management
  const  navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showPromptTemplate, setShowPromptTemplate] = useState(false);
  const [templatePayload, setTemplatePayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch Campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignAPI.list();
      if (response?.data?.campaigns) {
        setCampaigns(response.data.campaigns);
        setPagination(prev => ({ ...prev, total: response.data.campaigns.length }));
      }
    } catch (error) {
      message.error('Failed to fetch campaigns');
      console.error("FetchCampaign Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Template Handlers
  const handleGenerate = (campaign) => {
    setShowPromptTemplate(true);
    setTemplatePayload(campaign?.promptTemplate);
  };

  const handleTemplateUpdate = (templateData) => {
    try {
      const parsedTemplate = JSON.parse(templateData);
      setTemplatePayload(parsedTemplate);
      setShowPromptTemplate(false);
    } catch (error) {
      message.error('Invalid template format');
      console.error('Template parsing error:', error);
    }
  };

  // CRUD Operations
  const handleCreate = () => {
    setModalType('create');
    setSelectedCampaign(null);
    form.resetFields();
    setTemplatePayload(null);
    setIsModalVisible(true);
  };

  const handleEdit = (campaign) => {
    setModalType('edit');
    setSelectedCampaign(campaign);
    setTemplatePayload(campaign?.promptTemplate);
    form.setFieldsValue(campaign);
    setIsModalVisible(true);
  };

  const handleDelete = async (campaignId) => {
    try {
      await campaignAPI.delete(parseInt(campaignId));
      message.success('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      message.error('Failed to delete campaign');
      console.error('Delete campaign error:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const campaignData = {
        ...values,
        promptTemplate: templatePayload,
      };

      if (modalType === 'create') {
        await campaignAPI.create({ data: campaignData });
        message.success('Campaign created successfully');
      } else if (selectedCampaign) {
        await campaignAPI.update(selectedCampaign.campaignId, { data: campaignData });
        message.success('Campaign updated successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchCampaigns();
    } catch (error) {
      message.error('Please check the form fields');
      console.error('Form submission error:', error);
    }
  };

  // Table Configuration
  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Campaign Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-tag status-${status.toLowerCase()}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Recipients',
      key: 'recipients',
      render: (_, record) => (
        <span>{record.recipientsList?.length || 0}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete Campaign"
            description="Are you sure you want to delete this campaign?"
            onConfirm={() => handleDelete(record.campaignId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="text"
            icon={<EyeIcon className="h-4 w-4" />}
            onClick={() => navigate(`/campaign/${record.campaignId}`)}
          />
        </Space>
      ),
    },
  ];

  // Form Component
  const CampaignForm = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ recipients: [], individualRecipients: [] }}
    >
      <Form.Item
        name="name"
        label="Campaign Name"
        rules={[
          { required: true, message: 'Please enter campaign name' },
          { max: 100, message: 'Name too long' }
        ]}
      >
        <Input placeholder="Enter campaign name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: 'Please enter campaign description' },
          { max: 500, message: 'Description too long' }
        ]}
      >
        <Input.TextArea 
          rows={4} 
          placeholder="Enter campaign description"
        />
      </Form.Item>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowPromptTemplate(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            <SparklesIcon className="h-4 w-4" />
            <span>Generate Campaign Template with AI</span>
          </button>
        </div>
      </div>

            {/* Template Modal */}
            {showPromptTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="max-h-[90vh] w-[800px] overflow-y-auto bg-white rounded-lg shadow-xl">
            <PromptTemplateEditor
              onClose={() => setShowPromptTemplate(false)}
              onUpdateBody={handleTemplateUpdate}
              isBulkCampaign={true}
              initialTemplateData={templatePayload}
            />
          </div>
        </div>
      )}
    </Form>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Create Campaign
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="campaignId"
        pagination={pagination}
        onChange={(newPagination) => setPagination(newPagination)}
        loading={loading}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={modalType === 'create' ? 'Create Campaign' : 'Edit Campaign'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <CampaignForm />
      </Modal>
    </div>
  );
};

export default CampaignManagement;