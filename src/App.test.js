import { render, screen } from '@testing-library/react';
import App from './App';

test('renders BotBridge application', () => {
  render(<App />);
  const appTitle = screen.getByText(/BotBridge/i);
  expect(appTitle).toBeInTheDocument();
});

test('renders login button when user is not authenticated', () => {
  render(<App />);
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});

test('renders welcome message for new chat', () => {
  render(<App />);
  const welcomeMessage = screen.getByText(/Hello! How can I help you today?/i);
  expect(welcomeMessage).toBeInTheDocument();
});
