import XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const baseUrl = process.env.TRACXN_URL;

export function convertTracxnToExcel(tracxnData, outputPath) {
    try {
        // Validate input
        if (!Array.isArray(tracxnData) || tracxnData.length === 0) {
            throw new Error('Invalid input: Tracxn data must be a non-empty array');
        }

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(tracxnData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracxn Data');

        // Write to Excel file
        XLSX.writeFile(workbook, outputPath);

        console.log(`Excel file successfully created at: ${outputPath}`);
    } catch (error) {
        console.error('Error converting Tracxn data to Excel:', error.message);
        throw error;
    }
}

export function appendTracxnToExcel(tracxnData, outputPath) {
    try {
        // Validate input
        if (!Array.isArray(tracxnData) || tracxnData.length === 0) {
            throw new Error('Invalid input: Tracxn data must be a non-empty array');
        }

        let workbook;
        let existingData = [];

        // Check if file exists and read existing data
        if (existsSync(outputPath)) {
            workbook = XLSX.readFile(outputPath);
            const sheetName = workbook.SheetNames[0];
            existingData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
            workbook = XLSX.utils.book_new();
        }

        // Combine existing data with new data
        const combinedData = [...existingData, ...tracxnData];

        // Convert combined data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(combinedData);

        // Remove existing sheet if it exists
        if (workbook.SheetNames.length > 0) {
            workbook.SheetNames = [];
            workbook.Sheets = {};
        }

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracxn Data');

        // Write to Excel file
        XLSX.writeFile(workbook, outputPath);

        console.log(`Excel file successfully updated at: ${outputPath}`);
    } catch (error) {
        console.error('Error appending Tracxn data to Excel:', error.message);
        throw error;
    }
}

export function appendIdTracxnToExcel(outputPath) {
    try {
        let workbook;
        let existingData = [];

        // Check if file exists and read existing data
        if (existsSync(outputPath)) {
            workbook = XLSX.readFile(outputPath);
            const sheetName = workbook.SheetNames[0];
            existingData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
            workbook = XLSX.utils.book_new();
        }

        // Combine existing data with new data
        const combinedData = existingData?.map((data, index) => ({id: index, ...data}))

        // Convert combined data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(combinedData);

        // Remove existing sheet if it exists
        if (workbook.SheetNames.length > 0) {
            workbook.SheetNames = [];
            workbook.Sheets = {};
        }

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracxn Data');

        // Write to Excel file
        XLSX.writeFile(workbook, outputPath);

        console.log(`Excel file successfully updated at: ${outputPath}`);
    } catch (error) {
        console.error('Error appending Tracxn data to Excel:', error.message);
        throw error;
    }
}

appendIdTracxnToExcel("tracxn_output.xlsx")


const extractRequiredFields = (companyData) => {
    /**
     * Extract only the required fields from the Tracxn API response
     */
    // Extract business models
    const businessModels = [];
    for (const bm of (companyData.businessModelList || [])) {
        const model = bm.fullPathString || bm.name || "";
        if (model && !businessModels.includes(model)) {
            businessModels.push(model);
        }
    }

    // Get description - combine long and short if available
    const descriptionData = companyData.description || {};
    const description = descriptionData.long || descriptionData.short || "";

    // Extract domain info
    const domain = companyData.domain || "";

    // Extract LinkedIn URL
    const profileLinks = companyData.profileLinks || {};
    const linkedinUrl = profileLinks.linkedIn || "";

    const primaryIndustry = [];
    for (const industry of (companyData.sectorList[0] || [])) {
        primaryIndustry.push(industry.name || "");
    }

    return {
        name: companyData.name || "",
        description: description,
        primaryIndustry: primaryIndustry.join('>'),
        businessModels: businessModels.join('>'),
        domain: domain,
        linkedInURL: linkedinUrl,
        employeeList: companyData?.employeeInfo?.employeeList || [],
        continent: companyData?.location?.continent,
        country: companyData?.location?.country,
        city: companyData?.location?.city,
        state: companyData?.location?.state,
        foundedYear: companyData?.foundedYear
    };
}

const fetchCompaniesList = async(filters={}) => {
    /**
     * Fetch list of companies with pagination
     */
    try {
        const headers = {
            "accesstoken": `4fb6e623-08f7-4c7a-b242-ee720ff5cff5`,
            'cache-control': 'no-cache',
            "Content-Type": "application/json"
        }
        console.log(headers)
        const endpoint = `${baseUrl}/companies`;

        console.log(JSON.stringify({...filters}))

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({...filters})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status},  statusText: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching companies list on page : ${error.message}`);
        return null;
    }
}
var from = 2720;

// while (true) {

//     const companiesList = await fetchCompaniesList({ from: from });
//     const tracxnData = []
    
//     for (const company of companiesList?.result || []) {
//         const processedData = extractRequiredFields(company);
//         const employees = processedData?.employeeList?.map((employee) => {
//             const { employeeList, ...rest } = processedData; 
//             return {
//               ...{
//                 employeeName: employee?.name,
//                 short_bio: employee?.shortBio,
//                 employeeLinkedIn: employee?.profileLinks?.linkedinHandle,
//                 employeeDesignation: employee?.designation,
//                 employeeKeyPeople: employee?.isKeyPeople,
//                 employeeFoundingMember: employee?.isFoundingMember,
//               },
//               ...rest,
//             };
//           });
          
//         if (employees.length > 0) {
//             tracxnData.push(...employees);
//         }
//     }
//     if (tracxnData.length > 0) {
//         appendTracxnToExcel(tracxnData, "tracxn_output.xlsx")
//     }

//     if (!companiesList?.result?.length) break;
//     from += 20
// }

export default convertTracxnToExcel;