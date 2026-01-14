/**
 * LESSON: Understanding Pagination in React
 * 
 * Pagination is a way to split large lists of data into smaller "pages"
 * so users can navigate through them easily.
 * 
 * Key Concepts:
 * 
 * 1. PAGE SIZE: How many items to show per page (we want 5)
 * 2. CURRENT PAGE: Which page the user is currently viewing (starts at 1)
 * 3. TOTAL PAGES: How many pages we need (totalItems / pageSize, rounded up)
 * 4. SLICING: Taking only the items for the current page from the full array
 * 
 * Example:
 * - We have 23 transactions total
 * - Page size is 5
 * - Total pages = Math.ceil(23 / 5) = 5 pages
 * 
 * Page 1: items 0-4   (slice(0, 5))
 * Page 2: items 5-9   (slice(5, 10))
 * Page 3: items 10-14 (slice(10, 15))
 * Page 4: items 15-19 (slice(15, 20))
 * Page 5: items 20-22 (slice(20, 25))
 * 
 * Formula for slicing:
 * startIndex = (currentPage - 1) * pageSize
 * endIndex = startIndex + pageSize
 * paginatedData = allData.slice(startIndex, endIndex)
 * 
 * The PaginationButton component should:
 * - Show Previous/Next buttons
 * - Show page numbers (current page, nearby pages, last page)
 * - Call onPageChange when user clicks a page
 * - Disable Previous on page 1
 * - Disable Next on last page
 */

// Example of how to calculate pagination:
const examplePagination = () => {
    const allItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const pageSize = 5;
    const currentPage = 2;
    
    // Calculate which items to show
    const startIndex = (currentPage - 1) * pageSize; // (2-1) * 5 = 5   Calculate where to start
    const endIndex = startIndex + pageSize; // 5 + 5 = 10  endIndex: where to STOP taking items (NOT included)

    const itemsForThisPage = allItems.slice(startIndex, endIndex);
    // Result: [6, 7, 8, 9, 10]
    
    // Calculate total pages
    const totalPages = Math.ceil(allItems.length / pageSize); // Math.ceil(12/5) = 3
  };