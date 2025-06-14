# Sourdough Ingredient Calculator

Calculate precise ingredient amounts for your perfect sourdough loaf. Simply adjust the loaf size or hydration level, and the calculator will update all ingredients proportionally.

<div class="calculator-container">
  <div class="calculator-card">
    <h2>Recipe Parameters</h2>
    
    <div class="input-group">
      <label for="loaf-size">Loaf Size (grams)</label>
      <input type="number" id="loaf-size" value="700" min="300" max="2000" step="50">
      <span class="unit">g</span>
    </div>
    
    <div class="input-group">
      <label for="hydration">Hydration Level</label>
      <input type="number" id="hydration" value="70" min="60" max="90" step="1">
      <span class="unit">%</span>
    </div>
    
    <div class="input-group">
      <label for="starter-percent">Starter Percentage</label>
      <input type="number" id="starter-percent" value="20" min="10" max="30" step="1">
      <span class="unit">%</span>
    </div>
  </div>
  
  <div class="results-card">
    <h2>Calculated Ingredients</h2>
    
    <div class="ingredient-list">
      <div class="ingredient-row">
        <span class="ingredient-name">Bread Flour</span>
        <span class="ingredient-amount" id="bread-flour">400</span>
        <span class="ingredient-unit">g</span>
      </div>
      
      <div class="ingredient-row">
        <span class="ingredient-name">Whole Wheat Flour</span>
        <span class="ingredient-amount" id="whole-wheat">50</span>
        <span class="ingredient-unit">g</span>
      </div>
      
      <div class="ingredient-row total-flour">
        <span class="ingredient-name">Total Flour</span>
        <span class="ingredient-amount" id="total-flour">450</span>
        <span class="ingredient-unit">g</span>
      </div>
      
      <div class="ingredient-row">
        <span class="ingredient-name">Water</span>
        <span class="ingredient-amount" id="water">315</span>
        <span class="ingredient-unit">g</span>
      </div>
      
      <div class="ingredient-row">
        <span class="ingredient-name">Active Starter</span>
        <span class="ingredient-amount" id="starter">90</span>
        <span class="ingredient-unit">g</span>
      </div>
      
      <div class="ingredient-row">
        <span class="ingredient-name">Salt</span>
        <span class="ingredient-amount" id="salt">9</span>
        <span class="ingredient-unit">g</span>
      </div>
      
      <div class="ingredient-row total-dough">
        <span class="ingredient-name">Total Dough Weight</span>
        <span class="ingredient-amount" id="total-weight">864</span>
        <span class="ingredient-unit">g</span>
      </div>
    </div>
  </div>
  
  <div class="baker-percentages">
    <h3>Baker's Percentages</h3>
    <p class="percentage-info">All percentages are relative to total flour weight</p>
    
    <div class="percentage-grid">
      <div class="percentage-item">
        <span class="percentage-label">Bread Flour</span>
        <span class="percentage-value">89%</span>
      </div>
      <div class="percentage-item">
        <span class="percentage-label">Whole Wheat</span>
        <span class="percentage-value">11%</span>
      </div>
      <div class="percentage-item">
        <span class="percentage-label">Hydration</span>
        <span class="percentage-value" id="hydration-display">70%</span>
      </div>
      <div class="percentage-item">
        <span class="percentage-label">Starter</span>
        <span class="percentage-value" id="starter-display">20%</span>
      </div>
      <div class="percentage-item">
        <span class="percentage-label">Salt</span>
        <span class="percentage-value">2%</span>
      </div>
    </div>
  </div>
</div>

