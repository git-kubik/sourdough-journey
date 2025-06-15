---
title: "Brown Rice Sourdough"
date: "2025-06-15"
author: "MaK"
tags: ["recipe", "rice", "gluten-free", "alternative", "beginner", "inclusive", "sourdough"]
category: "Recipes"
description: "Foundation gluten-free sourdough using brown rice flour with binding support"
---

# Brown Rice Sourdough

*Your gateway to gluten-free sourdough baking*

This recipe introduces the fundamentals of gluten-free sourdough using brown rice flour as the foundation. As detailed in [Part 4: Alternative Grains and Gluten-Free Options](../../blog/posts/grains-series-part-4.md), rice provides an excellent starting point for gluten-free baking with its mild flavor and reliable behavior.

## Why Brown Rice Works

From our [rice in sourdough blog post](../../blog/posts/grains-series-part-4.md#rice-the-global-staple), **brown rice offers**:
- **Nutritional Completeness**: Whole grain with bran and germ intact
- **Mild Flavor**: Won't compete with sourdough tang
- **Reliable Fermentation**: Establishes consistent starter cultures
- **Good Binding**: Natural starches help create structure

## Understanding Gluten-Free Challenges

**No Gluten Network**: Without gluten, we must create structure through:
- **Binding agents**: Xanthan gum provides elasticity
- **Proper hydration**: Different water absorption than wheat
- **Support systems**: Pan baking for better structure
- **Modified techniques**: Different mixing and handling approaches

## Interactive Recipe Calculator

<div class="recipe-calculator">
  <div class="calculator-header">
    <h3 class="calculator-title">🌾 Brown Rice Sourdough Calculator</h3>
    <div class="unit-toggles">
      <div class="unit-toggle">
        <span>Metric</span>
        <label class="toggle-switch">
          <input type="checkbox" id="unit-toggle-rice">
          <span class="toggle-slider"></span>
        </label>
        <span>Imperial</span>
      </div>
      <div class="unit-toggle">
        <span>°C</span>
        <label class="toggle-switch">
          <input type="checkbox" id="temp-toggle-rice">
          <span class="toggle-slider"></span>
        </label>
        <span>°F</span>
      </div>
    </div>
  </div>

  <div class="calculator-controls">
    <div class="control-group">
      <label for="target-weight-rice">Target Final Loaf</label>
      <input type="number" id="target-weight-rice" class="control-input" value="750" min="500" max="1200" step="50">
    </div>
    <div class="control-group">
      <label for="hydration-level-rice">Hydration Level (%)</label>
      <input type="number" id="hydration-level-rice" class="control-input" value="70" min="65" max="80" step="1">
    </div>
  </div>

  <table class="ingredients-table">
    <thead>
      <tr>
        <th>Ingredient</th>
        <th>Amount</th>
        <th>% of Flour Mix</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="ingredient-name">Brown Rice Flour</td>
        <td class="ingredient-amount" id="brown-rice-amount">300g</td>
        <td class="ingredient-percentage">52%</td>
      </tr>
      <tr>
        <td class="ingredient-name">White Rice Flour</td>
        <td class="ingredient-amount" id="white-rice-amount">150g</td>
        <td class="ingredient-percentage">26%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Tapioca Starch</td>
        <td class="ingredient-amount" id="tapioca-amount">75g</td>
        <td class="ingredient-percentage">13%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Potato Starch</td>
        <td class="ingredient-amount" id="potato-amount">50g</td>
        <td class="ingredient-percentage">9%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Xanthan Gum</td>
        <td class="ingredient-amount" id="xanthan-amount">8g</td>
        <td class="ingredient-percentage">1.4%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Water</td>
        <td class="ingredient-amount" id="water-amount-rice">400g</td>
        <td class="ingredient-percentage" id="water-percentage-rice">70%</td>
      </tr>
      <tr>
        <td class="ingredient-name">GF Starter</td>
        <td class="ingredient-amount" id="starter-amount-rice">100g</td>
        <td class="ingredient-percentage">17%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Olive Oil</td>
        <td class="ingredient-amount" id="oil-amount">30g</td>
        <td class="ingredient-percentage">5%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Salt</td>
        <td class="ingredient-amount" id="salt-amount-rice">12g</td>
        <td class="ingredient-percentage">2%</td>
      </tr>
      <tr>
        <td class="ingredient-name">Honey</td>
        <td class="ingredient-amount" id="honey-amount-rice">20g</td>
        <td class="ingredient-percentage">3.5%</td>
      </tr>
      <tr class="total-row">
        <td class="ingredient-name">Total Dough Weight</td>
        <td class="ingredient-amount" id="total-dough-weight-rice">1145g</td>
        <td class="ingredient-percentage">-</td>
      </tr>
    </tbody>
  </table>

  <div class="temperature-display">
    <div class="temp-item">
      <span class="temp-label">Bulk Fermentation:</span>
      <span class="temp-value" id="bulk-temp-rice">75-78°F (24-26°C)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Final Proof:</span>
      <span class="temp-value" id="proof-temp-rice">75-78°F (24-26°C)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Baking (Pan):</span>
      <span class="temp-value" id="bake-temp-rice">375°F (190°C)</span>
    </div>
    <div class="temp-item">
      <span class="temp-label">Internal Target:</span>
      <span class="temp-value" id="internal-temp-rice">205-210°F (96-99°C)</span>
    </div>
  </div>
</div>

<script>
(function() {
  // Get control elements
  const targetWeightInput = document.getElementById('target-weight-rice');
  const hydrationInput = document.getElementById('hydration-level-rice');
  const unitToggle = document.getElementById('unit-toggle-rice');
  const tempToggle = document.getElementById('temp-toggle-rice');
  
  // Get display elements
  const brownRiceEl = document.getElementById('brown-rice-amount');
  const whiteRiceEl = document.getElementById('white-rice-amount');
  const tapiocaEl = document.getElementById('tapioca-amount');
  const potatoEl = document.getElementById('potato-amount');
  const xanthanEl = document.getElementById('xanthan-amount');
  const waterEl = document.getElementById('water-amount-rice');
  const starterEl = document.getElementById('starter-amount-rice');
  const oilEl = document.getElementById('oil-amount');
  const saltEl = document.getElementById('salt-amount-rice');
  const honeyEl = document.getElementById('honey-amount-rice');
  const totalWeightEl = document.getElementById('total-dough-weight-rice');
  const waterPercentageEl = document.getElementById('water-percentage-rice');
  
  // Temperature elements
  const bulkTempEl = document.getElementById('bulk-temp-rice');
  const proofTempEl = document.getElementById('proof-temp-rice');
  const bakeTempEl = document.getElementById('bake-temp-rice');
  const internalTempEl = document.getElementById('internal-temp-rice');

  // Constants for Brown Rice Sourdough
  const BROWN_RICE_RATIO = 0.522; // 52.2% of flour mix
  const WHITE_RICE_RATIO = 0.261; // 26.1% of flour mix
  const TAPIOCA_RATIO = 0.130; // 13.0% of flour mix
  const POTATO_RATIO = 0.087; // 8.7% of flour mix
  const XANTHAN_PERCENTAGE = 0.014; // 1.4% of flour mix
  const STARTER_PERCENTAGE = 0.174; // 17.4% of flour mix
  const OIL_PERCENTAGE = 0.052; // 5.2% of flour mix
  const SALT_PERCENTAGE = 0.021; // 2.1% of flour mix
  const HONEY_PERCENTAGE = 0.035; // 3.5% of flour mix

  function gramsToOunces(grams) {
    return (grams * 0.035274).toFixed(1);
  }

  function gramsToTablespoons(grams) {
    // Oil: approximately 14g per tablespoon
    // Honey: approximately 21g per tablespoon
    return (grams / 14).toFixed(1);
  }

  function gramsToTeaspoons(grams) {
    // Xanthan gum: approximately 2.3g per teaspoon
    return (grams / 2.3).toFixed(1);
  }

  function formatWeight(grams, isImperial) {
    if (isImperial) {
      const ounces = gramsToOunces(grams);
      return `${ounces} oz`;
    }
    return `${Math.round(grams)}g`;
  }

  function formatXanthan(grams, isImperial) {
    if (isImperial) {
      const tsp = gramsToTeaspoons(grams);
      return `${tsp} tsp`;
    }
    return `${Math.round(grams)}g`;
  }

  function formatLiquid(grams, isImperial) {
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
    
    // Calculate flour mix from target weight
    // This is more complex due to multiple components
    const totalFlourMix = targetWeight / (1 + hydrationPercent + STARTER_PERCENTAGE + OIL_PERCENTAGE + SALT_PERCENTAGE + HONEY_PERCENTAGE);
    
    const brownRice = Math.round(totalFlourMix * BROWN_RICE_RATIO);
    const whiteRice = Math.round(totalFlourMix * WHITE_RICE_RATIO);
    const tapioca = Math.round(totalFlourMix * TAPIOCA_RATIO);
    const potato = Math.round(totalFlourMix * POTATO_RATIO);
    const xanthan = Math.round(totalFlourMix * XANTHAN_PERCENTAGE);
    const actualFlourMix = brownRice + whiteRice + tapioca + potato + xanthan;
    
    const water = Math.round(actualFlourMix * hydrationPercent);
    const starter = Math.round(actualFlourMix * STARTER_PERCENTAGE);
    const oil = Math.round(actualFlourMix * OIL_PERCENTAGE);
    const salt = Math.round(actualFlourMix * SALT_PERCENTAGE);
    const honey = Math.round(actualFlourMix * HONEY_PERCENTAGE);
    const totalDough = actualFlourMix + water + starter + oil + salt + honey;
    
    // Update ingredient displays
    brownRiceEl.textContent = formatWeight(brownRice, isImperial);
    whiteRiceEl.textContent = formatWeight(whiteRice, isImperial);
    tapiocaEl.textContent = formatWeight(tapioca, isImperial);
    potatoEl.textContent = formatWeight(potato, isImperial);
    xanthanEl.textContent = formatXanthan(xanthan, isImperial);
    waterEl.textContent = formatWeight(water, isImperial);
    starterEl.textContent = formatWeight(starter, isImperial);
    oilEl.textContent = formatLiquid(oil, isImperial);
    saltEl.textContent = formatWeight(salt, isImperial);
    honeyEl.textContent = formatLiquid(honey, isImperial);
    totalWeightEl.textContent = formatWeight(totalDough, isImperial);
    waterPercentageEl.textContent = hydrationInput.value + '%';
    
    // Update temperature displays
    bulkTempEl.textContent = formatTempRange(75, 78, isFahrenheit);
    proofTempEl.textContent = formatTempRange(75, 78, isFahrenheit);
    bakeTempEl.textContent = formatTemperature(375, isFahrenheit);
    internalTempEl.textContent = formatTempRange(205, 210, isFahrenheit);
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

Gluten-free timing is different! Plan your brown rice sourdough with this calendar that accounts for extended fermentation times and critical cooling periods.

<div id="rice-sourdough-calendar"></div>

<script>
// Initialize the calendar for this recipe
document.addEventListener('DOMContentLoaded', function() {
    initRecipeCalendar('rice-sourdough-calendar', 'brown-rice-sourdough', 'Brown Rice Sourdough', '/recipes/alternative/brown-rice-sourdough');
});
</script>

## Equipment Considerations

**Dedicated Gluten-Free**: To prevent cross-contamination for celiac concerns:
- Separate mixing bowls and utensils
- Dedicated proofing baskets
- Clean work surfaces
- Separate starter containers

**Essential Tools**:
- Kitchen scale (accuracy crucial for GF)
- Stand mixer (helps with binding)
- 9" loaf pan (structure support)
- Bench scraper
- Digital thermometer

## Timeline Overview

**Extended Process**: Gluten-free sourdough often needs longer fermentation for flavor development.

### Detailed Schedule

| Time | Activity | Notes |
|------|----------|-------|
| 8:00 AM | Check GF starter | Should be very active |
| 8:30 AM | Combine dry ingredients | Thorough blending crucial |
| 9:00 AM | Add wet ingredients | Mix until smooth |
| 9:30 AM | Bulk fermentation | Longer than wheat |
| 12:30 PM | First gentle mix | No folding like wheat |
| 3:30 PM | Shape into pan | Wet hands essential |
| 6:30 PM | Bake | After 3-hour proof |
| 8:00 PM | Cool completely | Critical for GF texture |

## Step-by-Step Method

### Step 1: Gluten-Free Starter Preparation

**Rice Starter Characteristics** (from [rice starter section](../../blog/posts/grains-series-part-4.md#rice-sourdough-techniques)):
- Often takes 7-14 days to establish
- May appear less active visually than wheat
- Develops different aromatic profiles
- Should double in size within 8-12 hours when active

### Step 2: Dry Ingredient Blend (8:30 AM)

**Critical Step**: Proper blending of flours and xanthan gum prevents lumps.

1. **Sift together** in large bowl:
   - 300g brown rice flour
   - 150g white rice flour
   - 75g tapioca starch
   - 50g potato starch
   - 8g xanthan gum
   - 12g salt

2. **Whisk thoroughly** for 2 minutes to distribute xanthan gum evenly

**Why This Blend?** (Reference: [gluten-free flour blending](../../blog/posts/grains-series-part-4.md#gluten-free-flour-blending))
- **Brown rice (60%)**: Nutritional foundation and flavor
- **White rice (30%)**: Lightens texture
- **Starches (25%)**: Binding and texture improvement
- **Xanthan gum**: Replaces gluten's elasticity

### Step 3: Wet Ingredient Preparation (9:00 AM)

1. **Combine in separate bowl**:
   - 400g room temperature water
   - 100g active gluten-free starter
   - 30g olive oil
   - 20g honey

2. **Whisk until smooth** - honey should be fully dissolved

### Step 4: Mixing (9:00 AM)

**Different from Wheat**: No autolyse needed, thorough mixing essential.

1. **Pour wet ingredients** into dry ingredient bowl
2. **Mix vigorously** with wooden spoon for 2-3 minutes
3. **Stand mixer option**: Beat on medium for 3-4 minutes
4. **Target consistency**: Thick batter, not traditional dough

**What You'll Notice**: The mixture is more like a thick batter than traditional dough - this is normal for gluten-free.

### Step 5: Bulk Fermentation (9:30 AM - 3:30 PM)

**Extended Timing**: Gluten-free often needs longer for flavor development.

**Modified Process**:
- **No traditional folds** - the batter won't hold shape
- **Gentle stirring** every 3 hours to redistribute
- **Cover tightly** to prevent surface drying
- **Watch for bubbling** activity throughout

**Fermentation Progression**:
- **Hour 1**: Initial bubbling activity
- **Hour 3**: More active, increased volume
- **Hour 6**: 50-75% size increase, very bubbly

**Readiness Signs**:
- Significant increase in volume (50-75%)
- Very active bubbling throughout
- Light, airy texture
- Slightly sweet, tangy aroma

### Step 6: Final Preparation and Shaping (3:30 PM)

**Pan Preparation**: Grease 9" loaf pan thoroughly or line with parchment.

1. **Gentle final mix** to redistribute any settled ingredients
2. **Pour into prepared pan** - use wet spatula to smooth top
3. **Surface smoothing** - wet hands to level surface
4. **Cover for proofing** - damp towel or plastic wrap

### Step 7: Final Proof (3:30 PM - 6:30 PM)

**3-Hour Proof**: Gluten-free needs adequate time for final rise.

**Visual Cues**:
- Rises to about 1 inch above pan rim
- Surface becomes more domed
- Slight bounce when pan is gently tapped
- Bubbles visible just under surface

**Temperature Considerations**: 75-78°F ideal for consistent timing.

### Step 8: Baking (6:30 PM)

**Lower Temperature**: Gluten-free benefits from gentler, longer baking.

**Baking Process**:
1. **Preheat**: 375°F (190°C)
2. **Optional scoring**: Single shallow slash down center
3. **Steam**: Place pan of hot water on bottom rack for first 20 minutes
4. **Bake**: 50-60 minutes total
5. **Target**: 205-210°F internal temperature
6. **Visual cues**: Golden brown, sounds hollow when tapped

**Steam Benefits**: Helps create better crust and improves oven spring in gluten-free breads.

### Step 9: Critical Cooling (8:00 PM)

**Extended Cooling Essential**: Cool in pan 15 minutes, then turn out onto wire rack.

**Why Critical for Gluten-Free**:
- Structure continues to set during cooling
- Cutting too soon results in gummy texture
- Cool completely (3-4 hours minimum) before slicing

## Troubleshooting

### Gummy, Dense Texture
- **Cause**: Under-baked or cut too soon
- **Solution**: Bake to full temperature; cool completely
- **Reference**: [Gluten-free baking techniques](../../blog/posts/grains-series-part-4.md#baking-techniques-for-gluten-free-sourdough)

### Crumbly, Falls Apart
- **Cause**: Insufficient binding or over-baked
- **Solution**: Check xanthan gum measurement; reduce baking time
- **Reference**: [Hydrocolloids and binding](../../blog/posts/grains-series-part-4.md#hydrocolloids-and-binding-agents)

### Poor Rise
- **Cause**: Weak starter or insufficient fermentation
- **Solution**: Ensure very active starter; extend fermentation time

### Overly Sweet Taste
- **Cause**: Over-fermentation or too much honey
- **Solution**: Reduce honey; shorter fermentation timing

## Flavor Enhancement

**Rice Flavor Profile**:
- **Base**: Mild, slightly nutty
- **Fermentation adds**: Tangy sourdough character
- **Texture**: Tender, fine crumb

**Enhancement Options**:
- **Herb addition**: 2 tbsp dried herbs (rosemary, thyme)
- **Seed topping**: Sesame or poppy seeds on surface
- **Garlic option**: 2 cloves roasted garlic, mashed
- **Sweet version**: Add 2 tsp vanilla, increase honey

## Nutritional Benefits

**Brown Rice Advantages** (from [rice nutrition](../../blog/posts/grains-series-part-4.md#rice-the-global-staple)):
- **Complete nutrition**: Bran and germ included
- **B vitamins**: Thiamine, niacin, B6
- **Minerals**: Manganese, selenium, magnesium
- **Fiber**: Supports digestive health
- **Gluten-free**: Safe for celiac disease

## Storage

- **Room Temperature**: 3-4 days in paper bag
- **Refrigeration**: Extends to 1 week
- **Freezing**: Slice and freeze up to 3 months
- **Refresh**: Light toasting restores texture

## Building Gluten-Free Skills

**Next Steps in GF Baking**:
1. **[Multi-Grain Gluten-Free Blend](multi-grain-gf-blend.md)** - More complex flavors
2. **[Protein-Rich Quinoa Bread](protein-rich-quinoa-bread.md)** - Nutritional powerhouse
3. **[Cornmeal Country Bread](cornmeal-country-bread.md)** - Traditional American flavors

**Understanding the Science**:
- Learn about [rice flour characteristics](../../blog/posts/grains-series-part-4.md#rice-flour-characteristics)
- Explore [gluten-free binding systems](../../blog/posts/grains-series-part-4.md#alternative-structure-systems)
- Study [fermentation without gluten](../../blog/posts/grains-series-part-4.md#fermentation-techniques-for-gluten-free-grains)

**Cross-Contamination Prevention**:
- Review [celiac considerations](../../blog/posts/grains-series-part-4.md#celiac-disease)
- Understand [dedicated equipment needs](../../blog/posts/grains-series-part-4.md#special-dietary-considerations)

## Variations

### **Higher Protein Version**
- Add 50g quinoa flour (reduce rice flour)
- Include 30g ground almonds
- Increases nutritional value

### **Lighter Texture**
- Increase white rice flour to 200g
- Reduce brown rice to 250g
- Add 1 egg for binding

### **Seeded Version**
- Add 40g mixed seeds (sunflower, pumpkin)
- 20g ground flaxseed
- Soak seeds 30 minutes before adding

---

## Recipe Summary

| Aspect | Details |
|--------|---------|
| **Primary Grain** | Brown rice flour (60% of flour blend) |
| **Difficulty** | Beginner (different techniques) |
| **Total Time** | 26-28 hours |
| **Active Time** | 2 hours |
| **Hydration** | ~70% (higher for GF) |
| **Yield** | 750g loaf |

---

*"Brown rice sourdough proves that gluten-free baking isn't about limitation—it's about discovering new possibilities and creating breads that nourish everyone at the table."* — MaK

**Educational Links**: [Alternative Grains and Gluten-Free Options](../../blog/posts/grains-series-part-4.md) | [Rice Sourdough Techniques](../../blog/posts/grains-series-part-4.md#rice-the-global-staple) | [Gluten-Free Collection](../index.md)