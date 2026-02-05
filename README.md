# 🛒 Cheap Grocery Shopper

Hobby project to find the store with the cheapest groceries for a given recipe.

## 🏗️ Project Structure

This is a full-stack TypeScript application with:
- **Backend**: Express.js + TypeScript + Prisma ORM
- **Frontend**: React + TypeScript + Vite
- **Database**: SQLite (easily changeable to PostgreSQL/MySQL)

```
cheap-grocery-shopper/
├── backend/           # Express API server
│   ├── src/
│   │   └── index.ts   # Main server file with API endpoints
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── package.json
│   └── tsconfig.json
├── frontend/          # React application
│   ├── src/
│   │   ├── App.tsx    # Main React component
│   │   ├── api.ts     # API client for backend calls
│   │   └── main.tsx   # Entry point
│   ├── package.json
│   └── vite.config.ts
└── package.json       # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cheap-grocery-shopper
```

2. Install dependencies:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

3. Set up the backend environment:
```bash
cd backend
cp .env.example .env
```

4. Initialize the database:
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## 🏃 Running the Application

### Development Mode

Run both frontend and backend in separate terminals:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Server runs at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# Frontend runs at http://localhost:3000
```

### Production Build

```bash
npm run build
```

Then start the backend:
```bash
cd backend
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Stores
- `GET /api/stores` - Get all stores with their items
- `POST /api/stores` - Create a new store
  ```json
  { "name": "Store Name", "location": "City" }
  ```

### Items
- `GET /api/items` - Get all items with store info
- `POST /api/items` - Add an item to a store
  ```json
  { 
    "name": "Milk", 
    "price": 2.99, 
    "unit": "liter", 
    "storeId": "store-uuid" 
  }
  ```

### Recipes
- `GET /api/recipes` - Get all recipes with ingredients
- `POST /api/recipes` - Create a new recipe
  ```json
  {
    "name": "Recipe Name",
    "description": "Recipe description",
    "ingredients": [
      { "itemName": "Milk", "quantity": 1, "unit": "liter" }
    ]
  }
  ```

### Price Comparison
- `GET /api/recipes/:id/cheapest-store` - Find the cheapest store for a recipe

## 🗃️ Database Schema

The application uses Prisma ORM with the following models:

- **Store**: Grocery stores
- **Item**: Products available at stores
- **Recipe**: Recipes with ingredients
- **RecipeIngredient**: Ingredients needed for recipes

## 🛠️ Tech Stack

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Prisma**: Modern ORM for database access
- **SQLite**: Embedded database (configurable)

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool and dev server
- **Fetch API**: HTTP client for API calls

## 📝 Development Scripts

### Root Level
- `npm run dev:backend` - Start backend dev server
- `npm run dev:frontend` - Start frontend dev server
- `npm run build` - Build both projects

### Backend
- `npm run dev` - Start with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Run production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Backend Configuration
Edit `backend/.env`:
```env
PORT=3001
DATABASE_URL="file:./dev.db"
```

### Frontend Configuration
The frontend automatically proxies `/api` requests to the backend at `http://localhost:3001`.

## 📚 Next Steps

- Add user authentication
- Implement shopping list generation
- Add store location mapping
- Create mobile app
- Add price history tracking
- Implement web scraping for real store prices

## 📄 License

MIT
