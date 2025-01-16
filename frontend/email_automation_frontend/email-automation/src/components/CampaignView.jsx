import React, { useState } from 'react';
import { Button, Modal, Table, Form, Input, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

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
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: initialCampaigns.length,
  });

  // Table columns configuration
  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Recipients',
      key: 'recipients',
      render: (_, record) => (
        <span>
          {record.recipients?.length} group(s) selected
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
        </Space>
      ),
    },
  ];

  const handleEdit = (campaign) => {
    setModalType('edit');
    setSelectedCampaign(campaign);
    form.setFieldsValue(campaign);
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

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (modalType === 'create') {
        const newCampaign = {
          ...values,
          id: campaigns.length + 1,
          createdDate: new Date().toISOString().split('T')[0],
        };
        setCampaigns([...campaigns, newCampaign]);
      } else {
        setCampaigns(campaigns.map(campaign =>
          campaign.id === selectedCampaign.id
            ? { ...campaign, ...values }
            : campaign
        ));
      }
      setIsModalVisible(false);
    });
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
            <h3 className="text-lg font-medium mb-4">Recipients</h3>
            
            {/* <Form.Item
              name="recipients"
              label="Recipient Groups"
              extra="Select one or more recipient groups"
            >
              <Select
                mode="multiple"
                placeholder="Select recipient groups"
                style={{ width: '100%' }}
                options={recipientGroups.map(group => ({
                  value: group.value,
                  label: (
                    <div className="flex justify-between">
                      <span>{group.label}</span>
                      <span className="text-gray-500">({group.count} recipients)</span>
                    </div>
                  )
                }))}
              />
            </Form.Item> */}

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
            </Form.Item>

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