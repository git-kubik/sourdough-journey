---
title: "Sweet Einkorn Loaf"
date: "2025-06-15"
author: "MaK"
tags: ["recipe", "einkorn", "heritage", "ancient", "sweet", "beginner", "sourdough"]
category: "Recipes"
description: "Introduction to ancient grains with humanity's first wheat variety"
---

# Sweet Einkorn Loaf

*Rediscovering humanity's first wheat*

This recipe introduces you to einkorn, the original wheat that launched agriculture 10,000 years ago. As detailed in [Part 3: Ancient and Heritage Grains](../../blog/posts/grains-series-part-3.md), einkorn offers a unique baking experience with its distinctive sweet, nutty flavor and delicate handling requirements.

## Why Einkorn is Special

From our [ancient grains blog post](../../blog/posts/grains-series-part-3.md#einkorn-the-original-wheat), **einkorn provides**:
- **Genetic Simplicity**: Diploid wheat (14 chromosomes vs 42 in modern wheat)
- **Superior Nutrition**: Higher protein, lutein, and essential fatty acids
- **Unique Flavor**: Sweet, nutty taste unlike any modern grain
- **Digestibility**: Different gluten structure, easier for some to digest

## Interactive Recipe Calculator

<div class="recipe-calculator">
  <div class="calculator-header">
    <h3 class="calculator-title">🌾 Sweet Einkorn Loaf Calculator</h3>
    <div class="unit-toggles">
      <div class="unit-toggle">
        <span>Metric</span>
        <label class="toggle-switch">
          <input type="checkbox" id="unit-toggle-einkorn">
          <span class="toggle-slider"></span>
        </label>
        <span>Imperial</span>
      </div>
      <div class="unit-toggle">
        <span>°C</span>
        <label class="toggle-switch">
          <input type="checkbox" id="temp-toggle-einkorn">
          <span class="toggle-slider"></span>
        </label>
        <span>°F</span>
      </div>
    </div>
  </div>

  <div class="calculator-controls">
    <div class="control-group">
      <label for="target-weight-einkorn">Target Final Loaf</label>
      <input type="number" id="target-weight-einkorn" class="control-input" value="700" min="400" max="1000" step="50">
    </div>
    <div class="control-group">
      <label for="hydration-level-einkorn">Hydration Level (%)</label>
      <input type="number" id="hydration-level-einkorn" class="control-input" value="55" min="50" max="65" step="1">
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
        <td class="ingredient-name">Einkorn Flour</td>
        <td class="ingredient-amount" id="einkorn-flour-amount">300g</td>
        <td class="ingredient-percentage">60%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Bread Flour</td>
        <td class="ingredient-amount" id="bread-flour-amount-einkorn">200g</td>
        <td class="ingredient-percentage">40%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Water</td>
        <td class="ingredient-amount" id="water-amount-einkorn">275g</td>
        <td class="ingredient-percentage" id="water-percentage-einkorn">55%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Active Starter</td>
        <td class="ingredient-amount" id="starter-amount-einkorn">100g</td>
        <td class="ingredient-percentage">20%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Honey</td>
        <td class="ingredient-amount" id="honey-amount">25g</td>
        <td class="ingredient-percentage">5%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Salt</td>
        <td class="ingredient-amount" id="salt-amount-einkorn">10g</td>
        <td class="ingredient-percentage">2%</td>
      </tr>
      <tr class="total-row">
        <td class="ingredient-name">Total Dough Weight</td>
        <td class="ingredient-amount" id="total-dough-weight-einkorn">910g</td>
        <td class="ingredient-percentage">-</td>
      </tr>
    </tbody>
  </table>

  <div class="temperature-display">
    <div class="temp-item">
      <span class="temp-label">Autolyse (Extended):</span>
      <span class="temp-value" id="autolyse-temp-einkorn">Room temperature</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Bulk Fermentation:</span>
      <span class="temp-value" id="bulk-temp-einkorn">68-72°F (20-22°C)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Final Proof:</span>
      <span class="temp-value" id="proof-temp-einkorn">70-75°F (21-24°C)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Baking (Pan):</span>
      <span class="temp-value" id="bake-temp-einkorn">375°F (190°C)</span>
    </div>
  </div>
</div>

<script>
(function() {
  // Get control elements
  const targetWeightInput = document.getElementById('target-weight-einkorn');
  const hydrationInput = document.getElementById('hydration-level-einkorn');
  const unitToggle = document.getElementById('unit-toggle-einkorn');
  const tempToggle = document.getElementById('temp-toggle-einkorn');
  
  // Get display elements
  const einkornFlourEl = document.getElementById('einkorn-flour-amount');
  const breadFlourEl = document.getElementById('bread-flour-amount-einkorn');
  const waterEl = document.getElementById('water-amount-einkorn');
  const starterEl = document.getElementById('starter-amount-einkorn');
  const honeyEl = document.getElementById('honey-amount');
  const saltEl = document.getElementById('salt-amount-einkorn');
  const totalWeightEl = document.getElementById('total-dough-weight-einkorn');
  const waterPercentageEl = document.getElementById('water-percentage-einkorn');
  
  // Temperature elements
  const autolyseTempEl = document.getElementById('autolyse-temp-einkorn');
  const bulkTempEl = document.getElementById('bulk-temp-einkorn');
  const proofTempEl = document.getElementById('proof-temp-einkorn');
  const bakeTempEl = document.getElementById('bake-temp-einkorn');

  // Constants for Einkorn Loaf
  const EINKORN_FLOUR_RATIO = 0.60; // 60% of total flour
  const BREAD_FLOUR_RATIO = 0.40; // 40% of total flour
  const STARTER_PERCENTAGE = 0.20; // 20% of flour
  const HONEY_PERCENTAGE = 0.05; // 5% of flour
  const SALT_PERCENTAGE = 0.02; // 2% of flour

  function gramsToOunces(grams) {
    return (grams * 0.035274).toFixed(1);
  }

  function gramsToTablespoons(grams) {
    // Honey: approximately 21g per tablespoon
    return (grams / 21).toFixed(1);
  }

  function formatWeight(grams, isImperial) {
    if (isImperial) {
      const ounces = gramsToOunces(grams);
      return `${ounces} oz`;
    }
    return `${Math.round(grams)}g`;
  }

  function formatHoney(grams, isImperial) {
    if (isImperial) {
      const tbsp = gramsToTablespoons(grams);
      return `${tbsp} tbsp`;
    }
    return `${Math.round(grams)}g`;
  }

  function formatTemperature(fahrenheit, isFahrenheit) {
    const celsius = Math.round((fahrenheit - 32) * 5/9);
    if (isFahrenheit) {
      return `${fahrenheit}°F (${celsius}°C)`;
    } else {
      return `${celsius}°C (${fahrenheit}°F)`;
    }
  }

  function formatTempRange(lowF, highF, isFahrenheit) {
    const lowC = Math.round((lowF - 32) * 5/9);
    const highC = Math.round((highF - 32) * 5/9);
    if (isFahrenheit) {
      return `${lowF}-${highF}°F (${lowC}-${highC}°C)`;
    } else {
      return `${lowC}-${highC}°C (${lowF}-${highF}°F)`;
    }
  }

  function calculateIngredients() {
    const targetWeight = parseFloat(targetWeightInput.value);
    const hydrationPercent = parseFloat(hydrationInput.value) / 100;
    const isImperial = unitToggle.checked;
    const isFahrenheit = tempToggle.checked;
    
    // Calculate total flour from target weight
    // Total = Flour + Water + Starter + Honey + Salt
    const totalFlour = targetWeight / (1 + hydrationPercent + STARTER_PERCENTAGE + HONEY_PERCENTAGE + SALT_PERCENTAGE);
    
    const einkornFlour = Math.round(totalFlour * EINKORN_FLOUR_RATIO);
    const breadFlour = Math.round(totalFlour * BREAD_FLOUR_RATIO);
    const actualTotalFlour = einkornFlour + breadFlour;
    const water = Math.round(actualTotalFlour * hydrationPercent);
    const starter = Math.round(actualTotalFlour * STARTER_PERCENTAGE);
    const honey = Math.round(actualTotalFlour * HONEY_PERCENTAGE);
    const salt = Math.round(actualTotalFlour * SALT_PERCENTAGE);
    const totalDough = actualTotalFlour + water + starter + honey + salt;
    
    // Update ingredient displays
    einkornFlourEl.textContent = formatWeight(einkornFlour, isImperial);
    breadFlourEl.textContent = formatWeight(breadFlour, isImperial);
    waterEl.textContent = formatWeight(water, isImperial);
    starterEl.textContent = formatWeight(starter, isImperial);
    honeyEl.textContent = formatHoney(honey, isImperial);
    saltEl.textContent = formatWeight(salt, isImperial);
    totalWeightEl.textContent = formatWeight(totalDough, isImperial);
    waterPercentageEl.textContent = hydrationInput.value + '%';
    
    // Update temperature displays
    autolyseTempEl.textContent = 'Room temperature';
    bulkTempEl.textContent = formatTempRange(68, 72, isFahrenheit);
    proofTempEl.textContent = formatTempRange(70, 75, isFahrenheit);
    bakeTempEl.textContent = formatTemperature(375, isFahrenheit);
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

Ancient grains need gentle timing! Schedule your einkorn baking day with this calendar that accounts for einkorn's unique fermentation characteristics.

<div id="einkorn-calendar"></div>

<script>
// Initialize the calendar for this recipe
document.addEventListener('DOMContentLoaded', function() {
    initRecipeCalendar('einkorn-calendar', 'sweet-einkorn-loaf', 'Sweet Einkorn Loaf', '/recipes/heritage/sweet-einkorn-loaf');
});
</script>

## Understanding Einkorn's Unique Properties

**Why Blend with Bread Flour?**: Pure einkorn creates very dense bread. The 40% bread flour provides structure while showcasing einkorn's character.

**Lower Hydration**: As explained in [einkorn characteristics](../../blog/posts/grains-series-part-3.md#einkorn-characteristics), einkorn absorbs less water than modern wheat (typically 50-65% vs 75-85%).

**Honey Addition**: Complements einkorn's natural sweetness and helps with moisture retention.

## Equipment

- Large mixing bowl
- Kitchen scale
- Bench scraper
- Gentle hands (einkorn requires delicate touch)
- 8.5" loaf pan (recommended for structure)
- Wire cooling rack

## Timeline Overview

**Shorter Process**: Einkorn ferments faster and requires less development time.

### Detailed Schedule

| Time | Activity | Notes |
|------|----------|-------|
| 9:00 AM | Check starter | Very active starter needed |
| 9:30 AM | Autolyse | Extended for einkorn hydration |
| 10:30 AM | Mix dough | Gentle incorporation |
| 11:00 AM | Bulk fermentation | Shorter than wheat |
| 12:00 PM | First gentle fold | Minimal manipulation |
| 1:00 PM | Second fold | Dough feels fragile |
| 2:00 PM | Check readiness | Earlier than expected |
| 2:30 PM | Shape into loaf | Pan baking recommended |
| 4:30 PM | Bake | After 2-hour proof |
| 5:30 PM | Cool | Patience required |

## Step-by-Step Method

### Step 1: Starter Preparation
Ensure your starter is very active - einkorn needs vigorous fermentation help due to its [weaker gluten structure](../../blog/posts/grains-series-part-3.md#einkorn-characteristics).

### Step 2: Extended Autolyse (9:30 AM)
1. Combine 300g einkorn flour, 200g bread flour, and 275g water
2. Mix gently until just combined
3. **Extended Rest**: 60 minutes (vs 30 for wheat)
4. **Why Longer?**: Einkorn needs more time to fully hydrate

**What You'll Notice**: The dough feels different - less elastic, more fragile than wheat dough.

### Step 3: Gentle Mixing (10:30 AM)
1. Add 100g active starter
2. Drizzle in 25g honey
3. Mix gently with wet hands
4. Add 10g salt
5. **Critical**: Minimal mixing to avoid breaking [delicate protein structure](../../blog/posts/grains-series-part-3.md#working-with-einkorn-in-sourdough)

### Step 4: Bulk Fermentation (11:00 AM - 2:30 PM)

**Shorter Timeline**: Einkorn ferments faster due to its enzyme activity and simple protein structure.

**Gentle Fold Technique** (every hour, only 2 folds total):
1. **Wet hands essential** - einkorn can be sticky
2. Very gentle lifting and folding
3. **Don't overwork** - einkorn proteins tear easily
4. Cover between folds

**Progression Expectations**:
- **Hour 1**: Dough feels soft and extensible
- **Hour 2**: Slight increase in volume, more cohesive
- **Hour 3**: Ready for shaping (30-50% increase)

**Readiness Signs**:
- 30-50% size increase (less than modern wheat)
- Soft, pillowy feel
- Sweet, honeyed aroma
- Gentle poke springs back slowly

### Step 5: Shaping for Pan (2:30 PM)

**Why Pan Baking?**: As noted in [einkorn sourdough techniques](../../blog/posts/grains-series-part-3.md#einkorn-sourdough-techniques), einkorn's weak gluten benefits from pan support.

1. Turn onto lightly floured surface
2. **Gentle shaping** - treat like delicate pastry dough
3. Shape into loaf form with minimal tension
4. Place in greased 8.5" loaf pan
5. Cover with damp towel

### Step 6: Final Proof (2:30 PM - 4:30 PM)
**2-Hour Proof**: Shorter than wheat due to faster fermentation

**Visual Cues**:
- Dough rises to about 1 inch above pan rim
- Light, airy feel when gently shaken
- Surface looks smooth and slightly domed

**Poke Test**: Very gentle poke should leave slight indentation that fills in slowly.

### Step 7: Baking (4:30 PM)

**Lower Temperature**: Einkorn benefits from gentler baking to prevent over-browning.

**Baking Process**:
1. Preheat oven to 375°F (190°C)
2. Optional: Score with single shallow slash
3. Bake 35-40 minutes
4. **Target**: 200-205°F internal temperature
5. **Crust**: Golden brown, sounds hollow when tapped

**Steam Considerations**: Light steam for first 15 minutes helps, but not essential with pan baking.

### Step 8: Cooling (5:30 PM)
**Extended Cooling**: Cool in pan for 10 minutes, then turn out onto wire rack. Cool completely (2-3 hours) before slicing.

## Flavor Profile

**Expected Characteristics**:
- **Sweetness**: Natural grain sweetness enhanced by honey
- **Nuttiness**: Distinctive nutty, almost buttery flavor
- **Texture**: Tender, fine crumb (denser than modern wheat)
- **Aroma**: Warm, toasted grain notes with honey undertones

**Flavor Development Tips** from [einkorn flavor profile](../../blog/posts/grains-series-part-3.md#einkorn-flavor-profile):
- Longer autolyse enhances nutty flavors
- Cool overnight retard deepens complexity
- Toasting einkorn flour lightly before use intensifies nuttiness

## Troubleshooting

### Very Dense Bread
- **Cause**: Under-fermentation or over-mixing
- **Solution**: Ensure active starter; gentler handling
- **Reference**: [Einkorn's weak gluten structure](../../blog/posts/grains-series-part-3.md#einkorn-characteristics)

### Crumbly, Falls Apart
- **Cause**: Insufficient moisture or over-fermentation
- **Solution**: Check hydration; reduce fermentation time
- **Reference**: [Troubleshooting einkorn](../../blog/posts/grains-series-part-3.md#troubleshooting-einkorn)

### Gummy Texture
- **Cause**: Under-baked or cut too soon
- **Solution**: Bake to proper temperature; cool completely

### Flat Loaf
- **Cause**: Weak starter or over-proofed
- **Solution**: Very active starter essential; watch timing

## Variations

### **Pure Einkorn Challenge** (Advanced)
- 500g einkorn flour only
- Reduce water to 250g (50% hydration)
- Expect very dense but flavorful result
- Pan baking essential

### **Einkorn Honey Wheat**
- 200g einkorn, 300g bread flour
- Increase honey to 40g
- Creates lighter texture with einkorn character

### **Seeded Einkorn**
- Add 30g mixed seeds (sunflower, pumpkin)
- 20g chopped walnuts
- Complements nutty flavors

### **Overnight Retard Version**
- Shape and refrigerate overnight
- Bake cold from refrigerator
- Develops deeper, more complex flavors

## Nutritional Powerhouse

**Einkorn's Superior Nutrition** (from [einkorn nutritional profile](../../blog/posts/grains-series-part-3.md#einkorn-characteristics)):
- **Higher Protein**: Up to 18% vs 12-14% in modern wheat
- **Lutein**: 3x more than modern wheat (eye health)
- **Essential Fatty Acids**: Better omega-3 profile
- **Minerals**: Higher levels of phosphorus and potassium
- **Antioxidants**: Naturally higher antioxidant content

## Storage

- **Room Temperature**: 3-4 days wrapped in cloth
- **Freezing**: Excellent for freezing, slice first
- **Refrigeration**: Can extend life to 1 week
- **Texture**: Actually improves after 24 hours as flavors meld

## Sourcing Einkorn

**Where to Find Quality Einkorn**:
- Jovial Foods (organic einkorn flour)
- Azure Standard (bulk quantities)
- Local health food stores
- Online heritage grain suppliers
- Some farmers markets

**Storage Tips**: Einkorn flour has shorter shelf life due to higher oil content. Refrigerate or freeze for longer storage.

## Your Ancient Grain Journey

**Ready for More Heritage Grains?**
1. **[Rustic Emmer Bread](rustic-emmer-bread.md)** - Experience the grain that fed ancient Egypt
2. **[Medieval Spelt Sourdough](medieval-spelt-sourdough.md)** - Try the medieval favorite
3. **[Golden Khorasan Artisan](golden-khorasan-artisan.md)** - Explore the "pharaoh's wheat"

**Deepen Your Knowledge**:
- Learn about [ancient wheat family tree](../../blog/posts/grains-series-part-3.md#the-ancient-wheat-family-tree)
- Understand [heritage grain sourcing](../../blog/posts/grains-series-part-3.md#sourcing-and-storage)
- Explore [sustainable agriculture benefits](../../blog/posts/grains-series-part-3.md#seasonal-and-regional-considerations)

**Compare Ancient vs Modern**:
- Return to [Classic White Sourdough](../wheat/classic-white-sourdough.md) to appreciate the differences
- Try [Brown Rice Sourdough](../alternative/brown-rice-sourdough.md) for another ancient grain experience

---

## Recipe Summary

| Aspect | Details |
|--------|---------|
| **Grain Blend** | 60% einkorn, 40% bread flour |
| **Difficulty** | Beginner (gentle techniques required) |
| **Total Time** | 18-20 hours |
| **Active Time** | 1.5 hours |
| **Hydration** | 55% |
| **Yield** | 700g loaf |

---

*"Einkorn connects us to the very beginning of agriculture - every bite carries 10,000 years of human history and the pure, unaltered flavor of our ancestors' daily bread."* — MaK

**Educational Links**: [Ancient and Heritage Grains](../../blog/posts/grains-series-part-3.md) | [Einkorn Characteristics](../../blog/posts/grains-series-part-3.md#einkorn-the-original-wheat) | [Heritage Grain Collection](../index.md)