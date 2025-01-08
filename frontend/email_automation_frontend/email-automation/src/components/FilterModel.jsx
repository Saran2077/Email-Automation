import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FilterModal = ({ onApply, onClose, initialFilters = {} }) => {
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
    const filterKey = type; 
    if (inputValues[type].trim()) {
      setFilters(prev => {
        const newFilters = Array.isArray(prev[filterKey]) ? [...prev[filterKey], inputValues[type].trim()] : [inputValues[type].trim()];
        return {
          ...prev,
          [filterKey]: newFilters
        };
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  const handleClearAll = () => {
    setFilters({
      country: [],
      state: [],
      city: [],
      foundedYear: []
    });
  };

  const renderFilterSection = (type, label, inputType = "text", placeholder = `Enter ${label.toLowerCase()}`) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type={inputType}
          value={inputValues[type]}
          onChange={(e) => setInputValues(prev => ({
            ...prev, 
            [type]: e.target.value
          }))}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => handleAddFilter(type)}
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {filters[type].map((value, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {value}
            <button
              type="button"
              onClick={() => handleRemoveFilter(type, value)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Filter Options</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {renderFilterSection('country', 'Countries')}
            {renderFilterSection('state', 'States')}
            {renderFilterSection('city', 'Cities')}
            {renderFilterSection('foundedYear', 'Founded Years', 'number', 'Enter founded year')}
            {renderFilterSection('practiceArea', 'Industrial Area')}
          </div>

          <div className="mt-6 flex justify-between">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                Clear All Filters
              </button>
            )}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;