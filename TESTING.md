# Testing Bruno's Portfolio with TestSprite

This guide explains how to use TestSprite to test your portfolio website.

## Setup

1. **TestSprite MCP Server**: Already configured and connected
2. **Development Server**: Running on `http://localhost:8082/`
3. **Test Configuration**: `testsprite.config.js` contains test cases

## Key Testing Areas

### 1. Navigation Testing
- ✅ Mobile menu toggle functionality
- ✅ Smooth scrolling between sections
- ✅ Logo and navigation link interactions
- ✅ Responsive navigation behavior

### 2. Contact Section Testing
- ✅ Social media link functionality
- ✅ Button interactions and hover effects
- ✅ External link validation

### 3. Responsive Design Testing
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

### 4. Visual Regression Testing
- ✅ Brutalist design consistency
- ✅ Color scheme validation
- ✅ Typography and layout consistency

## Running Tests

Since TestSprite is configured as an MCP server, you can trigger tests through:

1. **Claude Code Interface**: Ask to run specific tests
2. **TestSprite Dashboard**: Access via the TestSprite platform
3. **Automated Testing**: Set up scheduled test runs

## Test Cases

The `testsprite.config.js` file defines comprehensive test cases covering:

- **Homepage Loading**: Basic functionality and component visibility
- **Mobile Menu**: Responsive navigation testing
- **Smooth Scrolling**: Navigation flow testing
- **Contact Section**: Social media and interaction testing
- **Responsive Design**: Multi-screen testing
- **External Links**: Link validation
- **Visual Consistency**: Design system validation

## Critical User Journeys

### Primary Flow
1. User visits homepage
2. Navigates through different sections
3. Tests mobile menu functionality
4. Reaches contact section
5. Interacts with social media links

### Mobile Flow
1. User visits on mobile device
2. Uses hamburger menu to navigate
3. Tests responsive layouts
4. Verifies touch interactions

## Recommended Testing Frequency

- **Before Deployment**: Full test suite
- **After Code Changes**: Relevant component tests
- **Weekly**: Complete regression testing
- **After Design Changes**: Visual consistency tests

## Test Success Criteria

- ✅ All navigation links work correctly
- ✅ Mobile menu functions properly
- ✅ Smooth scrolling operates as expected
- ✅ External links open in new tabs
- ✅ Responsive design works on all viewports
- ✅ Visual design remains consistent
- ✅ No console errors or warnings

## Next Steps

1. **Run Initial Test Suite**: Establish baseline
2. **Set Up Monitoring**: Continuous testing for changes
3. **Add Custom Tests**: Project-specific functionality
4. **Integration Testing**: Test with real data if applicable

## Troubleshooting

If tests fail:
1. Check development server is running on `http://localhost:8082/`
2. Verify all dependencies are installed
3. Check browser console for errors
4. Ensure no blocking network issues

## TestSprite Features Available

- **AI-Powered Test Generation**: Automatically create test cases
- **Visual Regression Testing**: Catch design inconsistencies
- **Cross-Browser Testing**: Verify compatibility
- **Performance Testing**: Monitor load times and interactions
- **Accessibility Testing**: Ensure WCAG compliance