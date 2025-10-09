# Backend Implementation Documentation

This folder contains comprehensive documentation for all backend entities in the Real Estate Platform.

## Available Documentation

### Core Entities

#### [Document.md](Document.md)
- **Entity**: Document management system
- **Features**: File uploads, document types, status tracking
- **Relations**: DocumentType, Multimedia, User

#### [User.md](User.md)
- **Entity**: User management and authentication
- **Features**: Roles, permissions, authentication
- **Relations**: Various entities through user associations

#### [Property.md](Property.md)
- **Entity**: Real estate property management
- **Features**: Property listings, agent assignments, multimedia
- **Relations**: User (creator/agent), Multimedia

### Contract Management

#### [Contract.md](Contract.md)
- **Entity**: Real estate contract processing
- **Features**: Contract lifecycle, payments, document tracking
- **Relations**: User, Property, DocumentTypes

### Multimedia & Files

#### [Multimedia.md](Multimedia.md)
- **Entity**: File upload and storage system
- **Features**: Multiple file types, organized storage, SEO support
- **Relations**: Referenced by multiple entities

### Supporting Entities

#### [Person.md](Person.md)
- **Entity**: Person information management
- **Features**: Identity verification, contact details
- **Relations**: User (one-to-one), Multimedia (ID cards)

#### [Notification.md](Notification.md)
- **Entity**: Notification system
- **Features**: Multi-user targeting, status tracking
- **Relations**: User, Multimedia

#### [Testimonial.md](Testimonial.md)
- **Entity**: Customer testimonial management
- **Features**: Content management, publishing workflow
- **Relations**: Multimedia (optional)

## Entity Relationships Overview

```
User (1) ──── (Many) Property
  │
  ├── (1) Person
  │
  ├── (Many) Document
  │     ├── (1) DocumentType
  │     └── (1) Multimedia
  │
  ├── (Many) Contract
  │     └── (1) Property
  │
  └── (Many) Notification

Multimedia ─── (Many) Various Entities
```

## Recent Updates

### Entity Simplification (Latest)
- **Removed redundant fields**: Eliminated `@Column() foreignKeyId` fields where `@ManyToOne` with `@JoinColumn` already creates the database columns
- **Affected entities**:
  - Document: Removed `uploadedById`
  - Contract: Removed `userId`, `propertyId`
  - Property: Removed `creatorUserId`, `assignedAgentId`
  - Testimonial: Removed `multimediaId`
  - Notification: Removed `multimediaId`, `viewerId`
  - Person: Removed `userId`, `dniCardFrontId`, `dniCardRearId`

### Benefits of Simplification
- Cleaner entity definitions
- Automatic column creation by TypeORM
- Reduced maintenance overhead
- Prevention of decorator conflicts

## Documentation Structure

Each entity documentation includes:
- Complete entity structure with TypeORM decorators
- Enum definitions and interfaces
- Database relationships
- Service layer methods
- Controller endpoints
- DTO specifications
- Business logic explanations
- Module configurations

## Usage

Use these documents as reference for:
- API development
- Database schema understanding
- Business logic implementation
- Integration testing
- Maintenance and updates

## Contributing

When making changes to entities:
1. Update the corresponding `.md` file
2. Test the changes thoroughly
3. Update relationship diagrams if needed
4. Document any breaking changes</content>
<parameter name="filePath">/Users/felipe/dev/realEstatePlatform/project/backEnd/backendImplementation/README.md