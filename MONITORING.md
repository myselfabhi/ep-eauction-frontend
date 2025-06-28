# Real-Time Auction Monitoring

## Overview

The EP E-Auction platform now includes comprehensive real-time monitoring capabilities that connect to the actual backend data instead of using dummy data.

## Features

### 🎯 Real-Time Monitoring Dashboard
- **Live Auction Status**: Real-time display of auction status (Active, Paused, Ended)
- **Countdown Timer**: Accurate countdown based on auction end time
- **Live Bid Updates**: Real-time bid submissions with highlighting
- **Auction Control**: Pause/Resume functionality for active auctions

### 📊 Comprehensive Data Display
- **Auction Details**: Title, ID, status, timing, invited suppliers
- **Live Bids Ranking**: Real-time ranking of bids with cost breakdown
- **Summary Metrics**: Best landed cost, estimated savings, participation rate
- **Bid Timeline**: Historical bid activity with timestamps

### 🔧 Backend Integration
- **Real API Calls**: All data fetched from backend endpoints
- **Socket.IO Integration**: Real-time updates via WebSocket
- **Error Handling**: Proper error states and loading indicators
- **Type Safety**: Full TypeScript support

### 🚨 Paused Auction Management
- **Paused Auction Detection**: Visual indicators for paused auctions
- **Easy Resume Access**: Monitor button remains available for paused auctions
- **Paused Tab**: Dedicated tab to find paused auctions quickly
- **Alert Banner**: Prominent notification when auction is paused
- **Quick Resume**: One-click resume functionality

## API Endpoints Used

### Auction Monitoring
- `GET /api/auction/:id/monitoring` - Get monitoring data
- `GET /api/auction/:id` - Get auction details
- `GET /api/bid/ranking/:auctionId` - Get ranked bids
- `POST /api/auction/:id/pause` - Pause auction
- `POST /api/auction/:id/resume` - Resume auction

### Real-Time Events
- `newBid` - New bid submitted
- `auctionStatusChanged` - Auction status updated
- `joinAuction` - Join auction room for updates

## How to Use

### Accessing Monitoring
1. Navigate to the EP Dashboard
2. Find an active or paused auction in the table
3. Click the "Monitor" or "Resume" button next to the auction
4. You'll be taken to the real-time monitoring page

### Dashboard Navigation
- **All Tab**: View all auctions
- **Live Tab**: View only active auctions
- **Paused Tab**: View only paused auctions (NEW!)
- **Scheduled Tab**: View scheduled auctions
- **Completed Tab**: View ended auctions

### Monitoring Interface
- **Breadcrumb Navigation**: Easy navigation back to dashboard
- **Auction Header**: Shows auction title, ID, status, and timing
- **Paused Alert**: Prominent banner for paused auctions
- **Control Panel**: Pause/Resume buttons and live status indicator
- **Lot Tabs**: Switch between different lots (if applicable)
- **Summary Cards**: Key metrics at a glance
- **Bids Table**: Live ranking of all bids
- **Timeline**: Historical bid activity

### Real-Time Features
- **Auto-refresh**: Bids table updates automatically
- **Highlighting**: New bids are highlighted for 2 seconds
- **Auto-scroll**: Table scrolls to show new bids
- **Status Updates**: Auction status changes in real-time

### Paused Auction Workflow
1. **Pause Auction**: Click "Pause Auction" during monitoring
2. **Navigate Away**: Use breadcrumb or back button to return to dashboard
3. **Find Paused Auction**: Use "Paused" tab or search for the auction
4. **Resume Auction**: Click "Resume" button to continue monitoring
5. **Continue Monitoring**: Auction resumes and bidding continues

## Technical Implementation

### Frontend Components
- `EPMonitorAuctionPage` - Main monitoring page
- `AuctionTable` - Table with monitor/resume button
- `DashboardAuctionTable` - Dashboard integration with paused tab

### Services
- `auction.service.ts` - API service functions
- `socket.ts` - WebSocket connection management

### Types
- `Auction` - Auction data structure
- `Bid` - Bid data with ranking support
- `User` - User/supplier information

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://ep-backend-j7fq.onrender.com
```

### Socket.IO Setup
- Connects to main backend server
- Automatic room joining for auction-specific updates
- Graceful disconnection handling

## Error Handling

- **Loading States**: Proper loading indicators
- **Error Messages**: User-friendly error display
- **Fallback Data**: Graceful handling of missing data
- **Network Issues**: Automatic retry and reconnection

## Performance Considerations

- **Efficient Updates**: Only refresh necessary data
- **Debounced Events**: Prevent excessive API calls
- **Memory Management**: Proper cleanup of socket connections
- **Optimized Rendering**: Minimal re-renders for better performance

## Future Enhancements

- **Advanced Analytics**: Bid frequency, price trends
- **Export Functionality**: Download monitoring reports
- **Custom Alerts**: Notification system for specific events
- **Historical Data**: Past auction performance comparison
- **Multi-auction View**: Monitor multiple auctions simultaneously
- **Auction Notifications**: Email/SMS alerts for status changes 