# Decentralized API Selector

A client-side endpoint selector for the Libre blockchain that automatically finds and connects users to the fastest available API endpoint based on their network conditions and geographic location.  This is a proof of concept.

## Overview

This project provides a solution for automatically selecting the best performing API endpoint for Libre blockchain services. It works by:

1. Fetching a list of available endpoints from the Libre blockchain API
2. Testing each endpoint's response time and availability
3. Storing endpoint information in local storage for quick access
4. Automatically redirecting users to the fastest available endpoint

## Features

- **Dynamic Endpoint Discovery**: Automatically fetches and updates endpoint lists from the Libre blockchain
- **Performance Testing**: Tests each endpoint's response time and availability
- **Local Storage Caching**: Stores endpoint information locally for improved performance
- **Automatic Failover**: Can be configured to handle 4xx/5xx errors by switching to alternative endpoints
- **Service Type Support**: Supports multiple service types including:
  - Libre Explorer
  - Libre API
  - Libre Dashboard
  - Query Services
  - Seed Nodes

## How It Works

1. **Initial Load**:
   - Checks for local storage support
   - Retrieves endpoint list from `https://api.libre.cryptobloks.io/libre/getChainEndpoints`
   - Stores endpoint data in local storage

2. **Endpoint Testing**:
   - Tests each endpoint's response time
   - Verifies endpoint availability and content
   - Identifies the fastest responding endpoint

3. **Storage Management**:
   - Caches endpoint data in local storage
   - Manages endpoint expiration
   - Provides tools for clearing and managing stored data

## Usage

1. Include the script in your HTML:
```html
<script src="samples.js"></script>
```

2. Initialize with your application name:
```javascript
const applicationName = "libre-explorer"; // or other supported service type
```

3. The script will automatically:
   - Load and test endpoints
   - Store results in local storage
   - Redirect to the fastest endpoint

## Development

### Prerequisites

- Modern web browser with local storage support
- Access to Libre blockchain API endpoints

### Testing

The project includes several test functions:
- `testApplicationEndpoints()`: Tests all available endpoints
- `checkChainEndpoints()`: Verifies endpoint data
- `generateApplicationEndpoints()`: Creates application-specific endpoint lists

### Adding New Endpoints

New endpoints can be added by:
1. Updating the `bp.json` file with new endpoint information
2. Submitting the updated `bp.json` to the Libre blockchain
3. The API will automatically include new endpoints in the response

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Add appropriate license information here]

## Support

For support, please [add support contact information here]
