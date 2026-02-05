import { useState, useEffect } from 'react';
import { apiClient, Store, Item, Recipe } from './api';
import './App.css';

function App() {
  const [stores, setStores] = useState<Store[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [status, setStatus] = useState<string>('Checking connection...');

  useEffect(() => {
    // Check API health
    apiClient
      .healthCheck()
      .then((data) => setStatus(`Connected: ${data.message}`))
      .catch(() => setStatus('Failed to connect to backend'));

    // Load initial data
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storesData, itemsData, recipesData] = await Promise.all([
        apiClient.getStores(),
        apiClient.getItems(),
        apiClient.getRecipes(),
      ]);
      setStores(storesData);
      setItems(itemsData);
      setRecipes(recipesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleCreateStore = async () => {
    try {
      await apiClient.createStore({
        name: 'Sample Store',
        location: 'Sample Location',
      });
      loadData();
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛒 Cheap Grocery Shopper</h1>
        <p className="status">{status}</p>
      </header>

      <main className="container">
        <section className="section">
          <h2>Stores ({stores.length})</h2>
          <button onClick={handleCreateStore}>Add Sample Store</button>
          <div className="list">
            {stores.length === 0 ? (
              <p>No stores yet. Click the button to add one!</p>
            ) : (
              stores.map((store) => (
                <div key={store.id} className="card">
                  <h3>{store.name}</h3>
                  {store.location && <p>📍 {store.location}</p>}
                  {store.items && <p>Items: {store.items.length}</p>}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <h2>Items ({items.length})</h2>
          <div className="list">
            {items.length === 0 ? (
              <p>No items yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="card">
                  <h4>{item.name}</h4>
                  <p>
                    ${item.price} / {item.unit}
                  </p>
                  {item.store && <p className="small">at {item.store.name}</p>}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="section">
          <h2>Recipes ({recipes.length})</h2>
          <div className="list">
            {recipes.length === 0 ? (
              <p>No recipes yet.</p>
            ) : (
              recipes.map((recipe) => (
                <div key={recipe.id} className="card">
                  <h3>{recipe.name}</h3>
                  {recipe.description && <p>{recipe.description}</p>}
                  {recipe.ingredients && (
                    <p>Ingredients: {recipe.ingredients.length}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
