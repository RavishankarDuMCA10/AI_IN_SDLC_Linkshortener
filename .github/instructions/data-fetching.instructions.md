---
description: Read this file to understand how to fetch data in the project.
---

# Data Fetching Instructions

To fetch data in this project, follow these guidelines:

1. **Use the Fetch API**: For making HTTP requests, use the built-in Fetch API. It provides a simple and modern interface for fetching resources.
2. **Handle Errors**: Always handle errors when fetching data. Use try-catch blocks to catch any exceptions that may occur during the fetch operation.
3. **Use Async/Await**: When working with asynchronous code, use async/await syntax for better readability and maintainability.
4. **Cache Data**: If the data being fetched is not expected to change frequently, consider implementing caching mechanisms to improve performance and reduce unnecessary network requests.
5. **Use Environment Variables**: Store API endpoints and sensitive information in environment variables to keep them secure and easily configurable.
6. **Optimize Data Fetching**: Only fetch the data that is necessary for the current operation. Avoid fetching large amounts of data if only a subset is needed.
7. **Use Pagination**: If the API supports pagination, implement it to fetch data in smaller chunks, which can improve performance and reduce load on the server.
8. **Test Your Fetching Logic**: Write tests for your data fetching logic to ensure it works correctly and handles edge cases properly. Use mocking libraries to simulate API responses in your tests.
   By following these instructions, you can ensure that your data fetching logic is efficient, secure, and maintainable throughout the project.

## 1. Use Server components for Data Fetching

In Next.js, ALWAYS use Server components for data fetching. NEVER use Client Components to fetch data.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions. NEVER use raw SQL queries or other database libraries.
