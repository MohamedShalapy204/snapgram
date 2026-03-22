# Backend Context: Appwrite Architecture & Schema

This document provides a technical blueprint of the Appwrite backend integration, specifically for agents and developers to understand the data flow and collection schemas.

---

## 1. Authentication (Appwrite Auth)

- **Primary Service**: `account` (from `src/services/appwrite/config.ts`)
- **Key Logic**:
  - `useSignUp`: Creates an account AND triggers a `saveUserToDB` database sync.
  - `useSignIn` / `useSignOut`: Manage persistent sessions via Appwrite SDK.
  - `useUserAccount`: The single source of truth for the _authenticated session_.

## 2. Database Schema (Snapgram Database)

All collections reside in the `snapgram` database.

### 👤 Users Collection

Stores detailed profile information and user relationships.
| Column Name | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `$id` | `string` | System ID | - |
| `name` | `string` | Size: 220 | NULL |
| `username` | `string` | Size: 220 | NULL |
| `email` | `email` | **Required** | - |
| `bio` | `text` | - | NULL |
| `imageUrl` | `url` | **Required** | - |
| `imageId` | `string` | Size: 220 | NULL |
| `posts` | `relationship` | Many to One (to Posts) | NULL |
| `liked` | `relationship` | Many to Many (to Posts) | NULL |
| `save` | `relationship` | Many to One (to Posts) | NULL |
| `$createdAt` | `datetime` | - | - |
| `$updatedAt` | `datetime` | - | - |

### 🖼 Posts Collection

Stores user-generated content and metadata.
| Column Name | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `$id` | `string` | System ID | - |
| `creator` | `relationship` | Many to One (to Users) | NULL |
| `caption` | `string` | Size: 220 | - |
| `imageUrl` | `url` | **Required** | - |
| `imageId` | `string` | **Required**, Size: 220 | - |
| `location` | `string` | Size: 220 | NULL |
| `tags` | `string[]` | Size: 220 | NULL |
| `likes` | `relationship` | Many to Many (to Users) | NULL |
| `save` | `relationship` | Many to One (to Users) | NULL |
| `$createdAt` | `datetime` | - | - |
| `$updatedAt` | `datetime` | - | - |

### 💾 Saves Collection

Acts as a join table for user-saved content.
| Column Name | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `$id` | `string` | System ID | - |
| `user` | `relationship` | Many to One (to Users) | NULL |
| `post` | `relationship` | Many to One (to Posts) | NULL |
| `$createdAt` | `datetime` | - | - |
| `$updatedAt` | `datetime` | - | - |

## 3. Storage Service (Media Management)

- **Logic**:
  - Files are uploaded to Storage _before_ document creation.
  - `imageId` is stored in DB to allow for explicit `deleteFile` calls during updates.
  - `imageUrl` is generated via `getFilePreview`.

## 4. Developer Notes

- **Services**: Clean functional exports in `src/services/appwrite/`.
- **Naming**: IDs are centralized in `src/services/appwrite/config.ts`.
- **Cache**: Managed by TanStack Query; see `src/hooks/queries/`.
