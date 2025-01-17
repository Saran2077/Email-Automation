import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form, Input, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { campaignAPI } from '../utils/apiLayer';
import { ArrowPathRoundedSquareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import PromptTemplateEditor from './EmailComposer/PromptTemplateEditor';

// Sample campaign data
const initialCampaigns = [
  { 
    id: 1, 
    name: 'Summer Sale 2025',
    createdDate: '2025-01-01',
    description: 'Summer promotion campaign',
    recipients: ['group1', 'group3']
  },
  { 
    id: 2, 
    name: 'New Year Promotion',
    createdDate: '2025-01-10',
    description: 'New year special deals',
    recipients: ['group2']
  }
];

// Sample recipient groups data
const recipientGroups = [
  { value: 'group1', label: 'Premium Customers', count: 1200 },
  { value: 'group2', label: 'New Customers', count: 850 },
  { value: 'group3', label: 'Regular Customers', count: 3000 },
  { value: 'group4', label: 'VIP Members', count: 500 },
  { value: 'group5', label: 'Dormant Customers', count: 1500 }
];

// Sample individual recipients data
const individualRecipients = [
  { value: 'user1', label: 'John Doe (john@example.com)' },
  { value: 'user2', label: 'Jane Smith (jane@example.com)' },
  { value: 'user3', label: 'Bob Wilson (bob@example.com)' },
  { value: 'user4', label: 'Alice Brown (alice@example.com)' }
];

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showPromptTemplate, setShowPromptTemplate] = useState(false)
  const [templatePayload, setTemplatePayload] = useState(null)
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: initialCampaigns.length,
  });

  useEffect(() => {
    fetchCampaign();
  }, [])

  const fetchCampaign = async () => {
    try {
      const response = await campaignAPI.list();
      console.log("fetchCampaign", response?.data?.campaigns);
      setCampaigns(response?.data?.campaigns);
    } catch (error) {
      console.error("FetchCampaign", error);
    }
  }

  const handleGenerate = (campaign) => {
    setShowPromptTemplate(true);
    setTemplatePayload(campaign?.promptTemplate)
  }

  const handleTemplateUpdate = (templateData) => {
    const parsedTemplate = JSON.parse(templateData);
    console.log('template update', templateData)
    setTemplatePayload(parsedTemplate);
    setShowPromptTemplate(false);
  }

  // Table columns configuration
  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Campaign Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Recipients',
      key: 'recipients',
      render: (_, record) => (
        <span>
          {record.recipientsList?.length} 
        </span>
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
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="text"
            icon={<ArrowPathRoundedSquareIcon className='h-4 w-4' />}
            onClick={() => handleGenerate(record)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (campaign) => {
    setModalType('edit');
    setSelectedCampaign(campaign);
    form.setFieldsValue(campaign);
    setTemplatePayload(campaign?.promptTemplate)
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  const handleCreate = () => {
    setModalType('create');
    setSelectedCampaign(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields(); // Ensure validation is awaited
  
      if (modalType === 'create') {
        const newCampaign = {
          ...values,
          promptTemplate: templatePayload,
        };
  
        // Await API call for consistency
        const createdCampaign = await campaignAPI.create({ data: newCampaign});
  
        // Use the response from the API if applicable
        setCampaigns([...campaigns, createdCampaign]);
      } else if (modalType === 'edit' && selectedCampaign) {
        console.log('selectedCampaign', selectedCampaign, values)
        const updatedCampaign = {
          ...selectedCampaign,
          ...values,
        };
  
        // Optional: call an update API here if needed
        await campaignAPI.update(selectedCampaign?.campaignId, { data: updatedCampaign });
  
        setCampaigns(
          campaigns.map((campaign) =>
            campaign.id === selectedCampaign.id
              ? updatedCampaign
              : campaign
          )
        );
      }
  
      // Close modal
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error handling modal submission:", error);
    }
  };
  

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

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
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />

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

      {/* Create/Edit Modal */}
      <Modal
        title={modalType === 'create' ? 'Create Campaign' : 'Edit Campaign'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            recipients: [],
            individualRecipients: []
          }}
        >
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true, message: 'Please enter campaign name' }]}
          >
            <Input placeholder="Enter campaign name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter campaign description' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter campaign description"
            />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            {/* <h3 className="text-lg font-medium mb-4">Recipients</h3>

            <Form.Item
              name="individualRecipients"
              label="Individual Recipients"
              extra="Optionally add individual recipients"
            >
              <Select
                mode="multiple"
                placeholder="Search and select individual recipients"
                style={{ width: '100%' }}
                options={individualRecipients}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Form.Item> */}

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

            <div className="bg-blue-50 p-3 rounded-lg mt-4">
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const selectedGroups = getFieldValue('recipients') || [];
                  const selectedIndividuals = getFieldValue('individualRecipients') || [];
                  const totalRecipients = selectedGroups.reduce((acc, groupId) => {
                    const group = recipientGroups.find(g => g.value === groupId);
                    return acc + (group ? group.count : 0);
                  }, 0) + selectedIndividuals.length;

                  return (
                    <div className="text-sm text-blue-700">
                      <UserOutlined className="mr-2" />
                      Total Recipients: {totalRecipients.toLocaleString()}
                    </div>
                  );
                }}
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CampaignManagement;