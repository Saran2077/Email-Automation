import React, { useState } from 'react';
import { Button, Modal, Input, Table, Card, Pagination, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

// Dummy data for email lists
const initialData = [
  {
    id: 1,
    name: 'Newsletter Subscribers',
    description: 'Main newsletter subscription list',
    emailCount: 1250,
    createdDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Product Updates',
    description: 'Users interested in product updates',
    emailCount: 850,
    createdDate: '2024-01-14',
  },
  // Add more dummy data as needed
];

const EmailMarketingPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emailLists, setEmailLists] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  // Table columns configuration
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Emails',
      dataIndex: 'emailCount',
      key: 'emailCount',
      sorter: (a, b) => a.emailCount - b.emailCount,
    },
    {
      title: 'Created',
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
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
            className="text-blue-600 hover:text-blue-700"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="text-red-600 hover:text-red-700"
          />
        </Space>
      ),
    },
  ];

  // Handler functions
  const handleModalOk = () => {
    if (!form.name.trim()) {
      message.error('Email list name is required');
      return;
    }

    if (editingId) {
      setEmailLists(prev =>
        prev.map(item =>
          item.id === editingId
            ? { ...item, name: form.name, description: form.description }
            : item
        )
      );
    } else {
      const newList = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        emailCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
      };
      setEmailLists(prev => [...prev, newList]);
    }

    handleModalCancel();
    message.success(`Email list ${editingId ? 'updated' : 'created'} successfully`);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setForm({ name: '', description: '' });
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setForm({ name: record.name, description: record.description });
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setEmailLists(prev => prev.filter(item => item.id !== id));
    message.success('Email list deleted successfully');
  };

  // Filter email lists based on search text
  const filteredLists = emailLists.filter(list =>
    list.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Input.Search
          placeholder="Search email lists..."
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
          prefix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          className="bg-blue-600"
        >
          Create Email List
        </Button>
      </div>

      {/* Responsive Layout */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={filteredLists}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: filteredLists.length,
            onChange: setCurrentPage,
          }}
          rowKey="id"
        />
      </div>

      <div className="md:hidden space-y-4">
        {filteredLists
          .slice((currentPage - 1) * 10, currentPage * 10)
          .map(list => (
            <Card key={list.id} className="w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{list.name}</h3>
                  <p className="text-gray-600">{list.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Emails: {list.emailCount}</p>
                    <p>Created: {list.createdDate}</p>
                  </div>
                </div>
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(list)}
                    className="text-blue-600"
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(list.id)}
                    className="text-red-600"
                  />
                </Space>
              </div>
            </Card>
          ))}
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={filteredLists.length}
            onChange={setCurrentPage}
          />
        </div>
      </div>

      <Modal
        title={editingId ? "Edit Email List" : "Create New Email List"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingId ? "Save Changes" : "Create"}
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              List Name *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter list name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input.TextArea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
            />
          </div>
          {editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Emails
              </label>
              <Input
                value={emailLists.find(list => list.id === editingId)?.emailCount || 0}
                disabled
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default EmailMarketingPage;