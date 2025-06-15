---
title: "Classic White Sourdough"
date: "2025-06-15"
author: "MaK"
tags: ["recipe", "wheat", "white-flour", "beginner", "classic", "sourdough"]
category: "Recipes"
description: "Perfect starting point for sourdough baking using reliable bread flour"
---

# Classic White Sourdough

*Perfect starting point for sourdough baking*

This recipe showcases the reliable foundation qualities of modern bread flour discussed in [Part 1: The Wheat Foundation](../../blog/posts/grains-series-part-1.md). Using high-protein bread flour, this recipe provides predictable results while you master fundamental sourdough techniques.

## Why This Recipe Works

As explained in our [wheat varieties blog post](../../blog/posts/grains-series-part-1.md#modern-wheat-varieties), bread flour's **12-14% protein content** creates the strong gluten network essential for:

- Excellent gas retention and rise
- Chewy, satisfying texture
- Tolerance for longer fermentation
- Forgiving handling characteristics

## Interactive Recipe Calculator

<div class="recipe-calculator">
  <div class="calculator-header">
    <h3 class="calculator-title">📊 Classic White Sourdough Calculator</h3>
    <div class="unit-toggles">
      <div class="unit-toggle">
        <span>Metric</span>
        <label class="toggle-switch">
          <input type="checkbox" id="unit-toggle">
          <span class="toggle-slider"></span>
        </label>
        <span>Imperial</span>
      </div>
      <div class="unit-toggle">
        <span>°C</span>
        <label class="toggle-switch">
          <input type="checkbox" id="temp-toggle">
          <span class="toggle-slider"></span>
        </label>
        <span>°F</span>
      </div>
    </div>
  </div>

  <div class="calculator-controls">
    <div class="control-group">
      <label for="target-weight">Target Final Loaf</label>
      <input type="number" id="target-weight" class="control-input" value="800" min="400" max="1500" step="50">
    </div>
    <div class="control-group">
      <label for="hydration-level">Hydration Level (%)</label>
      <input type="number" id="hydration-level" class="control-input" value="75" min="65" max="85" step="1">
    </div>
  </div>

  <table class="ingredients-table">
    <thead>
      <tr>
        <th>Ingredient</th>
        <th>Amount</th>
        <th>Percentage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="ingredient-name">Bread Flour</td>
        <td class="ingredient-amount" id="bread-flour-amount">500g</td>
        <td class="ingredient-percentage">100%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Water</td>
        <td class="ingredient-amount" id="water-amount">375g</td>
        <td class="ingredient-percentage" id="water-percentage">75%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Active Starter</td>
        <td class="ingredient-amount" id="starter-amount">100g</td>
        <td class="ingredient-percentage">20%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Salt</td>
        <td class="ingredient-amount" id="salt-amount">10g</td>
        <td class="ingredient-percentage">2%</td>
      </tr>
      <tr class="total-row">
        <td class="ingredient-name">Total Dough Weight</td>
        <td class="ingredient-amount" id="total-dough-weight">985g</td>
        <td class="ingredient-percentage">-</td>
      </tr>
    </tbody>
  </table>

  <div class="temperature-display">
    <div class="temp-item">
      <span class="temp-label">Autolyse Water:</span>
      <span class="temp-value" id="autolyse-temp">Room temperature</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Final Proof:</span>
      <span class="temp-value" id="proof-temp">70-75°C (158-167°F)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Baking - Covered:</span>
      <span class="temp-value" id="bake-temp-1">500°F (260°C)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Baking - Uncovered:</span>
      <span class="temp-value" id="bake-temp-2">450°F (232°C)</span>
    </div>
  </div>
</div>

<script>
(function() {
  // Get control elements
  const targetWeightInput = document.getElementById('target-weight');
  const hydrationInput = document.getElementById('hydration-level');
  const unitToggle = document.getElementById('unit-toggle');
  const tempToggle = document.getElementById('temp-toggle');
  
  // Get display elements
  const breadFlourEl = document.getElementById('bread-flour-amount');
  const waterEl = document.getElementById('water-amount');
  const starterEl = document.getElementById('starter-amount');
  const saltEl = document.getElementById('salt-amount');
  const totalWeightEl = document.getElementById('total-dough-weight');
  const waterPercentageEl = document.getElementById('water-percentage');
  
  // Temperature elements
  const autolyseTempEl = document.getElementById('autolyse-temp');
  const proofTempEl = document.getElementById('proof-temp');
  const bakeTemp1El = document.getElementById('bake-temp-1');
  const bakeTemp2El = document.getElementById('bake-temp-2');

  // Constants for Classic White Sourdough
  const STARTER_PERCENTAGE = 0.20; // 20% of flour
  const SALT_PERCENTAGE = 0.02; // 2% of flour

  function gramsToOunces(grams) {
    return (grams * 0.035274).toFixed(1);
  }

  function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
  }

  function fahrenheitToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5/9);
  }

  function formatWeight(grams, isImperial) {
    if (isImperial) {
      const ounces = gramsToOunces(grams);
      return `${ounces} oz`;
    }
    return `${Math.round(grams)}g`;
  }

  function formatTemperature(fahrenheit, isFahrenheit) {
    if (isFahrenheit) {
      return `${fahrenheit}°F (${fahrenheitToCelsius(fahrenheit)}°C)`;
    } else {
      const celsius = fahrenheitToCelsius(fahrenheit);
      return `${celsius}°C (${fahrenheit}°F)`;
    }
  }

  function calculateIngredients() {
    const targetWeight = parseFloat(targetWeightInput.value);
    const hydrationPercent = parseFloat(hydrationInput.value) / 100;
    const isImperial = unitToggle.checked;
    const isFahrenheit = tempToggle.checked;
    
    // Calculate flour amount from target weight
    // Total = Flour + Water + Starter + Salt
    // Total = Flour + (Flour * Hydration) + (Flour * 0.20) + (Flour * 0.02)
    const totalFlour = targetWeight / (1 + hydrationPercent + STARTER_PERCENTAGE + SALT_PERCENTAGE);
    
    const breadFlour = Math.round(totalFlour);
    const water = Math.round(totalFlour * hydrationPercent);
    const starter = Math.round(totalFlour * STARTER_PERCENTAGE);
    const salt = Math.round(totalFlour * SALT_PERCENTAGE);
    const totalDough = breadFlour + water + starter + salt;
    
    // Update ingredient displays
    breadFlourEl.textContent = formatWeight(breadFlour, isImperial);
    waterEl.textContent = formatWeight(water, isImperial);
    starterEl.textContent = formatWeight(starter, isImperial);
    saltEl.textContent = formatWeight(salt, isImperial);
    totalWeightEl.textContent = formatWeight(totalDough, isImperial);
    waterPercentageEl.textContent = hydrationInput.value + '%';
    
    // Update temperature displays
    autolyseTempEl.textContent = 'Room temperature';
    proofTempEl.textContent = formatTemperature(167, isFahrenheit).replace('167°F', '70-75°F').replace('75°C', '21-24°C');
    bakeTemp1El.textContent = formatTemperature(500, isFahrenheit);
    bakeTemp2El.textContent = formatTemperature(450, isFahrenheit);
  }

  // Event listeners
  targetWeightInput.addEventListener('input', calculateIngredients);
  hydrationInput.addEventListener('input', calculateIngredients);
  unitToggle.addEventListener('change', calculateIngredients);
  tempToggle.addEventListener('change', calculateIngredients);
  
  // Initial calculation
  calculateIngredients();
})();
</script>

