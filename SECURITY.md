u mu# Security Notes

## XSS Prevention in Markdown Rendering

### Overview
The `md()` helper function converts user-provided markdown to HTML with automatic XSS protection.

### Implementation
- **Library**: `league/commonmark` v2.8+ with `HTMLPurifier` v4.19+
- **Sanitization**: Two-stage approach
  1. CommonMark converts markdown to HTML with table support
  2. HTMLPurifier filters output to allow only safe tags
- **Configuration**:
  - `html_input: 'allow'` - Allows HTML processing
  - `allow_unsafe_links: false` - Blocks javascript: and data: URLs
  - **Allowed tags**: `p, br, strong, em, u, h1-h6, ul, ol, li, a[href], table, thead, tbody, tr, th, td, span, div, blockquote, code, pre`
  - **Blocked**: All script tags, iframe, object, embed, form, input, etc.

### Protected Fields
- `offer.additional_text` - Rendered in PDF offer views
- `invoice.additional_text` - Rendered in PDF invoice views

### Examples

#### XSS Protection
```php
// Input (malicious)
$markdown = "Hello <script>alert('XSS')</script> [Click](javascript:alert('XSS'))";
md($markdown);
// Output: "<p>Hello  </p>" (script tag removed, unsafe link stripped)
```

#### Allowed Features
```php
// Tables work
$markdown = "| A | B |\n|---|---|\n| 1 | 2 |";
md($markdown);
// Output: <table><thead>...</thead><tbody>...</tbody></table>

// Line breaks work
$markdown = "Line 1<br/>Line 2";
md($markdown);
// Output: <p>Line 1<br />Line 2</p>

// Safe HTML allowed
$markdown = "Text with <strong>bold</strong> and <em>italic</em>";
md($markdown);
// Output: <p>Text with <strong>bold</strong> and <em>italic</em></p>
```

### Validation
- `OfferTermsRequest`: Validates `additional_text` as string, max 65535 chars
- No pre-storage sanitization needed - markdown is safe to store raw
- Sanitization happens at render time via `md()` helper

### Testing XSS Protection
```bash
# Test in tinker
php artisan tinker

$markdown = "# Test\n<script>alert('xss')</script>\n[link](javascript:alert('xss'))";
echo md($markdown);
# Should output: <h1>Test</h1> with script tags stripped
```

## Last Updated
2026-01-09
