ISAAC System API Documentation
Base URL

https://isaac-api-uilf.onrender.com

🔄 Cloudinary Upload
API Endpoint
POST /cloudinary/upload
Payload Structure
Your frontend should send a multipart/form-data request with the following structure:
Form Data Fields
file (required): The actual file you want to upload
Example Frontend Implementation
Here are examples for different frontend frameworks:
const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/cloudinary/upload', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Usage
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const uploadResult = await uploadMedia(file);
      console.log('Upload successful:', uploadResult);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
});
JPG, JPEG, PNG, GIF, WebP, SVG, BMP, TIFF
MP4, MOV, AVI, WMV, FLV, WebM, MKV
MP3, WAV, OGG, AAC, FLAC
PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV
Maximum file size: 100MB
DELETE /cloudinary/delete/:publicId - Delete a file
GET /cloudinary/info/:publicId - Get file information
GET /cloudinary/supported-formats - Get list of supported formats
Response: 
{
    "url": "https://res.cloudinary.com/dfif1rx7a/image/upload/v1751612809/isaac-platform/vdegiq5vvhetm6e6vzed.jpg",
    "publicId": "isaac-platform/vdegiq5vvhetm6e6vzed",
    "resourceType": "image",
    "format": "jpg",
    "size": 12228,
    "width": 500,
    "height": 500
}
}
📂 Incident API
POST /incidents
Create a new incident.
GET /incidents/:id
Get an incident by ID.
GET /incidents
Get all incidents.
PATCH /incidents/:id
Update an existing incident by ID.
DELETE /incidents/:id
Delete an incident by ID.

📄 Report API
POST /reports
Create a new report linked to an incident.
GET /reports
Get all the reports.
GET /reports/:id
Fetch a report by its ID.
PATCH /reports/:id
Update report details by ID.
DELETE /reports/:id
Remove a report by ID.
GET /reports/incident/:incidentId
Get a report associated with a specific incident.


📸 Evidence API
POST /evidence
Upload a new evidence item (photo, video, etc.).
GET /evidences
Get all the evidence.
GET /evidence/:id
Fetch evidence by ID.
PATCH /evidence/:id
Update evidence details by ID.
DELETE /evidence/:id
Delete evidence by ID.
GET /evidence/incident/:incidentId
Fetch all evidence items linked to a specific incident.


🚗 Vehicle API
POST /vehicles
Register a new vehicle involved in an incident.
GET /vehicles
Get all the vehicles.
GET /vehicles/:id
Get vehicle details by ID.
PATCH /vehicles/:id
Update a vehicle record.
DELETE /vehicles/:id
Remove a vehicle record.
GET /vehicles
List all vehicles.
GET /vehicles/incident/:incidentId
List vehicles involved in a specific incident.


👤 Person API
POST /persons
Register a new person (victim, witness, driver, etc.).
GET /persons
Get all persons.
GET /persons/:id
Get a person’s information by ID.
PATCH /persons/:id
Update person details by ID.
DELETE /persons/:id
Remove a person from the system.
GET /persons/incident/:incidentId
List persons linked to a specific incident.


👤 User API
POST /users
Description: Create user 
GET /users
Description: Get a list of all users.
 Query Params (optional):
isActive (boolean)


role (string)


department (string)


Response:
200 OK with an array of users


GET /users/active
Description: Get all users where isActive is true.
 Response:
200 OK with active users only


GET /users/role/:role
Description: Get all users by their role.
 Path Param:
role (e.g. admin, investigator, traffic, chief)


Response:
200 OK with matching users


404 Not Found if role is invalid or no users found


GET /users/department/:department
Description: Get all users by their department.
 Path Param:
department (e.g. AI Analysis, Traffic, Evidence Management)


Response:
200 OK with users in that department


404 Not Found if department has no users


GET /users/:id
Description: Get a user by their ID.
 Path Param:
id (MongoDB ObjectId)


Response:
200 OK with user object


404 Not Found if user doesn't exist


GET /users/email/:email
Description: Find a user by their email.
 Path Param:
email (must be valid email address)


Response:
200 OK with user object


404 Not Found if no user with email found


PATCH /users/:id
Description: Update an existing user's information.
 Path Param:
id (MongoDB ObjectId)


Request Body (any updatable fields):
json
CopyEdit
{
  "firstName": "Jane",
  "phoneNumber": "+251922000000",
  "isActive": true
}

Response:
200 OK with updated user


400 Bad Request or 404 Not Found as applicable


DELETE /users/:id
Description: Delete a user by ID.
 Path Param:
id (MongoDB ObjectId)


Response:
200 OK with confirmation message


404 Not Found if user not found


