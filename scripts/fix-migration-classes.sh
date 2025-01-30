#!/bin/bash

# Migration class name fixing script
cd my-app/packages/backend/src/migrations

# Auth System
sed -i '' 's/class CreateLoginProvider[0-9]*/class Create_LoginProvider_1737964200_001000/g' 1737964200-001000-CREATE-LoginProvider.ts
sed -i '' 's/class CreateLoginCredential[0-9]*/class Create_LoginCredential_1737964200_002000/g' 1737964200-002000-CREATE-LoginCredential.ts
sed -i '' 's/class CreateBaseUser[0-9]*/class Create_BaseUser_1737964200_003000/g' 1737964200-003000-CREATE-BaseUser.ts
sed -i '' 's/class AddBaseUserFkLoginCredential[0-9]*/class Add_BaseUser_Fk_LoginCredential_1737964200_003200/g' 1737964200-003200-ADD-BaseUser-FK-LoginCredential.ts

# Organization System
sed -i '' 's/class CreateOrganization[0-9]*/class Create_Organization_1737964200_010000/g' 1737964200-010000-CREATE-Organization.ts
sed -i '' 's/class CreateUser[0-9]*/class Create_User_1737964200_011000/g' 1737964200-011000-CREATE-User.ts
sed -i '' 's/class AddUserFkOrganization[0-9]*/class Add_User_Fk_Organization_1737964200_011200/g' 1737964200-011200-ADD-User-FK-Organization.ts

# Billing System
sed -i '' 's/class CreateBillingProvider[0-9]*/class Create_BillingProvider_1738084609_020000/g' 1737964200-020000-CREATE-BillingProvider.ts

echo "Migration class names have been updated to the new format."
echo "Verifying changes..."

# Verify changes
echo "Current class names in migration files:"
for file in *-CREATE-*.ts *-ALTER-*.ts *-ADD-*.ts; do
    echo -n "$file: "
    grep "export class" "$file"
done 