<script>
// Sourdough Calculator Logic
(function() {
  // Get input elements
  const loafSizeInput = document.getElementById('loaf-size');
  const hydrationInput = document.getElementById('hydration');
  const starterPercentInput = document.getElementById('starter-percent');
  
  // Get output elements
  const breadFlourEl = document.getElementById('bread-flour');
  const wholeWheatEl = document.getElementById('whole-wheat');
  const totalFlourEl = document.getElementById('total-flour');
  const waterEl = document.getElementById('water');
  const starterEl = document.getElementById('starter');
  const saltEl = document.getElementById('salt');
  const totalWeightEl = document.getElementById('total-weight');
  const hydrationDisplayEl = document.getElementById('hydration-display');
  const starterDisplayEl = document.getElementById('starter-display');
  
  // Constants
  const BREAD_FLOUR_RATIO = 0.89; // 89% of total flour
  const WHOLE_WHEAT_RATIO = 0.11; // 11% of total flour
  const SALT_PERCENTAGE = 0.02; // 2% of flour weight
  
  function calculateIngredients() {
    const targetLoafSize = parseFloat(loafSizeInput.value);
    const hydrationPercent = parseFloat(hydrationInput.value) / 100;
    const starterPercent = parseFloat(starterPercentInput.value) / 100;
    
    // Back-calculate flour amount from target loaf size
    // Total = Flour + Water + Starter + Salt
    // Total = Flour + (Flour * Hydration) + (Flour * StarterPercent) + (Flour * 0.02)
    // Total = Flour * (1 + Hydration + StarterPercent + 0.02)
    const totalFlour = targetLoafSize / (1 + hydrationPercent + starterPercent + SALT_PERCENTAGE);
    
    // Calculate individual ingredients
    const breadFlour = Math.round(totalFlour * BREAD_FLOUR_RATIO);
    const wholeWheat = Math.round(totalFlour * WHOLE_WHEAT_RATIO);
    const actualTotalFlour = breadFlour + wholeWheat;
    const water = Math.round(actualTotalFlour * hydrationPercent);
    const starter = Math.round(actualTotalFlour * starterPercent);
    const salt = Math.round(actualTotalFlour * SALT_PERCENTAGE);
    const totalWeight = actualTotalFlour + water + starter + salt;
    
    // Update display
    breadFlourEl.textContent = breadFlour;
    wholeWheatEl.textContent = wholeWheat;
    totalFlourEl.textContent = actualTotalFlour;
    waterEl.textContent = water;
    starterEl.textContent = starter;
    saltEl.textContent = salt;
    totalWeightEl.textContent = totalWeight;
    hydrationDisplayEl.textContent = hydrationInput.value + '%';
    starterDisplayEl.textContent = starterPercentInput.value + '%';
  }
  
  // Add event listeners
  loafSizeInput.addEventListener('input', calculateIngredients);
  hydrationInput.addEventListener('input', calculateIngredients);
  starterPercentInput.addEventListener('input', calculateIngredients);
  
  // Initial calculation
  calculateIngredients();
})();
</script>

<style>
.calculator-container {
  display: grid;
  gap: 2rem;
  margin: 2rem 0;
}

.calculator-card, .results-card, .baker-percentages {
  background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(141, 110, 99, 0.1);
  border: 1px solid rgba(255, 183, 77, 0.2);
}

.calculator-card h2, .results-card h2 {
  color: #8d6e63;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
}

.input-group label {
  font-weight: 600;
  color: #5d4037;
}

.input-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #ffb74d;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  width: 120px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #8d6e63;
  box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.1);
}

.unit {
  font-weight: 600;
  color: #8d6e63;
  font-size: 1.1rem;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ingredient-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  transition: background 0.2s ease;
}

.ingredient-row:hover {
  background: rgba(255, 255, 255, 0.9);
}

.ingredient-name {
  font-weight: 500;
  color: #5d4037;
}

.ingredient-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: #8d6e63;
  text-align: right;
  min-width: 60px;
}

.ingredient-unit {
  color: #8d6e63;
  font-weight: 600;
  margin-left: 0.5rem;
}

.total-flour, .total-dough {
  background: linear-gradient(135deg, #ffb74d 0%, #ffa726 100%) !important;
  color: white;
  font-weight: 700;
  margin-top: 0.5rem;
}

.total-flour .ingredient-name,
.total-flour .ingredient-amount,
.total-flour .ingredient-unit,
.total-dough .ingredient-name,
.total-dough .ingredient-amount,
.total-dough .ingredient-unit {
  color: white !important;
}

.baker-percentages {
  margin-top: 2rem;
}

.baker-percentages h3 {
  color: #8d6e63;
  margin-bottom: 0.5rem;
}

.percentage-info {
  color: #795548;
  font-style: italic;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.percentage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.percentage-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(141, 110, 99, 0.2);
}

.percentage-label {
  display: block;
  font-size: 0.9rem;
  color: #795548;
  margin-bottom: 0.5rem;
}

.percentage-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: #8d6e63;
}

/* Responsive design */
@media (max-width: 768px) {
  .input-group {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .input-group input {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
  
  .ingredient-row {
    grid-template-columns: 1fr auto auto;
  }
}
</style>

## How to Use the Calculator

1. **Adjust Loaf Size**: Set your desired final loaf weight (300g - 2000g)
2. **Set Hydration**: Choose your preferred hydration level (60% - 90%)
3. **Starter Percentage**: Adjust the amount of starter relative to flour (10% - 30%)

The calculator automatically:
- Maintains the 89:11 ratio of bread flour to whole wheat
- Keeps salt at 2% of total flour weight
- Recalculates all ingredients to achieve your target loaf size
- Displays baker's percentages for reference

## Tips for Using the Calculator

- **Higher Hydration** (75-85%): Creates more open crumb, requires more folding
- **Lower Hydration** (60-70%): Easier to handle, tighter crumb structure
- **More Starter** (25-30%): Faster fermentation, more sour flavor
- **Less Starter** (10-15%): Slower fermentation, milder flavor

---

*"Precision in measurement is the foundation of consistency in baking. This calculator ensures your ratios are always perfect, no matter the size of your ambition."* — CodeCrust