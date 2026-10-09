# Requirements Document: Premium Court UI Redesign

## Introduction

The Criminal Record Digital Verification System requires a modern, professional court-grade user interface that combines visual sophistication with security-first design principles. The Premium Court UI Redesign transforms the system from a functional application into a government-credible verification platform through a cohesive design system emphasizing dark spatial aesthetics, selective glassmorphic effects, aurora gradient accents, and premium micro-interactions. This redesign establishes a distinctive visual identity that distinguishes the CRDVS from generic administrative templates while maintaining accessibility, performance, and security standards required for law enforcement and court operations.

---

## Glossary

- **Design System**: The foundational collection of components, color tokens, typography rules, and responsive breakpoints that ensure visual and functional consistency across the entire platform.

- **Dark Spatial UI**: A visual design philosophy using dark backgrounds (near-black, deep blues, charcoal) with depth layering through shadows, borders, and spatial elevation to create a sense of three-dimensional space.

- **Glassmorphism**: A visual effect combining semi-transparent surfaces with backdrop blur, creating a frosted glass appearance; applied selectively on overlays, modals, and card headers for premium feel.

- **Aurora Gradient**: Color gradients inspired by the Northern Lights, typically flowing from cool purples through teals and greens, used as accent elements for highlights, active states, and primary actions.

- **Micro-interactions**: Subtle, responsive animations and transitions (100–400ms duration) triggered by user actions (hover, click, focus) that provide feedback without introducing jank or performance degradation.

- **Role-Based Access Control (RBAC)**: A security model where UI elements, pages, and actions are visible and accessible only to users with specified roles (Administrator, Police Officer, Court Officer, Prison Officer).

- **Row-Level Security (RLS)**: Database-level security enforcement where Supabase policies restrict data access based on authenticated user context, preventing unauthorized data exposure.

- **Audit Logging**: Immutable append-only records of all user actions (create, read, update, delete, verify, generate_report) with timestamps, user context, and affected record IDs for compliance and forensic analysis.

- **Verification Centre**: The user-facing interface where officers submit identity verification requests against national ID databases and receive confidence scores and match status.

- **Record Profile**: A detailed page displaying comprehensive criminal record information including personal details, conviction history, risk level, sentence status, and repeat offender flags.

- **Dashboard**: The primary entry point after login, providing officers a high-level overview of pending verifications, recent records, quick-access actions, and system notifications.

- **Analytics View**: A page presenting aggregated metrics such as verification success rates, case volumes by offense category, verification speed benchmarks, and officer activity trends.

- **Audit Logs View**: A filterable, searchable audit trail displaying all system actions with user, timestamp, action type, affected record, and old/new value deltas.

- **User Management Page**: An admin-only interface for creating, deactivating, and updating officer profiles, role assignments, department affiliations, and access permissions.

- **Responsive Breakpoints**: Standard screen sizes at which layout and component behavior adapt (mobile: <640px, tablet: 640–1024px, desktop: >1024px).

- **Accessibility (A11y)**: Features ensuring the UI is usable by all users including those with visual, motor, or cognitive disabilities; includes keyboard navigation, focus indicators, color contrast, screen reader labels.

- **Contrast Ratio**: The mathematical relationship between foreground and background color brightness; WCAG AA standard requires 4.5:1 for text, 3:1 for large text and graphics.

- **Skeleton Loader**: A placeholder UI element that mimics the layout of content being loaded, reducing perceived load time and preventing layout shift.

- **Supabase**: Open-source Backend-as-a-Service platform providing PostgreSQL database, authentication, row-level security, and real-time capabilities.

- **Framer Motion**: React animation library providing declarative motion primitives, gesture controls, and layout animations.

- **Lucide React**: Icon library providing consistent, customizable SVG icons in React components.

- **Tailwind CSS 4**: Utility-first CSS framework generating classes on-demand for styling with responsive modifiers and dark mode support.

---

## Requirements

### Requirement 1: Design System Foundation

**User Story:** As a developer, I want a comprehensive, well-documented design system, so that all UI components maintain visual consistency and can be built and maintained efficiently.

#### Acceptance Criteria

