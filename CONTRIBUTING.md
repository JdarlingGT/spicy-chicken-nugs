# Contributing to Spicy Chicken Nugs Dashboard

Thank you for your interest in contributing to the Graston Event Dashboard! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/spicy-chicken-nugs.git
   cd spicy-chicken-nugs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📋 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript-style JSDoc comments for documentation
- Maintain consistent naming conventions
- Keep components small and focused

### Testing Requirements
- Write tests for all new components
- Maintain test coverage above 70%
- Test both happy path and error scenarios
- Use React Testing Library best practices

### Component Structure
```jsx
// Component imports
import React, { useState, useEffect } from 'react';

// Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // State and hooks
  const [state, setState] = useState(initialValue);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### Error Handling
- Always implement proper error boundaries
- Provide meaningful error messages
- Include retry functionality where appropriate
- Log errors for debugging

## 🧪 Testing Guidelines

### Test Structure
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  test('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### Test Coverage Requirements
- **Components**: Test rendering, props, user interactions
- **Error Boundaries**: Test error catching and recovery
- **Utilities**: Test all functions with edge cases
- **Integration**: Test component interactions

## 🔄 Pull Request Process

### Before Submitting
1. **Run all tests**
   ```bash
   npm test
   ```

2. **Check code coverage**
   ```bash
   npm run test:coverage
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

4. **Update documentation** if needed

### PR Guidelines
- **Title**: Use descriptive titles (e.g., "Add error handling to EventAnalytics component")
- **Description**: Explain what changes were made and why
- **Tests**: Include tests for new functionality
- **Documentation**: Update README or other docs if needed

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Coverage maintained or improved

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📁 Project Structure

### Adding New Components
1. Create component file in `src/components/`
2. Create test file in `src/components/__tests__/`
3. Export from main component file
4. Update documentation

### File Naming Conventions
- **Components**: PascalCase (e.g., `EventDashboard.jsx`)
- **Tests**: Component name + `.test.jsx` (e.g., `EventDashboard.test.jsx`)
- **Utilities**: camelCase (e.g., `eventHelpers.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

## 🎯 Areas for Contribution

### High Priority
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Performance optimization
- [ ] Real API integration
- [ ] User authentication system

### Medium Priority
- [ ] Advanced analytics features
- [ ] Event CRUD operations
- [ ] Notification system enhancements
- [ ] Export functionality improvements

### Low Priority
- [ ] UI/UX improvements
- [ ] Additional chart types
- [ ] Theme customization
- [ ] Internationalization

## 📞 Getting Help

### Resources
- **Documentation**: Check README.md and component comments
- **Tests**: Look at existing tests for examples
- **Issues**: Search existing issues before creating new ones

### Communication
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Provide constructive feedback on PRs

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for contributing to making the Graston Event Dashboard better! 🔥🍗