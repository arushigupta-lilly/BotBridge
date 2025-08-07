/**
 * BotBridge Application Entry Point
 * =================================
 * 
 * Main application bootstrap file that initializes the React 19 application
 * with performance monitoring and strict mode development checks.
 * 
 * This file serves as the bridge between the HTML DOM and the React virtual DOM,
 * setting up the root rendering context for the BotBridge multi-agent chatbot interface.
 * 
 * @fileoverview Application entry point with React 19 initialization
 * @author Daniella Melero
 * @version 0.1.0
 * @since 2025-06-18
 * 
 * Key Features:
 * - React 19 Concurrent Features: Automatic batching, transitions, suspense
 * - Strict Mode: Development-time checks for deprecated APIs and side effects
 * - Performance Monitoring: Web Vitals tracking for Core Web Vitals metrics
 * - Global Styling: Base CSS imports for consistent theming
 * 
 * Dependencies:
 * - react ^19.1.0: Core React library with latest concurrent features
 * - react-dom ^19.1.0: React DOM renderer with createRoot API
 * - web-vitals ^2.1.4: Performance monitoring library
 */

// ========================================
// CORE REACT IMPORTS
// ========================================

/**
 * React library - Provides the component system and hooks
 * Version 19+ includes automatic batching and improved server components
 */
import React from 'react';

/**
 * ReactDOM Client API - Modern rendering API introduced in React 18+
 * Uses createRoot instead of legacy ReactDOM.render for better performance
 * Enables concurrent features like time slicing and selective hydration
 */
import ReactDOM from 'react-dom/client';

// ========================================
// APPLICATION IMPORTS
// ========================================

/**
 * Global CSS styles - Base styling and CSS custom properties
 * Includes:
 * - Font system configuration (system fonts with fallbacks)
 * - Global background gradients and color schemes
 * - Code block styling for technical content
 * - Anti-aliasing and font smoothing settings
 */
import './index.css';

/**
 * Main App component - Root component containing the entire application
 * Features:
 * - Multi-agent chatbot interface
 * - Eli Lilly authentication system
 * - Voice interaction capabilities
 * - Dark mode support
 * - Responsive design
 */
import App from './App';

/**
 * Performance monitoring utility - Tracks Core Web Vitals metrics
 * Monitors:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FID (First Input Delay): Interactivity responsiveness
 * - FCP (First Contentful Paint): Loading performance
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 */
import reportWebVitals from './reportWebVitals';

// ========================================
// APPLICATION INITIALIZATION
// ========================================

/**
 * Create React Root Container
 * 
 * Uses React 18+'s createRoot API instead of legacy ReactDOM.render
 * This enables concurrent features and better performance:
 * - Automatic batching of state updates
 * - Interruptible rendering for better user experience
 * - Better error boundaries and hydration
 * 
 * Targets the 'root' div element in public/index.html
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Render Application with Strict Mode
 * 
 * React.StrictMode provides additional development-time checks:
 * - Identifies components with unsafe lifecycles
 * - Warns about legacy string ref API usage
 * - Warns about deprecated findDOMNode usage
 * - Detects unexpected side effects during render
 * - Helps prepare for concurrent mode features
 * 
 * Note: StrictMode intentionally double-invokes functions in development
 * to help detect side effects. This is normal behavior and only happens
 * in development mode, not production.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ========================================
// PERFORMANCE MONITORING SETUP
// ========================================

/**
 * Initialize Web Vitals Performance Monitoring
 * 
 * Tracks Core Web Vitals metrics that are essential for user experience:
 * 
 * Metrics Tracked:
 * - CLS (Cumulative Layout Shift): Measures visual stability
 *   Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
 * 
 * - FID (First Input Delay): Measures interactivity
 *   Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
 * 
 * - FCP (First Contentful Paint): Measures loading performance
 *   Good: < 1.8s, Needs Improvement: 1.8-3.0s, Poor: > 3.0s
 * 
 * - LCP (Largest Contentful Paint): Measures loading performance
 *   Good: < 2.5s, Needs Improvement: 2.5-4.0s, Poor: > 4.0s
 * 
 * - TTFB (Time to First Byte): Measures server response time
 *   Good: < 0.8s, Needs Improvement: 0.8-1.8s, Poor: > 1.8s
 * 
 * Usage Examples:
 * - Development: reportWebVitals(console.log) to log metrics to console
 * - Production: reportWebVitals(sendToAnalytics) to send to analytics service
 * - Current: reportWebVitals() runs with default configuration
 * 
 * Learn more: https://web.dev/vitals/
 */
reportWebVitals();

/**
 * Development Notes:
 * ==================
 * 
 * 1. React 19 Features Used:
 *    - createRoot API for concurrent rendering
 *    - Strict Mode for development checks
 *    - Automatic batching for better performance
 * 
 * 2. Performance Considerations:
 *    - Web Vitals monitoring helps track user experience metrics
 *    - Strict Mode helps identify performance issues during development
 *    - Modern React APIs ensure optimal rendering performance
 * 
 * 3. Browser Compatibility:
 *    - Modern browsers supporting ES6+ (see package.json browserslist)
 *    - React 19 requires browsers with native support for modern features
 *    - Fallbacks handled by Create React App build process
 * 
 * 4. Development vs Production:
 *    - Strict Mode only affects development builds
 *    - Performance monitoring can be configured differently per environment
 *    - Source maps available in development for debugging
 */
