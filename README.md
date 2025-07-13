#<img src="Braincode_Logo.png" width="64"> Braincode

A modern web-based implementation of a classic color deduction puzzle game.

## 🎮 Game Overview

Braincode is a logic puzzle game where players attempt to guess a secret 4-color combination. After each guess, the game provides feedback to help narrow down the correct sequence.

**Objective**: Crack the secret color code in the fewest attempts possible!

## 🎯 How to Play

1. **Make a Guess**: Click on each slot to cycle through available colors (Blue, Green, Red, Orange, Yellow, Purple, Black)
2. **Submit**: Click "Guess" when you've selected 4 colors
3. **Interpret Feedback**: 
   - **Black peg**: Correct color in the correct position
   - **White peg**: Correct color in the wrong position
4. **Win**: Get all 4 colors in the correct positions!

## ✨ Features

- **Intuitive Interface**: Click-to-cycle color selection
- **Visual Feedback**: Clear peg system for guess evaluation
- **Game History**: Track all your previous guesses
- **Results Sharing**: Share your solving pattern with emoji representation
- **Responsive Design**: Works on desktop and mobile devices
- **Reset Functionality**: Start a new game anytime

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **No Dependencies**: Pure client-side implementation
- **Mobile-First**: Responsive layout for all screen sizes

## 📁 Project Structure

## 🚀 Deployment

This application is hosted as an **Azure Static Web App**, providing:
- Fast global CDN distribution
- Automatic HTTPS
- Custom domain support
- Seamless CI/CD integration

## 🔧 Development Setup

1. **Clone the repository**
2. **Open any of the application files in your favorite code editor**
3. **Open `index.html` in your web browser to test and play the game**

## 🎨 Game Logic

The game implements classic deduction:
- Secret combination generated from 7 available colors
- 4-slot guess validation
- Feedback calculation with exact and partial matches
- Win condition detection

## 🤝 Contributing

Feel free to contribute improvements or report issues. The codebase is well-documented and follows modern JavaScript practices.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

---

*Challenge your deductive reasoning skills with Braincode!*
