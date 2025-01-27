## Prompting Guidelines

We are generating an Organization Class with the following attributes:
- ID (uuid)
- name (str)
- visibile  (bool)
- createdAt (datetime)
- modifiedAt (datetime)
- adminUser (uuid)

Use the `01-meta/01-templates/spec.class.template.md` file to format the file.
Generate the file in `02-impl/specs` folder

When generating specifications, use the following guidelines to ensure adherence to the template and prevent over-generation.

### General Instructions

- **Role Definition:** You are an AI specialized in generating precise and minimal class specifications.
- **Template Adherence:** **Do not add, remove, or modify** any sections or content beyond the placeholders.
- **Placeholder Filling:** **Only** fill in the placeholders (`<PlaceholderName>`) provided in the template.
- **Conciseness:** Ensure all filled content is **concise** and **essential** for the base implementation.
- **Formatting:** Maintain **consistent formatting** as shown in the template.
- **No Speculation:** **Avoid** introducing any speculative or additional information outside the template, no additional properties, methods, or other speculative

### Specific Instructions

1. **Repositories Inclusion:**
   - **Only include** repositories if the class interacts with data sources.
   - Define repositories as dependencies in the **Constructor** and as **Properties**.
   - Ensure consistency between constructor dependencies and properties.

2. **Error Handling Structure:**
   - Each error must include:
     - **Error Identifier**
     - **Type**
     - **Trigger Conditions**
     - **Handling Strategy**
     - **Error Message**
   - **Do not omit** any fields.

### Constraints

- **Section Limitation:** **Only** fill in the placeholders provided. **Do not add, remove, or modify** any sections.
- **Error Limitation:** **Limit** to a maximum of five errors to maintain focus.
- **No Additional Content:** **Do not include** any speculative or additional information outside the template.

---

## Example Prompts and Outputs

### 1. Generate Class Overview

**Prompt:**

Fill in the <ClassName>, <ModelReferences>, and <APIReferences> in the following template. Do not add or modify any sections. Only fill in the placeholders.



Related Specifications
	•	Models: 
	•	APIs: 

=====================================================

SCOPE BOUNDARY - Base Implementation Ends Here

=====================================================

Note: Class follows generation rules for 5K user site scale.
Complex features noted as future extensions.

**Expected Output:**
```markdown
# OrganizationService

## Related Specifications
- **Models:** OrganizationModel, UserModel
- **APIs:** OrganizationAPI

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

**Note:** Class follows generation rules for 5K user site scale.
Complex features noted as future extensions.

2. Generate Constructor

Prompt:

Fill in the `<Dependencies>` in the following constructor section for the `OrganizationService` class. **Do not add or modify any sections. Only fill in the placeholders.**

## Constructor
```typescript
constructor(
  <Dependencies>
)

**Expected Output:**
```markdown
## Constructor
```typescript
constructor(
  organizationRepository: OrganizationRepository,
  userService: UserService
)

---

### 3. Generate Properties

**Prompt:**

Fill in the <PropertyName>, <PropertyType>, <PropertyPurpose>, and <AccessModifier> for each property in the following section. Do not add or modify any sections. Only fill in the placeholders.

Properties


	•	Type: 
	•	Purpose: 
	•	Access: 


	•	Type: 
	•	Purpose: 
	•	Access: 