## Recipe Calendar & Scheduling

Plan your baking day with precision! Enter your preferred date and start time to generate a complete timeline with calendar reminders for each step.

<div id="classic-white-calendar"></div>

<script>
// Initialize the calendar for this recipe
document.addEventListener('DOMContentLoaded', function() {
    initRecipeCalendar('classic-white-calendar', 'classic-white-sourdough', 'Classic White Sourdough', '/recipes/wheat/classic-white-sourdough');
});
</script>

## Equipment

- Large mixing bowl
- Kitchen scale (essential for accuracy)
- Bench scraper
- Proofing basket (banneton) or bowl with towel
- Dutch oven or baking stone
- Lame or sharp knife for scoring

## Timeline Overview

**Day Before**: Feed starter (evening)  
**Baking Day**: 24-hour process from start to finish

### Detailed Schedule

| Time | Activity | Notes |
|------|----------|-------|
| 8:00 AM | Check starter readiness | Should pass float test |
| 8:30 AM | Autolyse (flour + water) | 30-minute rest |
| 9:00 AM | Mix dough | Add starter and salt |
| 9:30 AM | Bulk fermentation begins | 4-5 hours total |
| 10:30 AM | First fold | Coil fold technique |
| 11:30 AM | Second fold | Notice increased strength |
| 12:30 PM | Third fold | Dough feels smoother |
| 1:30 PM | Final fold | Dough holds shape well |
| 2:00 PM | Bulk fermentation continues | Hands-off period |
| 2:30 PM | Pre-shape | Light bench rest |
| 3:00 PM | Final shape | Into proofing basket |
| 3:00 PM | Final proof | 2-3 hours room temp |
| 6:00 PM | Bake | Score and into oven |
| 7:00 PM | Cool | Resist cutting for 2 hours |

