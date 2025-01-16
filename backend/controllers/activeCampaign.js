import { emailData } from "../index.js";
import { getContactData, getOrganizationData, getCustomFieldData, getAllLists, createAccount, bulkImportContacts } from "../src/services/activeCampaign.js"
import { generateEmailsFromJsonList } from "../src/services/email_generation.js";
import { sendMail } from "../utils/sendMail.js";
import MailboxService from "../src/mailbox/service.js";
import EmailRepository from "../utils/repository/Email.js";
import Recipient from "../utils/repository/Recipient.js";


const mailboxService = new MailboxService()
const recipientRepository = Recipient

async function handleSendMail(request, response) {
  try {
    const { contact } = request.body;
    const category = "NEW"
    // const contactData = parseFormData(body);
    console.log("Parsed contact data:", contact);

    const contactId = contact.id;
    const email = contact.email;
    const companyName = contact.orgname;

    if (!contactId) {
      throw new Error("Contact ID not found in webhook payload");
    }

    // Get detailed contact data
    const fullContactData = await getContactData(contactId);
    console.log("Full Contact Data", fullContactData);

    const empName =
      (fullContactData.contact?.firstName || "") +
      " " +
      (fullContactData.contact?.lastName || "");
    const designation =
      fullContactData.accountContacts?.[0]?.jobTitle || "";
    const shortBio = "";

    console.log(
      `Email: ${email}\ncompany_name: ${companyName}\nemp_name: ${empName}\ndesignation: ${designation}\nshort_bio: ${shortBio}`
    );

    if (!fullContactData) {
      throw new Error("Failed to fetch contact data");
    }

    const orgId = fullContactData.contact?.orgid;

    if (orgId) {
      const orgData = await getOrganizationData(orgId);
      console.log("Org Data", orgData);

      const link = orgData.links?.accountCustomFieldData || "";
      if (link) {
        let data = await getCustomFieldData(link);
        data = data.customerAccountCustomFieldData || [];
        console.log(data);

        let description = "";

        for (const link of data) {
          if (link.custom_field_id === "1") {
            description = link.custom_field_text_value;
          }
        }

        let prompt = "";
        if (category === "NOT_OPENED") {
          prompt = "11. Make an attractive subject line for open rate";
        } else if (category === "NOT_CLICKED") {
          prompt = "11. Make an attractive and informative body for click rate";
        }

        const aiGenMail = await generateEmailsFromJsonList(
          [
            {
              name: companyName,
              description: { long: description },
              employeeInfo: {
                employeeList: [
                  {
                    name: empName,
                    designation: designation,
                    shortBio: shortBio,
                  },
                ],
              },
            },
          ],
          prompt
        );

        console.log("Mail", typeof aiGenMail, aiGenMail);

        for (const aMail of aiGenMail) {

          // const id = await sendMail(aMail);
          // emailData.push({
          //   id: id,
          //   data: aMail,
          //   contact_id: contactId,
          // });
          
          const emailData = JSON.parse(aMail.generated_email);

          const subject = emailData.subject || emailData.Subject || '';
          const body = emailData.body || emailData.Body || '';
          const from = "betagamer580@gmail.com"
          const to = "saranmuthuraj2004@gmail.com"

          // const payload = {
          //   subject: subject,
          //   body: body,
          //   from: from,
          //   to: to
          // }
          
          mailboxService.draftEmail(subject, body, to, from)

        }
      }
    }
  } catch (error) {
    console.log(`Error in handleSendMail${error.message}`);
  }
}

async function handleUpdateStage(request, response) {
  try {
    const { email, fields } = request.body?.contact;

    console.log(email, fields, request.body);

    if (!email && !fields?.stage) return;
    recipientRepository.update( { email }, { stage: fields.stage });
  } catch (error) {
    console.log(error);
  }
}

async function handleGetLists(req, res) {
  try {
    const allLists = await getAllLists();
    return res.status(200).json({ data: allLists});
  } catch (error) {
    console.log(`Error in getLists: ${error.message}`);
  }
}

