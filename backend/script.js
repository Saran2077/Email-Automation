import XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const baseUrl = 'https://platform.tracxn.com/api/2.2/playground';

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

const tracxnData = []
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
var from = 800;

while (true) {

    const companiesList = await fetchCompaniesList({ from: from });
    const tracxnData = []
    
    for (const company of companiesList?.result || []) {
        const processedData = extractRequiredFields(company);
        const employees = processedData?.employeeList?.map((employee) => {
            const { employeeList, ...rest } = processedData; 
            return {
              ...{
                employeeName: employee?.name,
                short_bio: employee?.shortBio,
                employeeLinkedIn: employee?.profileLinks?.linkedinHandle,
                employeeDesignation: employee?.designation,
                employeeKeyPeople: employee?.isKeyPeople,
                employeeFoundingMember: employee?.isFoundingMember,
              },
              ...rest,
            };
          });
          
        if (employees.length > 0) {
            tracxnData.push(...employees);
        }
    }
    if (tracxnData.length > 0) {
        appendTracxnToExcel(tracxnData, "tracxn_output.xlsx")
    }

    if (!companiesList?.result?.length) break;
    from += 20
}

console.log(tracxnData)

if (fileURLToPath(import.meta.url) === process.argv[1]) {
    const inputFile = process.argv[2];
    const outputFile = process.argv[3];

    if (inputFile) {
        // If input file is provided, read from file
        try {
            const jsonData = JSON.parse(readFileSync(inputFile, 'utf8'));
            
            convertTracxnToExcel(jsonData, outputFile || 'tracxn_output.xlsx');
        } catch (error) {
            console.error('Error processing file:', error.message);
            process.exit(1);
        }
    } else {
        // If no input file is provided, use sample data
        convertTracxnToExcel(tracxnData, 'tracxn_output.xlsx');
    }
}

export default convertTracxnToExcel;