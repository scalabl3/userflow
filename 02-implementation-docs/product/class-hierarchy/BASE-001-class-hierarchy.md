 =======                                                                                                       
 # Base Application Framework Class Hierarchy                                                                  
                                                                                                               
 ## Summary of Relationships                                                                                   
                                                                                                               
 ### Is-A Relationships                                                                                        
 - User is-a BaseEntity (with authentication and profile capabilities)                                         
   - AdminUser is-a User (scope: system-wide administration)                                                   
   - OrganizationUser is-a User (scope: organization-specific)                                                 
 - Organization is-a BaseEntity (with member management)                                                       
   - ShadowOrganization is-a Organization (scope: individual user container)                                   
   - StandardOrganization is-a Organization (scope: multi-user team)                                           
 - Role is-a BaseEntity (with permission sets)                                                                 
   - AdminRole is-a Role (scope: organization administration)                                                  
   - MemberRole is-a Role (scope: standard member access)                                                      
 - Subscription is-a BaseEntity (with billing capabilities)                                                    
   - FreeTierSubscription is-a Subscription                                                                    
   - PaidSubscription is-a Subscription                                                                        
                                                                                                               
 ### Has-A Relationships                                                                                       
 - Organization has-many Users (through OrganizationMembership)                                                
 - Organization has-one Subscription                                                                           
 - Organization has-many Roles                                                                                 
 - User has-one ShadowOrganization                                                                             
 - User has-many OrganizationMemberships                                                                       
 - User has-many Sessions                                                                                      
 - User has-many AuthenticationMethods                                                                         
 - Role has-many Permissions                                                                                   
 - Subscription has-one PaymentMethod                                                                          
 - Subscription has-many Transactions                                                                          
                                                                                                               
 ## Class Hierarchy                                                                                            
                                                                                                               
 ### BaseEntity                                                                                                
 - Core entity with common fields (id, timestamps, etc.)                                                       
 - Base for all major entities                                                                                 
 ```typescript                                                                                                 
 BaseEntity                                                                                                    
 ├── created_at: DateTime                                                                                      
 ├── updated_at: DateTime                                                                                      
 ├── deleted_at: DateTime?                                                                                     
 └── id: UUID                                                                                                  
 ```                                                                                                           
                                                                                                               
 ### User                                                                                                      
 - Core user functionality                                                                                     
 - Authentication and profile management                                                                       
 ```typescript                                                                                                 
 User                                                                                                          
 ├── email: String                                                                                             
 ├── phone?: String                                                                                            
 ├── username?: String                                                                                         
 ├── profile: UserProfile                                                                                      
 ├── authMethods: AuthenticationMethod[]                                                                       
 ├── sessions: Session[]                                                                                       
 ├── shadowOrg: ShadowOrganization                                                                             
 ├── memberships: OrganizationMembership[]                                                                     
 └── settings: UserSettings                                                                                    
 ```                                                                                                           
                                                                                                               
 ### Organization                                                                                              
 - Organization management                                                                                     
 - Member and role coordination                                                                                
 ```typescript                                                                                                 
 Organization                                                                                                  
 ├── name: String                                                                                              
 ├── settings: OrganizationSettings                                                                            
 ├── members: OrganizationMembership[]                                                                         
 ├── roles: Role[]                                                                                             
 ├── subscription: Subscription                                                                                
 └── resources: Resource[]                                                                                     
 ```                                                                                                           
                                                                                                               
 ### Role                                                                                                      
 - Access control management                                                                                   
 - Permission grouping                                                                                         
 ```typescript                                                                                                 
 Role                                                                                                          
 ├── name: String                                                                                              
 ├── permissions: Permission[]                                                                                 
 ├── organization: Organization                                                                                
 └── members: OrganizationMembership[]                                                                         
 ```                                                                                                           
                                                                                                               
 ### Subscription                                                                                              
 - Billing and plan management                                                                                 
 ```typescript                                                                                                 
 Subscription                                                                                                  
 ├── plan: Plan                                                                                                
 ├── organization: Organization                                                                                
 ├── paymentMethod: PaymentMethod                                                                              
 ├── status: SubscriptionStatus                                                                                
 └── transactions: Transaction[]                                                                               
 ```                                                                                                           
                                                                                                               
 ## Access Control Flow                                                                                        
 1. User authentication validation                                                                             
 2. Session validation                                                                                         
 3. Organization membership check                                                                              
 4. Role-based permission validation                                                                           
 5. Resource-specific access check                                                                             
                                                                                                               
 ## Data Isolation                                                                                             
 - Each Organization is a separate data boundary                                                               
 - ShadowOrganizations isolate individual user data                                                            
 - Cross-organization access requires explicit sharing                                                         
 - Subscription features scope available functionality                                                         
 - Role-based access controls within organizations                                                             
                                                                                                               
 ## Key Constraints                                                                                            
 1. Users must have exactly one ShadowOrganization                                                             
 2. Organizations must have at least one admin role                                                            
 3. Users can belong to multiple organizations                                                                 
 4. Subscriptions are organization-scoped                                                                      
 5. Authentication methods must be unique per user                                                             
 6. Sessions are user-scoped and device-aware                                                                  
                                                                                                               
 ## Key Concepts                                                                                               
                                                                                                               
 ### Organization Types                                                                                        
 1. ShadowOrganization (Individual):                                                                           
    - Created automatically with new users                                                                     
    - Single member (owner)                                                                                    
    - Limited sharing capabilities                                                                             
    - Example: "john.doe's workspace"                                                                          
                                                                                                               
 2. StandardOrganization (Team):                                                                               
    - Multiple members                                                                                         
    - Role-based access control                                                                                
    - Resource sharing                                                                                         
    - Example: "Acme Corp Team"                                                                                
                                                                                                               
 This separation enables:                                                                                      
 - Natural progression from individual to team use                                                             
 - Clear data ownership boundaries                                                                             
 - Flexible access control                                                                                     
 - Simple billing unit                                                                                         
                                                                                                               
 ### Authentication Methods                                                                                    
 1. Primary Authentication (Required):                                                                         
    - Email + Password                                                                                         
    - Phone + SMS                                                                                              
    - Username + Password                                                                                      
    - Example: "john@example.com + password"                                                                   
                                                                                                               
 2. Secondary Authentication (Optional):                                                                       
    - OAuth providers                                                                                          
    - Social login                                                                                             
    - Biometric                                                                                                
    - Example: "Login with Google"                                                                             
                                                                                                               
 This specification provides:                                                                                  
 1. Clear entity relationships and boundaries                                                                  
 2. Flexible authentication options                                                                            
 3. Natural individual-to-team growth path                                                                     
 4. Comprehensive access control                                                                               
 5. Scalable billing foundation                                                                                
 