import { PromptTemplate } from '../models/PromptTemplate.js';

class PromptTemplateRepository {
  // Create a new prompt template
  async create(templateData) {
    try {
      const template = new PromptTemplate(templateData);
      return await template.save();
    } catch (error) {
      throw new Error(`Error creating prompt template: ${error.message}`);
    }
  }

  // Get a template by ID
  async getById(promptTemplateId) {
    try {
      return await PromptTemplate.findOne({ promptTemplateId });
    } catch (error) {
      throw new Error(`Error fetching prompt template: ${error.message}`);
    }
  }


  async getByEmail(email){
    try {
      return await PromptTemplate.findOne({ recipientEmail: email });
    } catch (error) {
      throw new Error(`Error fetching prompt template: ${error.message}`);
    }
  }

  // Get all templates with optional filters
  async list(filters = {}) {
    try {
      const query = PromptTemplate.find(filters)
        .sort({ createdAt: -1 });

      const [templates, total] = await Promise.all([
        query.exec(),
        PromptTemplate.countDocuments(filters)
      ]);

      return {
        templates,
        total
      };
    } catch (error) {
      throw new Error(`Error listing prompt templates: ${error.message}`);
    }
  }

  // Update a template
  async update(promptTemplateId, updateData) {
    try {
      const template = await PromptTemplate.findOneAndUpdate(
        { promptTemplateId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!template) {
        throw new Error('Prompt template not found');
      }

      return template;
    } catch (error) {
      throw new Error(`Error updating prompt template: ${error.message}`);
    }
  }

  // Delete a template
  async delete(promptTemplateId) {
    try {
      const template = await PromptTemplate.findOneAndDelete({ promptTemplateId });
      if (!template) {
        throw new Error('Prompt template not found');
      }
      return template;
    } catch (error) {
      throw new Error(`Error deleting prompt template: ${error.message}`);
    }
  }

  // Update specific context in template
  async updateContext(promptTemplateId, contextType, contextData) {
    try {
      const updateQuery = {
        [`${contextType}`]: contextData
      };

      const template = await PromptTemplate.findOneAndUpdate(
        { promptTemplateId },
        { $set: updateQuery },
        { new: true }
      );

      if (!template) {
        throw new Error('Prompt template not found');
      }

      return template;
    } catch (error) {
      throw new Error(`Error updating template context: ${error.message}`);
    }
  }

  // Get template by context type
  async getByContext(contextType, contextValue) {
    try {
      const query = {
        [`${contextType}.companyName`]: contextValue
      };
      return await PromptTemplate.findOne(query);
    } catch (error) {
      throw new Error(`Error fetching template by context: ${error.message}`);
    }
  }

  // Bulk create templates
  async bulkCreate(templatesData) {
    try {
      return await PromptTemplate.insertMany(templatesData);
    } catch (error) {
      throw new Error(`Error in bulk creating templates: ${error.message}`);
    }
  }

  // Get default template
  async getDefaultTemplate() {
    try {
      return await PromptTemplate.findOne()
        .sort({ createdAt: 1 })
        .limit(1);
    } catch (error) {
      throw new Error(`Error fetching default template: ${error.message}`);
    }
  }

  // Clone template
  async cloneTemplate(promptTemplateId) {
    try {
      const sourceTemplate = await this.getById(promptTemplateId);
      if (!sourceTemplate) {
        throw new Error('Source template not found');
      }

      const clonedData = {
        ...sourceTemplate.toObject(),
        promptTemplateId: undefined // Will be auto-generated
      };
      delete clonedData._id;

      return await this.create(clonedData);
    } catch (error) {
      throw new Error(`Error cloning template: ${error.message}`);
    }
  }
}

export default new PromptTemplateRepository();