## Step-by-Step Method

### Step 1: Starter Preparation (Previous Evening)
Feed your starter with 1:1:1 ratio (starter:flour:water) and let rise overnight. It should double in size and pass the float test by morning.

> **Wheat Starter Note**: As discussed in our [wheat foundation post](../../blog/posts/grains-series-part-1.md#working-with-different-wheat-varieties), bread flour creates predictable, strong starters that are forgiving for beginners.

### Step 2: Autolyse (8:30 AM)
1. Combine 500g bread flour and 375g water in a large bowl
2. Mix until no dry flour remains (dough will look shaggy)
3. Cover and rest for 30 minutes
4. This develops gluten naturally and improves dough handling

### Step 3: Mix Dough (9:00 AM)
1. Add 100g active starter to the autolyse mixture
2. Mix thoroughly using wet hands or dough scraper
3. Add 10g salt and mix until fully incorporated
4. Dough will feel sticky but cohesive

### Step 4: Bulk Fermentation with Folds (9:30 AM - 2:30 PM)

**Understanding Bulk Fermentation**: This is where the magic happens. The dough will increase in size by 50-70% while developing strength and flavor.

**Coil Fold Technique** (every hour for first 4 hours):
1. Wet your hands to prevent sticking
2. Grab the dough from one side and lift up
3. Let it stretch naturally, then fold over to the opposite side
4. Rotate bowl 90° and repeat from all four sides
5. Cover and rest until next fold

**What to Look For**:

- **Hour 1**: Dough feels loose and extensible
- **Hour 2**: Noticeable strength increase
- **Hour 3**: Smooth surface, holds shape better
- **Hour 4**: Jiggly, strong, increased volume
- **Hour 5**: 50-70% size increase, passes poke test

### Step 5: Pre-Shape (2:30 PM)
1. Turn dough onto lightly floured surface
2. Using bench scraper, shape into loose round
3. Let rest 20-30 minutes for gluten to relax

### Step 6: Final Shape (3:00 PM)
1. Shape into boule (round) or batard (oval)
2. Place seam-side up in banneton dusted with rice flour
3. Cover with damp towel or plastic

**Shaping Tips from [Wheat Foundation](../../blog/posts/grains-series-part-1.md#mixing-and-handling)**:

- Bread flour's strong gluten handles shaping well
- Create adequate surface tension
- Don't over-flour the surface

### Step 7: Final Proof (3:00 PM - 6:00 PM)
**Room Temperature Proofing** (70-75°F):

- 2-3 hours depending on temperature
- Dough should increase by 40-50%
- Gentle poke should spring back slowly

**Readiness Test**: Gently poke the dough. It should spring back about halfway.

### Step 8: Baking (6:00 PM)

**Oven Preparation**:
1. Place Dutch oven in oven
2. Preheat to 500°F (260°C) for 45 minutes
3. This high heat creates excellent oven spring

**Scoring and Baking**:
1. Turn dough onto parchment paper
2. Score with sharp lame - one bold slash or decorative pattern
3. Carefully transfer to hot Dutch oven
4. Bake covered: 20 minutes at 500°F
5. Uncover, reduce to 450°F, bake 20-25 minutes more
6. Internal temperature should reach 205-210°F

**Steam Phase**: The covered Dutch oven creates steam for the first 20 minutes, promoting oven spring and crust development.

### Step 9: Cooling (7:00 PM)
Cool completely on wire rack before cutting (minimum 2 hours). The crumb continues to set during cooling.

## Troubleshooting

### Dense, Heavy Loaf
- **Cause**: Under-fermented or weak starter
- **Solution**: Ensure starter doubles in 4-6 hours; extend bulk fermentation
- **Reference**: [Wheat protein considerations](../../blog/posts/grains-series-part-1.md#protein-content-categories)

### Flat, Spreading Loaf
- **Cause**: Over-proofed or insufficient gluten development
- **Solution**: Reduce fermentation time; improve folding technique
- **Reference**: [Gluten formation basics](../../blog/posts/grains-series-part-1.md#gluten-formation)

### Gummy Crumb
- **Cause**: Under-baked or cut too soon
- **Solution**: Bake to 205-210°F internal; cool completely

### Poor Oven Spring
- **Cause**: Over-proofed or insufficient steam
- **Solution**: Better timing; ensure Dutch oven is fully preheated

## Variations

### **Higher Hydration Version** (80%)
- Increase water to 400g
- Requires more advanced handling
- Creates more open crumb
- See [High-Hydration Artisan Bread](high-hydration-artisan.md)

### **Whole Wheat Addition** (20%)
- Replace 100g bread flour with whole wheat
- Increase water by 10-15g
- Shorter fermentation time
- Transition to [Whole Wheat Country Loaf](whole-wheat-country-loaf.md)

### **Enriched Version**
- Add 25g olive oil and 25g honey
- Creates softer, slightly sweet loaf
- Excellent for sandwiches

## Nutritional Benefits

**Bread Flour Advantages** (from [Wheat Foundation](../../blog/posts/grains-series-part-1.md)):

- High protein for muscle building
- B vitamins for energy metabolism
- Iron for blood health
- Sourdough fermentation improves mineral absorption

## Storage

- **Room Temperature**: 3-4 days in paper bag
- **Freezing**: Slice and freeze up to 3 months
- **Refresh**: Light toasting restores crust crispness

## Next Steps in Your Journey

**Ready to Advance?**
1. **Try Rye**: [Beginner's Rye Blend (20%)](../rye/beginners-rye-blend.md) - Learn how different grains behave
2. **Go Whole Grain**: [Whole Wheat Country Loaf](whole-wheat-country-loaf.md) - Add nutrition and complexity
3. **Master Hydration**: [High-Hydration Artisan Bread](high-hydration-artisan.md) - Advanced technique

**Understanding the Science**:

- Read about [different wheat varieties](../../blog/posts/grains-series-part-1.md#modern-wheat-varieties)
- Learn about [protein content effects](../../blog/posts/grains-series-part-1.md#protein-content-categories)
- Understand [regional wheat characteristics](../../blog/posts/grains-series-part-1.md#regional-wheat-characteristics)

---

## Recipe Summary

| Aspect | Details |
|--------|---------|
| **Grain Focus** | Modern bread flour (12-14% protein) |
| **Difficulty** | Beginner |
| **Total Time** | 24 hours |
| **Active Time** | 2 hours |
| **Hydration** | 75% |
| **Yield** | 800g loaf |

---

*"Mastering this foundation recipe with bread flour gives you the confidence and skills to explore the wonderful world of grain diversity."* — MaK

**Educational Links**: [The Wheat Foundation](../../blog/posts/grains-series-part-1.md) | [Troubleshooting Guide](../../troubleshooting.md) | [Folding Techniques](../../techniques/folding-shaping.md)