// API types
export interface Store {
  id: string;
  name: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  items?: Item[];
}

export interface Item {
  id: string;
  name: string;
  price: number;
  unit: string;
  storeId: string;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ingredients?: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  itemName: string;
  quantity: number;
  unit: string;
}

// API client
const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }

  // Store endpoints
  async getStores() {
    return this.request<Store[]>('/stores');
  }

  async createStore(data: { name: string; location?: string }) {
    return this.request<Store>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Item endpoints
  async getItems() {
    return this.request<Item[]>('/items');
  }

  async createItem(data: {
    name: string;
    price: number;
    unit: string;
    storeId: string;
  }) {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Recipe endpoints
  async getRecipes() {
    return this.request<Recipe[]>('/recipes');
  }

  async createRecipe(data: {
    name: string;
    description?: string;
    ingredients: Array<{
      itemName: string;
      quantity: number;
      unit: string;
    }>;
  }) {
    return this.request<Recipe>('/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async findCheapestStore(recipeId: string) {
    return this.request<{
      store: Store;
      totalPrice: number;
      allItemsAvailable: boolean;
    }>(`/recipes/${recipeId}/cheapest-store`);
  }
}

export const apiClient = new ApiClient();
