import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Tag, Card, Space, Typography } from 'antd';
import { MessageOutlined, PlusOutlined, SearchOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { scrapAPI } from '../utils/apiLayer';

const { Text, Title } = Typography;
const { TextArea } = Input;

const FilterModal = ({ onApply, onClose, initialFilters = {}, visible = false, setCustomers }) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [filters, setFilters] = useState({
    country: [],
    state: [],
    city: [],
    foundedYear: [],
    practiceArea: []
  });

  const [inputValues, setInputValues] = useState({
    country: '',
    state: '',
    city: '',
    foundedYear: '',
    practiceArea: ''
  });

  useEffect(() => {
    setFilters({
      country: Array.isArray(initialFilters.country) ? initialFilters.country : [],
      state: Array.isArray(initialFilters.state) ? initialFilters.state : [],
      city: Array.isArray(initialFilters.city) ? initialFilters.city : [],
      foundedYear: Array.isArray(initialFilters.foundedYear) ? initialFilters.foundedYear : [],
      practiceArea: Array.isArray(initialFilters.practiceArea) ? initialFilters.practiceArea : []
    });
  }, [initialFilters]);

  const handleAddFilter = (type) => {
    if (inputValues[type].trim()) {
      setFilters(prev => ({
        ...prev,
        [type]: [...prev[type], inputValues[type].trim()]
      }));
      setInputValues(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  const handleRemoveFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  const handlePromptSubmit = async() => {
    setIsLoading(true);
    try {
      const response = await scrapAPI.fetchFilteredCustomers(promptInput);
      console.log("response", response);
      const newCampaignId = Object.values(response.reduce((acc, customer) => {
        const key = customer.name;
        if (!acc[key]) {
          acc[key] = {
            Name: customer.name,
            Description: customer.description,
            Primary_Industry: customer.primaryIndustry,
            Business_Models: customer.businessModels,
            Domain: customer.domain,
            LinkedIn_URL: customer.linkedInURL,
            // Annual_Revenue: customer.Annual_Revenue,
            Employee_List: []
          };
        }
        acc[key].Employee_List.push({
          designation: customer.employeeDesignation,
          id: customer.id,
          name: customer.employeeName,

          profileLinks: {profileLinks: customer?.employeeLinkedIn },
          shortBio: customer.short_bio,
          isKeyPeople: customer.employeeKeyPeople,
          isFoundingMember: customer.employeeFoundingMember,
        });
        return acc;
      }, {}))

      setCustomers({
        meta: {
          total_rows: 0,
        },
        data: newCampaignId
      })

      setIsPromptOpen(false);
      setPromptInput('');
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    onApply(filters);
  };

  const handleClearAll = () => {
    setFilters({
      country: [],
      state: [],
      city: [],
      foundedYear: [],
      practiceArea: []
    });
  };

  const getTagColor = (type) => {
    const colors = {
      country: 'blue',
      state: 'purple',
      city: 'green',
      foundedYear: 'orange',
      practiceArea: 'magenta'
    };
    return colors[type] || 'default';
  };

  const renderFilterSection = (type, label, inputType = "text", placeholder = `Enter ${label.toLowerCase()}`) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Text strong className="text-gray-700">{label}</Text>
      </div>
      <Space className="w-full">
        <Input
          type={inputType}
          value={inputValues[type]}
          onChange={(e) => setInputValues(prev => ({
            ...prev,
            [type]: e.target.value
          }))}
          placeholder={placeholder}
          className="flex-1 min-w-80"
        />
        <Button
          type="primary"
          onClick={() => handleAddFilter(type)}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </Space>
      <div className="mt-3 max-w-80">
        <Space wrap size={10}>
          {filters[type].map((value, index) => (
            <Tag
              key={index}
              color={getTagColor(type)}
              closable
              onClose={() => handleRemoveFilter(type, value)}
              className="mr-0 mb-2"
            >
              {value}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );

  const modalTitle = (
    <div className="flex items-center gap-2">
      <FilterOutlined />
      <Text strong>Filter Options</Text>
    </div>
  );

  return (
    <>
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={onClose}
        width={600}
        className="filter-modal"
        footer={[
          <Button 
            key="clear" 
            danger 
            onClick={handleClearAll}
            disabled={!Object.values(filters).some(arr => arr.length > 0)}
            icon={<CloseOutlined />}
          >
            Clear All
          </Button>,
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
            icon={<FilterOutlined />}
          >
            Apply Filters
          </Button>,
        ]}
      >
        <Card className="mt-4 relative">
          {renderFilterSection('country', 'Countries')}
          {renderFilterSection('state', 'States')}
          {renderFilterSection('city', 'Cities')}
          {renderFilterSection('foundedYear', 'Founded Years', 'number')}
          {renderFilterSection('practiceArea', 'Industrial Area')}
          <Button
            type="primary"
            shape="circle"
            icon={<MessageOutlined />}
            onClick={() => setIsPromptOpen(true)}
            className="absolute bottom-5 right-5"
            size="large"
            title="Use Prompt"
          />
        </Card>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined />
            <Text strong>Enter Your Filter Prompt</Text>
          </div>
        }
        open={isPromptOpen}
        onCancel={() => setIsPromptOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPromptOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handlePromptSubmit}
            icon={!isLoading  && <SearchOutlined />}
            loading={isLoading}
          >
            Apply Prompt
          </Button>,
        ]}
      >
        <TextArea
          placeholder="e.g., Show me companies in New York founded after 2010"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          rows={4}
        />
      </Modal>
    </>
  );
};

export default FilterModal;