1. **Color Palette Definition**
   - THE Design_System SHALL define a primary dark color palette: Primary_Black (#0a0e27), Primary_Dark_Blue (#1a1f3a), Surface_Dark (#252d48), Elevation_Light (#3a4254)
   - THE Design_System SHALL define accent gradients: Aurora_Gradient (purple #7c3aed → teal #14b8a6 → green #10b981), Critical_Red (#dc2626), Success_Green (#10b981), Warning_Amber (#f59e0b)
   - THE Design_System SHALL define glassmorphism colors: Glass_Base (rgba(255, 255, 255, 0.08)), Glass_Hover (rgba(255, 255, 255, 0.12)), Glass_Border (rgba(255, 255, 255, 0.15))
   - THE Design_System SHALL define semantic colors for status: Verified_Status (#10b981), Unverified_Status (#6b7280), Mismatch_Status (#dc2626), Pending_Status (#f59e0b)

2. **Typography System**
   - THE Design_System SHALL define heading hierarchy: H1 (32px bold, line-height 1.2), H2 (24px bold, 1.3), H3 (20px semibold, 1.4), H4 (16px semibold, 1.5)
   - THE Design_System SHALL define body text: Body_Large (16px regular, 1.6), Body_Regular (14px regular, 1.6), Body_Small (12px regular, 1.5), Caption (12px, color: text_secondary)
   - THE Design_System SHALL define font family as system stack: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif
   - THE Design_System SHALL ensure minimum text contrast ratio of 4.5:1 (WCAG AA) between all text colors and backgrounds

3. **Component Library Structure**
   - THE Design_System SHALL include reusable components: Button, Input, Select, Checkbox, Radio, Textarea, Card, Modal, Sidebar, Header, Table, Badge, Toast, Skeleton_Loader
   - WHERE a component is interactive, THE Design_System SHALL define states: Default, Hover, Focus, Active, Disabled, Loading
   - THE Design_System SHALL provide component documentation with props, examples, and accessibility guidelines in a Storybook-compatible format
   - WHERE Glassmorphism is applied, THE Design_System SHALL use consistent backdrop-filter (blur(10px)) and border (1px solid rgba(255, 255, 255, 0.15))

4. **Responsive Design System**
   - THE Design_System SHALL define responsive breakpoints: Mobile (0–639px), Tablet (640–1023px), Desktop (1024px+)
   - WHEN component is rendered on Mobile, THE Design_System SHALL stack elements vertically, increase touch target size to minimum 44×44px, and use single-column layout
   - WHEN component is rendered on Tablet, THE Design_System SHALL use 2-column layout and adjust font sizes by 10% reduction
   - WHEN component is rendered on Desktop, THE Design_System SHALL use full multi-column layout with maximum content width of 1400px

5. **Design System Configuration**
   - THE Design_System SHALL be implemented in Tailwind CSS 4 configuration (tailwind.config.ts) with custom theme tokens
   - THE Design_System SHALL export centralized color variables, spacing constants, and animation timing as TypeScript constants (design-tokens.ts)
   - THE Design_System SHALL define spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px (multiples of 4px)
   - THE Design_System SHALL define animation timings: Fast (100ms), Normal (200ms), Slow (300ms), Transition (400ms)

---

### Requirement 2: Authentication & Login Interface

**User Story:** As a law enforcement officer, I want a secure, professional login experience, so that I can access criminal records with confidence in system authenticity and my credential security.

#### Acceptance Criteria

1. **Login Page Visual Design**
   - THE Login_Page SHALL display a dark spatial background (Primary_Black #0a0e27) with subtle gradient overlay
   - THE Login_Page SHALL position the login form centered in a glassmorphic card (Glass_Base background, Glass_Border border, backdrop-blur 10px) on desktop, full-screen on mobile
   - THE Login_Page SHALL display the CRDVS logo and wordmark (left-aligned on desktop, centered on mobile) with minimum 40px height
   - THE Login_Page SHALL display a subtle aurora gradient accent line (height 3px, width 100%) beneath the logo

2. **Login Form Fields & Validation**
   - WHEN user enters email address, THE Login_Form SHALL validate email format in real-time with visual feedback (green checkmark or red error icon)
   - WHEN user enters password, THE Login_Form SHALL hide password characters by default and provide a toggle button (icon: Eye/EyeOff from Lucide React) to show/hide
   - THE Login_Form SHALL display error messages in inline red text (Color: Critical_Red #dc2626, font-size: 12px) beneath the invalid field
   - WHERE authentication fails, THE Login_Form SHALL clear the password field and display a toast error notification with message "Incorrect email or password. Please try again."

3. **Login Security & Audit**
   - WHEN user clicks Sign In button, THE Login_System SHALL submit credentials via server action (next/actions) to prevent credential exposure in network logs
   - WHEN authentication succeeds, THE Login_System SHALL log audit event (action: 'login', user_id, ip_address, user_agent, timestamp) to audit_logs table
   - WHEN authentication fails, THE Login_System SHALL log failed attempt (action: 'login', email, ip_address, timestamp) and implement exponential backoff (1s, 2s, 4s, 8s) after 3 consecutive failures
   - WHEN user remains inactive for 30 minutes, THE Login_System SHALL automatically invalidate the session and redirect to login page with notification "Your session has expired. Please log in again."

4. **Login Loading & Feedback States**
   - WHEN user submits login form, THE Sign_In_Button SHALL display a loading spinner (rotating icon, color: Aurora_Gradient) and disable further clicks
   - WHEN authentication request is processing, THE Login_Page SHALL display skeleton loaders for form elements to prevent layout shift
   - WHEN login succeeds, THE Login_Page SHALL redirect to Dashboard with fade-out transition (200ms duration, opacity 1 → 0)
   - WHEN login fails, THE Login_Form SHALL shake the form container (10px horizontal movement, 100ms duration) to draw attention

5. **Login Accessibility**
   - THE Login_Form SHALL support keyboard navigation: Tab to move between fields, Shift+Tab to move backward, Enter to submit form
   - WHEN user focuses on a form input, THE Input_Field SHALL display a focus ring (3px outline, color: Aurora_Gradient teal #14b8a6)
   - THE Login_Form labels SHALL be associated with inputs via htmlFor attribute and read by screen readers
   - THE Login_Form error messages SHALL use role="alert" and be announced immediately by screen readers

---

### Requirement 3: Dashboard & Navigation

**User Story:** As a police officer, I want a clear dashboard showing pending verifications and quick actions, so that I can efficiently prioritize my daily workflow without navigating through menus.

#### Acceptance Criteria

1. **Sidebar Navigation Structure**
   - THE Sidebar SHALL display vertically on desktop (width: 280px, left edge), horizontally on mobile (height: 64px, bottom edge)
   - THE Sidebar SHALL display logo/brand identity at top (desktop) with organization name and acronym "CRDVS"
   - WHERE user has 'administrator' role, THE Sidebar SHALL display menu items: Dashboard, Verification Centre, Records, Analytics, Audit Logs, User Management
   - WHERE user has 'police_officer' role, THE Sidebar SHALL display menu items: Dashboard, Verification Centre, Records, Analytics
   - WHERE user has 'court_officer' or 'prison_officer' role, THE Sidebar SHALL display menu items: Dashboard, Verification Centre, Records
   - THE Sidebar menu items SHALL use Lucide React icons (size 20px) with text labels (14px, Body_Regular)
   - THE Sidebar SHALL highlight the active route with Aurora_Gradient background and teal accent bar (4px width, left edge)

2. **Header & User Profile**
   - THE Header SHALL span full width, positioned fixed at top (desktop: below logo, mobile: above content)
   - THE Header SHALL display current page title (20px bold, left-aligned) and breadcrumb trail (12px, text_secondary, separated by "/" dividers)
   - THE Header SHALL display a user profile section (right-aligned): profile avatar (32×32px, circular), user full name, user role (12px, text_secondary)
   - WHEN user clicks on profile section, THE User_Menu SHALL open a dropdown: "My Profile", "Change Password", "Logout" (glassmorphic dropdown, 200px width)

3. **Dashboard Main Content Layout**
   - THE Dashboard SHALL display a responsive grid layout: 1 column on mobile, 2 columns on tablet, 3 columns on desktop (gap: 16px, max-width: 1400px)
   - THE Dashboard top section SHALL display a personalized greeting: "Welcome, [Full_Name]" with current date and system status indicator (green online, red offline)
   - THE Dashboard shall display at-a-glance statistics cards: Pending_Verifications (number + trend), Records_Created_This_Month (number + comparison), Active_Users (admin only)
   - WHERE statistics data is loading, THE Dashboard SHALL display Skeleton_Loaders (animated gray boxes, same height/width as final cards) to prevent layout shift

4. **Dashboard Quick Actions**
   - THE Dashboard SHALL display a "Quick Actions" card with 4 primary buttons: "New Verification", "Search Records", "Generate Report", "View Analytics" (admin)
   - WHEN user clicks "New Verification", THE System SHALL navigate to /verification/new with pre-populated form
   - WHERE user lacks permission for an action, THE button SHALL be disabled (opacity: 50%, cursor: not-allowed) with tooltip: "Administrator access required"
   - THE Quick_Actions buttons SHALL display hover effect: background color shift to Glass_Hover, scaling to 102%, shadow elevation increase (150ms ease-out)

5. **Dashboard Notifications & Alerts**
   - THE Dashboard SHALL display a notifications section: recent system alerts, new duplicate flags, pending reviews (if admin)
   - WHEN a new duplicate flag is created, THE System SHALL display a toast notification (top-right, 6 seconds duration): "New duplicate flag detected: Record CR-1234567A89 marked for review"
   - THE Notifications_Panel SHALL support filtering by type: All, Duplicates, System_Alerts, Personal_Notes
   - WHERE no notifications exist, THE Notifications_Panel SHALL display placeholder message: "All caught up. No notifications." (text_secondary color)

6. **Dashboard Responsiveness**
   - WHEN viewport width is less than 640px, THE Sidebar SHALL collapse to icon-only mode and display mobile bottom navigation
   - WHEN viewport width is between 640–1023px, THE Sidebar SHALL remain visible at left edge (reduced width: 200px) with abbreviated labels
   - WHEN viewport width exceeds 1024px, THE Sidebar SHALL display full width (280px) with complete labels and icons
   - THE Dashboard grid SHALL reflow automatically: 1 column on mobile, 2 on tablet, 3 on desktop without manual intervention

---

### Requirement 4: Verification Centre Interface

**User Story:** As a law enforcement officer, I want to submit identity verification requests and see real-time confidence scores, so that I can quickly determine if criminal record data matches submitted identification.

#### Acceptance Criteria

1. **Verification Request Form Layout**
   - THE Verification_Form SHALL display on a dedicated page (/verification/new) with a clean two-column layout: form on left (60%), submission guidelines on right (40%) on desktop
   - THE Form title SHALL read "New Verification Request" (H2 size, color: text_primary)
   - THE Form SHALL display form sections with visual hierarchy: Personal_Information, Identification_Data, Optional_Notes
   - WHEN viewport is smaller than 1024px, THE Layout SHALL stack to single column with guidelines below the form

2. **Verification Form Input Fields**
   - THE Form SHALL include these required fields: Full_Name (text input, 256 char max), Date_of_Birth (date picker with calendar UI), National_ID_Number (formatted input, DD-DDDDDDDADD), Gender (select dropdown: Male, Female, Other)
   - THE Form SHALL include optional field: Aliases (text input, supports comma-separated list, 5 max items), Photo (file upload, max 5MB, formats: JPG, PNG)
   - WHERE user enters partial national ID, THE Form SHALL display real-time validation: green checkmark when format matches DD-DDDDDDDADD, red X when format incorrect
   - THE Form input labels SHALL be bold (14px, Body_Regular) with asterisk (*) for required fields (color: Critical_Red)

3. **Real-Time Verification Matching**
   - WHEN user completes required fields and clicks "Search Records", THE Verification_System SHALL query criminal_records database for matches
   - THE Verification_System SHALL calculate confidence_score (0–100) based on fuzzy name matching, date-of-birth match, national_id match
   - WHEN confidence_score is 85–100, THE System SHALL display result badge: "High Confidence Match" (background: Success_Green, text: white, icon: CheckCircle)
   - WHEN confidence_score is 70–84, THE System SHALL display result badge: "Moderate Confidence" (background: Warning_Amber, text: dark, icon: AlertCircle)
   - WHEN confidence_score is below 70, THE System SHALL display result badge: "Low Confidence" (background: Critical_Red, text: white, icon: XCircle)
   - WHEN search returns multiple matches, THE System SHALL display top 5 results ranked by confidence_score with expandable record previews

4. **Verification Result Details**
   - WHEN a match is found, THE Result_Card SHALL display: record_id, full_name, date_of_birth, risk_level (1–5 star visualization), status, prior_conviction_count
   - WHEN user clicks on a match result, THE System SHALL navigate to Record_Profile page (/records/[id]) with matched record details
   - THE Result_Card SHALL display metadata: "Verified by [Officer_Name] on [Date]" (text_secondary, 12px) if record was previously verified
   - WHERE mismatch fields are detected, THE System SHALL display mismatch warning: "National ID does not match. Last verified on [Date]. Review details carefully." (yellow warning box)

5. **Verification Request Submission**
   - WHEN user clicks "Submit Verification Request" button, THE System SHALL validate all required fields (display inline red errors if missing)
   - WHEN form is valid, THE System SHALL submit request via server action to create verification_requests record with status: 'pending'
   - WHEN submission succeeds, THE System SHALL display success toast: "Verification request submitted (Reference: VRQ-20260622-00001)" with copy-to-clipboard button
   - WHEN submission fails, THE System SHALL display error toast: "Failed to submit verification request. Please try again or contact support." with retry button

6. **Verification History & Previous Requests**
   - THE Verification_Centre SHALL display a "Recent Requests" section showing last 10 verification requests by current user (paginated, 5 per page)
   - EACH request SHALL display: submission_date, national_id_submitted, status (icon + label: Verified green, Pending yellow, Mismatch red), result_confidence_score, linked_record_id
   - WHEN user clicks on a previous request, THE System SHALL display request details and allow viewing the matched record or re-verifying with updated data

---

### Requirement 5: Record Profile & Details Page

**User Story:** As a court officer, I want to view comprehensive criminal record information with conviction history and risk assessments, so that I can make informed decisions about sentencing and bail.

#### Acceptance Criteria

1. **Record Profile Header & Overview**
   - THE Record_Profile page (/records/[id]) SHALL display a header section with personal information: photo (120×120px circular thumbnail, left), full_name (H1), aliases (if any), national_id_number, date_of_birth, gender, nationality
   - THE Header SHALL display status badge (Verified green, Unverified gray, Flagged red): positioned top-right of photo
   - THE Header SHALL display risk_level visualization: 5-star rating where filled stars (red-to-orange gradient) represent risk (1 star = low, 5 stars = critical)
   - THE Header SHALL display key metadata: "Record ID: [CR-XXXXXXXA##]", "Repeat Offender: [Yes/No]", "Prior Convictions: [#]" in a info grid (3 columns on desktop, 1 on mobile)

2. **Conviction History Timeline**
   - BELOW the header, THE Record_Profile SHALL display conviction history as a vertical timeline (left line, events to right on desktop; stacked single column on mobile)
   - EACH conviction in timeline SHALL display: case_number, offense_description, offense_category (badge with category color), charge_date, verdict (conviction_status), sentence_description
   - WHEN user hovers over a conviction item, THE item SHALL highlight with subtle background color shift (Glass_Hover) and show "View Details" button (cursor: pointer)
   - WHEN user clicks on a conviction item, THE System SHALL expand the item to show full details: statute_violated, court_name, judge, prosecutor, defense_counsel, arrest_date, conviction_date, sentence_dates, fine_amount, prison_facility, arresting_officer

3. **Record Sections & Tab Navigation**
   - THE Record_Profile SHALL organize information in tabs: Overview (default), Convictions, Verifications, Related_Records, Audit_Trail
   - THE Tab bar SHALL be sticky (fixed) when user scrolls (positioned below header, remains visible at viewport top)
   - WHERE user has 'administrator' role, THE Tab bar SHALL include additional tabs: Edit_Record, Manage_Flags
   - WHEN user clicks a tab, THE System SHALL transition to that tab's content with fade-in animation (150ms, opacity 0→1)

4. **Related Records & Duplicates**
   - THE Related_Records tab SHALL display any flagged duplicates (from duplicate_flags table where status != 'false_positive')
   - EACH duplicate SHALL display: linked_record_id, full_name, similarity_score (0–100 as progress bar), matching_fields (chip list), review_status (admin only: Pending, Confirmed, Dismissed)
   - WHERE a duplicate is confirmed_duplicate, THE Related_Records section SHALL display warning banner: "This record may be a duplicate of [Record ID]. Contact an administrator to merge."
   - WHEN user (admin) clicks "Review" on a duplicate flag, THE System SHALL navigate to duplicate resolution page with side-by-side record comparison

5. **Verification Request History**
   - THE Verifications tab SHALL list all verification_requests linked to this record with columns: reference_id, requested_by (officer name), request_date, verification_status (badge), confidence_score
   - EACH verification request SHALL be clickable and expand to show submitted data (submitted_national_id, submitted_full_name, submitted_dob) and mismatch_fields (if any)
   - THE Verifications tab SHALL display filtering options: Status (All, Verified, Pending, Mismatch), Date Range (Last 7 days, 30 days, 90 days, All)

6. **Record Edit Controls (Admin Only)**
   - WHERE user has 'administrator' role, THE Record_Profile page SHALL display an "Edit Record" button (top-right)
   - WHEN admin clicks "Edit Record", THE System SHALL display an inline edit mode (form overlay, glassmorphic background) with editable fields: full_name, aliases, address, notes, status (dropdown), risk_level (slider 1–5)
   - WHEN admin clicks "Save Changes", THE System SHALL validate changes, update criminal_records table, create audit_log entry (action: 'update', old_values, new_values), and display success toast
   - WHERE user attempts to edit a field without permission, THE field SHALL be disabled (read-only, opacity 50%) with tooltip: "You lack permission to edit this field"

7. **Record Audit Trail**
   - THE Audit_Trail tab SHALL display all audit_log entries related to this criminal_record_id with columns: timestamp (sortable), user (officer name + role), action (create, read, update, delete, verify), changes (expandable: old_value → new_value)
   - THE Audit_Trail SHALL display filtering by action type and date range
   - WHERE audit entry describes a sensitive action (delete, sensitive field update), THE entry SHALL display a warning icon (AlertTriangle, color: Critical_Red)

8. **Record Profile Responsiveness & Performance**
   - WHEN record data is loading, THE Record_Profile page SHALL display Skeleton_Loaders (photo placeholder, text placeholders) to prevent layout shift
   - WHEN viewport width is less than 640px, THE layout SHALL stack vertically: photo/header stacked, tabs displayed as scrollable horizontal row
   - THE Record_Profile page SHALL lazy-load related records, verifications, and audit trail (tabs load content on-demand to improve initial load time)
   - THE conviction timeline SHALL display animated scroll-in effect (slide-left animation, 200ms staggered) when timeline becomes visible in viewport (Intersection Observer)

---

### Requirement 6: Analytics Dashboard

**User Story:** As a system administrator, I want to view aggregated verification metrics and officer activity trends, so that I can monitor system health and identify bottlenecks in the verification workflow.

#### Acceptance Criteria

1. **Analytics Dashboard Layout**
   - THE Analytics_Dashboard (/analytics) SHALL display a 4-column grid of metric cards on desktop, responsive to 2 columns on tablet, 1 column on mobile
   - THE Dashboard top section SHALL display a date range filter: "Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom Range" (with date picker)
   - WHEN user selects a date range, THE entire dashboard SHALL requery data and update all metrics with smooth transition animation (200ms fade + scale)
   - THE Dashboard SHALL display controls to export analytics data: "Export as CSV", "Export as PDF" buttons (top-right)

2. **Core Metrics & KPIs**
   - THE Dashboard SHALL display metric card 1: "Total Verifications" (large number, trend indicator: ↑12% from previous period in Success_Green or ↓8% in Critical_Red), small chart (sparkline, 6-month trend)
   - THE Dashboard SHALL display metric card 2: "Verification Success Rate" (percentage 0–100%, filled progress ring in Aurora_Gradient, benchmark line at 95%)
   - THE Dashboard SHALL display metric card 3: "Average Verification Time" (time in minutes:seconds, comparison to benchmark, histogram chart showing distribution)
   - THE Dashboard SHALL display metric card 4: "High-Risk Records Flagged" (count, percentage of total, mini pie chart: Low/Medium/High/Critical proportions in color-coded segments)
   - THE Dashboard SHALL display metric card 5: "Records Archived" (count, percentage, trend)
   - THE Dashboard SHALL display metric card 6: "Duplicate Matches Detected" (count, percentage confirmed as actual duplicates)

3. **Officer Activity & Performance Metrics**
   - THE Analytics_Dashboard SHALL display a "Top Performing Officers" section: table with columns: Officer_Name, Role, Verification_Count, Success_Rate (%), Average_Time, Accuracy_Score (0–100)
   - EACH officer row SHALL be sortable by any column; default sort by Success_Rate (descending)
   - WHERE user clicks on an officer row, THE System SHALL display detailed officer profile: total verifications, breakdown by status, recent activities timeline, accuracy trends
   - THE table SHALL paginate at 10 rows per page with navigation controls (Previous, Next, page indicator "Page 1 of 3")

4. **Verification Workflow Funnel**
   - THE Dashboard SHALL display a "Verification Funnel" visualization: stacked bar chart showing progression from submitted_requests → verified_matches → confidence_score_levels
   - EACH funnel stage SHALL display absolute count and percentage of total
   - WHEN user hovers over a funnel segment, THE System SHALL highlight the segment and display tooltip with detailed breakdown (e.g., "High Confidence: 845 (68.2%)")
   - WHEN user clicks a funnel segment, THE System SHALL navigate to Verification_Centre with pre-applied filter (e.g., status='verified', confidence_score>85)

5. **Offense Category Distribution**
   - THE Dashboard SHALL display a "Cases by Offense Category" visualization: donut chart with segments for each offense_category (violent_crime, property_crime, drug_offense, financial_crime, cybercrime, sexual_offense, terrorism, organized_crime, traffic_offense, other)
   - EACH segment SHALL be colored with a distinct color from a color palette (not aurora gradient, distinct hues)
   - WHEN user clicks on a segment, THE System SHALL filter the dashboard to show metrics for only that offense_category
   - THE chart SHALL display legend (category name, count, percentage) below or to the right of chart

6. **Verification Status Timeline**
   - THE Dashboard SHALL display a "Verification Status Over Time" line chart (X-axis: date, Y-axis: count of verifications by status: Verified, Pending, Mismatch)
   - THE chart SHALL display 3 distinct lines (colors: Verified_Green, Pending_Amber, Mismatch_Red) with markers at each data point
   - WHEN user hovers over a data point, THE chart SHALL display tooltip showing date and exact counts for all statuses
   - THE chart SHALL default to 30-day view; user can change to 7-day, 90-day, or 1-year via radio buttons

7. **Analytics Responsiveness & Performance**
   - WHEN analytics data is loading, THE Dashboard SHALL display Skeleton_Loaders for all metric cards (animated gray boxes)
   - THE Analytics_Dashboard SHALL implement lazy-loading for charts: charts render only when they become visible in viewport (Intersection Observer)
   - WHEN user exports data, THE System SHALL show a progress toast: "Preparing export..." and upon completion: "Export complete. Download started."
   - THE Dashboard SHALL cache analytics data for 5 minutes; if user requests same date range within 5 minutes, data is served from cache without database query

---

### Requirement 7: Audit Logs Interface

**User Story:** As a compliance officer, I want to search and filter all system actions by user, action type, and date, so that I can conduct forensic investigations and verify regulatory compliance.

#### Acceptance Criteria

1. **Audit Logs Table Interface**
   - THE Audit_Logs_Page (/audit-logs) SHALL display a filterable table with columns: Timestamp, User (Officer Name + Role), Action, Table_Affected, Record_ID, Changes (expandable), IP_Address (admin only)
   - THE Table SHALL display rows as sortable headers; default sort: Timestamp descending (most recent first)
   - THE Table SHALL paginate at 25 rows per page with standard pagination controls (Previous, Next, page indicator, "Jump to page" input)
   - WHEN user clicks on a table row, THE System SHALL expand to show full audit details: user_id, session_id, user_agent, old_values (JSON), new_values (JSON)

2. **Audit Logs Filtering & Search**
   - THE Audit_Logs_Page SHALL display a filter sidebar (left, width: 280px on desktop; collapsed into drawer on mobile): filter sections: User (multi-select), Action (checkboxes: create, read, update, delete, login, logout, verify, generate_report, flag_duplicate, resolve_duplicate, export), Date_Range, Table_Name
   - WHEN user selects filters, THE Table shall requery in real-time (with debounce 300ms) and update rows
   - THE Audit_Logs_Page SHALL display a search box (top of table): searches across user_name, record_id, description fields with full-text search (partial matches supported)
   - WHERE search returns no matches, THE System SHALL display empty state: "No audit logs match your search. Try adjusting your filters."

3. **Audit Logs Change Delta Display**
   - WHEN user clicks "View Changes" on an audit entry with action 'update', THE System SHALL display old_values and new_values side-by-side (before → after) with highlighted differences
   - WHERE a field value changed, THE System SHALL highlight the changed field: old value in red strikethrough, new value in green with background highlight
   - WHERE a value did not change, THE System SHALL display grayed-out text indicating "No change"
   - THE Changes view SHALL use fixed-width font (monospace) to preserve formatting of JSON and structured data

4. **Audit Logs Sensitive Action Highlighting**
   - WHERE audit entry action is 'delete', THE row SHALL display a red warning icon (AlertTriangle) and background color subtle red tint
   - WHERE audit entry action is 'generate_report', THE row SHALL display an export icon (DownloadCloud)
   - WHERE audit entry action is 'login', THE row SHALL display a login icon (LogIn), but no old_values/new_values (not applicable)
   - WHERE audit entry involves sensitive field update (e.g., risk_level, is_repeat_offender status), THE Changes panel SHALL highlight the sensitive nature with banner: "⚠️ Sensitive field modified"

5. **Audit Logs Export & Reporting**
   - THE Audit_Logs_Page SHALL display "Export Audit Trail" button (top-right): generates CSV file with all visible rows (respecting current filters) with columns: timestamp, user_name, user_role, action, table_name, record_id, old_values, new_values, ip_address
   - WHEN user clicks "Export", THE System SHALL generate export in background and display success toast with download link
   - WHEN user clicks "Generate Report", THE System SHALL display modal with options: Report_Type (Activity_Summary, Compliance_Report, High-Risk_Actions), Date_Range, Format (PDF, Excel)
   - WHERE user selects "Compliance Report", THE System SHALL generate a formatted PDF document with executive summary, charts showing action distribution, high-risk activity timeline, officer activity summary

6. **Audit Logs Real-Time Updates (Admin Only)**
   - WHERE user is viewing Audit_Logs_Page and a new audit entry is created elsewhere in system, THE Table SHALL display a subtle notification bar (top): "New audit entries available. [Refresh]" button
   - WHEN user clicks "Refresh", THE Table SHALL fetch latest entries (last 25 rows) and display with slide-down animation (200ms)
   - THE Notification bar shall auto-dismiss after 8 seconds if user does not click refresh

7. **Audit Logs Accessibility & Performance**
   - THE Table SHALL support keyboard navigation: Tab to move through table rows, Enter to expand row, Escape to collapse
   - THE Table header cells SHALL include aria-sort attributes (ascending, descending, none) for screen reader compatibility
   - WHERE table is loading audit data, THE System SHALL display Skeleton_Loaders (animated gray boxes) for each row to prevent layout shift
   - THE Audit_Logs_Page shall implement virtual scrolling (virtualization) for tables with >1000 rows to maintain performance (only visible rows are rendered)

---

### Requirement 8: User Management Interface (Admin Only)

**User Story:** As a system administrator, I want to create, update, and deactivate user accounts with role assignments, so that I can manage officer access and maintain security compliance.

#### Acceptance Criteria

1. **User Management Page Layout**
   - THE User_Management_Page (/admin/users) SHALL be restricted to users with 'administrator' role; non-admins redirected to Dashboard with toast: "Administrator access required"
   - THE Page SHALL display a two-panel layout: Users_List on left (60% desktop width), User_Details on right (40% desktop width)
   - THE Users_List panel SHALL display a table with columns: Employee_ID, Full_Name, Email, Role, Department, Is_Active (toggle), Last_Login_At
   - THE Table SHALL support sorting by any column; default sort: Full_Name ascending

2. **User List Filtering & Search**
   - THE Users_List panel SHALL display filter controls above table: Role (multi-select: Administrator, Police_Officer, Court_Officer, Prison_Officer), Status (Active, Inactive), Department (text input for partial match)
   - THE Users_List panel SHALL display search box: searches by Full_Name, Email, Employee_ID
   - WHEN user applies filters, THE Table shall requery and display matching users with updated row count indicator: "Showing [N] of [Total] users"

3. **Create New User**
   - THE Users_List panel top right SHALL display "Create User" button (style: primary button with Add icon from Lucide React)
   - WHEN admin clicks "Create User", THE User_Details panel right side SHALL switch to creation form with empty fields: Employee_ID, Full_Name, Email, Password (auto-generated, copyable), Role (dropdown), Department (text), Station (text), Rank (text), Phone
   - WHEN admin clicks "Save New User", THE System SHALL validate: Employee_ID unique, Email unique, Full_Name not empty, Role selected
   - WHEN validation succeeds, THE System SHALL create profile record via server action, generate temp password, log audit entry (action: 'create'), display success toast: "User created. Password copied to clipboard."
   - WHEN validation fails, THE System SHALL display inline red error messages for each invalid field

4. **Edit User Profile**
   - WHEN admin clicks on a user row, THE User_Details panel right side SHALL display user's current information in editable form fields: Full_Name, Email, Role, Department, Station, Rank, Phone, is_active (toggle)
   - WHEN admin updates a field and clicks "Save Changes", THE System SHALL validate changes, update profiles table, create audit_log entry (action: 'update'), display success toast
   - WHERE a field is not changed, THE audit entry SHALL not include unchanged fields in old_values/new_values
   - WHEN admin toggles is_active OFF, THE System SHALL display confirmation dialog: "Deactivating this user will immediately revoke their access. Sessions will be terminated. Continue?" with Cancel/Deactivate buttons

5. **User Deactivation & Session Management**
   - WHEN admin confirms deactivation of a user, THE System SHALL set is_active=FALSE, update updated_at timestamp, invalidate all active sessions for that user, log audit entry (action: 'update', old_values: {is_active: true}, new_values: {is_active: false})
   - WHEN a deactivated user attempts to access the system, THE System SHALL reject the request at RLS policy level (is_active_user() returns FALSE) and redirect to login with message: "Your account has been deactivated. Contact your administrator."
   - WHEN admin re-activates a deactivated user (toggles is_active back ON), THE System SHALL set is_active=TRUE, log audit entry, and display success toast: "User account reactivated"

6. **Password Management**
   - THE User_Details panel edit form SHALL display "Reset Password" button (only visible when editing existing user)
   - WHEN admin clicks "Reset Password", THE System SHALL generate a temporary password, send it to user's email address (via backend service, not implemented in UI but logged in audit trail), display toast: "Temporary password sent to [email]. User must change password on next login."
   - WHERE user logs in with temporary password, THE System SHALL force password change (redirect to /change-password with non-bypassable form) before allowing access to any other page

7. **User Activity & Last Login Tracking**
   - THE Users_List table column "Last_Login_At" SHALL display last login timestamp in human-readable format: "2 hours ago", "Yesterday", "3 days ago", or specific date if older than 7 days
   - WHEN admin hovers over Last_Login_At value, THE System SHALL display tooltip with precise timestamp: "Last login: 2026-06-22 14:35:47 UTC"
   - THE User_Details panel right side SHALL display additional stats (when user selected): Total_Verifications, Accuracy_Score, Total_Actions, Trending_Activity (sparkline chart of activity over last 30 days)

8. **User Management Accessibility**
   - THE User_Details form fields SHALL have associated labels with bold text (14px, Body_Regular) with asterisk (*) for required fields
   - WHEN admin focuses on a form input, THE Input_Field SHALL display focus ring (3px outline, Aurora_Gradient)
   - THE User_List table SHALL be navigable via keyboard: Tab to move through rows, Enter to select/expand user, Escape to deselect
   - THE Create User and Save Changes buttons SHALL display loading state with spinner during submission, preventing double-click submission

---

### Requirement 9: Visual Design & Micro-Interactions

**User Story:** As a user, I want smooth, purposeful animations and transitions that guide my attention and provide feedback, so that the interface feels premium and responsive without distracting from my work.

#### Acceptance Criteria

1. **Micro-Interaction Timing & Easing**
   - THE System SHALL use consistent animation timings: Fast (100ms) for micro-interactions (hover scale, focus ring), Normal (200ms) for transitions (page fade, modal open), Slow (300ms) for complex animations (scroll reveals, timeline cascades), Transition (400ms) for major navigation
   - THE System SHALL use consistent easing functions: easeInOut for smooth default transitions, easeOut for attention-drawing animations, easeIn for dismissals
   - WHERE animation duration > 200ms, THE System SHALL support prefers-reduced-motion media query (disabled animations for users who opted out in OS accessibility settings)
   - WHEN button receives hover state, THE button background SHALL shift to Glass_Hover and scale to 102% within 100ms using easeOut easing

2. **Loading States & Skeleton Screens**
   - WHEN page or component data is loading, THE System SHALL display Skeleton_Loaders matching final layout structure (same dimensions, placeholder gray boxes with animation)
   - EACH Skeleton_Loader SHALL display a subtle shimmer effect (left-to-right light gradient sweep, 1.5 second duration, repeating)
   - WHERE multiple skeleton loaders are stacked, THE System SHALL apply staggered animation: each loader shimmer starts 100ms after the previous (creating cascading effect)
   - WHERE skeleton loader represents text, THE System SHALL render multiple lines (varying widths: 100%, 85%, 95%) to mimic paragraph layout

3. **Focus Ring & Keyboard Navigation**
   - THE System SHALL display consistent focus rings on all interactive elements (buttons, inputs, links, checkboxes): 3px solid outline, color: Aurora_Gradient teal (#14b8a6), offset: 2px
   - WHEN user tabs through interactive elements, THE focus ring SHALL be visible at all times (not removed on click like some browsers default)
   - WHERE user is navigating via keyboard (not mouse), THE focus ring SHALL remain visible; if navigating via mouse, focus ring may be hidden during click (focus-visible CSS pseudo-class)
   - THE System SHALL display focus ring on custom components (cards, table rows) when users tab to them, using consistent styling

4. **Hover & Active States**
   - WHERE component receives hover state (mouse over, not touch), THE component background SHALL transition to Glass_Hover (150ms easeOut) and shadow SHALL increase by 1 elevation level
   - WHERE button is clicked (active state), THE button background SHALL darken to Glass_Active (or equivalent darker shade) and scale to 98% (pressed effect)
   - WHERE link receives hover, THE link text color SHALL transition to Aurora_Gradient teal and underline SHALL appear (animated: width 0→100%, 150ms easeOut)
   - WHERE interactive element is disabled, THE element color SHALL fade to 50% opacity, background remove Glass effect, cursor change to 'not-allowed', and hover state disabled

5. **Toast Notifications**
   - WHEN system generates a toast notification, THE toast SHALL slide-in from top-right corner (slide-right animation, 200ms easeOut) and position itself in stack with 12px gap
   - THE toast SHALL display: icon (left, 20px), message text (14px, Body_Regular), optional action button (e.g., "Undo", "Retry"), close button (X icon, top-right)
   - AFTER toast duration (default 6 seconds for success, 10 seconds for error), THE toast SHALL slide-out (fade-out + slide-right, 150ms easeIn)
   - WHERE user hovers over toast, THE toast auto-dismiss timer SHALL pause; when mouse leaves, timer resumes

6. **Modal & Overlay Animations**
   - WHEN modal opens, THE modal backdrop SHALL fade-in (opacity 0→1, 200ms easeOut), THE modal card SHALL scale-in (scale 0.95→1, 200ms easeOut) with smooth timing to backdrop
   - WHEN modal closes, THE modal card and backdrop SHALL fade-out and scale-down together (scale 1→0.95, opacity 1→0, 150ms easeIn)
   - THE modal card SHALL use glassmorphism effect: Glass_Base background, Glass_Border border, backdrop-filter blur(10px)
   - WHERE modal content is loading, THE modal body SHALL display Skeleton_Loaders; modal remains open during load to prevent layout shift

7. **Page Transitions & Route Changes**
   - WHEN user navigates to a new page, THE new page content SHALL fade-in from 0 opacity with simultaneous scale-up (scale 0.98→1, 200ms easeOut)
   - WHEN user navigates away from a page, THE old page content SHALL fade-out with scale-down (scale 1→0.98, opacity 1→0, 150ms easeIn)
   - THE Sidebar active menu item accent bar SHALL animate to new position (slide-down/up, 200ms easeOut) as user navigates
   - WHERE page uses breadcrumb navigation, THE breadcrumb SHALL update with fade-in animation (new item appears, 100ms)

8. **Glassmorphic Overlay Effects**
   - WHERE glassmorphism is used (modals, dropdowns, overlays), THE element background SHALL be Glass_Base (rgba(255, 255, 255, 0.08)) with Glass_Border (1px solid rgba(255, 255, 255, 0.15))
   - THE element backdrop-filter SHALL use blur(10px) for consistent frosted glass effect
   - WHERE element is in hover state, THE background SHALL shift to Glass_Hover (rgba(255, 255, 255, 0.12), 100ms easeOut)
   - THE glassmorphic element backdrop shall blend with background behind it (use backdrop-filter: blur exclusively, no shadow-only approach)

9. **Scroll & Reveal Animations**
   - WHEN user scrolls content into viewport, THE content elements (cards, rows, text blocks) SHALL animate in with slide-up effect (translate-y 20px→0, opacity 0→1, 300ms easeOut) using Intersection Observer
   - WHERE multiple elements are revealed (e.g., table rows, list items), THE reveal animation SHALL cascade: each element starts 50ms after previous
   - THE sticky header (Dashboard, Record Profile tabs) SHALL display shadow elevation increase animation (200ms easeOut) when user scrolls past threshold point
   - WHEN user scrolls back to top, THE sticky header shadow SHALL reduce back (200ms easeOut)

10. **Aurora Gradient Accent Animation**
    - WHERE aurora gradient is used as accent (aurora gradient buttons, accent lines, highlights), THE gradient SHALL have subtle animated color shift (hue rotation 0deg→360deg over 8 seconds, infinite loop) at reduced intensity (opacity changes 0.8→1.0)
    - WHEN aurora gradient element receives hover/focus, THE gradient animation speed SHALL increase (8s→3s) and opacity increase to full 1.0
    - THE aurora gradient animation SHALL pause when prefers-reduced-motion is enabled

---

### Requirement 10: Accessibility & Inclusive Design

**User Story:** As a user with visual or motor disabilities, I want the interface to be fully accessible via keyboard and screen readers, so that I can access criminal records and verification tools equally with all other officers.

#### Acceptance Criteria

1. **Keyboard Navigation & Focus Management**
   - THE System SHALL support full keyboard navigation: Tab/Shift+Tab to move through focusable elements, Enter/Space to activate buttons/checkboxes, Arrow keys to navigate lists/menus
   - THE System SHALL maintain logical tab order through page layout (top-to-bottom, left-to-right), respecting reading order
   - WHERE a modal or dropdown opens, THE keyboard focus SHALL move to first focusable element inside modal (focus trap); Tab/Shift+Tab cycle within modal only
   - WHEN modal closes, THE keyboard focus SHALL return to the element that opened the modal (focus restoration)
   - THE System SHALL display visible focus indicator (3px outline, Aurora_Gradient color) on all interactive elements when navigating via keyboard

2. **Screen Reader Support (ARIA Labels & Roles)**
   - THE System SHALL include descriptive aria-label attributes on all icon-only buttons: "Submit Verification Request", "Delete Record", "Download Report", "Close Modal"
   - WHERE form inputs lack visible labels, THE System SHALL associate labels via htmlFor and id or use aria-label
   - WHEN form input contains validation error, THE System SHALL display role="alert" on error message and associate via aria-describedby
   - THE System SHALL use semantic HTML: <button> for buttons, <a> for links, <main>, <nav>, <section>, <article> for content landmarks
   - WHEN content is loaded dynamically (via server action), THE System SHALL announce update to screen readers via aria-live="polite": "Verification request submitted successfully"

3. **Color Contrast & Text Readability**
   - ALL text SHALL meet WCAG AA contrast requirements: 4.5:1 for body text, 3:1 for large text (18px+ bold or 24px+ regular) and UI components
   - THE System text colors: Primary_Text (#f8fafc, near-white on dark backgrounds), Secondary_Text (#cbd5e1, 70% opacity), shall maintain 4.5:1 contrast with dark backgrounds
   - WHEN displaying status badges (Success_Green, Warning_Amber, Critical_Red), THE badge text color shall contrast 3:1 minimum with badge background
   - THE System SHALL NOT rely on color alone to convey information; status indicators shall include icon, text label, and supporting context

4. **Motion & Animation Accessibility**
   - THE System SHALL respect prefers-reduced-motion CSS media query: when enabled, all animations reduce to instant (0ms) or very subtle (fade only, no scale/translate)
   - WHERE animation is essential to interface functionality (e.g., modals), THE animation SHALL still occur but simplified (fade only, no motion)
   - WHEN user enables prefers-reduced-motion, THE aurora gradient animations shall stop, loading skeleton shimmer effects shall become static, transitions become instant

5. **Form Accessibility**
   - ALL form inputs SHALL have associated labels (via <label htmlFor> or aria-label)
   - WHEN form input is required, THE label SHALL display asterisk (*) in critical red color with aria-required="true" on input
   - WHEN form input contains error, THE error message SHALL be displayed in red (4.5:1 contrast) with role="alert" and aria-describedby linking input to error message
   - THE Form error messages SHALL describe the issue and suggest correction: "Email format invalid. Expected format: name@domain.com"

6. **Table Accessibility**
   - THE Table header cells (<th>) SHALL include scope="col" attribute for column headers, scope="row" for row headers
   - WHERE table is sortable, THE Column header <th> SHALL display aria-sort attribute: "ascending", "descending", or "none"
   - WHEN user sorts table, THE screen reader announcement SHALL update aria-sort and announce: "Table sorted by [Column Name], [Ascending/Descending]"
   - THE Table pagination controls SHALL display aria-label: "Table pagination", with aria-current="page" on current page number

7. **Image & Icon Accessibility**
   - ALL images shall have descriptive alt text describing content and purpose: alt="John Smith, Police Officer, last login 2 hours ago" vs unhelpful alt="image"
   - WHEN icon is decorative (no semantic purpose), THE Icon aria-hidden="true" to hide from screen readers
   - WHEN icon conveys information (status indicator, warning), THE Icon shall have aria-label describing meaning: "High Risk - 5 stars"

8. **Mobile Accessibility**
   - WHEN interface is displayed on mobile device (<640px viewport), THE touch target sizes SHALL be minimum 44×44px for all interactive elements (buttons, inputs, links)
   - WHEN user activates a mobile menu or modal, THE System SHALL prevent body scroll (overflow: hidden) to maintain focus containment
   - WHEN user navigates via mobile screen reader (VoiceOver on iOS, TalkBack on Android), THE interface SHALL support voice commands: "Double-tap to activate", "Flick right to navigate"

9. **Error Messages & Recovery**
   - WHEN form submission fails, THE System SHALL announce error via screen reader: "Form submission failed. Please review the errors below."
   - EACH field error message SHALL be immediately discoverable by screen reader users without requiring additional navigation
   - WHEN user corrects an error and retries submission, THE System SHALL announce success: "Verification request submitted successfully. Reference number: [VRQ-20260622-00001] copied to clipboard."

10. **Accessibility Testing & Validation**
    - THE System design SHALL be validated against WCAG 2.1 AA standard using automated tools (axe DevTools, Lighthouse) and manual testing
    - THE System SHALL support keyboard-only navigation testing: user can complete entire workflow (login → create verification → view record) without mouse
    - THE System design SHALL be tested with screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
    - WHEN accessibility issue is discovered, THE team shall prioritize fixes in development phase before deployment

---

### Requirement 11: Responsive Design Implementation

**User Story:** As a mobile officer, I want the interface to adapt seamlessly from my phone to desktop, so that I can access criminal records and verification tools from any device.

#### Acceptance Criteria

1. **Mobile Layout (< 640px)**
   - WHEN viewport width is less than 640px, THE Sidebar navigation SHALL collapse to bottom tab bar (height: 64px, 5 touch-target buttons: Dashboard, Verification, Records, Analytics if admin, Menu)
   - WHEN viewport is mobile size, THE Header SHALL compress: logo hidden, title only displayed (14px instead of 20px), breadcrumbs displayed as single indicator (e.g., "Dashboard / Verifications" compressed)
   - WHEN viewport is mobile size, THE Page content SHALL display single-column layout: cards stack vertically, tables display scrollable horizontal cards instead of grid layout
   - WHEN user performs full viewport swipe right on mobile, THE System SHALL navigate backward in history (swipe-back gesture support)

2. **Tablet Layout (640px – 1023px)**
   - WHEN viewport width is 640–1023px, THE Sidebar SHALL remain visible but reduce width: 200px instead of 280px, labels abbreviated or hidden (icons only on hover tooltip)
   - WHEN viewport is tablet size, THE Grid layouts SHALL display 2 columns instead of 3 (metric cards on dashboard, etc.)
   - WHEN viewport is tablet size, THE Tables SHALL remain visible but with horizontal scroll for overflow columns (not collapsed to card view)
   - WHEN viewport is tablet size, THE Modal widths SHALL adjust: 90% of viewport instead of fixed 600px

3. **Desktop Layout (> 1024px)**
   - WHEN viewport width exceeds 1024px, THE Sidebar SHALL display full width (280px) with complete labels and icons
   - WHEN viewport is desktop size, THE Grid layouts SHALL display full 3-column layout with maximum content width of 1400px
   - WHEN viewport is desktop size, THE Tables SHALL display full grid layout with all columns visible (no horizontal scroll unless excessive data)
   - WHEN viewport is desktop size, THE Tooltips and dropdowns SHALL position intelligently: avoid screen edges, reposition if off-screen

4. **Font Size & Spacing Responsiveness**
   - WHEN viewport width is mobile (<640px), THE font sizes SHALL reduce by 10%: H1 32px→28px, H2 24px→21px, Body 16px→14px
   - WHEN viewport width is mobile, THE spacing values SHALL reduce by 15%: 16px gap→14px, 24px padding→20px, to fit more content
   - WHEN viewport width is mobile, THE touch targets (buttons, inputs) SHALL increase to 44×44px minimum to support accurate touch interaction
   - WHEN viewport width is tablet/desktop, THE font sizes and spacing return to full scale

5. **Image & Icon Responsiveness**
   - WHEN viewport is mobile, THE profile photo on Record Profile page SHALL reduce: 120px→80px diameter
   - WHEN viewport is mobile, THE Lucide React icons SHALL maintain 20px size (readable on small screens) instead of 24px
   - WHEN viewport changes, THE image and icon sizes SHALL transition smoothly (CSS max-width: 100%, height: auto for responsive images)
   - WHERE image is used in cards/tiles, THE image SHALL maintain aspect ratio and not distort on different screen sizes

6. **Table Responsiveness**
   - WHEN viewport is mobile (<640px), THE System SHALL convert table display to vertical card layout: each row displays as card with field: value stacked vertically
   - WHERE table exceeds viewport width on tablet (640–1023px), THE System SHALL display horizontal scroll with sticky first column (Employee ID, etc.)
   - WHEN viewport is desktop (>1024px), THE table displays normal grid with all columns visible
   - THE table card layout on mobile SHALL maintain all functionality: sorting (if applicable), row expansion, inline editing

7. **Modal & Overlay Responsiveness**
   - WHEN viewport is mobile, THE modal width SHALL be 95% of viewport instead of fixed 600px, with 12px margin on sides
   - WHEN viewport is mobile, THE modal padding interior SHALL reduce: 32px→20px to maximize content area
   - WHEN viewport is mobile, THE modal border-radius SHALL reduce: 16px→12px to fit screen better
   - WHERE modal content exceeds viewport height on mobile, THE modal content SHALL become scrollable internally (max-height: 90vh, overflow-y: auto)

8. **Breakpoint Testing & Validation**
   - THE System design SHALL be tested at standard breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)
   - THE System design SHALL test intermediate sizes: 640px, 1023px (breakpoint boundaries) to ensure smooth transitions
   - WHEN viewport is resized dynamically, THE layout SHALL reflow smoothly without layout shift or content jumping
   - THE System responsive behavior SHALL be validated in browser DevTools responsive design mode and on actual mobile devices

---

### Requirement 12: Performance & Loading Optimization

**User Story:** As a system administrator, I want the interface to load and perform smoothly with minimal database queries, so that officers can work efficiently without frustrating lag.

#### Acceptance Criteria

1. **Page Load Performance**
   - WHEN user navigates to any page, THE initial page load time shall not exceed 2 seconds for Core Web Vitals (LCP - Largest Contentful Paint)
   - WHEN page data is loading, THE System shall display Skeleton_Loaders immediately (within 100ms) to prevent loading state from appearing delayed
   - WHEN page assets load, THE System shall prioritize critical resources: HTML, CSS (above-the-fold), fonts; defer non-critical: animations, secondary images
   - THE System shall implement lazy-loading for below-the-fold content: images, off-screen components load only when scrolled into viewport

2. **Database Query Optimization**
   - WHEN Dashboard loads, THE System shall fetch only essential data in initial query (limit 20 records per page), defer full dataset fetch until user requests more
   - WHEN Record Profile page loads, THE System shall fetch criminal_records + profiles (creator/updater names) in single query using JOIN; defer convictions, verifications, audit logs to load on-demand via tab clicks
   - WHEN verification request is submitted, THE System shall use indexed queries on criminal_records (national_id_number, full_name fuzzy match, date_of_birth) to ensure sub-100ms query response
   - THE System database queries shall use appropriate indexes (reviewed in schema migration); n+1 query problems eliminated via batch loading or JOIN operations

3. **Component Code Splitting & Dynamic Imports**
   - THE System shall implement React.lazy() and Suspense for route-based code splitting: each page component loads its own bundle
   - WHEN user navigates to /analytics, THE analytics components (charts library, large visualization) load on-demand, not bundled with initial app
   - WHEN user navigates to /audit-logs, THE audit logs table component loads separately to avoid bloating main bundle
   - THE System bundle shall split into: main (routing, auth, core components ~100KB), dashboard (~50KB), verification (~50KB), records (~75KB), analytics (~120KB with charts), audit-logs (~60KB)

4. **Caching Strategy**
   - THE System shall cache static assets (images, icons, fonts) with HTTP cache headers: Cache-Control: public, max-age=31536000 (1 year for immutable assets)
   - WHEN user fetches dashboard metrics, THE System shall cache results for 5 minutes (redis or memory cache); subsequent requests within 5 minutes return cached data without database query
   - WHEN user views Audit_Logs with same filters, THE System shall cache results for 10 minutes; user refreshes within 10 minutes retrieve cached results
   - WHEN data changes (record updated, verification completed), THE System shall invalidate relevant caches to ensure fresh data

5. **API Response Optimization**
   - WHEN API returns list data (verifications, audit logs), THE System shall implement pagination: default 25 items per page
   - WHEN API returns large datasets, THE System shall compress responses using gzip (standard HTTP compression) and return only required fields (exclude unnecessary JSON keys)
   - WHEN API query includes related data (officer names, department info), THE System shall fetch data via single query with JOIN instead of multiple queries
   - THE API responses shall include response headers: Content-Type: application/json, Cache-Control (for caching rules)

6. **Image Optimization**
   - ALL profile images shall be optimized: max 200KB size, format WebP with JPG fallback, dimensions max 400×400px
   - WHEN images are displayed on Record Profile, THE System shall use responsive image sizes: display 120px on mobile, 200px on desktop; images served at appropriate resolution
   - WHEN images load, THE System shall use next/image component (if using Next.js) for automatic optimization, lazy-loading, AVIF format support
   - WHEN user uploads photo in Verification form, THE System shall compress (max 1MB) and convert to WebP before upload

7. **Animation Performance**
   - THE System animations shall use GPU-accelerated CSS properties (transform, opacity) only; avoid repainting properties (width, height, left, top)
   - WHEN user navigates between pages, THE page transition animation shall maintain 60fps (16ms per frame) without jank; monitored via browser DevTools Performance tab
   - WHEN skeleton loaders animate, THE shimmer effect shall use CSS animation or Framer Motion with optimized frame rate (not causing layout recalculation per frame)
   - THE System shall disable heavy animations (auto-playing aurora gradient animation, complex reveal animations) when user enables prefers-reduced-motion

8. **Network Optimization**
   - WHEN user submits verification request, THE System shall debounce search requests (300ms) to avoid sending request on every keystroke
   - WHEN table updates filters, THE System shall debounce filter changes (500ms) before triggering database query
   - THE System shall implement request batching: multiple API requests combined into single HTTP request where applicable (batch updates, bulk fetch)
   - WHEN user opens multiple tables/pages, THE System shall cancel previous in-flight requests if user navigates away before response completes

---

### Requirement 13: Security & Role-Based Access Control

**User Story:** As a security officer, I want to ensure the interface enforces role-based access at UI and database level, so that sensitive records and functions are properly restricted by officer role.

#### Acceptance Criteria

1. **Role-Based UI Visibility**
   - WHEN user with 'police_officer' role accesses system, THE Sidebar menu SHALL display only: Dashboard, Verification Centre, Records, Analytics (User Management hidden)
   - WHEN user with 'administrator' role accesses system, THE Sidebar SHALL display all menu items including: Audit Logs, User Management
   - WHEN user with 'court_officer' role views Audit Logs page, THE user SHALL see audit entries but NOT IP addresses or User Agent (sensitive to non-admins)
   - WHERE UI component requires 'administrator' role (e.g., Edit Record button, Delete button), THE component SHALL be hidden from non-admins or display as disabled with tooltip: "Administrator access required"

2. **Row-Level Security Enforcement**
   - WHEN user with 'police_officer' role queries criminal_records, THE database RLS policy SHALL return only records (no restriction in this system, but policy enforced)
   - WHEN user attempts to view audit_logs via API, THE RLS policy audit_logs_select SHALL enforce: user_id = auth.uid() OR is_admin() (user sees only own logs or all logs if admin)
   - WHEN user without 'administrator' role attempts to update a criminal record, THE RLS policy criminal_records_update SHALL enforce: get_user_role(auth.uid()) IN ('administrator', 'police_officer') and reject update
   - WHEN user without appropriate role attempts data access, THE System shall return Supabase 403 Forbidden error and log audit entry (action: 'read', with access denied note)

3. **Sensitive Data Masking**
   - WHEN user with 'police_officer' role views Record Profile, THE fingerprint_hash field SHALL display as masked: "••••••••••••••••" instead of actual hash value
   - WHERE system displays personal identification (national_id_number), THE last 4 digits SHALL be masked except for verification context: "63-6323979A**"
   - WHEN user without 'administrator' role views Audit Logs, THE IP_Address column SHALL not display; only admins see IP addresses
   - WHERE Audit_Trail displays old_values/new_values for sensitive fields (risk_level, status), THE display SHALL require admin role to expand and view change delta

4. **Action Authorization at Component Level**
   - WHEN user clicks "Delete Record" button, THE System SHALL verify admin role before allowing action
   - WHEN user attempts to "Generate Report", THE System shall verify user has 'police_officer' or 'administrator' role; prison_officer role cannot generate reports
   - WHEN user clicks "Reset User Password" (User Management), THE System shall verify 'administrator' role; non-admins cannot perform
   - WHERE user lacks permission, THE action button SHALL be disabled (opacity 50%, cursor: not-allowed) with tooltip explaining permission requirement

5. **Session Management & Token Handling**
   - WHEN user logs in, THE System shall issue session cookie (HttpOnly, Secure, SameSite=Strict) containing auth token
   - WHEN user logs out or session expires, THE auth token shall be invalidated; subsequent requests receive 401 Unauthorized
   - WHEN user closes browser tab, THE session remains active for up to 30 minutes (browser close does not auto-logout); after 30 inactive minutes, session auto-expires
   - WHEN user logs in from another device, THE previous session remains active (no forced logout from other device); user can maintain multiple concurrent sessions

6. **Audit Logging of Access**
   - WHEN user successfully logs in, THE System shall log audit entry: action: 'login', user_id, ip_address, user_agent, timestamp
   - WHEN user performs action (create, update, delete, verify, generate_report), THE System shall log audit entry with: user_id, user_role, action, table_name, record_id, old_values, new_values, timestamp
   - WHEN user accesses a record (read action), THE System shall log audit entry (action: 'read') only for sensitive records (criminal_records) not every GET request (performance consideration)
   - WHEN unauthorized access attempt occurs (RLS policy violation), THE System shall log attempt: user_id, denied_action, table_name, timestamp for compliance review

7. **Password Security**
   - WHEN user creates account or resets password, THE System shall enforce password requirements: minimum 12 characters, upper + lower + digit + special character
   - WHEN user enters password, THE System shall not display password in plaintext (input type="password")
   - WHEN user resets password via admin (User Management), THE System shall generate temporary password (16 random characters), send via email, require password change on next login
   - THE System shall use Supabase built-in password hashing (bcrypt) for secure storage; passwords never logged or exposed in audit trail

8. **API Endpoint Protection**
   - ALL server actions (server-side mutations) shall include authentication check: verify auth.uid() exists and is active user
   - ALL API endpoints shall include role check: verify user role sufficient for operation before executing business logic
   - ALL API responses shall be rate-limited: max 100 requests per minute per user IP (brute-force prevention)
   - WHEN API receives invalid/expired auth token, THE response shall be 401 Unauthorized without revealing detailed error message

---

### Requirement 14: Error Handling & User Feedback

**User Story:** As a user, I want clear error messages and helpful guidance when something goes wrong, so that I can recover quickly and understand what happened.

#### Acceptance Criteria

1. **Error Message Clarity**
   - WHEN form submission fails, THE System shall display error message in clear language: "Email address is already in use. Please choose a different email or use the login page to access an existing account."
   - INSTEAD of technical error: "Duplicate key violation on profiles.email" or "Error code PGRST999"
   - WHEN database query fails, THE System shall display user-friendly message: "Unable to load records. Please check your internet connection and try again." instead of database error stack
   - WHEN API error occurs, THE System shall provide actionable next step: "Failed to submit verification request. [Retry] [Contact Support]"

2. **Form Field Validation Messages**
   - WHEN user enters invalid email format, THE System shall display inline error: "Invalid email format. Expected: name@domain.com"
   - WHEN user enters password that doesn't meet requirements, THE System shall display specific error: "Password must be at least 12 characters and include uppercase, lowercase, number, and special character."
   - WHEN required field is empty on form submit, THE System shall display error: "Full Name is required" (not generic "Field required")
   - WHEN field has validation error, THE System shall highlight field with red border (3px solid Critical_Red #dc2626) and display error message in red text (12px) below field

3. **Network Error Recovery**
   - WHEN user loses internet connection, THE System shall display banner notification (top of page): "No internet connection. Some features may not work. [Retry]" (sticky, semi-transparent background)
   - WHEN user regains internet connection, THE notification banner shall auto-dismiss with success animation
   - WHEN API request fails due to network timeout, THE System shall display toast: "Request timed out. Please try again." with automatic retry option or manual [Retry] button
   - WHEN user clicks [Retry], THE System shall re-submit failed request without requiring user to re-fill form

4. **Empty State Messages**
   - WHEN user searches records and no matches found, THE System shall display empty state: "No records found for '[Search Term]'. Try searching by national ID number or officer badge." (with suggestion)
   - WHEN user views Analytics dashboard and no data available, THE System shall display: "No data available for selected date range. Try selecting a longer date range or different filters."
   - WHEN user navigates to a page for first time (no records created yet), THE System shall display empty state with call-to-action: "No verification requests yet. [Create One] to get started."
   - THE empty state message font size shall be Body_Regular (14px) in text_secondary color with supporting icon (Lucide React icon relevant to context)

5. **Confirmation Dialogs**
   - WHEN user attempts destructive action (delete record, deactivate user), THE System shall display confirmation modal: "Are you sure? This action cannot be undone."
   - THE confirmation modal SHALL provide clear action buttons: [Cancel] (secondary button), [Delete] (danger button, red, Critical_Red color)
   - WHEN user clicks [Delete], THE System shall proceed with deletion, display success toast, and navigate user away from deleted resource
   - WHERE deletion involves multiple records (bulk delete), THE System shall display: "Delete [N] records? This cannot be undone." with count specified

6. **Loading & In-Progress States**
   - WHEN form submission is processing, THE submit button SHALL display loading spinner (rotating icon) and become disabled to prevent double-click
   - WHEN page navigation is pending, THE System shall display progress indicator (thin loading bar at top of viewport, 3px height, Aurora_Gradient color, animation: left-to-right sweep)
   - WHERE operation takes >3 seconds, THE System shall display additional feedback: "Processing... this may take a few moments" to set user expectations
   - WHEN long-running operation completes, THE System shall clear loading indicator with fade-out animation and display result

7. **Success Feedback**
   - WHEN verification request submitted successfully, THE System shall display success toast (top-right): "✓ Verification request submitted (Reference: VRQ-20260622-00001)" (green background, white text, checkmark icon)
   - WHEN record created successfully, THE System shall display success toast: "✓ New criminal record created (Record ID: CR-1234567A89)" with option to view created record
   - WHEN user updates profile settings, THE System shall display success banner: "✓ Changes saved successfully" with fade-out after 4 seconds
   - ALL success messages shall use Success_Green (#10b981) color for background/icon to provide clear visual distinction from errors

8. **Warning & Caution Messages**
   - WHEN duplicate record flag is detected during verification, THE System shall display warning alert: "⚠ Potential duplicate detected. This person may already be in the system under a different record. Review related records below before proceeding."
   - WHERE audit trail shows sensitive changes, THE System shall display warning badge: "⚠ Sensitive field modified" when viewing change delta
   - WHEN record is marked "Flagged" status, THE System shall display warning banner on Record Profile: "⚠ This record is flagged for review. Contact an administrator for details."
   - THE warning messages shall use Warning_Amber (#f59e0b) color to indicate caution without critical severity

---

### Requirement 15: Design System Documentation & Component Usage

**User Story:** As a developer implementing the UI, I want clear documentation of component usage, props, examples, and accessibility guidelines, so that I can build features consistently and efficiently.

#### Acceptance Criteria

1. **Component Documentation Structure**
   - THE Design_System documentation shall include component library reference with entry for each component: Button, Input, Select, Checkbox, Radio, Textarea, Card, Modal, Badge, Toast, Table, Skeleton_Loader, Sidebar, Header
   - EACH component documentation SHALL include: component name, description, visual preview (screenshot/Storybook), props table (name, type, required/optional, default, description), code example, accessibility notes
   - EACH component documentation SHALL include visual states: default, hover, focus, active, disabled, loading (where applicable)
   - THE documentation format shall be compatible with Storybook for interactive component explorer

2. **Button Component Documentation**
   - THE Button component documentation SHALL define prop: variant (values: 'primary', 'secondary', 'danger', 'ghost'), size (values: 'sm', 'md', 'lg'), disabled (boolean), loading (boolean), onClick (callback)
   - THE Button component SHALL display visual examples: primary button in default/hover/focus/active/disabled states, secondary button variants, danger button with red color
   - THE Button component accessibility notes SHALL mention: keyboard support (Enter/Space to activate), focus ring always visible, aria-label required for icon-only buttons
   - THE Button component code example SHALL show usage: <Button variant="primary" size="md" onClick={handleClick}>Submit</Button>

3. **Input Component Documentation**
   - THE Input component documentation SHALL define props: type (values: 'text', 'email', 'password', 'number', 'date'), placeholder, value, onChange, disabled, error (boolean), errorMessage (string), required
   - THE Input component documentation shall include visual examples: empty state, filled state, focus state (with focus ring), error state (with red border and error message below), disabled state
   - THE Input component code example shall show: <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={!!emailError} errorMessage={emailError} />
   - THE documentation shall note accessibility: label must be associated via <label htmlFor> or aria-label, error messages tied via aria-describedby

4. **Typography & Spacing Design Tokens**
   - THE Design_System documentation shall export TypeScript constants for typography: `export const FONT_SIZES = { h1: '32px', h2: '24px', h3: '20px', bodyLarge: '16px', bodyRegular: '14px', bodySmall: '12px', caption: '12px' }`
   - THE documentation shall export spacing constants: `export const SPACING = { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', xxl: '32px', xxxl: '48px' }`
   - THE documentation shall export color tokens: `export const COLORS = { primaryBlack: '#0a0e27', primaryDarkBlue: '#1a1f3a', surfaceDark: '#252d48', auroraGradient: 'linear-gradient(90deg, #7c3aed, #14b8a6, #10b981)', successGreen: '#10b981', criticalRed: '#dc2626', warningAmber: '#f59e0b' }`
   - DEVELOPERS shall use exported constants instead of hardcoding color/size values to maintain consistency

5. **Responsive Behavior Documentation**
   - THE Design_System documentation shall document responsive breakpoints: Mobile (<640px), Tablet (640–1023px), Desktop (>1024px)
   - THE documentation shall provide examples: "Grid layout displays 1 column on mobile, 2 columns on tablet, 3 columns on desktop using responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`"
   - THE documentation shall explain responsive image sizing: "Use responsive images with srcset to serve optimized image sizes per breakpoint"
   - DEVELOPERS shall test responsive behavior at breakpoint boundaries (375px, 640px, 1023px, 1440px) using browser DevTools

6. **Animation & Micro-interaction Guidelines**
   - THE Design_System documentation shall document animation timings: Fast (100ms), Normal (200ms), Slow (300ms), Transition (400ms)
   - THE documentation shall document easing functions: easeInOut (default smooth transitions), easeOut (attention-drawing), easeIn (dismissals)
   - THE documentation shall provide Framer Motion examples: `<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.2 }} />`
   - THE documentation shall mention prefers-reduced-motion support: animations disabled or simplified when user enables OS accessibility preference

7. **Accessibility Checklist**
   - THE Design_System documentation shall include accessibility checklist for component implementation:
     - [ ] Keyboard navigation: Tab/Shift+Tab/Enter/Space work correctly
     - [ ] Focus indicator: Visible 3px outline on all interactive elements
     - [ ] Screen reader: aria-label/aria-describedby/role attributes set where needed
     - [ ] Color contrast: 4.5:1 for text, 3:1 for UI components
     - [ ] Error handling: Error messages associated with form fields via aria-describedby
     - [ ] Loading states: Skeleton loaders prevent layout shift
     - [ ] Motion: prefers-reduced-motion supported

8. **Code Examples & Storybook Stories**
   - THE Design_System documentation shall include Storybook stories for each component with interactive props editor
   - EACH component story shall demonstrate: default state, all variants/sizes, disabled/loading states, interactive examples (click handlers, form inputs)
   - THE stories shall include responsive breakpoint preview: view component at mobile/tablet/desktop sizes side-by-side
   - THE documentation shall include integration examples: "How to use Select component in a form", "How to implement Table with sorting and pagination"

---

## Summary

The Premium Court UI Redesign feature transforms the Criminal Record Digital Verification System into a government-credible verification platform through a comprehensive design system, role-based access control, and professional visual identity. The requirements establish specific standards for dark spatial aesthetics, glassmorphic effects, aurora gradient accents, responsive behavior, accessibility, performance, and security. All requirements follow EARS patterns and INCOSE quality rules, ensuring clarity, testability, completeness, and positive statements free of ambiguity.

The feature is organized into 15 core requirement categories spanning design foundations, authentication, user flows (dashboard, verification, records, analytics, audit logs, user management), visual design principles, accessibility standards, responsive design, performance optimization, security controls, error handling, and design documentation. Implementation shall follow a phased approach: Phase 1 establishes design system and authentication, Phase 2 implements verification and record management, Phase 3 adds analytics and compliance features, Phase 4 optimizes mobile and polish. All implementation shall comply with Next.js 16, TypeScript, Tailwind CSS 4, Supabase RLS, and accessibility standards (WCAG 2.1 AA minimum).

