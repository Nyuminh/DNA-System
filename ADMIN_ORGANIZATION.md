# Admin Module Organization

## Overview
The admin module has been reorganized into clear sub-packages to improve maintainability and user experience.

## Directory Structure

```
src/app/admin/
├── layout.tsx              # Shared admin layout with sidebar navigation
├── page.tsx                # Main admin page (redirects to dashboard)
├── dashboard/              # Dashboard package
│   └── page.tsx           # System overview and statistics
├── accounts/              # Account management package
│   ├── page.tsx           # User list and management
│   └── new/
│       └── page.tsx       # Create new user form
└── profile/               # Admin profile package
    └── page.tsx           # Admin profile and settings
```

## Key Features

### 1. Shared Layout (`layout.tsx`)
- Common header with admin branding
- Sidebar navigation with active state indicators
- Account dropdown menu
- Responsive design

### 2. Dashboard Package (`/dashboard`)
- System overview with key statistics
- 4 main metric cards:
  - Total users
  - Active users  
  - New users this month
  - System performance
- Quick action buttons
- Today's statistics summary
- Recent system activity log

### 3. Accounts Package (`/accounts`)
- Comprehensive user management interface
- Statistics cards for user metrics
- Advanced filtering and search functionality
- Icon-based action buttons with tooltips:
  - Eye icon: View user details
  - Pencil icon: Edit user
  - Lock icons: Lock/unlock account
- User creation form with validation
- Role and status management

### 4. Profile Package (`/profile`)
- Admin personal profile management
- Tabbed interface for profile and security
- Profile information editing
- Password change functionality
- Account activity information

## Navigation Flow

1. `/admin` → Redirects to `/admin/dashboard`
2. Sidebar navigation:
   - Dashboard → `/admin/dashboard`
   - Quản lý tài khoản → `/admin/accounts`
3. Account actions:
   - Profile → `/admin/profile`
   - Logout functionality

## Design Principles

### 1. Consistency
- Uniform styling across all admin pages
- Consistent icon usage and color schemes
- Standardized form layouts and button styles

### 2. User Experience
- Clear visual hierarchy
- Intuitive navigation
- Responsive design for all screen sizes
- Loading states and feedback

### 3. Accessibility
- Proper ARIA labels
- Keyboard navigation support
- High contrast color combinations
- Descriptive tooltips

## Technical Implementation

### Layout System
- Uses Next.js 13+ app directory structure
- Shared layout component for common elements
- Client-side navigation with `usePathname` for active states

### State Management
- Local state management with React hooks
- Form validation and error handling
- Optimistic UI updates

### Styling
- Tailwind CSS for consistent styling
- Heroicons for iconography
- Responsive grid layouts
- Hover effects and transitions

## Future Enhancements

1. **Reports Package**: Add system reporting and analytics
2. **Settings Package**: System configuration and preferences
3. **Logs Package**: System logs and audit trails
4. **Notifications Package**: System notifications and alerts

## Usage Examples

### Adding a New Admin Package

1. Create the package directory:
```bash
mkdir src/app/admin/new-package
```

2. Create the main page:
```tsx
// src/app/admin/new-package/page.tsx
export default function NewPackagePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Package Title</h1>
        <p className="text-gray-600">Package description</p>
      </div>
      
      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Package content */}
      </div>
    </div>
  );
}
```

3. Update the sidebar navigation in `layout.tsx`:
```tsx
<Link
  href="/admin/new-package"
  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive("/admin/new-package")
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }`}
>
  <Icon className="mr-3 h-5 w-5" />
  Package Name
</Link>
```

## Best Practices

1. **File Organization**: Keep related functionality in the same package
2. **Component Reuse**: Create shared components for common UI patterns
3. **Error Handling**: Implement proper error states and user feedback
4. **Performance**: Use proper loading states and optimize re-renders
5. **Accessibility**: Ensure all interactive elements are accessible
