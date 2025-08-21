# Rasoi Planner - AI-Powered Indian Meal Planning

Welcome to Rasoi Planner, an intelligent meal planning application specifically designed for Indian households. This app combines traditional Indian cooking wisdom with modern AI technology to create personalized weekly meal plans.

## 🚀 What's New: AI Integration

The app now features **actual AI integration** that can generate intelligent, personalized meal plans using OpenAI GPT-4 or Anthropic Claude APIs. The AI considers:

- **Your exact pantry inventory** and quantities
- **Regional cuisine preferences** (North Indian, South Indian, Bengali, etc.)
- **Dietary restrictions** (Vegetarian, Vegan, Jain, Gluten-free)
- **Family size and cooking time constraints**
- **Nutritional balance** across the week
- **Seasonal ingredient availability**
- **Cost optimization** for shopping lists

### AI Features

1. **Smart Recipe Generation**: AI creates authentic Indian recipes adapted to your pantry
2. **Nutritional Analysis**: Provides insights on nutritional balance and variety
3. **Intelligent Shopping Lists**: Optimized recommendations with cost estimates
4. **Fallback System**: Gracefully falls back to rule-based planning when AI is unavailable

## 🛠️ Setup Instructions

### Basic Setup (Rule-based meal planning)

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd rasoi-planner

# Install dependencies
npm install

# Start development server
npm run dev
```

### AI-Enhanced Setup (Recommended)

To enable AI-powered meal planning, you'll need an API key from OpenAI or Anthropic:

1. **Get an API Key**:
   - **OpenAI**: Visit [OpenAI Platform](https://platform.openai.com/api-keys) and create an API key
   - **Anthropic**: Visit [Anthropic Console](https://console.anthropic.com/) and create an API key

2. **Configure Environment Variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your API keys
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   # OR
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   
   # Choose your preferred AI service
   VITE_AI_SERVICE=openai  # or 'anthropic' or 'fallback'
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_OPENAI_API_KEY` | OpenAI API key for GPT-4 integration | No | - |
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for Claude integration | No | - |
| `VITE_AI_SERVICE` | Preferred AI service (`openai`, `anthropic`, or `fallback`) | No | `fallback` |

## 🔧 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **AI Integration**: OpenAI GPT-4 or Anthropic Claude
- **Fallback**: Rule-based meal planning algorithm

## 🎯 How It Works

### With AI (Recommended)
1. **Input**: User provides pantry items, preferences, and constraints
2. **AI Analysis**: AI service analyzes the input and generates a comprehensive meal plan
3. **Output**: Personalized 7-day meal plan with:
   - Authentic Indian recipes adapted to your pantry
   - Nutritional insights and balance analysis
   - Smart shopping list with cost optimization
   - Cooking tips and ingredient substitutions

### Without AI (Fallback)
1. **Rule-based Matching**: Predefined recipe templates are matched against available ingredients
2. **Basic Planning**: Simple 7-day schedule using available recipes
3. **Standard Shopping List**: Missing essential ingredients identified

## 🚀 Features

### ✨ AI-Enhanced Features
- **Smart Recipe Adaptation**: AI modifies traditional recipes based on available ingredients
- **Nutritional Balance**: Ensures meals meet dietary requirements and nutritional goals
- **Regional Expertise**: Deep understanding of Indian regional cuisines
- **Cost Optimization**: Shopping lists optimized for budget and store organization
- **Variety Analysis**: Ensures diverse meals throughout the week

### 🍛 Core Features
- **Pantry-Based Planning**: Uses your actual ingredients to suggest meals
- **Regional Cuisine Support**: North Indian, South Indian, Bengali, Gujarati, and more
- **Dietary Preferences**: Vegetarian, Non-vegetarian, Vegan, Jain, Gluten-free
- **Family-Sized Portions**: Scales recipes for your household size
- **Time-Constrained Cooking**: Respects your available cooking time
- **Smart Shopping Lists**: Organized by store sections with cost estimates

## 📱 Usage

1. **Enter Your Pantry**: List ingredients with quantities (e.g., "atta 2kg, rice 1kg, onions 500g")
2. **Set Preferences**: Choose cuisine, diet type, family size, and time constraints
3. **Generate Plan**: Click "Generate My Meal Plan" to create your personalized plan
4. **Review Results**: Browse your 7-day plan, featured recipe, and shopping list
5. **Cook & Enjoy**: Follow the step-by-step recipes with your family

## 🔒 Privacy & Security

- **API Keys**: All API keys are stored locally in environment variables
- **Data Privacy**: No personal data is stored or transmitted beyond API calls
- **Secure Communication**: All API calls use HTTPS encryption
- **Fallback Protection**: App works without AI services for complete privacy

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including AI and fallback modes)
5. Submit a pull request

## 📄 License

This project is open source. See LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. **Check Environment Setup**: Ensure API keys are correctly configured
2. **Verify API Limits**: Check if you've exceeded your API quota
3. **Try Fallback Mode**: Set `VITE_AI_SERVICE=fallback` to use rule-based planning
4. **Check Console**: Look for error messages in browser developer tools

## 🎉 Credits

Built with ❤️ for Indian families who love good food and smart planning.

- **AI Services**: OpenAI GPT-4, Anthropic Claude
- **Recipe Database**: Traditional Indian recipes from various regions
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Development**: React + TypeScript + Vite