async function handleAddContact(req, res) {
    try {
        
    } catch (error) {
        console.log(`Error in handleAddContact: ${error}`);
    }
}

async function handleContactBulkUpload(req, res) {
  try {
    // Input validation
    const { list_id, data } = req.body;
    if (!list_id) {
      return res.status(400).json({
        meta: {
          status: false,
          message: "Missing required parameter: list_id"
        }
      });
    }
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        meta: {
          status: false,
          message: "Data must be a non-empty array of companies"
        }
      });
    }

    const employeeData = [];
    const errors = [];

    for (const [companyIndex, company] of data.entries()) {
      try {
        // Validate company data
        if (!company.Name) {
          errors.push(`Company at index ${companyIndex}: Missing required field 'Name'`);
          continue;
        }

        // Create account with error handling
        let companyId;
        try {
          const resp = await createAccount({
            account: {
              owner: 1,
              name: company.Name,
              accountUrl: company.Domain || '',
              fields: [
                { customFieldId: "1", fieldValue: company.Description || '' },
                { customFieldId: "14", fieldValue: company.LinkedIn_URL || '' },
                { customFieldId: "15", fieldValue: company.Business_Models || '' },
                { customFieldId: "16", fieldValue: company.Primary_Industry || '' }
              ]
            }
          });
          companyId = resp.account?.id;
          if (!companyId) {
            errors.push(`Failed to create account for company: ${company.Name}`);
            // continue;
          }
        } catch (err) {
          errors.push(`Error creating account for ${company.Name}: ${err.message}`);
          // continue;
        }

        // Process employees
        if (!Array.isArray(company.Employee_List)) {
          errors.push(`Company ${company.Name}: Employee_List must be an array`);
          continue;
        }

        console.log("employee".company.Employee_List)

        for (const [employeeIndex, employee] of company.Employee_List.entries()) {
          try {
            if (!employee.name) {
              errors.push(`Company ${company.Name}, Employee ${employeeIndex}: Missing required field 'name'`);
              continue;
            }

            const primaryEmail = employee.emailInfo?.primaryEmail || 
                               employee.email || 
                               `user${Math.floor(Math.random() * 10000)}@gmail.com`;

            const firstName = employee.name?.split(" ")[0] || '';
            const lastName = employee.name?.split(" ").slice(1).join(" ") || '';

            employeeData.push({
              email: primaryEmail,
              first_name: firstName,
              last_name: lastName,
              customer_acct_name: company.Name,
              fields: [
                { id: 2, value: employee.profileLinks?.linkedinHandle || '' }
              ],
              subscribe: [
                { "listid": list_id }
              ]
            });
          } catch (err) {
            errors.push(`Error processing employee ${employeeIndex} for company ${company.Name}: ${err.message}`);
          }
        }
      } catch (err) {
        errors.push(`Error processing company ${company.Name}: ${err.message}`);
      }
    }

    // Handle case where no valid employees were processed
    if (employeeData.length === 0) {
      return res.status(400).json({
        meta: {
          status: false,
          message: "No valid employee data to process",
          errors
        }
      });
    }

    // Perform bulk import with error handling
    try {
      const bulkUpload = await bulkImportContacts({
        contacts: employeeData,
        callback: {
          requestType: "POST",
          detailed_results: "true",
          url: "www.google.com"
        }
      });

      return res.status(200).json({
        meta: {
          status: true,
          message: "Bulk upload completed successfully",
          totalProcessed: employeeData.length,
          warnings: errors.length > 0 ? errors : undefined
        }
      });
    } catch (err) {
      return res.status(500).json({
        meta: {
          status: false,
          message: "Bulk import failed",
          error: err.message,
          warnings: errors
        }
      });
    }
  } catch (error) {
    console.error("Fatal error in handleContactBulkUpload:", error);
    return res.status(500).json({
      meta: {
        status: false,
        message: "Internal server error",
        error: error.message
      }
    });
  }
}

export { handleSendMail, handleAddContact, handleGetLists, handleContactBulkUpload, handleUpdateStage }
