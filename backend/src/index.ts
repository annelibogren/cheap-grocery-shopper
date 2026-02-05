import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Store endpoints
app.get('/api/stores', async (req: Request, res: Response) => {
  try {
    const stores = await prisma.store.findMany({
      include: { items: true }
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

app.post('/api/stores', async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;
    const store = await prisma.store.create({
      data: { name, location }
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// Item endpoints
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      include: { store: true }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', async (req: Request, res: Response) => {
  try {
    const { name, price, unit, storeId } = req.body;
    const item = await prisma.item.create({
      data: { name, price, unit, storeId }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Recipe endpoints
app.get('/api/recipes', async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { ingredients: true }
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.post('/api/recipes', async (req: Request, res: Response) => {
  try {
    const { name, description, ingredients } = req.body;
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        ingredients: {
          create: ingredients
        }
      },
      include: { ingredients: true }
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Find cheapest store for a recipe
app.get('/api/recipes/:id/cheapest-store', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true }
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const stores = await prisma.store.findMany({
      include: { items: true }
    });

    const storePrices = stores.map(store => {
      let totalPrice = 0;
      let allItemsAvailable = true;

      recipe.ingredients.forEach(ingredient => {
        const item = store.items.find(i => 
          i.name.toLowerCase() === ingredient.itemName.toLowerCase()
        );
        
        if (item) {
          totalPrice += item.price * ingredient.quantity;
        } else {
          allItemsAvailable = false;
        }
      });

      return {
        store,
        totalPrice,
        allItemsAvailable
      };
    });

    const cheapestStore = storePrices
      .filter(sp => sp.allItemsAvailable)
      .sort((a, b) => a.totalPrice - b.totalPrice)[0];

    if (!cheapestStore) {
      return res.json({ 
        message: 'No store has all ingredients',
        storePrices 
      });
    }

    res.json(cheapestStore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find cheapest store' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
