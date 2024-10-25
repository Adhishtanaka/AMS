# AMS (Auction Management System)

A comprehensive web-based platform built with ASP.NET Core and React, designed to facilitate secure online car auctions with real-time bidding capabilities and integrated payment processing.

## Getting Started
Follow these steps to set up the project on your local machine.

### Prerequisites
- Visual Studio 2022
- Visual Studio Code
- MySQL Server
- Node.js and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/online-car-auction.git
   cd online-car-auction
   ```

2. Database Setup:
   ```bash
   # Open MySQL Workbench
   # Create database named 'ecomdb'
   # Configure connection string in ams-b/models/dbcon:
   connectionString = "Server=localhost;Port=3306;Database=ecomdb;Uid=root;Pwd=;"
   ```

3. Backend Setup (AMS-B):
   ```bash
   # Open solution in Visual Studio 2022
   # Restore NuGet packages
   # Build and run (Ctrl + F5)
   ```

4. Frontend Setup (AMS-F):
   ```bash
   cd AMS-F
   npm install
   npm run dev
   ```

### Configuration

1. JWT Authentication:
   - Configure JWT settings in backend configuration
   - Update frontend API endpoints

2. Email Notifications:
   - Configure SMTP settings in backend
   - Update email templates as needed

3. Payment Integration:
   - Set up Stripe API keys
   - Configure webhook endpoints


## Authors
- K.A.A.T Kulasooriya 
- H.P.G.D Mewan 
- T.M Uduwana 
- T.R.D.T. Dulshan 
- J.H.A.H Divyanjalee 
- D.P.H.J Samarawickrama 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
