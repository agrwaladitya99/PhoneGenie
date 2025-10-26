# Shopping Chat Agent - Project Overview

## 🎯 Project Goal
Create an AI-powered shopping chat agent that helps customers discover, compare, and purchase mobile phones through natural language conversations.

## 📊 Project Scope

### Primary Objectives
1. **Conversational Search**: Answer natural language queries about mobile phones
2. **Smart Recommendations**: Suggest phones based on user preferences, budget, and requirements
3. **Comparison Engine**: Compare 2-3 phones with detailed specs and trade-offs
4. **Safety & Security**: Handle adversarial prompts and maintain data integrity
5. **User Experience**: Provide intuitive web-based chat interface

### Key Features
- Natural language query processing
- Budget-aware recommendations
- Brand and feature filtering
- Detailed product comparisons
- Technical explanations (OIS vs EIS, processor differences, etc.)
- Follow-up question support
- Adversarial prompt detection and refusal

## 📈 Success Metrics

### 1. Functional Requirements
- ✅ Handle 15+ query types (search, compare, explain, recommend)
- ✅ Response accuracy > 95%
- ✅ Sub-2-second response time
- ✅ Mobile-responsive UI

### 2. Safety Requirements
- ✅ Block prompt injection attacks
- ✅ Refuse irrelevant queries
- ✅ No hallucination of specs
- ✅ Maintain neutral tone

### 3. Technical Requirements
- ✅ Clean, maintainable code
- ✅ Proper error handling
- ✅ Type safety (TypeScript)
- ✅ Production-ready deployment

## 🎭 User Personas

### Persona 1: Budget Shopper
- **Need**: Best value under specific budget
- **Queries**: "Best phone under ₹20k?", "Battery king under ₹15k?"
- **Priority**: Price-to-performance ratio

### Persona 2: Feature Hunter
- **Need**: Specific features (camera, battery, gaming)
- **Queries**: "Best camera phone?", "Compact phone with good battery?"
- **Priority**: Specific technical requirements

### Persona 3: Comparison Seeker
- **Need**: Detailed comparison between options
- **Queries**: "Compare Pixel 8a vs OnePlus 12R"
- **Priority**: Understanding trade-offs

### Persona 4: Knowledge Seeker
- **Need**: Technical explanations
- **Queries**: "What is OIS?", "Explain processor cores"
- **Priority**: Education and understanding

## 📅 Timeline

### Day 1 Breakdown
- **Hours 0-2**: Planning & Architecture (Current Phase)
- **Hours 2-4**: Project setup & Data layer
- **Hours 4-6**: AI Agent development & API routes
- **Hours 6-8**: Frontend development
- **Hours 8-9**: Testing & bug fixes
- **Hours 9-10**: Deployment & documentation

## 🎓 Learning Outcomes
- AI agent development with prompt engineering
- LLM safety and adversarial handling
- Full-stack development with Next.js
- Production deployment practices

## 📦 Deliverables

### 1. Working Application
- Live deployment URL
- Functional chat interface
- Complete feature set

### 2. Source Code
- Public GitHub repository
- Clean, documented code
- Type-safe implementation

### 3. Documentation
- Setup instructions
- Architecture overview
- Prompt engineering notes
- Known limitations
- Testing strategy

### 4. Data
- 980 mobile phones database
- Comprehensive specs
- Indian market pricing (₹)

