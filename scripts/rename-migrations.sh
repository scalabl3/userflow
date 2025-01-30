#!/bin/bash

# Migration renaming script
cd my-app/packages/backend/src/migrations

# Auth System
mv 1737964200-001-CREATE-LoginProvider.ts 1737964200-001000-CREATE-LoginProvider.ts
mv 1737964200-002-CREATE-LoginCredential.ts 1737964200-002000-CREATE-LoginCredential.ts
mv 1737964200-004-CREATE-BaseUser.ts 1737964200-003000-CREATE-BaseUser.ts
mv 1737964200-005-ADD-BaseUser-FK-LoginCredential.ts 1737964200-003200-ADD-BaseUser-FK-LoginCredential.ts

# Organization System
mv 1737964200-006-CREATE-Organization.ts 1737964200-010000-CREATE-Organization.ts
mv 1737964200-007-CREATE-User.ts 1737964200-011000-CREATE-User.ts
mv 1737964200-008-ADD-User-FK-Organization.ts 1737964200-011200-ADD-User-FK-Organization.ts

# Billing System
mv 1738084609-009-CREATE-BillingProvider.ts 1738084609-020000-CREATE-BillingProvider.ts

# Update class names in files
sed -i '' 's/CreateLoginProvider1737964200001/CreateLoginProvider1737964200001000/g' 1737964200-001000-CREATE-LoginProvider.ts
sed -i '' 's/CreateLoginCredential1737964200002/CreateLoginCredential1737964200002000/g' 1737964200-002000-CREATE-LoginCredential.ts
sed -i '' 's/CreateBaseUser1737964200004/CreateBaseUser1737964200003000/g' 1737964200-003000-CREATE-BaseUser.ts
sed -i '' 's/AddBaseUserFkLoginCredential1737964200005/AddBaseUserFkLoginCredential1737964200003200/g' 1737964200-003200-ADD-BaseUser-FK-LoginCredential.ts
sed -i '' 's/CreateOrganization1737964200006/CreateOrganization1737964200010000/g' 1737964200-010000-CREATE-Organization.ts
sed -i '' 's/CreateUser1737964200007/CreateUser1737964200011000/g' 1737964200-011000-CREATE-User.ts
sed -i '' 's/AddUserFkOrganization1737964200008/AddUserFkOrganization1737964200011200/g' 1737964200-011200-ADD-User-FK-Organization.ts
sed -i '' 's/CreateBillingProvider1738084609009/CreateBillingProvider1738084609020000/g' 1738084609-020000-CREATE-BillingProvider.ts

# Update references in test files
cd ../tests
find . -type f -name "*.ts" -exec sed -i '' \
    -e 's/1737964200001/1737964200001000/g' \
    -e 's/1737964200002/1737964200002000/g' \
    -e 's/1737964200004/1737964200003000/g' \
    -e 's/1737964200005/1737964200003200/g' \
    -e 's/1737964200006/1737964200010000/g' \
    -e 's/1737964200007/1737964200011000/g' \
    -e 's/1737964200008/1737964200011200/g' \
    -e 's/1738084609009/1738084609020000/g' {} +

# Update references in seeding scripts
cd ../seeds
find . -type f -name "*.ts" -exec sed -i '' \
    -e 's/1737964200001/1737964200001000/g' \
    -e 's/1737964200002/1737964200002000/g' \
    -e 's/1737964200004/1737964200003000/g' \
    -e 's/1737964200005/1737964200003200/g' \
    -e 's/1737964200006/1737964200010000/g' \
    -e 's/1737964200007/1737964200011000/g' \
    -e 's/1737964200008/1737964200011200/g' \
    -e 's/1738084609009/1738084609020000/g' {} +

echo "Migration files have been renamed and references updated."
echo "Please run the test suite to verify changes." 