**Expected Output:**
```markdown
## Properties

### organizationRepository
- **Type:** OrganizationRepository
- **Purpose:** Manages organization data persistence
- **Access:** private

### userService
- **Type:** UserService
- **Purpose:** Handles user-related operations and validation
- **Access:** private

4. Generate Core Methods

Prompt:

Fill in the placeholders for each core method in the following section for the `OrganizationService` class. **Do not add or modify any sections. Only fill in the placeholders.**

## Core Methods

### create
- **Purpose:** <CreatePurpose>
- **Parameters:** <CreateParameters>
- **Returns:** <CreateReturnType>
- **Errors:** <CreateErrors>

### get
- **Purpose:** <GetPurpose>
- **Parameters:** <GetParameters>
- **Returns:** <GetReturnType>
- **Errors:** <GetErrors>

### update
- **Purpose:** <UpdatePurpose>
- **Parameters:** <UpdateParameters>
- **Returns:** <UpdateReturnType>
- **Errors:** <UpdateErrors>

### delete
- **Purpose:** <DeletePurpose>
- **Parameters:** <DeleteParameters>
- **Returns:** <DeleteReturnType>
- **Errors:** <DeleteErrors>

Expected Output:

## Core Methods

### create
- **Purpose:** Creates a new organization
- **Parameters:** name: string, adminUserUuid: string, visibility?: boolean
- **Returns:** Promise<Organization>
- **Errors:** ValidationError, UserNotFoundError

### get
- **Purpose:** Retrieves organization by UUID
- **Parameters:** uuid: string
- **Returns:** Promise<Organization>
- **Errors:** NotFoundError

### update
- **Purpose:** Updates organization details
- **Parameters:** uuid: string, updateData: Partial<OrganizationUpdateData>
- **Returns:** Promise<Organization>
- **Errors:** ValidationError, NotFoundError, UnauthorizedError

### delete
- **Purpose:** Deletes an organization
- **Parameters:** uuid: string
- **Returns:** Promise<void>
- **Errors:** NotFoundError, UnauthorizedError

5. Generate Error Handling

Prompt:

Fill in the `<ErrorIdentifier>`, `<ErrorType>`, `<TriggerConditions>`, `<HandlingStrategy>`, and `<ErrorMessage>` for each error in the following section. **Do not add or modify any sections. Only fill in the placeholders.**

## Error Handling

### <ErrorIdentifier1>
- **Type:** <ErrorType1>
- **Trigger Conditions:** <TriggerConditions1>
- **Handling Strategy:** <HandlingStrategy1>
- **Error Message:** <ErrorMessage1>

### <ErrorIdentifier2>
- **Type:** <ErrorType2>
- **Trigger Conditions:** <TriggerConditions2>
- **Handling Strategy:** <HandlingStrategy2>
- **Error Message:** <ErrorMessage2>

### <ErrorIdentifier3>
- **Type:** <ErrorType3>
- **Trigger Conditions:** <TriggerConditions3>
- **Handling Strategy:** <HandlingStrategy3>
- **Error Message:** <ErrorMessage3>

### <ErrorIdentifier4>
- **Type:** <ErrorType4>
- **Trigger Conditions:** <TriggerConditions4>
- **Handling Strategy:** <HandlingStrategy4>
- **Error Message:** <ErrorMessage4>

Expected Output:

## Error Handling

### ValidationError
- **Type:** ValidationError
- **Trigger Conditions:** When input data fails validation rules.
- **Handling Strategy:** Log the error and return a message indicating invalid input.
- **Error Message:** "Invalid organization data provided."

### NotFoundError
- **Type:** NotFoundError
- **Trigger Conditions:** When the organization UUID is not found in the database.
- **Handling Strategy:** Log the error and return a 404 status with an error message.
- **Error Message:** "Organization not found."

### UnauthorizedError
- **Type:** AuthorizationError
- **Trigger Conditions:** When a non-admin user attempts to modify the organization.
- **Handling Strategy:** Log the error and return a 403 status with a permission denied message.
- **Error Message:** "You do not have permission to perform this action."

### UserNotFoundError
- **Type:** UserError
- **Trigger Conditions:** When the specified admin user UUID does not exist.
- **Handling Strategy:** Log the error and return a 404 status with a user not found message.
- **Error Message:** "Admin user not found."

Best Practices
	1.	Consistent Naming Conventions:
	•	Use clear and consistent names for classes, properties, methods, and errors.
	•	Repositories should typically end with Repository (e.g., UserRepository).
	2.	Clear Purpose Descriptions:
	•	Ensure the Purpose field succinctly describes the role of each property and method.
	3.	Access Modifiers:
	•	Use appropriate access levels (public, private, protected) to encapsulate class properties and dependencies.
	4.	Minimalism:
	•	Keep all descriptions brief and focused on essential information.
	•	Avoid adding unnecessary details or speculative content.
	5.	Structured Error Handling:
	•	Each error must include all five fields to maintain consistency and clarity.

Validation and Iteration
	1.	Automated Validation:
	•	Implement scripts to parse and validate the generated class.spec files against the template structure.
	•	Ensure all placeholders are filled and no additional content is present.
	2.	Manual Reviews:
	•	Regularly review generated specifications to ensure adherence to the template.
	•	Provide feedback and adjust prompts as necessary.
	3.	Iterative Refinement:
	•	Continuously refine prompts and templates based on validation outcomes to enhance precision.

By following this structured approach, you can ensure that your AI-generated specification files strictly adhere to the predefined templates, eliminating over-generation and maintaining consistency across your system.

If you need further assistance or additional templates (data-model.spec, api.spec), feel free to reach out!