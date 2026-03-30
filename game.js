// game.js updates to balance and UI redesign

// Function to scale enemy HP by floor
function scaleEnemyHP(floor) {
    return floor * 100; // Example scaling
}

// Function to reduce player skill damage by 20%
function reducePlayerSkillDamage(originalDamage) {
    return originalDamage * 0.8; // Reduce by 20%
}

// Function to calculate enemy DEF scaling
function calculateEnemyDEF(floor) {
    return 10 + (floor * 5);
}

// Improved enemy AI to heal at 50% HP threshold
function enemyAI(currentHP, maxHP) {
    if (currentHP <= (maxHP * 0.5)) {
        healEnemy(); // Function to heal the enemy
    }
}

// Redesign battle UI to Pokemon-style layout
function redesignBattleUI() {
    // Layout logic for Pokemon-style
    setupLayout({
        enemyPosition: 'top',
        battleLogPosition: 'center',
        playerPosition: 'bottom',
        actionButtonsPosition: 'right'
    });
}

// Example function calls for testing
console.log(scaleEnemyHP(1));
console.log(reducePlayerSkillDamage(50));
console.log(calculateEnemyDEF(1));

// Initialize the battle UI layout
redesignBattleUI();

