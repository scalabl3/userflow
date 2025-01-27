openapi: 3.0.1
info:
  title: Organization API
  version: 1.0.0
  description: API documentation for managing Organizations.
servers:
  - url: http://localhost:3000/api
    description: Development server
  - url: https://api.yourdomain.com
    description: Production server
paths:
  /organizations:
    get:
      summary: Retrieve a list of organizations
      tags:
        - Organizations
      responses:
        '200':
          description: A list of organizations
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Organization'
        '500':
          description: Server error
    post:
      summary: Create a new organization
      tags:
        - Organizations
      requestBody:
        description: Organization data to be created
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrganizationDto'
      responses:
        '201':
          description: Organization created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Organization'
        '400':
          description: Invalid input data
        '500':
          description: Server error
  /organizations/{id}:
    get:
      summary: Retrieve a single organization by ID
      tags:
        - Organizations
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
          description: The UUID of the organization to retrieve
      responses:
        '200':
          description: Organization retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Organization'
        '404':
          description: Organization not found
        '500':
          description: Server error
    put:
      summary: Update an existing organization
      tags:
        - Organizations
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
          description: The UUID of the organization to update
      requestBody:
        description: Organization data to be updated
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateOrganizationDto'
      responses:
        '200':
          description: Organization updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Organization'
        '400':
          description: Invalid input data
        '404':
          description: Organization not found
        '500':
          description: Server error
    delete:
      summary: Delete an organization by ID
      tags:
        - Organizations
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
            format: uuid
          description: The UUID of the organization to delete
      responses:
        '200':
          description: Organization deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
        '404':
          description: Organization not found
        '500':
          description: Server error
components:
  schemas:
    Organization:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: "123e4567-e89b-12d3-a456-426614174000"
        name:
          type: string
          example: "Shadow Corp"
        visible:
          type: boolean
          example: true
        createdAt:
          type: string
          format: date-time
          example: "2024-01-01T00:00:00Z"
        modifiedAt:
          type: string
          format: date-time
          example: "2024-01-02T00:00:00Z"
        adminUser:
          type: string
          format: uuid
          example: "987e6543-e21b-32d3-a654-426614174999"
      required:
        - id
        - name
        - visible
        - createdAt
        - modifiedAt
        - adminUser
    CreateOrganizationDto:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 255
          example: "Shadow Corp"
        visible:
          type: boolean
          example: true
        adminUser:
          type: string
          format: uuid
          example: "987e6543-e21b-32d3-a654-426614174999"
      required:
        - name
        - adminUser
    UpdateOrganizationDto:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 255
          example: "Shadow Corp International"
        visible:
          type: boolean
          example: false
        adminUser:
          type: string
          format: uuid
          example: "987e6543-e21b-32d3-a654-426614174999"
      required: []
